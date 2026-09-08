import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import OrdersLayout from '@/layouts/orders/layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertCircle,
    FileCheck,
    FileText,
    Hash,
    Layers,
    Plus,
    PlusCircle,
    Thermometer,
    Trash2,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: '/orders' },
    { title: 'Edit Order', href: '#' },
];

// =====================
//  Tipe Data
// =====================
interface Customer {
    id: number;
    name: string;
}

interface Product {
    id: number;
    service_type: string;
    requires_temperature: boolean;
    custom_price_20ft?: string;
    custom_price_40ft?: string;
    custom_price_45ft?: string;
    custom_global_price?: string;
}

interface Shipper {
    id: number;
    name: string;
}

interface TemperatureRecord {
    date: string; // YYYY-MM-DD
    temps: { [hour: string]: string };
}

interface OrderItemData {
    id: number;
    product_id: number;
    container_number: string;
    entry_date: string;
    eir_date: string;
    exit_date: string;
    commodity: string;
    country: string;
    vessel?: string;
    price_type?: '20ft' | '40ft' | '45ft' | 'global';
    price_value?: string | number;
    additional_products: { id: number }[];
    rekam_suhu: { tanggal: string; jam_data: { [hour: string]: string } }[];
}

interface OrderProps {
    id: number;
    order_id: string;
    customer_id: number;
    shipper_id: number;
    no_aju: string | null;
    fumigasi: string | null;
    items: OrderItemData[];
}

interface PageProps {
    order: OrderProps;
    customers: Customer[];
    shippers: Shipper[];
}

type PriceType = '20ft' | '40ft' | '45ft' | 'global' | undefined;

export default function EditOrder({ order, customers, shippers }: PageProps) {
    // ======================
    //  Inertia Form State
    // ======================
    const initialOrderItems = order.items.map((item) => {
        const temperatureObj: { [date: string]: { [hour: string]: string } } = {};
        item.rekam_suhu.forEach((rec) => {
            temperatureObj[rec.tanggal] = rec.jam_data;
        });
        return {
            id: item.id,
            product_id: item.product_id ? item.product_id.toString() : '',
            additional_product_ids: item.additional_products.map((p) => p.id.toString()),
            container_number: item.container_number || '',
            entry_date: item.entry_date ?? '',
            eir_date: item.eir_date ?? '',
            exit_date: item.exit_date ?? '',
            commodity: item.commodity ?? '',
            country: item.country ?? '',
            vessel: item.vessel ?? '',
            price_type: item.price_type ?? undefined,
            price_value: item.price_value ?? undefined,
            temperature: Object.keys(temperatureObj).length ? temperatureObj : undefined,
        };
    });

    const getAdditionalProductPrices = (product_ids: string[], price_type: PriceType, productsList: Product[]): string[] => {
        return product_ids.map((id) => {
            const p = productsList.find((x) => x.id.toString() === id);
            let price = '0';
            if (p) {
                if (price_type === '20ft') price = p.custom_price_20ft ?? '0';
                else if (price_type === '40ft') price = p.custom_price_40ft ?? '0';
                else if (price_type === '45ft') price = p.custom_price_45ft ?? '0';
                else price = p.custom_global_price ?? '0';
            }
            return `${id}:${price}`;
        });
    };

    const { data, setData, put, processing, errors } = useForm<{
        customer_id: string;
        shipper_id: string;
        no_aju: string;
        fumigasi: string | null;
        error?: string;
        order_items: {
            id?: number;
            product_id: string;
            additional_product_ids: string[];
            container_number: string;
            entry_date: string;
            eir_date: string;
            exit_date: string;
            commodity: string;
            country: string;
            vessel: string;
            price_type?: '20ft' | '40ft' | '45ft' | 'global';
            price_value?: string | number;
            temperature?: { [date: string]: { [hour: string]: string } };
            additional_product_prices?: string[];
        }[];
    }>({
        customer_id: order.customer_id ? order.customer_id.toString() : '',
        shipper_id: order.shipper_id ? order.shipper_id.toString() : '',
        no_aju: order.no_aju ?? '',
        fumigasi: order.fumigasi ?? null,
        order_items: initialOrderItems,
    });

    // ==================================
    //  Nomor Order vs Nomor AJU
    // ==================================
    const [useOrderId, setUseOrderId] = useState<boolean>(!order.no_aju);
    const [currentOrderId] = useState<string>(order.order_id);

    const handleSwitchToOrderId = () => {
        setUseOrderId(true);
        setData('no_aju', '');
    };
    const handleSwitchToNoAju = () => {
        setUseOrderId(false);
    };

    // ==================================
    //  Fetch Products per Customer
    // ==================================
    const [customerProducts, setCustomerProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const initialLoad = useRef(true);

    useEffect(() => {
        if (data.customer_id) {
            setProductsLoading(true);
            axios
                .get(`/api/customers/${data.customer_id}/products`)
                .then((res) => {
                    setCustomerProducts(res.data);
                    if (!initialLoad.current) {
                        setData(
                            'order_items',
                            data.order_items.map((item) => ({
                                ...item,
                                product_id: '',
                                additional_product_ids: [],
                                price_type: undefined,
                                price_value: undefined,
                            })),
                        );
                    }
                    initialLoad.current = false;
                })
                .finally(() => setProductsLoading(false));
        } else {
            setCustomerProducts([]);
            setData(
                'order_items',
                data.order_items.map((item) => ({
                    ...item,
                    product_id: '',
                    additional_product_ids: [],
                    price_type: undefined,
                    price_value: undefined,
                })),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.customer_id]);

    const getSelectedProduct = (productId: string) => customerProducts.find((p) => p.id === Number(productId));

    // ==================================
    //  Dynamic Order Item Helpers
    // ==================================
    const addOrderItem = () => {
        setData('order_items', [
            ...data.order_items,
            {
                id: undefined,
                product_id: '',
                additional_product_ids: [],
                container_number: '',
                entry_date: '',
                eir_date: '',
                exit_date: '',
                commodity: '',
                country: '',
                vessel: '',
                price_type: undefined,
                price_value: undefined,
                temperature: undefined,
            },
        ]);
    };

    const removeOrderItem = (index: number) => {
        setData(
            'order_items',
            data.order_items.filter((_, i) => i !== index),
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateOrderItem = (index: number, field: keyof (typeof data.order_items)[number], value: any) => {
        const newItems = [...data.order_items];
        // @ts-expect-error – dynamic field assignment
        newItems[index][field] = value;

        if (field === 'price_type') {
            const selectedProduct = getSelectedProduct(newItems[index].product_id);
            let price_value;
            if (selectedProduct) {
                if (value === '20ft') price_value = selectedProduct.custom_price_20ft;
                else if (value === '40ft') price_value = selectedProduct.custom_price_40ft;
                else if (value === '45ft') price_value = selectedProduct.custom_price_45ft;
                else price_value = selectedProduct.custom_global_price;
            }
            newItems[index]['price_value'] = price_value;

            const addIds = (newItems[index].additional_product_ids || []) as string[];
            newItems[index]['additional_product_prices'] = getAdditionalProductPrices(
                addIds,
                value as '20ft' | '40ft' | '45ft' | 'global' | undefined,
                customerProducts,
            );
        }

        setData('order_items', newItems);
    };

    const hasDuplicateContainer = (index: number) => {
        const current = data.order_items[index].container_number.trim().toUpperCase();
        return data.order_items.some((item, i) => i !== index && item.container_number.trim().toUpperCase() === current && current.length > 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('error', undefined);

        if (data.fumigasi && data.fumigasi.trim() !== '' && !data.shipper_id) {
            setData('error', 'Shipper wajib diisi karena catatan Fumigator diisi.');
            return;
        }

        put(route('orders.update', order.id));
    };

    // ==================================
    //  State & UI for Temperature Dialog
    // ==================================
    const [isTempDialogOpen, setIsTempDialogOpen] = useState(false);
    const [tempOrderIndex, setTempOrderIndex] = useState<number | null>(null);
    const [tempRecords, setTempRecords] = useState<TemperatureRecord[]>([]);

    const openTempModal = (index: number) => {
        setTempOrderIndex(index);
        const prev = data.order_items[index]?.temperature;
        if (prev && Object.keys(prev).length > 0) {
            const records: TemperatureRecord[] = Object.entries(prev).map(([date, temps]) => ({ date, temps }));
            setTempRecords(records);
        } else {
            setTempRecords([
                {
                    date: new Date().toISOString().slice(0, 10),
                    temps: {},
                },
            ]);
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
                ...next[recordIdx].temps,
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

    const submitTempRecords = () => {
        if (tempOrderIndex === null) return;
        const formatted: { [date: string]: { [hour: string]: string } } = {};
        tempRecords.forEach((rec) => {
            if (rec.date) {
                formatted[rec.date] = rec.temps;
            }
        });
        const newItems = [...data.order_items];
        newItems[tempOrderIndex] = {
            ...newItems[tempOrderIndex],
            temperature: formatted,
        };
        setData('order_items', newItems);
        setIsTempDialogOpen(false);
        setTempOrderIndex(null);
        setTempRecords([]);
    };

    const formatErrorMessage = (key: string, message: string) => {
        const cleanKey = key.replace(/^order_items\.\d+\./, '');
        const labelMap: Record<string, string> = {
            customer_id: 'Customer',
            shipper_id: 'Shipper',
            no_aju: 'Nomor AJU',
            product_id: 'Produk',
            container_number: 'Nomor Kontainer',
            entry_date: 'Tanggal Masuk',
            eir_date: 'Tanggal EIR',
            exit_date: 'Tanggal Keluar',
            commodity: 'Komoditi',
            country: 'Negara',
            vessel: 'Nama Kapal',
            price_type: 'Tipe Harga',
            additional_product_ids: 'Produk Tambahan',
            temperature: 'Rekam Suhu',
            order_items: 'Item order',
        };

        const fieldLabel =
            labelMap[cleanKey] ||
            cleanKey
                .split('_')
                .join(' ')
                .replace(/\b\w/g, (l) => l.toUpperCase());

        const cleanMessage = message
            .replace(/^The /, '')
            .replace(/ for order items \d+$/, '')
            .replace(/ in order items \d+$/, '')
            .replace(/order_items\.\d+\./g, '')
            .replace(/\.$/, '')
            .trim();

        return `${fieldLabel} ${cleanMessage}`;
    };

    // ==================================
    //  Render JSX
    // ==================================
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Order: ${order.order_id}`} />
            <OrdersLayout>
                <div className="mx-auto max-w-5xl space-y-6 pb-12">
                    {/* Header */}
                    <div>
                        <Heading
                            title={`Edit Order: ${order.order_id}`}
                            description="Ubah informasi order, customer, shipper, serta rincian layanan kontainer yang terkait."
                        />
                    </div>

                    {/* Alert Error Umum */}
                    {data.error && (
                        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-xs">
                            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                            <div className="flex-1">
                                <strong className="font-semibold">Perhatian:</strong>
                                <p className="mt-0.5 text-xs text-red-700">{data.error}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setData('error', undefined)}
                                className="text-red-400 hover:text-red-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* Alert Validation Errors */}
                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-xs">
                            <div className="flex items-center gap-2 font-semibold">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <span>Terdapat kesalahan pada input berikut:</span>
                            </div>
                            <ul className="mt-2 list-disc pl-6 space-y-1 text-xs text-red-700">
                                {Object.entries(errors).map(([key, message]) => (
                                    <li key={key}>{formatErrorMessage(key, message as string)}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section 1: Informasi Order & Pengirim */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-5">
                            <div className="flex items-center gap-2 border-b pb-3">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <h2 className="text-base font-bold text-gray-900">Informasi Order & Pengirim</h2>
                            </div>

                            {/* Pilihan Format Identifikasi Order */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-xs font-bold text-gray-800">
                                        Format Identifikasi Order
                                    </Label>
                                    <p className="text-[11px] text-gray-500 mt-0.5">
                                        Pilih apakah order menggunakan nomor otomatis yang digenerate oleh sistem atau nomor dokumen Bea Cukai (AJU).
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                                    <button
                                        type="button"
                                        onClick={handleSwitchToOrderId}
                                        className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                            useOrderId
                                                ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`p-2.5 rounded-lg shrink-0 ${
                                            useOrderId ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            <Hash className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-900">Nomor Order Otomatis</span>
                                                {useOrderId && (
                                                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Aktif</span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-gray-500 leading-relaxed">
                                                Sistem mengenerate ID unik otomatis (ORD-YYYYMMDD-XXXX).
                                            </p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSwitchToNoAju}
                                        className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                            !useOrderId
                                                ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`p-2.5 rounded-lg shrink-0 ${
                                            !useOrderId ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            <FileCheck className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-900">Nomor AJU</span>
                                                {!useOrderId && (
                                                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Aktif</span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-gray-500 leading-relaxed">
                                                Input manual nomor dokumen pengajuan pabean / Bea Cukai.
                                            </p>
                                        </div>
                                    </button>
                                </div>

                                {/* Active Input Field with generous spacing */}
                                <div className="pt-1">
                                    {useOrderId ? (
                                        <div className="space-y-1.5 max-w-md">
                                            <Label htmlFor="order_id_display" className="text-xs font-semibold text-gray-700">
                                                Nomor Order Terdaftar
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="order_id_display"
                                                    value={currentOrderId}
                                                    readOnly
                                                    className="bg-gray-50/90 font-mono text-xs font-bold text-gray-800 cursor-not-allowed pl-9 h-10 border-gray-200"
                                                />
                                                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            </div>
                                            <p className="text-[11px] text-gray-400">
                                                Nomor order terdaftar dalam sistem.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5 max-w-md">
                                            <Label htmlFor="no_aju" className="text-xs font-semibold text-gray-700">
                                                Nomor AJU <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="no_aju"
                                                    value={data.no_aju}
                                                    onChange={(e) => setData('no_aju', e.target.value)}
                                                    placeholder="Contoh: 000000-000000-20260908-000001"
                                                    required
                                                    className="text-xs font-mono pl-9 h-10 border-gray-300 focus:border-blue-500"
                                                />
                                                <FileCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            </div>
                                            {errors.no_aju && <p className="text-xs text-red-500">{errors.no_aju}</p>}
                                            <p className="text-[11px] text-gray-400">
                                                Pastikan nomor AJU sesuai dengan dokumen pabean yang berlaku.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Customer & Shipper */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
                                {/* Customer */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700">
                                        Customer <span className="text-red-500">*</span>
                                    </Label>
                                    <SearchableSelect
                                        options={customers.map((c) => ({
                                            value: c.id.toString(),
                                            label: c.name,
                                        }))}
                                        value={data.customer_id}
                                        onChange={(val) => setData('customer_id', val)}
                                        placeholder="Pilih atau cari Customer..."
                                        searchPlaceholder="Ketik nama customer..."
                                        showClear
                                    />
                                    {errors.customer_id && (
                                        <p className="text-xs text-red-500">{errors.customer_id}</p>
                                    )}
                                </div>

                                {/* Shipper */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700">
                                        Shipper{' '}
                                        {data.fumigasi && data.fumigasi.trim() !== '' && (
                                            <span className="text-red-500">* (Wajib karena ada catatan Fumigator)</span>
                                        )}
                                    </Label>
                                    <SearchableSelect
                                        options={shippers.map((s) => ({
                                            value: s.id.toString(),
                                            label: s.name,
                                        }))}
                                        value={data.shipper_id}
                                        onChange={(val) => setData('shipper_id', val)}
                                        placeholder="Pilih atau cari Shipper..."
                                        searchPlaceholder="Ketik nama shipper..."
                                        showClear
                                    />
                                    {errors.shipper_id && (
                                        <p className="text-xs text-red-500">{errors.shipper_id}</p>
                                    )}
                                </div>
                            </div>

                            {/* Fumigator Catatan */}
                            <div className="space-y-1.5 pt-2">
                                <Label htmlFor="fumigasi" className="text-xs font-semibold text-gray-700">
                                    Fumigator (Catatan Opsional)
                                </Label>
                                <textarea
                                    id="fumigasi"
                                    value={data.fumigasi ?? ''}
                                    onChange={(e) => setData('fumigasi', e.target.value)}
                                    placeholder="Masukkan catatan Fumigator jika ada (opsional)... Bila diisi, kolom Shipper wajib dipilih."
                                    rows={2}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs transition-colors hover:border-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                />
                                {errors.fumigasi && <p className="text-xs text-red-500">{errors.fumigasi}</p>}
                            </div>
                        </div>

                        {/* Section 2: Layanan & Nomor Kontainer */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-base font-bold text-gray-900">Layanan & Nomor Kontainer</h2>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">
                                    Total: {data.order_items.length} Kontainer
                                </span>
                            </div>

                            {data.order_items.map((item, idx) => {
                                const product = getSelectedProduct(item.product_id);
                                const requiresTemp = product?.requires_temperature || false;
                                const priceOptions = [
                                    {
                                        label: 'Harga 20ft',
                                        value: '20ft',
                                        price: product?.custom_price_20ft,
                                    },
                                    {
                                        label: 'Harga 40ft',
                                        value: '40ft',
                                        price: product?.custom_price_40ft,
                                    },
                                    {
                                        label: 'Harga 45ft',
                                        value: '45ft',
                                        price: product?.custom_price_45ft,
                                    },
                                    {
                                        label: 'Harga Global',
                                        value: 'global',
                                        price: product?.custom_global_price,
                                    },
                                ].filter((o) => o.price !== undefined && o.price !== null && o.price !== '');

                                return (
                                    <div
                                        key={idx}
                                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4 transition-all hover:border-gray-300"
                                    >
                                        {/* Card Header */}
                                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                            <div className="flex items-center gap-2.5">
                                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                                    {idx + 1}
                                                </span>
                                                <h3 className="text-sm font-bold text-gray-900">
                                                    Layanan #{idx + 1}
                                                </h3>
                                                {item.container_number && (
                                                    <span className="font-mono text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200">
                                                        {item.container_number}
                                                    </span>
                                                )}
                                                {product && (
                                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                                                        {product.service_type}
                                                    </span>
                                                )}
                                            </div>

                                            {data.order_items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeOrderItem(idx)}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Hapus
                                                </button>
                                            )}
                                        </div>

                                        {/* Row 1: Produk, Harga, Nomor Kontainer */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Produk */}
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-gray-700">
                                                    Produk / Layanan <span className="text-red-500">*</span>
                                                </Label>
                                                <SearchableSelect
                                                    options={customerProducts.map((p) => ({
                                                        value: p.id.toString(),
                                                        label: p.service_type,
                                                        subLabel: p.requires_temperature ? 'Perlu Rekam Suhu' : undefined,
                                                    }))}
                                                    value={item.product_id}
                                                    onChange={(val) => {
                                                        updateOrderItem(idx, 'product_id', val);
                                                        updateOrderItem(idx, 'price_type', undefined);
                                                    }}
                                                    placeholder={
                                                        productsLoading
                                                            ? 'Memuat layanan...'
                                                            : data.customer_id
                                                            ? 'Pilih Layanan Utama'
                                                            : 'Pilih Customer terlebih dahulu'
                                                    }
                                                    searchPlaceholder="Cari layanan..."
                                                    disabled={!data.customer_id || productsLoading}
                                                    showClear
                                                />
                                            </div>

                                            {/* Pilih Harga */}
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-gray-700">
                                                    Pilih Harga <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    value={item.price_type}
                                                    onValueChange={(val) =>
                                                        updateOrderItem(idx, 'price_type', val as '20ft' | '40ft' | '45ft' | 'global')
                                                    }
                                                    disabled={!item.product_id || priceOptions.length === 0}
                                                >
                                                    <SelectTrigger className="h-10">
                                                        <SelectValue placeholder="Pilih Tipe Harga" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {priceOptions.map((o) => (
                                                            <SelectItem key={o.value} value={o.value}>
                                                                {o.label}{' '}
                                                                {o.price
                                                                    ? `: Rp${Number(o.price).toLocaleString('id-ID')}`
                                                                    : ''}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {item.product_id && priceOptions.length === 0 && (
                                                    <p className="text-[11px] text-red-500">
                                                        Tidak ada harga terdaftar untuk produk ini
                                                    </p>
                                                )}
                                            </div>

                                            {/* Nomor Kontainer */}
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-gray-700">
                                                    Nomor Kontainer <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    value={item.container_number}
                                                    onChange={(e) =>
                                                        updateOrderItem(idx, 'container_number', e.target.value.toUpperCase())
                                                    }
                                                    placeholder="Contoh: EMCU1234567"
                                                    maxLength={11}
                                                    className="h-10 font-mono text-sm tracking-wider"
                                                />
                                                {hasDuplicateContainer(idx) && (
                                                    <p className="text-[11px] text-red-500 font-medium">
                                                        Nomor kontainer sudah dipakai pada layanan lain
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Row 2: Additional Products */}
                                        <div className="space-y-2 pt-2 border-t border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-semibold text-gray-700">
                                                    Additional Produk (Produk Tambahan)
                                                </Label>
                                                <span className="text-[11px] text-gray-400">
                                                    {item.additional_product_ids?.length || 0} dipilih
                                                </span>
                                            </div>

                                            {customerProducts.filter((p) => p.id.toString() !== item.product_id).length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-40 overflow-y-auto p-2.5 rounded-lg border border-gray-200 bg-gray-50/50">
                                                    {customerProducts
                                                        .filter((p) => p.id.toString() !== item.product_id)
                                                        .map((p) => {
                                                            const isChecked = item.additional_product_ids?.includes(p.id.toString());
                                                            return (
                                                                <label
                                                                    key={p.id}
                                                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                                                                        isChecked
                                                                            ? 'border-blue-300 bg-blue-50/80 text-blue-900 shadow-2xs font-semibold'
                                                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={(e) => {
                                                                            const checked = e.target.checked;
                                                                            const val = p.id.toString();
                                                                            let next = item.additional_product_ids?.slice() || [];

                                                                            if (checked) {
                                                                                if (!next.includes(val)) next.push(val);
                                                                            } else {
                                                                                next = next.filter((v) => v !== val);
                                                                            }

                                                                            updateOrderItem(idx, 'additional_product_ids', next);
                                                                            const additionalPrices = getAdditionalProductPrices(next, item.price_type, customerProducts);
                                                                            updateOrderItem(idx, 'additional_product_prices', additionalPrices);
                                                                        }}
                                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                    />
                                                                    <span className="truncate">{p.service_type}</span>
                                                                </label>
                                                            );
                                                        })}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-400 italic py-2 px-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    {data.customer_id
                                                        ? 'Tidak ada produk tambahan yang tersedia untuk customer ini.'
                                                        : 'Pilih customer terlebih dahulu untuk memuat produk tambahan.'}
                                                </div>
                                            )}
                                        </div>

                                        {/* Row 3: Pengiriman & Muatan */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-gray-700">Negara Asal / Tujuan</Label>
                                                <Input
                                                    value={item.country}
                                                    onChange={(e) => updateOrderItem(idx, 'country', e.target.value)}
                                                    placeholder="Contoh: Indonesia, China"
                                                    className="h-10"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-gray-700">Nama Kapal (Vessel)</Label>
                                                <Input
                                                    value={item.vessel || ''}
                                                    onChange={(e) => updateOrderItem(idx, 'vessel', e.target.value)}
                                                    placeholder="Contoh: KMTC Jakarta"
                                                    className="h-10"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-gray-700">Komoditi</Label>
                                                <Input
                                                    value={item.commodity}
                                                    onChange={(e) => updateOrderItem(idx, 'commodity', e.target.value)}
                                                    placeholder="Contoh: Barang Elektronik"
                                                    className="h-10"
                                                />
                                            </div>
                                        </div>

                                        {/* Row 4: Jadwal Tanggal & Waktu */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-gray-700">Tanggal & Jam Masuk</Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={item.entry_date}
                                                    onChange={(e) => updateOrderItem(idx, 'entry_date', e.target.value)}
                                                    className="h-10"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-gray-700">Tanggal & Jam EIR</Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={item.eir_date}
                                                    onChange={(e) => updateOrderItem(idx, 'eir_date', e.target.value)}
                                                    className="h-10"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-gray-700">Tanggal & Jam Keluar</Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={item.exit_date}
                                                    onChange={(e) => updateOrderItem(idx, 'exit_date', e.target.value)}
                                                    className="h-10"
                                                />
                                            </div>
                                        </div>

                                        {/* Row 5: Rekam Suhu Banner */}
                                        {requiresTemp && (
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-cyan-200 bg-cyan-50/70 text-cyan-900 mt-2">
                                                <div className="flex items-center gap-2.5">
                                                    <Thermometer className="h-5 w-5 text-cyan-600 shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-bold text-cyan-950">
                                                            Layanan ini memerlukan pencatatan suhu kontainer
                                                        </p>
                                                        <p className="text-[11px] text-cyan-700">
                                                            {Object.keys(item.temperature || {}).length > 0
                                                                ? `${Object.keys(item.temperature || {}).length} tanggal suhu telah dicatat`
                                                                : 'Belum ada data suhu yang direkam untuk kontainer ini.'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openTempModal(idx)}
                                                    className="border-cyan-300 bg-white text-cyan-800 hover:bg-cyan-100 text-xs font-semibold gap-1.5 self-start sm:self-center"
                                                >
                                                    <Thermometer className="h-3.5 w-3.5 text-cyan-600" />
                                                    Rekam Suhu
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Tombol Tambah Layanan */}
                            <button
                                type="button"
                                onClick={addOrderItem}
                                className="w-full py-4 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 text-gray-600 font-semibold text-xs flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Layanan / Kontainer Baru
                            </button>
                        </div>

                        {/* Hidden Inputs */}
                        {useOrderId && <input type="hidden" name="order_id" value={currentOrderId} />}
                        <input type="hidden" name="order_items" value={JSON.stringify(data.order_items)} />

                        {/* Submit Button & Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                            <Button variant="outline" asChild>
                                <Link href="/orders" className="text-xs font-semibold">
                                    Batal
                                </Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 text-xs shadow-sm flex items-center gap-2"
                            >
                                {processing && <span className="mr-1 animate-spin">●</span>}
                                {processing ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>

                        {/* Temperature Dialog */}
                        <Dialog open={isTempDialogOpen} onOpenChange={setIsTempDialogOpen}>
                            <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                    <DialogTitle>Rekam Suhu Kontainer</DialogTitle>
                                </DialogHeader>
                                <div className="max-h-[60vh] space-y-5 overflow-y-auto pr-2">
                                    {tempRecords.map((rec, rIdx) => (
                                        <div key={rIdx} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                                            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor={`date_${rIdx}`} className="text-xs font-semibold text-gray-700">
                                                        Tanggal:
                                                    </Label>
                                                    <Input
                                                        id={`date_${rIdx}`}
                                                        type="date"
                                                        value={rec.date}
                                                        onChange={(e) => updateDate(rIdx, e.target.value)}
                                                        className="w-44 h-9 text-xs"
                                                    />
                                                </div>
                                                {tempRecords.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDateRecord(rIdx)}
                                                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                                        title="Hapus Tanggal"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>

                                            {/* 24 Jam Input Grid */}
                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                                {[...Array(24)].map((_, h) => {
                                                    const hourStr = h.toString().padStart(2, '0');
                                                    return (
                                                        <div
                                                            key={h}
                                                            className="flex flex-col gap-1 p-1.5 rounded-lg border border-gray-100 bg-gray-50/50"
                                                        >
                                                            <span className="text-[10px] font-semibold text-gray-500">
                                                                {hourStr}:00
                                                            </span>
                                                            <Input
                                                                type="number"
                                                                step="0.1"
                                                                placeholder="°C"
                                                                value={rec.temps[hourStr] || ''}
                                                                onChange={(e) => updateTemp(rIdx, h, e.target.value)}
                                                                className="h-8 text-xs bg-white text-center font-mono"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addDateRecord}
                                        className="gap-1.5 text-xs font-semibold"
                                    >
                                        <PlusCircle className="h-4 w-4 text-blue-600" />
                                        Tambah Tanggal Lain
                                    </Button>
                                </div>
                                <DialogFooter className="gap-2">
                                    <Button variant="outline" onClick={() => setIsTempDialogOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button onClick={submitTempRecords} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Simpan Rekam Suhu
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </form>
                </div>
            </OrdersLayout>
        </AppLayout>
    );
}
