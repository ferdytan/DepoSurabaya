<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\OrderItem;
use App\Models\Customer;
use App\Models\Shipper;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $customerId = $request->input('customer_id');
        $shipperId = $request->input('shipper_id');
        $serviceType = $request->input('service_type');
        $priceType = $request->input('price_type');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $dateType = $request->input('date_type', 'entry_date'); // entry_date, exit_date, or order_date
        $excludeStatus = $request->input('exclude_status', 'active'); // 'active' (default = tidak di-exclude), 'all', 'excluded'
        $invoiceStatus = $request->input('invoice_status', 'all'); // 'all', 'invoiced', 'uninvoiced'
        $search = $request->input('search');

        $defaultPagination = (int) Setting::get('default_pagination', 25);
        $perPage = (int) $request->input('per_page', $defaultPagination);
        if (!in_array($perPage, [10, 25, 50, 100, 200])) {
            $perPage = $defaultPagination;
        }

        $query = OrderItem::with([
            'order.customer:id,name',
            'order.shipper:id,name',
            'product:id,service_type',
        ]);

        // Filter Customer
        if (!empty($customerId)) {
            $query->whereHas('order', function ($q) use ($customerId) {
                $q->where('customer_id', $customerId);
            });
        }

        // Filter Shipper
        if (!empty($shipperId)) {
            $query->whereHas('order', function ($q) use ($shipperId) {
                $q->where('shipper_id', $shipperId);
            });
        }

        // Filter Service Type (Product)
        if (!empty($serviceType)) {
            $query->whereHas('product', function ($q) use ($serviceType) {
                $q->where('service_type', $serviceType);
            });
        }

        // Filter Price Type (20ft, 40ft, 45ft)
        if (!empty($priceType)) {
            $query->where('price_type', $priceType);
        }

        // Filter Exclude Status
        if ($excludeStatus === 'active') {
            // Default: HANYA yang TIDAK di-exclude
            $query->where(function ($q) {
                $q->where('is_excluded_from_report', false)
                  ->whereHas('order', function ($oq) {
                      $oq->where('is_excluded_from_report', false);
                  });
            });
        } elseif ($excludeStatus === 'excluded') {
            // HANYA yang di-exclude
            $query->where(function ($q) {
                $q->where('is_excluded_from_report', true)
                  ->orWhereHas('order', function ($oq) {
                      $oq->where('is_excluded_from_report', true);
                  });
            });
        }
        // Jika 'all', tidak difilter kolom is_excluded_from_report

        // Filter Date Range (Tanpa jadwal EIR sesuai instruksi pengguna)
        if (!empty($dateFrom)) {
            if ($dateType === 'exit_date') {
                $query->whereDate('exit_date', '>=', $dateFrom);
            } elseif ($dateType === 'order_date') {
                $query->whereHas('order', function ($q) use ($dateFrom) {
                    $q->whereDate('created_at', '>=', $dateFrom);
                });
            } else {
                $query->whereDate('entry_date', '>=', $dateFrom);
            }
        }

        if (!empty($dateTo)) {
            if ($dateType === 'exit_date') {
                $query->whereDate('exit_date', '<=', $dateTo);
            } elseif ($dateType === 'order_date') {
                $query->whereHas('order', function ($q) use ($dateTo) {
                    $q->whereDate('created_at', '<=', $dateTo);
                });
            } else {
                $query->whereDate('entry_date', '<=', $dateTo);
            }
        }

        // Filter Search
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('container_number', 'like', "%{$search}%")
                  ->orWhere('commodity', 'like', "%{$search}%")
                  ->orWhereHas('order', function ($oq) use ($search) {
                      $oq->where('order_id', 'like', "%{$search}%")
                         ->orWhere('no_aju', 'like', "%{$search}%")
                         ->orWhereHas('customer', fn($cq) => $cq->where('name', 'like', "%{$search}%"))
                         ->orWhereHas('shipper', fn($sq) => $sq->where('name', 'like', "%{$search}%"));
                  });
            });
        }

        // Ambil daftar order_item_id yang sudah di-invoice
        $invoicedItemMap = DB::table('invoice_items')
            ->join('invoices', 'invoice_items.invoice_id', '=', 'invoices.id')
            ->whereNull('invoices.deleted_at')
            ->select('invoice_items.order_item_id', 'invoices.invoice_number', 'invoices.id as invoice_id')
            ->get()
            ->keyBy('order_item_id');

        // Filter Status Invoice
        if ($invoiceStatus === 'invoiced') {
            $query->whereIn('id', $invoicedItemMap->keys());
        } elseif ($invoiceStatus === 'uninvoiced') {
            $query->whereNotIn('id', $invoicedItemMap->keys());
        }

        // KPI Ringkasan dari query yang difilter
        $kpiQuery = clone $query;
        $allItemIds = $kpiQuery->pluck('id');
        $totalContainers = $allItemIds->count();
        
        $count20ft = (clone $query)->where('price_type', '20ft')->count();
        $count40ft = (clone $query)->where('price_type', '40ft')->count();
        $count45ft = (clone $query)->where('price_type', '45ft')->count();
        $countOtherSize = max(0, $totalContainers - ($count20ft + $count40ft + $count45ft));

        $countAktifDiDepo = (clone $query)->whereNotNull('entry_date')->whereNull('exit_date')->count();
        $countSudahKeluar = (clone $query)->whereNotNull('exit_date')->count();
        $countBelumMasuk = (clone $query)->whereNull('entry_date')->count();

        $countInvoiced = $allItemIds->filter(fn($id) => isset($invoicedItemMap[$id]))->count();
        $countUninvoiced = $totalContainers - $countInvoiced;

        // Paginate Data
        $items = $query->latest('id')->paginate($perPage)->withQueryString();

        // Transform data untuk frontend
        $items->getCollection()->transform(function ($item) use ($invoicedItemMap) {
            $invoiceInfo = $invoicedItemMap->get($item->id);
            return [
                'id' => $item->id,
                'order_id' => $item->order?->order_id ?? '-',
                'order_pk' => $item->order?->id,
                'no_aju' => $item->order?->no_aju ?? '-',
                'customer_name' => $item->order?->customer?->name ?? '-',
                'shipper_name' => $item->order?->shipper?->name ?? '-',
                'service_type' => $item->product?->service_type ?? '-',
                'container_number' => $item->container_number,
                'size' => $item->price_type ?? '-',
                'entry_date' => $item->entry_date ? $item->entry_date : null,
                'exit_date' => $item->exit_date ? $item->exit_date : null,
                'commodity' => $item->commodity ?? '-',
                'is_excluded' => (bool) ($item->is_excluded_from_report || $item->order?->is_excluded_from_report),
                'is_invoiced' => !empty($invoiceInfo),
                'invoice_number' => $invoiceInfo?->invoice_number,
                'invoice_id' => $invoiceInfo?->invoice_id,
            ];
        });

        // Dropdown Master Filters
        $customers = Customer::select('id', 'name')->orderBy('name')->get();
        $shippers = Shipper::select('id', 'name')->orderBy('name')->get();
        $serviceTypes = Product::select('service_type')->distinct()->whereNotNull('service_type')->pluck('service_type');

        return Inertia::render('reports/index', [
            'reports' => $items,
            'kpi' => [
                'total_containers' => $totalContainers,
                'count_20ft' => $count20ft,
                'count_40ft' => $count40ft,
                'count_45ft' => $count45ft,
                'count_other' => $countOtherSize,
                'aktif_di_depo' => $countAktifDiDepo,
                'sudah_keluar' => $countSudahKeluar,
                'belum_masuk' => $countBelumMasuk,
                'invoiced' => $countInvoiced,
                'uninvoiced' => $countUninvoiced,
            ],
            'customers' => $customers,
            'shippers' => $shippers,
            'service_types' => $serviceTypes,
            'filters' => [
                'customer_id' => $customerId ? (string) $customerId : '',
                'shipper_id' => $shipperId ? (string) $shipperId : '',
                'service_type' => $serviceType ?? '',
                'price_type' => $priceType ?? '',
                'date_from' => $dateFrom ?? '',
                'date_to' => $dateTo ?? '',
                'date_type' => $dateType,
                'exclude_status' => $excludeStatus,
                'invoice_status' => $invoiceStatus,
                'search' => $search ?? '',
                'per_page' => $perPage,
            ],
        ]);
    }
}
