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
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, EyeOff, Pencil, Plus, Printer, Receipt, RotateCcw, Trash2 } from 'lucide-react';
import SuratJalanModal, { SuratJalanData } from '@/components/surat-jalan-modal';
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

    const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
    const [entryDateInput, setEntryDateInput] = useState<string>('');
    const [orderIdToEditEntry, setOrderIdToEditEntry] = useState<number | null>(null);

    const handleAddEntryDate = (id: number) => {
        setOrderIdToEditEntry(id);
        setEntryDateInput('');
        setIsEntryDialogOpen(true);
    };

    const handleEditEntryDate = (id: number, currentEntry: string) => {
        setOrderIdToEditEntry(id);
        const iso = currentEntry ? new Date(currentEntry).toISOString().slice(0, 16) : '';
        setEntryDateInput(iso);
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
        setExitDateInput('');
        setIsExitDialogOpen(true);
    };

    const handleEditExitDate = (id: number, currentExitDate: string) => {
        setOrderIdToEditExit(id);
        const isoDate = currentExitDate ? new Date(currentExitDate).toISOString().slice(0, 16) : '';
        setExitDateInput(isoDate);
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
        setEirDateInput('');
        setIsEirDialogOpen(true);
    };

    const handleEditEirDate = (id: number, currentEirDate: string) => {
        setOrderIdToEdit(id);
        const isoDate = currentEirDate ? new Date(currentEirDate).toISOString().slice(0, 16) : '';
        setEirDateInput(isoDate);
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
                    <Heading title="Order List" description="Manage all registered orders and their statuses." />

                    {/* Actions Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <Button variant="outline" onClick={toggleTrashed}>
                                {isTrashed ? 'Sembunyikan Order Dihapus' : 'Tampilkan Order Dihapus'}
                            </Button>

                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium pl-2 border-l border-gray-200">
                                <span>Tampilkan:</span>
                                <Select value={perPage} onValueChange={handlePerPageChange}>
                                    <SelectTrigger className="h-9 w-[85px] text-xs font-semibold">
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
                        </div>

                        {roleId != 3 && (
                            <Button asChild>
                                <Link href="/orders/create">+ Create Orders</Link>
                            </Button>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="space-y-2">
                        <Label htmlFor="search">Search</Label>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Input
                                id="search"
                                placeholder="Search by customer, product, or container"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                                className="flex-1"
                            />
                            <Button onClick={handleSearch} className="w-full sm:w-auto">
                                Search
                            </Button>
                        </div>
                    </div>

                    {/* Filter Tanggal */}
                    <div className="space-y-2">
                        <Label>Filter Rentang Tanggal</Label>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="flex-1">
                                <Label htmlFor="date-from" className="text-xs text-gray-500">Dari Tanggal</Label>
                                <Input
                                    id="date-from"
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="date-to" className="text-xs text-gray-500">Sampai Tanggal</Label>
                                <Input
                                    id="date-to"
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <Button onClick={handleSearch} className="sm:w-auto">
                                Filter
                            </Button>
                            <Button
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
                                className="sm:w-auto"
                            >
                                Reset
                            </Button>
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
                                    <TableHead className="text-right">Action</TableHead>
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
                                                        className="flex items-center justify-between py-3 font-semibold"
                                                    >
                                                        <div className="mr-3 flex items-center flex-wrap gap-2">
                                                            <span>
                                                                Nomor Order: {firstOrder.order?.order_id ?? firstOrder.order_id}
                                                                {firstOrder.no_aju && firstOrder.no_aju.trim() !== '' && firstOrder.no_aju !== '-' && (
                                                                    <> / No. AJU: {firstOrder.no_aju}</>
                                                                )}
                                                            </span>

                                                            {firstOrder.order?.is_excluded_from_report && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                                                                    Excluded dari Report
                                                                </span>
                                                            )}
                                                            {isCollapsed ? (
                                                                <ArrowDown className="ml-1 inline h-4 w-4" />
                                                            ) : (
                                                                <ArrowUp className="ml-1 inline h-4 w-4" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2.5">
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
                                                                    className="inline-flex items-center gap-1"
                                                                    title="Pulihkan Order"
                                                                >
                                                                    <RotateCcw className="h-4 w-4" />
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
                                                                                className="text-emerald-600 hover:text-emerald-800 p-1 rounded hover:bg-emerald-50 transition-colors"
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
                                                                                className={`p-1 rounded transition-colors ${
                                                                                    firstOrder.order?.is_excluded_from_report
                                                                                        ? 'text-amber-600 hover:text-amber-800 bg-amber-50'
                                                                                        : 'text-gray-400 hover:text-amber-600 hover:bg-gray-100'
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
                                                                                className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50 transition-colors"
                                                                            >
                                                                                <Printer className="h-4 w-4" />
                                                                            </button>

                                                                            <Link
                                                                                href={route('orders.show', firstOrder.order.id)}
                                                                                title="Lihat Detail Order"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                                                                            >
                                                                                <Eye className="h-4 w-4" />
                                                                            </Link>

                                                                            <Link
                                                                                href={route('orders.edit', firstOrder.order.id)}
                                                                                title="Edit Order"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                                                                            >
                                                                                <Pencil className="h-4 w-4" />
                                                                            </Link>
                                                                        </>
                                                                    )}
                                                                    {!isTrashed && roleId != 3 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                openDeleteOrderModal(firstOrder.order.id);
                                                                            }}
                                                                            title="Hapus Order"
                                                                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
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
                                                            <TableCell className="text-right">
                                                                {!isTrashed && roleId != 3 && (
                                                                    <div className="flex items-center justify-end gap-1.5">
                                                                        <Button
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                openSuratJalanModal(order);
                                                                            }}
                                                                            title="Cetak Surat Jalan Kontainer (21 x 14 cm)"
                                                                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                                                        >
                                                                            <Printer className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button size="icon" variant="ghost" asChild title="Lihat Detail Item">
                                                                            <Link
                                                                                href={route('orders.items.simple.show', order.id)}
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                                                            </Link>
                                                                        </Button>
                                                                    </div>
                                                                )}
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
                            <Input
                                id="eir-date"
                                type="datetime-local"
                                value={eirDateInput}
                                onChange={(e) => setEirDateInput(e.target.value)}
                                required
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
                            <Input
                                id="exit-date"
                                type="datetime-local"
                                value={exitDateInput}
                                onChange={(e) => setExitDateInput(e.target.value)}
                                required
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
                            <Input
                                id="entry-date"
                                type="datetime-local"
                                value={entryDateInput}
                                onChange={(e) => setEntryDateInput(e.target.value)}
                                required
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
                                        <Input
                                            id={`date_${rIdx}`}
                                            type="date"
                                            value={rec.date}
                                            onChange={(e) => updateDate(rIdx, e.target.value)}
                                            className="max-w-[180px]"
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
