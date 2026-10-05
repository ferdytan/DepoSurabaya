<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class DataSelectiveBackupService
{
    /**
     * Tabel-tabel yang didukung untuk seleksi backup / cleanup.
     */
    public const MODULE_ORDERS = 'orders';
    public const MODULE_INVOICES = 'invoices';
    public const MODULE_CONTAINERS = 'containers'; // order_items + records
    public const MODULE_TEMP_RECORDS = 'temperature_records';

    /**
     * Hitung preview estimasi data yang akan di-backup / di-cleanup berdasarkan filter.
     */
    public function getPreviewCounts(
        ?string $startDate,
        ?string $endDate,
        array $selectedModules = []
    ): array {
        if (empty($selectedModules)) {
            $selectedModules = [self::MODULE_ORDERS, self::MODULE_CONTAINERS, self::MODULE_TEMP_RECORDS, self::MODULE_INVOICES];
        }

        $orderIds = $this->queryOrderIds($startDate, $endDate);
        $orderItemIds = $this->queryOrderItemIds($orderIds, $startDate, $endDate);
        $invoiceIds = $this->queryInvoiceIds($orderItemIds, $startDate, $endDate);

        $counts = [
            'orders' => 0,
            'order_items' => 0,
            'order_item_rekam_suhus' => 0,
            'reefer_temperature_logs' => 0,
            'temperature_records' => 0,
            'order_item_additional_products' => 0,
            'invoices' => 0,
            'invoice_items' => 0,
            'activity_logs' => 0,
            'total_rows' => 0,
        ];

        if (in_array(self::MODULE_ORDERS, $selectedModules, true)) {
            $counts['orders'] = count($orderIds);
        }

        if (in_array(self::MODULE_CONTAINERS, $selectedModules, true) || in_array(self::MODULE_ORDERS, $selectedModules, true)) {
            $counts['order_items'] = count($orderItemIds);

            if (!empty($orderItemIds)) {
                $counts['order_item_rekam_suhus'] = DB::table('order_item_rekam_suhus')
                    ->whereIn('order_item_id', $orderItemIds)
                    ->count();

                $counts['reefer_temperature_logs'] = DB::table('reefer_temperature_logs')
                    ->whereIn('order_item_id', $orderItemIds)
                    ->count();

                $counts['order_item_additional_products'] = DB::table('order_item_additional_products')
                    ->whereIn('order_item_id', $orderItemIds)
                    ->count();
            }
        }

        if (in_array(self::MODULE_TEMP_RECORDS, $selectedModules, true) || in_array(self::MODULE_ORDERS, $selectedModules, true)) {
            $tempQuery = DB::table('temperature_records');
            if ($startDate && $endDate) {
                $tempQuery->whereBetween('record_date', [$startDate, $endDate]);
            } elseif ($startDate) {
                $tempQuery->where('record_date', '>=', $startDate);
            } elseif ($endDate) {
                $tempQuery->where('record_date', '<=', $endDate);
            }
            if (!empty($orderIds)) {
                $tempQuery->orWhereIn('id_order', $orderIds);
            }
            $counts['temperature_records'] = $tempQuery->count();
        }

        if (in_array(self::MODULE_INVOICES, $selectedModules, true)) {
            $counts['invoices'] = count($invoiceIds);
            if (!empty($invoiceIds)) {
                $counts['invoice_items'] = DB::table('invoice_items')
                    ->whereIn('invoice_id', $invoiceIds)
                    ->count();

                $counts['activity_logs'] = DB::table('activity_logs')
                    ->where('model_type', 'Invoice')
                    ->whereIn('model_id', $invoiceIds)
                    ->count();
            }
        }

        $counts['total_rows'] = array_sum($counts);

        return [
            'counts' => $counts,
            'order_ids' => $orderIds,
            'order_item_ids' => $orderItemIds,
            'invoice_ids' => $invoiceIds,
        ];
    }

    /**
     * Jalankan seleksi data dan dump ke berkas SQL (.sql.gz) yang valid dan siap di-restore via mysqldump/mysql CLI/phpMyAdmin.
     */
    public function generateSelectiveBackup(
        ?string $startDate,
        ?string $endDate,
        array $selectedModules = [],
        string $templateName = 'Custom Filter'
    ): array {
        if (empty($selectedModules)) {
            $selectedModules = [self::MODULE_ORDERS, self::MODULE_CONTAINERS, self::MODULE_TEMP_RECORDS, self::MODULE_INVOICES];
        }

        $backupDir = config('backup.path', storage_path('app/private/backups'));
        File::ensureDirectoryExists($backupDir, 0750);

        $now = Carbon::now('Asia/Jakarta');
        $dateLabel = ($startDate ?: 'awal') . '_sd_' . ($endDate ?: 'akhir');
        $dateLabel = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $dateLabel);
        $timestamp = $now->format('Y-m-d_H-i-s');
        $filename = "selective-backup-{$dateLabel}-{$timestamp}.sql.gz";
        $tempGzFile = $backupDir . DIRECTORY_SEPARATOR . ".tmp-{$filename}";
        $finalFile = $backupDir . DIRECTORY_SEPARATOR . $filename;

        $gz = gzopen($tempGzFile, 'wb9');
        if (!$gz) {
            throw new RuntimeException("Gagal membuka stream file gzip: {$tempGzFile}");
        }

        $preview = $this->getPreviewCounts($startDate, $endDate, $selectedModules);
        $orderIds = $preview['order_ids'];
        $orderItemIds = $preview['order_item_ids'];
        $invoiceIds = $preview['invoice_ids'];

        try {
            // 1. Tulis Header SQL Standar
            $header = "-- =====================================================================\n"
                . "-- Depo Surabaya Selective Database Backup\n"
                . "-- Template: {$templateName}\n"
                . "-- Date Range: " . ($startDate ?: 'Awal Mulai') . " s/d " . ($endDate ?: 'Sekarang') . "\n"
                . "-- Generated At: " . $now->format('Y-m-d H:i:s') . " WIB\n"
                . "-- Modules: " . implode(', ', $selectedModules) . "\n"
                . "-- Safe Note: Tables structure, Users, Customers, Shippers & Products PRESERVED\n"
                . "-- =====================================================================\n\n"
                . "SET NAMES utf8mb4;\n"
                . "SET FOREIGN_KEY_CHECKS = 0;\n"
                . "SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\n"
                . "SET AUTOCOMMIT = 0;\n"
                . "START TRANSACTION;\n\n";
            gzwrite($gz, $header);

            // 2. Dump Orders (jika dipilih)
            if (in_array(self::MODULE_ORDERS, $selectedModules, true) && !empty($orderIds)) {
                $this->dumpTableRows($gz, 'orders', 'id', $orderIds);
            }

            // 3. Dump Order Items & Child Records
            if ((in_array(self::MODULE_CONTAINERS, $selectedModules, true) || in_array(self::MODULE_ORDERS, $selectedModules, true)) && !empty($orderItemIds)) {
                $this->dumpTableRows($gz, 'order_items', 'id', $orderItemIds);
                $this->dumpTableRows($gz, 'order_item_additional_products', 'order_item_id', $orderItemIds);
                $this->dumpTableRows($gz, 'order_item_rekam_suhus', 'order_item_id', $orderItemIds);
                $this->dumpTableRows($gz, 'reefer_temperature_logs', 'order_item_id', $orderItemIds);
            }

            // 4. Dump Temperature Records format harian
            if (in_array(self::MODULE_TEMP_RECORDS, $selectedModules, true) || in_array(self::MODULE_ORDERS, $selectedModules, true)) {
                $tempQuery = DB::table('temperature_records');
                if ($startDate && $endDate) {
                    $tempQuery->whereBetween('record_date', [$startDate, $endDate]);
                } elseif ($startDate) {
                    $tempQuery->where('record_date', '>=', $startDate);
                } elseif ($endDate) {
                    $tempQuery->where('record_date', '<=', $endDate);
                }
                if (!empty($orderIds)) {
                    $tempQuery->orWhereIn('id_order', $orderIds);
                }
                $tempIds = $tempQuery->pluck('id')->all();
                if (!empty($tempIds)) {
                    $this->dumpTableRows($gz, 'temperature_records', 'id', $tempIds);
                }
            }

            // 5. Dump Invoices & Invoice Items
            if (in_array(self::MODULE_INVOICES, $selectedModules, true) && !empty($invoiceIds)) {
                $this->dumpTableRows($gz, 'invoices', 'id', $invoiceIds);
                $this->dumpTableRows($gz, 'invoice_items', 'invoice_id', $invoiceIds);
                $this->dumpTableRows($gz, 'activity_logs', 'model_id', $invoiceIds, function ($q) {
                    $q->where('model_type', 'Invoice');
                });
            }

            // 6. Tulis Footer Commit
            $footer = "\nCOMMIT;\n"
                . "SET FOREIGN_KEY_CHECKS = 1;\n"
                . "-- Selective Backup Finished at " . Carbon::now('Asia/Jakarta')->format('Y-m-d H:i:s') . " WIB --\n";
            gzwrite($gz, $footer);
            gzclose($gz);

            if (!file_exists($tempGzFile) || filesize($tempGzFile) === 0) {
                throw new RuntimeException('File hasil backup sementara kosong.');
            }

            if (!rename($tempGzFile, $finalFile)) {
                throw new RuntimeException('Gagal memindahkan file backup sementara.');
            }

            chmod($finalFile, 0640);
            $size = filesize($finalFile);

            return [
                'filename' => $filename,
                'filepath' => $finalFile,
                'size_bytes' => $size,
                'size_formatted' => $this->formatBytes($size),
                'created_at' => $now->format('Y-m-d H:i:s'),
                'total_rows' => $preview['counts']['total_rows'],
                'counts' => $preview['counts'],
            ];
        } catch (\Throwable $e) {
            gzclose($gz);
            if (file_exists($tempGzFile)) {
                @unlink($tempGzFile);
            }
            throw $e;
        }
    }

    /**
     * Jalankan pembersihan/penghapusan data (Clean Up Data) secara aman dalam transaksi database.
     * Tidak akan menyentuh tabel customer, shipper, product, user, role, settings, dsb.
     */
    public function executeDataCleanup(
        ?string $startDate,
        ?string $endDate,
        array $selectedModules = [],
        bool $createSafetyBackupFirst = true
    ): array {
        if (empty($selectedModules)) {
            $selectedModules = [self::MODULE_ORDERS, self::MODULE_CONTAINERS, self::MODULE_TEMP_RECORDS, self::MODULE_INVOICES];
        }

        $safetyBackupInfo = null;
        if ($createSafetyBackupFirst) {
            $safetyBackupInfo = $this->generateSelectiveBackup(
                $startDate,
                $endDate,
                $selectedModules,
                'Auto-Safety-Before-Cleanup'
            );
        }

        $preview = $this->getPreviewCounts($startDate, $endDate, $selectedModules);
        $orderIds = $preview['order_ids'];
        $orderItemIds = $preview['order_item_ids'];
        $invoiceIds = $preview['invoice_ids'];

        $deletedCounts = [
            'orders' => 0,
            'order_items' => 0,
            'order_item_rekam_suhus' => 0,
            'reefer_temperature_logs' => 0,
            'temperature_records' => 0,
            'order_item_additional_products' => 0,
            'invoices' => 0,
            'invoice_items' => 0,
            'activity_logs' => 0,
            'total_deleted' => 0,
        ];

        DB::beginTransaction();
        try {
            // A. Hapus Invoice & Relasinya
            if (in_array(self::MODULE_INVOICES, $selectedModules, true) && !empty($invoiceIds)) {
                $deletedCounts['activity_logs'] += DB::table('activity_logs')
                    ->where('model_type', 'Invoice')
                    ->whereIn('model_id', $invoiceIds)
                    ->delete();

                $deletedCounts['invoice_items'] += DB::table('invoice_items')
                    ->whereIn('invoice_id', $invoiceIds)
                    ->delete();

                $deletedCounts['invoices'] += DB::table('invoices')
                    ->whereIn('id', $invoiceIds)
                    ->delete();
            }

            // B. Hapus Child Records dari Order Items (jika container atau order dipilih)
            if ((in_array(self::MODULE_CONTAINERS, $selectedModules, true) || in_array(self::MODULE_ORDERS, $selectedModules, true)) && !empty($orderItemIds)) {
                // Jika invoice TIDAK ikut dipilih, detach / bersihkan invoice_items yang mengarah ke orderItem ini agar tidak melanggar foreign key
                $deletedCounts['invoice_items'] += DB::table('invoice_items')
                    ->whereIn('order_item_id', $orderItemIds)
                    ->delete();

                $deletedCounts['order_item_rekam_suhus'] += DB::table('order_item_rekam_suhus')
                    ->whereIn('order_item_id', $orderItemIds)
                    ->delete();

                $deletedCounts['reefer_temperature_logs'] += DB::table('reefer_temperature_logs')
                    ->whereIn('order_item_id', $orderItemIds)
                    ->delete();

                $deletedCounts['order_item_additional_products'] += DB::table('order_item_additional_products')
                    ->whereIn('order_item_id', $orderItemIds)
                    ->delete();

                $deletedCounts['order_items'] += DB::table('order_items')
                    ->whereIn('id', $orderItemIds)
                    ->delete();
            }

            // C. Hapus Temperature Records
            if (in_array(self::MODULE_TEMP_RECORDS, $selectedModules, true) || in_array(self::MODULE_ORDERS, $selectedModules, true)) {
                $tempQuery = DB::table('temperature_records');
                if ($startDate && $endDate) {
                    $tempQuery->whereBetween('record_date', [$startDate, $endDate]);
                } elseif ($startDate) {
                    $tempQuery->where('record_date', '>=', $startDate);
                } elseif ($endDate) {
                    $tempQuery->where('record_date', '<=', $endDate);
                }
                if (!empty($orderIds)) {
                    $tempQuery->orWhereIn('id_order', $orderIds);
                }
                $deletedCounts['temperature_records'] += $tempQuery->delete();
            }

            // D. Hapus Orders
            if (in_array(self::MODULE_ORDERS, $selectedModules, true) && !empty($orderIds)) {
                // Pastikan order_items sisa di order ini terhapus
                DB::table('order_items')->whereIn('order_id', $orderIds)->delete();
                $deletedCounts['orders'] += DB::table('orders')->whereIn('id', $orderIds)->delete();
            }

            $deletedCounts['total_deleted'] = array_sum($deletedCounts);

            DB::commit();

            Log::info('Data cleanup berhasil dieksekusi', [
                'range' => ($startDate ?: 'awal') . ' s/d ' . ($endDate ?: 'akhir'),
                'modules' => $selectedModules,
                'counts' => $deletedCounts,
            ]);

            return [
                'success' => true,
                'deleted_counts' => $deletedCounts,
                'safety_backup' => $safetyBackupInfo,
            ];
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Data cleanup gagal di-rollback: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Dapatkan ID orders yang cocok dengan kriteria tanggal.
     */
    protected function queryOrderIds(?string $startDate, ?string $endDate): array
    {
        $query = DB::table('orders')
            ->select('orders.id')
            ->distinct();

        if ($startDate || $endDate) {
            $query->leftJoin('order_items', 'orders.id', '=', 'order_items.order_id')
                ->where(function ($q) use ($startDate, $endDate) {
                    // Cek entry_date di item
                    $q->where(function ($sub) use ($startDate, $endDate) {
                        if ($startDate && $endDate) {
                            $sub->whereBetween('order_items.entry_date', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
                        } elseif ($startDate) {
                            $sub->where('order_items.entry_date', '>=', $startDate . ' 00:00:00');
                        } elseif ($endDate) {
                            $sub->where('order_items.entry_date', '<=', $endDate . ' 23:59:59');
                        }
                    });

                    // Cek created_at di order jika item belum ada
                    $q->orWhere(function ($sub) use ($startDate, $endDate) {
                        if ($startDate && $endDate) {
                            $sub->whereBetween('orders.created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
                        } elseif ($startDate) {
                            $sub->where('orders.created_at', '>=', $startDate . ' 00:00:00');
                        } elseif ($endDate) {
                            $sub->where('orders.created_at', '<=', $endDate . ' 23:59:59');
                        }
                    });
                });
        }

        return $query->pluck('id')->all();
    }

    /**
     * Dapatkan ID order items yang cocok.
     */
    protected function queryOrderItemIds(array $orderIds, ?string $startDate, ?string $endDate): array
    {
        $query = DB::table('order_items')->select('id');

        if (!empty($orderIds)) {
            $query->whereIn('order_id', $orderIds);
        } elseif ($startDate || $endDate) {
            if ($startDate && $endDate) {
                $query->whereBetween('entry_date', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
            } elseif ($startDate) {
                $query->where('entry_date', '>=', $startDate . ' 00:00:00');
            } elseif ($endDate) {
                $query->where('entry_date', '<=', $endDate . ' 23:59:59');
            }
        }

        return $query->pluck('id')->all();
    }

    /**
     * Dapatkan ID invoice yang terkait dengan item order atau berdasarkan rentang tanggal invoice.
     */
    protected function queryInvoiceIds(array $orderItemIds, ?string $startDate, ?string $endDate): array
    {
        $query = DB::table('invoices')->select('id')->distinct();

        $query->where(function ($q) use ($orderItemIds, $startDate, $endDate) {
            if (!empty($orderItemIds)) {
                $q->whereIn('id', function ($sub) use ($orderItemIds) {
                    $sub->select('invoice_id')
                        ->from('invoice_items')
                        ->whereIn('order_item_id', $orderItemIds);
                });
            }

            if ($startDate || $endDate) {
                $q->orWhere(function ($sub) use ($startDate, $endDate) {
                    if ($startDate && $endDate) {
                        $sub->where(function ($sub2) use ($startDate, $endDate) {
                            $sub2->whereBetween('period_start', [$startDate, $endDate])
                                ->orWhereBetween('period_end', [$startDate, $endDate])
                                ->orWhereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
                        });
                    } elseif ($startDate) {
                        $sub->where('period_start', '>=', $startDate)
                            ->orWhere('created_at', '>=', $startDate . ' 00:00:00');
                    } elseif ($endDate) {
                        $sub->where('period_end', '<=', $endDate)
                            ->orWhere('created_at', '<=', $endDate . ' 23:59:59');
                    }
                });
            }
        });

        return $query->pluck('id')->all();
    }

    /**
     * Dump sekumpulan baris dari tabel tertentu ke stream gzip dalam format INSERT INTO ... VALUES.
     */
    protected function dumpTableRows(
        $gz,
        string $tableName,
        string $columnKey,
        array $keyValues,
        ?callable $extraCondition = null
    ): void {
        if (empty($keyValues)) {
            return;
        }

        $chunkSize = 200;
        $chunks = array_chunk($keyValues, $chunkSize);

        gzwrite($gz, "\n-- -----------------------------------------------------\n");
        gzwrite($gz, "-- Data for table `{$tableName}`\n");
        gzwrite($gz, "-- -----------------------------------------------------\n");

        foreach ($chunks as $chunk) {
            $query = DB::table($tableName)->whereIn($columnKey, $chunk);
            if ($extraCondition) {
                $extraCondition($query);
            }

            $rows = $query->get();
            if ($rows->isEmpty()) {
                continue;
            }

            $firstRow = (array) $rows->first();
            $columns = array_keys($firstRow);
            $quotedColumns = array_map(fn($col) => "`{$col}`", $columns);
            $colList = implode(', ', $quotedColumns);

            gzwrite($gz, "INSERT INTO `{$tableName}` ({$colList}) VALUES\n");

            $valueLines = [];
            foreach ($rows as $row) {
                $rowArray = (array) $row;
                $escapedValues = [];
                foreach ($columns as $col) {
                    $val = $rowArray[$col] ?? null;
                    if ($val === null) {
                        $escapedValues[] = 'NULL';
                    } elseif (is_numeric($val) && !is_string($val)) {
                        $escapedValues[] = $val;
                    } else {
                        // Escape string aman untuk MySQL
                        $escaped = addcslashes((string) $val, "\0\n\r\t\\'\"");
                        $escapedValues[] = "'{$escaped}'";
                    }
                }
                $valueLines[] = '(' . implode(', ', $escapedValues) . ')';
            }

            gzwrite($gz, implode(",\n", $valueLines) . "\nON DUPLICATE KEY UPDATE `{$columnKey}` = `{$columnKey}`;\n");
        }
    }

    /**
     * Format bytes ke string yang manusiawi (KB, MB, GB).
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
