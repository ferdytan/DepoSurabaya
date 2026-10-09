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

    protected static ?bool $hasSetPointColumn = null;
    protected static ?bool $hasStorageDaysColumn = null;

    /**
     * Pastikan kolom set_point ada di database atau coba tambahkan secara otomatis.
     */
    public static function hasSetPointColumn(): bool
    {
        if (static::$hasSetPointColumn !== null) {
            return static::$hasSetPointColumn;
        }

        try {
            if (\Illuminate\Support\Facades\Schema::hasColumn('order_items', 'set_point')) {
                return static::$hasSetPointColumn = true;
            }

            \Illuminate\Support\Facades\Schema::table('order_items', function (\Illuminate\Database\Schema\Blueprint $table) {
                if (!\Illuminate\Support\Facades\Schema::hasColumn('order_items', 'set_point')) {
                    $table->decimal('set_point', 6, 2)->nullable()->after('start_plug_in');
                }
            });

            return static::$hasSetPointColumn = \Illuminate\Support\Facades\Schema::hasColumn('order_items', 'set_point');
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Could not auto-add 'set_point' to order_items: " . $e->getMessage());
            return static::$hasSetPointColumn = false;
        }
    }

    /**
     * Cek apakah kolom storage_days ada di tabel database.
     */
    public static function hasStorageDaysColumn(): bool
    {
        if (static::$hasStorageDaysColumn !== null) {
            return static::$hasStorageDaysColumn;
        }

        try {
            return static::$hasStorageDaysColumn = \Illuminate\Support\Facades\Schema::hasColumn('order_items', 'storage_days');
        } catch (\Throwable $e) {
            return static::$hasStorageDaysColumn = false;
        }
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            // Jika kolom set_point belum ada di tabel database MySQL, jangan biarkan Eloquent menyertakannya agar tidak throw QueryException 1054
            if (array_key_exists('set_point', $model->attributes)) {
                if (!static::hasSetPointColumn()) {
                    unset($model->attributes['set_point']);
                }
            }

            // Jika kolom storage_days belum ada di tabel database MySQL, jangan biarkan Eloquent menyertakannya
            if (array_key_exists('storage_days', $model->attributes)) {
                if (!static::hasStorageDaysColumn()) {
                    unset($model->attributes['storage_days']);
                }
            }
        });
    }
    
    protected $fillable = [
        'order_id', 'product_id', 'container_number',
        'entry_date', 'eir_date', 'exit_date',
        'commodity', 'country', 'vessel',
        'price_type', 'price_value', 'delete_reason',
        'is_excluded_from_report',
        'start_plug_in', 'plug_out', 'plug_duration_minutes', 'total_shifts',
        'set_point', 'storage_days',
        'shift_calculation_mode', 'shift_details', 'last_calculated_at',
    ];

    protected $casts = [
        'is_excluded_from_report' => 'boolean',
        'start_plug_in' => 'datetime:Y-m-d H:i:s',
        'plug_out' => 'datetime:Y-m-d H:i:s',
        'plug_duration_minutes' => 'integer',
        'total_shifts' => 'integer',
        'storage_days' => 'integer',
        'set_point' => 'float',
        'shift_details' => 'array',
        'last_calculated_at' => 'datetime:Y-m-d H:i:s',
    ];

    /**
     * Hitung hari storage yang dikenakan biaya berdasarkan free hours.
     */
    public function calculateStorageDays(?int $freeHours = null): int
    {
        if (!$this->entry_date) {
            return 0;
        }

        if ($freeHours === null) {
            $isFumigasi = false;
            if ($this->relationLoaded('product') && $this->product) {
                $st = strtolower($this->product->service_type ?? '');
                $isFumigasi = str_contains($st, 'fumiga') || str_contains($st, 'fumi');
            }
            if (!$isFumigasi && $this->relationLoaded('order') && $this->order) {
                $isFumigasi = !empty($this->order->fumigasi);
            }
            $freeHours = $isFumigasi
                ? (int) Setting::get('storage_fumigasi_free_hours', 120)
                : (int) Setting::get('storage_free_hours', 72);
        }

        try {
            $start = Carbon::parse($this->entry_date);
            $end = $this->exit_date ? Carbon::parse($this->exit_date) : now();
            if ($end->lt($start)) {
                return 0;
            }
            $totalHours = $start->diffInMinutes($end) / 60;
            $excessHours = max(0, $totalHours - $freeHours);
            return $excessHours > 0 ? (int) ceil($excessHours / 24) : 0;
        } catch (\Throwable $e) {
            return 0;
        }
    }

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
