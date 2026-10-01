<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use SQLite3;

class DatabaseBackupService
{
    /**
     * Jalankan proses backup database secara utuh:
     * 1. Acquire file lock agar tidak berjalan bersamaan.
     * 2. Ambil konfigurasi database aktif secara dinamis.
     * 3. Tulis ke file sementara (.tmp).
     * 4. Kompresi gzip stream.
     * 5. Validasi exit code & integritas file.
     * 6. Pindahkan ke file final secara atomic.
     * 7. Jalankan retensi backup lama (default 14 hari).
     *
     * @param int|null $retentionDays
     * @return array Metadata file backup yang berhasil dibuat
     * @throws RuntimeException
     */
    public function runBackup(?int $retentionDays = null): array
    {
        $backupDir = config('backup.path', storage_path('app/private/backups'));
        File::ensureDirectoryExists($backupDir, 0750);

        // File lock untuk mencegah proses ganda berjalan bersamaan
        $lockFile = storage_path('framework/database-backup.lock');
        File::ensureDirectoryExists(dirname($lockFile), 0755);
        $lockHandle = fopen($lockFile, 'c+');

        if (!$lockHandle || !flock($lockHandle, LOCK_EX | LOCK_NB)) {
            if ($lockHandle) {
                fclose($lockHandle);
            }
            throw new RuntimeException('Proses backup database sedang berjalan oleh proses lain.');
        }

        $tempFile = null;
        $tempCnfFile = null;
        $tempSqliteFile = null;

        try {
            $connectionName = config('database.default');
            $dbConfig = config("database.connections.{$connectionName}");

            if (!$dbConfig || empty($dbConfig['driver'])) {
                throw new RuntimeException("Konfigurasi koneksi database '{$connectionName}' tidak valid.");
            }

            $driver = strtolower($dbConfig['driver']);
            $now = Carbon::now('Asia/Jakarta');
            $timestamp = $now->format('Y-m-d_H-i-s');

            if ($driver === 'sqlite') {
                $dbName = pathinfo($dbConfig['database'], PATHINFO_FILENAME) ?: 'database';
                $finalFilename = "backup-{$dbName}-{$timestamp}.sqlite.gz";
                $tempFilename = ".tmp-backup-{$dbName}-{$timestamp}.sqlite.gz";
                $tempFile = $backupDir . DIRECTORY_SEPARATOR . $tempFilename;
                $finalFile = $backupDir . DIRECTORY_SEPARATOR . $finalFilename;

                $this->backupSqlite($dbConfig, $tempFile, $tempSqliteFile);
            } elseif (in_array($driver, ['mysql', 'mariadb'])) {
                $dbName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $dbConfig['database'] ?? 'db');
                $finalFilename = "backup-{$dbName}-{$timestamp}.sql.gz";
                $tempFilename = ".tmp-backup-{$dbName}-{$timestamp}.sql.gz";
                $tempFile = $backupDir . DIRECTORY_SEPARATOR . $tempFilename;
                $finalFile = $backupDir . DIRECTORY_SEPARATOR . $finalFilename;

                $this->backupMysql($dbConfig, $tempFile, $tempCnfFile);
            } else {
                throw new RuntimeException("Driver database '{$driver}' belum didukung untuk backup otomatis.");
            }

            // Validasi integritas file hasil dump
            if (!file_exists($tempFile) || filesize($tempFile) === 0) {
                throw new RuntimeException('File backup sementara kosong atau gagal dibuat.');
            }

            // Pindahkan file sementara ke nama file final secara atomic
            if (!rename($tempFile, $finalFile)) {
                throw new RuntimeException('Gagal memindahkan file backup sementara ke file final.');
            }

            chmod($finalFile, 0640);

            $fileSize = filesize($finalFile);
            $formattedSize = $this->formatBytes($fileSize);

            Log::info("Database backup sukses: {$finalFilename} ({$formattedSize})", [
                'driver' => $driver,
                'connection' => $connectionName,
                'timestamp' => $timestamp,
            ]);

            // Jalankan pembersihan retensi HANYA setelah backup hari ini sukses
            $days = $retentionDays ?? (int) \App\Models\Setting::get('backup_retention_days', config('backup.retention_days', 14));
            $this->pruneOldBackups($days);

            return [
                'filename' => $finalFilename,
                'filepath' => $finalFile,
                'size_bytes' => $fileSize,
                'size_formatted' => $formattedSize,
                'created_at' => $now->format('Y-m-d H:i:s'),
                'driver' => $driver,
            ];
        } catch (\Throwable $e) {
            // Bersihkan file sementara jika terjadi kegagalan
            if ($tempFile && file_exists($tempFile)) {
                @unlink($tempFile);
            }
            if ($tempSqliteFile && file_exists($tempSqliteFile)) {
                @unlink($tempSqliteFile);
            }

            Log::error("Database backup gagal: " . $e->getMessage(), [
                'connection' => config('database.default'),
            ]);

            throw $e;
        } finally {
            // Bersihkan file cnf sementara agar kredensial tidak tertinggal di filesystem
            if ($tempCnfFile && file_exists($tempCnfFile)) {
                @unlink($tempCnfFile);
            }

            flock($lockHandle, LOCK_UN);
            fclose($lockHandle);
        }
    }

    /**
     * Backup database MySQL/MariaDB menggunakan mysqldump.
     * Menggunakan file konfigurasi sementara (--defaults-extra-file) agar password tidak pernah
     * terlihat di process table (ps aux) atau log sistem.
     */
    protected function backupMysql(array $config, string $tempGzFile, ?string &$tempCnfFile): void
    {
        $mysqldump = $this->locateMysqldumpBinary();

        $host = $config['host'] ?? '127.0.0.1';
        $port = (string) ($config['port'] ?? 3306);
        $username = $config['username'] ?? 'root';
        $password = $config['password'] ?? '';
        $database = $config['database'] ?? '';
        $charset = $config['charset'] ?? 'utf8mb4';
        $socket = $config['unix_socket'] ?? '';

        // Tulis kredensial ke cnf sementara dengan hak akses 0600
        $tempCnfFile = tempnam(sys_get_temp_dir(), 'depo_bk_cnf_');
        chmod($tempCnfFile, 0600);

        $cnfContent = "[client]\n";
        $cnfContent .= "user=\"" . addcslashes($username, "\"\\") . "\"\n";
        $cnfContent .= "password=\"" . addcslashes($password, "\"\\") . "\"\n";
        if (!empty($socket)) {
            $cnfContent .= "socket=\"" . addcslashes($socket, "\"\\") . "\"\n";
        } else {
            $cnfContent .= "host=\"" . addcslashes($host, "\"\\") . "\"\n";
            $cnfContent .= "port={$port}\n";
        }

        file_put_contents($tempCnfFile, $cnfContent);

        // Buka file target gz untuk streaming output mysqldump
        $gzHandle = gzopen($tempGzFile, 'wb9');
        if (!$gzHandle) {
            throw new RuntimeException("Gagal membuka file tujuan kompresi gzip: {$tempGzFile}");
        }

        // Susun command mysqldump yang ramah InnoDB dan konsisten
        $command = [
            escapeshellcmd($mysqldump),
            '--defaults-extra-file=' . escapeshellarg($tempCnfFile),
            '--single-transaction',
            '--quick',
            '--skip-lock-tables',
            '--routines',
            '--triggers',
            '--default-character-set=' . escapeshellarg($charset),
            escapeshellarg($database),
        ];

        $cmdString = implode(' ', $command);

        $descriptors = [
            0 => ['pipe', 'r'], // stdin
            1 => ['pipe', 'w'], // stdout (data SQL)
            2 => ['pipe', 'w'], // stderr (error log)
        ];

        $process = proc_open($cmdString, $descriptors, $pipes);

        if (!is_resource($process)) {
            gzclose($gzHandle);
            throw new RuntimeException('Gagal menjalankan proses mysqldump.');
        }

        fclose($pipes[0]);

        // Stream stdout langsung ke file gzip
        while (!feof($pipes[1])) {
            $chunk = fread($pipes[1], 65536);
            if ($chunk !== false && strlen($chunk) > 0) {
                gzwrite($gzHandle, $chunk);
            }
        }

        fclose($pipes[1]);
        gzclose($gzHandle);

        $stderr = stream_get_contents($pipes[2]);
        fclose($pipes[2]);

        $exitCode = proc_close($process);

        if ($exitCode !== 0) {
            // Bersihkan error message dari path cnf sementara agar tidak membocorkan struktur internal
            $sanitizedError = trim(preg_replace('/--defaults-extra-file=[^\s]+/', '--defaults-extra-file=***', $stderr));
            throw new RuntimeException("mysqldump gagal (exit code {$exitCode}): " . ($sanitizedError ?: 'Error tidak diketahui'));
        }
    }

    /**
     * Backup database SQLite aktif menggunakan snapshot VACUUM INTO.
     */
    protected function backupSqlite(array $config, string $tempGzFile, ?string &$tempSqliteFile): void
    {
        $dbPath = $config['database'] ?? null;

        if ($dbPath !== ':memory:' && (!file_exists($dbPath) || !is_readable($dbPath))) {
            throw new RuntimeException("File database SQLite tidak ditemukan atau tidak dapat dibaca: {$dbPath}");
        }

        $tempSqliteFile = tempnam(sys_get_temp_dir(), 'depo_sqlite_snap_');

        // Jika file sementara sudah dibuat oleh tempnam, hapus dulu agar VACUUM INTO bisa menulisnya
        if (file_exists($tempSqliteFile)) {
            @unlink($tempSqliteFile);
        }

        // Jika file database fisik ada, gunakan SQLite3 online backup API agar aman dari transaksi terbuka & WAL
        if ($dbPath && $dbPath !== ':memory:' && file_exists($dbPath)) {
            $src = new SQLite3($dbPath, SQLITE3_OPEN_READONLY);
            $dest = new SQLite3($tempSqliteFile);
            $src->backup($dest);
            $dest->close();
            $src->close();
        } else {
            // Untuk :memory: jalankan VACUUM INTO
            DB::statement('VACUUM INTO ?', [$tempSqliteFile]);
        }

        if (!file_exists($tempSqliteFile) || filesize($tempSqliteFile) === 0) {
            throw new RuntimeException('Snapshot database SQLite gagal dibuat.');
        }

        // Kompresi snapshot SQLite ke file gzip
        $gzHandle = gzopen($tempGzFile, 'wb9');
        if (!$gzHandle) {
            throw new RuntimeException("Gagal membuka file tujuan kompresi gzip: {$tempGzFile}");
        }

        $srcHandle = fopen($tempSqliteFile, 'rb');
        while (!feof($srcHandle)) {
            $chunk = fread($srcHandle, 65536);
            if ($chunk !== false && strlen($chunk) > 0) {
                gzwrite($gzHandle, $chunk);
            }
        }

        fclose($srcHandle);
        gzclose($gzHandle);

        @unlink($tempSqliteFile);
    }

    /**
     * Cari lokasi executable binary mysqldump.
     */
    protected function locateMysqldumpBinary(): string
    {
        $custom = config('backup.mysqldump_path');
        if ($custom && is_executable($custom)) {
            return $custom;
        }

        $candidates = [
            '/usr/bin/mysqldump',
            '/usr/local/bin/mysqldump',
            '/usr/local/mysql/bin/mysqldump',
            '/opt/homebrew/bin/mysqldump',
            '/usr/bin/mariadb-dump',
        ];

        foreach ($candidates as $candidate) {
            if (is_executable($candidate)) {
                return $candidate;
            }
        }

        // Periksa melalui PATH sistem
        $which = trim((string) @shell_exec('which mysqldump 2>/dev/null'));
        if ($which && is_executable($which)) {
            return $which;
        }

        $whichMariadb = trim((string) @shell_exec('which mariadb-dump 2>/dev/null'));
        if ($whichMariadb && is_executable($whichMariadb)) {
            return $whichMariadb;
        }

        throw new RuntimeException(
            "Executable binary 'mysqldump' tidak ditemukan pada server hosting.\n" .
            "Pastikan MySQL Client Tools terpasang atau atur DUMP_BINARY_PATH di konfigurasi / .env."
        );
    }

    /**
     * Dapatkan daftar seluruh file backup yang valid dan siap diunduh.
     * File sementara atau tidak valid akan disaring secara otomatis.
     */
    public function getBackups(): array
    {
        $backupDir = config('backup.path', storage_path('app/private/backups'));

        if (!is_dir($backupDir)) {
            return [];
        }

        $files = File::files($backupDir);
        $backups = [];

        foreach ($files as $file) {
            $filename = $file->getFilename();

            // Abaikan file sementara (.tmp), hidden file, atau ekstensi yang tidak diizinkan
            if (str_starts_with($filename, '.') || str_ends_with($filename, '.tmp')) {
                continue;
            }

            if (!preg_match('/\.(sql\.gz|sqlite\.gz|sql)$/', $filename)) {
                continue;
            }

            $size = $file->getSize();
            if ($size === 0) {
                continue;
            }

            $mtime = $file->getMTime();
            $carbon = Carbon::createFromTimestamp($mtime, 'Asia/Jakarta');

            $backups[] = [
                'id' => $filename,
                'filename' => $filename,
                'size_bytes' => $size,
                'size_formatted' => $this->formatBytes($size),
                'created_at' => $carbon->format('Y-m-d H:i:s'),
                'created_at_human' => $carbon->diffForHumans(),
                'mtime' => $mtime,
                'status' => 'Valid',
            ];
        }

        // Urutkan dari yang paling baru ke paling lama
        usort($backups, fn ($a, $b) => $b['mtime'] <=> $a['mtime']);

        return $backups;
    }

    /**
     * Bersihkan backup yang melebihi batas waktu retensi.
     * Jaminan keamanan: jangan pernah menghapus backup terbaru jika hanya ada 1 backup
     * atau proses hari ini mengalami kegagalan.
     */
    public function pruneOldBackups(int $retentionDays): int
    {
        $backupDir = config('backup.path', storage_path('app/private/backups'));
        if (!is_dir($backupDir) || $retentionDays <= 0) {
            return 0;
        }

        $backups = $this->getBackups();

        // Jika tidak ada backup atau hanya ada 1 backup, jangan hapus apapun
        if (count($backups) <= 1) {
            return 0;
        }

        $cutoffTimestamp = Carbon::now('Asia/Jakarta')->subDays($retentionDays)->timestamp;
        $deletedCount = 0;

        // Amankan backup paling baru (elemen indeks 0) agar tidak pernah terhapus
        $backupsToEvaluate = array_slice($backups, 1);

        foreach ($backupsToEvaluate as $backup) {
            if ($backup['mtime'] < $cutoffTimestamp) {
                $filePath = $backupDir . DIRECTORY_SEPARATOR . $backup['filename'];
                if (file_exists($filePath) && @unlink($filePath)) {
                    $deletedCount++;
                    Log::info("Backup lawas dibersihkan (retensi {$retentionDays} hari): {$backup['filename']}");
                }
            }
        }

        return $deletedCount;
    }

    /**
     * Format ukuran file ke format byte/KB/MB/GB yang mudah dibaca.
     */
    public function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
