<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Backup Storage Path
    |--------------------------------------------------------------------------
    |
    | Direktori penyimpanan privat di luar document root publik.
    | File di direktori ini TIDAK BOLEH dapat diakses langsung oleh browser web.
    |
    */
    'path' => env('BACKUP_STORAGE_PATH', storage_path('app/private/backups')),

    /*
    |--------------------------------------------------------------------------
    | Backup Retention Period (Days)
    |--------------------------------------------------------------------------
    |
    | Jumlah hari retensi file backup sebelum dihapus otomatis.
    | Default adalah 14 hari. Backup terbaru tidak akan dihapus jika backup
    | hari ini gagal.
    |
    */
    'retention_days' => (int) env('BACKUP_RETENTION_DAYS', 14),

    /*
    |--------------------------------------------------------------------------
    | Custom mysqldump Binary Path
    |--------------------------------------------------------------------------
    |
    | Path kustom ke binary mysqldump jika tidak berada di standard PATH.
    | Contoh di cPanel: /usr/bin/mysqldump atau /usr/local/mysql/bin/mysqldump.
    |
    */
    'mysqldump_path' => env('DUMP_BINARY_PATH', null),

    /*
    |--------------------------------------------------------------------------
    | Command Timeout (Seconds)
    |--------------------------------------------------------------------------
    |
    | Batas waktu maksimal eksekusi backup database (dalam detik).
    |
    */
    'timeout' => (int) env('BACKUP_TIMEOUT', 300),
];
