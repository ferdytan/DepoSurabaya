<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\Order;   // <-- tambahkan baris ini
use App\Models\ActivityLog;

use NumberToWords\NumberToWords;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $trashed = $request->boolean('trashed', false);

        $invoices = Invoice::with([
                'customer:id,name'  // hanya ambil id dan name
            ])
            ->withCount('items as items_count')
            ->when($trashed, function ($query) {
                $query->onlyTrashed();
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $lowerSearch = strtolower($search);
                    $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn($q) => $q->whereRaw('LOWER(name) LIKE ?', ["%{$lowerSearch}%"]))
                    ->orWhereHas('items', fn($q) => $q->where('container_number', 'like', "%{$search}%"))
                    ->orWhereHas('items', function ($q) use ($search) {
                        $q->whereRaw("JSON_CONTAINS(additional_products, ?)", ['"' . $search . '"']);
                    })
                    ->orWhereRaw("LOWER(status) LIKE ?", ["%{$lowerSearch}%"])
                    ->orWhereRaw("CAST(grand_total AS CHAR) LIKE ?", ["%{$search}%"]);
                });
            })
            ->orderByDesc('created_at')
            ->paginate(20)
            ->appends(['search' => $search, 'trashed' => $trashed ? '1' : '']);

        $invoiceIds = $invoices->pluck('id');

        // Ambil log delete untuk trashed invoice
        $deleteLogs = collect();
        if ($trashed && $invoiceIds->isNotEmpty()) {
            $deleteLogs = ActivityLog::where('model_type', 'Invoice')
                ->where('action', 'delete_invoice')
                ->whereIn('model_id', $invoiceIds)
                ->with('user:id,name')
                ->latest()
                ->get()
                ->groupBy('model_id');
        }

        // Ambil log reuse untuk melihat invoice mana yang pernah di-reuse
        $reuseLogs = collect();
        if (!$trashed && $invoiceIds->isNotEmpty()) {
            $reuseLogs = ActivityLog::where('model_type', 'Invoice')
                ->where('action', 'reuse_invoice')
                ->whereIn('model_id', $invoiceIds)
                ->with('user:id,name')
                ->latest()
                ->get()
                ->groupBy('model_id');
        }

        // Hitung additional_qty_total & sematkan data log
        $invoices->getCollection()->transform(function ($inv) use ($trashed, $deleteLogs, $reuseLogs) {
            $total = 0;
            foreach ($inv->items as $item) {
                $adds = $item->additional_products ?? [];
                foreach ($adds as $ap) {
                    $qty = $ap['pivot']['quantity'] ?? $ap['quantity'] ?? 1;
                    $total += (int)$qty;
                }
            }
            $inv->additional_qty_total = $total;
            unset($inv->items); // agar tidak dikirim ke frontend

            if ($trashed) {
                $delLog = $deleteLogs->get($inv->id)?->first();
                $inv->deleted_by = $delLog?->new_values['deleted_by'] ?? $delLog?->user?->name ?? 'Admin';
            } else {
                $reuseLog = $reuseLogs->get($inv->id)?->first();
                if ($reuseLog) {
                    $inv->is_reused = true;
                    $inv->reused_by = $reuseLog->new_values['reused_by'] ?? $reuseLog->user?->name ?? 'Admin';
                    $inv->reused_at = $reuseLog->new_values['reused_at'] ?? $reuseLog->created_at?->toDateTimeString();
                }
            }

            return $inv;
        });

        return Inertia::render('invoices/index', [
            'invoices' => $invoices,
            'filters' => [
                'search' => $search,
                'trashed' => $trashed ? '1' : '',
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }


    protected function companyInfo(): array
    {
        return [
            'name' => 'PT. DEPO SURABAYA SEJAHTERA',
            'address' => 'Jl. Tanjung Sadari No. 90',
            'phone' => '031-353 9484, 031-3539485',
            'fax' => '031-3539482',
        ];
    }

    public function create(Request $request)
    {
        $reuseInvoice = null;
        $reuseId = $request->query('reuse_id');
        if ($reuseId) {
            $user = auth()->user();
            if (!$user || (!in_array($user->role_id, [1, 2]) && !in_array($user->role?->name, ['Super User', 'Admin']))) {
                return redirect()->route('invoices.index')->with('error', 'Anda tidak memiliki izin untuk me-reuse invoice.');
            }

            $found = Invoice::withTrashed()->with(['customer', 'items.orderItem.order'])->find($reuseId);
            if ($found) {
                $firstOrder = $found->firstOrder();
                $reuseInvoice = [
                    'id' => $found->id,
                    'invoice_number' => $found->invoice_number,
                    'customer_id' => $found->customer_id,
                    'customer_name' => $found->customer?->name,
                    'order_id' => $firstOrder?->id,
                    'period_start' => $found->period_start ? substr($found->period_start, 0, 10) : null,
                    'period_end' => $found->period_end ? substr($found->period_end, 0, 10) : null,
                ];
                $invoiceNumber = $found->invoice_number;
            }
        }

        // Ambil semua customer dengan order dan order_items serta relasi terkait
        $customers = Customer::with([
            'orders.order_items.product', // Muat produk untuk setiap order_item
            'orders.order_items.additionalProducts' // Muat produk tambahan untuk setiap order_item
        ])->get();

        // Modifikasi data $customers untuk menambahkan container_number ke level order
        // agar sesuai dengan ekspektasi frontend (CreateInvoice.tsx)
        $customers->transform(function ($customer) {
            $customer->orders->transform(function ($order) {
                // Tambahkan properti container_number ke objek order
                // berdasarkan container_number dari order_items-nya.
                if ($order->order_items->isNotEmpty()) {
                    // Contoh: ambil container_number dari item pertama
                    $order->container_number = $order->order_items->first()->container_number ?? '-';
                } else {
                    $order->container_number = 'Tidak ada kontainer';
                }

                return $order;
            });
            return $customer;
        });

        if (!$reuseInvoice) {
            // Auto-generate invoice number
            $prefix = 'IN-1';
            $date = now()->format('m/Y');
            $latestInvoice = Invoice::where('invoice_number', 'like', "$prefix-$date-%")->first();
            $nextNumber = $latestInvoice ? ((int)substr($latestInvoice->invoice_number, -4)) + 1 : 1;
            $invoiceNumber = "$prefix-$date-" . sprintf("%04d", $nextNumber);
        }

        return Inertia::render('invoices/create', [
            'customers' => $customers, // Data customer yang sudah dimodifikasi
            'invoice_number' => $invoiceNumber,
            'reuse_invoice' => $reuseInvoice,
        ]);
    }
    
    public function store(Request $request)
    {
        $data = $request->validate([
            'reuse_id'      => ['nullable','integer'],
            'customer_id'   => ['required','integer','exists:customers,id'],
            'period_start'  => ['required','date'],
            'period_end'    => ['required','date','after_or_equal:period_start'],
            'order_item_ids'=> ['required','array','min:1'],
            'order_item_ids.*' => ['integer'],
            'subtotal'      => ['required','integer','min:0'],
            'discount'      => ['nullable','integer','min:0'],
            'ppn'           => ['required','integer','min:0'],
            'materai'       => ['required','integer','min:0'],
            'grand_total'   => ['required','integer','min:0'],
            'additional_product_quantities' => ['array'],
            'additional_product_quantities.*.order_item_id' => ['required','integer'],
            'additional_product_quantities.*.additional_product_id' => ['required','integer'],
            'additional_product_quantities.*.quantity' => ['required','integer','min:0'],
            'show_period'   => ['boolean'],
        ]);

        return DB::transaction(function () use ($data) {
            $qtyMap = [];
            foreach (($data['additional_product_quantities'] ?? []) as $row) {
                $qtyMap[$row['order_item_id'].':'.$row['additional_product_id']] = (int) $row['quantity'];
            }

            $orderItems = OrderItem::with([
                'product:id,service_type',
                'additionalProducts' => fn($q) => $q->withPivot(['price_value']),
            ])->whereIn('id', $data['order_item_ids'])->get();

            if ($orderItems->isEmpty()) {
                abort(422, 'Order item tidak ditemukan.');
            }

            // Hitung ulang subtotal, ppn, grand_total
            $subtotal = 0;
            foreach ($orderItems as $oi) {
                $subtotal += (int) ($oi->price_value ?? 0);
                foreach ($oi->additionalProducts as $ap) {
                    $price = (int) ($ap->pivot->price_value ?? 0);
                    $qty = (int) ($qtyMap[$oi->id.':'.$ap->id] ?? 0);
                    $subtotal += $price * $qty;
                }
            }
            $discount = (int) ($data['discount'] ?? 0);
            $materai = (int) ($data['materai'] ?? 0);
            $afterDiscount = max(0, $subtotal - $discount);
            $ppn     = (int) round($afterDiscount * 0.11);
            $grand   = $afterDiscount + $ppn + $materai;

            // VALIDASI: Pastikan grand_total dari client cocok
            if ($grand !== (int)$data['grand_total']) {
                throw ValidationException::withMessages([
                    'grand_total' => ['Grand total tidak valid. Terjadi manipulasi data.']
                ]);
            }

            // GENERATE terbilang DI SERVER
            $terbilang = $this->numberToWords($grand);

            $reuseId = $data['reuse_id'] ?? null;
            $isReuse = false;

            if ($reuseId) {
                $user = auth()->user();
                if (!$user || (!in_array($user->role_id, [1, 2]) && !in_array($user->role?->name, ['Super User', 'Admin']))) {
                    abort(403, 'Anda tidak memiliki izin untuk me-reuse invoice.');
                }

                $invoice = Invoice::withTrashed()->findOrFail($reuseId);
                if ($invoice->trashed()) {
                    $invoice->restore();
                }

                // Hapus item-item lama
                $invoice->items()->delete();

                // Update invoice dengan data baru (tetap mempertahankan nomor invoice lama)
                $invoice->update([
                    'customer_id'    => (int) $data['customer_id'],
                    'period_start'   => $data['period_start'],
                    'period_end'     => $data['period_end'],
                    'subtotal'       => $subtotal,
                    'discount'       => $discount,
                    'ppn'            => $ppn,
                    'materai'        => $materai,
                    'grand_total'    => $grand,
                    'terbilang'      => $terbilang,
                    'status'         => 'unpaid',
                    'show_period'    => (bool) ($data['show_period'] ?? true),
                    'deleted_reason' => null,
                ]);

                $isReuse = true;
            } else {
                $invoiceNumber = $this->generateInvoiceNumber((int)$data['customer_id'], $data['period_start']);

                $invoice = Invoice::create([
                    'invoice_number' => $invoiceNumber,
                    'customer_id'    => (int) $data['customer_id'],
                    'period_start'   => $data['period_start'],
                    'period_end'     => $data['period_end'],
                    'subtotal'       => $subtotal,
                    'discount'       => $discount,
                    'ppn'            => $ppn,
                    'materai'        => $materai,
                    'grand_total'    => $grand,
                    'terbilang'      => $terbilang,
                    'status'         => 'unpaid',
                    'show_period'    => (bool) ($data['show_period'] ?? true),
                ]);
            }

            foreach ($orderItems as $oi) {
                $invItem = $invoice->items()->create([
                    'order_item_id'    => $oi->id,
                    'product_id'       => $oi->product_id,
                    'container_number' => $oi->container_number,
                    'price_type'       => $oi->price_type,
                    'price_value'      => $oi->price_value,
                    'quantity'         => 1,
                ]);

                $adds = [];
                foreach ($oi->additionalProducts as $ap) {
                    $key = $oi->id.':'.$ap->id;
                    $qty = (int) ($qtyMap[$key] ?? 1);
                    $adds[] = [
                        'id'           => $ap->id,
                        'service_type' => $ap->service_type,
                        'pivot'        => [
                            'price_value' => (int) ($ap->pivot->price_value ?? 0),
                            'quantity'    => $qty,
                        ],
                    ];
                }
                $invItem->additional_products = $adds;
                $invItem->save();
            }

            if ($isReuse) {
                ActivityLog::log(
                    'reuse_invoice',
                    'Invoice',
                    $invoice->id,
                    null,
                    [
                        'reused_by' => auth()->user()?->name ?? 'System',
                        'invoice_number' => $invoice->invoice_number,
                        'customer_id' => $invoice->customer_id,
                        'grand_total' => $invoice->grand_total,
                        'reused_at' => now()->toDateTimeString(),
                    ]
                );

                $msg = "Invoice {$invoice->invoice_number} berhasil di-reuse dengan data baru.";
            } else {
                ActivityLog::log(
                    'create_invoice',
                    'Invoice',
                    $invoice->id,
                    null,
                    [
                        'created_by' => auth()->user()?->name ?? 'System',
                        'invoice_number' => $invoice->invoice_number,
                        'customer_id' => $invoice->customer_id,
                        'grand_total' => $invoice->grand_total,
                    ]
                );

                $msg = "Invoice {$invoice->invoice_number} berhasil disimpan.";
            }

            return redirect()
                ->route('invoices.show', $invoice->id)
                ->with('success', $msg);
        });
    }



    public function show(Invoice $invoice)
    {
        // Muat ulang invoice dengan payload yang dibutuhkan UI (tanpa mengubah relasi lama)
        $invoice = Invoice::withShowPayload()->findOrFail($invoice->id);

        // Ambil satu order untuk header (via helper firstOrder)
        $order = $invoice->firstOrder();
        $orderPayload = $order ? [
            'id'       => $order->id,
            'order_id' => $order->order_id,
        ] : null;

        // Map invoice_items → struktur yang dibutuhkan oleh show.tsx
        $orderItems = $invoice->items->map(function ($it) {
            $oi = $it->orderItem;
            return [
                'id'                  => $it->id,
                'container_number'    => $it->container_number,
                'entry_date'          => $oi?->entry_date,
                'exit_date'           => $oi?->exit_date,
                'price_value'         => (int) ($it->price_value ?? 0),
                'price_type'          => $it->price_type, // dipakai sebagai label service jika ada
                'product'             => $it->product ? ['service_type' => $it->product->service_type] : null,
                // additional_products tersimpan JSON (berisi pivot.price_value & pivot.quantity)
                'additional_products' => $it->additional_products ?? [],
            ];
        })->values();

        // Susun payload persis seperti yang diharapkan show.tsx (mirip InvoicePreview)
        $payload = [
            'id'             => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'period_start'   => $invoice->period_start,
            'period_end'     => $invoice->period_end,
            'subtotal'       => (int) $invoice->subtotal,
            'discount'       => (int) ($invoice->discount ?? 0),
            'ppn'            => (int) $invoice->ppn,
            'materai'        => (int) $invoice->materai,
            'grand_total'    => (int) $invoice->grand_total,
            'terbilang'      => $invoice->terbilang,
            'status'         => strtolower($invoice->status ?? 'unpaid'),
            'show_period'    => (bool) ($invoice->show_period ?? true),
            'customer'       => [
                'id'   => $invoice->customer->id,
                'name' => $invoice->customer->name,
            ],
            'order'        => $orderPayload,   // { id, order_id } atau null
            'order_items'  => $orderItems,     // array item untuk tabel
        ];

        // Info perusahaan (silakan ganti dari config/setting sesuai kebutuhan)
        $company = [
            'name'        => 'PT. DEPO SURABAYA SEJAHTERA',
            'address'     => 'Jl. Tanjung Sadari No. 90',
            'phone'       => '031-353 9484, 031-3539485',
            'fax'         => '031-3539482',
            'logo'        => asset('logo.png'),
            'bank_name'   => 'BCA',
            'bank_account'=> '463 521 9999',
            'bank_holder' => 'Depo Surabaya Sejahtera',
        ];

        return Inertia::render('invoices/show', [
            'invoice' => $payload,
            'company' => $company,
            'activityLogs' => ActivityLog::where('model_type', 'Invoice')
                ->where('model_id', $invoice->id)
                ->with('user:id,name,email')
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Show form for editing invoice
     */
    public function edit(Invoice $invoice)
    {
        // Load invoice with items and relations
        $invoice = Invoice::with([
            'customer.products',
            'items.orderItem.order',
            'items.orderItem.product:id,service_type',
            'items.orderItem.additionalProducts' => function ($q) {
                $q->withPivot(['price_value']);
            },
            'items.product:id,service_type',
        ])->findOrFail($invoice->id);

        // Get order from first item to load available order items
        $firstItem = $invoice->items->first();
        $order = null;
        $availableOrderItems = collect();

        if ($firstItem && $firstItem->orderItem) {
            $order = Order::with([
                'order_items.product:id,service_type',
                'order_items.additionalProducts' => function ($q) {
                    $q->withPivot(['price_value']);
                },
            ])->find($firstItem->orderItem->order_id);

            if ($order) {
                // Get order items that are NOT already in this invoice
                $existingItemIds = $invoice->items->pluck('order_item_id')->filter()->toArray();
                $availableOrderItems = $order->order_items->whereNotIn('id', $existingItemIds);
            }
        }

        // Customer custom pricing map
        $customerRates = $invoice->customer ? $invoice->customer->products->keyBy('id') : collect();

        // Master produk untuk dropdown "+ Tambah Jenis Produk"
        $allProducts = Product::select('id', 'service_type', 'description')
            ->orderBy('service_type')
            ->get()
            ->map(function ($p) use ($customerRates) {
                $custP = $customerRates->get($p->id);
                return [
                    'id' => $p->id,
                    'service_type' => $p->service_type,
                    'description' => $p->description,
                    'custom_price_20ft' => $custP ? (int) $custP->pivot->custom_price_20ft : null,
                    'custom_price_40ft' => $custP ? (int) $custP->pivot->custom_price_40ft : null,
                    'custom_price_45ft' => $custP ? (int) $custP->pivot->custom_price_45ft : null,
                    'custom_global_price' => $custP ? (int) $custP->pivot->custom_global_price : null,
                ];
            });

        // Riwayat aktivitas invoice
        $activityLogs = ActivityLog::where('model_type', 'Invoice')
            ->where('model_id', $invoice->id)
            ->with('user:id,name')
            ->latest()
            ->get();

        return Inertia::render('invoices/edit', [
            'invoice' => $invoice,
            'order' => $order,
            'availableOrderItems' => $availableOrderItems->values(),
            'allProducts' => $allProducts,
            'activityLogs' => $activityLogs,
        ]);
    }

    /**
     * Update invoice in storage
     */
    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
            'discount' => ['nullable', 'integer', 'min:0'],
            'ppn' => ['nullable', 'integer', 'min:0'],
            'materai' => ['nullable', 'integer', 'min:0'],
            'grand_total' => ['nullable', 'integer', 'min:0'],
            'show_period' => ['boolean'],
            'items' => ['nullable', 'array'],
            'removed_item_ids' => ['nullable', 'array'],
            'new_order_item_ids' => ['nullable', 'array'],
            'additional_product_quantities' => ['nullable', 'array'],
        ]);

        return DB::transaction(function () use ($request, $invoice, $validated) {
            $oldValues = $invoice->toArray();

            // Handle removed items
            $removedItemIds = $request->input('removed_item_ids', []);
            if (!empty($removedItemIds)) {
                $invoice->items()->whereIn('id', $removedItemIds)->delete();
            }

            // Handle new order items if any
            $newOrderItemIds = $request->input('new_order_item_ids', []);
            if (!empty($newOrderItemIds)) {
                $firstItem = $invoice->items()->first();
                $newItems = OrderItem::with(['product:id,service_type', 'additionalProducts'])
                    ->whereIn('id', $newOrderItemIds)
                    ->get();

                foreach ($newItems as $orderItem) {
                    $invItem = $invoice->items()->create([
                        'order_item_id' => $orderItem->id,
                        'product_id' => $orderItem->product_id,
                        'container_number' => $orderItem->container_number,
                        'price_type' => $orderItem->price_type ?? '20ft',
                        'price_value' => (int) ($orderItem->price_value ?? 0),
                        'quantity' => 1,
                    ]);

                    $adds = [];
                    foreach ($orderItem->additionalProducts as $ap) {
                        $adds[] = [
                            'id' => $ap->id,
                            'service_type' => $ap->service_type,
                            'price_value' => (int) ($ap->pivot->price_value ?? 0),
                            'quantity' => 1,
                            'pivot' => [
                                'price_value' => (int) ($ap->pivot->price_value ?? 0),
                                'quantity' => 1,
                            ],
                        ];
                    }
                    $invItem->additional_products = $adds;
                    $invItem->save();
                }
            }

            // Update items payload (kontainer & additional products)
            if ($request->has('items') && is_array($request->input('items'))) {
                foreach ($request->input('items') as $reqItem) {
                    $itemModel = $invoice->items()->find($reqItem['id'] ?? 0);
                    if ($itemModel) {
                        if (isset($reqItem['price_value'])) {
                            $itemModel->price_value = (int) $reqItem['price_value'];
                        }

                        $formattedAdds = [];
                        foreach (($reqItem['additional_products'] ?? []) as $ap) {
                            $qty = max(0, (int) ($ap['quantity'] ?? $ap['pivot']['quantity'] ?? 0));
                            if ($qty > 0) {
                                $price = (int) ($ap['price_value'] ?? $ap['pivot']['price_value'] ?? 0);
                                $serviceType = $ap['service_type'] ?? null;
                                if (!$serviceType && !empty($ap['id'])) {
                                    $prod = Product::find($ap['id']);
                                    $serviceType = $prod?->service_type ?? 'Produk';
                                }
                                $formattedAdds[] = [
                                    'id' => (int) $ap['id'],
                                    'service_type' => $serviceType,
                                    'price_value' => $price,
                                    'quantity' => $qty,
                                    'pivot' => [
                                        'price_value' => $price,
                                        'quantity' => $qty,
                                    ],
                                ];
                            }
                        }
                        $itemModel->additional_products = $formattedAdds;
                        $itemModel->save();
                    }
                }
            } elseif ($request->has('additional_product_quantities')) {
                // Fallback format lama
                $qtyMap = [];
                foreach ($request->input('additional_product_quantities', []) as $row) {
                    $qtyMap[$row['order_item_id'] . ':' . $row['additional_product_id']] = (int) $row['quantity'];
                }

                foreach ($invoice->items as $item) {
                    $adds = $item->additional_products ?? [];
                    foreach ($adds as &$ap) {
                        $k = $item->order_item_id . ':' . $ap['id'];
                        if (isset($qtyMap[$k])) {
                            $ap['quantity'] = $qtyMap[$k];
                            $ap['pivot']['quantity'] = $qtyMap[$k];
                        }
                    }
                    $item->additional_products = array_values(array_filter($adds, fn($ap) => ($ap['quantity'] ?? 1) > 0));
                    $item->save();
                }
            }

            // Hitung ulang semua total secara akurat dari data tersimpan
            $invoice->refresh();
            $invoice->load('items');

            if ($invoice->items->isEmpty()) {
                throw ValidationException::withMessages([
                    'items' => ['Invoice harus memiliki minimal satu item.']
                ]);
            }

            $subtotal = 0;
            foreach ($invoice->items as $item) {
                $subtotal += (int) ($item->price_value ?? 0);
                $adds = $item->additional_products ?? [];
                foreach ($adds as $ap) {
                    $p = (int) ($ap['pivot']['price_value'] ?? $ap['price_value'] ?? 0);
                    $q = (int) ($ap['pivot']['quantity'] ?? $ap['quantity'] ?? 1);
                    $subtotal += $p * $q;
                }
            }

            $discount = (int) ($validated['discount'] ?? 0);
            $materai = (int) ($validated['materai'] ?? 0);
            $afterDiscount = max(0, $subtotal - $discount);
            $ppn = (int) round($afterDiscount * 0.11);
            $grand = $afterDiscount + $ppn + $materai;

            // Generate terbilang di server
            $terbilang = $this->numberToWords($grand);

            // Update record invoice
            $invoice->update([
                'period_start' => $validated['period_start'],
                'period_end' => $validated['period_end'],
                'subtotal' => $subtotal,
                'discount' => $discount,
                'ppn' => $ppn,
                'materai' => $materai,
                'grand_total' => $grand,
                'terbilang' => $terbilang,
                'show_period' => (bool) ($validated['show_period'] ?? true),
            ]);

            // Log activity pembaruan
            ActivityLog::log(
                'update_invoice',
                'Invoice',
                $invoice->id,
                $oldValues,
                [
                    'updated_by' => auth()->user()->name,
                    'invoice_number' => $invoice->invoice_number,
                    'subtotal' => $subtotal,
                    'grand_total' => $grand,
                    'updated_at' => now()->toDateTimeString(),
                ]
            );

            return redirect()
                ->route('invoices.show', $invoice->id)
                ->with('success', "Invoice {$invoice->invoice_number} berhasil diperbarui.");
        });
    }

    public function destroy(Request $request, Invoice $invoice)
    {
        // Permission check: hanya admin dan super admin yang bisa hapus
        $user = auth()->user();
        if (!$user || (!in_array($user->role_id, [1, 2]) && !in_array($user->role?->name, ['Super User', 'Admin']))) {
            return back()->with('error', 'Anda tidak memiliki izin untuk menghapus invoice.');
        }

        $deleteReason = $request->input('delete_reason');

        DB::beginTransaction();
        try {
            // Simpan data invoice sebelum dihapus untuk log
            $oldValues = $invoice->toArray();

            // Soft delete invoice dengan alasan
            $invoice->update(['deleted_reason' => $deleteReason]);
            $invoice->delete();

            // Log activity penghapusan
            ActivityLog::log(
                'delete_invoice',
                'Invoice',
                $invoice->id,
                $oldValues,
                [
                    'deleted_reason' => $deleteReason,
                    'deleted_by' => $user->name,
                    'deleted_at' => now()->toDateTimeString(),
                    'invoice_number' => $invoice->invoice_number,
                ]
            );

            DB::commit();
            return redirect()
                ->route('invoices.index')
                ->with('success', "Invoice {$invoice->invoice_number} berhasil dihapus.");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menghapus invoice: ' . $e->getMessage());
        }
    }

    /**
     * Restore invoice yang dihapus (fallback)
     */
    public function restore($id)
    {
        $user = auth()->user();
        if (!$user || (!in_array($user->role_id, [1, 2]) && !in_array($user->role?->name, ['Super User', 'Admin']))) {
            return back()->with('error', 'Anda tidak memiliki izin untuk memulihkan invoice.');
        }

        $invoice = Invoice::onlyTrashed()->findOrFail($id);

        DB::beginTransaction();
        try {
            $invoice->restore();

            ActivityLog::log(
                'restore_invoice',
                'Invoice',
                $invoice->id,
                null,
                ['restored_by' => $user->name, 'invoice_number' => $invoice->invoice_number, 'restored_at' => now()->toDateTimeString()]
            );

            DB::commit();
            return redirect()
                ->route('invoices.index', ['trashed' => '1'])
                ->with('success', "Invoice {$invoice->invoice_number} berhasil dipulihkan.");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memulihkan invoice: ' . $e->getMessage());
        }
    }

    /**
     * Reuse nomor invoice yang telah dihapus
     */
    public function reuse(Request $request, $id)
    {
        $user = auth()->user();
        if (!$user || (!in_array($user->role_id, [1, 2]) && !in_array($user->role?->name, ['Super User', 'Admin']))) {
            return back()->with('error', 'Anda tidak memiliki izin untuk me-reuse invoice.');
        }

        $invoice = Invoice::onlyTrashed()->findOrFail($id);

        // Alihkan langsung ke form create dengan reuse_id agar dapat memilih customer & order baru
        return redirect()->route('invoices.create', ['reuse_id' => $invoice->id]);
    }

    

    public function generate($orderId)
    {
        // Ambil order beserta relasi
        $order = Order::with(['customer', 'product', 'additionalProducts.product'])->findOrFail($orderId);

        // Hitung subtotal dari order + produk tambahan
        $basePrice = $order->price_value ?? 0;
        $additionalPrices = $order->additionalProducts->sum('price_value');
        $subtotal = $basePrice + $additionalPrices;

        // Hitung PPN (11%) dan Materai (Rp10,000)
        $ppn = $subtotal * 0.11;
        $materai = 10000;
        $grandTotal = $subtotal + $ppn + $materai;

        // Terbilang
        $terbilang = $this->numberToWords($grandTotal);

        // Auto-generate invoice number: INV-1/MM/YY-XXXX
        $prefix = 'INV-1';
        $date = now()->format('m/Y'); // Contoh: 07/24
        $latestInvoice = Invoice::where('invoice_number', 'like', "$prefix-$date-%")
            ->orderByDesc('id')
            ->first();
        
        $nextNumber = $latestInvoice ? ((int)substr($latestInvoice->invoice_number, -4)) + 1 : 1;
        $invoiceNumber = "$prefix-$date-" . sprintf("%04d", $nextNumber);

        // Buat invoice di database
        $invoice = Invoice::create([
            'order_id' => $order->id,
            'invoice_number' => $invoiceNumber,
            'customer_id' => $order->customer_id,
            'period_start' => $order->entry_date ?? now(),
            'period_end' => $order->exit_date ?? now()->addDays(7),
            'subtotal' => $subtotal,
            'ppn' => $ppn,
            'materai' => $materai,
            'grand_total' => $grandTotal,
            'terbilang' => $terbilang,
        ]);

        // Ambil semua item untuk ditampilkan
        $items = $this->getInvoiceItems($order);

        return Inertia::render('Invoices/Generate', [
            'invoice' => $invoice,
            'customer' => $order->customer,
            'items' => $items,
            'company' => [
                'name'        => 'PT. DEPO SURABAYA SEJAHTERA',
                'address'     => 'Jl. Tanjung Sadari No. 90',
                'phone'       => '031-353 9484, 031-3539485',
                'fax'         => '031-3539482',
                'logo'        => asset('logo.png'),
                'bank_name'   => 'BCA',
                'bank_account'=> '463 521 9999',
                'bank_holder' => 'Depo Surabaya Sejahtera',
            ]
        ]);
    }

    private function getInvoiceItems($order)
    {
        $items = [];

        // Layanan utama (contoh fumigasi)
        $items[] = [
            'no' => 1,
            'container_number' => $order->container_number,
            'size' => $this->getProductSize($order->product),
            'service' => $order->product->service_type,
            'price_per_unit' => $order->price_value,
            'total' => $order->price_value,
        ];

        // Layanan tambahan (jika ada)
        foreach ($order->additionalProducts as $i => $additional) {
            $items[] = [
                'no' => $i + 2,
                'container_number' => $order->container_number,
                'size' => $this->getProductSize($additional->product),
                'service' => $additional->product->service_type,
                'price_per_unit' => $additional->price_value,
                'total' => $additional->price_value,
            ];
        }

        return $items;
    }

    private function getProductSize($product)
    {
        return $product->requires_temperature ? '20 feet' : '40 feet'; // Sesuaikan logika ukuran kontainer
    }

    private function numberToWords(int|float $amount): string
    {
        $integer = (int) round($amount);

        // library ini tak butuh ekstensi intl
        $ntw       = new NumberToWords();
        $idWords   = $ntw->getNumberTransformer('id');   // bahasa Indonesia
        $words     = $idWords->toWords($integer);        // “sepuluh juta ...”

        $words = preg_replace('/\s+/', ' ', $words);     // rapikan spasi ganda
        return ucwords($words).' Rupiah';
    }

    public function preview(Request $request)
    {
        $validated = $request->validate([
            'reuse_id'       => ['nullable','integer'],
            'invoice_number' => ['nullable','string','max:100'],
            'customer_id'    => ['required','integer'],
            'order_id'       => ['required','integer','exists:orders,id'],
            'order_item_ids' => ['required','array','min:1'],
            'order_item_ids.*' => ['integer'],
            'period_start'   => ['required','date'],
            'period_end'     => ['required','date','after_or_equal:period_start'],
            'applyMaterai'   => ['boolean'],
            'materai'        => ['nullable','integer','min:0'],
            'discount'       => ['nullable','integer','min:0'],
            // HAPUS validasi terbilang di sini
            'additional_product_quantities' => ['array'],
            'additional_product_quantities.*.order_item_id' => ['required','integer'],
            'additional_product_quantities.*.additional_product_id' => ['required','integer'],
            'additional_product_quantities.*.quantity' => ['required','integer','min:0'],
            'show_period'    => ['boolean'],
        ]);

        $qtyMap = [];
        foreach (($validated['additional_product_quantities'] ?? []) as $row) {
            $key = $row['order_item_id'].':'.$row['additional_product_id'];
            $qtyMap[$key] = (int) $row['quantity'];
        }

        $order = Order::with([
            'customer:id,name',
            'order_items' => function ($q) use ($validated) {
                $q->whereIn('id', $validated['order_item_ids'] ?? []);
            },
            'order_items.product:id,service_type',
            'order_items.additionalProducts' => function ($q) {
                $q->withPivot(['price_value']);
            },
        ])->findOrFail($validated['order_id']);

        $subtotal = 0;
        foreach ($order->order_items as $item) {
            $subtotal += (int) ($item->price_value ?? 0);
            $item->additionalProducts->transform(function ($ap) use ($item, $qtyMap, &$subtotal) {
                $price = (int) ($ap->pivot->price_value ?? 0);
                $qty   = (int) ($qtyMap[$item->id.':'.$ap->id] ?? 0);
                $ap->pivot->quantity = $qty;
                $subtotal += $price * $qty;
                return $ap;
            });
        }

        $materai = (int) ($validated['applyMaterai'] ?? true ? ($validated['materai'] ?? 10000) : 0);
        $discount = (int) ($validated['discount'] ?? 0);

        // Hitung: (Subtotal - Diskon) + PPN + Materai
        $afterDiscount = $subtotal - $discount;
        $ppn     = (int) round($afterDiscount * 0.11);
        $grand   = $afterDiscount + $ppn + $materai;

        // ✅ Generate terbilang di backend
        $terbilang = $this->numberToWords($grand);

        $preview = [
            'reuse_id'       => $validated['reuse_id'] ?? null,
            'customer'       => [
                'id'   => $order->customer->id,
                'name' => $order->customer->name,
            ],
            'invoice_number' => $validated['invoice_number'] ?? null,
            'order'          => $order->toArray(),
            'period_start'   => $validated['period_start'],
            'period_end'     => $validated['period_end'],
            'status'         => 'DRAFT',
            'subtotal'       => $subtotal,
            'discount'       => $discount,
            'ppn'            => $ppn,
            'materai'        => $materai,
            'grand_total'    => $grand,
            'terbilang'      => $terbilang, // ✅ bukan dari request
            'show_period'    => (bool) ($validated['show_period'] ?? true),
        ];

        return Inertia::render('invoices/InvoicePreview', [
            'preview' => $preview,
            'company' => [
                'name'        => 'PT. DEPO SURABAYA SEJAHTERA',
                'address'     => 'Jl. Tanjung Sadari No. 90',
                'phone'       => '031-353 9484, 031-3539485',
                'fax'         => '031-3539482',
                'logo'        => asset('logo.png'),
                'bank_name'   => 'BCA',
                'bank_account'=> '463 521 9999',
                'bank_holder' => 'Depo Surabaya Sejahtera',
            ],
        ]);
    }


    // public function preview(Request $request)
    // {
    //     $orderItemIds = $request->input('order_item_ids', []);
    //     $orderItems = OrderItem::whereIn('id', $orderItemIds)->get();

    //     // Field lain seperti subtotal, ppn, dst
    //     $subtotal = $orderItems->sum('price_value');
    //     $ppn = round($subtotal * 0.11);
    //     $materai = $request->input('materai', 0);
    //     $grand_total = $subtotal + $ppn + $materai;

    //     return Inertia::render('invoices/show', [
    //         'invoice' => [
    //             // ...field invoice lain...
    //             'customer' => Customer::find($request->input('customer_id')),
    //             'order' => Order::find($request->input('order_id')),
    //             'order_items' => $orderItems,
    //             'subtotal' => $subtotal,
    //             'ppn' => $ppn,
    //             'materai' => $materai,
    //             'grand_total' => $grand_total,
    //             'terbilang' => $request->input('terbilang'),
    //             'status' => 'unpaid',
    //             'invoice_number' => $request->input('invoice_number'),
    //             'period_start' => $request->input('period_start'),
    //             'period_end' => $request->input('period_end'),
    //         ],
    //          'company' => [
    //             'name' => 'PT Contoh Sukses Jaya',
    //             'address' => 'Jl. Raya Contoh No. 99, Jakarta',
    //             'phone' => '021-1234567',
    //             'fax' => '021-7654321'
    //         ],
    //         'preview' => true,
    //     ]);
    // }


    public function pay(Invoice $invoice)
    {
        $invoice->update(['status' => 'paid']);
        return redirect()->back()->with('success', 'Status invoice berhasil diubah menjadi Lunas.');
    }

    public function unpay(Invoice $invoice)
    {
        $invoice->update(['status' => 'unpaid']);
        return redirect()->back()->with('success', 'Status invoice berhasil diubah menjadi Belum Lunas.');
    }

    private function generateInvoiceNumber(int $customerId, string $periodStart): string
    {
        // Format target: IN-{customerId}-{mm}/{YYYY}-{####}
        $month = date('m', strtotime($periodStart));
        $year  = date('Y', strtotime($periodStart));
        $prefix = "IN-{$customerId}-{$month}/{$year}-";

        // Lock baris-baris kandidat agar tidak race
        $last = Invoice::where('invoice_number', 'like', $prefix.'%')
            ->lockForUpdate()
            ->selectRaw("MAX(CAST(SUBSTRING_INDEX(invoice_number, '-', -1) AS UNSIGNED)) as max_seq")
            ->value('max_seq');

        $nextSeq = ($last ? (int)$last : 0) + 1;

        return $prefix . str_pad((string)$nextSeq, 4, '0', STR_PAD_LEFT);
    }


    public function getUnavailableOrderItems(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|integer|exists:customers,id',
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
        ]);

        $customerId = $request->input('customer_id');
        $periodStart = $request->input('period_start');
        $periodEnd = $request->input('period_end');

        // Ambil semua order_item_id yang:
        // - Milik customer ini
        // - Ada di invoice yang periodenya OVERLAP dengan input
        // - Dan order_item tersebut SUDAH terinvoice (via invoice_items)

        $overlappingInvoices = Invoice::where('customer_id', $customerId)
            ->where(function ($q) use ($periodStart, $periodEnd) {
                // Cek overlap periode
                $q->whereBetween('period_start', [$periodStart, $periodEnd])
                ->orWhereBetween('period_end', [$periodStart, $periodEnd])
                ->orWhere(function ($q) use ($periodStart, $periodEnd) {
                    $q->where('period_start', '<=', $periodStart)
                        ->where('period_end', '>=', $periodEnd);
                });
            })
            ->pluck('id'); // Dapatkan invoice IDs

        // Ambil order_item_id dari invoice_items yang terkait
        $unavailableOrderItemIds = DB::table('invoice_items')
            ->whereIn('invoice_id', $overlappingInvoices)
            ->pluck('order_item_id')
            ->unique()
            ->values()
            ->all();

        return response()->json($unavailableOrderItemIds);
    }

}