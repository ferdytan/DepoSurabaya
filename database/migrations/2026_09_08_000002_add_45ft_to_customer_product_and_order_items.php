<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customer_product', function (Blueprint $table) {
            if (!Schema::hasColumn('customer_product', 'custom_price_45ft')) {
                $table->decimal('custom_price_45ft', 12, 0)->nullable()->after('custom_price_40ft');
            }
        });

        // Ubah enum price_type pada order_items menjadi VARCHAR(50) agar fleksibel
        if (Schema::hasTable('order_items')) {
            try {
                DB::statement("ALTER TABLE `order_items` MODIFY COLUMN `price_type` VARCHAR(50) NULL");
            } catch (\Throwable $e) {
                // Fallback jika database bukan MySQL atau kolom sudah sesuai
            }
        }
    }

    public function down(): void
    {
        Schema::table('customer_product', function (Blueprint $table) {
            if (Schema::hasColumn('customer_product', 'custom_price_45ft')) {
                $table->dropColumn('custom_price_45ft');
            }
        });

        if (Schema::hasTable('order_items')) {
            try {
                DB::statement("ALTER TABLE `order_items` MODIFY COLUMN `price_type` ENUM('20ft','40ft','global') NULL");
            } catch (\Throwable $e) {
            }
        }
    }
};
