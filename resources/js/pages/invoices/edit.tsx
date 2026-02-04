import AppLayout from '@/layouts/app-layout';
import InvoicesLayout from '@/layouts/invoices/layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
// UI Components
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

// Types
interface AdditionalProduct {
    id: number;
    service_type?: string;
    pivot?: { price_value?: number; quantity?: number };
}

interface Product {
    service_type?: string;
}

interface OrderItem {
    id: number;
    container_number: string;
    price_value: number;
    price_type?: string;
    product?: Product;
    additional_products?: AdditionalProduct[];
}

interface InvoiceItem {
    id: number;
    order_item_id: number;
    product_id: number;
    container_number: string;
    price_type: string;
    price_value: number;
    quantity: number;
    additional_products?: AdditionalProduct[];
    orderItem?: {
        id: number;
        product?: Product;
        additional_products?: AdditionalProduct[];
    };
}

interface Order {
    id: number;
    order_id: string;
    order_items: OrderItem[];
}

interface Invoice {
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
    items: InvoiceItem[];
}

interface PageProps {
    [k: string]: unknown;
    invoice: Invoice;
    order: Order;
    availableOrderItems: OrderItem[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function EditInvoice() {
    const page = usePage<PageProps>();
    const { invoice, order, availableOrderItems, flash } = page.props;

    // State untuk form
    const [form, setForm] = useState({
        period_start: invoice.period_start?.split(' ')[0] || '',
        period_end: invoice.period_end?.split(' ')[0] || '',
        discount: invoice.discount || 0,
        materai: invoice.materai || 0,
        show_period: invoice.show_period ?? true,
    });

    // State untuk quantity additional products
    const [addQty, setAddQty] = useState<Record<string, number>>(() => {
        const m: Record<string, number> = {};
        invoice.items?.forEach((item) => {
            const adds = item.additional_products || [];
            adds.forEach((ap) => {
                m[`${item.order_item_id}:${ap.id}`] = ap.pivot?.quantity ?? 1;
            });
        });
        return m;
    });

    // State untuk items yang akan dihapus
    const [removedItemIds, setRemovedItemIds] = useState<Set<number>>(new Set());

    // State untuk items yang baru ditambahkan
    const [newItemIds, setNewItemIds] = useState<Set<number>>(new Set());

    // Helper functions
    const formatRupiah = (n: number) => {
        const num = Number(n) || 0;
        return num > 0 ? `Rp ${num.toLocaleString('id-ID')}` : 'Rp 0';
    };

    const qtyKey = (itemId: number, prodId: number) => `${itemId}:${prodId}`;
    const getQty = (itemId: number, prodId: number) => addQty[qtyKey(itemId, prodId)] ?? 0;
    const setQty = (itemId: number, prodId: number, val: number) => {
        const v = Number.isFinite(val) && val >= 0 ? Math.floor(val) : 0;
        setAddQty((prev) => ({ ...prev, [qtyKey(itemId, prodId)]: v }));
    };

    // Calculate totals
    const calculateTotals = () => {
        let subtotal = 0;

        // Existing items (excluding removed)
        invoice.items?.forEach((item) => {
            if (removedItemIds.has(item.id)) return;

            subtotal += Number(item.price_value || 0);

            const orderItem = order?.order_items?.find((oi) => oi.id === item.order_item_id);
            if (orderItem) {
                orderItem.additional_products?.forEach((ap) => {
                    const qty = getQty(item.order_item_id, ap.id);
                    subtotal += Number(ap.pivot?.price_value || 0) * qty;
                });
            }
        });

        // New items
        newItemIds.forEach((orderItemId) => {
            const orderItem = order?.order_items?.find((oi) => oi.id === orderItemId);
            if (orderItem) {
                subtotal += Number(orderItem.price_value || 0);
                orderItem.additional_products?.forEach((ap) => {
                    const qty = getQty(orderItemId, ap.id);
                    subtotal += Number(ap.pivot?.price_value || 0) * qty;
                });
            }
        });

        const discount = Number(form.discount) || 0;
        const afterDiscount = subtotal - discount;
        const ppn = Math.round(afterDiscount * 0.11);
        const materai = Number(form.materai) || 0;
        const grandTotal = afterDiscount + ppn + materai;

        return { subtotal, ppn, grandTotal, materai };
    };

    const [totals, setTotals] = useState(calculateTotals());

    useEffect(() => {
        setTotals(calculateTotals());
    }, [addQty, removedItemIds, newItemIds, form.discount, form.materai, form.show_period]);

    // Handlers
    const handleRemoveItem = (itemId: number) => {
        setRemovedItemIds((prev) => new Set([...prev, itemId]));
    };

    const handleRestoreItem = (itemId: number) => {
        setRemovedItemIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
        });
    };

    const handleAddNewItem = (orderItemId: number) => {
        setNewItemIds((prev) => new Set([...prev, orderItemId]));
    };

    const handleRemoveNewItem = (orderItemId: number) => {
        setNewItemIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(orderItemId);
            return newSet;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if at least one item remains
        const totalItems = invoice.items?.length ?? 0;
        if (totalItems - removedItemIds.size + newItemIds.size === 0) {
            alert('Invoice harus memiliki minimal satu item.');
            return;
        }

        // Prepare additional product quantities
        const additionalQuantities: Array<{
            order_item_id: number;
            additional_product_id: number;
            quantity: number;
        }> = [];

        // From existing items
        invoice.items?.forEach((item) => {
            if (removedItemIds.has(item.id)) return;

            const orderItem = order?.order_items?.find((oi) => oi.id === item.order_item_id);
            if (orderItem) {
                orderItem.additional_products?.forEach((ap) => {
                    additionalQuantities.push({
                        order_item_id: item.order_item_id,
                        additional_product_id: ap.id,
                        quantity: getQty(item.order_item_id, ap.id),
                    });
                });
            }
        });

        // From new items
        newItemIds.forEach((orderItemId) => {
            const orderItem = order?.order_items?.find((oi) => oi.id === orderItemId);
            if (orderItem) {
                orderItem.additional_products?.forEach((ap) => {
                    additionalQuantities.push({
                        order_item_id: orderItemId,
                        additional_product_id: ap.id,
                        quantity: getQty(orderItemId, ap.id),
                    });
                });
            }
        });

        // Get current item IDs (excluding removed)
        const currentItemIds = invoice.items
            ?.filter((item) => !removedItemIds.has(item.id))
            .map((item) => item.order_item_id) ?? [];

        const formData = {
            ...form,
            ppn: totals.ppn,
            grand_total: totals.grandTotal,
            order_item_ids: currentItemIds,
            new_order_item_ids: Array.from(newItemIds),
            removed_item_ids: Array.from(removedItemIds),
            additional_product_quantities: additionalQuantities,
        };

        try {
            await router.put(`/invoices/${invoice.id}`, formData);
        } catch (err) {
            console.error('Error updating invoice:', err);
        }
    };

    // Combine all items for display
    const allOrderItems = order?.order_items ?? [];
    const existingItemOrderIds = invoice.items?.map((item) => item.order_item_id) ?? [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Invoice ${invoice.invoice_number}`} />
            <InvoicesLayout>
                <div className="mx-auto max-w-5xl space-y-6">
                    <Heading
                        title="Edit Invoice"
                        description={`Edit invoice ${invoice.invoice_number} untuk ${invoice.customer?.name || ''}.`}
                    />

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{flash.success}</div>
                    )}
                    {flash?.error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{flash.error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Invoice Info (Read Only) */}
                        <div className="grid grid-cols-2 gap-4 rounded-md border bg-gray-50 p-4">
                            <div>
                                <Label className="text-gray-600">Nomor Invoice</Label>
                                <div className="font-medium">{invoice.invoice_number}</div>
                            </div>
                            <div>
                                <Label className="text-gray-600">Customer</Label>
                                <div className="font-medium">{invoice.customer?.name || '-'}</div>
                            </div>
                        </div>

                        {/* Show/Hide Periode Toggle */}
                        <div className="flex items-center space-x-2 rounded-md border p-3">
                            <input
                                type="checkbox"
                                id="showPeriod"
                                checked={form.show_period}
                                onChange={(e) => setForm({ ...form, show_period: e.target.checked })}
                                className="h-4 w-4"
                            />
                            <label htmlFor="showPeriod" className="text-sm font-medium">
                                Tampilkan Periode pada Invoice
                            </label>
                        </div>

                        {/* Periode Layanan */}
                        {form.show_period && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="period_start">Periode Mulai</Label>
                                    <Input
                                        id="period_start"
                                        name="period_start"
                                        type="date"
                                        value={form.period_start}
                                        onChange={(e) => setForm({ ...form, period_start: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="period_end">Periode Akhir</Label>
                                    <Input
                                        id="period_end"
                                        name="period_end"
                                        type="date"
                                        value={form.period_end}
                                        onChange={(e) => setForm({ ...form, period_end: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Existing Items */}
                        <div className="space-y-3 rounded-md border p-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold">Item Invoice Saat Ini</Label>
                                <span className="text-sm text-gray-500">
                                    {invoice.items?.length ?? 0} item
                                </span>
                            </div>

                            {invoice.items?.map((item) => {
                                if (removedItemIds.has(item.id)) return null;

                                const orderItem = allOrderItems.find((oi) => oi.id === item.order_item_id);
                                const additionalProducts = orderItem?.additional_products ?? [];

                                // Calculate item total
                                let itemTotal = Number(item.price_value || 0);
                                additionalProducts.forEach((ap) => {
                                    const qty = getQty(item.order_item_id, ap.id);
                                    itemTotal += Number(ap.pivot?.price_value || 0) * qty;
                                });

                                return (
                                    <div key={item.id} className="mb-3 rounded-md border p-3 last:mb-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="font-medium">{item.container_number}</div>
                                                <div className="text-sm text-gray-500">
                                                    {orderItem?.product?.service_type || '-'} ({item.price_type || '-'})
                                                </div>
                                                <div className="text-sm">Harga: {formatRupiah(item.price_value)}</div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Additional Products */}
                                        {additionalProducts.length > 0 && (
                                            <div className="ml-4 mt-2 space-y-2">
                                                <Label className="text-xs text-gray-500">Additional Products:</Label>
                                                {additionalProducts.map((ap) => {
                                                    const price = Number(ap.pivot?.price_value || 0);
                                                    const qty = getQty(item.order_item_id, ap.id);
                                                    const lineTotal = price * qty;

                                                    return (
                                                        <div key={ap.id} className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <span>• {ap.service_type}</span>
                                                                <div className="flex items-center gap-1">
                                                                    <Label className="text-xs">Qty:</Label>
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        step={1}
                                                                        value={qty}
                                                                        onChange={(e) =>
                                                                            setQty(item.order_item_id, ap.id, Number(e.target.value))
                                                                        }
                                                                        className="h-7 w-16 rounded border px-2 text-xs"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="text-gray-600">
                                                                {formatRupiah(lineTotal)}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className="mt-2 text-right text-sm font-medium">
                                            Item Total: {formatRupiah(itemTotal)}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Removed Items (can be restored) */}
                            {invoice.items?.some((item) => removedItemIds.has(item.id)) && (
                                <div className="mt-4 border-t pt-3">
                                    <Label className="text-sm text-gray-500">Item yang akan dihapus:</Label>
                                    {invoice.items
                                        ?.filter((item) => removedItemIds.has(item.id))
                                        .map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between rounded-md bg-red-50 px-3 py-2"
                                            >
                                                <span className="text-sm">
                                                    {item.container_number} -{' '}
                                                    {order?.order_items?.find((oi) => oi.id === item.order_item_id)?.product
                                                        ?.service_type || '-'}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRestoreItem(item.id)}
                                                    className="text-green-600"
                                                >
                                                    Kembalikan
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Available Items to Add */}
                        {availableOrderItems && availableOrderItems.length > 0 && (
                            <div className="space-y-3 rounded-md border p-4">
                                <Label className="text-lg font-semibold">
                                    Tambah Item Baru dari Order {order?.order_id}
                                </Label>

                                {availableOrderItems.map((orderItem) => {
                                    if (newItemIds.has(orderItem.id)) return null;

                                    const additionalProducts = orderItem.additional_products ?? [];

                                    return (
                                        <div
                                            key={orderItem.id}
                                            className="mb-3 rounded-md border border-dashed p-3 last:mb-0"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium">{orderItem.container_number}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {orderItem.product?.service_type || '-'} ({orderItem.price_type || '-'})
                                                    </div>
                                                    <div className="text-sm">
                                                        Harga: {formatRupiah(orderItem.price_value)}
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleAddNewItem(orderItem.id)}
                                                >
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Tambah
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Newly Added Items */}
                        {newItemIds.size > 0 && (
                            <div className="space-y-3 rounded-md border border-blue-200 bg-blue-50 p-4">
                                <Label className="text-lg font-semibold">Item Baru yang Ditambahkan</Label>

                                {Array.from(newItemIds).map((orderItemId) => {
                                    const orderItem = allOrderItems.find((oi) => oi.id === orderItemId);
                                    if (!orderItem) return null;

                                    const additionalProducts = orderItem.additional_products ?? [];

                                    // Calculate item total
                                    let itemTotal = Number(orderItem.price_value || 0);
                                    additionalProducts.forEach((ap) => {
                                        const qty = getQty(orderItemId, ap.id);
                                        itemTotal += Number(ap.pivot?.price_value || 0) * qty;
                                    });

                                    return (
                                        <div key={`new-${orderItemId}`} className="mb-3 rounded-md border p-3 last:mb-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium">{orderItem.container_number}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {orderItem.product?.service_type || '-'} ({orderItem.price_type || '-'})
                                                    </div>
                                                    <div className="text-sm">
                                                        Harga: {formatRupiah(orderItem.price_value)}
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveNewItem(orderItemId)}
                                                    className="text-red-500"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Additional Products */}
                                            {additionalProducts.length > 0 && (
                                                <div className="ml-4 mt-2 space-y-2">
                                                    <Label className="text-xs text-gray-500">Additional Products:</Label>
                                                    {additionalProducts.map((ap) => {
                                                        const price = Number(ap.pivot?.price_value || 0);
                                                        const qty = getQty(orderItemId, ap.id);
                                                        const lineTotal = price * qty;

                                                        return (
                                                            <div key={ap.id} className="flex items-center justify-between text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <span>• {ap.service_type}</span>
                                                                    <div className="flex items-center gap-1">
                                                                        <Label className="text-xs">Qty:</Label>
                                                                        <input
                                                                            type="number"
                                                                            min={0}
                                                                            step={1}
                                                                            value={qty}
                                                                            onChange={(e) =>
                                                                                setQty(orderItemId, ap.id, Number(e.target.value))
                                                                            }
                                                                            className="h-7 w-16 rounded border px-2 text-xs"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="text-gray-600">
                                                                    {formatRupiah(lineTotal)}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            <div className="mt-2 text-right text-sm font-medium">
                                                Item Total: {formatRupiah(itemTotal)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Totals Section */}
                        <div className="space-y-3 rounded-md border bg-gray-50 p-4">
                            <h3 className="font-semibold">Ringkasan Total</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Subtotal</Label>
                                    <Input
                                        value={formatRupiah(totals.subtotal)}
                                        readOnly
                                        className="bg-white"
                                    />
                                </div>

                                <div>
                                    <Label>Diskon</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={form.discount}
                                        onChange={(e) => setForm({ ...form, discount: Number(e.target.value) || 0 })}
                                        className="bg-white"
                                    />
                                </div>

                                <div>
                                    <Label>PPN (11%)</Label>
                                    <Input
                                        value={formatRupiah(totals.ppn)}
                                        readOnly
                                        className="bg-white"
                                    />
                                </div>

                                <div>
                                    <Label>Materai</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={form.materai}
                                        onChange={(e) => setForm({ ...form, materai: Number(e.target.value) || 0 })}
                                        className="bg-white"
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-3">
                                <Label className="text-lg font-semibold">Grand Total</Label>
                                <Input
                                    value={formatRupiah(totals.grandTotal)}
                                    readOnly
                                    className="bg-white text-lg font-bold"
                                />
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" asChild>
                                <Link href={`/invoices/${invoice.id}`}>Batal</Link>
                            </Button>
                            <Button type="submit">Simpan Perubahan</Button>
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
        title: 'Edit Invoice',
        href: '/invoices/edit',
    },
];
