import AppLayout from '@/layouts/app-layout';
import OrdersLayout from '@/layouts/orders/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowDown, ArrowUp, ArrowUpDown, PlusCircle, PrinterIcon, X } from 'lucide-react';

// UI Components
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DateRangePicker from '@/components/date-range-picker';
import DateTimePicker from '@/components/date-time-picker';

// Types
interface FlashProps {
    success?: string;
    error?: string;
}

type Props = {
    orders: {
        data: Order[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    customers: Customer[]; // ✅ Sudah benar
    filters: {
        customer: string;
        search?: string;
        trashed?: string;
        sort_by?: string;
        sort_dir?: string;
        start_date?: string;
        end_date?: string;
    };
};

type Customer = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    service_type: string;
    requires_temperature: boolean;
};

type Shipper = {
    id: number;
    name: string;
};

type OrderParent = {
    id: number;
    no_aju: string | null;
    order_id: string;
    customer: Customer;
    shipper: { id: number; name: string };
    fumigasi: string | null; // ✅ Tambahkan baris ini
};

type Order = {
    id: number;
    order_id: string;
    customer_id: number;
    product_id: number;
    shipper_id: number;
    container_number: string;
    order: OrderParent; // ✅ Tambahkan ini!
    entry_date: string | null;
    eir_date: string | null;
    exit_date: string | null;
    price_type: string | null; // ➜ baru
    commodity: string | null;
    no_aju: string | null;
    deleted_reason: string | null;
    deleted_at: string | null;
    customer: Customer;
    product: Product;
    shipper: Shipper;
    // Tambahkan ini:
    temperature?: {
        [date: string]: { [hour: string]: string };
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Karantina',
        href: '/karantina',
    },
];

type TemperatureRecord = {
    date: string; // YYYY-MM-DD
    temps: { [hour: string]: string };
};

type PageProps = {
    [key: string]: unknown;
    flash?: FlashProps;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role_id: number; // Tambahkan ini!
        };
    };
};

interface SortButtonProps {
    label: string;
    field: string;
    currentSort?: string;
    currentDir?: string;
    routeName?: string; // 👈 Tambahkan prop ini
}

function formatContainerSize(priceType?: string | null, fallback?: string): string {
    if (!priceType) return fallback || '-';
    const val = String(priceType).trim();
    if (val.toLowerCase().endsWith('ft')) return val;
    if (val === '20' || val === '40') return `${val}ft`;
    return val || fallback || '-';
}

export default function OrdersIndex({ orders, filters: rawFilters }: Props) {
    const filters = rawFilters || {};
    const [search, setSearch] = useState(filters.search ?? ''); // Tambahkan state search
    // const [customerFilter, setCustomerFilter] = useState<string>(filters.customer ?? ''); // HAPUS INI
    const [startDate, setStartDate] = useState<string>(filters.start_date ?? '');
    const [endDate, setEndDate] = useState<string>(filters.end_date ?? '');

    const [isTempDialogOpen, setIsTempDialogOpen] = useState(false);
    const [tempOrder, setTempOrder] = useState<Order | null>(null);
    const [tempRecords, setTempRecords] = useState<TemperatureRecord[]>([]);

    // Di dalam komponen, setelah state
    // HAPUS FILTER CUSTOMER DARI LOGIC INI
    const filteredOrders = orders.data.filter((order) => {
        // 🔁 Cek periode (start & end date)
        const matchesPeriod = () => {
            if (!startDate && !endDate) return true;

            const datesToCheck = [order.entry_date, order.eir_date, order.exit_date];
            return datesToCheck.some((dateStr) => {
                if (!dateStr) return false;
                const date = new Date(dateStr);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;

                if (start && date < start) return false;
                if (end && date > end) return false;
                return true;
            });
        };

        return matchesPeriod();
    });

    const updateDate = (recordIdx: number, date: string) => {
        setTempRecords((prev) => {
            const next = [...prev];
            next[recordIdx].date = date;
            return next;
        });
    };

    const updateTemp = (recordIdx: number, hour: number, value: string) => {
        setTempRecords((prev) => {
            const next = [...prev];
            next[recordIdx].temps = {
                ...(next[recordIdx].temps || {}),
                [hour.toString().padStart(2, '0')]: value,
            };
            return next;
        });
    };

    const addDateRecord = () => {
        setTempRecords((prev) => [...prev, { date: '', temps: {} }]);
    };

    const removeDateRecord = (recordIdx: number) => {
        setTempRecords((prev) => prev.filter((_, i) => i !== recordIdx));
    };

    const handleSaveTemp = () => {
        if (!tempOrder) return;
        const formatted: { [date: string]: { [hour: string]: string } } = {};
        tempRecords.forEach((rec) => {
            if (rec.date) formatted[rec.date] = rec.temps;
        });
        console.log('Data yang dikirim ke backend:', formatted);
        router.patch(
            route('orders.update-temperature', tempOrder.id),
            { temperature: formatted },
            {
                onSuccess: () => {
                    setIsTempDialogOpen(false);
                    setTempOrder(null);
                    setTempRecords([]);
                    router.reload({ only: ['orders'] });
                },
                onError: (errors) => {
                    alert('Terjadi error saat menyimpan data suhu.');
                    console.error(errors);
                },
            },
        );
    };
    useEffect(() => {
        console.log('Semua data orders:', orders.data);
    }, [orders.data]);

    const handlePrint = () => {
        // Use the already filtered orders for printing
        if (filteredOrders.length === 0) {
            alert('Tidak ada data yang sesuai filter untuk dicetak.');
            return;
        }

        // Format label periode
        const startLabel = startDate ? new Date(startDate).toLocaleDateString('id-ID') : 'Semua';
        const endLabel = endDate ? new Date(endDate).toLocaleDateString('id-ID') : 'Semua';
        const periodLabel = `${startLabel} s/d ${endLabel}`;

        const logoUrl = '/logo.png'; // pastikan path benar

        const img = new Image();
        img.src = logoUrl;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Gagal membuka jendela cetak. Pastikan popup tidak diblokir.');
            return;
        }

        printWindow.document.write(`
        <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
            Memuat logo...
        </div>
    `);
        printWindow.document.close();

        img.onload = () => {
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Billing Statement</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        margin: 20px;
                        color: #333;
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        margin-bottom: 20px;
                    }
                    .logo {
                        width: 70px;
                        height: 70px;
                    }
                    .company-info {
                        font-size: 14px;
                    }
                    .company-info strong {
                        font-size: 16px;
                    }
                    .customer-info {
                        margin-top: 10px;
                        font-size: 14px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        font-size: 12px;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 8px 10px;
                        text-align: left;
                    }
                    th {
                        background-color: #f0f0f0;
                        font-weight: 600;
                    }
                    .text-gray-400 {
                        color: #9ca3af;
                    }
                    .bg-yellow-100 {
                        background-color: #fef3c7;
                        padding: 4px 6px;
                        border-radius: 4px;
                        font-size: 11px;
                    }
                    .text-yellow-800 {
                        color: #854d0e;
                    }
                    @media print {
                        @page {
                            margin: 1cm;
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
                    <img src="${logoUrl}" alt="Logo" class="logo">
                    <div class="company-info">
                        <strong>PT. DEPO SUBARAYA SEJAHTERA</strong><br>
                        Tanjung Sadari No. 90<br>
                        Surabaya<br>
                        Jawa Timur - Indonesia
                    </div>
                </div>

                <div class="customer-info">
                    <strong>Periode:</strong> ${periodLabel}<br>
                  
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Nomor Kontainer</th>
                            <th>Nama Shipper</th>
                            <th>Size</th>
                            <th>Tanggal Masuk</th>
                            <th>Tanggal EIR</th>
                            <th>Tanggal Keluar</th>
                            <th>Komoditi</th>
                            <th>Fumigator</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredOrders
                            .map(
                                (order) => `
                            <tr>
                                <td>${order.container_number}</td>
                                <td>${order.order?.shipper?.name ?? '-'}</td>
                                <td>${formatContainerSize(order.price_type)}</td>
                                <td>${order.entry_date ? new Date(order.entry_date).toLocaleString('id-ID') : '<span class="text-gray-400">–</span>'}</td>
                                <td>${order.eir_date ? new Date(order.eir_date).toLocaleString('id-ID') : '<span class="text-gray-400">–</span>'}</td>
                                <td>${order.exit_date ? new Date(order.exit_date).toLocaleString('id-ID') : '<span class="text-gray-400">–</span>'}</td>
                                <td>${order.commodity ?? '-'}</td>
                                <td>
    ${order.order?.fumigasi ? (order.order.fumigasi.length > 50 ? order.order.fumigasi.substring(0, 50) + '...' : order.order.fumigasi) : '–'}
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

            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.focus();

            setTimeout(() => printWindow.print(), 300);
        };

        img.onerror = () => {
            alert('Gagal memuat logo. Pastikan file /logo.png ada di folder public.');
            printWindow.close();
        };
    };

    const { props } = usePage<PageProps>();

    const handleSearch = () => {
        const currentPath = window.location.pathname;
        const routeUrl = currentPath.startsWith('/karantina') ? '/karantina' : '/karantina';

        router.get(routeUrl, {
            search, // Tambahkan search ke parameter
            trashed: filters.trashed,
            start_date: startDate,
            end_date: endDate,
            // customer: customerFilter, // HAPUS INI
        });
    };

    // Di dalam komponen SortButton
    const SortButton = ({ label, field, currentSort, currentDir, routeName = 'index_karantina' }: SortButtonProps) => {
        const direction = currentSort === field ? (currentDir === 'asc' ? 'desc' : 'asc') : 'asc';

        return (
            <Link
                href={route(routeName, {
                    sort_by: field,
                    sort_dir: direction,
                    search: search, // Tambahkan search ke parameter
                    // customer: customerFilter, // HAPUS INI
                    start_date: startDate,
                    end_date: endDate,
                })}
                className="flex items-center gap-1 font-semibold text-gray-700 hover:text-black"
            >
                {label} {/* <-- Tambahkan ini untuk menampilkan label */}
                {/* Icon logic tetap sama */}
                {currentSort === field ? (
                    direction === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                    ) : (
                        <ArrowDown className="h-4 w-4" />
                    )
                ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" /> // Anda juga perlu mengimpor ArrowUpDown dan ArrowUp, ArrowDown
                )}
            </Link>
        );
    };

    // Kelompokkan data orders berdasarkan `no_aju` jika ada, jika tidak gunakan `order_id`
    const groupKeys: string[] = [];
    const groupedOrders: Record<string, Order[]> = {};
    for (const order of filteredOrders) {
        const groupKey = order.no_aju ?? order.order_id;
        if (!groupedOrders[groupKey]) {
            groupedOrders[groupKey] = [];
            groupKeys.push(groupKey);
        }
        groupedOrders[groupKey].push(order);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Karantina & Fumigasi - Depo Surabaya" />

            <div className="flex flex-1 flex-col gap-6 bg-[#f8fafc] p-4 md:p-6 min-h-screen">
                {/* Flash Message */}
                {props.flash?.success && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm">
                        {props.flash.success}
                    </div>
                )}
                {props.flash?.error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm">
                        {props.flash.error}
                    </div>
                )}

                {/* Header Karantina */}
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-800">
                                Karantina & Fumigasi
                            </h1>
                            <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
                                Petugas Karantina
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Kelola data kontainer karantina, filter pencarian per periode, dan cetak billing statement resmi.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            onClick={handlePrint}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm"
                        >
                            <PrinterIcon className="mr-2 h-4 w-4" />
                            Cetak Billing Statement
                        </Button>
                    </div>
                </div>

                {/* Filter Section Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                            Filter & Pencarian Kontainer
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        {/* Search Input */}
                        <div className="md:col-span-2 space-y-1">
                            <Label htmlFor="search" className="text-xs font-medium text-gray-600">
                                Cari (Fumigator, Shipper, Kontainer)
                            </Label>
                            <Input
                                id="search"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari fumigator, shipper, atau nomor kontainer..."
                                className="w-full rounded-lg border-gray-300 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500"
                            />
                        </div>

                        {/* Date Range Picker */}
                        <div className="md:col-span-2 space-y-1">
                            <Label className="text-xs font-medium text-gray-600">
                                Rentang Tanggal
                            </Label>
                            <DateRangePicker
                                startDate={startDate}
                                endDate={endDate}
                                onChange={({ startDate: s, endDate: e }) => {
                                    setStartDate(s);
                                    setEndDate(e);
                                }}
                                placeholder="Pilih rentang tanggal filter..."
                                className="w-full"
                                align="right"
                            />
                        </div>
                    </div>

                    {/* Action buttons for search */}
                    <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearch('');
                                setStartDate('');
                                setEndDate('');
                                router.get('/karantina');
                            }}
                            className="text-xs font-medium"
                        >
                            Reset
                        </Button>
                        <Button onClick={handleSearch} className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                            Terapkan Filter
                        </Button>
                    </div>
                </div>

                {/* Data Table Card */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-800">
                            Daftar Kontainer Karantina & Fumigasi
                        </h2>
                        <p className="text-xs text-gray-500">
                            Menampilkan <span className="font-semibold text-gray-700">{filteredOrders.length}</span> kontainer sesuai kriteria filter.
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <Table>
                            <TableHeader className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-gray-200">
                                <TableRow>
                                    <TableHead className="px-4 py-3">
                                        <SortButton
                                            label="Nomor Kontainer"
                                            field="container_number"
                                            currentSort={filters.sort_by}
                                            currentDir={filters.sort_dir}
                                        />
                                    </TableHead>
                                    <TableHead className="px-4 py-3">
                                        <SortButton
                                            label="Nama Shipper"
                                            field="shippers.name"
                                            currentSort={filters.sort_by}
                                            currentDir={filters.sort_dir}
                                        />
                                    </TableHead>
                                    <TableHead className="px-4 py-3">Size</TableHead>
                                    <TableHead className="px-4 py-3">Tanggal Masuk</TableHead>
                                    <TableHead className="px-4 py-3">Tanggal EIR</TableHead>
                                    <TableHead className="px-4 py-3">Tanggal Keluar</TableHead>
                                    <TableHead className="px-4 py-3">Komoditi</TableHead>
                                    <TableHead className="px-4 py-3">
                                        <SortButton label="Fumigasi" field="fumigasi" currentSort={filters.sort_by} currentDir={filters.sort_dir} />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 bg-white">
                                {filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-10 text-center text-sm text-gray-400">
                                            Tidak ada data yang sesuai filter.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-slate-50/80 transition-colors">
                                            <TableCell className="px-4 py-3 font-mono text-sm font-semibold text-slate-900 tracking-tight">
                                                {order.container_number}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                {order.order?.shipper?.name ?? '-'}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm">
                                                <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                                                    {formatContainerSize(order.price_type)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                {order.entry_date ? new Date(order.entry_date).toLocaleString('id-ID') : <span className="text-gray-400">-</span>}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                {order.eir_date ? new Date(order.eir_date).toLocaleString('id-ID') : <span className="text-gray-400">-</span>}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                {order.exit_date ? new Date(order.exit_date).toLocaleString('id-ID') : <span className="text-gray-400">-</span>}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm text-slate-800 font-normal">
                                                {order.commodity ?? '-'}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm">
                                                {order.order?.fumigasi ? (
                                                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                                                        {order.order.fumigasi}
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
                    <div className="mt-4 flex flex-wrap justify-center gap-1">
                        {orders.links.map((link, i) =>
                            link.url ? (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    disabled={!link.url}
                                    onClick={() => router.get(link.url!)}
                                    className="px-3 py-1 whitespace-nowrap text-xs font-medium"
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
                            ),
                        )}
                    </div>
                </div>

                <Dialog open={isTempDialogOpen} onOpenChange={setIsTempDialogOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Rekam Suhu Kontainer</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-2">
                            {tempRecords.map((rec, rIdx) => (
                                <div key={rIdx} className="space-y-2 rounded border p-4">
                                    {/* Input Tanggal */}
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor={`date_${rIdx}`}>Tanggal</Label>
                                        <DateTimePicker
                                            id={`date_${rIdx}`}
                                            value={rec.date}
                                            onChange={(val) => updateDate(rIdx, val)}
                                            withTime={false}
                                            placeholder="Pilih tanggal..."
                                            className="w-[180px]"
                                        />
                                        {tempRecords.length > 1 && (
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="destructive"
                                                className="ml-auto"
                                                onClick={() => removeDateRecord(rIdx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    {/* Input Suhu per Jam */}
                                    <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto">
                                        {[...Array(24)].map((_, h) => (
                                            <div key={h} className="flex items-center gap-2">
                                                <Label htmlFor={`temp_${rIdx}_${h}`}>{h.toString().padStart(2, '0')}:00</Label>
                                                <Input
                                                    id={`temp_${rIdx}_${h}`}
                                                    type="number"
                                                    step="0.1"
                                                    value={rec.temps[h.toString().padStart(2, '0')] || ''}
                                                    onChange={(e) => updateTemp(rIdx, h, e.target.value)}
                                                    className="w-24"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {/* Tombol tambah tanggal baru */}
                            <Button type="button" variant="outline" onClick={addDateRecord} className="flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" /> Tambah Tanggal
                            </Button>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsTempDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button onClick={handleSaveTemp}>Simpan</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
