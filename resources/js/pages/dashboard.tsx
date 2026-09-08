import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    ArrowDownRight,
    ArrowUpRight,
    Boxes,
    CheckCircle2,
    Clock,
    DollarSign,
    ExternalLink,
    FileText,
    Filter,
    Package,
    Printer,
    RotateCcw,
    Search,
    ShieldAlert,
    Thermometer,
} from 'lucide-react';

// Breadcrumb
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

// Types
interface ContainerItem {
    id: number;
    order_id: number;
    container_number: string;
    price_type?: string | null;
    commodity?: string | null;
    entry_date?: string | null;
    eir_date?: string | null;
    exit_date?: string | null;
    order?: {
        id: number;
        order_id: string;
        no_aju?: string | null;
        fumigasi?: string | null;
        customer?: { id: number; name: string } | null;
        shipper?: { id: number; name: string } | null;
    };
    product?: {
        id: number;
        service_type: string;
    };
}

interface MonthlyThroughput {
    month: string;
    gate_in: number;
    gate_out: number;
}

interface ProdukTerlaris {
    product_label: string;
    total_order: number;
}

interface TopCustomer {
    customer_name: string;
    total_containers: number;
}

interface KpiData {
    container_aktif: number;
    container_20ft: number;
    container_40ft: number;
    container_45ft?: number;
    container_other_size: number;
    container_belum_masuk: number;
    gate_in_hari_ini: number;
    gate_out_hari_ini: number;
    total_container_masuk: number;
    total_container_keluar: number;
    fumigasi_aktif: number;
    fumigasi_selesai?: number;
    fumigasi_total?: number;
}

interface InvoiceStats {
    unpaid_count: number;
    unpaid_amount: number;
    paid_month_count: number;
    paid_month_amount: number;
    total_invoice_count: number;
}

interface PageProps {
    [key: string]: any;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role_id: number;
        };
    };
    user?: {
        name: string;
        role_id: number;
        role_name: string;
    };
    kpi?: KpiData;
    analytics?: {
        monthly_throughput: MonthlyThroughput[];
        produk_terlaris: ProdukTerlaris[];
        top_customers?: TopCustomer[];
    };
    invoice_stats?: InvoiceStats;
    tables?: {
        aktif: ContainerItem[];
        belum_masuk: ContainerItem[];
        baru_keluar: ContainerItem[];
        fumigasi?: ContainerItem[];
    };
    // Backward compatibility props
    jumlahContainerMasuk?: number;
    jumlahContainerBelumMasuk?: number;
    jumlahContainerBelumKeluar?: number;
    dataContainerBelumMasuk?: ContainerItem[];
    dataContainerBelumKeluar?: ContainerItem[];
    produkTerlaris?: ProdukTerlaris[];
    user_role_id?: number;
}

function formatContainerSize(priceType?: string | null, fallback?: string): string {
    if (!priceType) return fallback || '-';
    const val = String(priceType).trim();
    if (val.toLowerCase().endsWith('ft')) return val;
    if (val === '20' || val === '40' || val === '45') return `${val}ft`;
    return val || fallback || '-';
}

function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount || 0);
}

function formatDate(dateStr?: string | null) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function calculateDwellDays(entryDate?: string | null): number {
    if (!entryDate) return 0;
    const diffMs = Date.now() - new Date(entryDate).getTime();
    if (isNaN(diffMs)) return 0;
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export default function DashboardPage() {
    const { props } = usePage<PageProps>();
    const roleId = props.user?.role_id ?? props.auth?.user?.role_id ?? 3;
    const userName = props.user?.name ?? props.auth?.user?.name ?? 'User';
    const roleName =
        props.user?.role_name ??
        (roleId === 1 ? 'Super User' : roleId === 2 ? 'Admin' : roleId === 4 ? 'Karantina' : 'Checker');

    const kpi: KpiData = props.kpi ?? {
        container_aktif: props.jumlahContainerBelumKeluar ?? 0,
        container_20ft: 0,
        container_40ft: 0,
        container_45ft: 0,
        container_other_size: 0,
        container_belum_masuk: props.jumlahContainerBelumMasuk ?? 0,
        gate_in_hari_ini: 0,
        gate_out_hari_ini: 0,
        total_container_masuk: props.jumlahContainerMasuk ?? 0,
        total_container_keluar: 0,
        fumigasi_aktif: 0,
        fumigasi_selesai: 0,
        fumigasi_total: 0,
    };

    // 1. TAMPILAN SEDERHANA KHUSUS CHECKER (ROLE 3)
    if (roleId === 3) {
        return (
            <CheckerSimpleDashboard
                userName={userName}
                kpi={kpi}
                belumMasuk={props.tables?.belum_masuk ?? props.dataContainerBelumMasuk ?? []}
                belumKeluar={props.tables?.aktif ?? props.dataContainerBelumKeluar ?? []}
            />
        );
    }

    // 2. TAMPILAN SEDERHANA KHUSUS KARANTINA (ROLE 4)
    if (roleId === 4) {
        return (
            <KarantinaSimpleDashboard
                userName={userName}
                kpi={kpi}
                dataFumigasi={props.tables?.fumigasi ?? []}
            />
        );
    }

    // 3. TAMPILAN OVERVIEW LENGKAP UNTUK SUPERADMIN (ROLE 1) & ADMIN (ROLE 2)
    return <AdminOverviewDashboard props={props} roleName={roleName} userName={userName} kpi={kpi} />;
}

// =========================================================================
// KOMPONEN 1: OVERVIEW LENGKAP (SUPER USER & ADMIN)
// =========================================================================
function AdminOverviewDashboard({
    props,
    roleName,
    userName,
    kpi,
}: {
    props: PageProps;
    roleName: string;
    userName: string;
    kpi: KpiData;
}) {
    const invoiceStats = props.invoice_stats ?? {
        unpaid_count: 0,
        unpaid_amount: 0,
        paid_month_count: 0,
        paid_month_amount: 0,
        total_invoice_count: 0,
    };

    const listAktif = props.tables?.aktif ?? props.dataContainerBelumKeluar ?? [];
    const listBelumMasuk = props.tables?.belum_masuk ?? props.dataContainerBelumMasuk ?? [];
    const listBaruKeluar = props.tables?.baru_keluar ?? [];

    const [activeTab, setActiveTab] = useState<'aktif' | 'belum_masuk' | 'baru_keluar'>('aktif');
    const [searchQuery, setSearchQuery] = useState('');

    const currentList = useMemo(() => {
        if (activeTab === 'aktif') return listAktif;
        if (activeTab === 'belum_masuk') return listBelumMasuk;
        return listBaruKeluar;
    }, [activeTab, listAktif, listBelumMasuk, listBaruKeluar]);

    const filteredList = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return currentList;
        return currentList.filter((item) => {
            const containerNum = item.container_number?.toLowerCase() || '';
            const custName = item.order?.customer?.name?.toLowerCase() || '';
            const shipperName = item.order?.shipper?.name?.toLowerCase() || '';
            const service = item.product?.service_type?.toLowerCase() || '';
            const commodity = item.commodity?.toLowerCase() || '';
            return (
                containerNum.includes(q) ||
                custName.includes(q) ||
                shipperName.includes(q) ||
                service.includes(q) ||
                commodity.includes(q)
            );
        });
    }, [currentList, searchQuery]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Depo Surabaya" />

            <div className="flex flex-1 flex-col gap-6 bg-[#f8fafc] p-4 md:p-6 min-h-screen">
                {/* Header: Sapaan & Quick Action Buttons */}
                <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-800">
                                Dashboard Depo Surabaya
                            </h1>
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                                {roleName}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Selamat datang, <span className="font-semibold text-gray-700">{userName}</span>. Pantau aktivitas kontainer, pergerakan gate in/out, dan status operasional depo terkini.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href="/temperature-records"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            <Thermometer className="h-4 w-4 text-rose-500" />
                            Cek Suhu
                        </Link>
                        <Link
                            href="/invoices/create"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            <FileText className="h-4 w-4 text-emerald-600" />
                            Buat Invoice
                        </Link>
                        <Link
                            href="/karantina"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            <ShieldAlert className="h-4 w-4 text-amber-500" />
                            Karantina
                        </Link>
                    </div>
                </div>

                {/* Primary KPI Cards Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Stok Kontainer Aktif di Depo */}
                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Stok Aktif di Depo
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                                <Boxes className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-gray-800">
                                {kpi.container_aktif}
                            </span>
                            <span className="text-xs font-medium text-gray-500">Container</span>
                        </div>
                        <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-600 flex-wrap">
                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-700 border border-gray-200">
                                20ft: {kpi.container_20ft}
                            </span>
                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-700 border border-gray-200">
                                40ft: {kpi.container_40ft}
                            </span>
                            {(kpi.container_45ft ?? 0) > 0 && (
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 font-medium text-blue-700 border border-blue-200">
                                    45ft: {kpi.container_45ft}
                                </span>
                            )}
                            {kpi.container_other_size > 0 && (
                                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-700 border border-gray-200">
                                    Lainnya: {kpi.container_other_size}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Card 2: Gate In Hari Ini */}
                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Gate In Hari Ini
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <ArrowDownRight className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-gray-800">
                                {kpi.gate_in_hari_ini}
                            </span>
                            <span className="text-xs font-medium text-gray-500">Container Masuk</span>
                        </div>
                        <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                            Total historis masuk: <span className="font-semibold text-gray-700">{kpi.total_container_masuk}</span>
                        </p>
                    </div>

                    {/* Card 3: Gate Out Hari Ini */}
                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Gate Out Hari Ini
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                                <ArrowUpRight className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-gray-800">
                                {kpi.gate_out_hari_ini}
                            </span>
                            <span className="text-xs font-medium text-gray-500">Container Keluar</span>
                        </div>
                        <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                            Total historis keluar: <span className="font-semibold text-gray-700">{kpi.total_container_keluar}</span>
                        </p>
                    </div>

                    {/* Card 4: Menunggu Gate In */}
                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Menunggu Gate In
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-gray-800">
                                {kpi.container_belum_masuk}
                            </span>
                            <span className="text-xs font-medium text-gray-500">Container Terdaftar</span>
                        </div>
                        <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                            Kontainer terjadwal di order tapi belum tiba
                        </p>
                    </div>
                </div>

                {/* Secondary Row: Karantina & Finansial */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Karantina Aktif Card */}
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Kontainer Fumigasi / Karantina
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-800">
                                    {kpi.fumigasi_aktif}
                                </span>
                                <span className="text-xs text-gray-500">Container aktif di depo</span>
                            </div>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                    </div>

                    {/* Finansial 1: Unpaid Invoices */}
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                                Tagihan Belum Lunas (Unpaid)
                            </span>
                            <div className="text-lg font-bold text-gray-800">
                                {formatRupiah(invoiceStats.unpaid_amount)}
                            </div>
                            <span className="text-xs text-gray-500">
                                {invoiceStats.unpaid_count} Invoice tertunda
                            </span>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                            <DollarSign className="h-6 w-6" />
                        </div>
                    </div>

                    {/* Finansial 2: Paid Invoices Bulan Ini */}
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                                Pelunasan Bulan Berjalan
                            </span>
                            <div className="text-lg font-bold text-gray-800">
                                {formatRupiah(invoiceStats.paid_month_amount)}
                            </div>
                            <span className="text-xs text-gray-500">
                                {invoiceStats.paid_month_count} Invoice telah lunas
                            </span>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Interactive Tabbed Container Table */}
                <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    {/* Tabs Header & Search */}
                    <div className="flex flex-col gap-3 border-b border-gray-200 p-4 md:flex-row md:items-center md:justify-between bg-white">
                        {/* Tab Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('aktif')}
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                    activeTab === 'aktif'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                }`}
                            >
                                <Boxes className="h-4 w-4" />
                                Sedang di Depo
                                <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${activeTab === 'aktif' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {listAktif.length}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('belum_masuk')}
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                    activeTab === 'belum_masuk'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                }`}
                            >
                                <Clock className="h-4 w-4" />
                                Menunggu Gate In
                                <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${activeTab === 'belum_masuk' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {listBelumMasuk.length}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('baru_keluar')}
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                    activeTab === 'baru_keluar'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                }`}
                            >
                                <ArrowUpRight className="h-4 w-4" />
                                Baru Keluar
                                <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${activeTab === 'baru_keluar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {listBaruKeluar.length}
                                </span>
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari kontainer, customer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-700">
                            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-600 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">No</th>
                                    <th className="px-4 py-3">No. Kontainer</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Shipper</th>
                                    <th className="px-4 py-3">Layanan</th>
                                    <th className="px-4 py-3">Komoditas</th>
                                    <th className="px-4 py-3">
                                        {activeTab === 'baru_keluar' ? 'Exit Date' : 'Entry Date'}
                                    </th>
                                    {activeTab === 'aktif' && <th className="px-4 py-3">Lama Inap</th>}
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {filteredList.length === 0 ? (
                                    <tr>
                                        <td colSpan={activeTab === 'aktif' ? 10 : 9} className="py-12 text-center text-sm text-gray-400">
                                            {searchQuery ? 'Tidak ada data kontainer yang cocok dengan pencarian.' : 'Tidak ada data kontainer pada kategori ini.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredList.map((item, idx) => {
                                        const dwellDays = calculateDwellDays(item.entry_date);
                                        const hasFumigasi = !!(item.order?.fumigasi && item.order.fumigasi.trim() !== '');

                                        return (
                                            <tr
                                                key={item.id}
                                                className="transition-colors hover:bg-blue-50/40"
                                            >
                                                <td className="px-4 py-3 text-xs text-gray-400">{idx + 1}</td>
                                                <td className="px-4 py-3 font-semibold text-gray-900">
                                                    <div className="flex items-center gap-2">
                                                        <span>{item.container_number}</span>
                                                        {item.price_type && (
                                                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-gray-700 border border-gray-200">
                                                                {formatContainerSize(item.price_type)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-gray-800">
                                                        {item.order?.customer?.name || '-'}
                                                    </div>
                                                    {item.order?.order_id && (
                                                        <div className="text-[11px] text-gray-400">
                                                            {item.order.order_id} {item.order.no_aju ? `• AJU: ${item.order.no_aju}` : ''}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                    {item.order?.shipper?.name || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className="inline-flex rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-100">
                                                        {item.product?.service_type || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                    {item.commodity || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                    {activeTab === 'baru_keluar' ? formatDate(item.exit_date) : formatDate(item.entry_date)}
                                                </td>
                                                {activeTab === 'aktif' && (
                                                    <td className="px-4 py-3 text-xs">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
                                                                dwellDays > 7
                                                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                                    : dwellDays >= 3
                                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            }`}
                                                        >
                                                            {dwellDays} Hari
                                                        </span>
                                                    </td>
                                                )}
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {activeTab === 'aktif' && (
                                                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                                                                In Yard
                                                            </span>
                                                        )}
                                                        {activeTab === 'belum_masuk' && (
                                                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200">
                                                                Pending
                                                            </span>
                                                        )}
                                                        {activeTab === 'baru_keluar' && (
                                                            <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700 border border-purple-200">
                                                                Gate Out
                                                            </span>
                                                        )}
                                                        {hasFumigasi && (
                                                            <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 border border-rose-200">
                                                                Fumigasi
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <a
                                                        href={`/orders/item/${item.id}`}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Detail
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="flex items-center justify-between border-t border-gray-100 p-4 text-xs text-gray-500 bg-white">
                        <span>
                            Menampilkan {filteredList.length} dari {currentList.length} kontainer
                        </span>
                        <Link href="/orders" className="font-semibold text-blue-600 hover:underline">
                            Buka Order Management Penuh →
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// =========================================================================
// KOMPONEN 2: DASHBOARD SEDERHANA KHUSUS CHECKER (ROLE 3)
// =========================================================================
function CheckerSimpleDashboard({
    userName,
    kpi,
    belumMasuk,
    belumKeluar,
}: {
    userName: string;
    kpi: KpiData;
    belumMasuk: ContainerItem[];
    belumKeluar: ContainerItem[];
}) {
    const [searchMasuk, setSearchMasuk] = useState('');
    const [searchKeluar, setSearchKeluar] = useState('');

    const filteredBelumMasuk = useMemo(() => {
        const q = searchMasuk.trim().toLowerCase();
        if (!q) return belumMasuk;
        return belumMasuk.filter(
            (item) =>
                item.container_number?.toLowerCase().includes(q) ||
                item.order?.customer?.name?.toLowerCase().includes(q)
        );
    }, [belumMasuk, searchMasuk]);

    const filteredBelumKeluar = useMemo(() => {
        const q = searchKeluar.trim().toLowerCase();
        if (!q) return belumKeluar;
        return belumKeluar.filter(
            (item) =>
                item.container_number?.toLowerCase().includes(q) ||
                item.order?.customer?.name?.toLowerCase().includes(q)
        );
    }, [belumKeluar, searchKeluar]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Checker" />

            <div className="flex flex-1 flex-col gap-6 bg-[#f8fafc] p-4 md:p-6 min-h-screen">
                {/* Header Checker */}
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-800">
                                Dashboard Gate Lapangan
                            </h1>
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                Checker
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Petugas: <span className="font-semibold text-gray-700">{userName}</span>. Pantau status container masuk dan belum keluar di depo.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/temperature-records"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            <Thermometer className="h-4 w-4 text-rose-500" />
                            Cek Suhu
                        </Link>
                    </div>
                </div>

                {/* 3 Simple Statistic Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Container Masuk */}
                    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <span className="text-sm font-medium text-gray-500">Container Masuk</span>
                        <span className="mt-2 text-4xl font-bold text-gray-800">{kpi.total_container_masuk}</span>
                        <span className="mt-1 text-xs text-emerald-600 font-medium">Hari ini: +{kpi.gate_in_hari_ini}</span>
                    </div>

                    {/* Belum Ada Jam Keluar / Sedang di Depo */}
                    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <span className="text-sm font-medium text-gray-500">Belum Ada Jam Keluar</span>
                        <span className="mt-2 text-4xl font-bold text-gray-800">{kpi.container_aktif}</span>
                        <span className="mt-1 text-xs text-blue-600 font-medium">Sedang di lapangan</span>
                    </div>

                    {/* Belum Ada Jam Masuk */}
                    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <span className="text-sm font-medium text-gray-500">Belum Ada Jam Masuk</span>
                        <span className="mt-2 text-4xl font-bold text-orange-500">{kpi.container_belum_masuk}</span>
                        <span className="mt-1 text-xs text-gray-400">Menunggu kedatangan</span>
                    </div>
                </div>

                {/* Tabel 1: Belum Ada Jam Masuk */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-xl text-orange-500 font-extrabold">{kpi.container_belum_masuk}</span>
                            Container Belum Ada Jam Masuk
                        </h2>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari container atau customer..."
                                value={searchMasuk}
                                onChange={(e) => setSearchMasuk(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-left text-sm text-gray-700">
                            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">No</th>
                                    <th className="px-4 py-3">Nomor Container</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Entry Date</th>
                                    <th className="px-4 py-3">Exit Date</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {filteredBelumMasuk.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                                            Tidak ada data container
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBelumMasuk.map((row, i) => (
                                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium text-slate-500">{i + 1}</td>
                                            <td className="px-4 py-3 font-mono text-sm font-semibold text-slate-900 tracking-tight">
                                                {row.container_number}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                {row.order?.customer?.name || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                {row.entry_date ? formatDate(row.entry_date) : <span className="text-slate-400">-</span>}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                {row.exit_date ? formatDate(row.exit_date) : <span className="text-slate-400">-</span>}
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm">
                                                <a
                                                    href={`/orders/item/${row.id}`}
                                                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Detail
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tabel 2: Belum Ada Jam Keluar */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-xl text-blue-600 font-extrabold">{kpi.container_aktif}</span>
                            Daftar Container Belum Ada Jam Keluar
                        </h2>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari container atau customer..."
                                value={searchKeluar}
                                onChange={(e) => setSearchKeluar(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-left text-sm text-gray-700">
                            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">No</th>
                                    <th className="px-4 py-3">Nomor Container</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Entry Date</th>
                                    <th className="px-4 py-3">Exit Date</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {filteredBelumKeluar.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                                            Tidak ada data container
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBelumKeluar.map((row, i) => (
                                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium text-slate-500">{i + 1}</td>
                                            <td className="px-4 py-3 font-mono text-sm font-semibold text-slate-900 tracking-tight">
                                                {row.container_number}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                {row.order?.customer?.name || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                {row.entry_date ? formatDate(row.entry_date) : <span className="text-slate-400">-</span>}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                {row.exit_date ? formatDate(row.exit_date) : <span className="text-slate-400">-</span>}
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm">
                                                <a
                                                    href={`/orders/item/${row.id}`}
                                                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Detail
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// =========================================================================
// KOMPONEN 3: DASHBOARD KHUSUS KARANTINA (ROLE 4) DENGAN FUNGSI /KARANTINA & TAMPILAN /DASHBOARD
// =========================================================================
function KarantinaSimpleDashboard({
    userName,
    dataFumigasi,
}: {
    userName: string;
    kpi?: KpiData;
    dataFumigasi: ContainerItem[];
}) {
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'in_depo' | 'gate_out'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

    // Filter Logic matching /karantina
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return dataFumigasi.filter((item) => {
            // 1. Text Search (Fumigator, Shipper, Container, Customer, Commodity)
            if (q) {
                const matchSearch =
                    item.container_number?.toLowerCase().includes(q) ||
                    item.order?.fumigasi?.toLowerCase().includes(q) ||
                    item.order?.shipper?.name?.toLowerCase().includes(q) ||
                    item.order?.customer?.name?.toLowerCase().includes(q) ||
                    item.commodity?.toLowerCase().includes(q);

                if (!matchSearch) return false;
            }

            // 2. Date Range Filter
            if (startDate || endDate) {
                const dates = [item.entry_date, item.eir_date, item.exit_date].filter(Boolean) as string[];
                if (dates.length === 0) return false;

                const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
                const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

                const matchDate = dates.some((dStr) => {
                    const time = new Date(dStr).getTime();
                    if (start && time < start) return false;
                    if (end && time > end) return false;
                    return true;
                });

                if (!matchDate) return false;
            }

            // 3. Status filter
            if (statusFilter === 'in_depo') {
                if (!item.entry_date || item.exit_date) return false;
            } else if (statusFilter === 'gate_out') {
                if (!item.exit_date) return false;
            }

            return true;
        });
    }, [dataFumigasi, search, startDate, endDate, statusFilter]);

    // Reset page to 1 when filter changes
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, currentPage, pageSize]);

    const handleResetFilter = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        setStatusFilter('all');
        setCurrentPage(1);
    };

    // Fungsi Cetak Billing Statement yang sama persis seperti di /karantina
    const handlePrint = () => {
        if (filtered.length === 0) {
            alert('Tidak ada data yang sesuai filter untuk dicetak.');
            return;
        }

        const startLabel = startDate ? new Date(startDate).toLocaleDateString('id-ID') : 'Semua';
        const endLabel = endDate ? new Date(endDate).toLocaleDateString('id-ID') : 'Semua';
        const periodLabel = `${startLabel} s/d ${endLabel}`;
        const logoUrl = '/logo.png';

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Gagal membuka jendela cetak. Pastikan popup browser diizinkan.');
            return;
        }

        printWindow.document.write(`
            <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                Memuat dokumen cetak...
            </div>
        `);
        printWindow.document.close();

        const img = new Image();
        img.src = logoUrl;

        const renderPrintDoc = (hasLogo: boolean) => {
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Billing Statement Karantina - PT Depo Surabaya Sejahtera</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        margin: 20px;
                        color: #1e293b;
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #e2e8f0;
                        padding-bottom: 12px;
                    }
                    .logo {
                        width: 70px;
                        height: 70px;
                        object-fit: contain;
                    }
                    .company-info {
                        font-size: 13px;
                        line-height: 1.4;
                    }
                    .company-info strong {
                        font-size: 16px;
                        color: #0f172a;
                    }
                    .customer-info {
                        margin-top: 10px;
                        font-size: 13px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 15px;
                        font-size: 11px;
                    }
                    th, td {
                        border: 1px solid #cbd5e1;
                        padding: 7px 9px;
                        text-align: left;
                    }
                    th {
                        background-color: #f1f5f9;
                        font-weight: 600;
                        color: #334155;
                    }
                    .badge {
                        background-color: #fef3c7;
                        color: #854d0e;
                        padding: 3px 6px;
                        border-radius: 4px;
                        font-size: 10px;
                        font-weight: 600;
                    }
                    @media print {
                        @page {
                            margin: 1cm;
                            size: landscape;
                        }
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    ${hasLogo ? `<img src="${logoUrl}" alt="Logo" class="logo">` : ''}
                    <div class="company-info">
                        <strong>PT. DEPO SURABAYA SEJAHTERA</strong><br>
                        Tanjung Sadari No. 90<br>
                        Surabaya, Jawa Timur - Indonesia
                    </div>
                </div>

                <div class="customer-info">
                    <strong>Laporan Karantina & Fumigasi Peti Kemas</strong><br>
                    <strong>Periode:</strong> ${periodLabel} &nbsp;|&nbsp; <strong>Total:</strong> ${filtered.length} Container
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 30px;">No</th>
                            <th>Nomor Kontainer</th>
                            <th>Nama Shipper</th>
                            <th>Customer</th>
                            <th>Size</th>
                            <th>Tanggal Masuk</th>
                            <th>Tanggal EIR</th>
                            <th>Tanggal Keluar</th>
                            <th>Komoditi</th>
                            <th>Fumigator</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filtered
                            .map(
                                (item, idx) => `
                            <tr>
                                <td>${idx + 1}</td>
                                <td style="font-family: monospace; font-weight: bold;">${item.container_number}</td>
                                <td>${item.order?.shipper?.name ?? '-'}</td>
                                <td>${item.order?.customer?.name ?? '-'}</td>
                                <td>${formatContainerSize(item.price_type, item.product?.service_type ?? '-')}</td>
                                <td>${item.entry_date ? new Date(item.entry_date).toLocaleString('id-ID') : '-'}</td>
                                <td>${item.eir_date ? new Date(item.eir_date).toLocaleString('id-ID') : '-'}</td>
                                <td>${item.exit_date ? new Date(item.exit_date).toLocaleString('id-ID') : '-'}</td>
                                <td>${item.commodity ?? '-'}</td>
                                <td>
                                    ${item.order?.fumigasi ? `<span class="badge">${item.order.fumigasi}</span>` : '–'}
                                </td>
                            </tr>
                        `,
                            )
                            .join('')}
                    </tbody>
                </table>
            </body>
            </html>
            `;
            printWindow.document.open();
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => printWindow.print(), 300);
        };

        img.onload = () => renderPrintDoc(true);
        img.onerror = () => renderPrintDoc(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Karantina" />

            <div className="flex flex-1 flex-col gap-6 bg-[#f8fafc] p-4 md:p-6 min-h-screen">
                {/* Header Karantina */}
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-800">
                                Dashboard Karantina & Fumigasi
                            </h1>
                            <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
                                Petugas Karantina
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Petugas: <span className="font-semibold text-gray-700">{userName}</span>. Pantau dan cetak laporan penanganan karantina / fumigasi kontainer.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                        >
                            <Printer className="h-4 w-4" />
                            Cetak Billing Statement
                        </button>
                    </div>
                </div>

                {/* Filter Panel Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-blue-600" />
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                                Filter & Pencarian Kontainer
                            </h2>
                        </div>
                        {(search || startDate || endDate || statusFilter !== 'all') && (
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 transition"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Reset Filter
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        {/* 1. Search */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                Cari (Fumigator, Shipper, Kontainer, Customer)
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Ketik nomor container, shipper, atau fumigator..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* 2. Tanggal Mulai */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">Tanggal Mulai</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* 3. Tanggal Selesai */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">Tanggal Selesai</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Status Tabs */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                        <span className="text-xs font-medium text-gray-500">Status Operasional:</span>
                        <button
                            type="button"
                            onClick={() => {
                                setStatusFilter('all');
                                setCurrentPage(1);
                            }}
                            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                                statusFilter === 'all'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Semua ({dataFumigasi.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setStatusFilter('in_depo');
                                setCurrentPage(1);
                            }}
                            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                                statusFilter === 'in_depo'
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Sedang di Depo
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setStatusFilter('gate_out');
                                setCurrentPage(1);
                            }}
                            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                                statusFilter === 'gate_out'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Sudah Keluar (Gate Out)
                        </button>
                    </div>
                </div>

                {/* Modern Data Table */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Daftar Kontainer Karantina & Fumigasi
                            </h2>
                            <p className="text-xs text-gray-500">
                                Menampilkan <span className="font-semibold text-gray-700">{filtered.length}</span> kontainer sesuai kriteria filter.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-left text-sm text-gray-700">
                            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">No</th>
                                    <th className="px-4 py-3">Nomor Kontainer</th>
                                    <th className="px-4 py-3">Nama Shipper</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Size</th>
                                    <th className="px-4 py-3">Tanggal Masuk</th>
                                    <th className="px-4 py-3">Tanggal EIR</th>
                                    <th className="px-4 py-3">Tanggal Keluar</th>
                                    <th className="px-4 py-3">Komoditi</th>
                                    <th className="px-4 py-3">Fumigator</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="px-4 py-10 text-center text-sm text-gray-400">
                                            Tidak ada data kontainer karantina yang sesuai dengan filter.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((row, i) => {
                                        const rowNumber = (currentPage - 1) * pageSize + i + 1;
                                        return (
                                            <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-4 py-3 text-sm font-medium text-slate-500">
                                                    {rowNumber}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-sm font-semibold text-slate-900 tracking-tight">
                                                    {row.container_number}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                    {row.order?.shipper?.name || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                    {row.order?.customer?.name || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                                                        {formatContainerSize(row.price_type, row.product?.service_type || '-')}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                    {row.entry_date ? formatDate(row.entry_date) : <span className="text-slate-400">-</span>}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                    {row.eir_date ? formatDate(row.eir_date) : <span className="text-slate-400">-</span>}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                    {row.exit_date ? formatDate(row.exit_date) : <span className="text-slate-400">-</span>}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                    {row.commodity || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    {row.order?.fumigasi ? (
                                                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200">
                                                            {row.order.fumigasi}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm">
                                                    <a
                                                        href={`/orders/item/${row.id}`}
                                                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Detail
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
                            <span className="text-xs text-gray-500">
                                Halaman <span className="font-semibold text-gray-700">{currentPage}</span> dari{' '}
                                <span className="font-semibold text-gray-700">{totalPages}</span> ({filtered.length} kontainer)
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ← Prev
                                </button>
                                <span className="px-2 text-xs font-semibold text-gray-600">
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
