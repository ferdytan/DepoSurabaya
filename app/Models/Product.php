<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected static ?bool $hasPriceColumn = null;

    /**
     * Pastikan kolom price ada di tabel products atau coba tambahkan secara otomatis.
     */
    public static function hasPriceColumn(): bool
    {
        if (static::$hasPriceColumn !== null) {
            return static::$hasPriceColumn;
        }

        try {
            if (\Illuminate\Support\Facades\Schema::hasColumn('products', 'price')) {
                return static::$hasPriceColumn = true;
            }

            \Illuminate\Support\Facades\Schema::table('products', function (\Illuminate\Database\Schema\Blueprint $table) {
                if (!\Illuminate\Support\Facades\Schema::hasColumn('products', 'price')) {
                    $table->decimal('price', 12, 0)->nullable()->default(0)->after('requires_temperature');
                }
            });

            return static::$hasPriceColumn = \Illuminate\Support\Facades\Schema::hasColumn('products', 'price');
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Could not auto-add 'price' to products: " . $e->getMessage());
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
        'service_type',
        'price',
        'price_20ft',
        'price_40ft',
        'price_45ft',
        'price_global',
        'description',
        'requires_temperature'
    ];

    protected $casts = [
        'price' => 'float',
        'price_20ft' => 'float',
        'price_40ft' => 'float',
        'price_45ft' => 'float',
        'price_global' => 'float',
        'requires_temperature' => 'integer',
    ];

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'customer_product')
                    ->withPivot([
                        'price',
                    ])
                    ->withTimestamps();
    }
}