import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SuratJalanModal, { SuratJalanData } from '@/components/surat-jalan-modal';
import {
    FileSpreadsheet,
    Printer,
    Search,
    RotateCcw,
    Filter,
    Boxes,
    CheckCircle2,
    Clock,
    Truck,
    Receipt,
    EyeOff,
    Eye,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

interface ReportItem {
    id: number;
    order_id: string;
    order_pk?: number;
    no_aju: string;
    customer_name: string;
    shipper_name: string;
    service_type: string;
    container_number: string;
    size: string;
    entry_date: string | null;
    exit_date: string | null;
    commodity: string;
    is_excluded: boolean;
    is_invoiced: boolean;
    invoice_number?: string;
    invoice_id?: number;
}

interface CustomerOption {
    id: number;
    name: string;
}

interface ShipperOption {
    id: number;
    name: string;
}

interface KpiData {
    total_containers: number;
    count_20ft: number;
    count_40ft: number;
    count_45ft: number;
    count_other: number;
    aktif_di_depo: number;
    sudah_keluar: number;
    belum_masuk: number;
    invoiced: number;
    uninvoiced: number;
}

interface Props {
    reports: {
        data: ReportItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    kpi: KpiData;
    customers: CustomerOption[];
    shippers: ShipperOption[];
    service_types: string[];
    filters: {
        customer_id: string;
        shipper_id: string;
        service_type: string;
        price_type: string;
        date_from: string;
        date_to: string;
        date_type: string;
        exclude_status: string;
        invoice_status: string;
        search: string;
        per_page: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Report',
        href: '/reports',
    },
];

export default function ReportIndex({ reports, kpi, customers, shippers, service_types, filters }: Props) {
    // Local Filter States
    const [customerId, setCustomerId] = useState(filters.customer_id || 'all');
    const [shipperId, setShipperId] = useState(filters.shipper_id || 'all');
    const [serviceType, setServiceType] = useState(filters.service_type || 'all');
    const [priceType, setPriceType] = useState(filters.price_type || 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [dateType, setDateType] = useState(filters.date_type || 'entry_date');
    const [excludeStatus, setExcludeStatus] = useState(filters.exclude_status || 'active');
    const [invoiceStatus, setInvoiceStatus] = useState(filters.invoice_status || 'all');
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(String(filters.per_page || 25));
    const [showFilterPanel, setShowFilterPanel] = useState(true);

    // Surat Jalan Modal
    const [sjModalOpen, setSjModalOpen] = useState(false);
    const [sjData, setSjData] = useState<SuratJalanData | null>(null);

    const applyFilters = (overrides?: Partial<typeof filters>) => {
        router.get(
            route('reports.index'),
            {
                customer_id: overrides?.customer_id !== undefined ? overrides.customer_id : (customerId === 'all' ? undefined : customerId),
                shipper_id: overrides?.shipper_id !== undefined ? overrides.shipper_id : (shipperId === 'all' ? undefined : shipperId),
                service_type: overrides?.service_type !== undefined ? overrides.service_type : (serviceType === 'all' ? undefined : serviceType),
                price_type: overrides?.price_type !== undefined ? overrides.price_type : (priceType === 'all' ? undefined : priceType),
                date_from: overrides?.date_from !== undefined ? overrides.date_from : (dateFrom || undefined),
                date_to: overrides?.date_to !== undefined ? overrides.date_to : (dateTo || undefined),
                date_type: overrides?.date_type !== undefined ? overrides.date_type : dateType,
                exclude_status: overrides?.exclude_status !== undefined ? overrides.exclude_status : excludeStatus,
                invoice_status: overrides?.invoice_status !== undefined ? overrides.invoice_status : invoiceStatus,
                search: overrides?.search !== undefined ? overrides.search : (search || undefined),
                per_page: overrides?.per_page !== undefined ? overrides.per_page : perPage,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const resetFilters = () => {
        setCustomerId('all');
        setShipperId('all');
        setServiceType('all');
        setPriceType('all');
        setDateFrom('');
        setDateTo('');
        setDateType('entry_date');
        setExcludeStatus('active');
        setInvoiceStatus('all');
        setSearch('');
        setPerPage('25');
        router.get(route('reports.index'), {}, { preserveScroll: true });
    };

    const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    };

    const openSuratJalan = (item: ReportItem) => {
        setSjData({
            container_number: item.container_number,
            size: item.size || '20ft',
            customer_name: item.customer_name,
            shipper_name: item.shipper_name,
            service_type: item.service_type,
            commodity: item.commodity,
            no_aju: item.no_aju,
            order_id: item.order_id,
            date: item.exit_date || item.entry_date,
        });
        setSjModalOpen(true);
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    const handlePrintReport = () => {
        if (reports.data.length === 0) {
            alert('Tidak ada data laporan untuk dicetak.');
            return;
        }

        const printWin = window.open('', '_blank', 'width=1100,height=800');
        if (!printWin) {
            alert('Popup terblokir oleh browser. Harap izinkan popup.');
            return;
        }

        const selectedCust = customers.find((c) => String(c.id) === customerId)?.name || 'Semua Customer';
        const selectedShip = shippers.find((s) => String(s.id) === shipperId)?.name || 'Semua Shipper';
        const selectedService = serviceType === 'all' ? 'Semua Layanan' : serviceType;
        const periodStr = dateFrom || dateTo ? `${formatDate(dateFrom)} s/d ${formatDate(dateTo)}` : 'Semua Periode';
        const printDate = new Date().toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        const rowsHtml = reports.data
            .map(
                (item, idx) => `
            <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td><strong>${item.order_id}</strong><br><small style="color: #666;">AJU: ${item.no_aju || '-'}</small></td>
                <td>${item.customer_name}</td>
                <td>${item.shipper_name}</td>
                <td>${item.service_type}</td>
                <td style="font-weight: bold; font-family: monospace;">${item.container_number}</td>
                <td style="text-align: center;">${item.size}</td>
                <td>${formatDate(item.entry_date)}</td>
                <td>${formatDate(item.exit_date)}</td>
                <td>${item.commodity || '-'}</td>
                <td style="text-align: center;">${item.is_invoiced ? `Sudah (${item.invoice_number || 'Inv'})` : 'Belum'}</td>
                <td style="text-align: center;">${item.is_excluded ? 'Ya' : 'Tidak'}</td>
            </tr>
        `
            )
            .join('');

        printWin.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Laporan Order Depo Surabaya</title>
                <style>
                    @page {
                        size: A4 landscape;
                        margin: 10mm;
                    }
                    * {
                        box-sizing: border-box;
                        font-family: Arial, Helvetica, sans-serif;
                        color: #111;
                    }
                    body {
                        margin: 0;
                        padding: 10px;
                        font-size: 11px;
                    }
                    .header-table {
                        width: 100%;
                        border-bottom: 2px solid #000;
                        padding-bottom: 8px;
                        margin-bottom: 12px;
                    }
                    .company-name {
                        font-size: 16pt;
                        font-weight: 800;
                        margin-bottom: 2px;
                    }
                    .company-address {
                        font-size: 9pt;
                        color: #444;
                    }
                    .report-title {
                        text-align: center;
                        font-size: 13pt;
                        font-weight: 800;
                        text-transform: uppercase;
                        margin: 12px 0 6px 0;
                        letter-spacing: 0.5px;
                    }
                    .filter-info {
                        display: flex;
                        justify-content: space-between;
                        font-size: 9pt;
                        background: #f4f4f5;
                        padding: 8px 12px;
                        border-radius: 4px;
                        margin-bottom: 12px;
                    }
                    table.data-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 9pt;
                    }
                    table.data-table th, table.data-table td {
                        border: 1px solid #333;
                        padding: 5px 6px;
                        vertical-align: top;
                    }
                    table.data-table th {
                        background-color: #eaeaea;
                        font-weight: 700;
                        text-align: left;
                    }
                    .kpi-summary {
                        margin-top: 14px;
                        display: flex;
                        gap: 15px;
                        font-size: 9pt;
                    }
                    .kpi-pill {
                        border: 1px solid #ccc;
                        padding: 4px 10px;
                        border-radius: 4px;
                        background: #fafafa;
                    }
                    .sig-section {
                        margin-top: 30px;
                        display: flex;
                        justify-content: space-between;
                        page-break-inside: avoid;
                    }
                    .sig-box {
                        width: 200px;
                        text-align: center;
                        font-size: 9.5pt;
                    }
                    .sig-line {
                        margin-top: 50px;
                        border-bottom: 1px solid #000;
                    }
                </style>
            </head>
            <body>
                <table class="header-table">
                    <tr>
                        <td>
                            <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                            <div class="company-address">
                                Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) | Telp. 031-353 9484, 031-3539485 | Fax. 031-3539482
                            </div>
                        </td>
                        <td style="text-align: right; vertical-align: middle;">
                            <span style="font-size: 18pt; font-weight: 900; color: #1e3a8a;">LAPORAN ORDER</span>
                        </td>
                    </tr>
                </table>

                <div class="filter-info">
                    <div>
                        <strong>Customer:</strong> ${selectedCust} &nbsp;|&nbsp;
                        <strong>Shipper:</strong> ${selectedShip} &nbsp;|&nbsp;
                        <strong>Layanan:</strong> ${selectedService}
                    </div>
                    <div>
                        <strong>Periode:</strong> ${periodStr} &nbsp;|&nbsp;
                        <strong>Dicetak:</strong> ${printDate}
                    </div>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 25px; text-align: center;">No</th>
                            <th>No. Order / AJU</th>
                            <th>Customer</th>
                            <th>Shipper</th>
                            <th>Layanan</th>
                            <th>No. Kontainer</th>
                            <th style="text-align: center;">Ukuran</th>
                            <th>Tgl Masuk</th>
                            <th>Tgl Keluar</th>
                            <th>Komoditi</th>
                            <th style="text-align: center;">Invoice</th>
                            <th style="text-align: center;">Exclude</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>

                <div class="kpi-summary">
                    <div class="kpi-pill"><strong>Total Kontainer:</strong> ${kpi.total_containers}</div>
                    <div class="kpi-pill"><strong>20ft:</strong> ${kpi.count_20ft}</div>
                    <div class="kpi-pill"><strong>40ft:</strong> ${kpi.count_40ft}</div>
                    <div class="kpi-pill"><strong>45ft:</strong> ${kpi.count_45ft}</div>
                    <div class="kpi-pill"><strong>Aktif di Depo:</strong> ${kpi.aktif_di_depo}</div>
                    <div class="kpi-pill"><strong>Sudah Invoice:</strong> ${kpi.invoiced}</div>
                </div>

                <div class="sig-section">
                    <div class="sig-box">
                        <div>Mengetahui,</div>
                        <div class="sig-line"></div>
                        <div style="margin-top: 4px; font-weight: 600;">Kepala Depo</div>
                    </div>
                    <div class="sig-box">
                        <div>Dibuat Oleh,</div>
                        <div class="sig-line"></div>
                        <div style="margin-top: 4px; font-weight: 600;">Admin Operasional</div>
                    </div>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </body>
            </html>
        `);
        printWin.document.close();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report - Depo Surabaya" />

            <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                {/* Header Title & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-7 w-7 text-blue-600" />
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Laporan Ringkasan Order
                            </h1>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Rekapitulasi seluruh order, status pergerakan kontainer, dan penagihan invoice.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            className="gap-1.5"
                        >
                            <Filter className="h-4 w-4" />
                            <span>Filter</span>
                            {showFilterPanel ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handlePrintReport}
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                        >
                            <Printer className="h-4 w-4" />
                            <span>Cetak Laporan</span>
                        </Button>
                    </div>
                </div>

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500">Total Kontainer</span>
                            <Boxes className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-gray-900">{kpi.total_containers}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">Semua record terpilih</div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500">Breakdown Ukuran</span>
                            <span className="text-xs font-bold text-blue-600">20 / 40 / 45</span>
                        </div>
                        <div className="mt-2 text-xl font-bold text-gray-900 flex items-center gap-1.5">
                            <span>{kpi.count_20ft}</span>
                            <span className="text-gray-300 font-normal">/</span>
                            <span>{kpi.count_40ft}</span>
                            <span className="text-gray-300 font-normal">/</span>
                            <span className="text-indigo-600">{kpi.count_45ft}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">20ft / 40ft / 45ft</div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-emerald-700">Aktif di Depo</span>
                            <Clock className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-emerald-700">{kpi.aktif_di_depo}</div>
                        <div className="text-[11px] text-emerald-600 mt-0.5">Belum gate out</div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500">Sudah Keluar</span>
                            <Truck className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-gray-900">{kpi.sudah_keluar}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">Gate out selesai</div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-blue-700">Sudah Invoice</span>
                            <Receipt className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-blue-700">{kpi.invoiced}</div>
                        <div className="text-[11px] text-blue-600 mt-0.5">Tagihan terbit</div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-amber-700">Belum Invoice</span>
                            <Receipt className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-amber-700">{kpi.uninvoiced}</div>
                        <div className="text-[11px] text-amber-600 mt-0.5">Perlu ditagihkan</div>
                    </div>
                </div>

                {/* Panel Filter */}
                {showFilterPanel && (
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                                <Filter className="h-4 w-4 text-blue-600" />
                                Parameter Filter
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                                className="text-xs text-gray-500 hover:text-red-600 gap-1"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Reset Filter
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Filter Customer */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-700">Customer</Label>
                                <Select value={customerId} onValueChange={setCustomerId}>
                                    <SelectTrigger className="w-full text-xs">
                                        <SelectValue placeholder="Semua Customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Customer</SelectItem>
                                        {customers.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filter Shipper */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-700">Shipper</Label>
                                <Select value={shipperId} onValueChange={setShipperId}>
                                    <SelectTrigger className="w-full text-xs">
                                        <SelectValue placeholder="Semua Shipper" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Shipper</SelectItem>
                                        {shippers.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filter Layanan */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-700">Jenis Layanan</Label>
                                <Select value={serviceType} onValueChange={setServiceType}>
                                    <SelectTrigger className="w-full text-xs">
                                        <SelectValue placeholder="Semua Layanan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Layanan</SelectItem>
                                        {service_types.map((st) => (
                                            <SelectItem key={st} value={st}>
                                                {st}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filter Ukuran Kontainer */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-700">Ukuran Kontainer</Label>
                                <Select value={priceType} onValueChange={setPriceType}>
                                    <SelectTrigger className="w-full text-xs">
                                        <SelectValue placeholder="Semua Ukuran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Ukuran</SelectItem>
                                        <SelectItem value="20ft">20 Feet (20')</SelectItem>
                                        <SelectItem value="40ft">40 Feet (40')</SelectItem>
                                        <SelectItem value="45ft">45 Feet (45')</SelectItem>
                                        <SelectItem value="global">Global (Flat)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filter Status Exclude */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-700">Status Exclude</Label>
                                <Select value={excludeStatus} onValueChange={setExcludeStatus}>
                                    <SelectTrigger className="w-full text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Hanya yang Diikutsertakan (Default)</SelectItem>
                                        <SelectItem value="all">Semua (Termasuk yang di-exclude)</SelectItem>
                                        <SelectItem value="excluded">Hanya yang Di-exclude</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filter Status Invoice */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-700">Status Penagihan</Label>
                                <Select value={invoiceStatus} onValueChange={setInvoiceStatus}>
                                    <SelectTrigger className="w-full text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status Invoice</SelectItem>
                                        <SelectItem value="invoiced">Sudah Dibuatkan Invoice</SelectItem>
                                        <SelectItem value="uninvoiced">Belum Dibuatkan Invoice</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date Range: Tanggal Mulai */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-gray-700">Tanggal Mulai</Label>
                                    <select
                                        value={dateType}
                                        onChange={(e) => setDateType(e.target.value)}
                                        className="text-[11px] text-blue-600 bg-transparent border-none p-0 cursor-pointer focus:ring-0"
                                    >
                                        <option value="entry_date">Tgl Masuk</option>
                                        <option value="exit_date">Tgl Keluar</option>
                                        <option value="order_date">Tgl Order</option>
                                    </select>
                                </div>
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="h-9 text-xs"
                                />
                            </div>

                            {/* Date Range: Tanggal Selesai */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-700">Tanggal Selesai</Label>
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="h-9 text-xs"
                                />
                            </div>
                        </div>

                        {/* Search Bar & Apply Action */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Cari kontainer, order ID, AJU, atau komoditi... (Tekan Enter)"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleKeyDownSearch}
                                    className="pl-9 text-xs h-9"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <Button
                                    size="sm"
                                    onClick={() => applyFilters()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
                                >
                                    Terapkan Filter
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                        <div className="text-xs text-gray-500 font-medium">
                            Menampilkan <span className="font-semibold text-gray-800">{reports.from || 0}</span> -{' '}
                            <span className="font-semibold text-gray-800">{reports.to || 0}</span> dari{' '}
                            <span className="font-semibold text-gray-800">{reports.total}</span> kontainer
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Tampilkan per halaman:</span>
                            <Select
                                value={perPage}
                                onValueChange={(v) => {
                                    setPerPage(v);
                                    applyFilters({ per_page: Number(v) });
                                }}
                            >
                                <SelectTrigger className="h-8 w-20 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                    <SelectItem value="200">200</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-100">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="w-12 text-center text-xs font-bold">No</TableHead>
                                    <TableHead className="text-xs font-bold">No. Order / AJU</TableHead>
                                    <TableHead className="text-xs font-bold">Customer</TableHead>
                                    <TableHead className="text-xs font-bold">Shipper</TableHead>
                                    <TableHead className="text-xs font-bold">Layanan</TableHead>
                                    <TableHead className="text-xs font-bold">No. Kontainer</TableHead>
                                    <TableHead className="text-xs font-bold text-center">Ukuran</TableHead>
                                    <TableHead className="text-xs font-bold">Tgl Masuk</TableHead>
                                    <TableHead className="text-xs font-bold">Tgl Keluar</TableHead>
                                    <TableHead className="text-xs font-bold">Komoditi</TableHead>
                                    <TableHead className="text-xs font-bold text-center">Status Invoice</TableHead>
                                    <TableHead className="text-xs font-bold text-center">Status Exclude</TableHead>
                                    <TableHead className="text-xs font-bold text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={13} className="py-8 text-center text-gray-500 text-xs">
                                            Tidak ada data order yang cocok dengan filter yang dipilih.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reports.data.map((item, idx) => (
                                        <TableRow key={item.id} className="hover:bg-gray-50/80">
                                            <TableCell className="text-center text-xs font-medium text-gray-500">
                                                {(reports.from || 1) + idx}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                <div className="font-bold text-gray-900">{item.order_id}</div>
                                                <div className="text-[11px] text-gray-500">AJU: {item.no_aju || '-'}</div>
                                            </TableCell>
                                            <TableCell className="text-xs font-medium text-gray-800">
                                                {item.customer_name}
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-600">
                                                {item.shipper_name}
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-700">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                    {item.service_type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-xs font-mono font-bold text-gray-900">
                                                {item.container_number}
                                            </TableCell>
                                            <TableCell className="text-center text-xs font-semibold text-gray-700">
                                                {item.size}
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-600">
                                                {formatDate(item.entry_date)}
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-600">
                                                {formatDate(item.exit_date)}
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-600 max-w-[140px] truncate">
                                                {item.commodity}
                                            </TableCell>
                                            <TableCell className="text-center text-xs">
                                                {item.is_invoiced ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        {item.invoice_number || 'Invoiced'}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                                        Belum
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center text-xs">
                                                {item.is_excluded ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                                                        <EyeOff className="h-3 w-3" />
                                                        Excluded
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-gray-500">
                                                        Normal
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* Cetak Surat Jalan */}
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        type="button"
                                                        onClick={() => openSuratJalan(item)}
                                                        title="Cetak Surat Jalan (21 x 14 cm)"
                                                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                                    >
                                                        <Printer className="h-4 w-4" />
                                                    </Button>

                                                    {/* Lihat Order */}
                                                    {item.order_pk && (
                                                        <Button size="icon" variant="ghost" asChild title="Lihat Order">
                                                            <Link
                                                                href={route('orders.show', item.order_pk)}
                                                                className="text-gray-500 hover:text-gray-700"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Bottom */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500 font-medium">
                            Menampilkan <span className="font-semibold text-gray-800">{reports.from || 0}</span> -{' '}
                            <span className="font-semibold text-gray-800">{reports.to || 0}</span> dari{' '}
                            <span className="font-semibold text-gray-800">{reports.total}</span> kontainer
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-1">
                            {reports.links.map((link, i) =>
                                link.url ? (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        disabled={!link.url}
                                        onClick={() => router.get(link.url!)}
                                        className="px-3 py-1 text-xs whitespace-nowrap"
                                    >
                                        {link.label.replace(/&laquo; Previous|Next &raquo;/, (match) => {
                                            if (match.includes('Previous')) return '← Prev';
                                            if (match.includes('Next')) return 'Next →';
                                            return match;
                                        })}
                                    </Button>
                                ) : (
                                    <span key={i} className="px-3 py-1 text-xs text-gray-400">
                                        ...
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Surat Jalan Modal */}
                <SuratJalanModal isOpen={sjModalOpen} onClose={() => setSjModalOpen(false)} data={sjData} />
            </div>
        </AppLayout>
    );
}
