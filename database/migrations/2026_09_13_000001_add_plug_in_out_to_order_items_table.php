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
            $table->dateTime('start_plug_in')->nullable()->after('exit_date');
            $table->dateTime('plug_out')->nullable()->after('start_plug_in');
            $table->integer('plug_duration_minutes')->nullable()->after('plug_out');
            $table->integer('total_shifts')->nullable()->default(0)->after('plug_duration_minutes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn([
                'start_plug_in',
                'plug_out',
                'plug_duration_minutes',
                'total_shifts',
            ]);
        });
    }
};
