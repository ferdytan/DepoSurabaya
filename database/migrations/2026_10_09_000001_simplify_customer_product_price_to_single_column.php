<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('customer_product')) {
            // Kosongkan tabel customer_product sesuai instruksi user (mulai dari 0)
            DB::table('customer_product')->truncate();

            Schema::table('customer_product', function (Blueprint $table) {
                // Tambahkan kolom single price jika belum ada
                if (!Schema::hasColumn('customer_product', 'price')) {
                    $table->decimal('price', 15, 2)->nullable()->after('product_id');
                }

                // Hapus kolom multi-ukuran dan global yang lama
                $columnsToDrop = [];
                foreach (['custom_price_20ft', 'custom_price_40ft', 'custom_price_45ft', 'custom_global_price'] as $col) {
                    if (Schema::hasColumn('customer_product', $col)) {
                        $columnsToDrop[] = $col;
                    }
                }

                if (!empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('customer_product')) {
            Schema::table('customer_product', function (Blueprint $table) {
                if (Schema::hasColumn('customer_product', 'price')) {
                    $table->dropColumn('price');
                }

                if (!Schema::hasColumn('customer_product', 'custom_price_20ft')) {
                    $table->decimal('custom_price_20ft', 12, 0)->nullable();
                }
                if (!Schema::hasColumn('customer_product', 'custom_price_40ft')) {
                    $table->decimal('custom_price_40ft', 12, 0)->nullable();
                }
                if (!Schema::hasColumn('customer_product', 'custom_price_45ft')) {
                    $table->decimal('custom_price_45ft', 12, 0)->nullable();
                }
                if (!Schema::hasColumn('customer_product', 'custom_global_price')) {
                    $table->decimal('custom_global_price', 12, 0)->nullable();
                }
            });
        }
    }
};
