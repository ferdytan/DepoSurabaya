<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsSuperAdmin
{
    /**
     * Handle an incoming request.
     * Hanya pengguna dengan peran Super Admin (role_id 1 atau Super User) yang diizinkan lewat.
     * Tamu akan diarahkan ke login, dan pengguna non-superadmin menerima HTTP 403 Forbidden.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        $isSuperAdmin = (int) $user->role_id === 1 || in_array(
            strtolower($user->role?->name ?? ''),
            ['super user', 'superadmin', 'super-admin']
        );

        if (!$isSuperAdmin) {
            abort(403, 'Akses ditolak. Fitur backup database hanya dapat diakses oleh Super Admin.');
        }

        return $next($request);
    }
}
