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
        $this->shiftCompensationMinutes = $shiftCompensationMinutes ?? (int) Setting::get('shift_compensation_minutes', 45);
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

        $totalDurationMinutes = (int) $startNorm->diffInMinutes($effectiveOut);

        // Ekstraksi dan sanitasi log suhu ke stream kronologis
        $sanitizedLogs = $this->extractAndSanitizeLogs($rawLogs, $startNorm, $effectiveOut);

        // Edge Case: Tidak ada catatan suhu -> Fallback ke perhitungan selisih durasi mentah
        if ($sanitizedLogs->isEmpty()) {
            return $this->calculateRawFallback($startNorm, $effectiveOut, $totalDurationMinutes);
        }

        // Jalankan Algoritma Shift Windowing
        return $this->executeShiftWindowing(
            $startNorm,
            $effectiveOut,
            $sanitizedLogs,
            $totalDurationMinutes,
            $isStillPluggedIn
        );
    }

    /**
     * Hitung jumlah shift berdasarkan durasi total menit, durasi kerja per shift (jam), dan batas kompensasi/toleransi (menit).
     *
     * Aturan Bisnis Resmi:
     * 1. Menit pertama s.d. 8 jam = 1 shift (minimal 1 shift saat plugged-in).
     * 2. 1 shift standar = $shiftDurationHours jam (default 8 jam = 480 menit).
     * 3. Sisa menit (remainder) setelah kelipatan 8 jam:
     *    - Sisa <= $compensationMinutes (default 45 menit): Masuk batas toleransi (grace period), TIDAK menambah shift baru.
     *    - Sisa > $compensationMinutes: Melewati batas toleransi (misal 46 menit), LANGSUNG dihitung sebagai 1 shift baru!
     *
     * Contoh Kasus (8 jam, toleransi 45 menit):
     * - 1 menit s.d. 8 jam 45 menit  => 1 shift
     * - 8 jam 46 menit s.d. 16 jam 45 menit => 2 shift
     * - 152 jam 00 menit s.d. 152 jam 45 menit => 19 shift (19 x 8 jam = 152 jam)
     * - 152 jam 46 menit => 20 shift
     * - 159 jam 34 menit => 20 shift (152 jam + 7 jam 34 menit)
     * - 160 jam 45 menit => 20 shift
     * - 160 jam 46 menit => 21 shift
     */
    public static function calculateShiftsFromDuration(
        int $durationMinutes,
        int $shiftDurationHours = 8,
        int $compensationMinutes = 45
    ): int {
        if ($durationMinutes <= 0) {
            return 1;
        }

        $shiftMinutes = $shiftDurationHours * 60;
        if ($shiftMinutes <= 0) {
            $shiftMinutes = 480;
        }

        $fullShifts = intdiv($durationMinutes, $shiftMinutes);
        $remainderMinutes = $durationMinutes % $shiftMinutes;

        // Jika belum melebihi 1 shift dasar (misal 1 menit s.d 8 jam):
        if ($fullShifts === 0) {
            return 1;
        }

        // Jika pas di batas kelipatan shift (misal tepat 8 jam, 16 jam, 152 jam):
        if ($remainderMinutes === 0) {
            return $fullShifts;
        }

        // Jika kelebihan waktu melebihi batas toleransi kompensasi (lewat 45 menit):
        // langsung dihitung sebagai 1 shift baru!
        if ($remainderMinutes > $compensationMinutes) {
            return $fullShifts + 1;
        }

        // Jika kelebihan waktu masih dalam batas toleransi (<= 45 menit):
        return $fullShifts;
    }

    /**
     * Hitung shift dari durasi menit menggunakan konfigurasi instance service saat ini.
     */
    public function calculateShiftsFromMinutes(int $durationMinutes): int
    {
        return self::calculateShiftsFromDuration(
            $durationMinutes,
            $this->shiftDurationHours,
            $this->shiftCompensationMinutes
        );
    }

    /**
     * Algoritma Inti: Shift Windowing Algorithm.
     * Mengelompokkan log suhu ke dalam blok shift aktif dengan mempertimbangkan
     * toleransi jeda (gap) monitoring dan perhitungan shift per sesi aktif.
     */
    protected function executeShiftWindowing(
        Carbon $plugIn,
        Carbon $plugOut,
        Collection $logs,
        int $totalDurationMinutes,
        bool $isStillPluggedIn
    ): ShiftCalculationResult {
        $totalIdleMinutes = 0;

        /** @var Carbon $firstLog */
        $firstLog = $logs->first()['timestamp'];

        // Anchor awal Sesi 1:
        // Jika gap antara Plug-In dan log pertama masih dalam batas toleransi wajar, anchor ke Plug-In
        $gapToFirstLog = (int) $plugIn->diffInMinutes($firstLog);
        $currentSessionStart = ($gapToFirstLog <= $this->idleGapThresholdMinutes) ? $plugIn->copy() : $firstLog->copy();

        $activeSessions = [];
        $currentSessionLogs = [];
        $lastEventTime = $currentSessionStart->copy();

        foreach ($logs as $logItem) {
            /** @var Carbon $logTime */
            $logTime = $logItem['timestamp'];

            // Deduplikasi waktu event yang sama
            if ($logTime->equalTo($lastEventTime)) {
                $currentSessionLogs[] = $logItem;
                continue;
            }

            $gapSinceLastEvent = (int) $lastEventTime->diffInMinutes($logTime);

            // Jika jeda antar log melebihi batas jeda (gap idle terdeteksi)
            if ($gapSinceLastEvent > $this->idleGapThresholdMinutes) {
                // Tutup sesi aktif sebelum jeda
                $activeSessions[] = [
                    'start' => $currentSessionStart->copy(),
                    'end' => $lastEventTime->copy(),
                    'logs' => $currentSessionLogs,
                ];
                $totalIdleMinutes += $gapSinceLastEvent;

                // Buka sesi aktif baru setelah jeda
                $currentSessionStart = $logTime->copy();
                $lastEventTime = $logTime->copy();
                $currentSessionLogs = [$logItem];
            } else {
                $currentSessionLogs[] = $logItem;
                $lastEventTime = $logTime->copy();
            }
        }

        // Tangani penutupan sesi terakhir bersama Plug Out
        $gapToPlugOut = (int) $lastEventTime->diffInMinutes($plugOut);
        if ($gapToPlugOut <= $this->idleGapThresholdMinutes) {
            $finalSessionEnd = $plugOut->copy();
        } else {
            // Ada jeda panjang tak termonitor setelah log terakhir sebelum plug out dicabut
            $finalSessionEnd = $lastEventTime->copy();
            $totalIdleMinutes += $gapToPlugOut;
        }

        $activeSessions[] = [
            'start' => $currentSessionStart->copy(),
            'end' => $finalSessionEnd->copy(),
            'logs' => $currentSessionLogs,
        ];

        // Konversi sesi aktif menjadi blok shift
        $shiftBlocks = [];
        $totalBilledShifts = 0;
        $totalActiveMinutes = 0;
        $shiftNumber = 1;

        $baseShiftMinutes = $this->shiftDurationHours * 60;
        if ($baseShiftMinutes <= 0) {
            $baseShiftMinutes = 480;
        }

        foreach ($activeSessions as $session) {
            $sessionStart = $session['start'];
            $sessionEnd = $session['end'];
            $sessionLogs = $session['logs'];

            $sessionDuration = max(0, (int) $sessionStart->diffInMinutes($sessionEnd));
            $totalActiveMinutes += $sessionDuration;

            $sessionShifts = $this->calculateShiftsFromMinutes($sessionDuration);
            $totalBilledShifts += $sessionShifts;

            if ($sessionShifts <= 1) {
                // 1 Blok Shift untuk sesi ini
                $hours = floor($sessionDuration / 60);
                $minutes = $sessionDuration % 60;

                $shiftBlocks[] = [
                    'shift_number' => $shiftNumber++,
                    'start_time' => $sessionStart->format('Y-m-d H:i:s'),
                    'end_time' => $sessionEnd->format('Y-m-d H:i:s'),
                    'duration_minutes' => $sessionDuration,
                    'duration_formatted' => "{$hours} Jam {$minutes} Menit",
                    'shifts_billed' => max(1, $sessionShifts),
                    'log_count' => count($sessionLogs),
                    'logs' => $sessionLogs,
                ];
            } else {
                // Multi-shift dalam 1 sesi kontinu tanpa gap:
                // Pecah menjadi $sessionShifts blok:
                // Shift 1 s.d N-1 berdurasi standar $baseShiftMinutes (8 jam)
                // Shift N berdurasi sisa waktu ($sessionDuration - (N-1) * $baseShiftMinutes)
                for ($i = 0; $i < $sessionShifts; $i++) {
                    $blockStart = $sessionStart->copy()->addMinutes($i * $baseShiftMinutes);
                    if ($i === $sessionShifts - 1) {
                        $blockEnd = $sessionEnd->copy();
                    } else {
                        $blockEnd = $sessionStart->copy()->addMinutes(($i + 1) * $baseShiftMinutes);
                    }

                    $blockDuration = (int) $blockStart->diffInMinutes($blockEnd);
                    $bHours = floor($blockDuration / 60);
                    $bMinutes = $blockDuration % 60;

                    // Filter logs yang berada di rentang blok ini
                    $blockLogs = array_values(array_filter($sessionLogs, function ($l) use ($blockStart, $blockEnd) {
                        /** @var Carbon $ts */
                        $ts = $l['timestamp'];
                        return $ts->gte($blockStart) && $ts->lte($blockEnd);
                    }));

                    $shiftBlocks[] = [
                        'shift_number' => $shiftNumber++,
                        'start_time' => $blockStart->format('Y-m-d H:i:s'),
                        'end_time' => $blockEnd->format('Y-m-d H:i:s'),
                        'duration_minutes' => $blockDuration,
                        'duration_formatted' => "{$bHours} Jam {$bMinutes} Menit",
                        'shifts_billed' => 1,
                        'log_count' => count($blockLogs),
                        'logs' => $blockLogs,
                    ];
                }
            }
        }

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
     * Fallback kalkulasi jika data log suhu kosong.
     * Menggunakan durasi menit plug-in ke plug-out dengan formula shift resmi.
     */
    protected function calculateRawFallback(
        Carbon $plugIn,
        Carbon $plugOut,
        int $totalDurationMinutes
    ): ShiftCalculationResult {
        $totalShifts = $this->calculateShiftsFromMinutes($totalDurationMinutes);

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
