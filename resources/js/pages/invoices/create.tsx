import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import DateTimePicker from '@/components/date-time-picker';
import AppLayout from '@/layouts/app-layout';
import InvoicesLayout from '@/layouts/invoices/layout';
import { terbilang } from '@/lib/terbilang';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Layers,
    Percent,
    Plus,
    Tag,
    User,
    X,
    RotateCcw,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

// ==== Types ====
interface Product {
    id: number;
    service_type: string;
}

interface AdditionalProductPivot {
    id: number;
    service_type: string;
    pivot: {
        price_value: number;
    };
}

interface OrderItem {
    id: number;
    container_number: string;
    price_value: number;
    entry_date?: string | null;
    exit_date?: string | null;
    product_id: number;
    product?: Product;
    additional_products?: AdditionalProductPivot[];
}

interface Order {
    id: number;
    order_id: string;
    container_number?: string;
    price_value?: number;
    entry_date?: string | null;
    exit_date?: string | null;
    order_items: OrderItem[];
}

interface Customer {
    id: number;
    name: string;
    orders: Order[];
}

interface ReuseInvoiceInfo {
    id: number;
    invoice_number: string;
    customer_id?: number;
    customer_name?: string;
    order_id?: number;
    period_start?: string;
    period_end?: string;
}

interface PageProps {
    [k: string]: unknown;
    customers: Customer[];
    invoice_number?: string;
    reuse_invoice?: ReuseInvoiceInfo | null;
}

type AxiosErrorResponse = {
    response?: {
        status?: number;
        data?: {
            errors?: Record<string, string[]>;
        };
    };
};

export default function CreateInvoice() {
    const page = usePage<PageProps>();
    const { customers = [], invoice_number, reuse_invoice } = page.props;

    // State form dasar
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const [periodStart, setPeriodStart] = useState(() => {
        return reuse_invoice?.period_start || today.toISOString().split('T')[0];
    });
    const [periodEnd, setPeriodEnd] = useState(() => {
        return reuse_invoice?.period_end || nextWeek.toISOString().split('T')[0];
    });
    const [showPeriod, setShowPeriod] = useState(true);

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const urlCustomerId = urlParams?.get('customer_id');
    const urlOrderId = urlParams?.get('order_id');

    const [selectedCustomerId, setSelectedCustomerId] = useState<string>(() => {
        return reuse_invoice?.customer_id ? reuse_invoice.customer_id.toString() : (urlCustomerId || '');
    });
    const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
        return reuse_invoice?.order_id ? reuse_invoice.order_id.toString() : (urlOrderId || '');
    });
    const [selectedContainers, setSelectedContainers] = useState<Set<number>>(new Set());
    const [disabledOrders, setDisabledOrders] = useState<Set<number>>(new Set());

    // Diskon & Materai
    const [showDiscountInput, setShowDiscountInput] = useState(false);
    const [discount, setDiscount] = useState<number>(0);
    const [applyMaterai, setApplyMaterai] = useState(false);

    // Quantity Additional Products: key `${order_item_id}:${additional_product_id}`
    const [addQty, setAddQty] = useState<Record<string, number>>({});

    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);

    // Helper Rupiah
    const formatRupiah = (n: number) => {
        const num = Number(n) || 0;
        return `Rp ${num.toLocaleString('id-ID')}`;
    };

    // Helper format datetime
    const formatDateTime = (d?: string | null) => {
        if (!d) return '-';
        try {
            const date = new Date(d);
            return `${date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
        } catch {
            return '-';
        }
    };

    // Customer yang sedang dipilih
    const selectedCustomer = useMemo(() => {
        return customers.find((c) => c.id.toString() === selectedCustomerId);
    }, [customers, selectedCustomerId]);

    // Daftar order dari customer yang dipilih
    const orders = useMemo(() => {
        return selectedCustomer?.orders || [];
    }, [selectedCustomer]);

    // Order yang sedang dipilih
    const selectedOrder = useMemo(() => {
        return orders.find((o) => o.id.toString() === selectedOrderId);
    }, [orders, selectedOrderId]);

    // Opsi dropdown Customer
    const customerOptions = useMemo(() => {
        return customers.map((c) => ({
            value: c.id.toString(),
            label: c.name,
            subLabel: `${c.orders?.length || 0} order`,
        }));
    }, [customers]);

    // Opsi dropdown Order
    const orderOptions = useMemo(() => {
        return orders.map((o) => {
            const containers = o.order_items?.map((it) => it.container_number).filter(Boolean).join(', ');
            return {
                value: o.id.toString(),
                label: `Order #${o.order_id}`,
                subLabel: containers ? `Kontainer: ${containers}` : `${o.order_items?.length || 0} item`,
            };
        });
    }, [orders]);

    // Handle Customer Change
    const handleCustomerChange = (val: string) => {
        setSelectedCustomerId(val);
        setSelectedOrderId('');
        setSelectedContainers(new Set());
        setAddQty({});
        setErrors({});
    };

    // Handle Order Change
    const handleOrderChange = (val: string) => {
        setSelectedOrderId(val);
        const order = orders.find((o) => o.id.toString() === val);
        if (order) {
            // Pilih semua kontainer yang tidak disabled
            const validIds = new Set<number>();
            const initialQtys: Record<string, number> = {};

            order.order_items?.forEach((item) => {
                if (!disabledOrders.has(item.id)) {
                    validIds.add(item.id);
                }
                item.additional_products?.forEach((ap) => {
                    initialQtys[`${item.id}:${ap.id}`] = 1;
                });
            });

            setSelectedContainers(validIds);
            setAddQty((prev) => ({ ...initialQtys, ...prev }));
        } else {
            setSelectedContainers(new Set());
        }
        setErrors({});
    };

    // Inisialisasi awal kontainer jika selectedOrderId terisi (dari reuse atau shortcut URL)
    useEffect(() => {
        if (selectedOrderId && selectedCustomerId) {
            const customer = customers.find((c) => c.id.toString() === selectedCustomerId);
            const order = customer?.orders?.find((o) => o.id.toString() === selectedOrderId);
            if (order) {
                const validIds = new Set<number>();
                const initialQtys: Record<string, number> = {};

                order.order_items?.forEach((item) => {
                    validIds.add(item.id);
                    item.additional_products?.forEach((ap) => {
                        initialQtys[`${item.id}:${ap.id}`] = 1;
                    });
                });

                setSelectedContainers(validIds);
                setAddQty((prev) => ({ ...initialQtys, ...prev }));
            }
        }
    }, [selectedOrderId, selectedCustomerId, customers]);

    // Check Unavailable Order Items saat customer atau periode berubah
    useEffect(() => {
        if (!selectedCustomerId || !periodStart || !periodEnd) {
            setDisabledOrders(new Set());
            return;
        }

        const url = `/orders/unavailable?customer_id=${selectedCustomerId}&period_start=${periodStart}&period_end=${periodEnd}`;

        fetch(url)
            .then((r) => r.json())
            .then((ids: number[]) => {
                const disabledSet = new Set(ids);
                setDisabledOrders(disabledSet);
                // Lepas pilihan jika kontainer ternyata disabled
                setSelectedContainers((prev) => {
                    const copy = new Set([...prev].filter((id) => !disabledSet.has(id)));
                    return copy;
                });
            })
            .catch(console.error);
    }, [selectedCustomerId, periodStart, periodEnd]);

    // Toggle container check
    const toggleContainer = (itemId: number) => {
        if (disabledOrders.has(itemId)) return;
        setSelectedContainers((prev) => {
            const next = new Set(prev);
            if (next.has(itemId)) {
                next.delete(itemId);
            } else {
                next.add(itemId);
            }
            return next;
        });
    };

    // Pilih / Lepas Semua Kontainer
    const toggleSelectAllContainers = () => {
        if (!selectedOrder) return;
        const availableItems = (selectedOrder.order_items || []).filter((it) => !disabledOrders.has(it.id));
        if (selectedContainers.size === availableItems.length) {
            setSelectedContainers(new Set());
        } else {
            setSelectedContainers(new Set(availableItems.map((it) => it.id)));
        }
    };

    // Manage qty
    const getQty = (itemId: number, prodId: number) => addQty[`${itemId}:${prodId}`] ?? 1;
    const updateQty = (itemId: number, prodId: number, val: number) => {
        const v = Math.max(0, Math.floor(val || 0));
        setAddQty((prev) => ({ ...prev, [`${itemId}:${prodId}`]: v }));
    };

    // Hitung Finansial (Realtime)
    const calculations = useMemo(() => {
        let subtotal = 0;

        if (selectedOrder) {
            selectedOrder.order_items?.forEach((item) => {
                if (selectedContainers.has(item.id)) {
                    // Harga pokok kontainer
                    subtotal += Number(item.price_value || 0);

                    // Layanan tambahan
                    item.additional_products?.forEach((ap) => {
                        const price = Number(ap.pivot?.price_value || 0);
                        const qty = getQty(item.id, ap.id);
                        subtotal += price * qty;
                    });
                }
            });
        }

        const safeDiscount = Math.min(subtotal, Math.max(0, Number(discount) || 0));
        const afterDiscount = Math.max(0, subtotal - safeDiscount);
        const isUnder5Juta = afterDiscount < 5000000;
        const effectiveMaterai = isUnder5Juta ? false : applyMaterai;
        const materaiVal = effectiveMaterai ? 10000 : 0;
        const ppn = Math.round(afterDiscount * 0.11);
        const grandTotal = afterDiscount + ppn + materaiVal;
        const liveTerbilang = terbilang(grandTotal);

        return {
            subtotal,
            discount: safeDiscount,
            afterDiscount,
            ppn,
            materai: materaiVal,
            grandTotal,
            terbilang: liveTerbilang,
            isUnder5Juta,
        };
    }, [selectedOrder, selectedContainers, discount, applyMaterai, addQty]);

    // Otomatis uncheck materai jika tagihan under 5jt
    useEffect(() => {
        if (calculations.isUnder5Juta) {
            setApplyMaterai(false);
        } else if (!calculations.isUnder5Juta && calculations.subtotal > 0) {
            setApplyMaterai(true);
        }
    }, [calculations.isUnder5Juta]);

    // Handle Submit / Preview
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCustomerId) {
            setErrors({ customer_id: ['Pilih customer terlebih dahulu.'] });
            return;
        }

        if (!selectedOrderId) {
            setErrors({ order_id: ['Pilih nomor order/AJU terlebih dahulu.'] });
            return;
        }

        if (selectedContainers.size === 0) {
            setGeneralError('Pilih minimal satu kontainer untuk membuat invoice.');
            return;
        }

        // Susun daftar additional products
        const additionalSelections =
            selectedOrder?.order_items
                ?.filter((it) => selectedContainers.has(it.id))
                .flatMap((it) =>
                    (it.additional_products ?? []).map((ap) => ({
                        order_item_id: it.id,
                        additional_product_id: ap.id,
                        quantity: getQty(it.id, ap.id),
                    })),
                ) ?? [];

        const payload = {
            reuse_id: reuse_invoice?.id || null,
            customer_id: selectedCustomerId,
            invoice_number: invoice_number || '',
            order_id: selectedOrderId,
            order_ids: [selectedOrderId],
            order_item_ids: Array.from(selectedContainers),
            period_start: periodStart,
            period_end: periodEnd,
            show_period: showPeriod,
            subtotal: calculations.subtotal,
            discount: calculations.discount,
            ppn: calculations.ppn,
            materai: calculations.materai,
            grand_total: calculations.grandTotal,
            terbilang: calculations.terbilang,
            applyMaterai,
            additional_product_quantities: additionalSelections,
        };

        try {
            await router.post('/invoices/preview', payload);
        } catch (err: unknown) {
            const error = err as AxiosErrorResponse;
            if (error.response?.status === 422) {
                setErrors(error.response.data?.errors ?? {});
                setGeneralError('Validasi gagal. Mohon periksa kembali data yang dimasukkan.');
            } else {
                setGeneralError('Terjadi kesalahan sistem saat memproses invoice. Silakan coba kembali.');
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={reuse_invoice ? `Reuse Invoice - ${reuse_invoice.invoice_number}` : 'Buat Invoice Baru'} />
            <InvoicesLayout>
                <div className="mx-auto max-w-5xl space-y-6 pb-12">
                    {/* Header */}
                    <div>
                        <Heading
                            title={reuse_invoice ? `Reuse Invoice: ${reuse_invoice.invoice_number}` : 'Buat Invoice Baru'}
                            description={
                                reuse_invoice
                                    ? 'Gunakan kembali nomor invoice yang telah dihapus dengan memilih Customer, Order/AJU baru, dan rincian produk yang disesuaikan.'
                                    : 'Pilih customer, nomor order/AJU, dan kontainer untuk menerbitkan invoice baru.'
                            }
                        />
                    </div>

                    {/* Banner Pemberitahuan Mode Reuse */}
                    {reuse_invoice && (
                        <div className="flex items-start justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-amber-900 shadow-xs">
                            <div className="flex items-start gap-3">
                                <RotateCcw className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                                <div className="text-sm">
                                    <div className="flex items-center gap-2">
                                        <strong className="font-semibold text-amber-950">
                                            Mode Reuse Nomor Invoice: {reuse_invoice.invoice_number}
                                        </strong>
                                        <span className="rounded bg-amber-200/80 px-2 py-0.5 text-xs font-bold text-amber-900 border border-amber-300">
                                            REUSE
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                                        Nomor invoice ini akan digunakan kembali dari invoice yang dihapus. Anda dapat bebas{' '}
                                        <strong>mengganti Customer</strong>, <strong>memilih Nomor Order / AJU</strong> yang
                                        baru, serta menyesuaikan kontainer, produk tambahan, dan diskon. Seluruh isian
                                        dapat berbeda kecuali nomor invoice-nya.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/invoices/create"
                                className="shrink-0 text-xs font-semibold text-amber-800 underline hover:text-amber-950 px-2.5 py-1.5 rounded hover:bg-amber-100 transition-colors"
                            >
                                Batal Reuse
                            </Link>
                        </div>
                    )}

                    {/* Alert Errors */}
                    {generalError && (
                        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-xs">
                            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                            <div className="flex-1">
                                <strong className="font-semibold">Perhatian:</strong>
                                <p className="mt-0.5 text-xs text-red-700">{generalError}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setGeneralError(null)}
                                className="text-red-400 hover:text-red-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-xs">
                            <div className="flex items-center gap-2 font-semibold">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <span>Periksa kembali form berikut:</span>
                            </div>
                            <ul className="mt-2 list-disc pl-6 space-y-1 text-xs text-red-700">
                                {Object.entries(errors).map(([field, msgs]) =>
                                    msgs.map((m, i) => <li key={`${field}-${i}`}>{m}</li>),
                                )}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section 1: Informasi Header & Pemilihan Customer/Order */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-5">
                            <div className="flex items-center gap-2 border-b pb-3">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <h2 className="text-base font-bold text-gray-900">Informasi Pelanggan & Order</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Nomor Invoice */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="invoice_number" className="text-xs font-semibold text-gray-700">
                                            Nomor Invoice (Preview)
                                        </Label>
                                        {reuse_invoice && (
                                            <span className="inline-flex items-center rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-300">
                                                REUSE
                                            </span>
                                        )}
                                    </div>
                                    <Input
                                        id="invoice_number"
                                        value={invoice_number || 'Otomatis di-generate saat simpan'}
                                        readOnly
                                        className={`font-mono text-xs font-medium ${
                                            reuse_invoice
                                                ? 'bg-amber-50/70 border-amber-300 text-amber-950 font-bold'
                                                : 'bg-gray-50/80 text-gray-600'
                                        }`}
                                    />
                                    <p className="text-[11px] text-gray-400">
                                        {reuse_invoice
                                            ? `Menggunakan kembali nomor invoice ${reuse_invoice.invoice_number} dari invoice yang dihapus.`
                                            : 'Nomor invoice otomatis tersusun saat disimpan ke database.'}
                                    </p>
                                </div>

                                {/* Pilih Customer */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700">
                                        Customer <span className="text-red-500">*</span>
                                    </Label>
                                    <SearchableSelect
                                        options={customerOptions}
                                        value={selectedCustomerId}
                                        onChange={handleCustomerChange}
                                        placeholder="Pilih atau cari Customer..."
                                        searchPlaceholder="Ketik nama customer..."
                                        showClear
                                    />
                                </div>
                            </div>

                            {/* Nomor Order / AJU */}
                            <div className="space-y-1.5 pt-2">
                                <Label className="text-xs font-semibold text-gray-700">
                                    Nomor Order / AJU <span className="text-red-500">*</span>
                                </Label>
                                {selectedCustomerId ? (
                                    orders.length > 0 ? (
                                        <SearchableSelect
                                            options={orderOptions}
                                            value={selectedOrderId}
                                            onChange={handleOrderChange}
                                            placeholder="Pilih Nomor Order / AJU..."
                                            searchPlaceholder="Cari nomor order atau kontainer..."
                                            showClear
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                                            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                                            <span>Belum ada order aktif untuk customer ini.</span>
                                        </div>
                                    )
                                ) : (
                                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-400">
                                        <User className="h-4 w-4 shrink-0 text-gray-300" />
                                        <span>Pilih customer terlebih dahulu untuk memuat daftar order.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section 2: Pengaturan Periode Layanan */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b pb-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-base font-bold text-gray-900">Periode Layanan</h2>
                                </div>

                                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={showPeriod}
                                        onChange={(e) => setShowPeriod(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>Tampilkan Periode pada Cetakan Invoice</span>
                                </label>
                            </div>

                            {showPeriod && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="period_start" className="text-xs font-semibold text-gray-600">
                                            Periode Mulai <span className="text-red-500">*</span>
                                        </Label>
                                        <DateTimePicker
                                            id="period_start"
                                            value={periodStart}
                                            onChange={(val) => setPeriodStart(val)}
                                            withTime={false}
                                            placeholder="Pilih tanggal mulai..."
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="period_end" className="text-xs font-semibold text-gray-600">
                                            Periode Selesai <span className="text-red-500">*</span>
                                        </Label>
                                        <DateTimePicker
                                            id="period_end"
                                            value={periodEnd}
                                            onChange={(val) => setPeriodEnd(val)}
                                            withTime={false}
                                            placeholder="Pilih tanggal selesai..."
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section 3: Daftar Kontainer & Layanan */}
                        {selectedOrderId && selectedOrder && (
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                                    <div className="flex items-center gap-2">
                                        <Layers className="h-5 w-5 text-blue-600" />
                                        <h2 className="text-base font-bold text-gray-900">
                                            Daftar Kontainer & Produk ({selectedContainers.size} dipilih dari{' '}
                                            {selectedOrder.order_items?.length || 0} kontainer)
                                        </h2>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={toggleSelectAllContainers}
                                        className="h-8 text-xs font-medium"
                                    >
                                        {selectedContainers.size ===
                                        (selectedOrder.order_items || []).filter((it) => !disabledOrders.has(it.id)).length
                                            ? 'Batal Pilih Semua'
                                            : 'Pilih Semua'}
                                    </Button>
                                </div>

                                <div className="space-y-3 pt-1">
                                    {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                                        selectedOrder.order_items.map((item) => {
                                            const isSelected = selectedContainers.has(item.id);
                                            const isDisabled = disabledOrders.has(item.id);
                                            const priceValue = Number(item.price_value || 0);

                                            // Subtotal item
                                            const addSum = (item.additional_products || []).reduce((acc, ap) => {
                                                const p = Number(ap.pivot?.price_value || 0);
                                                const q = getQty(item.id, ap.id);
                                                return acc + p * q;
                                            }, 0);
                                            const itemSubtotal = priceValue + addSum;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`rounded-xl border p-4 transition-all ${
                                                        isDisabled
                                                            ? 'border-gray-200 bg-gray-50/60 opacity-60'
                                                            : isSelected
                                                              ? 'border-blue-300 bg-blue-50/20 shadow-xs'
                                                              : 'border-gray-200 bg-white hover:border-gray-300'
                                                    }`}
                                                >
                                                    {/* Header Item */}
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-start gap-3">
                                                            <input
                                                                type="checkbox"
                                                                id={`container-${item.id}`}
                                                                checked={isSelected}
                                                                disabled={isDisabled}
                                                                onChange={() => toggleContainer(item.id)}
                                                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                                                            />
                                                            <div>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <label
                                                                        htmlFor={`container-${item.id}`}
                                                                        className={`text-base font-bold tracking-wide cursor-pointer ${
                                                                            isSelected ? 'text-blue-900' : 'text-gray-900'
                                                                        }`}
                                                                    >
                                                                        {item.container_number}
                                                                    </label>

                                                                    {item.product?.service_type && (
                                                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                                            {item.product.service_type}
                                                                        </span>
                                                                    )}

                                                                    {isDisabled && (
                                                                        <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-800">
                                                                            Sudah Terbit Invoice
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Waktu Gate In / Gate Out */}
                                                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                                                                        Gate In: {formatDateTime(item.entry_date)}
                                                                    </span>
                                                                    {item.exit_date && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                                                                            Gate Out: {formatDateTime(item.exit_date)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Harga Pokok & Subtotal Kontainer */}
                                                        <div className="text-right shrink-0">
                                                            <div className="text-xs text-gray-500">
                                                                Pokok: {formatRupiah(priceValue)}
                                                            </div>
                                                            <div className="text-sm font-bold text-gray-900 mt-0.5">
                                                                Total: {formatRupiah(itemSubtotal)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Additional Products List */}
                                                    {item.additional_products && item.additional_products.length > 0 && (
                                                        <div className="mt-3.5 border-t border-gray-100 pt-3 pl-7 space-y-2">
                                                            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                                Produk / Layanan Tambahan:
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                {item.additional_products.map((prod) => {
                                                                    const price = Number(prod.pivot?.price_value || 0);
                                                                    const qty = getQty(item.id, prod.id);
                                                                    const lineTotal = price * qty;

                                                                    return (
                                                                        <div
                                                                            key={prod.id}
                                                                            className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg bg-gray-50/70 px-3 py-2 text-xs gap-2"
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="font-medium text-gray-800">
                                                                                    {prod.service_type || `Layanan Tambahan #${prod.id}`}
                                                                                </span>
                                                                                <div className="flex items-center gap-1">
                                                                                    <span className="text-gray-400">Qty:</span>
                                                                                    <input
                                                                                        type="number"
                                                                                        min={0}
                                                                                        step={1}
                                                                                        value={qty}
                                                                                        disabled={!isSelected || isDisabled}
                                                                                        onChange={(e) =>
                                                                                            updateQty(
                                                                                                item.id,
                                                                                                prod.id,
                                                                                                Number(e.target.value),
                                                                                            )
                                                                                        }
                                                                                        className="h-6 w-14 rounded border border-gray-300 bg-white px-1.5 text-center text-xs font-semibold text-gray-800 focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:opacity-50"
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <div className="text-right text-xs">
                                                                                <span className="text-gray-500">
                                                                                    {formatRupiah(price)} × {qty} ={' '}
                                                                                </span>
                                                                                <span className="font-semibold text-gray-900">
                                                                                    {formatRupiah(lineTotal)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="py-6 text-center text-xs text-gray-400">
                                            Order ini tidak memiliki kontainer.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Section 4: Ringkasan Total & Keuangan */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-5">
                            <div className="flex items-center gap-2 border-b pb-3">
                                <Tag className="h-5 w-5 text-blue-600" />
                                <h2 className="text-base font-bold text-gray-900">Rincian Pembayaran</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Pengaturan Diskon & Materai */}
                                <div className="space-y-4">
                                    {/* Diskon */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-semibold text-gray-700">Diskon Khusus</Label>
                                            {!showDiscountInput && discount === 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDiscountInput(true)}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                    Tambah Diskon
                                                </button>
                                            )}
                                        </div>

                                        {showDiscountInput || discount > 0 ? (
                                            <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-3 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-orange-800">
                                                        Nominal Diskon (Rp)
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowDiscountInput(false);
                                                            setDiscount(0);
                                                        }}
                                                        className="text-xs text-red-600 hover:text-red-800"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={discount || ''}
                                                    onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))}
                                                    placeholder="Contoh: 50000"
                                                    className="bg-white text-sm"
                                                />
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border border-dashed border-gray-200 p-3 text-center text-xs text-gray-400">
                                                Tidak ada diskon yang diterapkan.
                                            </div>
                                        )}
                                    </div>

                                    {/* Materai Toggle */}
                                    <div className="rounded-lg border border-gray-200 p-3">
                                        <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={applyMaterai}
                                                onChange={(e) => setApplyMaterai(e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span>Terapkan Bea Materai (Rp 10.000)</span>
                                        </label>
                                        {calculations.isUnder5Juta && calculations.subtotal > 0 && (
                                            <p className="text-[11px] text-amber-700 font-medium mt-1.5 pl-6">
                                                * Otomatis tidak dicentang karena total tagihan di bawah Rp 5.000.000,-
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Ringkasan Angka Finansial */}
                                <div className="rounded-xl bg-gray-50/80 p-5 space-y-3">
                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                        <span>Subtotal Kontainer & Layanan</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatRupiah(calculations.subtotal)}
                                        </span>
                                    </div>

                                    {calculations.discount > 0 && (
                                        <div className="flex items-center justify-between text-xs text-orange-600">
                                            <span>Diskon</span>
                                            <span className="font-semibold">
                                                - {formatRupiah(calculations.discount)}
                                            </span>
                                        </div>
                                    )}

                                    {calculations.discount > 0 && (
                                        <div className="flex items-center justify-between text-xs text-gray-600">
                                            <span>Subtotal Setelah Diskon</span>
                                            <span className="font-semibold text-gray-800">
                                                {formatRupiah(calculations.afterDiscount)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Percent className="h-3 w-3 text-gray-400" />
                                            PPN (11%)
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                            {formatRupiah(calculations.ppn)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                        <span>Biaya Materai</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatRupiah(calculations.materai)}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex items-baseline justify-between">
                                            <span className="text-sm font-bold text-gray-900">Grand Total</span>
                                            <span className="text-xl font-black text-blue-700">
                                                {formatRupiah(calculations.grandTotal)}
                                            </span>
                                        </div>

                                        {calculations.grandTotal > 0 && (
                                            <p className="mt-2 text-[11px] text-gray-500 italic bg-white/60 p-2 rounded-md border border-gray-200/50">
                                                *** {calculations.terbilang} ***
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button variant="outline" asChild>
                                <Link href="/invoices">Batal</Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    !selectedCustomerId ||
                                    !selectedOrderId ||
                                    selectedContainers.size === 0
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 shadow-sm"
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Lanjut ke Preview Invoice
                            </Button>
                        </div>
                    </form>
                </div>
            </InvoicesLayout>
        </AppLayout>
    );
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Invoice',
        href: '/invoices',
    },
    {
        title: 'Create Invoice',
        href: '/invoices/create',
    },
];
