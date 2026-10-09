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
        'set_point',
        'shift_calculation_mode', 'shift_details', 'last_calculated_at',
    ];

    protected $casts = [
        'is_excluded_from_report' => 'boolean',
        'start_plug_in' => 'datetime:Y-m-d H:i:s',
        'plug_out' => 'datetime:Y-m-d H:i:s',
        'plug_duration_minutes' => 'integer',
        'total_shifts' => 'integer',
        'set_point' => 'float',
        'shift_details' => 'array',
        'last_calculated_at' => 'datetime:Y-m-d H:i:s',
    ];

    /**
     * Hitung durasi dan jumlah shift menggunakan ReeferShiftCalculationService.
     * Mendukung kalkulasi decoupled atau dengan injeksi log suhu.
     */
    public static function calculateShifts(?Carbon $start, ?Carbon $out = null, mixed $logs = []): array
    {
        if (!$start) {
            return [
                'duration_minutes' => null,
                'total_shifts' => 0,
                'is_valid' => true,
            ];
        }

        try {
            $service = app(\App\Services\ReeferShiftCalculationService::class);
            $result = $service->calculate($start, $out, $logs);
            return $result->toArray();
        } catch (\Throwable $e) {
            $startNorm = Carbon::parse($start->format('Y-m-d H:i:s'), 'Asia/Jakarta');
            $outNorm = $out ? Carbon::parse($out->format('Y-m-d H:i:s'), 'Asia/Jakarta') : Carbon::now('Asia/Jakarta');
            if ($out && $outNorm->lt($startNorm)) {
                return [
                    'duration_minutes' => null,
                    'total_shifts' => 0,
                    'is_valid' => false,
                    'error' => 'Waktu Plug Out tidak boleh lebih awal dari Start Plug In.',
                ];
            }
            $durationMinutes = (int) $startNorm->diffInMinutes($outNorm);
            $shiftHours = (int) Setting::get('shift_duration_hours', 8);
            $compMinutes = (int) Setting::get('shift_compensation_minutes', 45);
            $totalShifts = \App\Services\ReeferShiftCalculationService::calculateShiftsFromDuration($durationMinutes, $shiftHours, $compMinutes);

            return [
                'duration_minutes' => $durationMinutes,
                'total_shifts' => $totalShifts,
                'is_valid' => true,
                'shift_minutes' => ($shiftHours > 0 ? $shiftHours : 8) * 60,
            ];
        }
    }

    /**
     * Hitung shift dan perbarui atribut model OrderItem secara otomatis.
     */
    public function calculateAndApplyShifts(?Carbon $outTime = null): \App\DTOs\ShiftCalculationResult
    {
        $service = app(\App\Services\ReeferShiftCalculationService::class);
        $result = $service->calculateForOrderItem($this, $outTime);

        if ($result->isValid) {
            if ($outTime) {
                $this->plug_out = $outTime->format('Y-m-d H:i:s');
            }
            $this->plug_duration_minutes = $result->totalDurationMinutes;
            $this->total_shifts = $result->totalShifts;
            $this->shift_calculation_mode = $result->calculationMode;
            $this->shift_details = $result->shiftBlocks;
            $this->last_calculated_at = now();
        }

        return $result;
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

    // Catatan suhu format lama (one-to-many JSON)
    public function rekamSuhu()
    {
        return $this->hasMany(OrderItemRekamSuhu::class, 'order_item_id');
    }

    // Catatan suhu format baru ter-normalisasi (one-to-many single row event)
    public function temperatureLogs()
    {
        return $this->hasMany(ReeferTemperatureLog::class, 'order_item_id')->orderBy('logged_at');
    }
}
