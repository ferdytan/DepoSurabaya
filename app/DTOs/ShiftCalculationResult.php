<?php

namespace App\DTOs;

use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

/**
 * Data Transfer Object (DTO) untuk hasil kalkulasi shift reefer container.
 */
class ShiftCalculationResult implements Arrayable, JsonSerializable
{
    /**
     * @param int $totalShifts Jumlah shift yang wajib ditagihkan
     * @param int $totalDurationMinutes Total selisih waktu plug-in ke plug-out dalam menit
     * @param int $activeMonitoringMinutes Total durasi aktif monitoring dalam menit
     * @param int $idleGapMinutes Total durasi jeda/gap tanpa monitoring dalam menit
     * @param bool $isFallback Apakah menggunakan fallback durasi mentah karena ketiadaan log
     * @param string $calculationMode 'log_windowing' atau 'raw_duration_fallback'
     * @param array $shiftBlocks Rincian blok shift yang terbentuk
     * @param int $logsEvaluatedCount Jumlah log suhu yang dievaluasi
     * @param string $summary Ringkasan deskriptif hasil kalkulasi
     * @param bool $isValid Status validitas kalkulasi
     * @param string|null $errorMessage Pesan error jika kalkulasi tidak valid
     */
    public function __construct(
        public readonly int $totalShifts,
        public readonly int $totalDurationMinutes,
        public readonly int $activeMonitoringMinutes,
        public readonly int $idleGapMinutes,
        public readonly bool $isFallback,
        public readonly string $calculationMode,
        public readonly array $shiftBlocks,
        public readonly int $logsEvaluatedCount,
        public readonly string $summary,
        public readonly bool $isValid = true,
        public readonly ?string $errorMessage = null,
    ) {
    }

    /**
     * Factory untuk hasil kalkulasi gagal / tidak valid.
     */
    public static function invalid(string $message): self
    {
        return new self(
            totalShifts: 0,
            totalDurationMinutes: 0,
            activeMonitoringMinutes: 0,
            idleGapMinutes: 0,
            isFallback: false,
            calculationMode: 'invalid',
            shiftBlocks: [],
            logsEvaluatedCount: 0,
            summary: $message,
            isValid: false,
            errorMessage: $message,
        );
    }

    /**
     * Representasi array untuk kompatibilitas dengan pemanggil lama dan penyimpanan JSON.
     */
    public function toArray(): array
    {
        return [
            'total_shifts' => $this->totalShifts,
            'duration_minutes' => $this->totalDurationMinutes,
            'active_duration_minutes' => $this->activeMonitoringMinutes,
            'idle_duration_minutes' => $this->idleGapMinutes,
            'is_fallback' => $this->isFallback,
            'calculation_mode' => $this->calculationMode,
            'shift_blocks' => $this->shiftBlocks,
            'logs_evaluated_count' => $this->logsEvaluatedCount,
            'summary' => $this->summary,
            'is_valid' => $this->isValid,
            'error' => $this->errorMessage,
        ];
    }

    public function jsonSerialize(): mixed
    {
        return $this->toArray();
    }
}
