import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import OrdersLayout from '@/layouts/orders/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Fragment, useEffect, useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Boxes,
    Check,
    Clock,
    Eye,
    EyeOff,
    Pencil,
    Plus,
    PlusCircle,
    Power,
    Printer,
    Receipt,
    RotateCcw,
    Search,
    Thermometer,
    Trash2,
    X,
    Zap,
} from 'lucide-react';
import SuratJalanModal, { SuratJalanData } from '@/components/surat-jalan-modal';
import { executeTemperaturePrint } from '@/components/temperature-print-modal';
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
        need_invoice?: string;
    };
};
type Customer = {
    id: number;
    name: string;
};
type Product = {
    id: number;
    service_type: string;
    requires_temperature: boolean | number;
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
    start_plug_in?: string | null;
    plug_out?: string | null;
    set_point?: number | string | null;
    plug_duration_minutes?: number | null;
    total_shifts?: number | null;
    price_type: string | null;
    commodity: string | null;
    no_aju: string | null;
    deleted_reason: string | null;
    deleted_at: string | null;
    is_excluded_from_report?: boolean;
    customer: Customer;
    product: Product;
    additional_products?: Array<{
        id: number;
        service_type: string;
        requires_temperature?: number | boolean | null;
    }>;
    has_temperature_service?: boolean;
    order_has_temperature_service?: boolean;
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
            role_name?: string | null;
            role?: {
                id: number;
                name: string;
            };
        };
    };
};
function formatDate(dateStr?: string | null) {
    if (!dateStr) return '-';
    const cleanStr = typeof dateStr === 'string' ? dateStr.replace(' ', 'T') : dateStr;
    const date = new Date(cleanStr);
    if (isNaN(date.getTime())) return '-';
    const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = monthShort[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hour}:${minute}`;
}

function isPlugOrSuhuService(product?: { service_type?: string; requires_temperature?: number | boolean | null } | null): boolean {
    if (!product) return false;
    if (String(product.requires_temperature) === '1' || product.requires_temperature === true) return true;
    const st = (product.service_type || '').toLowerCase();
    return st.includes('plug') || st.includes('suhu') || st.includes('reefer');
}

function canItemRecordTemperature(order: Order, groupOrders?: Order[]): boolean {
    if (order.has_temperature_service || order.order_has_temperature_service) {
        return true;
    }
    if (isPlugOrSuhuService(order.product)) {
        return true;
    }
    const addons = order.additional_products || (order as any).additionalProducts || [];
    if (Array.isArray(addons) && addons.some((ap) => isPlugOrSuhuService(ap))) {
        return true;
    }
    if (order.temperature && Object.keys(order.temperature).length > 0) {
        return true;
    }
    if (order.start_plug_in || order.plug_out) {
        return true;
    }
    if (groupOrders && groupOrders.length > 0) {
        const anyInGroupHasTemp = groupOrders.some((sibling) => {
            if (sibling.has_temperature_service || sibling.order_has_temperature_service) return true;
            if (isPlugOrSuhuService(sibling.product)) return true;
            const sibAddons = sibling.additional_products || (sibling as any).additionalProducts || [];
            if (Array.isArray(sibAddons) && sibAddons.some((ap) => isPlugOrSuhuService(ap))) return true;
            if (sibling.temperature && Object.keys(sibling.temperature).length > 0) return true;
            if (sibling.start_plug_in || sibling.plug_out) return true;
            return false;
        });
        if (anyInGroupHasTemp) {
            return true;
        }
    }
    return false;
}

export default function OrdersIndex({ orders, filters: rawFilters }: Props) {
    const { props } = usePage<PageProps>();
    const roleId = props.auth?.user?.role_id;
    const roleName = props.auth?.user?.role_name || props.auth?.user?.role?.name || '';
    const isSuperAdmin = roleId === 1 || /super/i.test(roleName);
    const isAdmin = roleId === 2 || /admin/i.test(roleName);
    const canManageInvoice = Boolean(isSuperAdmin || isAdmin);

    const filters = rawFilters || {};
    const [search, setSearch] = useState(filters?.search ?? '');
    const [isTrashed, setIsTrashed] = useState(!!filters.trashed);
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters?.date_to ?? '');
    const [perPage, setPerPage] = useState<string>(String(filters?.per_page || orders?.per_page || 25));
    const [needInvoice, setNeedInvoice] = useState(Boolean(canManageInvoice && filters?.need_invoice));

    // Sinkronkan state lokal jika props filter dari server berubah (misal saat kembali dari edit order)
    useEffect(() => {
        setSearch(filters?.search ?? '');
        setIsTrashed(!!filters.trashed);
        setDateFrom(filters?.date_from ?? '');
        setDateTo(filters?.date_to ?? '');
        setPerPage(String(filters?.per_page || orders?.per_page || 25));
        setNeedInvoice(Boolean(canManageInvoice && filters?.need_invoice));
    }, [filters?.search, filters?.trashed, filters?.date_from, filters?.date_to, filters?.per_page, filters?.need_invoice, orders?.per_page, canManageInvoice]);

    // Helper untuk menyimpan URL halaman order saat ini (termasuk filter/search) sebagai parameter return_url
    const getReturnUrlQuery = () => {
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const currentSearch = window.location.search;
            return `?return_url=${encodeURIComponent(currentPath + currentSearch)}`;
        }
        return '';
    };
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

    const [plugStartTime, setPlugStartTime] = useState<string>('');
    const [plugOutTime, setPlugOutTime] = useState<string>('');
    const [tempSetPoint, setTempSetPoint] = useState<string>('');
    const [isSubmittingPlug, setIsSubmittingPlug] = useState(false);

    const handleOpenTempModal = (order: Order) => {
        setTempOrder(order);
        setPlugStartTime(order.start_plug_in ? toLocalISO(order.start_plug_in) : '');
        setPlugOutTime(order.plug_out ? toLocalISO(order.plug_out) : '');
        setTempSetPoint(order.set_point !== null && order.set_point !== undefined ? String(order.set_point) : '');
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

    const handleQuickPlugIn = () => {
        if (!tempOrder) return;
        setIsSubmittingPlug(true);
        router.post(`/orders/item/${tempOrder.id}/plug-in`, {
            set_point: tempSetPoint !== '' ? tempSetPoint : null,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmittingPlug(false);
                setIsTempDialogOpen(false);
                router.reload({ only: ['orders'] });
            },
            onError: () => setIsSubmittingPlug(false),
        });
    };

    const handleQuickPlugOut = () => {
        if (!tempOrder) return;
        setIsSubmittingPlug(true);
        router.post(`/orders/item/${tempOrder.id}/plug-out`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmittingPlug(false);
                setIsTempDialogOpen(false);
                router.reload({ only: ['orders'] });
            },
            onError: () => setIsSubmittingPlug(false),
        });
    };

    const handleSavePlugTimes = () => {
        if (!tempOrder) return;
        setIsSubmittingPlug(true);
        router.post(
            `/orders/item/${tempOrder.id}/plug-times`,
            {
                start_plug_in: plugStartTime ? plugStartTime.replace('T', ' ') : null,
                plug_out: plugOutTime ? plugOutTime.replace('T', ' ') : null,
                set_point: tempSetPoint !== '' ? tempSetPoint : null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmittingPlug(false);
                    setIsTempDialogOpen(false);
                    router.reload({ only: ['orders'] });
                },
                onError: () => setIsSubmittingPlug(false),
            }
        );
    };

    const handleResetPlugTimes = () => {
        if (!tempOrder) return;
        if (!confirm(`Reset status Plug In & Out untuk kontainer ${tempOrder.container_number}? Data waktu dan shift akan dikosongkan.`)) {
            return;
        }
        setIsSubmittingPlug(true);
        router.post(`/orders/item/${tempOrder.id}/plug-reset`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmittingPlug(false);
                setIsTempDialogOpen(false);
                router.reload({ only: ['orders'] });
            },
            onError: () => setIsSubmittingPlug(false),
        });
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

    const handleSearch = () => {
        router.get('/orders', {
            search: search || undefined,
            trashed: filters.trashed,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            per_page: perPage,
            need_invoice: canManageInvoice && needInvoice ? '1' : undefined,
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
                need_invoice: canManageInvoice && needInvoice ? '1' : undefined,
            },
            {
                preserveState: true,
            },
        );
    };

function toLocalISO(dateInput?: string | Date | null): string {
    if (!dateInput) return '';
    if (dateInput instanceof Date) {
        const y = dateInput.getFullYear();
        const m = String(dateInput.getMonth() + 1).padStart(2, '0');
        const day = String(dateInput.getDate()).padStart(2, '0');
        const hours = String(dateInput.getHours()).padStart(2, '0');
        const minutes = String(dateInput.getMinutes()).padStart(2, '0');
        return `${y}-${m}-${day}T${hours}:${minutes}`;
    }
    const str = String(dateInput);
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
    if (match) {
        const date = `${match[1]}-${match[2]}-${match[3]}`;
        const time = match[4] && match[5] ? `${match[4]}:${match[5]}` : '00:00';
        return `${date}T${time}`;
    }
    const d = new Date(str);
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
        if (!orderIdToEditEntry) return;
        router.patch(
            route('orders.update-entry', orderIdToEditEntry),
            {
                entry_date: entryDateInput || null,
            },
            {
                preserveScroll: true,
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
        if (!orderIdToEditExit) return;
        router.patch(
            route('orders.update-exit', orderIdToEditExit),
            { exit_date: exitDateInput || null },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsExitDialogOpen(false);
                    router.reload({ only: ['orders'] });
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
        if (!orderIdToEdit) return;
        router.patch(
            route('orders.update-eir', orderIdToEdit),
            { eir_date: eirDateInput || null },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsEirDialogOpen(false);
                    router.reload({ only: ['orders'] });
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
                    need_invoice: canManageInvoice && filters.need_invoice ? '1' : undefined,
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
            need_invoice: canManageInvoice && needInvoice ? '1' : undefined,
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
                    {/* Header Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Boxes className="h-7 w-7 text-gray-900" />
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Order List</h1>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Manage all registered orders and their statuses.</p>
                        </div>

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

                            {roleId != 3 && roleId != 5 && (
                                <Button size="sm" asChild className="bg-gray-900 hover:bg-black text-white gap-1.5 h-9 text-xs font-semibold">
                                    <Link href={`/orders/create${getReturnUrlQuery()}`}>
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
                                            need_invoice: canManageInvoice && needInvoice ? '1' : undefined,
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
                                {canManageInvoice && (
                                    <Button
                                        size="sm"
                                        variant={needInvoice ? 'default' : 'outline'}
                                        onClick={() => {
                                            const next = !needInvoice;
                                            setNeedInvoice(next);
                                            router.get('/orders', {
                                                search: search || undefined,
                                                trashed: filters.trashed,
                                                date_from: dateFrom || undefined,
                                                date_to: dateTo || undefined,
                                                per_page: perPage,
                                                need_invoice: next ? '1' : undefined,
                                            });
                                        }}
                                        className={`h-9 text-xs px-3 gap-1.5 font-semibold transition-colors ${
                                            needInvoice
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-2xs'
                                                : 'text-blue-700 hover:bg-blue-50 border-blue-200'
                                        }`}
                                        title="Filter order yang kontainernya sudah Gate In & Gate Out dan belum dibuatkan invoice"
                                    >
                                        <Receipt className="h-3.5 w-3.5" />
                                        <span>Perlu Diinvoicekan</span>
                                    </Button>
                                )}
                                <Button size="sm" onClick={handleSearch} className="h-9 text-xs px-3.5 bg-gray-900 hover:bg-black text-white gap-1.5">
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
                                        setNeedInvoice(false);
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

                    {/* Active Filter Banner when needInvoice is active */}
                    {canManageInvoice && needInvoice && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-blue-50 border border-blue-200 p-4 text-xs text-blue-900 shadow-xs">
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse shrink-0"></span>
                                <div>
                                    <span className="font-bold">Filter Aktif: Order Perlu Diinvoicekan</span>
                                    <span className="text-blue-700 ml-1.5">
                                        Menampilkan kontainer yang sudah ada <strong>Gate In</strong> dan <strong>Gate Out</strong> serta belum dibuatkan invoice.
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setNeedInvoice(false);
                                    router.get('/orders', {
                                        search: search || undefined,
                                        trashed: filters.trashed,
                                        date_from: dateFrom || undefined,
                                        date_to: dateTo || undefined,
                                        per_page: perPage,
                                    });
                                }}
                                className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900 underline shrink-0 cursor-pointer"
                            >
                                <X className="h-3.5 w-3.5" />
                                Tampilkan Semua Order
                            </button>
                        </div>
                    )}

                    {/* Data Table */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50/75">
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
                                                                <span className="font-bold text-sm text-gray-950 bg-white px-2.5 py-0.5 rounded border border-gray-300 shadow-xs">
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
                                                                            {roleId != 3 && roleId != 5 && (
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
                                                                                        href={`${route('orders.show', firstOrder.order.id)}${getReturnUrlQuery()}`}
                                                                                        title="Lihat Detail Order"
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                        className="text-gray-600 hover:text-gray-900 p-1.5 rounded hover:bg-gray-200 transition-colors"
                                                                                    >
                                                                                        <Eye className="h-4 w-4" />
                                                                                    </Link>

                                                                                    {/* Edit Order */}
                                                                                    <Link
                                                                                        href={`${route('orders.edit', firstOrder.order.id)}${getReturnUrlQuery()}`}
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
                                                            </TableCell>
                                                            <TableCell className="py-3">
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
                                                            </TableCell>
                                                            <TableCell className="py-3">{order.commodity ?? '-'}</TableCell>
                                                            <TableCell className="py-3 text-center">
                                                                {canItemRecordTemperature(order, groupOrders) ? (
                                                                    <div className="flex flex-col items-center justify-center gap-1">
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() => handleOpenTempModal(order)}
                                                                            title="Input Suhu & Plug In/Out"
                                                                            className="h-8 px-2 flex items-center gap-1 cursor-pointer text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-medium"
                                                                        >
                                                                            <Thermometer className="h-4 w-4" />
                                                                            <span className="text-xs">Suhu</span>
                                                                        </Button>
                                                                        {order.start_plug_in && !order.plug_out && (
                                                                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-[10px] px-1.5 py-0 flex items-center gap-1 animate-pulse">
                                                                                <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                                                Plug In ({order.total_shifts && order.total_shifts > 0 ? order.total_shifts : 1} Shift)
                                                                            </Badge>
                                                                        )}
                                                                        {order.plug_out && (
                                                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-[10px] px-1.5 py-0 flex items-center gap-1">
                                                                                <Zap className="h-3 w-3 text-emerald-600" />
                                                                                {order.total_shifts && order.total_shifts > 0 ? order.total_shifts : 1} Shift
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-300 text-xs">-</span>
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

                {/* Dialogs untuk EIR, Keluar, dan Masuk */}
                <Dialog open={isEirDialogOpen} onOpenChange={setIsEirDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{eirDateInput ? 'Edit Tanggal EIR' : 'Tambah Tanggal EIR'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <Label htmlFor="eir-date">Tanggal EIR</Label>
                            <DateTimePicker
                                id="eir-date"
                                value={eirDateInput}
                                onChange={(val) => setEirDateInput(val)}
                                withTime={true}
                                inModal={true}
                                placeholder="Pilih tanggal & jam EIR..."
                                className="w-full"
                            />
                        </div>
                        <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
                            <Button variant="outline" type="button" onClick={() => setIsEirDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="button" onClick={confirmEirDateUpdate} className="bg-gray-900 hover:bg-black text-white">
                                Simpan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{exitDateInput ? 'Edit Tanggal Keluar' : 'Tambah Tanggal Keluar'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <Label htmlFor="exit-date">Tanggal Keluar</Label>
                            <DateTimePicker
                                id="exit-date"
                                value={exitDateInput}
                                onChange={(val) => setExitDateInput(val)}
                                withTime={true}
                                inModal={true}
                                placeholder="Pilih tanggal & jam keluar..."
                                className="w-full"
                            />
                        </div>
                        <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
                            <Button variant="outline" type="button" onClick={() => setIsExitDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="button" onClick={confirmExitDateUpdate} className="bg-gray-900 hover:bg-black text-white">
                                Simpan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{entryDateInput ? 'Edit Tanggal Masuk' : 'Tambah Tanggal Masuk'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <Label htmlFor="entry-date">Tanggal Masuk</Label>
                            <DateTimePicker
                                id="entry-date"
                                value={entryDateInput}
                                onChange={(val) => setEntryDateInput(val)}
                                withTime={true}
                                inModal={true}
                                placeholder="Pilih tanggal & jam masuk..."
                                className="w-full"
                            />
                        </div>
                        <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
                            <Button variant="outline" type="button" onClick={() => setIsEntryDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="button" onClick={confirmEntryDateUpdate} className="bg-gray-900 hover:bg-black text-white">
                                Simpan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isTempDialogOpen} onOpenChange={setIsTempDialogOpen}>
                    <DialogContent className="max-w-3xl w-[95vw] sm:w-full p-4 sm:p-6 max-h-[92vh] flex flex-col">
                        <DialogHeader className="pr-8 text-left shrink-0">
                            <DialogTitle className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-900 break-words">
                                <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 shrink-0" />
                                <span className="leading-tight">Rekam Suhu & Plug In/Out &mdash; Kontainer {tempOrder?.container_number}</span>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 space-y-5 overflow-y-auto pr-1 sm:pr-2">
                            {/* Section Plug In / Out */}
                            <div className="rounded-xl border border-gray-200 bg-slate-50/70 p-3 sm:p-4 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 fill-amber-500 shrink-0" />
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-bold text-gray-900">Status Plug In / Out</h4>
                                            <p className="text-[11px] sm:text-xs text-gray-500">Pencatatan daya listrik kontainer reefer & penagihan shift</p>
                                        </div>
                                    </div>
                                    <div>
                                        {!tempOrder?.start_plug_in ? (
                                            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs px-2.5 py-0.5">
                                                Belum Plug In
                                            </Badge>
                                        ) : !tempOrder?.plug_out ? (
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs px-2.5 py-0.5 flex items-center gap-1.5 font-bold">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                                                </span>
                                                Sedang Plug In (Aktif)
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs px-2.5 py-0.5 font-bold">
                                                Selesai ({tempOrder.total_shifts ?? 0} Shift)
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Action Buttons */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {!tempOrder?.start_plug_in ? (
                                        <Button
                                            type="button"
                                            onClick={handleQuickPlugIn}
                                            disabled={isSubmittingPlug}
                                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 gap-1.5 font-semibold"
                                        >
                                            <Zap className="h-4 w-4" />
                                            Catat Plug In Sekarang (Real-Time)
                                        </Button>
                                    ) : !tempOrder?.plug_out ? (
                                        <Button
                                            type="button"
                                            onClick={handleQuickPlugOut}
                                            disabled={isSubmittingPlug}
                                            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white text-xs h-9 gap-1.5 font-semibold"
                                        >
                                            <Power className="h-4 w-4" />
                                            Catat Plug Out Sekarang (Real-Time)
                                        </Button>
                                    ) : (
                                        <div className="w-full sm:w-auto text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
                                            Total durasi: <strong className="text-gray-900">{Math.floor((tempOrder.plug_duration_minutes ?? 0) / 60)} Jam {(tempOrder.plug_duration_minutes ?? 0) % 60} Menit</strong> ({tempOrder.total_shifts} Shift)
                                        </div>
                                    )}
                                </div>

                                {/* Manual Datetime adjustment */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <Label htmlFor="plug_set_point_input" className="text-xs font-semibold text-gray-700">
                                            Set Point Suhu (&deg;C)
                                        </Label>
                                        <Input
                                            id="plug_set_point_input"
                                            type="number"
                                            step="0.1"
                                            value={tempSetPoint}
                                            onChange={(e) => setTempSetPoint(e.target.value)}
                                            placeholder="Contoh: -18 atau 4.5"
                                            className="w-full bg-white text-xs h-9 font-medium"
                                        />
                                        <p className="text-[11px] text-gray-500">
                                            Target acuan suhu kontainer yang diminta (bisa bernilai minus, contoh: -18).
                                        </p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="plug_start_input" className="text-xs font-semibold text-gray-700">
                                                Waktu Start Plug In
                                            </Label>
                                            <button
                                                type="button"
                                                onClick={() => setPlugStartTime(getNowLocalISO())}
                                                className="text-[11px] text-blue-600 underline font-medium hover:text-blue-800"
                                            >
                                                Set Sekarang
                                            </button>
                                        </div>
                                        <DateTimePicker
                                            id="plug_start_input"
                                            value={plugStartTime}
                                            onChange={(val) => setPlugStartTime(val)}
                                            withTime={true}
                                            inModal={true}
                                            placeholder="Pilih tanggal & jam plug in..."
                                            className="w-full bg-white"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="plug_out_input" className="text-xs font-semibold text-gray-700">
                                                Waktu Plug Out
                                            </Label>
                                            <button
                                                type="button"
                                                onClick={() => setPlugOutTime(getNowLocalISO())}
                                                className="text-[11px] text-blue-600 underline font-medium hover:text-blue-800"
                                            >
                                                Set Sekarang
                                            </button>
                                        </div>
                                        <DateTimePicker
                                            id="plug_out_input"
                                            value={plugOutTime}
                                            onChange={(val) => setPlugOutTime(val)}
                                            withTime={true}
                                            inModal={true}
                                            placeholder="Pilih tanggal & jam plug out..."
                                            className="w-full bg-white"
                                        />
                                        <p className="text-[11px] text-gray-500 italic">
                                            Kosongkan jika kontainer masih menyala / belum dicabut.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
                                    <div>
                                        {tempOrder?.start_plug_in && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleResetPlugTimes}
                                                disabled={isSubmittingPlug}
                                                className="w-full sm:w-auto h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                                            >
                                                Reset Status Plug
                                            </Button>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleSavePlugTimes}
                                        disabled={isSubmittingPlug}
                                        className="w-full sm:w-auto h-8 text-xs bg-gray-900 hover:bg-black text-white font-medium"
                                    >
                                        {isSubmittingPlug ? 'Menyimpan...' : 'Simpan Waktu Plug'}
                                    </Button>
                                </div>
                            </div>

                            {/* Section Rekam Suhu Per Jam */}
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                                    <div className="flex items-center gap-2">
                                        <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 shrink-0" />
                                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">Rekam Suhu Per Jam</h4>
                                    </div>
                                    <Button type="button" size="sm" variant="outline" onClick={addDateRecord} className="flex items-center gap-1.5 h-7 sm:h-8 text-xs">
                                        <PlusCircle className="h-3.5 w-3.5" /> Tambah Tanggal
                                    </Button>
                                </div>

                                {tempRecords.map((rec, rIdx) => (
                                    <div key={rIdx} className="space-y-2 rounded-lg border p-3 sm:p-4 bg-white shadow-2xs">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Label htmlFor={`date_${rIdx}`} className="text-xs font-semibold text-gray-700 shrink-0">Tanggal:</Label>
                                            <DateTimePicker
                                                id={`date_${rIdx}`}
                                                value={rec.date}
                                                onChange={(val) => updateDate(rIdx, val)}
                                                withTime={false}
                                                inModal={true}
                                                placeholder="Pilih tanggal..."
                                                className="w-44 max-w-full"
                                            />
                                            {tempRecords.length > 1 && (
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="destructive"
                                                    className="ml-auto h-8 w-8"
                                                    onClick={() => removeDateRecord(rIdx)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid max-h-60 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 overflow-y-auto pt-1">
                                            {[...Array(24)].map((_, h) => (
                                                <div key={h} className="flex items-center gap-1.5 bg-gray-50/70 p-1 rounded border border-gray-100">
                                                    <Label htmlFor={`temp_${rIdx}_${h}`} className="text-xs text-gray-600 w-11 shrink-0 font-mono">{h.toString().padStart(2, '0')}:00</Label>
                                                    <Input
                                                        id={`temp_${rIdx}_${h}`}
                                                        type="number"
                                                        step="0.1"
                                                        value={rec.temps[h.toString().padStart(2, '0')] || ''}
                                                        onChange={(e) => updateTemp(rIdx, h, e.target.value)}
                                                        className="flex-1 min-w-0 h-8 text-xs bg-white text-center"
                                                        placeholder="°C"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <DialogFooter className="gap-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between sm:justify-between pt-3 border-t shrink-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (!tempOrder) return;
                                    executeTemperaturePrint({
                                        container_number: tempOrder.container_number,
                                        commodity: tempOrder.commodity,
                                        order_id: tempOrder.order_id,
                                        no_aju: tempOrder.no_aju,
                                        customer_name: tempOrder.order?.customer?.name || tempOrder.customer?.name,
                                        shipper_name: tempOrder.order?.shipper?.name || tempOrder.shipper?.name,
                                        service_type: tempOrder.product?.service_type,
                                        entry_date: tempOrder.entry_date,
                                        exit_date: tempOrder.exit_date,
                                        start_plug_in: plugStartTime ? plugStartTime.replace('T', ' ') : tempOrder.start_plug_in,
                                        plug_out: plugOutTime ? plugOutTime.replace('T', ' ') : tempOrder.plug_out,
                                        set_point: tempSetPoint || tempOrder.set_point,
                                        plug_duration_minutes: tempOrder.plug_duration_minutes,
                                        total_shifts: tempOrder.total_shifts,
                                        price_type: tempOrder.price_type,
                                        rekam_suhu: tempRecords.map((r) => ({
                                            tanggal: r.date,
                                            jam_data: r.temps,
                                        })),
                                        order: {
                                            order_id: tempOrder.order_id,
                                            no_aju: tempOrder.no_aju,
                                            customer: tempOrder.customer,
                                            shipper: tempOrder.shipper,
                                        },
                                        product: tempOrder.product,
                                    });
                                }}
                                className="w-full sm:w-auto h-9 text-xs text-gray-700 hover:text-black gap-1.5 border-gray-300"
                            >
                                <Printer className="h-3.5 w-3.5" />
                                Cetak PDF Lembar Suhu
                            </Button>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Button variant="outline" onClick={() => setIsTempDialogOpen(false)} className="flex-1 sm:flex-initial h-9 text-xs">
                                    Tutup
                                </Button>
                                <Button onClick={handleSaveTemp} className="flex-1 sm:flex-initial h-9 text-xs bg-orange-600 hover:bg-orange-700 text-white font-medium">
                                    Simpan Rekam Suhu
                                </Button>
                            </div>
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
