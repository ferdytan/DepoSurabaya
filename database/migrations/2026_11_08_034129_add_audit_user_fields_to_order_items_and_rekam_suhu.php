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
            if (!Schema::hasColumn('order_items', 'entry_by_user_id')) {
                $table->unsignedBigInteger('entry_by_user_id')->nullable()->after('entry_date');
                $table->foreign('entry_by_user_id')->references('id')->on('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('order_items', 'entry_recorded_at')) {
                $table->dateTime('entry_recorded_at')->nullable()->after('entry_by_user_id');
            }
            if (!Schema::hasColumn('order_items', 'exit_by_user_id')) {
                $table->unsignedBigInteger('exit_by_user_id')->nullable()->after('exit_date');
                $table->foreign('exit_by_user_id')->references('id')->on('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('order_items', 'exit_recorded_at')) {
                $table->dateTime('exit_recorded_at')->nullable()->after('exit_by_user_id');
            }
            if (!Schema::hasColumn('order_items', 'temperature_by_user_id')) {
                $table->unsignedBigInteger('temperature_by_user_id')->nullable()->after('total_shifts');
                $table->foreign('temperature_by_user_id')->references('id')->on('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('order_items', 'temperature_recorded_at')) {
                $table->dateTime('temperature_recorded_at')->nullable()->after('temperature_by_user_id');
            }
        });

        Schema::table('order_item_rekam_suhus', function (Blueprint $table) {
            if (!Schema::hasColumn('order_item_rekam_suhus', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('order_item_id');
                $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_item_rekam_suhus', function (Blueprint $table) {
            if (Schema::hasColumn('order_item_rekam_suhus', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
        });

        Schema::table('order_items', function (Blueprint $table) {
            foreach (['entry_by_user_id', 'exit_by_user_id', 'temperature_by_user_id'] as $col) {
                if (Schema::hasColumn('order_items', $col)) {
                    $table->dropForeign([$col]);
                }
            }
            $columns = [
                'entry_by_user_id',
                'entry_recorded_at',
                'exit_by_user_id',
                'exit_recorded_at',
                'temperature_by_user_id',
                'temperature_recorded_at',
            ];
            $existing = array_filter($columns, fn($c) => Schema::hasColumn('order_items', $c));
            if (!empty($existing)) {
                $table->dropColumn($existing);
            }
        });
    }
};
