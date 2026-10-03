<?php

namespace App\Http\Controllers;

use App\Models\Shipper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShipperController extends Controller
{
    public function index(Request $request)
    {
        session(['shippers_index_url' => $request->fullUrl()]);
        $search = $request->input('search');

        $shippers = Shipper::when($search, function ($query) use ($search) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
        })->paginate(10)->withQueryString();

        return Inertia::render('shippers/index', [
            'shippers' => $shippers,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('shippers/create', [
            'return_url' => $request->input('return_url') ?: session('shippers_index_url', route('shippers.index')),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'address'  => 'nullable|string',
            'city'     => 'nullable|string',
            'province' => 'nullable|string',
            'phone'    => 'nullable|string',
            'email'    => 'nullable|email|unique:shippers,email',
        ]);

        Shipper::create($validated);

        $returnUrl = $request->input('return_url') ?: session('shippers_index_url', route('shippers.index'));
        return redirect()->to($returnUrl)->with('success', 'Shipper created successfully.');
    }

    public function edit(Request $request, Shipper $shipper)
    {
        return Inertia::render('shippers/edit', [
            'shipper' => $shipper,
            'return_url' => $request->input('return_url') ?: session('shippers_index_url', route('shippers.index')),
        ]);
    }

    public function update(Request $request, Shipper $shipper)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'address'  => 'nullable|string',
            'city'     => 'nullable|string',
            'province' => 'nullable|string',
            'phone'    => 'nullable|string',
            'email'    => 'nullable|email|unique:shippers,email,' . $shipper->id,
        ]);

        $shipper->update($validated);

        $returnUrl = $request->input('return_url') ?: session('shippers_index_url', route('shippers.index'));
        return redirect()->to($returnUrl)->with('success', 'Shipper updated successfully.');
    }

    public function destroy(Shipper $shipper)
    {
        $shipper->delete();
        $returnUrl = session('shippers_index_url', route('shippers.index'));
        return redirect()->to($returnUrl)->with('success', 'Shipper deleted successfully.');
    }
}