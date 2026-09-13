<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SystemSettingController extends Controller
{
    const DEFAULT_LOGIN_IMAGE = 'https://images.unsplash.com/photo-1634646809203-f3b4adff9127?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    /**
     * Show the system settings page.
     */
    public function edit(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        // Hanya Superadmin (1) atau Admin (2) yang bisa mengubah pengaturan sistem
        if (!$user || !in_array($user->role_id, [1, 2])) {
            return redirect()->route('profile.edit')->with('error', 'Anda tidak memiliki akses ke Pengaturan Sistem.');
        }

        return Inertia::render('settings/system', [
            'settings' => [
                'default_pagination' => (int) Setting::get('default_pagination', 25),
                'login_image_url' => (string) Setting::get('login_image_url', self::DEFAULT_LOGIN_IMAGE),
                'default_sidebar_state' => (string) Setting::get('default_sidebar_state', 'expanded'),
                'shift_duration_hours' => (int) Setting::get('shift_duration_hours', 8),
                'shift_compensation_minutes' => (int) Setting::get('shift_compensation_minutes', 45),
            ],
            'default_login_image' => self::DEFAULT_LOGIN_IMAGE,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the system settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        if (!$user || !in_array($user->role_id, [1, 2])) {
            return back()->with('error', 'Anda tidak memiliki izin untuk mengubah pengaturan sistem.');
        }

        $validated = $request->validate([
            'default_pagination' => ['required', 'integer', 'in:10,25,50,100'],
            'login_image_url' => ['required', 'url', 'max:1000'],
            'default_sidebar_state' => ['required', 'string', 'in:expanded,collapsed'],
            'shift_duration_hours' => ['required', 'integer', 'min:1', 'max:24'],
            'shift_compensation_minutes' => ['required', 'integer', 'min:0', 'max:180'],
        ], [
            'default_pagination.in' => 'Jumlah baris per halaman harus 10, 25, 50, atau 100.',
            'login_image_url.required' => 'URL gambar login wajib diisi.',
            'login_image_url.url' => 'Format URL gambar login tidak valid.',
            'default_sidebar_state.in' => 'Pilihan status navbar harus expanded atau collapsed.',
            'shift_duration_hours.required' => 'Durasi kerja per shift wajib diisi.',
            'shift_duration_hours.min' => 'Durasi kerja per shift minimal 1 jam.',
            'shift_duration_hours.max' => 'Durasi kerja per shift maksimal 24 jam.',
            'shift_compensation_minutes.required' => 'Waktu kompensasi/toleransi wajib diisi.',
            'shift_compensation_minutes.min' => 'Waktu kompensasi/toleransi minimal 0 menit.',
            'shift_compensation_minutes.max' => 'Waktu kompensasi/toleransi maksimal 180 menit.',
        ]);

        Setting::set('default_pagination', $validated['default_pagination']);
        Setting::set('login_image_url', $validated['login_image_url']);
        Setting::set('default_sidebar_state', $validated['default_sidebar_state']);
        Setting::set('shift_duration_hours', $validated['shift_duration_hours']);
        Setting::set('shift_compensation_minutes', $validated['shift_compensation_minutes']);

        $cookie = cookie(
            'sidebar_state',
            $validated['default_sidebar_state'] === 'expanded' ? 'true' : 'false',
            60 * 24 * 7,
            '/'
        );

        return back()->with('status', 'Pengaturan sistem berhasil diperbarui.')->withCookie($cookie);
    }
}
