<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'is_excluded_from_report')) {
                $table->boolean('is_excluded_from_report')->default(false)->after('no_aju')->index();
            }
        });

        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'is_excluded_from_report')) {
                $table->boolean('is_excluded_from_report')->default(false)->after('price_value')->index();
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'is_excluded_from_report')) {
                $table->dropColumn('is_excluded_from_report');
            }
        });

        Schema::table('order_items', function (Blueprint $table) {
            if (Schema::hasColumn('order_items', 'is_excluded_from_report')) {
                $table->dropColumn('is_excluded_from_report');
            }
        });
    }
};
