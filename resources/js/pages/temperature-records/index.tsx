import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import TemperatureRecordsLayout from '@/layouts/temperature-records/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Clock, Plus, RotateCcw, Search, Thermometer, Trash2, X } from 'lucide-react';
import { Fragment, useState } from 'react';

type TemperatureRecordItem = {
    id: number;
    container_number: string;
    price_type: string | null;
    commodity: string | null;
    entry_date: string | null;
    exit_date: string | null;
    order: {
        id: number;
        order_id: string;
        no_aju?: string | null;
        customer?: { id: number; name: string };
        shipper?: { id: number; name: string };
    };
    product?: { id: number; service_type: string; requires_temperature?: boolean };
    additional_products?: Array<{ id: number; service_type: string }>;
    rekam_suhu: Array<{
        id: number;
        tanggal: string;
        jam_data: Record<string, string>;
    }>;
};

type Props = {
    records: {
        data: TemperatureRecordItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
        from?: number;
        to?: number;
    };
    filters: {
        search?: string;
        status?: string;
        per_page?: number;
    };
    counts: {
        active: number;
        all: number;
        out: number;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

function formatDate(dateStr: string | null) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = d.getDate().toString().padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

export default function TemperatureRecordsIndex({ records, filters, counts }: Props) {
    const pageProps = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flash = pageProps.flash;

    const [search, setSearch] = useState(filters.search || '');
    const [currentStatus, setCurrentStatus] = useState(filters.status || 'active');
    const [perPage, setPerPage] = useState(String(filters.per_page || records.per_page || 15));
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

    // Modal Catat Suhu Cepat
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [selectedContainer, setSelectedContainer] = useState<TemperatureRecordItem | null>(null);
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    const [logHour, setLogHour] = useState(new Date().getHours().toString().padStart(2, '0'));
    const [logMinute, setLogMinute] = useState('');
    const [isCustomTime, setIsCustomTime] = useState(false);
    const [logSuhu, setLogSuhu] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Monitoring Suhu Kontainer', href: '/temperature-records' }];

    const handleSearch = () => {
        router.get('/temperature-records', {
            search: search || undefined,
            status: currentStatus,
            per_page: perPage,
        });
    };

    const handleStatusChange = (newStatus: string) => {
        setCurrentStatus(newStatus);
        router.get('/temperature-records', {
            search: search || undefined,
            status: newStatus,
            per_page: perPage,
        });
    };

    const handlePerPageChange = (val: string) => {
        setPerPage(val);
        router.get(
            '/temperature-records',
            {
                search: search || undefined,
                status: currentStatus,
                per_page: val,
            },
            { preserveState: true },
        );
    };

    const toggleRow = (id: number) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const openLogModal = (item: TemperatureRecordItem) => {
        setSelectedContainer(item);
        setLogDate(new Date().toISOString().slice(0, 10));
        setLogHour(new Date().getHours().toString().padStart(2, '0'));
        setLogMinute('');
        setIsCustomTime(false);
        setLogSuhu('');
        setIsLogModalOpen(true);
    };

    const submitTemperatureLog = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedContainer || !logSuhu) return;

        let formattedJam = logHour;
        if (isCustomTime && logMinute) {
            formattedJam = `${logHour}:${logMinute.padStart(2, '0')}`;
        }

        setIsSubmitting(true);
        router.patch(
            route('orders.update-temperature', selectedContainer.id),
            {
                tanggal: logDate,
                jam: formattedJam,
                suhu: logSuhu,
            },
            {
                onSuccess: () => {
                    setIsLogModalOpen(false);
                    setIsSubmitting(false);
                    setLogSuhu('');
                },
                onError: () => {
                    setIsSubmitting(false);
                },
                preserveScroll: true,
            },
        );
    };

    const deleteTemperatureLog = (orderItemId: number, tanggal: string, jam: string) => {
        if (!confirm(`Hapus catatan suhu jam ${jam} pada tanggal ${tanggal}?`)) return;

        router.patch(
            route('orders.update-temperature', orderItemId),
            {
                delete_tanggal: tanggal,
                delete_jam: jam,
            },
            {
                preserveScroll: true,
            },
        );
    };

    // Helper untuk mengambil suhu terakhir
    const getLatestTemp = (rekamList: TemperatureRecordItem['rekam_suhu']) => {
        if (!rekamList || rekamList.length === 0) return null;
        for (const rekam of rekamList) {
            const entries = Object.entries(rekam.jam_data || {});
            if (entries.length > 0) {
                entries.sort(([a], [b]) => b.localeCompare(a));
                return {
                    tanggal: rekam.tanggal,
                    jam: entries[0][0],
                    suhu: entries[0][1],
                };
            }
        }
        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Monitoring Suhu Kontainer" />

            <TemperatureRecordsLayout>
                <div className="w-full space-y-6">
                    {/* Flash Message */}
                    {flash?.success && (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 font-medium">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-800 font-medium">
                            {flash.error}
                        </div>
                    )}

                    {/* Header Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Thermometer className="h-7 w-7 text-gray-900" />
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    Monitoring Suhu Kontainer
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Pantau suhu kontainer reefer/plug-in secara berkala, log 24 jam, dan riwayat plug in/out.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium px-2 py-1 bg-white border border-gray-200 rounded-md shadow-xs h-9">
                                <span className="shrink-0">Tampilkan:</span>
                                <Select value={perPage} onValueChange={handlePerPageChange}>
                                    <SelectTrigger className="h-7 w-[70px] text-xs font-semibold border-0 focus:ring-0 p-1">
                                        <SelectValue placeholder="15" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="15">15</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Quick Filter Status Tabs */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
                        <button
                            type="button"
                            onClick={() => handleStatusChange('active')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                currentStatus === 'active'
                                    ? 'bg-gray-900 text-white shadow-xs'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            Sedang di Depo ({counts?.active ?? 0})
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusChange('all')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                currentStatus === 'all'
                                    ? 'bg-gray-900 text-white shadow-xs'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            Semua Kontainer ({counts?.all ?? 0})
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusChange('out')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                currentStatus === 'out'
                                    ? 'bg-gray-900 text-white shadow-xs'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            Sudah Keluar ({counts?.out ?? 0})
                        </button>
                    </div>

                    {/* Unified Search Bar Card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nomor kontainer, customer, shipper, atau order ID..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-9 h-9 text-xs"
                                />
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button
                                    size="sm"
                                    onClick={handleSearch}
                                    className="h-9 text-xs px-4 bg-gray-900 hover:bg-black text-white gap-1.5 font-medium"
                                >
                                    <Search className="h-3.5 w-3.5" />
                                    Cari
                                </Button>
                                {search && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSearch('');
                                            router.get('/temperature-records', {
                                                status: currentStatus,
                                                per_page: perPage,
                                            });
                                        }}
                                        className="h-9 text-xs px-3 text-gray-600 hover:text-red-600 gap-1.5"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Standardized Table Card */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50/75">
                                    <TableRow>
                                        <TableHead className="py-3.5 text-xs font-semibold text-gray-700">No. Kontainer</TableHead>
                                        <TableHead className="py-3.5 text-xs font-semibold text-gray-700">Customer & Order</TableHead>
                                        <TableHead className="py-3.5 text-xs font-semibold text-gray-700">Shipper</TableHead>
                                        <TableHead className="py-3.5 text-xs font-semibold text-gray-700">Layanan</TableHead>
                                        <TableHead className="py-3.5 text-xs font-semibold text-gray-700">Waktu Masuk & Status</TableHead>
                                        <TableHead className="py-3.5 text-xs font-semibold text-gray-700">Suhu Terakhir</TableHead>
                                        <TableHead className="py-3.5 text-xs font-semibold text-gray-700 text-right pr-4">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                                                Tidak ada kontainer dengan pemantauan suhu yang ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        records.data.map((item) => {
                                            const latest = getLatestTemp(item.rekam_suhu);
                                            const isExpanded = !!expandedRows[item.id];
                                            const isInDepo = !item.exit_date;

                                            return (
                                                <Fragment key={item.id}>
                                                    <TableRow className="hover:bg-gray-50/80 transition-colors">
                                                        {/* No. Kontainer */}
                                                        <TableCell className="py-3.5 font-medium">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="font-bold text-gray-900 text-sm">
                                                                        {item.container_number}
                                                                    </span>
                                                                    {item.price_type && (
                                                                        <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                                                            {item.price_type}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {item.commodity && (
                                                                    <span className="text-xs text-gray-500">
                                                                        {item.commodity}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </TableCell>

                                                        {/* Customer & Order */}
                                                        <TableCell className="py-3.5">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="font-semibold text-gray-800 text-xs">
                                                                    {item.order?.customer?.name ?? '-'}
                                                                </span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[11px] font-medium text-gray-600">
                                                                        {item.order?.order_id}
                                                                    </span>
                                                                    {item.order?.no_aju && (
                                                                        <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-1.5 py-0.2 rounded border border-blue-200">
                                                                            AJU: {item.order.no_aju}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </TableCell>

                                                        {/* Shipper */}
                                                        <TableCell className="py-3.5 text-xs text-gray-700">
                                                            {item.order?.shipper?.name ?? '-'}
                                                        </TableCell>

                                                        {/* Layanan */}
                                                        <TableCell className="py-3.5">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="inline-flex items-center text-xs font-semibold text-gray-800">
                                                                    {item.product?.service_type ?? '-'}
                                                                </span>
                                                                {item.additional_products && item.additional_products.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {item.additional_products.map((ap) => (
                                                                            <span
                                                                                key={ap.id}
                                                                                className="text-[10px] bg-cyan-50 text-cyan-800 font-medium px-1.5 py-0.2 rounded border border-cyan-200"
                                                                            >
                                                                                + {ap.service_type}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>

                                                        {/* Waktu Masuk & Status */}
                                                        <TableCell className="py-3.5">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-xs text-gray-700">
                                                                    {formatDate(item.entry_date)}
                                                                </span>
                                                                <div>
                                                                    {isInDepo ? (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                                            Sedang di Depo
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                                                            Keluar Depo
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </TableCell>

                                                        {/* Suhu Terakhir */}
                                                        <TableCell className="py-3.5">
                                                            {latest ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="rounded-lg bg-orange-50 border border-orange-200 px-2.5 py-1 text-center">
                                                                        <div className="text-sm font-bold text-orange-700 font-mono">
                                                                            {latest.suhu}°C
                                                                        </div>
                                                                        <div className="text-[10px] text-orange-600 font-medium">
                                                                            {latest.jam}:00 · {latest.tanggal}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 italic">
                                                                    Belum ada catatan
                                                                </span>
                                                            )}
                                                        </TableCell>

                                                        {/* Aksi */}
                                                        <TableCell className="py-3.5 text-right pr-4">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => openLogModal(item)}
                                                                    className="h-8 text-xs px-2.5 bg-gray-900 hover:bg-black text-white font-medium gap-1"
                                                                    title="Catat Suhu Kontainer"
                                                                >
                                                                    <Plus className="h-3.5 w-3.5" />
                                                                    <span>Catat Suhu</span>
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => toggleRow(item.id)}
                                                                    className="h-8 text-xs px-2.5 text-gray-700 hover:text-black gap-1"
                                                                >
                                                                    <span>{isExpanded ? 'Tutup Log' : 'Detail Log'}</span>
                                                                    {isExpanded ? (
                                                                        <ChevronUp className="h-3.5 w-3.5" />
                                                                    ) : (
                                                                        <ChevronDown className="h-3.5 w-3.5" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>

                                                    {/* Expanded Row for 24h Log Detail */}
                                                    {isExpanded && (
                                                        <TableRow className="bg-slate-50/70 border-y border-slate-200">
                                                            <TableCell colSpan={7} className="p-4">
                                                                <div className="space-y-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                                                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                                                                            Riwayat Rekaman Suhu 24 Jam ({item.container_number})
                                                                        </h4>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => openLogModal(item)}
                                                                            className="h-7 text-xs px-2.5 text-gray-700 bg-white gap-1"
                                                                        >
                                                                            <Plus className="h-3.5 w-3.5 text-gray-600" />
                                                                            Tambah Catatan Jam
                                                                        </Button>
                                                                    </div>

                                                                    {item.rekam_suhu.length === 0 ? (
                                                                        <p className="text-xs text-gray-500 italic py-2">
                                                                            Belum ada data rekaman suhu yang tercatat untuk kontainer ini.
                                                                        </p>
                                                                    ) : (
                                                                        <div className="space-y-3">
                                                                            {item.rekam_suhu.map((suhu, sIdx) => {
                                                                                const sortedEntries = Object.entries(suhu.jam_data || {}).sort(([a], [b]) => a.localeCompare(b));

                                                                                return (
                                                                                    <div
                                                                                        key={sIdx}
                                                                                        className="rounded-xl border border-gray-200 bg-white p-3 shadow-2xs space-y-3"
                                                                                    >
                                                                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                                                                            <span className="text-xs font-bold text-gray-900">
                                                                                                Tanggal: {suhu.tanggal}
                                                                                            </span>
                                                                                            <span className="text-[11px] text-gray-500 font-medium">
                                                                                                {sortedEntries.length} entri jam tercatat
                                                                                            </span>
                                                                                        </div>

                                                                                        {/* Matrix Grid 24 Jam */}
                                                                                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1.5">
                                                                                            {Array.from({ length: 24 }).map((_, h) => {
                                                                                                const hourStr = h.toString().padStart(2, '0');
                                                                                                const val = suhu.jam_data[hourStr] || suhu.jam_data[`${hourStr}:00`];
                                                                                                const hasVal = val !== undefined && val !== null && val !== '';

                                                                                                return (
                                                                                                    <div
                                                                                                        key={h}
                                                                                                        className={`p-1.5 rounded-lg border text-center transition-all ${
                                                                                                            hasVal
                                                                                                                ? 'bg-orange-50/70 border-orange-200 text-orange-950 font-bold'
                                                                                                                : 'bg-gray-50/50 border-gray-100 text-gray-400'
                                                                                                        }`}
                                                                                                    >
                                                                                                        <div className="text-[10px] font-semibold text-gray-500">
                                                                                                            {hourStr}:00
                                                                                                        </div>
                                                                                                        <div className="text-xs font-mono mt-0.5">
                                                                                                            {hasVal ? `${val}°C` : '-'}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                );
                                                                                            })}
                                                                                        </div>

                                                                                        {/* Specific Log Entries & Actions */}
                                                                                        {sortedEntries.length > 0 && (
                                                                                            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
                                                                                                <span className="text-[11px] font-bold text-gray-500">
                                                                                                    Entri Khusus:
                                                                                                </span>
                                                                                                {sortedEntries.map(([jamKey, tempVal], eIdx) => {
                                                                                                    const isFirst = eIdx === 0;
                                                                                                    const isLast = eIdx === sortedEntries.length - 1 && sortedEntries.length > 1;
                                                                                                    const isMinute = jamKey.includes(':') && !jamKey.endsWith(':00');

                                                                                                    return (
                                                                                                        <span
                                                                                                            key={jamKey}
                                                                                                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
                                                                                                                isFirst && isMinute
                                                                                                                    ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                                                                                                                    : isLast && isMinute
                                                                                                                    ? 'bg-amber-50 text-amber-700 border-amber-200 font-bold'
                                                                                                                    : 'bg-white text-gray-700 border-gray-200'
                                                                                                            }`}
                                                                                                        >
                                                                                                            <span>
                                                                                                                {jamKey.includes(':') ? jamKey : `${jamKey}:00`}:
                                                                                                            </span>
                                                                                                            <span className="font-bold">
                                                                                                                {tempVal}°C
                                                                                                            </span>
                                                                                                            {isFirst && isMinute && (
                                                                                                                <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded">
                                                                                                                    Plug In
                                                                                                                </span>
                                                                                                            )}
                                                                                                            {isLast && isMinute && (
                                                                                                                <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded">
                                                                                                                    Plug Out
                                                                                                                </span>
                                                                                                            )}
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                onClick={() =>
                                                                                                                    deleteTemperatureLog(
                                                                                                                        item.id,
                                                                                                                        suhu.tanggal,
                                                                                                                        jamKey,
                                                                                                                    )
                                                                                                                }
                                                                                                                title="Hapus entri ini"
                                                                                                                className="text-gray-400 hover:text-red-600 transition-colors ml-0.5"
                                                                                                            >
                                                                                                                <Trash2 className="h-3 w-3" />
                                                                                                            </button>
                                                                                                        </span>
                                                                                                    );
                                                                                                })}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </Fragment>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500 font-medium">
                            Menampilkan <span className="font-semibold text-gray-800">{records.from || 0}</span> -{' '}
                            <span className="font-semibold text-gray-800">{records.to || 0}</span> dari{' '}
                            <span className="font-semibold text-gray-800">{records.total || records.data.length}</span> kontainer
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-1">
                            {records.links.map((link, i) =>
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
                                ),
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Quick Catat Suhu */}
                <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-base font-bold text-gray-900">
                                <Thermometer className="h-5 w-5 text-gray-900" />
                                Catat Suhu Kontainer
                            </DialogTitle>
                        </DialogHeader>

                        {selectedContainer && (
                            <form onSubmit={submitTemperatureLog} className="space-y-4 pt-2">
                                <div className="rounded-xl border border-gray-200 bg-gray-50/75 p-3 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-500">No. Kontainer:</span>
                                        <span className="text-xs font-bold text-gray-900 font-mono">
                                            {selectedContainer.container_number}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-500">Customer:</span>
                                        <span className="text-xs font-medium text-gray-800">
                                            {selectedContainer.order?.customer?.name ?? '-'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-500">Order / AJU:</span>
                                        <span className="text-xs font-medium text-gray-700">
                                            {selectedContainer.order?.order_id}
                                            {selectedContainer.order?.no_aju ? ` (${selectedContainer.order.no_aju})` : ''}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="log_date" className="text-xs font-semibold text-gray-700">
                                        Tanggal
                                    </Label>
                                    <Input
                                        id="log_date"
                                        type="date"
                                        value={logDate}
                                        onChange={(e) => setLogDate(e.target.value)}
                                        required
                                        className="h-9 text-xs"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold text-gray-700">Waktu / Jam</Label>
                                        <button
                                            type="button"
                                            onClick={() => setIsCustomTime(!isCustomTime)}
                                            className="text-[11px] text-blue-600 hover:underline font-medium"
                                        >
                                            {isCustomTime ? 'Mode Jam Bulat (00:00)' : 'Mode Jam & Menit Spesifik (Plug In/Out)'}
                                        </button>
                                    </div>

                                    {!isCustomTime ? (
                                        <Select value={logHour} onValueChange={setLogHour}>
                                            <SelectTrigger className="h-9 text-xs">
                                                <SelectValue placeholder="Pilih Jam" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-48">
                                                {Array.from({ length: 24 }).map((_, h) => {
                                                    const hh = h.toString().padStart(2, '0');
                                                    return (
                                                        <SelectItem key={hh} value={hh} className="text-xs">
                                                            {hh}:00
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Select value={logHour} onValueChange={setLogHour}>
                                                <SelectTrigger className="h-9 text-xs w-28">
                                                    <SelectValue placeholder="Jam" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-48">
                                                    {Array.from({ length: 24 }).map((_, h) => {
                                                        const hh = h.toString().padStart(2, '0');
                                                        return (
                                                            <SelectItem key={hh} value={hh} className="text-xs">
                                                                Jam {hh}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                            <span className="text-gray-400 font-bold">:</span>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="59"
                                                placeholder="Menit (00-59)"
                                                value={logMinute}
                                                onChange={(e) => setLogMinute(e.target.value)}
                                                className="h-9 text-xs flex-1"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="log_suhu" className="text-xs font-semibold text-gray-700">
                                        Nilai Suhu (°C)
                                    </Label>
                                    <Input
                                        id="log_suhu"
                                        type="number"
                                        step="0.1"
                                        placeholder="Contoh: -18.5 atau 4"
                                        value={logSuhu}
                                        onChange={(e) => setLogSuhu(e.target.value)}
                                        required
                                        className="h-9 text-xs"
                                        autoFocus
                                    />
                                </div>

                                <DialogFooter className="gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsLogModalOpen(false)}
                                        className="h-9 text-xs"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !logSuhu}
                                        className="h-9 text-xs bg-gray-900 hover:bg-black text-white px-4 font-semibold"
                                    >
                                        {isSubmitting ? 'Menyimpan...' : 'Simpan Suhu'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </TemperatureRecordsLayout>
        </AppLayout>
    );
}

