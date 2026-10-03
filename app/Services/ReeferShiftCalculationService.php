<?php

namespace App\Services;

use App\DTOs\ShiftCalculationResult;
use App\Models\OrderItem;
use App\Models\OrderItemRekamSuhu;
use App\Models\ReeferTemperatureLog;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use InvalidArgumentException;

/**
 * Service Class: ReeferShiftCalculationService
 * 
 * Bertanggung jawab menghitung jumlah shift kerja operasional monitoring reefer container
 * berdasarkan riwayat pencatatan suhu aktif (Shift Windowing Algorithm),
 * bukan sekadar selisih waktu mentah (Plug Out - Plug In).
 *
 * Aturan Bisnis:
 * 1. Durasi dasar 1 shift: 8 jam (480 menit) dengan toleransi (grace period) 45 menit (maks 525 menit).
 * 2. Interval pencatatan suhu: Petugas mencatat suhu berkala (per jam).
 * 3. Deteksi Gap: Jeda antar log melebihi batas toleransi (default 150 menit / 2.5 jam) menandai
 *    berakhirnya siklus shift sebelumnya dan dimulainya siklus shift baru.
 * 4. Midnight Crossover: Perubahan tanggal ditangani penuh menggunakan objek Carbon dengan tanggal lengkap.
 * 5. Fallback: Jika tidak ada log suhu, sistem mundur (fallback) ke perhitungan selisih durasi plug-in/plug-out.
 */
class ReeferShiftCalculationService
{
    /**
     * Zona waktu operasional depo (default Asia/Jakarta).
     */
    protected string $timezone;

    /**
     * Durasi kerja standar per shift dalam jam (default: 8 jam).
     */
    protected int $shiftDurationHours;

    /**
     * Kompensasi/toleransi (grace period) per shift dalam menit (default: 45 menit).
     */
    protected int $shiftCompensationMinutes;

    /**
     * Ambang batas jeda tanpa log untuk memicu pergantian shift (default: 150 menit / 2.5 jam).
     */
    protected int $idleGapThresholdMinutes;

    public function __construct(
        ?int $shiftDurationHours = null,
        ?int $shiftCompensationMinutes = null,
        ?int $idleGapThresholdMinutes = null,
        string $timezone = 'Asia/Jakarta'
    ) {
        $this->timezone = $timezone;
        $this->shiftDurationHours = $shiftDurationHours ?? (int) Setting::get('shift_duration_hours', 8);
        $this->shiftCompensationMinutes = $shiftCompensationMinutes ?? (int) Setting::get('shift_compensation_minutes', 0);
        $this->idleGapThresholdMinutes = $idleGapThresholdMinutes ?? (int) Setting::get('shift_max_gap_minutes', 150);

        if ($this->shiftDurationHours <= 0) {
            $this->shiftDurationHours = 8;
        }
        if ($this->shiftCompensationMinutes < 0) {
            $this->shiftCompensationMinutes = 0;
        }
        if ($this->idleGapThresholdMinutes <= 0) {
            $this->idleGapThresholdMinutes = 150;
        }
    }

    /**
     * Hitung shift untuk instance OrderItem tertentu.
     * Mengambil log otomatis dari relasi Eloquent (temperatureLogs atau rekamSuhu JSON).
     */
    public function calculateForOrderItem(OrderItem $orderItem, ?Carbon $customOutTime = null): ShiftCalculationResult
    {
        $rawStart = $orderItem->getRawOriginal('start_plug_in') 
            ?? (is_string($orderItem->start_plug_in) ? $orderItem->start_plug_in : $orderItem->start_plug_in?->format('Y-m-d H:i:s'));

        if (!$rawStart) {
            return ShiftCalculationResult::invalid("OrderItem #{$orderItem->id} ({$orderItem->container_number}) belum memiliki catatan Start Plug In.");
        }

        $plugIn = Carbon::parse($rawStart, $this->timezone);

        $plugOut = $customOutTime;
        if (!$plugOut) {
            $rawOut = $orderItem->getRawOriginal('plug_out') 
                ?? (is_string($orderItem->plug_out) ? $orderItem->plug_out : $orderItem->plug_out?->format('Y-m-d H:i:s'));
            $plugOut = $rawOut ? Carbon::parse($rawOut, $this->timezone) : null;
        }

        // Kumpulkan log dari normalized temperatureLogs jika ada, atau fallback ke rekamSuhu JSON
        $logs = [];
        if (method_exists($orderItem, 'temperatureLogs') && $orderItem->relationLoaded('temperatureLogs')) {
            $logs = $orderItem->temperatureLogs;
        } elseif (method_exists($orderItem, 'temperatureLogs') && $orderItem->temperatureLogs()->exists()) {
            $logs = $orderItem->temperatureLogs()->orderBy('logged_at')->get();
        } elseif ($orderItem->relationLoaded('rekamSuhu')) {
            $logs = $orderItem->rekamSuhu;
        } elseif ($orderItem->rekamSuhu()->exists()) {
            $logs = $orderItem->rekamSuhu()->orderBy('tanggal')->get();
        }

        return $this->calculate($plugIn, $plugOut, $logs);
    }

    /**
     * Hitung shift menggunakan parameter eksplisit (Decoupled, Pure Domain Logic).
     *
     * @param Carbon|string|null $plugIn Waktu mulai plug-in
     * @param Carbon|string|null $plugOut Waktu selesai plug-out
     * @param mixed $rawLogs Koleksi atau array log suhu (Carbon, string, array, atau Model)
     */
    public function calculate(
        Carbon|string|null $plugIn,
        Carbon|string|null $plugOut,
        mixed $rawLogs = []
    ): ShiftCalculationResult {
        if (!$plugIn) {
            return ShiftCalculationResult::invalid('Waktu Start Plug In wajib diisi.');
        }

        $startNorm = $this->normalizeDateTime($plugIn);
        $outNorm = $plugOut ? $this->normalizeDateTime($plugOut) : null;

        if ($outNorm && $outNorm->lt($startNorm)) {
            throw new InvalidArgumentException('Waktu Plug Out tidak boleh lebih awal dari Start Plug In.');
        }

        // Jika belum plug out, kalkulasi shift berjalan (running) sampai log terakhir atau waktu saat ini
        $isStillPluggedIn = ($outNorm === null);
        $effectiveOut = $outNorm ?? Carbon::now($this->timezone);

        $maxShiftMinutes = ($this->shiftDurationHours * 60) + $this->shiftCompensationMinutes;
        $totalDurationMinutes = (int) $startNorm->diffInMinutes($effectiveOut);

        // Ekstraksi dan sanitasi log suhu ke stream kronologis
        $sanitizedLogs = $this->extractAndSanitizeLogs($rawLogs, $startNorm, $effectiveOut);

        // Edge Case: Tidak ada catatan suhu -> Fallback ke perhitungan selisih durasi mentah
        if ($sanitizedLogs->isEmpty()) {
            return $this->calculateRawFallback($startNorm, $effectiveOut, $totalDurationMinutes, $maxShiftMinutes);
        }

        // Jalankan Algoritma Shift Windowing
        return $this->executeShiftWindowing(
            $startNorm,
            $effectiveOut,
            $sanitizedLogs,
            $totalDurationMinutes,
            $maxShiftMinutes,
            $isStillPluggedIn
        );
    }

    /**
     * Algoritma Inti: Shift Windowing Algorithm.
     * Mengelompokkan log suhu ke dalam blok shift aktif dengan mempertimbangkan
     * durasi maksimal shift dan toleransi gap jeda monitoring.
     */
    protected function executeShiftWindowing(
        Carbon $plugIn,
        Carbon $plugOut,
        Collection $logs,
        int $totalDurationMinutes,
        int $maxShiftMinutes,
        bool $isStillPluggedIn
    ): ShiftCalculationResult {
        $shiftBlocks = [];
        $totalBilledShifts = 0;
        $totalActiveMinutes = 0;
        $totalIdleMinutes = 0;

        /** @var Carbon $firstLog */
        $firstLog = $logs->first()['timestamp'];

        // Anchor awal Shift 1:
        // Jika gap antara Plug-In dan log pertama masih dalam batas toleransi wajar, anchor ke Plug-In
        $gapToFirstLog = (int) $plugIn->diffInMinutes($firstLog);
        $currentShiftStart = ($gapToFirstLog <= $this->idleGapThresholdMinutes) ? $plugIn->copy() : $firstLog->copy();

        $currentShiftLogs = [];
        $lastEventTime = $currentShiftStart->copy();
        $shiftNumber = 1;

        foreach ($logs as $logItem) {
            /** @var Carbon $logTime */
            $logTime = $logItem['timestamp'];

            // Lewati jika waktu log sama dengan waktu event terakhir (deduplikasi waktu)
            if ($logTime->equalTo($lastEventTime)) {
                $currentShiftLogs[] = $logItem;
                continue;
            }

            $gapSinceLastEvent = (int) $lastEventTime->diffInMinutes($logTime);
            $spanSinceShiftStart = (int) $currentShiftStart->diffInMinutes($logTime);

            // Kondisi 1: Terjadi jeda panjang tanpa monitoring (Gap > Threshold)
            $isIdleGap = ($gapSinceLastEvent > $this->idleGapThresholdMinutes);

            // Kondisi 2: Durasi shift aktif melebihi batas maksimal kapasitas 1 shift (525 menit)
            $isShiftOverflow = ($spanSinceShiftStart > $maxShiftMinutes);

            if ($isIdleGap || $isShiftOverflow) {
                // Tutup shift saat ini pada event terakhir sebelum gap/overflow
                $shiftEnd = $lastEventTime->copy();
                $block = $this->finalizeShiftBlock(
                    $shiftNumber,
                    $currentShiftStart,
                    $shiftEnd,
                    $currentShiftLogs,
                    $maxShiftMinutes
                );

                $shiftBlocks[] = $block;
                $totalBilledShifts += $block['shifts_billed'];
                $totalActiveMinutes += $block['duration_minutes'];

                if ($isIdleGap) {
                    $totalIdleMinutes += (int) $lastEventTime->diffInMinutes($logTime);
                }

                // Buka Shift Baru
                $shiftNumber++;
                $currentShiftStart = $logTime->copy();
                $lastEventTime = $logTime->copy();
                $currentShiftLogs = [$logItem];
            } else {
                // Log masih dalam rentang siklus shift yang sama
                $currentShiftLogs[] = $logItem;
                $lastEventTime = $logTime->copy();
            }
        }

        // Tangani penutupan shift terakhir bersama Plug Out
        $gapToPlugOut = (int) $lastEventTime->diffInMinutes($plugOut);
        
        // Jika plug out terjadi dalam batas toleransi wajar setelah log terakhir
        if ($gapToPlugOut <= $this->idleGapThresholdMinutes) {
            $finalShiftEnd = $plugOut->copy();
        } else {
            // Ada jeda panjang tak termonitor setelah log terakhir sebelum plug out dicabut
            $finalShiftEnd = $lastEventTime->copy();
            $totalIdleMinutes += (int) $lastEventTime->diffInMinutes($plugOut);
        }

        // Finalisasi blok shift terakhir
        $finalBlock = $this->finalizeShiftBlock(
            $shiftNumber,
            $currentShiftStart,
            $finalShiftEnd,
            $currentShiftLogs,
            $maxShiftMinutes
        );

        $shiftBlocks[] = $finalBlock;
        $totalBilledShifts += $finalBlock['shifts_billed'];
        $totalActiveMinutes += $finalBlock['duration_minutes'];

        // Rekonsiliasi durasi idle jika ada selisih
        $calculatedIdle = max(0, $totalDurationMinutes - $totalActiveMinutes);
        if ($totalIdleMinutes === 0 && $calculatedIdle > 0 && count($shiftBlocks) > 1) {
            $totalIdleMinutes = $calculatedIdle;
        }

        // Format ringkasan
        $summaryParts = [];
        foreach ($shiftBlocks as $b) {
            $summaryParts[] = "Shift {$b['shift_number']}: {$b['start_time']} s.d. {$b['end_time']} ({$b['duration_formatted']}, {$b['shifts_billed']} shift)";
        }
        $summary = "Total {$totalBilledShifts} Shift dievaluasi dari " . count($logs) . " catatan suhu. " . implode(' | ', $summaryParts);

        return new ShiftCalculationResult(
            totalShifts: $totalBilledShifts,
            totalDurationMinutes: $totalDurationMinutes,
            activeMonitoringMinutes: $totalActiveMinutes,
            idleGapMinutes: $totalIdleMinutes,
            isFallback: false,
            calculationMode: 'log_windowing',
            shiftBlocks: $shiftBlocks,
            logsEvaluatedCount: count($logs),
            summary: $summary,
            isValid: true,
        );
    }

    /**
     * Membentuk array data blok shift dengan perhitungan kuota shift.
     */
    protected function finalizeShiftBlock(
        int $shiftNumber,
        Carbon $start,
        Carbon $end,
        array $logs,
        int $maxShiftMinutes
    ): array {
        $durationMinutes = (int) $start->diffInMinutes($end);
        
        // 1 Shift jika durasi <= 525 menit (8 jam 45 menit)
        // Jika durasi tanpa putus melebihi batas toleransi, dihitung kelipatan shift
        $shiftsBilled = $durationMinutes > 0 
            ? (int) ceil($durationMinutes / $maxShiftMinutes) 
            : 1;

        $hours = floor($durationMinutes / 60);
        $minutes = $durationMinutes % 60;

        return [
            'shift_number' => $shiftNumber,
            'start_time' => $start->format('Y-m-d H:i:s'),
            'end_time' => $end->format('Y-m-d H:i:s'),
            'duration_minutes' => $durationMinutes,
            'duration_formatted' => "{$hours} Jam {$minutes} Menit",
            'shifts_billed' => max(1, $shiftsBilled),
            'log_count' => count($logs),
            'logs' => $logs,
        ];
    }

    /**
     * Fallback kalkulasi jika data log suhu kosong.
     * Menggunakan selisih waktu plug-in ke plug-out dibagi durasi shift toleransi.
     */
    protected function calculateRawFallback(
        Carbon $plugIn,
        Carbon $plugOut,
        int $totalDurationMinutes,
        int $maxShiftMinutes
    ): ShiftCalculationResult {
        $totalShifts = $totalDurationMinutes > 0 
            ? (int) ceil($totalDurationMinutes / $maxShiftMinutes) 
            : 1;

        $hours = floor($totalDurationMinutes / 60);
        $minutes = $totalDurationMinutes % 60;

        $fallbackBlock = [
            'shift_number' => 1,
            'start_time' => $plugIn->format('Y-m-d H:i:s'),
            'end_time' => $plugOut->format('Y-m-d H:i:s'),
            'duration_minutes' => $totalDurationMinutes,
            'duration_formatted' => "{$hours} Jam {$minutes} Menit",
            'shifts_billed' => max(1, $totalShifts),
            'log_count' => 0,
            'logs' => [],
        ];

        return new ShiftCalculationResult(
            totalShifts: max(1, $totalShifts),
            totalDurationMinutes: $totalDurationMinutes,
            activeMonitoringMinutes: $totalDurationMinutes,
            idleGapMinutes: 0,
            isFallback: true,
            calculationMode: 'raw_duration_fallback',
            shiftBlocks: [$fallbackBlock],
            logsEvaluatedCount: 0,
            summary: "Fallback tanpa log suhu: {$hours} Jam {$minutes} Menit menghasilkan {$totalShifts} shift.",
            isValid: true,
        );
    }

    /**
     * Ekstraksi dan sanitasi berbagai format log suhu menjadi stream kronologis Carbon.
     */
    protected function extractAndSanitizeLogs(mixed $rawLogs, Carbon $plugIn, Carbon $plugOut): Collection
    {
        $extracted = collect();

        if (empty($rawLogs)) {
            return $extracted;
        }

        // Kasus 1: Koleksi model OrderItemRekamSuhu (format JSON: tanggal + jam_data)
        if ($rawLogs instanceof Collection || is_array($rawLogs)) {
            foreach ($rawLogs as $key => $item) {
                if ($item instanceof OrderItemRekamSuhu) {
                    $tanggal = $item->tanggal;
                    $jamData = is_array($item->jam_data) ? $item->jam_data : (json_decode($item->jam_data ?? '[]', true) ?: []);
                    foreach ($jamData as $hourStr => $tempVal) {
                        $parsed = $this->parseDateAndHourToCarbon($tanggal, (string) $hourStr);
                        if ($parsed) {
                            $extracted->push([
                                'timestamp' => $parsed,
                                'temperature' => is_numeric($tempVal) ? (float) $tempVal : $tempVal,
                            ]);
                        }
                    }
                } elseif ($item instanceof ReeferTemperatureLog) {
                    $ts = $this->normalizeDateTime($item->logged_at);
                    if ($ts) {
                        $extracted->push([
                            'timestamp' => $ts,
                            'temperature' => (float) $item->temperature,
                        ]);
                    }
                } elseif (is_array($item) && isset($item['logged_at'])) {
                    $ts = $this->normalizeDateTime($item['logged_at']);
                    if ($ts) {
                        $extracted->push([
                            'timestamp' => $ts,
                            'temperature' => $item['temperature'] ?? null,
                        ]);
                    }
                } elseif (is_string($key) && is_array($item)) {
                    // Format: ['2026-10-01' => ['12:00' => 4.5, '13:00' => 4.2]]
                    $tanggal = $key;
                    foreach ($item as $hourStr => $tempVal) {
                        $parsed = $this->parseDateAndHourToCarbon($tanggal, (string) $hourStr);
                        if ($parsed) {
                            $extracted->push([
                                'timestamp' => $parsed,
                                'temperature' => is_numeric($tempVal) ? (float) $tempVal : $tempVal,
                            ]);
                        }
                    }
                } elseif ($item instanceof Carbon) {
                    $extracted->push([
                        'timestamp' => $this->normalizeDateTime($item),
                        'temperature' => null,
                    ]);
                } elseif (is_string($item)) {
                    $ts = $this->normalizeDateTime($item);
                    if ($ts) {
                        $extracted->push([
                            'timestamp' => $ts,
                            'temperature' => null,
                        ]);
                    }
                }
            }
        }

        if ($extracted->isEmpty()) {
            return $extracted;
        }

        // Sanitasi log:
        // 1. Urutkan berdasarkan timestamp secara ascending (menangani log tidak berurutan)
        $sorted = $extracted->sortBy(fn ($l) => $l['timestamp']->timestamp)->values();

        // 2. Filter log anomali yang berada di luar jendela plug-in / plug-out
        // Beri toleransi 30 menit sebelum plug-in dan 30 menit setelah plug-out
        $minAllowed = $plugIn->copy()->subMinutes(30);
        $maxAllowed = $plugOut->copy()->addMinutes(30);

        $filtered = $sorted->filter(function ($item) use ($minAllowed, $maxAllowed) {
            /** @var Carbon $ts */
            $ts = $item['timestamp'];
            return $ts->gte($minAllowed) && $ts->lte($maxAllowed);
        });

        // 3. Deduplikasi log dengan timestamp yang persis sama
        $unique = $filtered->unique(fn ($item) => $item['timestamp']->format('Y-m-d H:i'))->values();

        return $unique;
    }

    /**
     * Normalisasi string tanggal dan jam ke objek Carbon.
     */
    protected function parseDateAndHourToCarbon(string $tanggal, string $hourStr): ?Carbon
    {
        try {
            $trimmedHour = trim($hourStr);
            // Format bisa '12', '12:00', atau '12:00:00'
            if (preg_match('/^\d{1,2}$/', $trimmedHour)) {
                $trimmedHour = sprintf('%02d:00:00', (int) $trimmedHour);
            } elseif (preg_match('/^\d{1,2}:\d{2}$/', $trimmedHour)) {
                $trimmedHour = sprintf('%s:00', $trimmedHour);
            }

            return Carbon::parse("{$tanggal} {$trimmedHour}", $this->timezone);
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Normalisasi objek Carbon / string waktu ke zona waktu Asia/Jakarta.
     */
    protected function normalizeDateTime(Carbon|string|null $dateTime): ?Carbon
    {
        if (!$dateTime) {
            return null;
        }

        if ($dateTime instanceof Carbon) {
            return Carbon::parse($dateTime->format('Y-m-d H:i:s'), $this->timezone);
        }

        return Carbon::parse((string) $dateTime, $this->timezone);
    }
}
