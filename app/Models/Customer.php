<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    
    protected $fillable = ['name', 'address', 'city', 'province', 'phone', 'email'];

    public function products()
    {
        $pivotCols = CustomerProduct::hasPriceColumn()
            ? ['price']
            : ['custom_global_price', 'custom_price_20ft', 'custom_price_40ft', 'custom_price_45ft'];

        return $this->belongsToMany(Product::class)
                    ->using(CustomerProduct::class)
                    ->withPivot($pivotCols)
                    ->withTimestamps();
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}