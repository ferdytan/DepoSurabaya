<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KarantinaBillingStatementTest extends TestCase
{
    use RefreshDatabase;

    public function test_karantina_print_data_respects_free_storage_time(): void
    {
        // 1. Setup settings
        Setting::set('storage_free_hours', 72);
        Setting::set('storage_fumigasi_free_hours', 120);

        $user = User::first() ?? User::factory()->create();
        $customer = Customer::first() ?? Customer::create(['name' => 'Test Customer']);

        $mainProduct = Product::create([
            'service_type' => 'Pemeriksaan Karantina',
        ]);

        $storageProduct = Product::create([
            'service_type' => 'Storage',
        ]);

        $order = Order::create([
            'order_id' => 'ORD-TEST-001',
            'customer_id' => $customer->id,
            'fumigasi' => 'Test Fumigator',
        ]);

        // Kasus 1: Kontainer dalam batas free time (48 jam <= 120 jam free fumigasi)
        // Storage seharusnya 0 hari (bebas biaya), sehingga hanya mainProduct yang ditagihkan.
        $itemFree = OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $mainProduct->id,
            'container_number' => 'FREE1234567',
            'price_type' => '20ft',
            'price_value' => 1000000,
            'entry_date' => '2026-10-01 10:00:00',
            'exit_date' => '2026-10-03 10:00:00', // 48 jam
        ]);
        $itemFree->additionalProducts()->attach($storageProduct->id, ['price_value' => 50000]);

        // Kasus 2: Kontainer melebihi free time 1 hari (144 jam - 120 jam = 24 jam = 1 hari storage)
        $itemExceed = OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $mainProduct->id,
            'container_number' => 'OVER1234567',
            'price_type' => '20ft',
            'price_value' => 1000000,
            'entry_date' => '2026-10-01 10:00:00',
            'exit_date' => '2026-10-07 10:00:00', // 144 jam = 6 hari -> excess 1 hari
        ]);
        $itemExceed->additionalProducts()->attach($storageProduct->id, ['price_value' => 50000]);

        $controller = app(\App\Http\Controllers\OrderController::class);

        // Uji cetak untuk kontainer free
        $reqFree = new \Illuminate\Http\Request(['search' => 'FREE1234567']);
        $resFree = $controller->karantina_print_data($reqFree);
        $dataFree = $resFree->getData()->data[0];

        // Harus Rp 1.000.000 (Storage 0 x Rp 50.000 = Rp 0)
        $this->assertEquals(1000000, $dataFree->price, 'Kontainer dalam batas free time tidak boleh ditagihkan storage.');
        $this->assertEquals(110000, $dataFree->ppn);
        $this->assertEquals(1110000, $dataFree->total);

        // Uji cetak untuk kontainer exceed 1 hari
        $reqExceed = new \Illuminate\Http\Request(['search' => 'OVER1234567']);
        $resExceed = $controller->karantina_print_data($reqExceed);
        $dataExceed = $resExceed->getData()->data[0];

        // Harus Rp 1.050.000 (Main 1.000.000 + Storage 1 hari x 50.000)
        $this->assertEquals(1050000, $dataExceed->price, 'Kontainer yang melebihi free time wajib ditagihkan kelebihan harinya.');
        $this->assertEquals(115500, $dataExceed->ppn);
        $this->assertEquals(1165500, $dataExceed->total);

        // Clean up test items
        $itemFree->additionalProducts()->detach();
        $itemFree->forceDelete();
        $itemExceed->additionalProducts()->detach();
        $itemExceed->forceDelete();
        $order->forceDelete();
        $mainProduct->forceDelete();
        $storageProduct->forceDelete();
    }
}
