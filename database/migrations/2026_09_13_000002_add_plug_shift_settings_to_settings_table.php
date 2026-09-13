<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('settings')) {
            DB::table('settings')->insertOrIgnore([
                [
                    'key' => 'shift_duration_hours',
                    'value' => '8',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'key' => 'shift_compensation_minutes',
                    'value' => '45',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('settings')) {
            DB::table('settings')->whereIn('key', [
                'shift_duration_hours',
                'shift_compensation_minutes',
            ])->delete();
        }
    }
};
