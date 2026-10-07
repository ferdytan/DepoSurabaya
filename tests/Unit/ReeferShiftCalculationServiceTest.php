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
        // Shift 8 jam, kompensasi 0 menit (1 shift = 8 jam = 480 menit), toleransi gap 150 menit (2.5 jam)
        $this->service = new ReeferShiftCalculationService(
            shiftDurationHours: 8,
            shiftCompensationMinutes: 0,
            idleGapThresholdMinutes: 150,
            timezone: 'Asia/Jakarta'
        );
    }

    /**
     * Skenario 1:
     * - Plug In: Hari-1 pukul 11:23
     * - Log Suhu: 12:00 s.d. 19:00
     * - Plug Out: Hari-1 pukul 19:00
     * - Hasil yang Diharapkan: 1 Shift
     */
    public function test_skenario_1_produces_exactly_1_shift(): void
    {
        $plugIn = Carbon::parse('2026-10-01 11:23:00', 'Asia/Jakarta');
        $plugOut = Carbon::parse('2026-10-01 19:00:00', 'Asia/Jakarta');

        $logs = [
            '2026-10-01 12:00:00',
            '2026-10-01 13:00:00',
            '2026-10-01 14:00:00',
            '2026-10-01 15:00:00',
            '2026-10-01 16:00:00',
            '2026-10-01 17:00:00',
            '2026-10-01 18:00:00',
            '2026-10-01 19:00:00',
        ];

        $result = $this->service->calculate($plugIn, $plugOut, $logs);

        $this->assertInstanceOf(ShiftCalculationResult::class, $result);
        $this->assertTrue($result->isValid);
        $this->assertFalse($result->isFallback);
        $this->assertSame('log_windowing', $result->calculationMode);
        $this->assertSame(1, $result->totalShifts, 'Skenario 1 wajib menghasilkan tepat 1 Shift.');
        $this->assertCount(1, $result->shiftBlocks);

        $shift1 = $result->shiftBlocks[0];
        $this->assertSame(1, $shift1['shift_number']);
        $this->assertSame('2026-10-01 11:23:00', $shift1['start_time']);
        $this->assertSame('2026-10-01 19:00:00', $shift1['end_time']);
        // 11:23 s.d. 19:00 = 7 jam 37 menit = 457 menit (<= 525 menit)
        $this->assertSame(457, $shift1['duration_minutes']);
        $this->assertSame(1, $shift1['shifts_billed']);
    }

    /**
     * Skenario 2 (Kasus Utama Refactoring):
     * - Plug In: Hari-1 pukul 11:23
     * - Shift 1: 12:00 s.d. 19:00
     * - Jeda (Gap): 19:00 s.d. 23:00 (4 jam tanpa monitoring)
     * - Shift 2: 23:00 s.d. 06:00 (lintas tengah malam ke Hari-2)
     * - Plug Out: Hari-2 pukul 06:05
     * - Total durasi kotor: 18 jam 42 menit (1.122 menit)
     * - Rumus lama menghasilkan 3 shift (overbilling).
     * - Hasil Baru yang Wajib: 2 Shift (bukan 3 shift).
     */
    public function test_skenario_2_produces_exactly_2_shifts_instead_of_3(): void
    {
        $plugIn = Carbon::parse('2026-10-01 11:23:00', 'Asia/Jakarta');
        $plugOut = Carbon::parse('2026-10-02 06:05:00', 'Asia/Jakarta');

        $logs = [
            // Shift 1
            '2026-10-01 12:00:00',
            '2026-10-01 13:00:00',
            '2026-10-01 14:00:00',
            '2026-10-01 15:00:00',
            '2026-10-01 16:00:00',
            '2026-10-01 17:00:00',
            '2026-10-01 18:00:00',
            '2026-10-01 19:00:00',
            // Gap 4 jam (19:00 s.d. 23:00)
            // Shift 2 (Midnight Crossover)
            '2026-10-01 23:00:00',
            '2026-10-02 00:00:00',
            '2026-10-02 01:00:00',
            '2026-10-02 02:00:00',
            '2026-10-02 03:00:00',
            '2026-10-02 04:00:00',
            '2026-10-02 05:00:00',
            '2026-10-02 06:00:00',
        ];

        $result = $this->service->calculate($plugIn, $plugOut, $logs);

        $this->assertTrue($result->isValid);
        $this->assertFalse($result->isFallback);
        $this->assertSame(2, $result->totalShifts, 'Skenario 2 wajib menghasilkan tepat 2 Shift, BUKAN 3 shift!');
        $this->assertCount(2, $result->shiftBlocks, 'Wajib terbagi menjadi tepat 2 blok shift.');

        // Validasi Blok Shift 1
        $shift1 = $result->shiftBlocks[0];
        $this->assertSame(1, $shift1['shift_number']);
        $this->assertSame('2026-10-01 11:23:00', $shift1['start_time']);
        $this->assertSame('2026-10-01 19:00:00', $shift1['end_time']);
        $this->assertSame(457, $shift1['duration_minutes']);
        $this->assertSame(1, $shift1['shifts_billed']);

        // Validasi Blok Shift 2
        $shift2 = $result->shiftBlocks[1];
        $this->assertSame(2, $shift2['shift_number']);
        $this->assertSame('2026-10-01 23:00:00', $shift2['start_time']);
        $this->assertSame('2026-10-02 06:05:00', $shift2['end_time']);
        // 23:00 s.d. 06:05 = 7 jam 5 menit = 425 menit (<= 525 menit)
        $this->assertSame(425, $shift2['duration_minutes']);
        $this->assertSame(1, $shift2['shifts_billed']);

        // Validasi Gap Terdeteksi
        // Total kotor = 1.122 menit (18 jam 42 menit). Aktif = 457 + 425 = 882 menit. Idle = 240 menit.
        $this->assertSame(1122, $result->totalDurationMinutes);
        $this->assertSame(882, $result->activeMonitoringMinutes);
        $this->assertSame(240, $result->idleGapMinutes, 'Gap antara 19:00 s.d. 23:00 adalah 240 menit.');
    }

    /**
     * Skenario dengan Format Data Tanggal + Jam Key (Kompatibilitas OrderItemRekamSuhu).
     */
    public function test_skenario_2_with_rekam_suhu_array_format(): void
    {
        $plugIn = '2026-10-01 11:23:00';
        $plugOut = '2026-10-02 06:05:00';

        $logs = [
            '2026-10-01' => [
                '12:00' => '4.2',
                '13:00' => '4.1',
                '14:00' => '4.0',
                '15:00' => '4.2',
                '16:00' => '4.3',
                '17:00' => '4.1',
                '18:00' => '4.0',
                '19:00' => '4.1',
                '23:00' => '3.9',
            ],
            '2026-10-02' => [
                '00:00' => '3.8',
                '01:00' => '3.9',
                '02:00' => '4.0',
                '03:00' => '4.1',
                '04:00' => '4.0',
                '05:00' => '3.9',
                '06:00' => '3.8',
            ],
        ];

        $result = $this->service->calculate($plugIn, $plugOut, $logs);

        $this->assertSame(2, $result->totalShifts);
        $this->assertCount(2, $result->shiftBlocks);
        $this->assertSame('2026-10-01 11:23:00', $result->shiftBlocks[0]['start_time']);
        $this->assertSame('2026-10-01 19:00:00', $result->shiftBlocks[0]['end_time']);
        $this->assertSame('2026-10-01 23:00:00', $result->shiftBlocks[1]['start_time']);
        $this->assertSame('2026-10-02 06:05:00', $result->shiftBlocks[1]['end_time']);
    }

    /**
     * Edge Case 1: Tidak Ada Log Suhu (Fallback ke Durasi Mentah).
     */
    public function test_fallback_when_no_temperature_logs(): void
    {
        $plugIn = Carbon::parse('2026-10-01 11:23:00', 'Asia/Jakarta');
        $plugOut = Carbon::parse('2026-10-02 06:05:00', 'Asia/Jakarta');

        $result = $this->service->calculate($plugIn, $plugOut, []);

        $this->assertTrue($result->isValid);
        $this->assertTrue($result->isFallback);
        $this->assertSame('raw_duration_fallback', $result->calculationMode);
        // Durasi 1122 menit / 525 menit = 2.137 -> ceil = 3 shift
        $this->assertSame(3, $result->totalShifts);
        $this->assertSame(1122, $result->totalDurationMinutes);
    }

    /**
     * Edge Case 2: Multi-Hari Continuous Tanpa Gap Melebihi Toleransi.
     * Monitoring nonstop selama 17 jam -> 17 jam = 1020 menit.
     * Shift 1 (8h 45m = 525m), Shift 2 sisanya.
     */
    public function test_continuous_monitoring_overflows_into_consecutive_shifts(): void
    {
        $plugIn = Carbon::parse('2026-10-01 08:00:00', 'Asia/Jakarta');
        $plugOut = Carbon::parse('2026-10-02 01:00:00', 'Asia/Jakarta'); // 17 jam kemudian

        $logs = [];
        $current = $plugIn->copy()->addHour(); // mulai 09:00
        while ($current->lt($plugOut)) {
            $logs[] = $current->format('Y-m-d H:i:s');
            $current->addHour(); // log tiap 1 jam
        }

        $result = $this->service->calculate($plugIn, $plugOut, $logs);

        $this->assertTrue($result->isValid);
        $this->assertSame(2, $result->totalShifts);
    }

    /**
     * Edge Case 3: Data Anomali (Log Tidak Berurutan, Duplikat, dan Di Luar Jendela).
     */
    public function test_handles_scrambled_duplicates_and_out_of_range_logs(): void
    {
        $plugIn = Carbon::parse('2026-10-01 08:00:00', 'Asia/Jakarta');
        $plugOut = Carbon::parse('2026-10-01 16:00:00', 'Asia/Jakarta');

        // Log acak, duplikat, dan log dari 3 hari lalu / masa depan
        $scrambledLogs = [
            '2026-09-25 10:00:00', // Anomali: jauh sebelum plug in
            '2026-10-01 12:00:00',
            '2026-10-01 09:00:00',
            '2026-10-01 12:00:00', // Duplikat
            '2026-10-01 14:00:00',
            '2026-10-01 10:00:00',
            '2026-10-05 18:00:00', // Anomali: jauh setelah plug out
        ];

        $result = $this->service->calculate($plugIn, $plugOut, $scrambledLogs);

        $this->assertTrue($result->isValid);
        $this->assertSame(1, $result->totalShifts);
        $this->assertSame(4, $result->logsEvaluatedCount); // Hanya 09:00, 10:00, 12:00, 14:00 yang valid & unik
    }

    /**
     * Edge Case 4: Waktu Plug Out Lebih Awal dari Plug In (Exception).
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
     * Aturan Bisnis: Plug suhu bahkan jika hanya 2 jam (atau sejak menit pertama) tetap terhitung 1 shift (sampai 8 jam).
     */
    public function test_plug_in_short_duration_such_as_2_hours_counts_as_exactly_1_shift(): void
    {
        // 1. Durasi 2 jam tanpa log suhu
        $plugIn2h = Carbon::parse('2026-10-01 08:00:00', 'Asia/Jakarta');
        $plugOut2h = Carbon::parse('2026-10-01 10:00:00', 'Asia/Jakarta');
        $res2h = $this->service->calculate($plugIn2h, $plugOut2h, []);
        $this->assertSame(1, $res2h->totalShifts, 'Durasi 2 jam wajib terhitung 1 shift.');
        $this->assertSame(120, $res2h->totalDurationMinutes);

        // 2. Durasi 2 jam dengan log suhu per jam
        $logs2h = [
            '2026-10-01 08:00:00',
            '2026-10-01 09:00:00',
            '2026-10-01 10:00:00',
        ];
        $res2hLogs = $this->service->calculate($plugIn2h, $plugOut2h, $logs2h);
        $this->assertSame(1, $res2hLogs->totalShifts, 'Durasi 2 jam dengan log suhu wajib terhitung 1 shift.');

        // 3. Durasi sangat singkat (10 menit) sejak menit pertama
        $plugOut10m = Carbon::parse('2026-10-01 08:10:00', 'Asia/Jakarta');
        $res10m = $this->service->calculate($plugIn2h, $plugOut10m, []);
        $this->assertSame(1, $res10m->totalShifts, 'Durasi 10 menit wajib terhitung minimal 1 shift.');

        // 4. Durasi tepat 8 jam (480 menit) -> 1 shift
        $plugOut8h = Carbon::parse('2026-10-01 16:00:00', 'Asia/Jakarta');
        $res8h = $this->service->calculate($plugIn2h, $plugOut8h, []);
        $this->assertSame(1, $res8h->totalShifts, 'Durasi tepat 8 jam wajib terhitung 1 shift.');

        // 5. Durasi 8 jam 1 menit (481 menit) dengan kompensasi 0 menit -> 2 shift
        $plugOut8h1m = Carbon::parse('2026-10-01 16:01:00', 'Asia/Jakarta');
        $res8h1m = $this->service->calculate($plugIn2h, $plugOut8h1m, []);
        $this->assertSame(2, $res8h1m->totalShifts, 'Durasi 8 jam 1 menit dengan kompensasi 0 menit wajib masuk shift ke-2.');
    }

    /**
     * Pengujian Unit: Static Method calculateShiftsFromDuration
     * Memverifikasi aturan bisnis dasar 8 jam + toleransi 45 menit.
     */
    public function test_calculate_shifts_from_duration_static_method_business_rules(): void
    {
        // 1. Durasi 0 atau negatif -> minimal 1 shift
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(0, 8, 45));
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(-10, 8, 45));

        // 2. Durasi singkat (1 menit s.d. 8 jam) -> 1 shift
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(1, 8, 45));
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(60, 8, 45));
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(480, 8, 45)); // 8 jam

        // 3. Batas toleransi shift 1 (8 jam 1 mnt s.d. 8 jam 45 mnt) -> 1 shift
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(481, 8, 45));
        $this->assertSame(1, ReeferShiftCalculationService::calculateShiftsFromDuration(525, 8, 45)); // 8 jam 45 mnt

        // 4. Melewati toleransi (8 jam 46 mnt s.d. 16 jam 45 mnt) -> 2 shift
        $this->assertSame(2, ReeferShiftCalculationService::calculateShiftsFromDuration(526, 8, 45)); // 8 jam 46 mnt
        $this->assertSame(2, ReeferShiftCalculationService::calculateShiftsFromDuration(960, 8, 45)); // 16 jam
        $this->assertSame(2, ReeferShiftCalculationService::calculateShiftsFromDuration(1005, 8, 45)); // 16 jam 45 mnt

        // 5. Shift ke-3 (16 jam 46 mnt) -> 3 shift
        $this->assertSame(3, ReeferShiftCalculationService::calculateShiftsFromDuration(1006, 8, 45));

        // 6. Kasus Uji Permintaan Pengguna: 152 Jam (19 Shift x 8 Jam)
        $this->assertSame(19, ReeferShiftCalculationService::calculateShiftsFromDuration(152 * 60, 8, 45)); // 152 jam 00 mnt -> 19 shift
        $this->assertSame(19, ReeferShiftCalculationService::calculateShiftsFromDuration((152 * 60) + 45, 8, 45)); // 152 jam 45 mnt -> 19 shift (masih toleransi)
        $this->assertSame(20, ReeferShiftCalculationService::calculateShiftsFromDuration((152 * 60) + 46, 8, 45)); // 152 jam 46 mnt -> 20 shift! (lewat 45 mnt)

        // 7. Kasus Nyata Kontainer User: 159 Jam 34 Menit
        // 159 jam 34 menit = (159 * 60) + 34 = 9.574 menit
        $this->assertSame(20, ReeferShiftCalculationService::calculateShiftsFromDuration((159 * 60) + 34, 8, 45));

        // 8. Akhir siklus shift 20 (160 Jam 45 Menit) -> 20 shift, 160 Jam 46 Menit -> 21 shift
        $this->assertSame(20, ReeferShiftCalculationService::calculateShiftsFromDuration((160 * 60) + 45, 8, 45));
        $this->assertSame(21, ReeferShiftCalculationService::calculateShiftsFromDuration((160 * 60) + 46, 8, 45));
    }

    /**
     * Kasus Nyata Permintaan User:
     * Kontainer di-plug 159 jam 34 menit wajib terhitung 20 Shift (bukan 19 shift).
     * Kontainer di-plug 152 jam 46 menit wajib terhitung 20 Shift.
     * Kontainer di-plug 152 jam 45 menit tetap terhitung 19 Shift.
     */
    public function test_kasus_nyata_159_jam_34_menit_produces_20_shifts(): void
    {
        $serviceDefault = new ReeferShiftCalculationService(
            shiftDurationHours: 8,
            shiftCompensationMinutes: 45,
            idleGapThresholdMinutes: 150,
            timezone: 'Asia/Jakarta'
        );

        $plugIn = Carbon::parse('2026-10-01 00:00:00', 'Asia/Jakarta');

        // 1. Kasus 152 jam 45 menit -> 19 shift (toleransi 45 menit)
        $plugOut152h45m = $plugIn->copy()->addHours(152)->addMinutes(45);
        $res152h45m = $serviceDefault->calculate($plugIn, $plugOut152h45m, []);
        $this->assertSame(19, $res152h45m->totalShifts, 'Durasi 152 jam 45 menit wajib terhitung 19 Shift.');

        // 2. Kasus 152 jam 46 menit -> 20 shift (lewat 45 menit langsung 1 shift baru)
        $plugOut152h46m = $plugIn->copy()->addHours(152)->addMinutes(46);
        $res152h46m = $serviceDefault->calculate($plugIn, $plugOut152h46m, []);
        $this->assertSame(20, $res152h46m->totalShifts, 'Durasi 152 jam 46 menit wajib terhitung 20 Shift.');

        // 3. Kasus nyata kontainer user: 159 jam 34 menit -> 20 shift!
        $plugOut159h34m = $plugIn->copy()->addHours(159)->addMinutes(34);
        $res159h34m = $serviceDefault->calculate($plugIn, $plugOut159h34m, []);
        $this->assertSame(20, $res159h34m->totalShifts, 'Durasi 159 jam 34 menit wajib terhitung 20 Shift (BUKAN 19 Shift)!');
        $this->assertSame((159 * 60) + 34, $res159h34m->totalDurationMinutes);
    }

    /**
     * Kasus Monitoring Suhu Berkelanjutan (Continuous) 159 Jam 34 Menit dengan Log Suhu
     * Memastikan 20 blok shift terbentuk rapi: blok 1-19 masing-masing 8 jam (1 shift),
     * dan blok 20 berdurasi sisa 7 jam 34 menit (1 shift), total 20 shift.
     */
    public function test_continuous_monitoring_159_hours_produces_20_blocks(): void
    {
        $serviceDefault = new ReeferShiftCalculationService(
            shiftDurationHours: 8,
            shiftCompensationMinutes: 45,
            idleGapThresholdMinutes: 150,
            timezone: 'Asia/Jakarta'
        );

        $plugIn = Carbon::parse('2026-10-01 00:00:00', 'Asia/Jakarta');
        $plugOut = $plugIn->copy()->addHours(159)->addMinutes(34);

        // Buat log suhu setiap 2 jam secara kontinu tanpa gap
        $logs = [];
        $current = $plugIn->copy()->addHours(2);
        while ($current->lt($plugOut)) {
            $logs[] = $current->format('Y-m-d H:i:s');
            $current->addHours(2);
        }

        $result = $serviceDefault->calculate($plugIn, $plugOut, $logs);

        $this->assertTrue($result->isValid);
        $this->assertSame(20, $result->totalShifts, 'Total shift wajib 20!');
        $this->assertCount(20, $result->shiftBlocks, 'Wajib menghasilkan tepat 20 blok shift.');

        // Cek blok 1 s.d. 19
        for ($i = 0; $i < 19; $i++) {
            $block = $result->shiftBlocks[$i];
            $this->assertSame(1, $block['shifts_billed']);
            $this->assertSame(480, $block['duration_minutes'], "Blok shift ke-" . ($i + 1) . " wajib berdurasi 480 menit (8 jam).");
        }

        // Cek blok 20 (sisa waktu: 159j 34m - 152j = 7j 34m = 454 menit)
        $block20 = $result->shiftBlocks[19];
        $this->assertSame(20, $block20['shift_number']);
        $this->assertSame(1, $block20['shifts_billed']);
        $this->assertSame(454, $block20['duration_minutes'], 'Blok shift ke-20 wajib berdurasi 454 menit (7 jam 34 menit).');
    }
}
