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
        return $this->belongsToMany(Product::class)
                    ->using(CustomerProduct::class) // Pastikan model ini dibuat jika belum ada
                    ->withPivot([
                        'price',
                    ])
                    ->withTimestamps();
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}