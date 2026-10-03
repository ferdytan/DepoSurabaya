<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    // Menampilkan daftar produk dengan pencarian
    public function index(Request $request)
    {
        // Save current list URL with filters/sorting/pagination to session
        session(['products_index_url' => $request->fullUrl()]);

        $query = Product::query();

        // Search (jika ada)
        if ($request->filled('search')) {
            $query->where('service_type', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $allowedSorts = ['service_type', 'requires_temperature', 'description'];
        if ($request->filled('sort_by')) {
            $sortBy = in_array($request->sort_by, $allowedSorts) ? $request->sort_by : 'service_type';
            $sortDir = $request->input('sort_dir', 'asc');
            $query->orderBy($sortBy, $sortDir);
        }

        // Pagination
        $products = $query->paginate(10)->withQueryString();

        // Kirim ke Inertia
        return inertia('products/index', [
            'products' => $products,
            'filters' => $request->only(['search', 'sort_by', 'sort_dir']),
        ]);
    }


    // Mencari produk untuk autocomplete
    public function search(Request $request)
    {
        $query = $request->input('search');

        $products = Product::when($query, function ($q) use ($query) {
            $q->where('service_type', 'like', "%$query%");
        })->get(['id', 'service_type as name']);

        return response()->json($products);
    }

    // Menampilkan form tambah produk
    public function create(Request $request)
    {
        $returnUrl = $request->input('return_url') ?: session('products_index_url', route('products.index'));
        return Inertia::render('products/create', [
            'return_url' => $returnUrl,
        ]);
    }

    // File: ProductController.php

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_type' => 'required|string|max:255',
            'description' => 'nullable|string',
            'requires_temperature' => 'required|in:0,1', // Terima 0 dan 1
        ]);

        Product::create([
            'service_type' => $validated['service_type'],
            'description' => $validated['description'] ?? null,
            'requires_temperature' => $validated['requires_temperature'], // Gunakan langsung nilai validasi
        ]);

        $returnUrl = $request->input('return_url') ?: session('products_index_url', route('products.index'));

        return redirect()->to($returnUrl)->with('success', 'Product created successfully.');
    }
    
    // Menampilkan form edit produk
    public function edit(Request $request, Product $product)
    {
        $returnUrl = $request->input('return_url') ?: session('products_index_url', route('products.index'));

        return Inertia::render('products/edit', [
            'product' => $product,
            'return_url' => $returnUrl,
        ]);
    }

    // Memperbarui produk
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'service_type' => 'required|string|max:255',
            'description' => 'nullable|string',
            'requires_temperature' => 'required|in:0,1', // Pastikan selalu divalidasi
        ]);

        $product->update([
            'service_type' => $validated['service_type'],
            'description' => $validated['description'] ?? null,
            'requires_temperature' => $validated['requires_temperature'],
        ]);

        $returnUrl = $request->input('return_url') ?: session('products_index_url', route('products.index'));

        return redirect()->to($returnUrl)->with('success', 'Product updated successfully.');
    }

    // Menghapus produk
    public function destroy(Request $request, Product $product)
    {
        $product->delete();
        $returnUrl = $request->input('return_url') ?: session('products_index_url', route('products.index'));
        return redirect()->to($returnUrl)->with('success', 'Product deleted successfully.');
    }
}