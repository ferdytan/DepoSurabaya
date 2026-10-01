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
| Backup database otomatis setiap hari pukul 00:01 WIB (Asia/Jakarta).
| Dilengkapi withoutOverlapping() untuk mencegah eksekusi ganda jika proses
| sebelumnya masih berjalan.
|
*/
\Illuminate\Support\Facades\Schedule::command('db:backup')
    ->dailyAt('00:01')
    ->timezone('Asia/Jakarta')
    ->withoutOverlapping();

