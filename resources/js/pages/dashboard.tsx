import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    AlertCircle,
    ArrowDownRight,
    ArrowUpRight,
    Boxes,
    Calendar,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock,
    DollarSign,
    ExternalLink,
    FileText,
    Filter,
    History as HistoryIcon,
    Info,
    Package,
    Pencil,
    Plus,
    Power,
    PowerOff,
    Printer,
    RefreshCw,
    RotateCcw,
    Search,
    ShieldAlert,
    Sparkles,
    Thermometer,
    Trash2,
    X,
    Zap,
} from 'lucide-react';
import DateRangePicker from '@/components/date-range-picker';
import DateTimePicker from '@/components/date-time-picker';

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
        requires_temperature?: number | boolean | null;
    };
    additional_products?: Array<{
        id: number;
        service_type: string;
        requires_temperature?: number | boolean | null;
    }>;
    rekam_suhu?: Array<{
        id?: number;
        tanggal: string;
        jam_data: Record<string, string>;
    }>;
    rekamSuhu?: Array<{
        id?: number;
        tanggal: string;
        jam_data: Record<string, string>;
    }>;
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
    container_reefer_aktif?: number;
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

    // 1. TAMPILAN KHUSUS CHECKER (ROLE 3): MOBILE-FIRST APP
    if (roleId === 3) {
        return (
            <CheckerMobileApp
                userName={userName}
                kpi={kpi}
                belumMasuk={props.tables?.belum_masuk ?? props.dataContainerBelumMasuk ?? []}
                belumKeluar={props.tables?.aktif ?? props.dataContainerBelumKeluar ?? []}
                baruKeluar={props.tables?.baru_keluar ?? []}
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
// KOMPONEN 2: DASHBOARD KHUSUS CHECKER (ROLE 3): MOBILE-FIRST APP
// =========================================================================

function getNowIso(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${h}:${min}`;
}

function getTodayYmd(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function getNowTimeHm(): string {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${min}`;
}

function getRoundHourHm(offsetHours = 0): string {
    const d = new Date();
    let h = (d.getHours() + offsetHours) % 24;
    if (h < 0) h += 24;
    return `${String(h).padStart(2, '0')}:00`;
}

function getContainerSuhuRecords(item: ContainerItem) {
    return item.rekamSuhu || item.rekam_suhu || [];
}

function isReeferItem(item: ContainerItem): boolean {
    if (item.product && (String(item.product.requires_temperature) === '1' || item.product.requires_temperature === true)) {
        return true;
    }
    const sType = item.product?.service_type?.toLowerCase() || '';
    if (sType.includes('reefer') || sType.includes('plug') || sType.includes('suhu')) {
        return true;
    }
    if (item.additional_products?.some((p) => String(p.requires_temperature) === '1' || p.requires_temperature === true || p.service_type?.toLowerCase().includes('plug'))) {
        return true;
    }
    const recs = getContainerSuhuRecords(item);
    if (recs && recs.length > 0 && recs.some((r) => Object.keys(r.jam_data || {}).length > 0)) {
        return true;
    }
    return false;
}

function getLatestSuhu(item: ContainerItem) {
    const recs = getContainerSuhuRecords(item);
    if (!recs || recs.length === 0) return null;
    const sortedDates = [...recs].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
    for (const rec of sortedDates) {
        const entries = Object.entries(rec.jam_data || {}).sort(([a], [b]) => b.localeCompare(a));
        if (entries.length > 0) {
            const [jam, temp] = entries[0];
            let total = 0;
            recs.forEach((r) => {
                total += Object.keys(r.jam_data || {}).length;
            });
            return {
                time: jam.includes(':') ? jam : `${jam}:00`,
                temp,
                date: rec.tanggal,
                total,
            };
        }
    }
    return null;
}

const COMMON_HOURS = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
];

const QUICK_TEMP_PRESETS = [
    '-22.0', '-20.0', '-18.0', '-15.0', '-5.0', '0.0', '+2.0', '+4.0', '+8.0'
];

function CheckerMobileApp({
    userName,
    kpi,
    belumMasuk,
    belumKeluar,
    baruKeluar,
}: {
    userName: string;
    kpi: KpiData;
    belumMasuk: ContainerItem[];
    belumKeluar: ContainerItem[];
    baruKeluar: ContainerItem[];
}) {
    const [activeTab, setActiveTab] = useState<'gate_in' | 'di_depo' | 'suhu' | 'gate_out'>('di_depo');
    const [searchQuery, setSearchQuery] = useState('');
    const [sizeFilter, setSizeFilter] = useState<'all' | '20ft' | '40ft' | '45ft'>('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Filtered lists
    const reeferContainers = useMemo(() => {
        return belumKeluar.filter((item) => isReeferItem(item));
    }, [belumKeluar]);

    const activeList = useMemo(() => {
        if (activeTab === 'gate_in') return belumMasuk;
        if (activeTab === 'di_depo') return belumKeluar;
        if (activeTab === 'suhu') return reeferContainers;
        return baruKeluar;
    }, [activeTab, belumMasuk, belumKeluar, reeferContainers, baruKeluar]);

    const filteredList = useMemo(() => {
        let list = activeList;

        // Size filter
        if (sizeFilter !== 'all') {
            list = list.filter((item) => {
                const s = formatContainerSize(item.price_type).toLowerCase();
                return s.includes(sizeFilter);
            });
        }

        // Search text
        const q = searchQuery.trim().toLowerCase();
        if (!q) return list;

        return list.filter((item) => {
            const cNo = item.container_number?.toLowerCase() || '';
            const cust = item.order?.customer?.name?.toLowerCase() || '';
            const ship = item.order?.shipper?.name?.toLowerCase() || '';
            const serv = item.product?.service_type?.toLowerCase() || '';
            const aju = item.order?.no_aju?.toLowerCase() || '';
            const ord = item.order?.order_id?.toLowerCase() || '';
            const comm = item.commodity?.toLowerCase() || '';
            return (
                cNo.includes(q) ||
                cust.includes(q) ||
                ship.includes(q) ||
                serv.includes(q) ||
                aju.includes(q) ||
                ord.includes(q) ||
                comm.includes(q)
            );
        });
    }, [activeList, sizeFilter, searchQuery]);

    // Toast helper
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => {
                setIsRefreshing(false);
                showToast('Data berhasil diperbarui');
            },
        });
    };

    // --- MODAL STATES ---
    // 1. Gate In Modal
    const [gateInTarget, setGateInTarget] = useState<ContainerItem | null>(null);
    const [gateInDate, setGateInDate] = useState(getNowIso());
    const [gateInSubmitting, setGateInSubmitting] = useState(false);

    const openGateIn = (item: ContainerItem) => {
        setGateInTarget(item);
        setGateInDate(getNowIso());
    };

    const submitGateIn = () => {
        if (!gateInTarget || !gateInDate) return;
        setGateInSubmitting(true);
        router.patch(
            route('orders.update-entry', gateInTarget.id),
            { entry_date: gateInDate },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setGateInTarget(null);
                    setGateInSubmitting(false);
                    showToast(`Gate In kontainer ${gateInTarget.container_number} berhasil dicatat`);
                },
                onError: () => {
                    setGateInSubmitting(false);
                    alert('Gagal mencatat Gate In. Silakan periksa koneksi.');
                },
            }
        );
    };

    // 2. Gate Out Modal
    const [gateOutTarget, setGateOutTarget] = useState<ContainerItem | null>(null);
    const [gateOutDate, setGateOutDate] = useState(getNowIso());
    const [gateOutSubmitting, setGateOutSubmitting] = useState(false);

    const openGateOut = (item: ContainerItem) => {
        setGateOutTarget(item);
        setGateOutDate(getNowIso());
    };

    const submitGateOut = () => {
        if (!gateOutTarget || !gateOutDate) return;
        setGateOutSubmitting(true);
        router.patch(
            route('orders.update-exit', gateOutTarget.id),
            { exit_date: gateOutDate },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setGateOutTarget(null);
                    setGateOutSubmitting(false);
                    showToast(`Gate Out kontainer ${gateOutTarget.container_number} berhasil dicatat`);
                },
                onError: () => {
                    setGateOutSubmitting(false);
                    alert('Gagal mencatat Gate Out. Silakan periksa koneksi.');
                },
            }
        );
    };

    // 3. Edit Tanggal Modal (Entry / Exit / EIR)
    const [editDateTarget, setEditDateTarget] = useState<{
        item: ContainerItem;
        field: 'entry' | 'exit' | 'eir';
        date: string;
    } | null>(null);
    const [editDateSubmitting, setEditDateSubmitting] = useState(false);

    const openEditDate = (item: ContainerItem, field: 'entry' | 'exit' | 'eir') => {
        let current = '';
        if (field === 'entry') current = item.entry_date ? item.entry_date.substring(0, 16) : getNowIso();
        if (field === 'exit') current = item.exit_date ? item.exit_date.substring(0, 16) : getNowIso();
        if (field === 'eir') current = item.eir_date ? item.eir_date.substring(0, 16) : getNowIso();
        setEditDateTarget({ item, field, date: current });
    };

    const submitEditDate = () => {
        if (!editDateTarget || !editDateTarget.date) return;
        setEditDateSubmitting(true);
        const routeName =
            editDateTarget.field === 'entry'
                ? 'orders.update-entry'
                : editDateTarget.field === 'exit'
                ? 'orders.update-exit'
                : 'orders.update-eir';

        const payload =
            editDateTarget.field === 'entry'
                ? { entry_date: editDateTarget.date }
                : editDateTarget.field === 'exit'
                ? { exit_date: editDateTarget.date }
                : { eir_date: editDateTarget.date };

        router.patch(route(routeName, editDateTarget.item.id), payload, {
            preserveScroll: true,
            onSuccess: () => {
                setEditDateTarget(null);
                setEditDateSubmitting(false);
                showToast('Waktu berhasil diperbarui');
            },
            onError: () => {
                setEditDateSubmitting(false);
                alert('Gagal memperbarui waktu.');
            },
        });
    };

    // 4. Modal Rekam Suhu Fleksibel (First Plug In, Hourly Routine, Last Plug Out)
    const [tempTarget, setTempTarget] = useState<ContainerItem | null>(null);
    const [tempTab, setTempTab] = useState<'input' | 'history'>('input');
    const [tempMode, setTempMode] = useState<'plug_in' | 'rutin' | 'plug_out' | 'custom'>('rutin');
    const [tempDate, setTempDate] = useState(getTodayYmd());
    const [tempTime, setTempTime] = useState(getRoundHourHm());
    const [tempSign, setTempSign] = useState<'+' | '-'>('-');
    const [tempVal, setTempVal] = useState('18.0');
    const [tempSubmitting, setTempSubmitting] = useState(false);

    const openTempModal = (item: ContainerItem, defaultMode: 'plug_in' | 'rutin' | 'plug_out' = 'rutin') => {
        setTempTarget(item);
        setTempTab('input');
        setTempDate(getTodayYmd());
        setTempMode(defaultMode);

        if (defaultMode === 'plug_in') {
            setTempTime(getNowTimeHm());
            setTempSign('-');
            setTempVal('18.0');
        } else if (defaultMode === 'plug_out') {
            setTempTime(getNowTimeHm());
            setTempSign('-');
            setTempVal('18.0');
        } else {
            setTempTime(getRoundHourHm());
            setTempSign('-');
            setTempVal('18.0');
        }
    };

    const handleModeChange = (mode: 'plug_in' | 'rutin' | 'plug_out' | 'custom') => {
        setTempMode(mode);
        if (mode === 'plug_in' || mode === 'plug_out') {
            setTempTime(getNowTimeHm());
        } else if (mode === 'rutin') {
            setTempTime(getRoundHourHm());
        }
    };

    const handleApplyPresetTemp = (preset: string) => {
        if (preset.startsWith('-')) {
            setTempSign('-');
            setTempVal(preset.substring(1));
        } else if (preset.startsWith('+')) {
            setTempSign('+');
            setTempVal(preset.substring(1));
        } else {
            setTempVal(preset);
        }
    };

    const submitTempLog = () => {
        if (!tempTarget || !tempDate || !tempTime || !tempVal.trim()) {
            alert('Mohon lengkapi tanggal, jam, dan nilai suhu.');
            return;
        }

        const rawVal = tempVal.trim().replace(',', '.');
        const numVal = parseFloat(rawVal);
        if (isNaN(numVal)) {
            alert('Nilai suhu harus berupa angka yang valid.');
            return;
        }

        const finalTempStr = tempSign === '-' ? `-${Math.abs(numVal)}` : `${Math.abs(numVal)}`;

        setTempSubmitting(true);
        router.patch(
            route('orders.update-temperature', tempTarget.id),
            {
                tanggal: tempDate,
                jam: tempTime,
                suhu: finalTempStr,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setTempSubmitting(false);
                    showToast(`Suhu ${finalTempStr}°C pada jam ${tempTime} berhasil disimpan!`);
                    // Switch to history tab to view results
                    setTempTab('history');
                },
                onError: () => {
                    setTempSubmitting(false);
                    alert('Gagal menyimpan suhu. Periksa koneksi.');
                },
            }
        );
    };

    const deleteTempLog = (tanggal: string, jamKey: string) => {
        if (!tempTarget) return;
        if (!confirm(`Hapus catatan suhu jam ${jamKey} pada tanggal ${tanggal}?`)) return;

        router.patch(
            route('orders.update-temperature', tempTarget.id),
            {
                delete_tanggal: tanggal,
                delete_jam: jamKey,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    showToast(`Log suhu ${jamKey} berhasil dihapus`);
                },
                onError: () => {
                    alert('Gagal menghapus log suhu.');
                },
            }
        );
    };

    const activeTargetSuhuRecords = useMemo(() => {
        if (!tempTarget) return [];
        return getContainerSuhuRecords(tempTarget);
    }, [tempTarget]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Yard Ops Checker - Depo Surabaya" />

            {/* Notification Toast */}
            {toastMessage && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Container wrapper: max-w-2xl on larger screens for app feel */}
            <div className="mx-auto w-full max-w-2xl min-h-screen bg-slate-50 flex flex-col pb-28">
                {/* 1. APP HEADER */}
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md shadow-xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs">
                                <Boxes className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                                        Yard Ops Checker
                                    </h1>
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                        Mobile
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    Petugas: <span className="font-semibold text-slate-700">{userName}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition active:scale-95"
                                title="Refresh Data"
                            >
                                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
                            </button>
                            <Link
                                href="/temperature-records"
                                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition active:scale-95"
                            >
                                <Thermometer className="h-3.5 w-3.5" />
                                Master
                            </Link>
                        </div>
                    </div>

                    {/* KPI Quick Counter Pills */}
                    <div className="mt-3 grid grid-cols-4 gap-1.5 text-center">
                        <button
                            type="button"
                            onClick={() => setActiveTab('gate_in')}
                            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border transition ${
                                activeTab === 'gate_in'
                                    ? 'bg-amber-50 border-amber-300 shadow-xs'
                                    : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <span className="text-[10px] text-slate-500 font-medium">Menunggu In</span>
                            <span className="text-base font-extrabold text-amber-600 leading-tight">
                                {kpi.container_belum_masuk}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('di_depo')}
                            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border transition ${
                                activeTab === 'di_depo'
                                    ? 'bg-blue-50 border-blue-300 shadow-xs'
                                    : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <span className="text-[10px] text-slate-500 font-medium">Di Depo</span>
                            <span className="text-base font-extrabold text-blue-600 leading-tight">
                                {kpi.container_aktif}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('suhu')}
                            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border transition ${
                                activeTab === 'suhu'
                                    ? 'bg-cyan-50 border-cyan-300 shadow-xs'
                                    : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <span className="text-[10px] text-slate-500 font-medium">Reefer / Suhu</span>
                            <span className="text-base font-extrabold text-cyan-700 leading-tight">
                                {reeferContainers.length}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('gate_out')}
                            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border transition ${
                                activeTab === 'gate_out'
                                    ? 'bg-purple-50 border-purple-300 shadow-xs'
                                    : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <span className="text-[10px] text-slate-500 font-medium">Out Hari Ini</span>
                            <span className="text-base font-extrabold text-purple-600 leading-tight">
                                {kpi.gate_out_hari_ini}
                            </span>
                        </button>
                    </div>

                    {/* Quick Search & Size Filter Bar */}
                    <div className="mt-3 space-y-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari No. Container, Customer, AJU..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 rounded-xl border border-slate-300 bg-slate-50/80 pl-9 pr-9 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition shadow-2xs"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Size Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                            <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1">Ukuran:</span>
                            {(['all', '20ft', '40ft', '45ft'] as const).map((sz) => (
                                <button
                                    key={sz}
                                    type="button"
                                    onClick={() => setSizeFilter(sz)}
                                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-tight transition cursor-pointer shrink-0 ${
                                        sizeFilter === sz
                                            ? 'bg-blue-600 text-white shadow-2xs'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    {sz === 'all' ? 'Semua' : sz}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* 2. TAB CONTENT TITLE & STATS */}
                <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {activeTab === 'gate_in' && 'Kontainer Menunggu Gate In'}
                            {activeTab === 'di_depo' && 'Kontainer Aktif di Depo'}
                            {activeTab === 'suhu' && 'Pemantauan Suhu Reefer'}
                            {activeTab === 'gate_out' && 'Riwayat Gate Out Hari Ini'}
                        </span>
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                            {filteredList.length}
                        </span>
                    </div>

                    {activeTab === 'suhu' && (
                        <span className="text-[11px] text-cyan-800 font-semibold bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                            Plug In & Rutin
                        </span>
                    )}
                </div>

                {/* 3. CARD FEED */}
                <main className="flex-1 px-4 space-y-3">
                    {filteredList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-xs">
                            <Boxes className="h-10 w-10 text-slate-300" />
                            <p className="mt-2 text-sm font-semibold text-slate-700">
                                {searchQuery ? 'Tidak ada kontainer yang cocok dengan pencarian' : 'Tidak ada kontainer pada tab ini'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1 max-w-xs">
                                {searchQuery ? 'Coba ganti kata kunci nomor kontainer atau customer.' : 'Data akan otomatis terisi saat order baru dibuat atau status berubah.'}
                            </p>
                        </div>
                    ) : (
                        filteredList.map((item) => {
                            const isReefer = isReeferItem(item);
                            const dwell = calculateDwellDays(item.entry_date);
                            const latestTemp = getLatestSuhu(item);

                            return (
                                <div
                                    key={item.id}
                                    className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
                                        isReefer
                                            ? 'border-cyan-200 hover:border-cyan-300'
                                            : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-mono text-base font-black text-slate-900 tracking-tight">
                                                    {item.container_number}
                                                </span>
                                                {item.price_type && (
                                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold uppercase text-slate-700 border border-slate-200">
                                                        {formatContainerSize(item.price_type)}
                                                    </span>
                                                )}
                                                {isReefer && (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-cyan-50 px-2 py-0.5 text-[10px] font-extrabold text-cyan-800 border border-cyan-200">
                                                        <Thermometer className="h-3 w-3 text-cyan-600" />
                                                        REEFER
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs font-bold text-slate-800 mt-1">
                                                {item.order?.customer?.name || 'Customer tidak tertera'}
                                            </p>
                                        </div>

                                        {/* Status Pill */}
                                        <div className="shrink-0 text-right">
                                            {item.exit_date ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Gate Out
                                                </span>
                                            ) : item.entry_date ? (
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                                    dwell > 5
                                                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                }`}>
                                                    <Clock className="h-3 w-3" />
                                                    {dwell} Hari di Depo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                                                    <Clock className="h-3 w-3" />
                                                    Pending In
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body Details */}
                                    <div className="py-2.5 space-y-1.5 text-xs text-slate-600">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">Layanan:</span>
                                            <span className="font-semibold text-slate-800 text-right">
                                                {item.product?.service_type || '-'}
                                            </span>
                                        </div>

                                        {item.order?.shipper?.name && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Shipper:</span>
                                                <span className="font-medium text-slate-700 text-right truncate max-w-[200px]">
                                                    {item.order.shipper.name}
                                                </span>
                                            </div>
                                        )}

                                        {item.order?.no_aju && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">AJU:</span>
                                                <span className="font-mono font-medium text-slate-700">
                                                    {item.order.no_aju}
                                                </span>
                                            </div>
                                        )}

                                        {item.commodity && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Komoditi:</span>
                                                <span className="font-medium text-slate-700">
                                                    {item.commodity}
                                                </span>
                                            </div>
                                        )}

                                        {/* Entry & Exit Date Info */}
                                        <div className="pt-1 border-t border-slate-100 flex flex-col gap-1 text-[11px]">
                                            {item.entry_date && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400 flex items-center gap-1">
                                                        <ArrowDownRight className="h-3 w-3 text-emerald-600" />
                                                        Masuk:
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-semibold text-slate-800">
                                                            {formatDate(item.entry_date)}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditDate(item, 'entry')}
                                                            className="text-slate-400 hover:text-blue-600 p-0.5"
                                                            title="Ubah Jam Masuk"
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {item.exit_date && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400 flex items-center gap-1">
                                                        <ArrowUpRight className="h-3 w-3 text-purple-600" />
                                                        Keluar:
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-semibold text-slate-800">
                                                            {formatDate(item.exit_date)}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditDate(item, 'exit')}
                                                            className="text-slate-400 hover:text-purple-600 p-0.5"
                                                            title="Ubah Jam Keluar"
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Temperature Status Box for Reefer */}
                                        {isReefer && (
                                            <div className="mt-2 rounded-xl border border-cyan-100 bg-cyan-50/60 p-2.5 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                                                        <Thermometer className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        {latestTemp ? (
                                                            <>
                                                                <div className="text-[11px] font-bold text-slate-900">
                                                                    Suhu Terakhir:{' '}
                                                                    <span className="text-cyan-800 font-extrabold text-sm">
                                                                        {latestTemp.temp}°C
                                                                    </span>
                                                                </div>
                                                                <div className="text-[10px] text-slate-500">
                                                                    {latestTemp.time} ({latestTemp.date}) • {latestTemp.total} total log
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-[11px] text-amber-700 font-medium">
                                                                Belum ada log suhu tersimpan
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => openTempModal(item, 'rutin')}
                                                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white border border-cyan-300 text-cyan-800 shadow-2xs hover:bg-cyan-50 transition active:scale-95"
                                                >
                                                    {latestTemp ? 'Update Suhu' : '+ Rekam Suhu'}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons Bar */}
                                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                                        {/* A. Belum Masuk -> Tombol Utama: GATE IN */}
                                        {!item.entry_date && (
                                            <button
                                                type="button"
                                                onClick={() => openGateIn(item)}
                                                className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-98 cursor-pointer"
                                            >
                                                <ArrowDownRight className="h-4 w-4" />
                                                Catat Gate In (Masuk)
                                            </button>
                                        )}

                                        {/* B. Sudah Masuk Tapi Belum Keluar -> Tombol GATE OUT & CATAT SUHU */}
                                        {item.entry_date && !item.exit_date && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => openGateOut(item)}
                                                    className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition active:scale-98 cursor-pointer"
                                                >
                                                    <ArrowUpRight className="h-4 w-4" />
                                                    Catat Gate Out (Keluar)
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => openTempModal(item, 'rutin')}
                                                    className={`flex items-center justify-center gap-1 h-10 px-3.5 rounded-xl border font-bold text-xs transition active:scale-98 cursor-pointer ${
                                                        isReefer
                                                            ? 'border-cyan-300 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                                                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                                    }`}
                                                    title="Catat Suhu Kontainer"
                                                >
                                                    <Thermometer className="h-4 w-4 text-cyan-600" />
                                                    Suhu
                                                </button>
                                            </>
                                        )}

                                        {/* C. Sudah Keluar -> Tampilkan info & detail */}
                                        {item.exit_date && (
                                            <div className="flex-1 flex items-center justify-between text-xs text-slate-500">
                                                <span>Kontainer telah keluar depo</span>
                                                {isReefer && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openTempModal(item, 'rutin')}
                                                        className="inline-flex items-center gap-1 text-cyan-700 font-semibold hover:underline"
                                                    >
                                                        <Thermometer className="h-3.5 w-3.5" />
                                                        Lihat Log Suhu
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Tombol Detail Order Item */}
                                        <a
                                            href={`/orders/item/${item.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition active:scale-95 shrink-0"
                                            title="Lihat Detail Penuh"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </main>

                {/* 4. FIXED BOTTOM NAVIGATION BAR */}
                <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 shadow-xl sm:max-w-2xl sm:mx-auto">
                    <div className="grid grid-cols-4 gap-1">
                        {/* Tab 1: Gate In */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('gate_in')}
                            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition relative ${
                                activeTab === 'gate_in'
                                    ? 'bg-amber-500 text-white font-bold shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <ArrowDownRight className="h-5 w-5" />
                            <span className="text-[10px] mt-0.5 font-semibold">Gate In</span>
                            {kpi.container_belum_masuk > 0 && (
                                <span className={`absolute top-1 right-2 rounded-full px-1.5 py-0.2 text-[9px] font-extrabold ${
                                    activeTab === 'gate_in' ? 'bg-white text-amber-700' : 'bg-amber-500 text-white'
                                }`}>
                                    {kpi.container_belum_masuk}
                                </span>
                            )}
                        </button>

                        {/* Tab 2: Di Depo */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('di_depo')}
                            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition relative ${
                                activeTab === 'di_depo'
                                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <Boxes className="h-5 w-5" />
                            <span className="text-[10px] mt-0.5 font-semibold">Di Depo</span>
                            {kpi.container_aktif > 0 && (
                                <span className={`absolute top-1 right-2 rounded-full px-1.5 py-0.2 text-[9px] font-extrabold ${
                                    activeTab === 'di_depo' ? 'bg-white text-blue-700' : 'bg-blue-600 text-white'
                                }`}>
                                    {kpi.container_aktif}
                                </span>
                            )}
                        </button>

                        {/* Tab 3: Cek Suhu */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('suhu')}
                            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition relative ${
                                activeTab === 'suhu'
                                    ? 'bg-cyan-600 text-white font-bold shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <Thermometer className="h-5 w-5" />
                            <span className="text-[10px] mt-0.5 font-semibold">Cek Suhu</span>
                            {reeferContainers.length > 0 && (
                                <span className={`absolute top-1 right-2 rounded-full px-1.5 py-0.2 text-[9px] font-extrabold ${
                                    activeTab === 'suhu' ? 'bg-white text-cyan-800' : 'bg-cyan-600 text-white'
                                }`}>
                                    {reeferContainers.length}
                                </span>
                            )}
                        </button>

                        {/* Tab 4: Gate Out */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('gate_out')}
                            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition relative ${
                                activeTab === 'gate_out'
                                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <ArrowUpRight className="h-5 w-5" />
                            <span className="text-[10px] mt-0.5 font-semibold">Gate Out</span>
                            {kpi.gate_out_hari_ini > 0 && (
                                <span className={`absolute top-1 right-2 rounded-full px-1.5 py-0.2 text-[9px] font-extrabold ${
                                    activeTab === 'gate_out' ? 'bg-white text-purple-700' : 'bg-purple-600 text-white'
                                }`}>
                                    {kpi.gate_out_hari_ini}
                                </span>
                            )}
                        </button>
                    </div>
                </nav>
            </div>

            {/* ========================================================================= */}
            {/* MODAL 1: GATE IN MODAL (BOTTOM SHEET STYLE) */}
            {/* ========================================================================= */}
            {gateInTarget && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 animate-in fade-in duration-150">
                    <div className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                    <ArrowDownRight className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Catat Jam Gate In (Masuk)</h3>
                                    <p className="text-[11px] text-slate-500">Konfirmasi kedatangan kontainer di depo</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setGateInTarget(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Container Snapshot */}
                        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs space-y-1 border border-slate-200">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">No. Kontainer:</span>
                                <span className="font-mono font-bold text-slate-900 text-sm">
                                    {gateInTarget.container_number} ({formatContainerSize(gateInTarget.price_type)})
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Customer:</span>
                                <span className="font-semibold text-slate-800">
                                    {gateInTarget.order?.customer?.name || '-'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Layanan:</span>
                                <span className="font-medium text-slate-700">
                                    {gateInTarget.product?.service_type || '-'}
                                </span>
                            </div>
                        </div>

                        {/* Input DateTime */}
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-800">Tanggal & Jam Masuk (WIB):</label>
                                <button
                                    type="button"
                                    onClick={() => setGateInDate(getNowIso())}
                                    className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition"
                                >
                                    🕒 Gunakan Jam Sekarang
                                </button>
                            </div>
                            <input
                                type="datetime-local"
                                value={gateInDate}
                                onChange={(e) => setGateInDate(e.target.value)}
                                className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="mt-6 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setGateInTarget(null)}
                                className="flex-1 h-11 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={submitGateIn}
                                disabled={gateInSubmitting || !gateInDate}
                                className="flex-2 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                {gateInSubmitting ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Konfirmasi Gate In
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 2: GATE OUT MODAL (BOTTOM SHEET STYLE) */}
            {/* ========================================================================= */}
            {gateOutTarget && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 animate-in fade-in duration-150">
                    <div className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                                    <ArrowUpRight className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Catat Jam Gate Out (Keluar)</h3>
                                    <p className="text-[11px] text-slate-500">Konfirmasi kontainer keluar meninggalkan depo</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setGateOutTarget(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Container Snapshot */}
                        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs space-y-1 border border-slate-200">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">No. Kontainer:</span>
                                <span className="font-mono font-bold text-slate-900 text-sm">
                                    {gateOutTarget.container_number} ({formatContainerSize(gateOutTarget.price_type)})
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Customer:</span>
                                <span className="font-semibold text-slate-800">
                                    {gateOutTarget.order?.customer?.name || '-'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Waktu Masuk:</span>
                                <span className="font-medium text-slate-700">
                                    {formatDate(gateOutTarget.entry_date)} ({calculateDwellDays(gateOutTarget.entry_date)} hari di depo)
                                </span>
                            </div>
                        </div>

                        {/* Warning if reefer */}
                        {isReeferItem(gateOutTarget) && (
                            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                                <div>
                                    <strong className="font-semibold">Perhatian Reefer:</strong>
                                    <p className="text-[11px] text-amber-700 mt-0.5">
                                        Pastikan suhu <strong>Plug Out Terakhir</strong> telah dicatat sebelum kontainer keluar depo.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Input DateTime */}
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-800">Tanggal & Jam Keluar (WIB):</label>
                                <button
                                    type="button"
                                    onClick={() => setGateOutDate(getNowIso())}
                                    className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition"
                                >
                                    🕒 Gunakan Jam Sekarang
                                </button>
                            </div>
                            <input
                                type="datetime-local"
                                value={gateOutDate}
                                onChange={(e) => setGateOutDate(e.target.value)}
                                className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="mt-6 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setGateOutTarget(null)}
                                className="flex-1 h-11 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={submitGateOut}
                                disabled={gateOutSubmitting || !gateOutDate}
                                className="flex-2 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                {gateOutSubmitting ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Konfirmasi Gate Out
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 3: EDIT TANGGAL SPESIFIK (ENTRY / EXIT / EIR) */}
            {/* ========================================================================= */}
            {editDateTarget && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 animate-in fade-in duration-150">
                    <div className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                                    <Pencil className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Edit Waktu {editDateTarget.field.toUpperCase()}
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Kontainer {editDateTarget.item.container_number}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditDateTarget(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-800">Tanggal & Jam Baru (WIB):</label>
                                <button
                                    type="button"
                                    onClick={() => setEditDateTarget({ ...editDateTarget, date: getNowIso() })}
                                    className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition"
                                >
                                    🕒 Jam Sekarang
                                </button>
                            </div>
                            <input
                                type="datetime-local"
                                value={editDateTarget.date}
                                onChange={(e) => setEditDateTarget({ ...editDateTarget, date: e.target.value })}
                                className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="mt-6 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setEditDateTarget(null)}
                                className="flex-1 h-11 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={submitEditDate}
                                disabled={editDateSubmitting || !editDateTarget.date}
                                className="flex-2 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                {editDateSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 4: ADVANCED REEFER TEMPERATURE MODAL (PLUG IN, RUTIN, PLUG OUT) */}
            {/* ========================================================================= */}
            {tempTarget && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 animate-in fade-in duration-150">
                    <div className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-200 overflow-hidden">
                        {/* Header Modal */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-2xs">
                                    <Thermometer className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-mono text-sm font-extrabold text-slate-900 tracking-tight">
                                            {tempTarget.container_number}
                                        </h3>
                                        <span className="rounded bg-cyan-100 px-1.5 py-0.2 text-[10px] font-bold text-cyan-900">
                                            {formatContainerSize(tempTarget.price_type)}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
                                        {tempTarget.order?.customer?.name || 'Customer'} • {tempTarget.product?.service_type}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setTempTarget(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Tab Switcher: Input Form vs History Timeline */}
                        <div className="flex border-b border-slate-200 bg-white px-4 pt-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => setTempTab('input')}
                                className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold transition border-b-2 ${
                                    tempTab === 'input'
                                        ? 'border-cyan-600 text-cyan-800'
                                        : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Catat Suhu Baru
                            </button>

                            <button
                                type="button"
                                onClick={() => setTempTab('history')}
                                className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold transition border-b-2 ${
                                    tempTab === 'history'
                                        ? 'border-cyan-600 text-cyan-800'
                                        : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <HistoryIcon className="h-3.5 w-3.5" />
                                Riwayat Log
                                <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-slate-700">
                                    {activeTargetSuhuRecords.reduce((acc, r) => acc + Object.keys(r.jam_data || {}).length, 0)}
                                </span>
                            </button>
                        </div>

                        {/* Modal Body with Scroll */}
                        <div className="p-4 overflow-y-auto flex-1 space-y-4">
                            {tempTab === 'input' ? (
                                <div className="space-y-4">
                                    {/* 1. KATEGORI PRESET BUTTONS */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-800">
                                            Pilih Kategori Entri Suhu:
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                            {/* Preset 1: Plug In Pertama */}
                                            <button
                                                type="button"
                                                onClick={() => handleModeChange('plug_in')}
                                                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition ${
                                                    tempMode === 'plug_in'
                                                        ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20 shadow-2xs font-bold'
                                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                                                    <Power className="h-3.5 w-3.5" />
                                                    Plug In Awal
                                                </div>
                                                <span className="text-[10px] text-slate-500 mt-0.5 font-normal">
                                                    Jam pertama (menit persis)
                                                </span>
                                            </button>

                                            {/* Preset 2: Rutin Per Jam */}
                                            <button
                                                type="button"
                                                onClick={() => handleModeChange('rutin')}
                                                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition ${
                                                    tempMode === 'rutin'
                                                        ? 'border-cyan-500 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-500/20 shadow-2xs font-bold'
                                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-800">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Log Rutin
                                                </div>
                                                <span className="text-[10px] text-slate-500 mt-0.5 font-normal">
                                                    Tiap awal jam (01:00, ...)
                                                </span>
                                            </button>

                                            {/* Preset 3: Plug Out Terakhir */}
                                            <button
                                                type="button"
                                                onClick={() => handleModeChange('plug_out')}
                                                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition col-span-2 sm:col-span-1 ${
                                                    tempMode === 'plug_out'
                                                        ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20 shadow-2xs font-bold'
                                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                                                    <PowerOff className="h-3.5 w-3.5" />
                                                    Plug Out Akhir
                                                </div>
                                                <span className="text-[10px] text-slate-500 mt-0.5 font-normal">
                                                    Jam cabut (menit persis)
                                                </span>
                                            </button>
                                        </div>

                                        {/* Guidance badge based on mode */}
                                        <div className="rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600 border border-slate-200 flex items-center gap-1.5">
                                            <Info className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                            {tempMode === 'plug_in' && (
                                                <span>
                                                    <strong>Plug In Awal:</strong> Jam otomatis diset ke waktu sekarang (menit presisi).
                                                </span>
                                            )}
                                            {tempMode === 'rutin' && (
                                                <span>
                                                    <strong>Log Rutin:</strong> Catat pengecekan berkala per jam di depo.
                                                </span>
                                            )}
                                            {tempMode === 'plug_out' && (
                                                <span>
                                                    <strong>Plug Out Terakhir:</strong> Dicatat saat kabel dicabut sebelum kontainer keluar depo.
                                                </span>
                                            )}
                                            {tempMode === 'custom' && (
                                                <span>
                                                    <strong>Kustom:</strong> Masukkan jam bebas sesuai kebutuhan.
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* 2. TANGGAL & JAM PICKER */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-800">Tanggal:</label>
                                            <input
                                                type="date"
                                                value={tempDate}
                                                onChange={(e) => setTempDate(e.target.value)}
                                                className="w-full h-10 rounded-xl border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-900 focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold text-slate-800">Jam (HH:mm):</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setTempTime(getNowTimeHm())}
                                                    className="text-[10px] font-semibold text-cyan-700 hover:underline"
                                                >
                                                    Menit Sekarang
                                                </button>
                                            </div>
                                            <input
                                                type="time"
                                                value={tempTime}
                                                onChange={(e) => {
                                                    setTempTime(e.target.value);
                                                    setTempMode('custom');
                                                }}
                                                className="w-full h-10 rounded-xl border border-slate-300 bg-white px-2.5 text-xs font-mono font-bold text-slate-900 focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* 1-Tap Hour Selector for Routine Checks */}
                                    {tempMode === 'rutin' && (
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-semibold text-slate-500">
                                                Pilih Cepat Jam Rutin:
                                            </label>
                                            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 rounded-xl border border-slate-200 bg-slate-50/70">
                                                {COMMON_HOURS.map((h) => (
                                                    <button
                                                        key={h}
                                                        type="button"
                                                        onClick={() => setTempTime(h)}
                                                        className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition ${
                                                            tempTime === h
                                                                ? 'bg-cyan-600 text-white shadow-2xs'
                                                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        {h}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. INPUT NILAI SUHU (°C) */}
                                    <div className="space-y-2 pt-1 border-t border-slate-100">
                                        <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                                            <span>Nilai Suhu Kontainer:</span>
                                            <span className="text-[11px] font-mono font-bold text-cyan-800">
                                                Hasil: {tempSign}{tempVal || '0'}°C
                                            </span>
                                        </label>

                                        <div className="flex items-center gap-2">
                                            {/* Sign Toggle Button */}
                                            <button
                                                type="button"
                                                onClick={() => setTempSign(tempSign === '-' ? '+' : '-')}
                                                className={`h-12 px-4 rounded-xl font-mono text-base font-black transition flex items-center gap-1 shrink-0 ${
                                                    tempSign === '-'
                                                        ? 'bg-blue-600 text-white shadow-xs'
                                                        : 'bg-amber-500 text-white shadow-xs'
                                                }`}
                                                title="Klik untuk ubah Minus / Plus"
                                            >
                                                <span>{tempSign}</span>
                                                <span className="text-[10px] font-normal uppercase opacity-80">
                                                    {tempSign === '-' ? 'Minus' : 'Plus'}
                                                </span>
                                            </button>

                                            {/* Number Input */}
                                            <div className="relative flex-1">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="Contoh: 18.0"
                                                    value={tempVal}
                                                    onChange={(e) => setTempVal(e.target.value)}
                                                    className="w-full h-12 rounded-xl border border-slate-300 bg-white px-3 pr-10 text-base font-mono font-bold text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                                    °C
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quick Temperature Presets */}
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-slate-400 font-semibold uppercase">
                                                Preset Suhu Cepat:
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {QUICK_TEMP_PRESETS.map((p) => (
                                                    <button
                                                        key={p}
                                                        type="button"
                                                        onClick={() => handleApplyPresetTemp(p)}
                                                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-mono font-semibold text-slate-700 hover:bg-slate-100 transition active:scale-95"
                                                    >
                                                        {p}°C
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="button"
                                        onClick={submitTempLog}
                                        disabled={tempSubmitting || !tempVal.trim()}
                                        className="w-full h-12 rounded-xl bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-98 cursor-pointer"
                                    >
                                        {tempSubmitting ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                Menyimpan Catatan Suhu...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Simpan Log Suhu ({tempSign}{tempVal}°C pada {tempTime})
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                /* TAB 2: RIWAYAT / HISTORY TIMELINE */
                                <div className="space-y-4">
                                    {activeTargetSuhuRecords.length === 0 ? (
                                        <div className="py-10 text-center text-xs text-slate-400">
                                            <Thermometer className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                                            Belum ada catatan suhu tersimpan untuk kontainer ini.
                                        </div>
                                    ) : (
                                        activeTargetSuhuRecords.map((rec, rIdx) => {
                                            const entries = Object.entries(rec.jam_data || {}).sort(([a], [b]) =>
                                                a.localeCompare(b)
                                            );
                                            return (
                                                <div
                                                    key={rIdx}
                                                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5"
                                                >
                                                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                                                            <Calendar className="h-3.5 w-3.5 text-cyan-600" />
                                                            {rec.tanggal}
                                                        </div>
                                                        <span className="text-[10px] text-slate-500 font-semibold">
                                                            {entries.length} Catatan
                                                        </span>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        {entries.map(([jamKey, tempV], eIdx) => {
                                                            const isFirst = eIdx === 0;
                                                            const isLast = eIdx === entries.length - 1 && entries.length > 1;
                                                            const isExactMinute = jamKey.includes(':') && !jamKey.endsWith(':00');

                                                            return (
                                                                <div
                                                                    key={jamKey}
                                                                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-mono font-bold text-slate-900">
                                                                            {jamKey.includes(':') ? jamKey : `${jamKey}:00`}
                                                                        </span>

                                                                        {/* Automatic Badges */}
                                                                        {isFirst && isExactMinute ? (
                                                                            <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-800">
                                                                                Plug In Awal
                                                                            </span>
                                                                        ) : isLast && isExactMinute ? (
                                                                            <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800">
                                                                                Plug Out Akhir
                                                                            </span>
                                                                        ) : (
                                                                            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-medium text-slate-600">
                                                                                Rutin
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex items-center gap-3">
                                                                        <span className="font-mono font-black text-sm text-cyan-900">
                                                                            {tempV}°C
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => deleteTempLog(rec.tanggal, jamKey)}
                                                                            className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
                                                                            title="Hapus Catatan Suhu Ini"
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end shrink-0">
                            <button
                                type="button"
                                onClick={() => setTempTarget(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
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

                        {/* 2. Rentang Tanggal */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-medium text-gray-600">Rentang Tanggal</label>
                            <DateRangePicker
                                startDate={startDate}
                                endDate={endDate}
                                onChange={({ startDate: s, endDate: e }) => {
                                    setStartDate(s);
                                    setEndDate(e);
                                    setCurrentPage(1);
                                }}
                                placeholder="Pilih rentang tanggal filter..."
                                className="w-full"
                                align="right"
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
