<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CustomerProduct extends Pivot
{
    protected $table = 'customer_product';

    protected $fillable = [
        'customer_id',
        'product_id',
        'custom_price_20ft',
        'custom_price_40ft',
        'custom_price_45ft',
        'custom_global_price',
    ];

    protected $casts = [
        'custom_price_20ft' => 'float',
        'custom_price_40ft' => 'float',
        'custom_price_45ft' => 'float',
        'custom_global_price' => 'float',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}