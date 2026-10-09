<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CustomerProduct extends Pivot
{
    protected $table = 'customer_product';

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