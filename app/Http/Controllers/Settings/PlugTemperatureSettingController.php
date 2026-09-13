<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlugTemperatureSettingController extends Controller
{
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
     * Tampilkan halaman pengaturan shift plug & monitoring temperature.
     */
    public function edit(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        if (!$this->isSuperadmin($user)) {
            return redirect()->route('settings.system')->with('error', 'Hanya Superadmin yang memiliki akses ke Pengaturan Shift Plug Suhu.');
        }

        return Inertia::render('settings/plug-temperature', [
            'settings' => [
                'shift_duration_hours' => (int) Setting::get('shift_duration_hours', 8),
                'shift_compensation_minutes' => (int) Setting::get('shift_compensation_minutes', 45),
            ],
            'status' => session('status'),
        ]);
    }

    /**
     * Perbarui pengaturan shift plug & toleransi waktu reefer.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        if (!$this->isSuperadmin($user)) {
            return back()->with('error', 'Anda tidak memiliki izin untuk mengubah pengaturan ini.');
        }

        $validated = $request->validate([
            'shift_duration_hours' => ['required', 'integer', 'min:1', 'max:24'],
            'shift_compensation_minutes' => ['required', 'integer', 'min:0', 'max:180'],
        ], [
            'shift_duration_hours.required' => 'Durasi kerja per shift wajib diisi.',
            'shift_duration_hours.min' => 'Durasi kerja per shift minimal 1 jam.',
            'shift_duration_hours.max' => 'Durasi kerja per shift maksimal 24 jam.',
            'shift_compensation_minutes.required' => 'Waktu kompensasi/toleransi wajib diisi.',
            'shift_compensation_minutes.min' => 'Waktu kompensasi/toleransi minimal 0 menit.',
            'shift_compensation_minutes.max' => 'Waktu kompensasi/toleransi maksimal 180 menit.',
        ]);

        Setting::set('shift_duration_hours', $validated['shift_duration_hours']);
        Setting::set('shift_compensation_minutes', $validated['shift_compensation_minutes']);

        return back()->with('status', 'Pengaturan shift & kompensasi plug-in suhu berhasil diperbarui.');
    }
}
