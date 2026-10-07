<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Services\DatabaseBackupService;
use App\Services\DataSelectiveBackupService;
use App\Services\ExcelDataSyncService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DatabaseBackupController extends Controller
{
    public function __construct(
        protected DatabaseBackupService $backupService,
        protected DataSelectiveBackupService $selectiveService,
        protected ExcelDataSyncService $excelSyncService
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
            'auto_backup' => $this->backupService->getAutoBackupStatus(),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Jalankan backup manual seketika dari tombol UI (Super Admin).
     */
    public function runManual(Request $request): RedirectResponse
    {
        try {
            $result = $this->backupService->runBackup();

            $now = \Carbon\Carbon::now('Asia/Jakarta');
            Setting::set('last_auto_backup_date', $now->toDateString());
            Setting::set('last_auto_backup_at', $now->toDateTimeString());
            Setting::set('last_auto_backup_status', 'success');
            Setting::set('last_auto_backup_file', $result['filename']);

            return back()->with('success', "Backup database berhasil dibuat: {$result['filename']} ({$result['size_formatted']}).");
        } catch (\Throwable $e) {
            return back()->with('error', "Gagal membuat backup database: " . $e->getMessage());
        }
    }

    /**
     * Generate ulang token rahasia cron web (Super Admin).
     */
    public function regenerateToken(Request $request): RedirectResponse
    {
        $newToken = $this->backupService->regenerateCronToken();
        return back()->with('success', 'Token cron berhasil diperbarui.');
    }

    /**
     * Web Cron trigger endpoint (dapat dipanggil oleh cPanel curl/wget atau external uptime/cron monitor).
     */
    public function runCron(Request $request): \Illuminate\Http\JsonResponse
    {
        $token = (string) ($request->query('token') ?: $request->input('token') ?: $request->query('key') ?: $request->input('key'));
        $validToken = $this->backupService->getCronToken();

        if (empty($token) || !hash_equals($validToken, $token)) {
            return response()->json([
                'success' => false,
                'message' => 'Token otentikasi cron tidak valid.',
            ], 403);
        }

        $force = $request->boolean('force', false);

        if (!$force && !$this->backupService->shouldRunAutoBackup()) {
            $status = $this->backupService->getAutoBackupStatus();
            return response()->json([
                'success' => true,
                'message' => 'Backup hari ini sudah tersedia atau belum memasuki jadwal.',
                'data' => $status,
            ]);
        }

        try {
            $result = $this->backupService->runBackup();
            $now = \Carbon\Carbon::now('Asia/Jakarta');
            Setting::set('last_auto_backup_date', $now->toDateString());
            Setting::set('last_auto_backup_at', $now->toDateTimeString());
            Setting::set('last_auto_backup_status', 'success');
            Setting::set('last_auto_backup_file', $result['filename']);

            return response()->json([
                'success' => true,
                'message' => 'Backup database berhasil dieksekusi via cron.',
                'data' => $result,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Eksekusi backup gagal: ' . $e->getMessage(),
            ], 500);
        }
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

    /**
     * API preview hitungan baris untuk seleksi backup / cleanup.
     */
    public function selectivePreview(Request $request): \Illuminate\Http\JsonResponse
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $modules = (array) $request->input('modules', []);

        $result = $this->selectiveService->getPreviewCounts($startDate, $endDate, $modules);

        return response()->json([
            'success' => true,
            'counts' => $result['counts'],
        ]);
    }

    /**
     * Jalankan seleksi backup berdasarkan date range & pilihan modul.
     */
    public function runSelectiveBackup(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date_format:Y-m-d'],
            'modules' => ['required', 'array', 'min:1'],
            'modules.*' => ['string', 'in:orders,containers,temperature_records,invoices,customers,shippers,products,users'],
            'template' => ['nullable', 'string', 'max:50'],
        ]);

        try {
            $startDate = $validated['start_date'] ?? null;
            $endDate = $validated['end_date'] ?? null;
            $modules = $validated['modules'];
            $template = $validated['template'] ?? 'Custom Selection';

            $result = $this->selectiveService->generateSelectiveBackup($startDate, $endDate, $modules, $template);

            $rangeLabel = ($startDate ?: 'Awal Mulai') . ' s/d ' . ($endDate ?: 'Sekarang');
            return back()->with('success', "Selective Backup '{$template}' ({$rangeLabel}) sukses dibuat: {$result['filename']} ({$result['size_formatted']}, {$result['total_rows']} baris data).");
        } catch (\Throwable $e) {
            return back()->with('error', "Gagal membuat selective backup: " . $e->getMessage());
        }
    }

    /**
     * Jalankan penghapusan data (Clean Up Data) berdasarkan kriteria tanggal & modul.
     */
    public function runCleanup(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date_format:Y-m-d'],
            'modules' => ['required', 'array', 'min:1'],
            'modules.*' => ['string', 'in:orders,containers,temperature_records,invoices,customers,shippers,products,users'],
            'confirmation' => ['required', 'string', 'in:HAPUS DATA,DELETE DATA,DELETE'],
            'safety_backup' => ['nullable', 'boolean'],
        ], [
            'confirmation.in' => 'Konfirmasi kata kunci tidak cocok. Ketik "HAPUS DATA" untuk menyetujui.',
        ]);

        try {
            $startDate = $validated['start_date'] ?? null;
            $endDate = $validated['end_date'] ?? null;
            $modules = $validated['modules'];
            $safetyBackup = $request->boolean('safety_backup', true);

            $res = $this->selectiveService->executeDataCleanup($startDate, $endDate, $modules, $safetyBackup);

            $rangeLabel = ($startDate ?: 'Awal Mulai') . ' s/d ' . ($endDate ?: 'Sekarang');
            $msg = "Clean Up Data ({$rangeLabel}) sukses dilakukan: {$res['deleted_counts']['total_deleted']} total baris data dihapus.";
            if (!empty($res['safety_backup'])) {
                $msg .= " (Safety backup otomatis telah diamankan: {$res['safety_backup']['filename']})";
            }

            return back()->with('success', $msg);
        } catch (\Throwable $e) {
            return back()->with('error', "Clean Up Data gagal: " . $e->getMessage());
        }
    }

    /**
     * Import berkas SQL (.sql / .sql.gz) yang diunggah pengguna atau dari arsip yang sudah ada di server.
     */
    public function importSql(Request $request): RedirectResponse
    {
        $request->validate([
            'sql_file' => ['nullable', 'file', 'max:102400'], // max 100MB
            'existing_filename' => ['nullable', 'string'],
        ]);

        $filePath = null;
        $isUploaded = false;

        try {
            if ($request->hasFile('sql_file')) {
                $file = $request->file('sql_file');
                $ext = strtolower($file->getClientOriginalExtension());
                $origName = $file->getClientOriginalName();

                if (!in_array($ext, ['sql', 'gz'])) {
                    return back()->with('error', 'Format file tidak didukung. Harap unggah berkas berekstensi .sql atau .sql.gz.');
                }

                $tempPath = $file->storeAs('private/temp_imports', 'import_' . time() . '_' . $origName);
                $filePath = storage_path('app/' . $tempPath);
                $isUploaded = true;
            } elseif ($existingName = $request->input('existing_filename')) {
                // Import langsung dari file yang sudah ada di storage backup
                if (!preg_match('/^[a-zA-Z0-9_\-\.]+\.(sql\.gz|sqlite\.gz|sql)$/', $existingName)) {
                    return back()->with('error', 'Nama file arsip tidak valid.');
                }
                $backupDir = config('backup.path', storage_path('app/private/backups'));
                $filePath = $backupDir . DIRECTORY_SEPARATOR . $existingName;
            } else {
                return back()->with('error', 'Harap pilih berkas SQL untuk diunggah atau pilih dari daftar arsip.');
            }

            if (!file_exists($filePath)) {
                return back()->with('error', 'Berkas SQL tidak ditemukan di sistem.');
            }

            $importResult = $this->selectiveService->importSqlFile($filePath);

            $msg = "Import database berhasil! Sebanyak {$importResult['queries_executed']} query SQL dieksekusi.";
            if ($importResult['errors_count'] > 0) {
                $msg .= " (Peringatan: {$importResult['errors_count']} pernyataan diabaikan karena sudah ada atau sintaks non-kritis).";
            }

            return back()->with('success', $msg);
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal memproses import database: ' . $e->getMessage());
        } finally {
            if ($isUploaded && $filePath && file_exists($filePath)) {
                @unlink($filePath);
            }
        }
    }

    /**
     * Unduh template file Excel/CSV resmi untuk entitas master data tertentu.
     */
    public function downloadTemplate(Request $request, string $entity)
    {
        try {
            $template = $this->excelSyncService->getTemplate($entity);
            return response($template['content'], 200, [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => "attachment; filename=\"{$template['filename']}\"",
                'Pragma' => 'no-cache',
                'Expires' => '0',
            ]);
        } catch (\Throwable $e) {
            return back()->with('error', "Gagal mengunduh template: " . $e->getMessage());
        }
    }

    /**
     * Export seluruh data entitas master ke file Excel/CSV.
     */
    public function exportExcel(Request $request, string $entity)
    {
        try {
            $export = $this->excelSyncService->export($entity);
            return response($export['content'], 200, [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => "attachment; filename=\"{$export['filename']}\"",
                'Pragma' => 'no-cache',
                'Expires' => '0',
            ]);
        } catch (\Throwable $e) {
            return back()->with('error', "Gagal mengekspor data: " . $e->getMessage());
        }
    }

    /**
     * Import berkas Excel (.csv / .xlsx) untuk entitas master tertentu.
     */
    public function importExcel(Request $request, string $entity): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:20480'], // max 20MB
        ], [
            'file.required' => 'Pilih berkas Excel / CSV untuk diimpor.',
            'file.file' => 'Berkas yang diunggah tidak valid.',
        ]);

        $file = $request->file('file');
        $ext = strtolower($file->getClientOriginalExtension());
        if (!in_array($ext, ['csv', 'xlsx', 'xls', 'txt'])) {
            return back()->with('error', 'Format file tidak didukung. Harap unggah berkas .csv atau .xlsx.');
        }

        $tempPath = $file->storeAs('private/temp_imports', 'import_excel_' . time() . '_' . $file->getClientOriginalName());
        $fullPath = storage_path('app/' . $tempPath);

        try {
            $result = $this->excelSyncService->import($entity, $fullPath);
            $entityName = $result['entity'];
            $msg = "Import {$entityName} sukses! Total {$result['total']} baris data diproses: {$result['created']} data baru ditambahkan, {$result['updated']} data diperbarui.";
            if ($result['failed'] > 0) {
                $msg .= " ({$result['failed']} baris dilewati/gagal).";
            }
            return back()->with('success', $msg);
        } catch (\Throwable $e) {
            return back()->with('error', "Gagal mengimpor data: " . $e->getMessage());
        } finally {
            if (file_exists($fullPath)) {
                @unlink($fullPath);
            }
        }
    }
}
