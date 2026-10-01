<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Scheduled Console Tasks
|--------------------------------------------------------------------------
|
| Backup database otomatis setiap hari sesuai jam yang diatur di sistem (/bckp).
| Default: pukul 00:01 WIB (Asia/Jakarta).
| Dilengkapi withoutOverlapping() untuk mencegah eksekusi ganda jika proses
| sebelumnya masih berjalan.
|
*/
$backupTime = (string) \App\Models\Setting::get('backup_schedule_time', '00:01');
if (!preg_match('/^([01][0-9]|2[0-3]):[0-5][0-9]$/', $backupTime)) {
    $backupTime = '00:01';
}

\Illuminate\Support\Facades\Schedule::command('db:backup')
    ->dailyAt($backupTime)
    ->timezone('Asia/Jakarta')
    ->withoutOverlapping();

