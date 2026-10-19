<?php

namespace Tests\Unit;

use App\DTOs\ShiftCalculationResult;
use App\Services\ReeferShiftCalculationService;
use Carbon\Carbon;
use InvalidArgumentException;
use Tests\TestCase;

class ReeferShiftCalculationServiceTest extends TestCase
{
    protected ReeferShiftCalculationService $service;

    protected function setUp(): void
    {
        parent::setUp();
        // Shift 8 jam, kompensasi 43 menit sesuai setting customer
        $this->service = new ReeferShiftCalculationService(
            shiftDurationHours: 8,
            shiftCompensationMinutes: 43,
            idleGapThresholdMinutes: 150,
            timezone: 'Asia/Jakarta'
        );
    }

    /**
     * Skenario Resmi Permintaan User:
     * - Plug In: 00:00 s.d. Plug Out: 24:00 (Total durasi 24 jam)
     * - Terisi: Jam 07:00 - 15:00 (7 pagi - 3 sore)
     * - Berhenti entry suhu: Jam 16:00, 17:00, 18:00 (3 jam kosong)
     * - Start lagi: Jam 19:00 - 24:00 (7 malam - 12 malam)
     * - Hasil yang Diharapkan: 24 jam - 3 jam = 21 jam tertagih.
     * - Konversi shift (8 jam/shift, toleransi 43 menit):
     *   21 jam = 1.260 menit -> 2 shift penuh (16 jam = 960 menit) + sisa 5 jam (300 menit > 43 menit) = 3 Shift.
     */
    public function test_user_scenario_24_hours_with_3_unfilled_hours_yields_21_billable_hours(): void
    {
        $plugIn = Carbon::parse('2026-10-19 00:00:00', 'Asia/Jakarta');
        $plugOut = Carbon::parse('2026-10-20 00:00:00', 'Asia/Jakarta'); // 24 jam

        // Entri suhu: 00:00 s.d. 15:00 (terisi), 16:00-18:00 (kosong), 19:00-24:00 (terisi)
        $logs = [];
        // 00:00 s.d. 15:00 terisi
        for ($h = 0; $h <= 15; $h++) {
            $logs[] = sprintf('2026-10-19 %02d:00:00', $h);
        }
        // Jam 16, 17, 18 KOSONG (tidak dimasukkan ke logs)
        // 19:00 s.d. 23:00 terisi
        for ($h = 19; $h <= 23; $h++) {
            $logs[] = sprintf('2026-10-19 %02d:00:00', $h);
        }
        $logs[] = '2026-10-20 00:00:00';

        $result = $this->service->calculate($plugIn, $plugOut, $logs);

        $this->assertInstanceOf(ShiftCalculationResult::class, $result);
        $this->assertTrue($result->isValid);
        $this->assertSame('hourly_deduction', $result->calculationMode);

        // Durasi kotor = 24 jam = 1.440 menit
        $this->assertSame(1440, $result->shiftBlocks[0]['raw_duration_minutes']);

        // Jam kosong terdeteksi = 3 jam (16:00, 17:00, 18:00)
        $this->assertSame(3, $result->shiftBlocks[0]['unfilled_hours_count']);
        $this->assertSame(180, $result->shiftBlocks[0]['deducted_minutes']);

        // Durasi tertagih = 24 jam - 3 jam = 21 jam = 1.260 menit
        $this->assertSame(1260, $result->totalDurationMinutes);
        $this->assertSame(1260, $result->shiftBlocks[0]['duration_minutes']);

        // 21 jam = 3 shift (2 shift x 8 jam = 16 jam, sisa 5 jam = 300 mnt > 43 mnt toleransi => 3 shift)
        $this->assertSame(3, $result->totalShifts, '21 jam tertagih wajib menghasilkan 3 shift.');
    }

    /**
     * Pengujian Unit: Aturan Toleransi Kompensasi 43 Menit Customer
     */
    public function test_calculate_shifts_from_duration_with_43_minutes_tolerance(): void
    {
        // 1. Durasi 0 atau negatif -> minimal 1 shift
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(0, 8, 43));
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(-10, 8, 43));

        // 2. Durasi singkat (1 menit s.d. 8 jam) -> 1 shift
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(1, 8, 43));
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(60, 8, 43));
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(480, 8, 43)); // 8 jam

        // 3. Batas toleransi shift 1 (8 jam 1 mnt s.d. 8 jam 43 mnt) -> 1 shift
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(481, 8, 43));
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(480 + 43, 8, 43)); // 8 jam 43 mnt

        // 4. Melewati toleransi (8 jam 44 mnt) -> 2 shift
        $this->assertSame(2, ReeferShiftCalculationService::calculateShiftsFromDuration(480 + 44, 8, 43)); // 8 jam 44 mnt
        $this->assertSame(2, ReeferShiftCalculationService::calculateShiftsFromDuration(960, 8, 43)); // 16 jam
        $this->assertSame(2, ReeferShiftCalculationService::calculateShiftsFromDuration(960 + 43, 8, 43)); // 16 jam 43 mnt

        // 5. Shift ke-3 (16 jam 44 mnt) -> 3 shift
        $this->assertSame(3, ReeferShiftCalculationService::calculateShiftsFromDuration(960 + 44, 8, 43));

        // 6. Kasus 152 Jam (19 Shift x 8 Jam):
        // 152 jam 43 mnt -> 19 shift (masih toleransi)
        $this->assertSame(19, ReeferShiftCalculationService::calculateShiftsFromDuration((152 * 60) + 43, 8, 43));
        // 152 jam 44 mnt -> 20 shift! (lewat toleransi 43 menit)
        $this->assertSame(20, ReeferShiftCalculationService::calculateShiftsFromDuration((152 * 60) + 44, 8, 43));

        // 7. Kasus Nyata Kontainer 159 Jam 34 Menit -> 20 shift
        $this->assertSame(20, ReeferShiftCalculationService::calculateShiftsFromDuration((159 * 60) + 34, 8, 43));

        // 8. Akhir siklus shift 20: 160 Jam 43 Menit -> 20 shift, 160 Jam 44 Menit -> 21 shift
        $this->assertSame(20, ReeferShiftCalculationService::calculateShiftsFromDuration((160 * 60) + 43, 8, 43));
        $this->assertSame(21, ReeferShiftCalculationService::calculateShiftsFromDuration((160 * 60) + 44, 8, 43));
    }

    /**
     * Skenario dengan Format Data Tanggal + Jam Key (Kompatibilitas OrderItemRekamSuhu JSON).
     */
    public function test_hourly_deduction_with_rekam_suhu_array_format(): void
    {
        $plugIn = '2026-10-01 11:00:00';
        $plugOut = '2026-10-01 19:00:00'; // 8 jam = 480 menit

        // Semua jam 11 s.d. 18 terisi (8 jam lengkap)
        $logs = [
            '2026-10-01' => [
                '11:00' => '4.2',
                '12:00' => '4.1',
                '13:00' => '4.0',
                '14:00' => '4.2',
                '15:00' => '4.3',
                '16:00' => '4.1',
                '17:00' => '4.0',
                '18:00' => '4.1',
            ],
        ];

        $result = $this->service->calculate($plugIn, $plugOut, $logs);

        $this->assertSame(1, $result->totalShifts);
        $this->assertSame(0, $result->shiftBlocks[0]['unfilled_hours_count']);
        $this->assertSame(480, $result->totalDurationMinutes);
    }

    /**
     * Edge Case: Waktu Plug Out Lebih Awal dari Plug In (Exception).
     */
    public function test_throws_exception_when_plug_out_is_earlier_than_plug_in(): void
    {
        $plugIn = Carbon::parse('2026-10-02 10:00:00', 'Asia/Jakarta');
        $plugOut = Carbon::parse('2026-10-01 10:00:00', 'Asia/Jakarta');

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Waktu Plug Out tidak boleh lebih awal dari Start Plug In.');

        $this->service->calculate($plugIn, $plugOut, []);
    }

    /**
     * Skenario Running Plug (Kontainer Masih Tercolok / Belum Plug Out).
     */
    public function test_running_plug_calculation_when_plug_out_is_null(): void
    {
        // Plug in 5 jam yang lalu
        $plugIn = Carbon::now('Asia/Jakarta')->subHours(5);

        $result = $this->service->calculate($plugIn, null, []);

        $this->assertTrue($result->isValid);
        $this->assertSame('running_plug', $result->calculationMode);
        $this->assertSame(1, $result->totalShifts);
        $this->assertNull($result->shiftBlocks[0]['end_time']);
    }
}
