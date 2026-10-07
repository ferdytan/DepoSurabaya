<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'service_type',
        'price_20ft',
        'price_40ft',
        'price_45ft',
        'price_global',
        'tariff_20ft',
        'tariff_40ft',
        'description',
        'requires_temperature'
    ];

    protected $casts = [
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
                        'custom_price_20ft',
                        'custom_price_40ft',
                        'custom_price_45ft',
                        'custom_global_price'
                    ])
                    ->withTimestamps();
    }
}