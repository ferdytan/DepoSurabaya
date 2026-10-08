<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        // Save current list URL with filters/sorting/pagination to session
        session(['users_index_url' => $request->fullUrl()]);

        $search = $request->input('search');
        $defaultPagination = (int) Setting::get('default_pagination', 25);
        $perPage = (int) $request->input('per_page', $defaultPagination);
        if (!in_array($perPage, [10, 25, 50, 100])) {
            $perPage = $defaultPagination;
        }

        $users = User::with('role')
            ->whereDoesntHave('role', function ($q) {
                $q->whereRaw('LOWER(name) = ?', ['ops checker']);
            })
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%$search%")
                      ->orWhere('email', 'like', "%$search%")
                      ->orWhere('username', 'like', "%$search%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function create(Request $request)
    {
        // Sembunyikan peran Ops Checker sementara sampai diaktifkan kembali
        $roles = Role::select('id', 'name')
            ->whereRaw('LOWER(name) != ?', ['ops checker'])
            ->get();

        $returnUrl = $request->input('return_url') ?: session('users_index_url', route('users.index'));

        return Inertia::render('users/create', [
            'roles' => $roles,
            'return_url' => $returnUrl,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', 'min:6'],
            'role_id' => [
                'required',
                'exists:roles,id',
                function ($attribute, $value, $fail) {
                    $role = Role::find($value);
                    if ($role && strtolower($role->name) === 'ops checker') {
                        $fail('Peran Ops Checker dinonaktifkan sementara.');
                    }
                },
            ],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'username.required' => 'Username wajib diisi.',
            'username.unique' => 'Username sudah digunakan.',
            'email.required' => 'Email wajib diisi.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Password wajib diisi.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.min' => 'Password minimal 6 karakter.',
            'role_id.required' => 'Pilih peran / role untuk user ini.',
        ]);

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'email_verified_at' => now(), // langsung verifikasi saat dibuat oleh admin
        ]);

        $returnUrl = $request->input('return_url') ?: session('users_index_url', route('users.index'));

        return redirect()->to($returnUrl)->with('success', "User {$validated['name']} berhasil ditambahkan.");
    }

    /**
     * Handle verify user (mark email_verified_at).
     */
    public function verify(User $user)
    {
        $user->update(['email_verified_at' => now()]);

        return back()->with('success', "Akun {$user->name} berhasil diverifikasi.");
    }

    public function edit(Request $request, User $user)
    {
        // Sembunyikan peran Ops Checker sementara sampai diaktifkan kembali
        $roles = Role::select('id', 'name')
            ->whereRaw('LOWER(name) != ?', ['ops checker'])
            ->get();

        $returnUrl = $request->input('return_url') ?: session('users_index_url', route('users.index'));

        return Inertia::render('users/edit', [
            'user' => $user->only(['id', 'name', 'username', 'email', 'role_id']),
            'roles' => $roles,
            'return_url' => $returnUrl,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'role_id' => [
                'required',
                'exists:roles,id',
                function ($attribute, $value, $fail) {
                    $role = Role::find($value);
                    if ($role && strtolower($role->name) === 'ops checker') {
                        $fail('Peran Ops Checker dinonaktifkan sementara.');
                    }
                },
            ],
            'password' => ['nullable', 'confirmed', 'min:6'],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'username.required' => 'Username wajib diisi.',
            'username.unique' => 'Username sudah digunakan oleh user lain.',
            'email.required' => 'Email wajib diisi.',
            'email.unique' => 'Email sudah digunakan oleh user lain.',
            'role_id.required' => 'Pilih peran / role untuk user ini.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.min' => 'Password minimal 6 karakter.',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'role_id' => $validated['role_id'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        $returnUrl = $request->input('return_url') ?: session('users_index_url', route('users.index'));

        return redirect()->to($returnUrl)->with('success', "Data user {$user->name} berhasil diperbarui.");
    }

    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting own account
        if (auth()->id() === $user->id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $userName = $user->name;
        $user->delete();

        $returnUrl = $request->input('return_url') ?: session('users_index_url', route('users.index'));

        return redirect()->to($returnUrl)->with('success', "User {$userName} berhasil dihapus.");
    }

    public function toggleStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Prevent disabling own account
        if (auth()->id() === $user->id) {
            return back()->with('error', 'Anda tidak dapat mengubah status akun Anda sendiri.');
        }

        $newStatus = !($user->is_active ?? true);
        $user->update(['is_active' => $newStatus]);

        $statusText = $newStatus ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Pengguna {$user->name} berhasil {$statusText}.");
    }

    public function bulkStatus(Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|boolean',
        ]);

        $status = $validated['status'];
        $currentUserId = auth()->id();

        // Update all other users except current user
        User::where('id', '!=', $currentUserId)->update(['is_active' => $status]);

        if ($status) {
            return back()->with('success', 'Semua akun pengguna berhasil diaktifkan.');
        } else {
            return back()->with('success', 'Semua akun pengguna berhasil dinonaktifkan (akun Anda tetap aktif).');
        }
    }
}