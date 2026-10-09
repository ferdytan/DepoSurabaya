<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CustomerProduct extends Pivot
{
    protected $table = 'customer_product';

    protected static ?bool $hasPriceColumn = null;

    /**
     * Pastikan kolom price ada di database atau coba tambahkan secara otomatis.
     */
    public static function hasPriceColumn(): bool
    {
        if (static::$hasPriceColumn !== null) {
            return static::$hasPriceColumn;
        }

        try {
            if (\Illuminate\Support\Facades\Schema::hasColumn('customer_product', 'price')) {
                return static::$hasPriceColumn = true;
            }

            \Illuminate\Support\Facades\Schema::table('customer_product', function (\Illuminate\Database\Schema\Blueprint $table) {
                if (!\Illuminate\Support\Facades\Schema::hasColumn('customer_product', 'price')) {
                    $table->decimal('price', 15, 2)->nullable()->after('product_id');
                }
            });

            return static::$hasPriceColumn = \Illuminate\Support\Facades\Schema::hasColumn('customer_product', 'price');
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Could not auto-add 'price' to customer_product: " . $e->getMessage());
            return static::$hasPriceColumn = false;
        }
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if (array_key_exists('price', $model->attributes)) {
                if (!static::hasPriceColumn()) {
                    unset($model->attributes['price']);
                }
            }
        });
    }

    protected $fillable = [
        'customer_id',
        'product_id',
        'price',
    ];

    protected $casts = [
        'price' => 'float',
    ];

    // Accessor kompatibilitas ke kode lama
    public function getCustomPriceAttribute()
    {
        return $this->price;
    }

    public function getCustomGlobalPriceAttribute()
    {
        return $this->price;
    }

    public function getCustomPrice20ftAttribute()
    {
        return $this->price;
    }

    public function getCustomPrice40ftAttribute()
    {
        return $this->price;
    }

    public function getCustomPrice45ftAttribute()
    {
        return $this->price;
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}