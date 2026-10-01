<?php

namespace App\Console\Commands;

use App\Services\DatabaseBackupService;
use Illuminate\Console\Command;
use Throwable;

class DatabaseBackupCommand extends Command
{
    /**
     * Nama dan signature command artisan.
     *
     * @var string
     */
    protected $signature = 'db:backup 
                            {--retention= : Batas hari retensi penyimpanan backup (default: 14 hari)}
                            {--force : Jalankan proses backup tanpa prompt konfirmasi}';

    /**
     * Deskripsi command artisan.
     *
     * @var string
     */
    protected $description = 'Jalankan backup database ke direktori privat yang aman dengan kompresi gzip';

    /**
     * Eksekusi command.
     */
    public function handle(DatabaseBackupService $backupService): int
    {
        $this->info('=============================================');
        $this->info('  Depo Surabaya - Database Backup Service   ');
        $this->info('=============================================');

        $connection = config('database.default');
        $driver = config("database.connections.{$connection}.driver", 'unknown');
        $dbName = config("database.connections.{$connection}.database", 'unknown');

        $this->line("Koneksi Database : <comment>{$connection}</comment> (Driver: {$driver})");
        $this->line("Nama Database    : <comment>{$dbName}</comment>");

        $retentionInput = $this->option('retention');
        $retentionDays = $retentionInput !== null ? (int) $retentionInput : (int) config('backup.retention_days', 14);
        $this->line("Retensi Penyimpanan: <comment>{$retentionDays} hari</comment>");

        $this->line('Memulai proses backup...');

        $startTime = microtime(true);

        try {
            $result = $backupService->runBackup($retentionDays);

            $duration = round(microtime(true) - $startTime, 2);

            $this->newLine();
            $this->info('✔ Backup database berhasil dibuat!');
            $this->table(
                ['Parameter', 'Keterangan'],
                [
                    ['Nama File', $result['filename']],
                    ['Ukuran File', $result['size_formatted'] . " ({$result['size_bytes']} bytes)"],
                    ['Waktu Pembuatan', $result['created_at'] . ' WIB'],
                    ['Driver', $result['driver']],
                    ['Durasi Proses', "{$duration} detik"],
                    ['Lokasi Penyimpanan', dirname($result['filepath'])],
                ]
            );

            return Command::SUCCESS;
        } catch (Throwable $e) {
            $duration = round(microtime(true) - $startTime, 2);

            $this->newLine();
            $this->error('✖ Backup database gagal dijalankan!');
            $this->line("<error>Pesan Error:</error> " . $e->getMessage());
            $this->line("Waktu terhenti setelah {$duration} detik.");

            return Command::FAILURE;
        }
    }
}
