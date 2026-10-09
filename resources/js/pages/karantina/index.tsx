import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect, type OptionItem } from '@/components/ui/searchable-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { terbilang } from '@/lib/terbilang';
import DateRangePicker from '@/components/date-range-picker';
import {
    Printer,
    Filter,
    RotateCcw,
    Search,
    ChevronDown,
    ChevronUp,
    X,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Shield,
    Check,
} from 'lucide-react';

interface FlashProps {
    success?: string;
    error?: string;
}

interface Customer {
    id: number;
    name: string;
}

interface Shipper {
    id: number;
    name: string;
}

interface Product {
    id: number;
    service_type: string;
    requires_temperature?: boolean;
}

interface OrderParent {
    id: number;
    no_aju: string | null;
    order_id: string;
    customer?: Customer;
    shipper?: Shipper;
    fumigasi: string | null;
}

interface OrderItemData {
    id: number;
    order_id: string;
    customer_id: number;
    product_id: number;
    shipper_id: number;
    container_number: string;
    order?: OrderParent;
    entry_date: string | null;
    eir_date: string | null;
    exit_date: string | null;
    price_type: string | null;
    commodity: string | null;
    country?: string | null;
    no_aju: string | null;
    customer?: Customer;
    product?: Product;
    shipper?: Shipper;
    fumigasi?: string | null;
    customer_name?: string;
    shipper_name?: string;
}

interface Props {
    orders: {
        data: OrderItemData[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page?: number;
        from?: number | null;
        last_page?: number;
        per_page?: number;
        to?: number | null;
        total?: number;
    };
    customers: Customer[];
    shippers: Shipper[];
    products?: Product[];
    filters: {
        customer_id?: string;
        shipper_id?: string;
        fumigator?: string;
        product_ids?: number[];
        exclude_status?: string;
        date_from?: string;
        date_to?: string;
        date_type?: string;
        search?: string;
        per_page?: number;
        sort_by?: string;
        sort_dir?: string;
        trashed?: string;
    };
}

const MONTH_NAMES_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function formatKarantinaDateTime(dateStr?: string | null) {
    if (!dateStr) return <span className="text-gray-400">–</span>;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return <span className="text-gray-400">–</span>;

    const day = String(d.getDate()).padStart(2, '0');
    const month = MONTH_NAMES_ID[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return (
        <div className="flex flex-col leading-tight whitespace-nowrap">
            <span className="font-semibold text-slate-800 text-xs">{day} {month} {year}</span>
            <span className="text-[11px] text-slate-500 font-normal">{hours}:{minutes} WIB</span>
        </div>
    );
}

function formatKarantinaDateTimeString(dateStr?: string | null): string {
    if (!dateStr) return '–';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '–';

    const day = String(d.getDate()).padStart(2, '0');
    const month = MONTH_NAMES_ID[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

function formatContainerSize(priceType?: string | null, fallback?: string): string {
    if (!priceType) return fallback || '-';
    const val = String(priceType).trim();
    if (val.toLowerCase().endsWith('ft')) return val;
    if (val === '20' || val === '40') return `${val}ft`;
    return val || fallback || '-';
}

function formatStatementBDateTime(dateStr?: string | null): string {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return String(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        return `${day}-${month}-${year} / ${hours}.${mins}`;
    } catch {
        return String(dateStr);
    }
}

function formatStatementBSize(priceType?: string | null): string {
    if (!priceType) return '-';
    const s = String(priceType).toLowerCase();
    if (s.includes('20')) return "20'";
    if (s.includes('40')) return "40'";
    if (s.includes('45')) return "45'";
    return priceType;
}

function formatRupiahNumber(num: number): string {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Karantina & Fumigasi',
        href: '/karantina',
    },
];

export default function KarantinaIndex({
    orders,
    customers = [],
    shippers = [],
    products = [],
    filters: rawFilters,
}: Props) {
    const filters = rawFilters || {};

    // Filter Local States
    const [customerId, setCustomerId] = useState<string>(filters.customer_id || 'all');
    const [shipperId, setShipperId] = useState<string>(filters.shipper_id || 'all');
    const [fumigator, setFumigator] = useState<string>(filters.fumigator || '');
    const [excludeStatus, setExcludeStatus] = useState<string>(filters.exclude_status || 'active');
    const [dateFrom, setDateFrom] = useState<string>(filters.date_from || '');
    const [dateTo, setDateTo] = useState<string>(filters.date_to || '');
    const [dateType, setDateType] = useState<string>(filters.date_type || 'entry_date');
    const [search, setSearch] = useState<string>(filters.search || '');
    const [perPage, setPerPage] = useState<string>(String(filters.per_page || 25));

    // Multi-Select Produk / Layanan
    const initialProductIds: number[] = Array.isArray(rawFilters?.product_ids)
        ? rawFilters.product_ids.map(Number).filter((n) => !isNaN(n))
        : [];
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>(initialProductIds);
    const [productSearchQuery, setProductSearchQuery] = useState('');

    const [showFilterPanel, setShowFilterPanel] = useState(true);
    const [isPrinting, setIsPrinting] = useState(false);

    const customerOptions: OptionItem[] = useMemo(() => [
        { value: 'all', label: 'Semua Customer' },
        ...customers.map((c) => ({
            value: String(c.id),
            label: c.name,
        })),
    ], [customers]);

    const shipperOptions: OptionItem[] = useMemo(() => [
        { value: 'all', label: 'Semua Shipper' },
        ...shippers.map((s) => ({
            value: String(s.id),
            label: s.name,
        })),
    ], [shippers]);

    // Sinkronisasi filter saat URL / navigasi Inertia berubah
    useEffect(() => {
        setCustomerId(filters.customer_id || 'all');
        setShipperId(filters.shipper_id || 'all');
        setFumigator(filters.fumigator || '');
        setExcludeStatus(filters.exclude_status || 'active');
        setDateFrom(filters.date_from || '');
        setDateTo(filters.date_to || '');
        setDateType(filters.date_type || 'entry_date');
        setSearch(filters.search || '');
        setPerPage(String(filters.per_page || 25));

        const pIds = Array.isArray(filters.product_ids)
            ? filters.product_ids.map(Number).filter((n) => !isNaN(n))
            : [];
        setSelectedProductIds(pIds);
    }, [
        filters.customer_id,
        filters.shipper_id,
        filters.fumigator,
        filters.exclude_status,
        filters.date_from,
        filters.date_to,
        filters.date_type,
        filters.search,
        filters.per_page,
        filters.product_ids,
    ]);

    const applyFilters = (overrides?: Partial<typeof filters>) => {
        const cId = overrides?.customer_id !== undefined ? overrides.customer_id : customerId;
        const sId = overrides?.shipper_id !== undefined ? overrides.shipper_id : shipperId;
        const fum = overrides?.fumigator !== undefined ? overrides.fumigator : fumigator;
        const pIds = overrides?.product_ids !== undefined ? overrides.product_ids : selectedProductIds;
        const exc = overrides?.exclude_status !== undefined ? overrides.exclude_status : excludeStatus;
        const dFrom = overrides?.date_from !== undefined ? overrides.date_from : dateFrom;
        const dTo = overrides?.date_to !== undefined ? overrides.date_to : dateTo;
        const dType = overrides?.date_type !== undefined ? overrides.date_type : dateType;
        const qSearch = overrides?.search !== undefined ? overrides.search : search;
        const pPage = overrides?.per_page !== undefined ? overrides.per_page : perPage;

        router.get(
            route('index_karantina'),
            {
                customer_id: cId === 'all' ? undefined : cId,
                shipper_id: sId === 'all' ? undefined : sId,
                fumigator: fum ? fum.trim() : undefined,
                product_ids: pIds.length > 0 ? pIds : undefined,
                exclude_status: exc,
                date_from: dFrom || undefined,
                date_to: dTo || undefined,
                date_type: dType,
                search: qSearch ? qSearch.trim() : undefined,
                per_page: pPage,
                sort_by: filters.sort_by || undefined,
                sort_dir: filters.sort_dir || undefined,
                trashed: filters.trashed || undefined,
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
        setFumigator('');
        setSelectedProductIds([]);
        setExcludeStatus('active');
        setDateFrom('');
        setDateTo('');
        setDateType('entry_date');
        setSearch('');
        setPerPage('25');
        router.get(route('index_karantina'), {}, { preserveScroll: true });
    };

    const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyFilters();
        }
    };

    // Helper Multi-select Product
    const toggleProduct = (id: number) => {
        setSelectedProductIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const filteredProductsList = products.filter((p) =>
        p.service_type.toLowerCase().includes(productSearchQuery.toLowerCase())
    );

    const isAllFilteredSelected =
        filteredProductsList.length > 0 &&
        filteredProductsList.every((p) => selectedProductIds.includes(p.id));

    const toggleAllFiltered = () => {
        const filteredIds = filteredProductsList.map((p) => p.id);
        if (isAllFilteredSelected) {
            const filteredSet = new Set(filteredIds);
            setSelectedProductIds((prev) => prev.filter((id) => !filteredSet.has(id)));
        } else {
            setSelectedProductIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
        }
    };

    // Cetak Billing Statement (A atau B)
    const handlePrint = async (statementType: 'A' | 'B' | 'B_CLASSIC' = 'A') => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Gagal membuka jendela cetak. Pastikan izin popup browser diaktifkan.');
            return;
        }

        const titleText =
            statementType === 'B'
                ? 'Billing Statement B (Versi 2 Modern)'
                : statementType === 'B_CLASSIC'
                ? 'Billing Statement B (Versi 1 Klasik)'
                : 'Billing Statement';

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Menyiapkan ${titleText}...</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 70vh;
                        color: #334155;
                        margin: 0;
                    }
                    .spinner {
                        width: 36px;
                        height: 36px;
                        border: 3px solid #e2e8f0;
                        border-top-color: #0f172a;
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                        margin-bottom: 14px;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                </style>
            </head>
            <body>
                <div class="spinner"></div>
                <div style="font-size: 15px; font-weight: 600;">Menyiapkan data ${titleText}...</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Total data: ${orders.total ?? orders.data.length} kontainer</div>
            </body>
            </html>
        `);
        printWindow.document.close();

        setIsPrinting(true);

        try {
            const params = new URLSearchParams();
            if (customerId && customerId !== 'all') params.append('customer_id', customerId);
            if (shipperId && shipperId !== 'all') params.append('shipper_id', shipperId);
            if (fumigator) params.append('fumigator', fumigator);
            if (excludeStatus) params.append('exclude_status', excludeStatus);
            if (dateFrom) params.append('date_from', dateFrom);
            if (dateTo) params.append('date_to', dateTo);
            if (dateType) params.append('date_type', dateType);
            if (search) params.append('search', search);
            if (filters.trashed) params.append('trashed', filters.trashed);
            if (filters.sort_by) params.append('sort_by', filters.sort_by);
            if (filters.sort_dir) params.append('sort_dir', filters.sort_dir);
            if (selectedProductIds.length > 0) {
                selectedProductIds.forEach((pid) => params.append('product_ids[]', pid.toString()));
            }

            const res = await fetch(`/karantina/print-data?${params.toString()}`);
            if (!res.ok) throw new Error('Gagal mengambil data dari server');
            const json = await res.json();
            const allPrintData = json.data || [];

            if (allPrintData.length === 0) {
                printWindow.document.body.innerHTML = `
                    <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                        <p style="color: #ef4444; font-weight: 600;">Tidak ada data yang sesuai filter untuk dicetak.</p>
                        <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                    </div>
                `;
                return;
            }

            const startLabel = dateFrom ? new Date(dateFrom).toLocaleDateString('id-ID') : 'Semua';
            const endLabel = dateTo ? new Date(dateTo).toLocaleDateString('id-ID') : 'Semua';
            const periodLabel = `${startLabel} s/d ${endLabel}`;
            const logoUrl = '/logo-dss.png';
            const printDateStr = new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });

            // Persiapkan data khusus Billing Statement B
            let customerNameLabel = '-';
            if (customerId && customerId !== 'all') {
                const c = customers.find((item) => String(item.id) === String(customerId));
                customerNameLabel = c ? c.name : customerId;
            } else {
                const uniqueCustomers = Array.from(new Set(allPrintData.map((it: any) => it.customer_name).filter(Boolean)));
                if (uniqueCustomers.length === 1 && uniqueCustomers[0] !== '-') {
                    customerNameLabel = uniqueCustomers[0] as string;
                } else if (uniqueCustomers.length > 1) {
                    customerNameLabel = 'Semua Customer';
                }
            }

            const formatShortDate = (d: string) => {
                const dt = new Date(d);
                const dd = String(dt.getDate()).padStart(2, '0');
                const mm = String(dt.getMonth() + 1).padStart(2, '0');
                const yy = String(dt.getFullYear()).slice(-2);
                return `${dd}/${mm}/${yy}`;
            };
            const periodB = (dateFrom && dateTo)
                ? `${formatShortDate(dateFrom)} - ${formatShortDate(dateTo)}`
                : (dateFrom || dateTo)
                ? `${dateFrom ? formatShortDate(dateFrom) : ''} - ${dateTo ? formatShortDate(dateTo) : ''}`
                : periodLabel;

            const totalPriceSum = allPrintData.reduce((sum: number, item: any) => {
                return sum + (typeof item.price === 'number' ? item.price : 0);
            }, 0);
            const totalPpnSum = allPrintData.reduce((sum: number, item: any) => {
                const price = typeof item.price === 'number' ? item.price : 0;
                return sum + (typeof item.ppn === 'number' ? item.ppn : Math.round(price * 0.11));
            }, 0);
            const grandTotalSum = totalPriceSum + totalPpnSum;
            const terbilangStr = terbilang(grandTotalSum);

            let html = '';

            if (statementType === 'B') {
                // ==========================================
                // BILLING STATEMENT B - VERSI 2 (MODERN A4 LANDSCAPE)
                // ==========================================
                html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Billing Statement B - PT. Depo Surabaya Sejahtera</title>
                <style>
                    @page {
                        size: A4 landscape;
                        margin: 8mm 10mm;
                    }
                    * {
                        box-sizing: border-box;
                        font-family: Arial, 'Segoe UI', Helvetica, sans-serif;
                        color: #0f172a;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        font-size: 8.5pt;
                        background: #ffffff;
                    }
                    .header-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 2.5px solid #0f172a;
                        padding-bottom: 8px;
                        margin-bottom: 12px;
                    }
                    .header-left {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                    }
                    .header-logo {
                        width: 58px;
                        height: 58px;
                        object-fit: contain;
                    }
                    .company-name {
                        font-size: 14pt;
                        font-weight: 800;
                        color: #0f172a;
                        letter-spacing: 0.5px;
                        margin-bottom: 2px;
                    }
                    .company-address {
                        font-size: 8.5pt;
                        color: #475569;
                        line-height: 1.35;
                    }
                    .header-right {
                        text-align: right;
                    }
                    .statement-title {
                        font-size: 16pt;
                        font-weight: 900;
                        color: #0f172a;
                        letter-spacing: 1px;
                        margin-bottom: 2px;
                    }
                    .statement-subtitle {
                        font-size: 8.5pt;
                        font-weight: 700;
                        color: #64748b;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                    }

                    /* Meta Info Panel */
                    .meta-panel {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-left: 4px solid #0f172a;
                        border-radius: 4px;
                        padding: 8px 14px;
                        margin-bottom: 12px;
                        font-size: 8.5pt;
                    }
                    .meta-col {
                        display: flex;
                        flex-direction: column;
                        gap: 3px;
                    }
                    .meta-item {
                        display: flex;
                        gap: 8px;
                    }
                    .meta-label {
                        width: 95px;
                        color: #64748b;
                        font-weight: 600;
                    }
                    .meta-value {
                        color: #0f172a;
                        font-weight: 700;
                    }

                    /* Modern Table B */
                    table.modern-b-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 8.5pt;
                    }
                    table.modern-b-table th {
                        background-color: #f1f5f9;
                        color: #0f172a;
                        font-weight: 700;
                        border-top: 2px solid #0f172a;
                        border-bottom: 2px solid #0f172a;
                        border-left: 1px solid #cbd5e1;
                        border-right: 1px solid #cbd5e1;
                        padding: 6px 5px;
                        text-align: center;
                        vertical-align: middle;
                    }
                    table.modern-b-table td {
                        border-left: 1px solid #e2e8f0;
                        border-right: 1px solid #e2e8f0;
                        padding: 5.5px 6px;
                        vertical-align: middle;
                    }
                    .row-dashed td {
                        border-bottom: 1px dashed #cbd5e1;
                    }
                    .row-solid-bottom td {
                        border-bottom: 2px solid #0f172a;
                    }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .container-code {
                        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
                        font-weight: 700;
                        letter-spacing: 0.5px;
                        color: #0f172a;
                    }
                    .currency-cell {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-variant-numeric: tabular-nums;
                    }
                    
                    /* Summary Row */
                    .summary-row td {
                        background-color: #f8fafc;
                        border-top: 2px solid #0f172a;
                        border-bottom: 2px solid #0f172a;
                        padding: 7px 6px;
                        font-weight: 800;
                    }
                    .grand-total-highlight {
                        background-color: #f1f5f9 !important;
                        border-left: 1px solid #0f172a !important;
                        border-right: 1px solid #0f172a !important;
                    }

                    /* Footer and Signatures */
                    .footer-wrapper {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-top: 14px;
                        page-break-inside: avoid;
                    }
                    .footer-left {
                        width: 58%;
                    }
                    .terbilang-card {
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-left: 3px solid #0f172a;
                        padding: 6px 12px;
                        border-radius: 4px;
                        font-size: 8pt;
                        margin-bottom: 8px;
                    }
                    .terbilang-text {
                        font-weight: 700;
                        font-style: italic;
                        color: #0f172a;
                    }
                    .payment-note {
                        font-size: 7.5pt;
                        color: #64748b;
                        line-height: 1.45;
                    }
                    .signatures-container {
                        display: flex;
                        gap: 36px;
                        text-align: center;
                    }
                    .sig-box {
                        width: 130px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .sig-title {
                        font-size: 8pt;
                        font-weight: 600;
                        color: #475569;
                        margin-bottom: 45px;
                    }
                    .sig-line {
                        width: 120px;
                        border-bottom: 1px solid #0f172a;
                        margin-bottom: 3px;
                    }
                    .sig-caption {
                        font-size: 7.5pt;
                        color: #64748b;
                    }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="header-container">
                    <div class="header-left">
                        <img src="${logoUrl}" alt="DSS Logo" class="header-logo" onerror="this.onerror=null;this.src='/logo.png'">
                        <div>
                            <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                            <div class="company-address">
                                Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) | Telp. 031-353 9484, 031-3539485 | Fax. 031-3539482<br>
                                Surabaya, Jawa Timur - Indonesia
                            </div>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="statement-title">BILLING STATEMENT</div>
                        <div class="statement-subtitle">LAYANAN KARANTINA & FUMIGASI</div>
                    </div>
                </div>

                <div class="meta-panel">
                    <div class="meta-col">
                        <div class="meta-item">
                            <span class="meta-label">Customer</span>
                            <span>:</span>
                            <span class="meta-value" style="font-size: 9.5pt; color: #0284c7;">${customerNameLabel}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Periode</span>
                            <span>:</span>
                            <span class="meta-value">${periodB}</span>
                        </div>
                    </div>
                    <div class="meta-col" style="align-items: flex-end;">
                        <div class="meta-item">
                            <span class="meta-label" style="width: auto;">Total Kontainer :</span>
                            <span class="meta-value">${allPrintData.length} Unit</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label" style="width: auto;">Dicetak :</span>
                            <span class="meta-value">${printDateStr} WIB</span>
                        </div>
                    </div>
                </div>

                <table class="modern-b-table">
                    <thead>
                        <tr>
                            <th rowspan="2" style="width: 28px;">No.</th>
                            <th rowspan="2" style="width: 135px;">No. Container</th>
                            <th rowspan="2" style="width: 140px;">Shipper</th>
                            <th colspan="2">Date / Time</th>
                            <th rowspan="2" style="width: 50px;">Ukuran</th>
                            <th rowspan="2" style="width: 85px;">Jasa</th>
                            <th rowspan="2" style="width: 95px;">Fumigator</th>
                            <th rowspan="2" style="width: 110px;">Price</th>
                            <th rowspan="2" style="width: 95px;">PPN 11 %</th>
                            <th rowspan="2" style="width: 115px;">Total</th>
                        </tr>
                        <tr>
                            <th style="width: 95px;">In</th>
                            <th style="width: 95px;">Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allPrintData.map((item: any, idx: number) => {
                            const isLast = idx === allPrintData.length - 1;
                            const rowClass = isLast ? 'row-solid-bottom' : 'row-dashed';
                            const priceVal = typeof item.price === 'number' ? item.price : 0;
                            const ppnVal = typeof item.ppn === 'number' ? item.ppn : Math.round(priceVal * 0.11);
                            const totalVal = typeof item.total === 'number' ? item.total : (priceVal + ppnVal);

                            return `
                            <tr class="${rowClass}">
                                <td class="text-center">${idx + 1}</td>
                                <td class="text-center container-code">${item.container_number}</td>
                                <td>${item.shipper_name ?? '-'}</td>
                                <td class="text-center">${formatStatementBDateTime(item.entry_date)}</td>
                                <td class="text-center">${formatStatementBDateTime(item.exit_date)}</td>
                                <td class="text-center">${formatStatementBSize(item.price_type)}</td>
                                <td class="text-center">${item.service_type ?? 'Fumigasi'}</td>
                                <td class="text-center">${item.fumigasi ?? '-'}</td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${formatRupiahNumber(priceVal)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${formatRupiahNumber(ppnVal)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell" style="font-weight: 700;">
                                        <span>Rp</span>
                                        <span>${formatRupiahNumber(totalVal)}</span>
                                    </div>
                                </td>
                            </tr>
                            `;
                        }).join('')}
                        <tr class="summary-row">
                            <td colspan="7" class="text-right">
                                TOTAL KESELURUHAN (${allPrintData.length} Kontainer)
                            </td>
                            <td>
                                <div class="currency-cell">
                                    <span>Rp</span>
                                    <span>${formatRupiahNumber(totalPriceSum)}</span>
                                </div>
                            </td>
                            <td>
                                <div class="currency-cell">
                                    <span>Rp</span>
                                    <span>${formatRupiahNumber(totalPpnSum)}</span>
                                </div>
                            </td>
                            <td class="grand-total-highlight">
                                <div class="currency-cell" style="font-weight: 900; font-size: 9pt;">
                                    <span>Rp</span>
                                    <span>${formatRupiahNumber(grandTotalSum)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer-wrapper">
                    <div class="footer-left">
                        <div class="terbilang-card">
                            <span style="font-weight: 600; color: #64748b;">Terbilang: </span>
                            <span class="terbilang-text"># ${terbilangStr} Rupiah #</span>
                        </div>
                        <div class="payment-note">
                            * Pembayaran harap ditransfer ke rekening resmi <strong>PT. DEPO SURABAYA SEJAHTERA</strong>.<br>
                            * Bukti transfer mohon dikirimkan kepada bagian Keuangan / Finance Depo Surabaya.
                        </div>
                    </div>
                    <div class="signatures-container">
                        <div class="sig-box">
                            <div class="sig-title">Dibuat Oleh,</div>
                            <div class="sig-line"></div>
                            <div class="sig-caption">Bagian Billing / Kasir</div>
                        </div>
                        <div class="sig-box">
                            <div class="sig-title">Mengetahui,</div>
                            <div class="sig-line"></div>
                            <div class="sig-caption">Finance & Accounting</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
                `;
            } else if (statementType === 'B_CLASSIC') {
                // ==========================================
                // BILLING STATEMENT B - VERSI 1 (KLASIK / RETRO A4 LANDSCAPE)
                // ==========================================
                html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Billing Statement B (Klasik) - PT. Depo Surabaya Sejahtera</title>
                <style>
                    @page {
                        size: A4 landscape;
                        margin: 8mm 10mm;
                    }
                    * {
                        box-sizing: border-box;
                        font-family: Arial, Helvetica, sans-serif;
                        color: #000;
                    }
                    body {
                        margin: 0;
                        padding: 4px;
                        font-size: 8.5pt;
                    }
                    .header-box {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                        margin-bottom: 18px;
                    }
                    .header-logo {
                        width: 58px;
                        height: 58px;
                        object-fit: contain;
                    }
                    .header-company {
                        line-height: 1.35;
                    }
                    .company-name {
                        font-size: 11pt;
                        font-weight: 800;
                        color: #000;
                    }
                    .company-address {
                        font-size: 8.5pt;
                        color: #222;
                    }
                    .statement-title-section {
                        margin-bottom: 12px;
                    }
                    .statement-title {
                        font-size: 11pt;
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 6px;
                    }
                    .meta-table {
                        border-collapse: collapse;
                        font-size: 8.5pt;
                    }
                    .meta-table td {
                        padding: 2px 0;
                        vertical-align: top;
                    }
                    .meta-label {
                        width: 75px;
                        font-weight: 700;
                    }
                    .meta-sep {
                        width: 14px;
                        text-align: center;
                        font-weight: 700;
                    }
                    .meta-value {
                        font-weight: 700;
                    }
                    table.b-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 8.5pt;
                        border: 1px solid #000;
                    }
                    table.b-table th {
                        border: 1px solid #000;
                        padding: 5px 4px;
                        font-weight: 700;
                        text-align: center;
                        background-color: #fff;
                        vertical-align: middle;
                    }
                    table.b-table td {
                        border-left: 1px solid #000;
                        border-right: 1px solid #000;
                        padding: 5px 4px;
                        vertical-align: middle;
                    }
                    .row-dashed td {
                        border-bottom: 1px dashed #000;
                    }
                    .row-solid-bottom td {
                        border-bottom: 1px solid #000;
                    }
                    .text-center { text-align: center; }
                    .currency-cell {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 4px;
                        font-variant-numeric: tabular-nums;
                    }
                    .grand-total-row td {
                        border: none;
                        padding: 0;
                    }
                    .grand-total-cell {
                        border: 2px solid #000 !important;
                        padding: 5px 4px !important;
                        font-weight: 800 !important;
                        background-color: #fff;
                    }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="header-box">
                    <img src="${logoUrl}" alt="DSS Logo" class="header-logo" onerror="this.onerror=null;this.src='/logo.png'">
                    <div class="header-company">
                        <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                        <div class="company-address">Tanjung Sadari No. 90</div>
                        <div class="company-address">Surabaya</div>
                        <div class="company-address">Jawa Timur - Indonesia</div>
                    </div>
                </div>

                <div class="statement-title-section">
                    <div class="statement-title">BILLING STATEMENT</div>
                    <table class="meta-table">
                        <tr>
                            <td class="meta-label">Customer</td>
                            <td class="meta-sep">:</td>
                            <td class="meta-value">${customerNameLabel}</td>
                        </tr>
                        <tr>
                            <td class="meta-label">Periode</td>
                            <td class="meta-sep">:</td>
                            <td class="meta-value">${periodB}</td>
                        </tr>
                    </table>
                </div>

                <table class="b-table">
                    <thead>
                        <tr>
                            <th rowspan="2" style="width: 28px;">No.</th>
                            <th rowspan="2" style="width: 135px;">No. Container</th>
                            <th rowspan="2" style="width: 140px;">Shipper</th>
                            <th colspan="2">Date / Time</th>
                            <th rowspan="2" style="width: 50px;">Ukuran</th>
                            <th rowspan="2" style="width: 85px;">Jasa</th>
                            <th rowspan="2" style="width: 95px;">Fumigator</th>
                            <th rowspan="2" style="width: 110px;">Price</th>
                            <th rowspan="2" style="width: 95px;">PPN 11 %</th>
                            <th rowspan="2" style="width: 115px;">Total</th>
                        </tr>
                        <tr>
                            <th style="width: 95px;">In</th>
                            <th style="width: 95px;">Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allPrintData.map((item: any, idx: number) => {
                            const isLast = idx === allPrintData.length - 1;
                            const rowClass = isLast ? 'row-solid-bottom' : 'row-dashed';
                            const priceVal = typeof item.price === 'number' ? item.price : 0;
                            const ppnVal = typeof item.ppn === 'number' ? item.ppn : Math.round(priceVal * 0.11);
                            const totalVal = typeof item.total === 'number' ? item.total : (priceVal + ppnVal);

                            return `
                            <tr class="${rowClass}">
                                <td class="text-center">${idx + 1}</td>
                                <td class="text-center" style="font-weight: 700;">${item.container_number}</td>
                                <td class="text-center">${item.shipper_name ?? '-'}</td>
                                <td class="text-center">${formatStatementBDateTime(item.entry_date)}</td>
                                <td class="text-center">${formatStatementBDateTime(item.exit_date)}</td>
                                <td class="text-center">${formatStatementBSize(item.price_type)}</td>
                                <td class="text-center">${item.service_type ?? 'Fumigasi'}</td>
                                <td class="text-center">${item.fumigasi ?? '-'}</td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${formatRupiahNumber(priceVal)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${formatRupiahNumber(ppnVal)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${formatRupiahNumber(totalVal)}</span>
                                    </div>
                                </td>
                            </tr>
                            `;
                        }).join('')}
                        <tr class="grand-total-row">
                            <td colspan="10" style="border: none; background: transparent;"></td>
                            <td class="grand-total-cell">
                                <div class="currency-cell" style="font-weight: 800;">
                                    <span>Rp</span>
                                    <span>${formatRupiahNumber(grandTotalSum)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
            </html>
                `;
            } else {
                // ==========================================
                // BILLING STATEMENT (FORMAT A)
                // ==========================================
                html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${titleText} - PT. Depo Surabaya Sejahtera</title>
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
                        text-align: right;
                        font-size: 16pt;
                        font-weight: 900;
                        color: #0f172a;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .filter-info {
                        display: flex;
                        justify-content: space-between;
                        font-size: 9pt;
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
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
                        padding: 6px 8px;
                        vertical-align: middle;
                    }
                    table.data-table th {
                        background-color: #f1f5f9;
                        font-weight: 700;
                        text-align: left;
                    }
                    .text-center { text-align: center; }
                    .text-gray-400 { color: #94a3b8; }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <table class="header-table">
                    <tr>
                        <td style="width: 70px; vertical-align: middle;">
                            <img src="${logoUrl}" alt="Logo" style="width: 55px; height: 55px; object-fit: contain;" onerror="this.onerror=null;this.src='/logo.png'">
                        </td>
                        <td style="vertical-align: middle;">
                            <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                            <div class="company-address">
                                Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) | Telp. 031-353 9484, 031-3539485 | Fax. 031-3539482
                            </div>
                        </td>
                        <td style="text-align: right; vertical-align: middle;">
                            <div class="report-title">${titleText}</div>
                            <div style="font-size: 10pt; color: #475569; font-weight: 600;">Layanan Karantina & Fumigasi</div>
                        </td>
                    </tr>
                </table>

                <div class="filter-info">
                    <div>
                        <strong>Periode:</strong> ${periodLabel} &nbsp;|&nbsp;
                        <strong>Total:</strong> ${allPrintData.length} Kontainer
                    </div>
                    <div>
                        <strong>Dicetak pada:</strong> ${printDateStr} WIB
                    </div>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 30px; text-align: center;">No</th>
                            <th>Nomor Kontainer</th>
                            <th>Nama Shipper</th>
                            <th>Fumigator</th>
                            <th style="text-align: center; width: 60px;">Size</th>
                            <th>Tanggal Masuk</th>
                            <th>Tanggal Keluar</th>
                            <th>Komoditi</th>
                            <th>Negara Tujuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allPrintData
                            .map(
                                (item: any, idx: number) => `
                            <tr>
                                <td class="text-center">${idx + 1}</td>
                                <td style="font-weight: 700; font-family: monospace;">${item.container_number}</td>
                                <td>${item.shipper_name ?? '-'}</td>
                                <td>${item.fumigasi ?? '<span class="text-gray-400">–</span>'}</td>
                                <td class="text-center">${formatContainerSize(item.price_type)}</td>
                                <td>${item.entry_date ? formatKarantinaDateTimeString(item.entry_date) : '<span class="text-gray-400">–</span>'}</td>
                                <td>${item.exit_date ? formatKarantinaDateTimeString(item.exit_date) : '<span class="text-gray-400">–</span>'}</td>
                                <td>${item.commodity ?? '-'}</td>
                                <td>${item.country ?? '-'}</td>
                            </tr>
                        `
                            )
                            .join('')}
                    </tbody>
                </table>
            </body>
            </html>
            `;
            }

            printWindow.document.open();
            printWindow.document.write(html);
            printWindow.document.close();

            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
            }, 300);
        } catch (err) {
            console.error('Error saat mencetak billing statement:', err);
            printWindow.document.body.innerHTML = `
                <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                    <p style="color: #ef4444; font-weight: 600;">Terjadi kesalahan saat memuat seluruh data kontainer.</p>
                    <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                </div>
            `;
        } finally {
            setIsPrinting(false);
        }
    };

    // Sort Button Component
    const SortButton = ({
        label,
        field,
        currentSort,
        currentDir,
    }: {
        label: string;
        field: string;
        currentSort?: string;
        currentDir?: string;
    }) => {
        const direction = currentSort === field ? (currentDir === 'asc' ? 'desc' : 'asc') : 'asc';

        return (
            <Link
                href={route('index_karantina', {
                    customer_id: customerId === 'all' ? undefined : customerId,
                    shipper_id: shipperId === 'all' ? undefined : shipperId,
                    fumigator: fumigator ? fumigator.trim() : undefined,
                    exclude_status: excludeStatus,
                    date_from: dateFrom || undefined,
                    date_to: dateTo || undefined,
                    date_type: dateType,
                    product_ids: selectedProductIds.length > 0 ? selectedProductIds : undefined,
                    search: search || undefined,
                    per_page: perPage,
                    sort_by: field,
                    sort_dir: direction,
                })}
                preserveState
                preserveScroll
                className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-black transition-colors"
            >
                <span>{label}</span>
                {currentSort === field ? (
                    direction === 'asc' ? (
                        <ArrowUp className="h-3.5 w-3.5 text-blue-600" />
                    ) : (
                        <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
                    )
                ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 opacity-60 hover:opacity-100" />
                )}
            </Link>
        );
    };

    const { props } = usePage<{ flash?: FlashProps }>();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Karantina & Fumigasi - Depo Surabaya" />

            <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
                {/* Flash Notification */}
                {props.flash?.success && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{props.flash.success}</span>
                    </div>
                )}
                {props.flash?.error && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800 shadow-2xs">
                        <X className="h-4 w-4 text-rose-600 shrink-0" />
                        <span>{props.flash.error}</span>
                    </div>
                )}

                {/* Header Title & Top Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <Shield className="h-7 w-7 text-gray-900" />
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Karantina & Fumigasi
                            </h1>
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                                Billing & Monitoring
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Kelola data pergerakan kontainer karantina, filter multi-parameter, dan cetak billing statement resmi.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Toggle Panel Filter */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            className="gap-1.5 h-9 text-xs border-gray-300 bg-white shadow-2xs"
                        >
                            <Filter className="h-3.5 w-3.5 text-blue-600" />
                            <span>Filter</span>
                            {showFilterPanel ? (
                                <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
                            ) : (
                                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                            )}
                        </Button>

                        {/* Button Billing Statement */}
                        <Button
                            type="button"
                            size="sm"
                            disabled={isPrinting}
                            onClick={() => handlePrint('A')}
                            className="bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs disabled:opacity-70"
                            title="Cetak Billing Statement"
                        >
                            <Printer className={`h-3.5 w-3.5 ${isPrinting ? 'animate-spin' : ''}`} />
                            <span>Billing Statement</span>
                        </Button>

                        {/* Dropdown Button Billing Statement B */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    type="button"
                                    size="sm"
                                    disabled={isPrinting}
                                    variant="outline"
                                    className="border-gray-300 text-gray-800 bg-white hover:bg-gray-50 font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs"
                                    title="Pilih dan Cetak Billing Statement Format B"
                                >
                                    <Printer className="h-3.5 w-3.5 text-gray-600" />
                                    <span>Billing Statement B</span>
                                    <ChevronDown className="h-3 w-3 text-gray-400 ml-0.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-72">
                                <DropdownMenuItem
                                    onClick={() => handlePrint('B')}
                                    className="cursor-pointer flex flex-col items-start py-2.5 px-3"
                                >
                                    <div className="font-semibold text-xs text-gray-900 flex items-center gap-1.5">
                                        <Printer className="h-3.5 w-3.5 text-blue-600" />
                                        <span>Versi 2 (Modern - A4 Landscape)</span>
                                    </div>
                                    <span className="text-[11px] text-gray-500 mt-1 pl-5">
                                        Desain modern, rekap total, terbilang resmi & kolom tanda tangan
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handlePrint('B_CLASSIC')}
                                    className="cursor-pointer flex flex-col items-start py-2.5 px-3 border-t border-gray-100"
                                >
                                    <div className="font-semibold text-xs text-gray-700 flex items-center gap-1.5">
                                        <Printer className="h-3.5 w-3.5 text-gray-500" />
                                        <span>Versi 1 (Klasik - A4 Landscape)</span>
                                    </div>
                                    <span className="text-[11px] text-gray-500 mt-1 pl-5">
                                        Format tabel standar klasik / retro
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Panel Parameter Filter (Mirip Persis Panel Report Tanpa Infografis) */}
                {showFilterPanel && (
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
                        {/* Header Panel Filter */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <Filter className="h-4 w-4 text-blue-600" />
                                Parameter Filter
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                                className="text-xs text-gray-500 hover:text-rose-600 gap-1.5 h-8 px-2"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span>Reset Filter</span>
                            </Button>
                        </div>

                        {/* Grid Input Filter */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* 1. Filter Customer */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-700">Customer</Label>
                                <SearchableSelect
                                    options={customerOptions}
                                    value={customerId}
                                    onChange={(val) => setCustomerId(val || 'all')}
                                    placeholder="Semua Customer"
                                    searchPlaceholder="Cari customer..."
                                    showClear={false}
                                    className="w-full text-xs h-9 bg-white"
                                />
                            </div>

                            {/* 2. Filter Shipper */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-700">Shipper</Label>
                                <SearchableSelect
                                    options={shipperOptions}
                                    value={shipperId}
                                    onChange={(val) => setShipperId(val || 'all')}
                                    placeholder="Semua Shipper"
                                    searchPlaceholder="Cari shipper..."
                                    showClear={false}
                                    className="w-full text-xs h-9 bg-white"
                                />
                            </div>

                            {/* 3. Filter Fumigator (Field Text Biasa) */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-700">Fumigator</Label>
                                <Input
                                    type="text"
                                    value={fumigator}
                                    onChange={(e) => setFumigator(e.target.value)}
                                    onKeyDown={handleKeyDownSearch}
                                    placeholder="Ketik nama fumigator..."
                                    className="text-xs h-9 bg-white border-gray-200"
                                />
                            </div>

                            {/* 4. Filter Jenis Layanan (Multi-Select) */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-gray-700">Jenis Layanan</Label>
                                    {selectedProductIds.length > 0 && (
                                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                            {selectedProductIds.length} dipilih
                                        </span>
                                    )}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="w-full justify-between border-gray-200 bg-white text-xs font-normal text-gray-800 shadow-2xs hover:bg-gray-50 h-9"
                                        >
                                            <span className="truncate">
                                                {selectedProductIds.length === 0
                                                    ? 'Semua Layanan'
                                                    : selectedProductIds.length === 1
                                                    ? (products.find((p) => p.id === selectedProductIds[0])?.service_type || '1 Layanan')
                                                    : `${selectedProductIds.length} Layanan Dipilih`}
                                            </span>
                                            <ChevronDown className="ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-80 p-2 shadow-lg" align="start">
                                        <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100 mb-2">
                                            <span className="text-xs font-semibold text-gray-700">Pilih Layanan</span>
                                            <div className="flex gap-2 text-[11px]">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedProductIds(products.map((p) => p.id));
                                                    }}
                                                    className="text-blue-600 hover:underline font-medium"
                                                >
                                                    Semua ({products.length})
                                                </button>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedProductIds([]);
                                                    }}
                                                    className="text-gray-500 hover:underline"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        </div>

                                        {/* Search Input di dalam Dropdown */}
                                        <div className="relative mb-2 px-1">
                                            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="Cari layanan..."
                                                value={productSearchQuery}
                                                onChange={(e) => setProductSearchQuery(e.target.value)}
                                                onKeyDown={(e) => e.stopPropagation()}
                                                className="h-8 pl-8 pr-7 text-xs rounded-md border-gray-200"
                                            />
                                            {productSearchQuery && (
                                                <button
                                                    type="button"
                                                    onClick={() => setProductSearchQuery('')}
                                                    className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Toggle Centang Semua Filter */}
                                        {filteredProductsList.length > 0 && (
                                            <div
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleAllFiltered();
                                                }}
                                                className="flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-medium text-slate-700 border border-slate-200 transition-colors"
                                            >
                                                <Checkbox
                                                    checked={isAllFilteredSelected}
                                                    onCheckedChange={toggleAllFiltered}
                                                    className="h-3.5 w-3.5"
                                                />
                                                <span className="truncate text-xs">
                                                    {productSearchQuery
                                                        ? `Centang Semua ("${productSearchQuery}")`
                                                        : `Centang Semua (${filteredProductsList.length})`}
                                                </span>
                                            </div>
                                        )}

                                        {/* List Produk */}
                                        <div className="space-y-0.5 max-h-56 overflow-y-auto">
                                            {filteredProductsList.length === 0 ? (
                                                <div className="py-4 text-center text-xs text-gray-400">
                                                    Tidak ada layanan cocok
                                                </div>
                                            ) : (
                                                filteredProductsList.map((product) => {
                                                    const isSelected = selectedProductIds.includes(product.id);
                                                    return (
                                                        <div
                                                            key={product.id}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleProduct(product.id);
                                                            }}
                                                            className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${
                                                                isSelected
                                                                    ? 'bg-blue-50 text-blue-900 font-medium'
                                                                    : 'hover:bg-gray-100 text-gray-700'
                                                            }`}
                                                        >
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={() => toggleProduct(product.id)}
                                                                className="h-3.5 w-3.5"
                                                            />
                                                            <span className="truncate">{product.service_type}</span>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Baris 2: Status Exclude & Rentang Tanggal */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                            {/* 5. Status Exclude */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-700">Status Exclude</Label>
                                <Select value={excludeStatus} onValueChange={setExcludeStatus}>
                                    <SelectTrigger className="w-full text-xs h-9 bg-white border-gray-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Hanya yang Diikutsertakan (Default)</SelectItem>
                                        <SelectItem value="all">Semua (Termasuk yang di-exclude)</SelectItem>
                                        <SelectItem value="excluded">Hanya yang Di-exclude</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 6. Rentang Tanggal dengan Opsi Berdasarkan */}
                            <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-gray-700">Rentang Tanggal</Label>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] text-gray-500">Berdasarkan:</span>
                                        <select
                                            value={dateType}
                                            onChange={(e) => setDateType(e.target.value)}
                                            className="text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 cursor-pointer focus:ring-0"
                                        >
                                            <option value="entry_date">Tgl Masuk</option>
                                            <option value="eir_date">Tgl EIR</option>
                                            <option value="exit_date">Tgl Keluar</option>
                                        </select>
                                    </div>
                                </div>
                                <DateRangePicker
                                    startDate={dateFrom}
                                    endDate={dateTo}
                                    onChange={({ startDate, endDate }) => {
                                        setDateFrom(startDate);
                                        setDateTo(endDate);
                                    }}
                                    onApply={({ startDate, endDate }) => {
                                        setDateFrom(startDate);
                                        setDateTo(endDate);
                                        applyFilters({ date_from: startDate, date_to: endDate });
                                    }}
                                    placeholder="Semua rentang tanggal..."
                                    className="w-full"
                                    align="right"
                                />
                            </div>
                        </div>

                        {/* Chips Layanan Terpilih jika ada */}
                        {selectedProductIds.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2.5">
                                <span className="text-[11px] text-gray-500 font-medium">Layanan Terpilih:</span>
                                {selectedProductIds.map((id) => {
                                    const prod = products.find((p) => p.id === id);
                                    if (!prod) return null;
                                    return (
                                        <span
                                            key={id}
                                            className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200"
                                        >
                                            {prod.service_type}
                                            <button
                                                type="button"
                                                onClick={() => toggleProduct(id)}
                                                className="hover:text-blue-900 focus:outline-none"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    );
                                })}
                                <button
                                    type="button"
                                    onClick={() => setSelectedProductIds([])}
                                    className="text-[11px] text-gray-500 hover:text-rose-600 underline ml-1"
                                >
                                    Hapus Semua
                                </button>
                            </div>
                        )}

                        {/* Search Bar & Apply Action (Baris Bawah) */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Cari nomor kontainer, customer, shipper, atau komoditi... (Tekan Enter)"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleKeyDownSearch}
                                    className="pl-9 text-xs h-9 bg-white border-gray-200"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <Button
                                    size="sm"
                                    onClick={() => applyFilters()}
                                    className="bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-5 shadow-2xs"
                                >
                                    Terapkan Filter
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Data Card (Susunan Kolom Persis Sama) */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-xs p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                Daftar Kontainer Karantina & Fumigasi
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Menampilkan total <span className="font-bold text-gray-800">{orders.total ?? orders.data.length}</span> kontainer sesuai kriteria filter aktif.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <Table>
                            <TableHeader className="bg-slate-50 text-xs font-semibold text-slate-700 border-b border-gray-200">
                                <TableRow className="hover:bg-transparent">
                                    {/* 1. Nomor Kontainer */}
                                    <TableHead className="px-4 py-3.5 whitespace-nowrap">
                                        <SortButton
                                            label="Nomor Kontainer"
                                            field="container_number"
                                            currentSort={filters.sort_by}
                                            currentDir={filters.sort_dir}
                                        />
                                    </TableHead>

                                    {/* 2. Nama Shipper */}
                                    <TableHead className="px-4 py-3.5 whitespace-nowrap">
                                        <SortButton
                                            label="Nama Shipper"
                                            field="shippers.name"
                                            currentSort={filters.sort_by}
                                            currentDir={filters.sort_dir}
                                        />
                                    </TableHead>

                                    {/* 3. Size */}
                                    <TableHead className="px-4 py-3.5 text-center whitespace-nowrap">
                                        Size
                                    </TableHead>

                                    {/* 4. Tanggal Masuk */}
                                    <TableHead className="px-4 py-3.5 whitespace-nowrap">
                                        <SortButton
                                            label="Tanggal Masuk"
                                            field="entry_date"
                                            currentSort={filters.sort_by}
                                            currentDir={filters.sort_dir}
                                        />
                                    </TableHead>

                                    {/* 5. Tanggal EIR */}
                                    <TableHead className="px-4 py-3.5 whitespace-nowrap">
                                        <SortButton
                                            label="Tanggal EIR"
                                            field="eir_date"
                                            currentSort={filters.sort_by}
                                            currentDir={filters.sort_dir}
                                        />
                                    </TableHead>

                                    {/* 6. Tanggal Keluar */}
                                    <TableHead className="px-4 py-3.5 whitespace-nowrap">
                                        <SortButton
                                            label="Tanggal Keluar"
                                            field="exit_date"
                                            currentSort={filters.sort_by}
                                            currentDir={filters.sort_dir}
                                        />
                                    </TableHead>

                                    {/* 7. Komoditi */}
                                    <TableHead className="px-4 py-3.5 whitespace-nowrap">
                                        Komoditi
                                    </TableHead>

                                    {/* 8. Negara Tujuan */}
                                    <TableHead className="px-4 py-3.5 whitespace-nowrap">
                                        Negara Tujuan
                                    </TableHead>

                                    {/* 9. Fumigator */}
                                    <TableHead className="px-4 py-3.5 whitespace-nowrap">
                                        <SortButton
                                            label="Fumigator"
                                            field="fumigasi"
                                            currentSort={filters.sort_by}
                                            currentDir={filters.sort_dir}
                                        />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 bg-white">
                                {orders.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="py-12 text-center text-sm text-gray-500">
                                            <div className="flex flex-col items-center justify-center gap-1.5">
                                                <Filter className="h-6 w-6 text-gray-300" />
                                                <span className="font-semibold text-gray-700">Tidak ada data kontainer yang sesuai filter.</span>
                                                <span className="text-xs text-gray-400">Silakan ubah parameter filter atau klik Reset Filter.</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.data.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50/70 transition-colors">
                                            {/* 1. Nomor Kontainer */}
                                            <TableCell className="px-4 py-3 text-sm font-bold text-slate-900 font-mono">
                                                {item.container_number}
                                            </TableCell>

                                            {/* 2. Nama Shipper */}
                                            <TableCell className="px-4 py-3 text-sm text-slate-800">
                                                {item.order?.shipper?.name ?? item.shipper_name ?? '-'}
                                            </TableCell>

                                            {/* 3. Size */}
                                            <TableCell className="px-4 py-3 text-sm text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                                    {formatContainerSize(item.price_type)}
                                                </span>
                                            </TableCell>

                                            {/* 4. Tanggal Masuk */}
                                            <TableCell className="px-4 py-3 text-sm">
                                                {formatKarantinaDateTime(item.entry_date)}
                                            </TableCell>

                                            {/* 5. Tanggal EIR */}
                                            <TableCell className="px-4 py-3 text-sm">
                                                {formatKarantinaDateTime(item.eir_date)}
                                            </TableCell>

                                            {/* 6. Tanggal Keluar */}
                                            <TableCell className="px-4 py-3 text-sm">
                                                {formatKarantinaDateTime(item.exit_date)}
                                            </TableCell>

                                            {/* 7. Komoditi */}
                                            <TableCell className="px-4 py-3 text-sm text-slate-800">
                                                {item.commodity ?? '-'}
                                            </TableCell>

                                            {/* 8. Negara Tujuan */}
                                            <TableCell className="px-4 py-3 text-sm text-slate-800">
                                                {item.country ?? '-'}
                                            </TableCell>

                                            {/* 9. Fumigator */}
                                            <TableCell className="px-4 py-3 text-sm">
                                                {item.order?.fumigasi ?? item.fumigasi ? (
                                                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                                                        {item.order?.fumigasi ?? item.fumigasi}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">–</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                        <p className="text-xs text-gray-500">
                            Menampilkan <span className="font-semibold text-gray-800">{orders.from ?? 0}</span> sampai{' '}
                            <span className="font-semibold text-gray-800">{orders.to ?? 0}</span> dari{' '}
                            <span className="font-semibold text-gray-800">{orders.total ?? orders.data.length}</span> kontainer
                        </p>
                        <div className="flex flex-wrap justify-center gap-1">
                            {orders.links.map((link, i) =>
                                link.url ? (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        disabled={!link.url}
                                        onClick={() => router.get(link.url!, {}, { preserveState: true, preserveScroll: true })}
                                        className={`px-3 py-1 text-xs font-medium h-8 ${
                                            link.active
                                                ? 'bg-gray-900 text-white hover:bg-black'
                                                : 'text-gray-700 bg-white border-gray-200'
                                        }`}
                                    >
                                        {link.label.replace(/&laquo; Previous|Next &raquo;/, (match) => {
                                            if (match.includes('Previous')) return '← Prev';
                                            if (match.includes('Next')) return 'Next →';
                                            return match;
                                        })}
                                    </Button>
                                ) : (
                                    <span key={i} className="px-2.5 py-1 text-xs text-gray-400">
                                        ...
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
