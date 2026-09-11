<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $roleId = $user ? (int)$user->role_id : 3;

        $today = Carbon::today();

        // 1. STATISTIK UTAMA KONTAINER
        // Kontainer aktif di depo: sudah masuk tetapi belum keluar
        $queryAktif = OrderItem::whereNotNull('entry_date')->whereNull('exit_date');
        $jumlahContainerAktif = (clone $queryAktif)->count();

        // Breakdown ukuran kontainer aktif di depo
        $count20ft = (clone $queryAktif)->where('price_type', '20ft')->count();
        $count40ft = (clone $queryAktif)->where('price_type', '40ft')->count();
        $count45ft = (clone $queryAktif)->where('price_type', '45ft')->count();
        $countOtherSize = max(0, $jumlahContainerAktif - ($count20ft + $count40ft + $count45ft));

        // Kontainer belum masuk (terdaftar di order tapi entry_date masih null)
        $jumlahContainerBelumMasuk = OrderItem::whereNull('entry_date')->count();

        // Total akumulasi kontainer masuk & keluar
        $totalContainerMasuk = OrderItem::whereNotNull('entry_date')->count();
        $totalContainerKeluar = OrderItem::whereNotNull('exit_date')->count();

        // Pergerakan hari ini
        $gateInHariIni = OrderItem::whereDate('entry_date', $today)->count();
        $gateOutHariIni = OrderItem::whereDate('exit_date', $today)->count();

        // Kontainer karantina / fumigasi yang aktif di depo
        $jumlahFumigasiAktif = OrderItem::whereNotNull('entry_date')
            ->whereNull('exit_date')
            ->whereHas('order', function ($q) {
                $q->whereNotNull('fumigasi')
                  ->where('fumigasi', '!=', '')
                  ->where('fumigasi', '!=', ' ');
            })
            ->count();

        // Kontainer reefer / butuh pemantauan suhu yang aktif di depo
        $jumlahReeferAktif = (clone $queryAktif)->where(function ($q) {
            $q->whereHas('product', function ($p) {
                $p->where('requires_temperature', 1);
            })->orWhereHas('additionalProducts', function ($p) {
                $p->where('requires_temperature', 1);
            })->orWhereHas('rekamSuhu');
        })->count();

        // 2. ANALITIK BULANAN (6 BULAN TERAKHIR)
        $monthlyThroughput = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = Carbon::now()->subMonths($i)->startOfMonth();
            $monthEnd = Carbon::now()->subMonths($i)->endOfMonth();
            $label = $monthStart->format('M Y');

            $inCount = OrderItem::whereBetween('entry_date', [$monthStart, $monthEnd])->count();
            $outCount = OrderItem::whereBetween('exit_date', [$monthStart, $monthEnd])->count();

            $monthlyThroughput[] = [
                'month' => $label,
                'gate_in' => $inCount,
                'gate_out' => $outCount,
            ];
        }

        // 3. TOP PRODUK / LAYANAN
        $produkTerlaris = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select('products.service_type as product_label', DB::raw('COUNT(order_items.id) as total_order'))
            ->whereNull('order_items.deleted_at')
            ->groupBy('order_items.product_id', 'products.service_type')
            ->orderByDesc('total_order')
            ->limit(8)
            ->get();

        // 4. TOP CUSTOMERS BERDASARKAN VOLUME KONTAINER (ROLE 1 & 2)
        $topCustomers = [];
        if ($roleId === 1 || $roleId === 2) {
            $topCustomers = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('customers', 'orders.customer_id', '=', 'customers.id')
                ->select('customers.name as customer_name', DB::raw('COUNT(order_items.id) as total_containers'))
                ->whereNull('order_items.deleted_at')
                ->whereNull('orders.deleted_at')
                ->groupBy('customers.id', 'customers.name')
                ->orderByDesc('total_containers')
                ->limit(5)
                ->get();
        }

        // 5. STATISTIK FINANSIAL INVOICE (HANYA SUPERADMIN: ROLE 1)
        $invoiceStats = [
            'unpaid_count' => 0,
            'unpaid_amount' => 0,
            'paid_month_count' => 0,
            'paid_month_amount' => 0,
            'total_invoice_count' => 0,
        ];

        if ($roleId === 1) {
            $unpaid = Invoice::where(function ($q) {
                $q->where('status', 'unpaid')->orWhere('status', 'Belum Lunas');
            });
            $invoiceStats['unpaid_count'] = (clone $unpaid)->count();
            $invoiceStats['unpaid_amount'] = (float) (clone $unpaid)->sum('grand_total');

            $startThisMonth = Carbon::now()->startOfMonth();
            $paidMonth = Invoice::where(function ($q) {
                $q->where('status', 'paid')->orWhere('status', 'Lunas');
            })->where('updated_at', '>=', $startThisMonth);

            $invoiceStats['paid_month_count'] = (clone $paidMonth)->count();
            $invoiceStats['paid_month_amount'] = (float) (clone $paidMonth)->sum('grand_total');
            $invoiceStats['total_invoice_count'] = Invoice::count();
        }

        // 6. DAFTAR DETAIL KONTAINER UNTUK TABEL TABULASI
        $isChecker = ($roleId === 3);
        $relations = [
            'order:id,order_id,customer_id,shipper_id,fumigasi,no_aju',
            'order.customer:id,name',
            'order.shipper:id,name',
            'product:id,service_type,requires_temperature',
            'additionalProducts:id,service_type,requires_temperature',
            'rekamSuhu',
        ];

        // Tab A: Kontainer aktif di depo
        $dataContainerAktif = OrderItem::with($relations)
            ->whereNotNull('entry_date')
            ->whereNull('exit_date')
            ->latest('entry_date')
            ->limit($isChecker ? 250 : 35)
            ->get();

        // Tab B: Kontainer belum masuk
        $dataContainerBelumMasuk = OrderItem::with($relations)
            ->whereNull('entry_date')
            ->latest('created_at')
            ->limit($isChecker ? 250 : 35)
            ->get();

        // Tab C: Kontainer baru saja keluar
        $dataContainerBaruKeluar = OrderItem::with($relations)
            ->whereNotNull('exit_date')
            ->latest('exit_date')
            ->limit($isChecker ? 100 : 20)
            ->get();

        // Tab D: Kontainer fumigasi (khusus Karantina dan widget fumigasi)
        $dataContainerFumigasi = OrderItem::with($relations)
            ->whereHas('order', function ($q) {
                $q->whereNotNull('fumigasi')
                  ->where('fumigasi', '!=', '')
                  ->where('fumigasi', '!=', ' ');
            })
            ->latest()
            ->limit(150)
            ->get();

        $jumlahFumigasiSelesai = OrderItem::whereNotNull('exit_date')
            ->whereHas('order', function ($q) {
                $q->whereNotNull('fumigasi')
                  ->where('fumigasi', '!=', '')
                  ->where('fumigasi', '!=', ' ');
            })
            ->count();

        $jumlahFumigasiTotal = OrderItem::whereHas('order', function ($q) {
                $q->whereNotNull('fumigasi')
                  ->where('fumigasi', '!=', '')
                  ->where('fumigasi', '!=', ' ');
            })
            ->count();

        return Inertia::render('dashboard', [
            'user' => [
                'name' => $user ? $user->name : 'User',
                'role_id' => $roleId,
                'role_name' => $user && $user->role ? $user->role->name : 'User',
            ],
            'kpi' => [
                'container_aktif' => $jumlahContainerAktif,
                'container_20ft' => $count20ft,
                'container_40ft' => $count40ft,
                'container_45ft' => $count45ft,
                'container_other_size' => $countOtherSize,
                'container_belum_masuk' => $jumlahContainerBelumMasuk,
                'container_reefer_aktif' => $jumlahReeferAktif,
                'gate_in_hari_ini' => $gateInHariIni,
                'gate_out_hari_ini' => $gateOutHariIni,
                'total_container_masuk' => $totalContainerMasuk,
                'total_container_keluar' => $totalContainerKeluar,
                'fumigasi_aktif' => $jumlahFumigasiAktif,
                'fumigasi_selesai' => $jumlahFumigasiSelesai,
                'fumigasi_total' => $jumlahFumigasiTotal,
            ],
            'analytics' => [
                'monthly_throughput' => $monthlyThroughput,
                'produk_terlaris' => $produkTerlaris,
                'top_customers' => $topCustomers,
            ],
            'invoice_stats' => $invoiceStats,
            'tables' => [
                'aktif' => $dataContainerAktif,
                'belum_masuk' => $dataContainerBelumMasuk,
                'baru_keluar' => $dataContainerBaruKeluar,
                'fumigasi' => $dataContainerFumigasi,
            ],
            // Kompatibilitas mundur
            'jumlahContainerMasuk' => $totalContainerMasuk,
            'jumlahContainerBelumMasuk' => $jumlahContainerBelumMasuk,
            'jumlahContainerBelumKeluar' => $jumlahContainerAktif,
            'dataContainerBelumMasuk' => $dataContainerBelumMasuk,
            'dataContainerBelumKeluar' => $dataContainerAktif,
            'produkTerlaris' => $produkTerlaris,
            'user_role_id' => $roleId,
        ]);
    }
}
