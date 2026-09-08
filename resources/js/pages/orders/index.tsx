import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import OrdersLayout from '@/layouts/orders/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusCircle, Thermometer, X } from 'lucide-react';
import { Fragment, useState } from 'react';
// UI Components
import Heading from '@/components/heading';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, EyeOff, Pencil, Plus, Printer, Receipt, RotateCcw, Search, Trash2 } from 'lucide-react';
import SuratJalanModal, { SuratJalanData } from '@/components/surat-jalan-modal';
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
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
        from?: number;
        to?: number;
    };
    filters: {
        search?: string;
        trashed?: string;
        sort_by?: string;
        sort_dir?: string;
        date_from?: string;
        date_to?: string;
        per_page?: number;
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
    fumigasi: string | null;
    is_excluded_from_report?: boolean;
};
type Order = {
    id: number;
    order_id: string;
    customer_id: number;
    product_id: number;
    shipper_id: number;
    container_number: string;
    order: OrderParent;
    entry_date: string | null;
    eir_date: string | null;
    exit_date: string | null;
    price_type: string | null;
    commodity: string | null;
    no_aju: string | null;
    deleted_reason: string | null;
    deleted_at: string | null;
    is_excluded_from_report?: boolean;
    customer: Customer;
    product: Product;
    shipper: Shipper;
    temperature?: {
        [date: string]: { [hour: string]: string };
    };
};
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Order Management',
        href: '/orders',
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
            role_id: number;
        };
    };
};
function formatDate(dateStr?: string | null) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = monthShort[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hour}:${minute}`;
}

export default function OrdersIndex({ orders, filters: rawFilters }: Props) {
    const filters = rawFilters || {};
    const [search, setSearch] = useState(filters?.search ?? '');
    const [isTrashed, setIsTrashed] = useState(!!filters.trashed);
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters?.date_to ?? '');
    const [perPage, setPerPage] = useState<string>(String(filters?.per_page || orders?.per_page || 25));
    const [isTempDialogOpen, setIsTempDialogOpen] = useState(false);
    const [tempOrder, setTempOrder] = useState<Order | null>(null);
    const [tempRecords, setTempRecords] = useState<TemperatureRecord[]>([]);
    const [collapsedGroups, setCollapsedGroups] = useState<{
        [key: string]: boolean;
    }>({});

    // State untuk dialog hapus order
    const [deleteOrderModalOpen, setDeleteOrderModalOpen] = useState(false);
    const [deleteOrderReason, setDeleteOrderReason] = useState('');
    const [orderIdToDelete, setOrderIdToDelete] = useState<number | null>(null);

    // State untuk dialog cetak Surat Jalan (21 x 14 cm)
    const [suratJalanModalOpen, setSuratJalanModalOpen] = useState(false);
    const [selectedSuratJalan, setSelectedSuratJalan] = useState<SuratJalanData | null>(null);

    const openSuratJalanModal = (orderItem: Order) => {
        setSelectedSuratJalan({
            container_number: orderItem.container_number,
            size: orderItem.price_type || '20ft',
            customer_name: orderItem.order?.customer?.name || orderItem.customer?.name || '-',
            shipper_name: orderItem.order?.shipper?.name || orderItem.shipper?.name || null,
            service_type: orderItem.product?.service_type || 'PEMERIKSAAN KARANTINA',
            commodity: orderItem.commodity || null,
            no_aju: orderItem.no_aju || orderItem.order?.no_aju || null,
            order_id: orderItem.order?.order_id || orderItem.order_id,
            date: orderItem.exit_date || orderItem.entry_date || null,
        });
        setSuratJalanModalOpen(true);
    };

    const handleOpenTempModal = (order: Order) => {
        console.log('DATA ORDER:', order);
        console.log('TEMPERATURE:', order.temperature);
        setTempOrder(order);
        if (order.temperature && Object.keys(order.temperature).length > 0) {
            const records: TemperatureRecord[] = Object.entries(order.temperature).map(([date, temps]) => ({
                date,
                temps: temps || {},
            }));
            setTempRecords(records);
        } else {
            setTempRecords([{ date: new Date().toISOString().slice(0, 10), temps: {} }]);
        }
        setIsTempDialogOpen(true);
    };

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

    const { props } = usePage<PageProps>();
    const roleId = props.auth?.user?.role_id;

    const handleSearch = () => {
        router.get('/orders', {
            search: search || undefined,
            trashed: filters.trashed,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            per_page: perPage,
        });
    };

    const handlePerPageChange = (val: string) => {
        setPerPage(val);
        router.get(
            '/orders',
            {
                search: search || undefined,
                trashed: filters.trashed,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
                per_page: val,
            },
            {
                preserveState: true,
            },
        );
    };

function toLocalISO(dateInput?: string | Date | null): string {
    if (!dateInput) return '';
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${hours}:${minutes}`;
}

function getNowLocalISO(): string {
    return toLocalISO(new Date());
}

    const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
    const [entryDateInput, setEntryDateInput] = useState<string>('');
    const [orderIdToEditEntry, setOrderIdToEditEntry] = useState<number | null>(null);

    const handleAddEntryDate = (id: number) => {
        setOrderIdToEditEntry(id);
        setEntryDateInput(getNowLocalISO());
        setIsEntryDialogOpen(true);
    };

    const handleEditEntryDate = (id: number, currentEntry: string) => {
        setOrderIdToEditEntry(id);
        setEntryDateInput(currentEntry ? toLocalISO(currentEntry) : getNowLocalISO());
        setIsEntryDialogOpen(true);
    };

    const confirmEntryDateUpdate = () => {
        if (!orderIdToEditEntry || !entryDateInput) return;
        router.patch(
            route('orders.update-entry', orderIdToEditEntry),
            {
                entry_date: entryDateInput,
            },
            {
                onSuccess: () => {
                    setIsEntryDialogOpen(false);
                    router.reload({ only: ['orders'] });
                },
            },
        );
    };

    const [isEirDialogOpen, setIsEirDialogOpen] = useState(false);
    const [eirDateInput, setEirDateInput] = useState<string>('');
    const [orderIdToEdit, setOrderIdToEdit] = useState<number | null>(null);

    const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
    const [exitDateInput, setExitDateInput] = useState<string>('');
    const [orderIdToEditExit, setOrderIdToEditExit] = useState<number | null>(null);

    const handleAddExitDate = (id: number) => {
        setOrderIdToEditExit(id);
        setExitDateInput(getNowLocalISO());
        setIsExitDialogOpen(true);
    };

    const handleEditExitDate = (id: number, currentExitDate: string) => {
        setOrderIdToEditExit(id);
        setExitDateInput(currentExitDate ? toLocalISO(currentExitDate) : getNowLocalISO());
        setIsExitDialogOpen(true);
    };

    const confirmExitDateUpdate = () => {
        if (!orderIdToEditExit || !exitDateInput) return;
        router.patch(
            route('orders.update-exit', orderIdToEditExit),
            { exit_date: exitDateInput },
            {
                onSuccess: () => {
                    setIsExitDialogOpen(false);
                },
            },
        );
    };

    const handleAddEirDate = (id: number) => {
        setOrderIdToEdit(id);
        setEirDateInput(getNowLocalISO());
        setIsEirDialogOpen(true);
    };

    const handleEditEirDate = (id: number, currentEirDate: string) => {
        setOrderIdToEdit(id);
        setEirDateInput(currentEirDate ? toLocalISO(currentEirDate) : getNowLocalISO());
        setIsEirDialogOpen(true);
    };

    const confirmEirDateUpdate = () => {
        if (!orderIdToEdit || !eirDateInput) return;
        router.patch(
            route('orders.update-eir', orderIdToEdit),
            { eir_date: eirDateInput },
            {
                onSuccess: () => {
                    setIsEirDialogOpen(false);
                },
            },
        );
    };

    // Fungsi untuk membuka dialog hapus order
    const openDeleteOrderModal = (orderId: number) => {
        setOrderIdToDelete(orderId);
        setDeleteOrderReason('');
        setDeleteOrderModalOpen(true);
    };

    // Fungsi untuk konfirmasi dan eksekusi penghapusan order
    const confirmDeleteOrder = () => {
        if (orderIdToDelete !== null && deleteOrderReason.trim()) {
            router.delete(route('orders.destroy', orderIdToDelete), {
                data: { delete_reason: deleteOrderReason },
                onSuccess: () => {
                    setDeleteOrderModalOpen(false);
                    setOrderIdToDelete(null);
                    setDeleteOrderReason('');
                    // Refresh data setelah hapus
                    router.reload({ only: ['orders'] });
                },
                onError: (errors) => {
                    console.error('Error deleting order:', errors);
                    alert('Gagal menghapus order.');
                    setDeleteOrderModalOpen(false);
                },
            });
        }
    };

    interface SortButtonProps {
        label: string;
        field: string;
        currentSort?: string;
        currentDir?: string;
    }

    const SortButton = ({ label, field, currentSort, currentDir }: SortButtonProps) => {
        const direction = currentSort === field ? (currentDir === 'asc' ? 'desc' : 'asc') : 'asc';
        return (
            <Link
                href={route('orders.index', {
                    sort_by: field,
                    sort_dir: direction,
                    trashed: filters.trashed,
                    search: filters.search,
                    date_from: filters.date_from,
                    date_to: filters.date_to,
                    per_page: perPage,
                })}
                className="flex items-center gap-1 font-semibold text-gray-700 hover:text-black"
            >
                {label}
                {currentSort === field ? (
                    direction === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                    ) : (
                        <ArrowDown className="h-4 w-4" />
                    )
                ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                )}
            </Link>
        );
    };

    const toggleTrashed = () => {
        const newTrashed = !isTrashed;
        setIsTrashed(newTrashed);
        router.get('/orders', {
            trashed: newTrashed ? '1' : undefined,
            search: search || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            per_page: perPage,
        });
    };

    // Kelompokkan data orders berdasarkan `no_aju` jika ada, jika tidak gunakan `order_id`
    const groupKeys: string[] = [];
    const groupedOrders: Record<string, Order[]> = {};
    for (const order of orders.data) {
        const hasAju = Boolean(order.no_aju && order.no_aju.trim() !== '' && order.no_aju !== '-');
        const groupKey = hasAju ? order.no_aju! : (order.order?.order_id ?? order.order_id);
        if (!groupedOrders[groupKey]) {
            groupedOrders[groupKey] = [];
            groupKeys.push(groupKey);
        }
        groupedOrders[groupKey].push(order);
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Order Management" />
            <OrdersLayout>
                <div className="space-y-6">
                    {/* Flash Message */}
                    {props.flash?.success && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{props.flash.success}</div>}
                    {props.flash?.error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{props.flash.error}</div>}
                    {/* Header Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <Heading title="Order List" description="Manage all registered orders and their statuses." />

                        <div className="flex flex-wrap items-center gap-2.5">
                            <Button variant="outline" size="sm" onClick={toggleTrashed} className="text-xs h-9">
                                {isTrashed ? 'Sembunyikan Order Dihapus' : 'Tampilkan Order Dihapus'}
                            </Button>

                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium px-2 py-1 bg-white border border-gray-200 rounded-md shadow-xs h-9">
                                <span className="shrink-0">Tampilkan:</span>
                                <Select value={perPage} onValueChange={handlePerPageChange}>
                                    <SelectTrigger className="h-7 w-[70px] text-xs font-semibold border-0 focus:ring-0 p-1">
                                        <SelectValue placeholder="25" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {roleId != 3 && (
                                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 h-9 text-xs font-semibold">
                                    <Link href="/orders/create">
                                        <Plus className="h-4 w-4" />
                                        Create Order
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Unified Search & Date Filter Card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
                            {/* Input Search */}
                            <div className="relative flex-1 min-w-[240px]">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Cari customer, produk, atau kontainer... (Enter)"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-9 h-9 text-xs"
                                />
                            </div>

                            {/* Modern Date Range Picker */}
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
                                    router.get(
                                        '/orders',
                                        {
                                            search,
                                            date_from: startDate,
                                            date_to: endDate,
                                            trashed: filters.trashed,
                                            per_page: perPage,
                                        },
                                        { preserveState: true, replace: true }
                                    );
                                }}
                                placeholder="Filter rentang tanggal masuk..."
                                className="w-full sm:w-[260px] shrink-0"
                                align="right"
                            />

                            {/* Tombol Aksi Filter & Reset */}
                            <div className="flex items-center gap-2 shrink-0">
                                <Button size="sm" onClick={handleSearch} className="h-9 text-xs px-3.5 bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
                                    <Search className="h-3.5 w-3.5" />
                                    Filter
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setDateFrom('');
                                        setDateTo('');
                                        setSearch('');
                                        router.get('/orders', {
                                            trashed: filters.trashed,
                                            per_page: perPage,
                                        });
                                    }}
                                    className="h-9 text-xs px-3 text-gray-600 hover:text-red-600 gap-1.5"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>


                    {/* Data Table */}
                    <div className="w-full overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <SortButton
                                            label="Nama Customer"
                                            field="customers.name"
                                            currentSort={filters.sort_by}
                                            currentDir={filters.sort_dir}
                                        />
                                    </TableHead>
                                    <TableHead>
                                        <SortButton
                                            label="Produk"
                                            field="products.service_type"
                                            currentSort={filters.sort_by}
                                            currentDir={filters.sort_dir}
                                        />
                                    </TableHead>
                                    <TableHead>
                                        <SortButton
                                            label="Nomor Kontainer"
                                            field="container_number"
                                            currentSort={filters.sort_by}
                                            currentDir={filters.sort_dir}
                                        />
                                    </TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Tanggal Masuk</TableHead>
                                    <TableHead>Tanggal EIR</TableHead>
                                    <TableHead>Tanggal Keluar</TableHead>
                                    <TableHead>Komoditi</TableHead>
                                    <TableHead>Temperatur</TableHead>
                                    <TableHead>Fumigator</TableHead>
                                    {isTrashed && <TableHead>Alasan Dihapus</TableHead>}
                                </TableRow>

                            </TableHeader>
                            <TableBody>
                                {orders.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isTrashed ? 11 : 10} className="py-8 text-center text-sm text-muted-foreground">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    groupKeys.map((groupKey) => {
                                        const groupOrders = groupedOrders[groupKey];
                                        const firstOrder = groupOrders[0];
                                        const isCollapsed = !!collapsedGroups[groupKey];
                                        return (
                                            <Fragment key={groupKey}>
                                                <TableRow
                                                    className="cursor-pointer bg-gray-100 hover:bg-gray-200"
                                                    onClick={() =>
                                                        setCollapsedGroups((prev) => ({
                                                            ...prev,
                                                            [groupKey]: !prev[groupKey],
                                                        }))
                                                    }
                                                >
                                                    <TableCell
                                                        colSpan={isTrashed ? 11 : 10}
                                                        className="py-2.5 px-3 font-semibold"
                                                    >
                                                        <div className="flex items-center justify-between gap-3">
                                                            {/* Left: Order ID, AJU, Exclude badge, AND Action Buttons directly inline */}
                                                            <div className="flex items-center flex-wrap gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="p-1 hover:bg-gray-300/60 rounded text-gray-600 transition-colors"
                                                                >
                                                                    {isCollapsed ? (
                                                                        <ArrowDown className="h-4 w-4" />
                                                                    ) : (
                                                                        <ArrowUp className="h-4 w-4" />
                                                                    )}
                                                                </button>

                                                                {/* Direct Order ID without redundant "Nomor Order:" text */}
                                                                <span className="font-mono font-bold text-sm text-gray-950 tracking-wider bg-white px-2.5 py-0.5 rounded border border-gray-300 shadow-xs">
                                                                    {firstOrder.order?.order_id ?? firstOrder.order_id}
                                                                </span>

                                                                {firstOrder.no_aju && firstOrder.no_aju.trim() !== '' && firstOrder.no_aju !== '-' && (
                                                                    <span className="text-xs text-gray-500 font-medium">
                                                                        AJU: {firstOrder.no_aju}
                                                                    </span>
                                                                )}

                                                                {firstOrder.order?.is_excluded_from_report && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                                                                        Excluded dari Report
                                                                    </span>
                                                                )}

                                                                {/* Action Icons aligned directly with ORD ID */}
                                                                <div className="flex items-center gap-1 ml-1 pl-2 border-l border-gray-300">
                                                                    {isTrashed ? (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                router.post(
                                                                                    route('orders.restore', firstOrder.order.id),
                                                                                    {},
                                                                                    {
                                                                                        onSuccess: () => {
                                                                                            router.get(route('orders.index'), {
                                                                                                trashed: '1',
                                                                                            });
                                                                                        },
                                                                                        preserveScroll: true,
                                                                                    },
                                                                                );
                                                                            }}
                                                                            className="inline-flex items-center gap-1 h-7 text-xs px-2"
                                                                            title="Pulihkan Order"
                                                                        >
                                                                            <RotateCcw className="h-3.5 w-3.5" />
                                                                            Pulihkan
                                                                        </Button>
                                                                    ) : (
                                                                        <>
                                                                            {roleId != 3 && (
                                                                                <>
                                                                                    {/* Action 1: Shortcut Buat Invoice */}
                                                                                    <Link
                                                                                        href={route('invoices.create', {
                                                                                            customer_id: firstOrder.order?.customer?.id ?? firstOrder.customer_id,
                                                                                            order_id: firstOrder.order?.id ?? firstOrder.id,
                                                                                        })}
                                                                                        title="Buat Invoice untuk Order ini"
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                        className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded hover:bg-emerald-100/80 transition-colors"
                                                                                    >
                                                                                        <Receipt className="h-4 w-4" />
                                                                                    </Link>

                                                                                    {/* Action 2: Exclude dari Report */}
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            router.post(
                                                                                                route('orders.toggle-exclude-report', firstOrder.order?.id ?? firstOrder.id),
                                                                                                {},
                                                                                                { preserveScroll: true }
                                                                                            );
                                                                                        }}
                                                                                        title={
                                                                                            firstOrder.order?.is_excluded_from_report
                                                                                                ? 'Order ini di-exclude dari Report. Klik untuk include kembali'
                                                                                                : 'Klik untuk exclude order ini dari Report'
                                                                                        }
                                                                                        className={`p-1.5 rounded transition-colors ${
                                                                                            firstOrder.order?.is_excluded_from_report
                                                                                                ? 'text-amber-600 hover:text-amber-800 bg-amber-100'
                                                                                                : 'text-gray-400 hover:text-amber-600 hover:bg-gray-200'
                                                                                        }`}
                                                                                    >
                                                                                        <EyeOff className="h-4 w-4" />
                                                                                    </button>

                                                                                    {/* Action 3: Cetak Surat Jalan */}
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            openSuratJalanModal(firstOrder);
                                                                                        }}
                                                                                        title="Cetak Surat Jalan (21 x 14 cm)"
                                                                                        className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded hover:bg-indigo-100/80 transition-colors"
                                                                                    >
                                                                                        <Printer className="h-4 w-4" />
                                                                                    </button>

                                                                                    {/* Detail Order */}
                                                                                    <Link
                                                                                        href={route('orders.show', firstOrder.order.id)}
                                                                                        title="Lihat Detail Order"
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                        className="text-gray-600 hover:text-gray-900 p-1.5 rounded hover:bg-gray-200 transition-colors"
                                                                                    >
                                                                                        <Eye className="h-4 w-4" />
                                                                                    </Link>

                                                                                    {/* Edit Order */}
                                                                                    <Link
                                                                                        href={route('orders.edit', firstOrder.order.id)}
                                                                                        title="Edit Order"
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                        className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-100/80 transition-colors"
                                                                                    >
                                                                                        <Pencil className="h-4 w-4" />
                                                                                    </Link>

                                                                                    {/* Delete Order */}
                                                                                    {!isTrashed && (
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                openDeleteOrderModal(firstOrder.order.id);
                                                                                            }}
                                                                                            title="Hapus Order"
                                                                                            className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-100/80 transition-colors"
                                                                                        >
                                                                                            <Trash2 className="h-4 w-4" />
                                                                                        </button>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Right: Container count badge */}
                                                            <div className="text-xs text-gray-500 font-normal shrink-0">
                                                                {groupOrders.length} Kontainer
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                </TableRow>
                                                {!isCollapsed &&
                                                    groupOrders.map((order) => (
                                                        <TableRow key={order.id} className="group">
                                                            <TableCell className="py-3 font-medium">{order.order?.customer?.name ?? '-'}</TableCell>
                                                            <TableCell className="py-3">{order.product?.service_type ?? '-'}</TableCell>
                                                            <TableCell className="py-3">{order.container_number}</TableCell>
                                                            <TableCell className="py-3">{order.price_type ?? '-'}</TableCell>
                                                            <TableCell className="py-3">
                                                                {order.entry_date ? (
                                                                    <button
                                                                        onClick={() => handleEditEntryDate(order.id, order.entry_date ?? '')}
                                                                        className="flex items-center gap-1 hover:underline"
                                                                    >
                                                                        {formatDate(order.entry_date)}
                                                                        <Pencil className="h-4 w-4 text-blue-500" />
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleAddEntryDate(order.id)}
                                                                        className="flex items-center gap-1 hover:underline"
                                                                    >
                                                                        Tambah
                                                                        <Plus className="h-4 w-4 text-green-500" />
                                                                    </button>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="py-3">
                                                                {roleId != 3 && (
                                                                    <>
                                                                        {order.eir_date ? (
                                                                            <button
                                                                                onClick={() => handleEditEirDate(order.id, order.eir_date ?? '')}
                                                                                className="flex items-center gap-1 hover:underline"
                                                                            >
                                                                                {formatDate(order.eir_date)}
                                                                                <Pencil className="h-4 w-4 text-blue-500" />
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() => handleAddEirDate(order.id)}
                                                                                className="flex items-center gap-1 hover:underline"
                                                                            >
                                                                                Tambah
                                                                                <Plus className="h-4 w-4 text-green-500" />
                                                                            </button>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="py-3">
                                                                {roleId != 3 && (
                                                                    <>
                                                                        {order.exit_date ? (
                                                                            <button
                                                                                onClick={() => handleEditExitDate(order.id, order.exit_date ?? '')}
                                                                                className="flex items-center gap-1 hover:underline"
                                                                            >
                                                                                {formatDate(order.exit_date)}
                                                                                <Pencil className="h-4 w-4 text-blue-500" />
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() => handleAddExitDate(order.id)}
                                                                                className="flex items-center gap-1 hover:underline"
                                                                            >
                                                                                Tambah
                                                                                <Plus className="h-4 w-4 text-green-500" />
                                                                            </button>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="py-3">{order.commodity ?? '-'}</TableCell>
                                                            <TableCell className="py-3 text-center">
                                                                {String(order.product?.requires_temperature) === '1' && (
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        onClick={() => handleOpenTempModal(order)}
                                                                        title="Edit Rekam Suhu"
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <Thermometer className="h-4 w-4 cursor-pointer text-orange-500" />
                                                                    </Button>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="py-3">
                                                                {order.order?.fumigasi ? order.order.fumigasi : '-'}
                                                            </TableCell>
                                                        </TableRow>

                                                    ))}
                                            </Fragment>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500 font-medium">
                            Menampilkan <span className="font-semibold text-gray-800">{orders.from || 0}</span> -{' '}
                            <span className="font-semibold text-gray-800">{orders.to || 0}</span> dari{' '}
                            <span className="font-semibold text-gray-800">{orders.total || orders.data.length}</span> order
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-1">
                            {orders.links.map((link, i) =>
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

                {/* AlertDialog untuk Hapus Order Utama */}
                <AlertDialog open={deleteOrderModalOpen} onOpenChange={setDeleteOrderModalOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Order</AlertDialogTitle>
                            <AlertDialogDescription>Masukkan alasan penghapusan order ini (termasuk semua item di dalamnya):</AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-4">
                            <Input
                                placeholder="Alasan penghapusan"
                                value={deleteOrderReason}
                                onChange={(e) => setDeleteOrderReason(e.target.value)}
                                required
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteOrderModalOpen(false)}>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                disabled={!deleteOrderReason.trim()}
                                onClick={confirmDeleteOrder}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Hapus Order
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* AlertDialogs lainnya tetap sama */}
                <AlertDialog open={isEirDialogOpen} onOpenChange={setIsEirDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{eirDateInput ? 'Edit Tanggal EIR' : 'Tambah Tanggal EIR'}</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="space-y-4">
                            <Label htmlFor="eir-date">Tanggal EIR</Label>
                            <DateTimePicker
                                id="eir-date"
                                value={eirDateInput}
                                onChange={(val) => setEirDateInput(val)}
                                withTime={true}
                                placeholder="Pilih tanggal & jam EIR..."
                                className="w-full"
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsEirDialogOpen(false)}>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmEirDateUpdate} className="bg-blue-600 hover:bg-blue-700">
                                Simpan
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{exitDateInput ? 'Edit Tanggal Keluar' : 'Tambah Tanggal Keluar'}</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="space-y-4">
                            <Label htmlFor="exit-date">Tanggal Keluar</Label>
                            <DateTimePicker
                                id="exit-date"
                                value={exitDateInput}
                                onChange={(val) => setExitDateInput(val)}
                                withTime={true}
                                placeholder="Pilih tanggal & jam keluar..."
                                className="w-full"
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsExitDialogOpen(false)}>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmExitDateUpdate} className="bg-blue-600 hover:bg-blue-700">
                                Simpan
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{entryDateInput ? 'Edit Tanggal Masuk' : 'Tambah Tanggal Masuk'}</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="space-y-4">
                            <Label htmlFor="entry-date">Tanggal Masuk</Label>
                            <DateTimePicker
                                id="entry-date"
                                value={entryDateInput}
                                onChange={(val) => setEntryDateInput(val)}
                                withTime={true}
                                placeholder="Pilih tanggal & jam masuk..."
                                className="w-full"
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsEntryDialogOpen(false)}>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmEntryDateUpdate} className="bg-blue-600 hover:bg-blue-700">
                                Simpan
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Dialog open={isTempDialogOpen} onOpenChange={setIsTempDialogOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Rekam Suhu Kontainer</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-2">
                            {tempRecords.map((rec, rIdx) => (
                                <div key={rIdx} className="space-y-2 rounded border p-4">
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

                {/* Modal Cetak Surat Jalan (21 x 14 cm) */}
                <SuratJalanModal
                    isOpen={suratJalanModalOpen}
                    onClose={() => setSuratJalanModalOpen(false)}
                    data={selectedSuratJalan}
                />
            </OrdersLayout>
        </AppLayout>
    );
}
