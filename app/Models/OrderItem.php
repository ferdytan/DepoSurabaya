<?php

// File: app/Models/Order.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use Carbon\Carbon;

class OrderItem extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    protected $fillable = [
        'order_id', 'product_id', 'container_number',
        'entry_date', 'eir_date', 'exit_date',
        'commodity', 'country', 'vessel',
        'price_type', 'price_value', 'delete_reason',
        'is_excluded_from_report',
        'start_plug_in', 'plug_out', 'plug_duration_minutes', 'total_shifts',
    ];

    protected $casts = [
        'is_excluded_from_report' => 'boolean',
        'start_plug_in' => 'datetime',
        'plug_out' => 'datetime',
        'plug_duration_minutes' => 'integer',
        'total_shifts' => 'integer',
    ];

    /**
     * Hitung durasi dan jumlah shift berdasarkan konfigurasi dinamis.
     * 1 Shift = (shift_duration_hours * 60) + shift_compensation_minutes (default: 8 jam 45 mnt = 525 mnt)
     * Formula: Total Shift = CEILING(Durasi / 525 menit)
     */
    public static function calculateShifts(?Carbon $start, ?Carbon $out): array
    {
        if (!$start || !$out) {
            return [
                'duration_minutes' => null,
                'total_shifts' => 0,
                'is_valid' => true,
            ];
        }

        if ($out->lt($start)) {
            return [
                'duration_minutes' => null,
                'total_shifts' => 0,
                'is_valid' => false,
                'error' => 'Waktu Plug Out tidak boleh lebih awal dari Start Plug In.',
            ];
        }

        $durationMinutes = (int) $start->diffInMinutes($out);

        $shiftHours = (int) Setting::get('shift_duration_hours', 8);
        $compensationMinutes = (int) Setting::get('shift_compensation_minutes', 45);
        $shiftMinutes = ($shiftHours * 60) + $compensationMinutes;
        if ($shiftMinutes <= 0) {
            $shiftMinutes = 525;
        }

        $totalShifts = $durationMinutes > 0 ? (int) ceil($durationMinutes / $shiftMinutes) : 1;

        return [
            'duration_minutes' => $durationMinutes,
            'total_shifts' => $totalShifts,
            'is_valid' => true,
            'shift_minutes' => $shiftMinutes,
        ];
    }

     protected $dates = [
        'entry_date',
    ];

    // Route Model Binding menggunakan field yang benar
    public function getRouteKeyName()
    {
        return 'id'; // atau field lain jika perlu
    }
    

    // OrderItem belongs to an Order
    public function order()
    {
        return $this->belongsTo(Order::class)->withTrashed();
    }


    // Layanan utama produk (Product model)
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Produk tambahan (many-to-many ke Product via pivot)
    public function additionalProducts()
    {
        return $this->belongsToMany(Product::class, 'order_item_additional_products', 
                                    'order_item_id', 'product_id')
                    ->withPivot('price_value')->withTimestamps();
        // Menggunakan table pivot kustom 'order_item_additional_products' dan kolom kunci kustom:contentReference[oaicite:5]{index=5}:contentReference[oaicite:6]{index=6}.
        // withPivot agar kolom ekstra (price_value) bisa diakses:contentReference[oaicite:7]{index=7}.
    }

    // Catatan suhu (one-to-many)
    public function rekamSuhu()
    {
        return $this->hasMany(OrderItemRekamSuhu::class, 'order_item_id');
    }

    
}
