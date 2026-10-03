<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReeferTemperatureLog extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'reefer_temperature_logs';

    protected $fillable = [
        'order_item_id',
        'logged_at',
        'temperature',
        'set_point',
        'supply_air_temp',
        'return_air_temp',
        'shift_sequence',
        'recorded_by_user_id',
        'remarks',
    ];

    protected $casts = [
        'logged_at' => 'datetime',
        'temperature' => 'float',
        'set_point' => 'float',
        'supply_air_temp' => 'float',
        'return_air_temp' => 'float',
        'shift_sequence' => 'integer',
        'recorded_by_user_id' => 'integer',
    ];

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class, 'order_item_id');
    }

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by_user_id');
    }
}
