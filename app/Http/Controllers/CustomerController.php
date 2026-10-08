<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CustomerProduct;
class CustomerController extends Controller
{
    public function index(Request $request)
    {
        session(['customers_index_url' => $request->fullUrl()]);
        $search = $request->input('search');

        $customers = Customer::when($search, function ($query) use ($search) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
        })->paginate(10)->withQueryString();

        return Inertia::render('customers/index', [
            'customers' => $customers,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('customers/create', [
            'return_url' => $request->input('return_url') ?: session('customers_index_url', route('customers.index')),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'province' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email|unique:customers,email',

            // Produk + Harga Custom (opsional untuk backward-compatibility)
            'product_prices' => 'array|nullable',
            'product_prices.*.product_id' => 'exists:products,id',
            'product_prices.*.price_20ft' => 'numeric|nullable',
            'product_prices.*.price_40ft' => 'numeric|nullable',
            'product_prices.*.price_45ft' => 'numeric|nullable',
            'product_prices.*.price_global' => 'numeric|nullable',
        ]);

        $customer = Customer::create([
            'name' => $validated['name'],
            'address' => $validated['address'] ?? null,
            'city' => $validated['city'] ?? null,
            'province' => $validated['province'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
        ]);

        if (!empty($validated['product_prices'])) {
            foreach ($validated['product_prices'] as $item) {
                $customer->products()->attach($item['product_id'], [
                    'custom_price_20ft' => $item['price_20ft'] ?? null,
                    'custom_price_40ft' => $item['price_40ft'] ?? null,
                    'custom_price_45ft' => $item['price_45ft'] ?? null,
                    'custom_global_price' => $item['price_global'] ?? null,
                ]);
            }
        }

        $returnUrl = $request->input('return_url') ?: session('customers_index_url', route('customers.index'));
        return redirect()->to($returnUrl)->with('success', 'Customer created successfully.');
    }

    public function edit(Request $request, Customer $customer)
    {
        $specialPricesCount = $customer->products()->count();

        return Inertia::render('customers/edit', [
            'customer' => $customer,
            'special_prices_count' => $specialPricesCount,
            'return_url' => $request->input('return_url') ?: session('customers_index_url', route('customers.index')),
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'province' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => "nullable|email|unique:customers,email,{$customer->id}",

            // Produk + Harga Custom (opsional)
            'product_prices' => 'array|nullable',
            'product_prices.*.product_id' => 'exists:products,id',
            'product_prices.*.price_20ft' => 'numeric|nullable',
            'product_prices.*.price_40ft' => 'numeric|nullable',
            'product_prices.*.price_45ft' => 'numeric|nullable',
            'product_prices.*.price_global' => 'numeric|nullable',
        ]);

        $customer->update([
            'name' => $validated['name'],
            'address' => $validated['address'] ?? null,
            'city' => $validated['city'] ?? null,
            'province' => $validated['province'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
        ]);

        if ($request->has('product_prices') && is_array($validated['product_prices'])) {
            $customer->products()->detach();
            foreach ($validated['product_prices'] as $item) {
                $customer->products()->attach($item['product_id'], [
                    'custom_price_20ft' => $item['price_20ft'] ?? null,
                    'custom_price_40ft' => $item['price_40ft'] ?? null,
                    'custom_price_45ft' => $item['price_45ft'] ?? null,
                    'custom_global_price' => $item['price_global'] ?? null,
                ]);
            }
        }

        $returnUrl = $request->input('return_url') ?: session('customers_index_url', route('customers.index'));
        return redirect()->to($returnUrl)->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        $returnUrl = session('customers_index_url', route('customers.index'));
        return redirect()->to($returnUrl)->with('success', 'Customer deleted successfully.');
    }

    // API: Seluruh produk yang tersedia untuk customer beserta resolusi harga (khusus vs master)
    public function productsForCustomer(Customer $customer)
    {
        // Ambil seluruh produk master aktif
        $allProducts = Product::orderBy('service_type')->get();

        // Ambil mapping harga khusus untuk customer ini jika ada di customer_product
        $customPrices = collect();
        try {
            $customPrices = $customer->products()
                ->withPivot(['custom_price_20ft', 'custom_price_40ft', 'custom_price_45ft', 'custom_global_price'])
                ->get()
                ->keyBy('id');
        } catch (\Throwable $e) {
            \Log::error('Error fetching customer special prices: ' . $e->getMessage());
        }

        $result = $allProducts->map(function ($product) use ($customPrices) {
            $custom = $customPrices->get($product->id);
            $hasCustom = $custom !== null;

            $masterPrice = $product->price 
                ?? $product->price_global 
                ?? $product->price_20ft 
                ?? $product->price_40ft 
                ?? $product->price_45ft 
                ?? 0;

            // Prioritas harga khusus customer
            $customPriceVal = null;
            if ($hasCustom && $custom->pivot) {
                $customPriceVal = $custom->pivot->custom_global_price 
                    ?? $custom->pivot->custom_price_20ft 
                    ?? $custom->pivot->custom_price_40ft 
                    ?? $custom->pivot->custom_price_45ft;
            }

            $effectivePrice = ($hasCustom && $customPriceVal !== null && $customPriceVal !== '')
                ? $customPriceVal
                : $masterPrice;

            return [
                'id' => $product->id,
                'service_type' => $product->service_type,
                'requires_temperature' => (bool) $product->requires_temperature,
                'price' => $masterPrice,
                'effective_price' => (string) $effectivePrice,
                'custom_price_20ft' => (string) $effectivePrice,
                'custom_price_40ft' => (string) $effectivePrice,
                'custom_price_45ft' => (string) $effectivePrice,
                'custom_global_price' => (string) $effectivePrice,
                'is_special_price' => $hasCustom && $customPriceVal !== null && (float)$customPriceVal > 0,
            ];
        });

        return response()->json($result);
    }
}