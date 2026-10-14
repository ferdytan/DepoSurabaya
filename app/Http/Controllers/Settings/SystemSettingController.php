<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Product;
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

        $rawSetting = Setting::get('karantina_default_product_ids', null);
        if ($rawSetting === null) {
            $defaultKarantinaProductIds = Product::where('service_type', 'like', '%karantina%')
                ->orWhere('service_type', 'like', '%fumigasi%')
                ->pluck('id')
                ->toArray();
        } else {
            $defaultKarantinaProductIds = json_decode($rawSetting, true) ?: [];
        }
        $defaultKarantinaProductIds = array_values(array_filter(array_map('intval', (array) $defaultKarantinaProductIds)));

        $products = Product::orderBy('service_type')->get(['id', 'service_type', 'description']);

        return Inertia::render('settings/system', [
            'settings' => [
                'default_pagination' => (int) Setting::get('default_pagination', 25),
                'default_sidebar_state' => (string) Setting::get('default_sidebar_state', 'expanded'),
                'default_invoice_show_period' => filter_var(Setting::get('default_invoice_show_period', true), FILTER_VALIDATE_BOOLEAN),
                'storage_free_hours' => (int) Setting::get('storage_free_hours', 72),
                'storage_fumigasi_free_hours' => (int) Setting::get('storage_fumigasi_free_hours', 120),
                'karantina_default_product_ids' => $defaultKarantinaProductIds,
            ],
            'products' => $products,
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
            'storage_free_hours' => ['required', 'integer', 'min:0', 'max:720'],
            'storage_fumigasi_free_hours' => ['required', 'integer', 'min:0', 'max:720'],
            'karantina_default_product_ids' => ['nullable', 'array'],
            'karantina_default_product_ids.*' => ['integer', 'exists:products,id'],
        ], [
            'default_pagination.in' => 'Jumlah baris per halaman harus 10, 25, 50, atau 100.',
            'default_sidebar_state.in' => 'Pilihan status navbar harus expanded atau collapsed.',
            'default_invoice_show_period.boolean' => 'Pilihan status periode invoice tidak valid.',
            'storage_free_hours.required' => 'Free time storage biasa wajib diisi.',
            'storage_free_hours.min' => 'Free time storage biasa minimal 0 jam.',
            'storage_fumigasi_free_hours.required' => 'Free time storage fumigasi wajib diisi.',
            'storage_fumigasi_free_hours.min' => 'Free time storage fumigasi minimal 0 jam.',
            'karantina_default_product_ids.array' => 'Format pilihan layanan karantina tidak valid.',
        ]);

        Setting::set('default_pagination', $validated['default_pagination']);
        Setting::set('default_sidebar_state', $validated['default_sidebar_state']);
        Setting::set('default_invoice_show_period', $validated['default_invoice_show_period'] ? '1' : '0');
        Setting::set('storage_free_hours', $validated['storage_free_hours']);
        Setting::set('storage_fumigasi_free_hours', $validated['storage_fumigasi_free_hours']);

        $karantinaIds = $request->input('karantina_default_product_ids', []);
        $cleanKarantinaIds = array_values(array_filter(array_map('intval', (array) $karantinaIds)));
        Setting::set('karantina_default_product_ids', json_encode($cleanKarantinaIds));

        $cookie = cookie(
            'sidebar_state',
            $validated['default_sidebar_state'] === 'expanded' ? 'true' : 'false',
            60 * 24 * 7,
            '/'
        );

        return back()->with('status', 'Pengaturan sistem berhasil diperbarui.')->withCookie($cookie);
    }
}
