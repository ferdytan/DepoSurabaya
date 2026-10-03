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
        Schema::create('reefer_temperature_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_item_id')->index();
            $table->dateTime('logged_at')->index();
            $table->decimal('temperature', 5, 2);
            $table->decimal('set_point', 5, 2)->nullable();
            $table->decimal('supply_air_temp', 5, 2)->nullable();
            $table->decimal('return_air_temp', 5, 2)->nullable();
            $table->unsignedInteger('shift_sequence')->nullable()->comment('Indeks siklus shift ke-N');
            $table->unsignedBigInteger('recorded_by_user_id')->nullable()->index();
            $table->string('remarks')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('order_item_id')
                ->references('id')
                ->on('order_items')
                ->onDelete('cascade');

            $table->unique(['order_item_id', 'logged_at'], 'unique_order_item_logged_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reefer_temperature_logs');
    }
};
