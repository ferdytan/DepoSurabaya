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
    /**
     * Show the system settings page.
     */
    public function edit(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        // Hanya Superadmin (1) atau Admin (2) yang bisa mengubah pengaturan sistem umum
        if (!$user || !in_array($user->role_id, [1, 2])) {
            return redirect()->route('profile.edit')->with('error', 'Anda tidak memiliki akses ke Pengaturan Sistem.');
        }

        return Inertia::render('settings/system', [
            'settings' => [
                'default_pagination' => (int) Setting::get('default_pagination', 25),
                'default_sidebar_state' => (string) Setting::get('default_sidebar_state', 'expanded'),
                'default_invoice_show_period' => filter_var(Setting::get('default_invoice_show_period', true), FILTER_VALIDATE_BOOLEAN),
            ],
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
            'default_sidebar_state' => ['required', 'string', 'in:expanded,collapsed'],
            'default_invoice_show_period' => ['required', 'boolean'],
        ], [
            'default_pagination.in' => 'Jumlah baris per halaman harus 10, 25, 50, atau 100.',
            'default_sidebar_state.in' => 'Pilihan status navbar harus expanded atau collapsed.',
            'default_invoice_show_period.boolean' => 'Pilihan status periode invoice tidak valid.',
        ]);

        Setting::set('default_pagination', $validated['default_pagination']);
        Setting::set('default_sidebar_state', $validated['default_sidebar_state']);
        Setting::set('default_invoice_show_period', $validated['default_invoice_show_period'] ? '1' : '0');

        $cookie = cookie(
            'sidebar_state',
            $validated['default_sidebar_state'] === 'expanded' ? 'true' : 'false',
            60 * 24 * 7,
            '/'
        );

        return back()->with('status', 'Pengaturan sistem berhasil diperbarui.')->withCookie($cookie);
    }
}
