<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tambah kolom 'price' tunggal jika belum ada
        if (!Schema::hasColumn('products', 'price')) {
            Schema::table('products', function (Blueprint $table) {
                $table->decimal('price', 12, 0)->nullable()->default(0)->after('requires_temperature');
            });
        }

        // 2. Migrasikan data tarif dari kolom lama ke kolom 'price' baru
        $hasOldColumns = Schema::hasColumn('products', 'price_global') 
            || Schema::hasColumn('products', 'price_20ft') 
            || Schema::hasColumn('products', 'price_40ft') 
            || Schema::hasColumn('products', 'price_45ft');

        if ($hasOldColumns) {
            DB::statement("
                UPDATE `products` 
                SET `price` = COALESCE(
                    NULLIF(`price_global`, 0),
                    NULLIF(`price_20ft`, 0),
                    NULLIF(`price_40ft`, 0),
                    NULLIF(`price_45ft`, 0),
                    `price`,
                    0
                )
            ");
        }

        // 3. Hapus kolom-kolom lama
        Schema::table('products', function (Blueprint $table) {
            $colsToDrop = [];
            foreach (['price_20ft', 'price_40ft', 'price_45ft', 'price_global'] as $col) {
                if (Schema::hasColumn('products', $col)) {
                    $colsToDrop[] = $col;
                }
            }
            if (!empty($colsToDrop)) {
                $table->dropColumn($colsToDrop);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'price_20ft')) {
                $table->decimal('price_20ft', 12, 0)->nullable()->after('requires_temperature');
            }
            if (!Schema::hasColumn('products', 'price_40ft')) {
                $table->decimal('price_40ft', 12, 0)->nullable()->after('price_20ft');
            }
            if (!Schema::hasColumn('products', 'price_45ft')) {
                $table->decimal('price_45ft', 12, 0)->nullable()->after('price_40ft');
            }
            if (!Schema::hasColumn('products', 'price_global')) {
                $table->decimal('price_global', 12, 0)->nullable()->after('price_45ft');
            }
        });

        if (Schema::hasColumn('products', 'price')) {
            DB::statement("
                UPDATE `products`
                SET `price_global` = `price`,
                    `price_20ft`   = `price`,
                    `price_40ft`   = `price`,
                    `price_45ft`   = `price`
            ");

            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('price');
            });
        }
    }
};
