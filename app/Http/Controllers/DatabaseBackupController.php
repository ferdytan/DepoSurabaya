<?php

namespace App\Http\Controllers;

use App\Services\DatabaseBackupService;
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

        return Inertia::render('bckp/index', [
            'backups' => $backups,
            'stats' => [
                'total_count' => count($backups),
                'total_size_bytes' => $totalSizeBytes,
                'total_size_formatted' => $this->backupService->formatBytes($totalSizeBytes),
                'retention_days' => (int) config('backup.retention_days', 14),
                'schedule_time' => '00:01 WIB (Asia/Jakarta)',
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
