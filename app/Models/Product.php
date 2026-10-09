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