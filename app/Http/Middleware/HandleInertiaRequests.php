<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Tambahkan baris ini
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user ? [
                    ...$user->toArray(),
                    'role_id' => $user->role_id,
                    'role_name' => $user->role->name ?? null, // jika relasi role sudah ada di model User.php
                ] : null,

            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => $request->hasCookie('sidebar_state')
                ? $request->cookie('sidebar_state') === 'true'
                : ((string) \App\Models\Setting::get('default_sidebar_state', 'expanded') === 'expanded'),
            'settings' => [
                'default_pagination' => (int) \App\Models\Setting::get('default_pagination', 25),
                'login_image_url' => (string) \App\Models\Setting::get(
                    'login_image_url',
                    'https://images.unsplash.com/photo-1634646809203-f3b4adff9127?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                ),
                'default_sidebar_state' => (string) \App\Models\Setting::get('default_sidebar_state', 'expanded'),
            ],
        ];
    }
}
