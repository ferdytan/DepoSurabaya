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
        Schema::table('order_items', function (Blueprint $table) {
            $table->string('shift_calculation_mode', 50)->nullable()->default('log_windowing')->after('total_shifts');
            $table->json('shift_details')->nullable()->after('shift_calculation_mode');
            $table->dateTime('last_calculated_at')->nullable()->after('shift_details');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn([
                'shift_calculation_mode',
                'shift_details',
                'last_calculated_at',
            ]);
        });
    }
};
