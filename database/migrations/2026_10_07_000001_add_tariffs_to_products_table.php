<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $columnsToDrop = [];
            foreach (['price_20ft', 'price_40ft', 'price_45ft', 'price_global'] as $col) {
                if (Schema::hasColumn('products', $col)) {
                    $columnsToDrop[] = $col;
                }
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
