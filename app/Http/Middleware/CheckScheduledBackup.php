<?php

namespace App\Http\Middleware;

use App\Services\DatabaseBackupService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckScheduledBackup
{
    public function __construct(
        protected DatabaseBackupService $backupService
    ) {}

    /**
     * Loloskan request segera agar response browser tidak terhambat sama sekali.
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    /**
     * Eksekusi di background setelah response HTTP selesai dikirim ke browser pengguna.
     * Ini memastikan auto backup berjalan oportunistik tanpa memperlambat pengalaman pengguna.
     */
    public function terminate(Request $request, Response $response): void
    {
        // Abaikan request untuk download file, asset statis, atau cron endpoint itu sendiri
        if ($request->is('bckp/download/*', 'build/*', 'storage/*', 'cron/*')) {
            return;
        }

        try {
            $this->backupService->runAutoBackupIfDue();
        } catch (\Throwable $e) {
            // Tangkap exception agar siklus terminate tidak menyebabkan fatal error di level web server
        }
    }
}
