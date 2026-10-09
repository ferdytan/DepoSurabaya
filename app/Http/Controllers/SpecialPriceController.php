<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpecialPriceController extends Controller
{
    /**
     * Display special prices management page.
     */
    public function index(Request $request)
    {
        $selectedCustomerId = $request->query('customer_id');

        // Ambil semua customer untuk dropdown / selector
        $allCustomers = Customer::select('id', 'name', 'city', 'phone')
            ->orderBy('name')
            ->get();

        // Customer yang terpilih
        $selectedCustomer = null;
        $customerProducts = [];

        if ($selectedCustomerId) {
            $selectedCustomer = Customer::find($selectedCustomerId);
        }

        // Jika tidak ada customer_id di query, pilih customer pertama jika tersedia
        if (!$selectedCustomer && $allCustomers->isNotEmpty()) {
            $selectedCustomer = $allCustomers->first();
            $selectedCustomerId = $selectedCustomer->id;
        }

        if ($selectedCustomer) {
            // Ambil semua produk master
            $masterProducts = Product::select('id', 'service_type', 'description', 'requires_temperature', 'price')
                ->orderBy('service_type')
                ->get();

            // Ambil harga khusus customer ini
            $customMap = $selectedCustomer->products()
                ->withPivot(['id as pivot_id', 'price', 'updated_at'])
                ->get()
                ->keyBy('id');

            $customerProducts = $masterProducts->map(function ($p) use ($customMap) {
                $custom = $customMap->get($p->id);
                $hasCustom = $custom !== null;
                $customPriceVal = null;
                if ($hasCustom && $custom->pivot) {
                    $customPriceVal = $custom->pivot->price 
                        ?? $custom->pivot->custom_global_price 
                        ?? $custom->pivot->custom_price_20ft 
                        ?? null;
                }

                $masterPrice = $p->price ?? 0;

                return [
                    'id' => $p->id,
                    'service_type' => $p->service_type,
                    'description' => $p->description,
                    'requires_temperature' => (bool) $p->requires_temperature,
                    'master_price' => $masterPrice,
                    'master_price_20ft' => $masterPrice,
                    'master_price_40ft' => $masterPrice,
                    'master_price_45ft' => $masterPrice,
                    'master_price_global' => $masterPrice,
                    'has_custom_price' => $hasCustom && $customPriceVal !== null && (float)$customPriceVal > 0,
                    'custom_price' => $hasCustom ? $customPriceVal : null,
                    'custom_price_20ft' => $hasCustom ? $customPriceVal : null,
                    'custom_price_40ft' => $hasCustom ? $customPriceVal : null,
                    'custom_price_45ft' => $hasCustom ? $customPriceVal : null,
                    'custom_global_price' => $hasCustom ? $customPriceVal : null,
                    'custom_updated_at' => $hasCustom ? $custom->pivot->updated_at?->format('d M Y H:i') : null,
                ];
            });
        }

        // Summary: customer-customer yang memiliki harga khusus
        $customersWithSpecialPrices = Customer::has('products')
            ->withCount('products')
            ->select('id', 'name', 'city')
            ->orderBy('name')
            ->get();

        return Inertia::render('special-prices/index', [
            'all_customers' => $allCustomers,
            'selected_customer' => $selectedCustomer,
            'products' => $customerProducts,
            'customers_with_special_prices' => $customersWithSpecialPrices,
        ]);
    }

    /**
     * Store or update special prices for a product belonging to a customer.
     */
    public function store(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'price' => 'nullable|numeric|min:0',
            'price_20ft' => 'nullable|numeric|min:0',
            'price_40ft' => 'nullable|numeric|min:0',
            'price_45ft' => 'nullable|numeric|min:0',
            'price_global' => 'nullable|numeric|min:0',
        ]);

        $productId = (int) $validated['product_id'];

        // Ambil harga dari 'price' atau fallback
        $customPrice = $validated['price'] 
            ?? $validated['price_global'] 
            ?? $validated['price_20ft'] 
            ?? $validated['price_40ft'] 
            ?? $validated['price_45ft'] 
            ?? null;

        $hasPrice = ($customPrice !== null && $customPrice !== '' && (float)$customPrice > 0);

        if (!$hasPrice) {
            // Jika harga dikosongkan, hapus harga khusus agar fallback ke master
            $customer->products()->detach($productId);
            return back()->with('success', 'Harga khusus telah dihapus. Layanan kembali menggunakan tarif master.');
        }

        $customer->products()->syncWithoutDetaching([
            $productId => [
                'price' => $customPrice,
            ]
        ]);

        return back()->with('success', 'Harga khusus berhasil disimpan.');
    }

    /**
     * Remove special price for a product, reverting to master prices.
     */
    public function destroy(Customer $customer, Product $product)
    {
        $customer->products()->detach($product->id);

        return back()->with('success', "Harga khusus untuk '{$product->service_type}' telah dihapus. Layanan kini menggunakan tarif master.");
    }
}
