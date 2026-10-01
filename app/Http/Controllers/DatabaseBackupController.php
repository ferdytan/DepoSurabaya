<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Services\DatabaseBackupService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DatabaseBackupController extends Controller
{
    public function __construct(
        protected DatabaseBackupService $backupService
    ) {}

    /**
     * Tampilkan halaman daftar backup database.
     * Hanya dapat diakses oleh Super Admin.
     */
    public function index(Request $request): Response
    {
        $backups = $this->backupService->getBackups();

        $totalSizeBytes = array_sum(array_column($backups, 'size_bytes'));
        $connection = config('database.default');
        $driver = config("database.connections.{$connection}.driver", 'unknown');
        $database = config("database.connections.{$connection}.database", 'unknown');

        $scheduleTime = (string) Setting::get('backup_schedule_time', '00:01');
        if (!preg_match('/^([01][0-9]|2[0-3]):[0-5][0-9]$/', $scheduleTime)) {
            $scheduleTime = '00:01';
        }
        $retentionDays = (int) Setting::get('backup_retention_days', config('backup.retention_days', 14));

        return Inertia::render('bckp/index', [
            'backups' => $backups,
            'stats' => [
                'total_count' => count($backups),
                'total_size_bytes' => $totalSizeBytes,
                'total_size_formatted' => $this->backupService->formatBytes($totalSizeBytes),
                'retention_days' => $retentionDays,
                'schedule_time' => "{$scheduleTime} WIB (Asia/Jakarta)",
                'raw_schedule_time' => $scheduleTime,
                'active_connection' => $connection,
                'active_driver' => strtoupper($driver),
                'active_database' => $database,
                'storage_relative_path' => 'storage/app/private/backups/',
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Perbarui pengaturan jam backup otomatis dan retensi penyimpanan.
     */
    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'schedule_time' => ['required', 'regex:/^([01][0-9]|2[0-3]):[0-5][0-9]$/'],
            'retention_days' => ['required', 'integer', 'min:1', 'max:365'],
        ], [
            'schedule_time.required' => 'Waktu backup wajib diisi.',
            'schedule_time.regex' => 'Format waktu backup harus format jam HH:MM (contoh: 00:01 atau 02:30).',
            'retention_days.required' => 'Masa retensi wajib diisi.',
            'retention_days.min' => 'Masa retensi minimal 1 hari.',
            'retention_days.max' => 'Masa retensi maksimal 365 hari.',
        ]);

        Setting::set('backup_schedule_time', $validated['schedule_time']);
        Setting::set('backup_retention_days', $validated['retention_days']);

        return back()->with('success', "Pengaturan berhasil diperbarui: Jadwal backup pukul {$validated['schedule_time']} WIB, retensi {$validated['retention_days']} hari.");
    }

    /**
     * Unduh file backup secara aman.
     * Menggunakan validasi ketat, perlindungan path traversal, dan header no-store.
     */
    public function download(Request $request, string $file): BinaryFileResponse
    {
        // 1. Validasi karakter nama file (hanya alfanumerik, dash, underscore, dan titik)
        if (!preg_match('/^[a-zA-Z0-9_\-\.]+$/', $file)) {
            abort(400, 'Format nama file tidak valid.');
        }

        // 2. Cegah file tersembunyi atau file sementara
        if (str_starts_with($file, '.') || str_ends_with($file, '.tmp')) {
            abort(403, 'File sementara tidak diizinkan untuk diunduh.');
        }

        // 3. Batasi ekstensi yang diizinkan
        if (!preg_match('/\.(sql\.gz|sqlite\.gz|sql)$/', $file)) {
            abort(400, 'Format ekstensi file backup tidak diizinkan.');
        }

        $backupDir = config('backup.path', storage_path('app/private/backups'));
        $realBackupDir = realpath($backupDir);

        if (!$realBackupDir || !is_dir($realBackupDir)) {
            abort(404, 'Direktori penyimpanan backup tidak ditemukan.');
        }

        $filePath = realpath($realBackupDir . DIRECTORY_SEPARATOR . $file);

        // 4. Perlindungan Path Traversal: pastikan file berada strictly di dalam direktori backup privat
        if (!$filePath || !str_starts_with($filePath, $realBackupDir . DIRECTORY_SEPARATOR)) {
            abort(403, 'Akses file di luar direktori backup tidak diizinkan.');
        }

        // 5. Pastikan file fisik ada dan dapat dibaca
        if (!is_file($filePath) || !is_readable($filePath)) {
            abort(404, 'File backup tidak ditemukan atau tidak dapat dibaca.');
        }

        // 6. Response download aman dengan header no-store (tanpa mengekspos URL file publik)
        return response()->download($filePath, $file, [
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'Expires' => '0',
            'Content-Type' => 'application/gzip',
        ]);
    }
}
