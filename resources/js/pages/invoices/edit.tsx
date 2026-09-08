import AppLayout from '@/layouts/app-layout';
import InvoicesLayout from '@/layouts/invoices/layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
// UI Components
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DateTimePicker from '@/components/date-time-picker';
import { Trash2, Plus, RotateCcw, Info, Check, X, ShieldAlert, Clock, History } from 'lucide-react';

// Types
export interface MasterProduct {
    id: number;
    service_type: string;
    description?: string | null;
    custom_price_20ft?: number | null;
    custom_price_40ft?: number | null;
    custom_price_45ft?: number | null;
    custom_global_price?: number | null;
}

export interface ActivityLogItem {
    id: number;
    action: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
    };
    new_values?: {
        deleted_by?: string;
        deleted_reason?: string;
        reused_by?: string;
        reused_at?: string;
        updated_by?: string;
        invoice_number?: string;
        grand_total?: number;
    };
    old_values?: Record<string, unknown>;
}

export interface EditableProduct {
    id: number; // product id
    service_type: string;
    price_value: number;
    quantity: number;
}

export interface EditableContainerItem {
    id: number; // invoice_item id (or negative temp id)
    order_item_id?: number;
    container_number: string;
    price_type: string;
    price_value: number;
    additional_products: EditableProduct[];
}

interface OrderItem {
    id: number;
    container_number: string;
    price_value: number;
    price_type?: string;
    product?: { service_type?: string };
    additional_products?: Array<{
        id: number;
        service_type?: string;
        pivot?: { price_value?: number; quantity?: number };
    }>;
}

interface Order {
    id: number;
    order_id: string;
    order_items: OrderItem[];
}

interface InvoicePayload {
    id: number;
    invoice_number: string;
    customer_id: number;
    customer: { id: number; name: string };
    period_start: string;
    period_end: string;
    subtotal: number;
    discount: number;
    ppn: number;
    materai: number;
    grand_total: number;
    terbilang: string;
    status: string;
    show_period: boolean;
    items: Array<{
        id: number;
        order_item_id: number;
        product_id: number;
        container_number: string;
        price_type: string;
        price_value: number;
        quantity: number;
        additional_products?: Array<{
            id: number;
            service_type?: string;
            price_value?: number;
            quantity?: number;
            pivot?: { price_value?: number; quantity?: number };
        }>;
        orderItem?: {
            id: number;
            product?: { service_type?: string };
            additional_products?: Array<{
                id: number;
                service_type?: string;
                pivot?: { price_value?: number; quantity?: number };
            }>;
        };
    }>;
}

interface PageProps {
    [k: string]: unknown;
    invoice: InvoicePayload;
    order?: Order | null;
    availableOrderItems?: OrderItem[];
    allProducts?: MasterProduct[];
    activityLogs?: ActivityLogItem[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function EditInvoice() {
    const page = usePage<PageProps>();
    const {
        invoice,
        order,
        availableOrderItems = [],
        allProducts = [],
        activityLogs = [],
        flash,
    } = page.props;

    // State untuk form periode & keuangan
    const [form, setForm] = useState({
        period_start: invoice.period_start?.split(' ')[0] || '',
        period_end: invoice.period_end?.split(' ')[0] || '',
        discount: Number(invoice.discount) || 0,
        materai: Number(invoice.materai) || 0,
        show_period: invoice.show_period ?? true,
    });

    // Inisialisasi items invoice ke editable state
    const [items, setItems] = useState<EditableContainerItem[]>(() => {
        return (invoice.items || []).map((item) => {
            const rawAdds = item.additional_products || [];
            const formattedAdds: EditableProduct[] = rawAdds.map((ap) => {
                const price = Number(ap.pivot?.price_value ?? ap.price_value ?? 0);
                const qty = Number(ap.pivot?.quantity ?? ap.quantity ?? 1);
                return {
                    id: Number(ap.id),
                    service_type: ap.service_type || 'Produk',
                    price_value: price,
                    quantity: qty,
                };
            });

            return {
                id: item.id,
                order_item_id: item.order_item_id,
                container_number: item.container_number,
                price_type: item.price_type || '20ft',
                price_value: Number(item.price_value || 0),
                additional_products: formattedAdds,
            };
        });
    });

    // Tracking kontainer yang dihapus
    const [removedItemIds, setRemovedItemIds] = useState<Set<number>>(new Set());

    // Tracking order item baru yang ditambahkan dari order
    const [newItemIds, setNewItemIds] = useState<Set<number>>(new Set());

    // State untuk form "+ Tambah Jenis Produk" per item (keyed by item.id)
    const [addingProductToItemId, setAddingProductToItemId] = useState<number | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [customProductPrice, setCustomProductPrice] = useState<string>('');
    const [customProductQty, setCustomProductQty] = useState<number>(1);

    // Format mata uang Rupiah
    const formatRupiah = (n: number) => {
        const num = Number(n) || 0;
        return `Rp ${num.toLocaleString('id-ID')}`;
    };

    // Helper untuk menentukan harga default produk berdasarkan ukuran kontainer dan customer rate
    const resolveProductDefaultPrice = (prod: MasterProduct, priceType: string): number => {
        const is45 = (priceType || '').toLowerCase().includes('45');
        const is40 = (priceType || '').toLowerCase().includes('40');
        const is20 = (priceType || '').toLowerCase().includes('20');

        if (is45 && prod.custom_price_45ft !== null && prod.custom_price_45ft !== undefined && prod.custom_price_45ft > 0) {
            return prod.custom_price_45ft;
        }
        if (is40 && prod.custom_price_40ft !== null && prod.custom_price_40ft !== undefined && prod.custom_price_40ft > 0) {
            return prod.custom_price_40ft;
        }
        if (is20 && prod.custom_price_20ft !== null && prod.custom_price_20ft !== undefined && prod.custom_price_20ft > 0) {
            return prod.custom_price_20ft;
        }
        if (prod.custom_global_price !== null && prod.custom_global_price !== undefined && prod.custom_global_price > 0) {
            return prod.custom_global_price;
        }
        return 0;
    };

    // Saat memilih produk pada dropdown "+ Tambah Jenis Produk", otomatis isi harganya
    const handleProductSelectChange = (prodIdStr: string, priceType: string) => {
        setSelectedProductId(prodIdStr);
        if (!prodIdStr) {
            setCustomProductPrice('');
            return;
        }
        const prod = allProducts.find((p) => p.id === Number(prodIdStr));
        if (prod) {
            const price = resolveProductDefaultPrice(prod, priceType);
            setCustomProductPrice(price > 0 ? String(price) : '0');
        }
    };

    // Simpan penambahan produk baru ke dalam kontainer
    const handleConfirmAddProduct = (itemId: number) => {
        if (!selectedProductId) {
            alert('Pilih jenis produk terlebih dahulu.');
            return;
        }
        const prod = allProducts.find((p) => p.id === Number(selectedProductId));
        if (!prod) return;

        const price = Number(customProductPrice) || 0;
        const qty = Math.max(1, Number(customProductQty) || 1);

        setItems((prev) =>
            prev.map((it) => {
                if (it.id !== itemId) return it;

                // Cek apakah produk sudah ada di item ini
                const existingIdx = it.additional_products.findIndex((p) => p.id === prod.id);
                let updatedAdds: EditableProduct[];

                if (existingIdx >= 0) {
                    updatedAdds = it.additional_products.map((p, idx) =>
                        idx === existingIdx
                            ? { ...p, quantity: p.quantity + qty, price_value: price > 0 ? price : p.price_value }
                            : p
                    );
                } else {
                    updatedAdds = [
                        ...it.additional_products,
                        {
                            id: prod.id,
                            service_type: prod.service_type,
                            price_value: price,
                            quantity: qty,
                        },
                    ];
                }

                return {
                    ...it,
                    additional_products: updatedAdds,
                };
            })
        );

        // Reset form penambahan
        setAddingProductToItemId(null);
        setSelectedProductId('');
        setCustomProductPrice('');
        setCustomProductQty(1);
    };

    // Ubah kuantitas produk yang sudah ada
    const handleUpdateQty = (itemId: number, prodId: number, newQty: number) => {
        const val = Number.isFinite(newQty) && newQty >= 0 ? Math.floor(newQty) : 0;
        setItems((prev) =>
            prev.map((it) => {
                if (it.id !== itemId) return it;
                return {
                    ...it,
                    additional_products: it.additional_products.map((p) =>
                        p.id === prodId ? { ...p, quantity: val } : p
                    ),
                };
            })
        );
    };

    // Ubah harga unit produk yang sudah ada
    const handleUpdatePrice = (itemId: number, prodId: number, newPrice: number) => {
        const val = Number.isFinite(newPrice) && newPrice >= 0 ? Math.floor(newPrice) : 0;
        setItems((prev) =>
            prev.map((it) => {
                if (it.id !== itemId) return it;
                return {
                    ...it,
                    additional_products: it.additional_products.map((p) =>
                        p.id === prodId ? { ...p, price_value: val } : p
                    ),
                };
            })
        );
    };

    // Hapus produk dari kontainer
    const handleRemoveProduct = (itemId: number, prodId: number) => {
        setItems((prev) =>
            prev.map((it) => {
                if (it.id !== itemId) return it;
                return {
                    ...it,
                    additional_products: it.additional_products.filter((p) => p.id !== prodId),
                };
            })
        );
    };

    // Hapus kontainer dari invoice
    const handleRemoveContainer = (itemId: number) => {
        setRemovedItemIds((prev) => new Set([...prev, itemId]));
    };

    // Kembalikan kontainer yang dihapus
    const handleRestoreContainer = (itemId: number) => {
        setRemovedItemIds((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
        });
    };

    // Tambah kontainer dari available order items
    const handleAddNewOrderItem = (orderItem: OrderItem) => {
        setNewItemIds((prev) => new Set([...prev, orderItem.id]));

        const formattedAdds: EditableProduct[] = (orderItem.additional_products || []).map((ap) => ({
            id: ap.id,
            service_type: ap.service_type || 'Produk',
            price_value: Number(ap.pivot?.price_value ?? 0),
            quantity: Number(ap.pivot?.quantity ?? 1),
        }));

        const newEntry: EditableContainerItem = {
            id: -orderItem.id, // ID negatif sementara untuk item baru
            order_item_id: orderItem.id,
            container_number: orderItem.container_number,
            price_type: orderItem.price_type || '20ft',
            price_value: Number(orderItem.price_value || 0),
            additional_products: formattedAdds,
        };

        setItems((prev) => [...prev, newEntry]);
    };

    // Hapus kontainer baru yang baru ditambahkan
    const handleRemoveNewOrderItem = (orderItemId: number) => {
        setNewItemIds((prev) => {
            const next = new Set(prev);
            next.delete(orderItemId);
            return next;
        });
        setItems((prev) => prev.filter((it) => it.order_item_id !== orderItemId || it.id > 0));
    };

    // Perhitungan otomatis secara real-time
    const totals = useMemo(() => {
        let subtotal = 0;

        items.forEach((item) => {
            if (removedItemIds.has(item.id)) return;

            // Harga dasar kontainer
            subtotal += Number(item.price_value || 0);

            // Total produk tambahan
            item.additional_products.forEach((ap) => {
                subtotal += Number(ap.price_value || 0) * Number(ap.quantity || 0);
            });
        });

        const discount = Math.max(0, Number(form.discount) || 0);
        const afterDiscount = Math.max(0, subtotal - discount);
        const ppn = Math.round(afterDiscount * 0.11);
        const materai = Math.max(0, Number(form.materai) || 0);
        const grandTotal = afterDiscount + ppn + materai;

        return {
            subtotal,
            discount,
            afterDiscount,
            ppn,
            materai,
            grandTotal,
        };
    }, [items, removedItemIds, form.discount, form.materai]);

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi minimal 1 kontainer aktif
        const activeItems = items.filter((it) => !removedItemIds.has(it.id));
        if (activeItems.length === 0) {
            alert('Invoice harus memiliki minimal satu kontainer/item.');
            return;
        }

        setSubmitting(true);

        const payload = {
            period_start: form.period_start,
            period_end: form.period_end,
            discount: totals.discount,
            ppn: totals.ppn,
            materai: totals.materai,
            grand_total: totals.grandTotal,
            show_period: form.show_period,
            removed_item_ids: Array.from(removedItemIds).filter((id) => id > 0),
            new_order_item_ids: Array.from(newItemIds),
            items: activeItems.map((it) => ({
                id: it.id > 0 ? it.id : null,
                order_item_id: it.order_item_id,
                container_number: it.container_number,
                price_type: it.price_type,
                price_value: it.price_value,
                additional_products: it.additional_products.map((ap) => ({
                    id: ap.id,
                    service_type: ap.service_type,
                    price_value: ap.price_value,
                    quantity: ap.quantity,
                    pivot: {
                        price_value: ap.price_value,
                        quantity: ap.quantity,
                    },
                })),
            })),
        };

        router.put(`/invoices/${invoice.id}`, payload, {
            onFinish: () => setSubmitting(false),
        });
    };

    // Cek apakah invoice ini pernah di-reuse
    const reuseLog = activityLogs.find((l) => l.action === 'reuse_invoice');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Invoice ${invoice.invoice_number}`} />
            <InvoicesLayout>
                <div className="mx-auto max-w-5xl space-y-6 pb-12">
                    {/* Header */}
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <Heading
                            title={`Edit Invoice ${invoice.invoice_number}`}
                            description={`Sesuaikan jenis produk, kuantitas, atau harga untuk customer ${invoice.customer?.name || '-'}.`}
                        />
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/invoices/${invoice.id}`}>Lihat Detail</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Banner Pemberitahuan jika di-reuse */}
                    {reuseLog && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50/80 p-4 text-blue-900 shadow-xs">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold">Invoice ini digunakan kembali (Reuse)</p>
                                    <p className="text-blue-700 mt-0.5">
                                        Nomor invoice ini di-reuse oleh <strong>{reuseLog.new_values?.reused_by || reuseLog.user?.name || 'Admin'}</strong> pada{' '}
                                        {new Date(reuseLog.created_at).toLocaleString('id-ID')}. Anda dapat menyesuaikan kuantitas/produk di bawah ini, atau mengganti Customer dan Nomor Order.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/invoices/create?reuse_id=${invoice.id}`}
                                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 text-xs font-semibold shadow-xs transition-colors self-start sm:self-center"
                            >
                                <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
                                Ganti Customer & Order
                            </Link>
                        </div>
                    )}

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="rounded-lg bg-green-50 p-4 text-sm font-medium text-green-800 border border-green-200 flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 border border-red-200 flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-red-600" />
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Detail Header Invoice */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border bg-gray-50/60 p-5 shadow-sm">
                            <div>
                                <Label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Nomor Invoice</Label>
                                <div className="text-lg font-bold text-gray-900 mt-1">{invoice.invoice_number}</div>
                            </div>
                            <div>
                                <Label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Customer</Label>
                                <div className="text-lg font-bold text-gray-900 mt-1">{invoice.customer?.name || '-'}</div>
                            </div>
                        </div>

                        {/* Pengaturan Periode Layanan */}
                        <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="showPeriod"
                                        checked={form.show_period}
                                        onChange={(e) => setForm({ ...form, show_period: e.target.checked })}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="showPeriod" className="text-sm font-medium text-gray-800 cursor-pointer">
                                        Tampilkan Periode pada Cetakan Invoice
                                    </label>
                                </div>
                            </div>

                            {form.show_period && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="period_start" className="text-xs font-semibold text-gray-600">
                                            Periode Mulai
                                        </Label>
                                        <DateTimePicker
                                            id="period_start"
                                            value={form.period_start}
                                            onChange={(val) => setForm({ ...form, period_start: val })}
                                            withTime={false}
                                            placeholder="Pilih tanggal mulai..."
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="period_end" className="text-xs font-semibold text-gray-600">
                                            Periode Selesai
                                        </Label>
                                        <DateTimePicker
                                            id="period_end"
                                            value={form.period_end}
                                            onChange={(val) => setForm({ ...form, period_end: val })}
                                            withTime={false}
                                            placeholder="Pilih tanggal selesai..."
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Daftar Kontainer & Produk Tambahan */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold text-gray-900">
                                    Kontainer & Rincian Produk ({items.filter((it) => !removedItemIds.has(it.id)).length} kontainer aktif)
                                </h3>
                            </div>

                            {items.map((item) => {
                                const isRemoved = removedItemIds.has(item.id);
                                if (isRemoved) return null;

                                // Hitung total per kontainer
                                const addSum = item.additional_products.reduce(
                                    (sum, p) => sum + (Number(p.price_value) || 0) * (Number(p.quantity) || 0),
                                    0
                                );
                                const containerTotal = Number(item.price_value || 0) + addSum;
                                const isAdding = addingProductToItemId === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 transition-all hover:border-gray-300"
                                    >
                                        {/* Header Kontainer */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-bold text-gray-900 tracking-wide">
                                                        {item.container_number}
                                                    </span>
                                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        {item.price_type || '20ft'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    Harga Pokok Kontainer: <span className="font-semibold text-gray-700">{formatRupiah(item.price_value)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500">Subtotal Kontainer</div>
                                                    <div className="text-base font-bold text-blue-700">{formatRupiah(containerTotal)}</div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveContainer(item.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    title="Hapus Kontainer Ini"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* List Produk Tambahan */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                                                    Jenis Produk / Layanan Tambahan
                                                </Label>
                                                {!isAdding && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setAddingProductToItemId(item.id);
                                                            setSelectedProductId('');
                                                            setCustomProductPrice('');
                                                            setCustomProductQty(1);
                                                        }}
                                                        className="h-8 text-xs font-medium text-blue-600 border-blue-200 hover:bg-blue-50"
                                                    >
                                                        <Plus className="h-3.5 w-3.5 mr-1" />
                                                        Tambah Jenis Produk
                                                    </Button>
                                                )}
                                            </div>

                                            {item.additional_products.length > 0 ? (
                                                <div className="divide-y rounded-lg border bg-gray-50/50">
                                                    {item.additional_products.map((prod) => {
                                                        const lineTotal = Number(prod.price_value || 0) * Number(prod.quantity || 0);

                                                        return (
                                                            <div
                                                                key={prod.id}
                                                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 text-sm"
                                                            >
                                                                <div className="flex-1 min-w-[180px]">
                                                                    <div className="font-semibold text-gray-800">{prod.service_type}</div>
                                                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                                        <span>Harga satuan:</span>
                                                                        <input
                                                                            type="number"
                                                                            min={0}
                                                                            value={prod.price_value}
                                                                            onChange={(e) =>
                                                                                handleUpdatePrice(item.id, prod.id, Number(e.target.value))
                                                                            }
                                                                            className="w-24 rounded border border-gray-300 px-1.5 py-0.5 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Stepper Kuantitas (Qty) */}
                                                                <div className="flex items-center gap-4">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Label className="text-xs font-medium text-gray-600">Qty:</Label>
                                                                        <div className="flex items-center border rounded-md bg-white">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleUpdateQty(item.id, prod.id, Math.max(0, prod.quantity - 1))
                                                                                }
                                                                                className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-l text-xs font-bold"
                                                                            >
                                                                                -
                                                                            </button>
                                                                            <input
                                                                                type="number"
                                                                                min={0}
                                                                                value={prod.quantity}
                                                                                onChange={(e) =>
                                                                                    handleUpdateQty(item.id, prod.id, Number(e.target.value))
                                                                                }
                                                                                className="w-12 text-center text-xs font-semibold py-1 border-x border-gray-200 focus:outline-none"
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleUpdateQty(item.id, prod.id, prod.quantity + 1)
                                                                                }
                                                                                className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-r text-xs font-bold"
                                                                            >
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    <div className="min-w-[110px] text-right font-semibold text-gray-800">
                                                                        {formatRupiah(lineTotal)}
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveProduct(item.id, prod.id)}
                                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                                        title="Hapus produk ini"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="rounded-lg border border-dashed p-4 text-center text-xs text-gray-500">
                                                    Belum ada produk tambahan pada kontainer ini.
                                                </div>
                                            )}

                                            {/* Panel Form Inline "+ Tambah Jenis Produk" */}
                                            {isAdding && (
                                                <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-blue-900 uppercase">
                                                            Tambah Jenis Produk ke {item.container_number}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setAddingProductToItemId(null)}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {/* Pilihan Master Produk */}
                                                        <div className="space-y-1 sm:col-span-1">
                                                            <Label className="text-xs text-gray-700">Pilih Produk</Label>
                                                            <select
                                                                value={selectedProductId}
                                                                onChange={(e) => handleProductSelectChange(e.target.value, item.price_type)}
                                                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 focus:border-blue-500 focus:outline-none"
                                                            >
                                                                <option value="">-- Pilih Jenis Produk --</option>
                                                                {allProducts.map((p) => (
                                                                    <option key={p.id} value={p.id}>
                                                                        {p.service_type}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        {/* Harga Satuan */}
                                                        <div className="space-y-1">
                                                            <Label className="text-xs text-gray-700">Harga Satuan (Rp)</Label>
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                placeholder="0"
                                                                value={customProductPrice}
                                                                onChange={(e) => setCustomProductPrice(e.target.value)}
                                                                className="h-8 text-xs bg-white"
                                                            />
                                                        </div>

                                                        {/* Kuantitas (Qty) */}
                                                        <div className="space-y-1">
                                                            <Label className="text-xs text-gray-700">Jumlah (Qty)</Label>
                                                            <Input
                                                                type="number"
                                                                min={1}
                                                                value={customProductQty}
                                                                onChange={(e) => setCustomProductQty(Number(e.target.value))}
                                                                className="h-8 text-xs bg-white"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end gap-2 pt-1">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setAddingProductToItemId(null)}
                                                            className="h-8 text-xs"
                                                        >
                                                            Batal
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            onClick={() => handleConfirmAddProduct(item.id)}
                                                            className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                                        >
                                                            <Plus className="h-3.5 w-3.5 mr-1" />
                                                            Tambahkan Produk
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Kontainer yang ditandai dihapus (bisa dikembalikan) */}
                            {items.some((it) => removedItemIds.has(it.id)) && (
                                <div className="rounded-xl border border-dashed border-red-200 bg-red-50/40 p-4 space-y-2">
                                    <Label className="text-xs font-semibold text-red-700 uppercase">
                                        Kontainer yang Dikeluarkan dari Invoice:
                                    </Label>
                                    {items
                                        .filter((it) => removedItemIds.has(it.id))
                                        .map((it) => (
                                            <div
                                                key={it.id}
                                                className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-red-100 text-xs shadow-sm"
                                            >
                                                <span className="font-semibold text-gray-700">
                                                    {it.container_number} ({it.price_type}) - {formatRupiah(it.price_value)}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRestoreContainer(it.id)}
                                                    className="h-7 text-xs text-green-600 hover:text-green-800 hover:bg-green-50 inline-flex items-center gap-1"
                                                >
                                                    <RotateCcw className="h-3.5 w-3.5" />
                                                    Kembalikan
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Tersedia Kontainer Baru dari Order yang Sama */}
                        {availableOrderItems && availableOrderItems.length > 0 && (
                            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                                <Label className="text-base font-semibold text-gray-900">
                                    Tambah Kontainer Lain dari Order #{order?.order_id || '-'}
                                </Label>

                                <div className="space-y-2">
                                    {availableOrderItems.map((oi) => {
                                        const isAlreadyAdded = newItemIds.has(oi.id);

                                        return (
                                            <div
                                                key={oi.id}
                                                className="flex items-center justify-between rounded-lg border border-dashed p-3 text-sm hover:bg-gray-50"
                                            >
                                                <div>
                                                    <div className="font-bold text-gray-800">{oi.container_number}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {oi.product?.service_type || '-'} ({oi.price_type || '-'}) • {formatRupiah(oi.price_value)}
                                                    </div>
                                                </div>

                                                {isAlreadyAdded ? (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveNewOrderItem(oi.id)}
                                                        className="text-xs text-red-600 hover:bg-red-50"
                                                    >
                                                        Batalkan Tambah
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAddNewOrderItem(oi)}
                                                        className="text-xs font-medium text-blue-600 border-blue-200 hover:bg-blue-50"
                                                    >
                                                        <Plus className="h-3.5 w-3.5 mr-1" />
                                                        Sertakan ke Invoice
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Ringkasan & Kalkulasi Keuangan Real-Time */}
                        <div className="rounded-xl border bg-gray-50/80 p-6 shadow-sm space-y-4">
                            <h3 className="text-base font-bold text-gray-900 border-b pb-2">
                                Ringkasan & Kalkulasi Total Invoice
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <Label className="text-xs text-gray-600 font-semibold">Subtotal (Sebelum Diskon & Pajak)</Label>
                                    <Input
                                        value={formatRupiah(totals.subtotal)}
                                        readOnly
                                        className="bg-white font-semibold text-gray-800 mt-1"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs text-gray-600 font-semibold">Diskon (Rp)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={form.discount}
                                        onChange={(e) => setForm({ ...form, discount: Number(e.target.value) || 0 })}
                                        className="bg-white text-orange-600 font-semibold mt-1"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs text-gray-600 font-semibold">PPN (11% dari Setelah Diskon)</Label>
                                    <Input
                                        value={formatRupiah(totals.ppn)}
                                        readOnly
                                        className="bg-white font-semibold text-gray-800 mt-1"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs text-gray-600 font-semibold">Materai (Rp)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={form.materai}
                                        onChange={(e) => setForm({ ...form, materai: Number(e.target.value) || 0 })}
                                        className="bg-white font-semibold text-gray-800 mt-1"
                                    />
                                    {totals.afterDiscount < 5000000 && totals.afterDiscount > 0 && (
                                        <p className="text-[11px] text-amber-700 font-medium mt-1">
                                            * Tagihan di bawah Rp 5.000.000,- tidak wajib bea materai.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-blue-900">Grand Total Akhir</div>
                                    <div className="text-xs text-blue-700">Subtotal - Diskon + PPN (11%) + Materai</div>
                                </div>
                                <div className="text-2xl font-extrabold text-blue-900">
                                    {formatRupiah(totals.grandTotal)}
                                </div>
                            </div>
                        </div>

                        {/* Tombol Simpan / Batal */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button variant="outline" asChild disabled={submitting}>
                                <Link href={`/invoices/${invoice.id}`}>Batal</Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
                            >
                                {submitting ? 'Menyimpan...' : 'Simpan Perubahan Invoice'}
                            </Button>
                        </div>
                    </form>

                    {/* Riwayat Aktivitas Audit Trail */}
                    {activityLogs && activityLogs.length > 0 && (
                        <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3 mt-8">
                            <div className="flex items-center gap-2 border-b pb-2">
                                <History className="h-4 w-4 text-gray-600" />
                                <h4 className="text-sm font-bold text-gray-900">Riwayat Aktivitas Invoice</h4>
                            </div>

                            <div className="divide-y text-xs text-gray-600">
                                {activityLogs.map((log) => {
                                    const actionLabels: Record<string, { label: string; badge: string }> = {
                                        create_invoice: { label: 'Dibuat', badge: 'bg-green-100 text-green-800' },
                                        update_invoice: { label: 'Diperbarui', badge: 'bg-blue-100 text-blue-800' },
                                        delete_invoice: { label: 'Dihapus', badge: 'bg-red-100 text-red-800' },
                                        restore_invoice: { label: 'Dipulihkan', badge: 'bg-yellow-100 text-yellow-800' },
                                        reuse_invoice: { label: 'Di-reuse', badge: 'bg-emerald-100 text-emerald-800' },
                                    };
                                    const info = actionLabels[log.action] || { label: log.action, badge: 'bg-gray-100 text-gray-800' };

                                    return (
                                        <div key={log.id} className="py-2.5 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${info.badge}`}>
                                                    {info.label}
                                                </span>
                                                <span>
                                                    Oleh <strong>{log.new_values?.deleted_by || log.new_values?.reused_by || log.new_values?.updated_by || log.user?.name || 'User'}</strong>
                                                    {log.new_values?.deleted_reason && ` (Alasan: "${log.new_values.deleted_reason}")`}
                                                </span>
                                            </div>
                                            <div className="text-gray-400 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(log.created_at).toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
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
        title: 'Edit Invoice',
        href: '/invoices/edit',
    },
];
