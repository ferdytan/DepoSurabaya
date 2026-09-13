<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoginImageSettingController extends Controller
{
    const DEFAULT_LOGIN_IMAGE = 'https://images.unsplash.com/photo-1634646809203-f3b4adff9127?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    /**
     * Helper validasi peran Superadmin (Role 1 atau nama Super User / Superadmin)
     */
    protected function isSuperadmin(?object $user): bool
    {
        if (!$user) {
            return false;
        }
        if ((int) $user->role_id === 1) {
            return true;
        }
        $roleName = strtolower($user->role?->name ?? $user->role_name ?? '');
        return in_array($roleName, ['super user', 'superadmin', 'super-admin']);
    }

    /**
     * Tampilkan halaman pengaturan gambar layar login.
     */
    public function edit(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        if (!$this->isSuperadmin($user)) {
            return redirect()->route('settings.system')->with('error', 'Hanya Superadmin yang memiliki akses ke Pengaturan Gambar Login.');
        }

        return Inertia::render('settings/login-image', [
            'settings' => [
                'login_image_url' => (string) Setting::get('login_image_url', self::DEFAULT_LOGIN_IMAGE),
            ],
            'default_login_image' => self::DEFAULT_LOGIN_IMAGE,
            'status' => session('status'),
        ]);
    }

    /**
     * Perbarui pengaturan gambar layar login.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        if (!$this->isSuperadmin($user)) {
            return back()->with('error', 'Anda tidak memiliki izin untuk mengubah pengaturan ini.');
        }

        $validated = $request->validate([
            'login_image_url' => ['required', 'url', 'max:1000'],
        ], [
            'login_image_url.required' => 'URL gambar login wajib diisi.',
            'login_image_url.url' => 'Format URL gambar login tidak valid.',
        ]);

        Setting::set('login_image_url', $validated['login_image_url']);

        return back()->with('status', 'Pengaturan gambar latar belakang login berhasil diperbarui.');
    }
}
