import React from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import OrdersLayout from '@/layouts/orders/layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Container,
    Building2,
    Truck,
    Calendar,
    FileText,
    ExternalLink,
    Clock,
    Ship,
    Globe,
    Layers,
    Tag,
    Pencil,
} from 'lucide-react';
import { type SharedData } from '@/types';
import ContainerTemperatureView from '@/components/container-temperature-view';
import { formatDateTimeIndo } from '@/components/temperature-print-modal';

interface OrderItem {
    id: number;
    product: { id?: number; service_type: string };
    container_number: string;
    entry_date?: string | null;
    eir_date?: string | null;
    exit_date?: string | null;
    commodity?: string | null;
    country?: string | null;
    vessel?: string | null;
    price_type?: string | null;
    price_value?: string | number | null;
    additional_products?: { id?: number; service_type: string }[];
    start_plug_in?: string | null;
    plug_out?: string | null;
    plug_duration_minutes?: number | null;
    total_shifts?: number | null;
    rekam_suhu?: { id?: number; tanggal: string; jam_data: Record<string, string> }[];
}

interface OrderHeader {
    id: number;
    order_id: string;
    no_aju?: string | null;
    customer?: { id?: number; name: string };
    shipper?: { id?: number; name: string } | null;
}

interface Props {
    order: OrderHeader;
    orderItem: OrderItem;
    return_url?: string;
}

export default function ShowSingleOrderItem({ order, orderItem, return_url: initialReturnUrl }: Props) {
    const { auth } = usePage<SharedData>().props;
    const roleId = auth?.user?.role_id;
    const isRoleKarantina = roleId == 4;

    const returnUrl =
        initialReturnUrl ||
        (typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('return_url')
            : null);
    const backUrl = isRoleKarantina ? '/karantina' : returnUrl || route('orders.index');

    const statusText = orderItem.exit_date
        ? 'Gate Out'
        : orderItem.entry_date
        ? 'In Yard'
        : 'Belum Masuk';

    const statusBadgeClass = orderItem.exit_date
        ? 'bg-purple-50 text-purple-700 border-purple-200'
        : orderItem.entry_date
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-amber-50 text-amber-700 border-amber-200';

    const hasTemp = Boolean(
        (orderItem.rekam_suhu && orderItem.rekam_suhu.length > 0) ||
        orderItem.start_plug_in ||
        orderItem.plug_out
    );

    return (
        <AppLayout>
            <Head title={`Detail Kontainer: ${orderItem.container_number}`} />
            <OrdersLayout>
                <div className="space-y-6 max-w-7xl mx-auto pb-12">
                    {/* Header Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm">
                                    <Container className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl sm:text-2xl font-mono font-extrabold tracking-tight text-gray-900">
                                            {orderItem.container_number}
                                        </h1>
                                        {orderItem.price_type && (
                                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-800 border border-slate-200">
                                                {orderItem.price_type}
                                            </span>
                                        )}
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${statusBadgeClass}`}
                                        >
                                            {statusText}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                        Layanan: <strong className="text-gray-700">{orderItem.product?.service_type || 'Depo'}</strong> • Order ID: <strong className="text-gray-700">#{order.order_id}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="outline" size="sm" asChild className="h-9 gap-1.5 shadow-2xs">
                                <Link href={`/orders/${order.id}/detail?item=${orderItem.id}`}>
                                    <ExternalLink className="h-3.5 w-3.5 text-gray-600" />
                                    <span>Buka Order Penuh</span>
                                </Link>
                            </Button>

                            {!isRoleKarantina && (
                                <Button variant="outline" size="sm" asChild className="h-9 gap-1.5 shadow-2xs">
                                    <Link href={route('orders.items.edit', { order: order.id, orderItem: orderItem.id })}>
                                        <Pencil className="h-3.5 w-3.5 text-gray-600" />
                                        <span>Edit Kontainer</span>
                                    </Link>
                                </Button>
                            )}

                            <Button size="sm" asChild className="bg-gray-900 hover:bg-black text-white h-9 gap-1.5 shadow-xs">
                                <Link href={backUrl}>
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                    <span>Kembali</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Card Informasi Order & Mitra Terkait */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                            <FileText className="h-4 w-4 text-indigo-600" />
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Informasi Order & Mitra
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-xs">
                            <div className="space-y-1">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                                    Nomor Order
                                </span>
                                <Link
                                    href={`/orders/${order.id}/detail?item=${orderItem.id}`}
                                    className="font-mono font-bold text-indigo-600 hover:text-indigo-800 text-sm inline-flex items-center gap-1"
                                >
                                    <span>{order.order_id}</span>
                                    <ExternalLink className="h-3 w-3" />
                                </Link>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                                    Nomor AJU
                                </span>
                                <p className="font-mono font-medium text-gray-800 text-sm">
                                    {order.no_aju || '-'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    <Building2 className="h-3 w-3 text-gray-400" />
                                    Customer
                                </span>
                                <p className="font-bold text-gray-900 text-sm">
                                    {order.customer?.name || '-'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    <Truck className="h-3 w-3 text-gray-400" />
                                    Shipper / Eksportir
                                </span>
                                <p className="font-medium text-gray-800 text-sm">
                                    {order.shipper?.name || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card Spesifikasi & Logistik Kontainer */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <Container className="h-4 w-4 text-gray-700" />
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Spesifikasi Layanan & Data Logistik
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                            <div className="space-y-0.5">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    Entry Date
                                </span>
                                <p className="font-mono text-gray-800">
                                    {formatDateTimeIndo(orderItem.entry_date)}
                                </p>
                            </div>

                            <div className="space-y-0.5">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    EIR Date
                                </span>
                                <p className="font-mono text-gray-800">
                                    {formatDateTimeIndo(orderItem.eir_date)}
                                </p>
                            </div>

                            <div className="space-y-0.5">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    Exit Date
                                </span>
                                <p className="font-mono text-gray-800">
                                    {formatDateTimeIndo(orderItem.exit_date)}
                                </p>
                            </div>

                            <div className="space-y-0.5">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                    <Tag className="h-3 w-3 text-gray-400" />
                                    Harga Layanan
                                </span>
                                <p className="font-semibold text-gray-900">
                                    {orderItem.price_value
                                        ? `Rp ${Number(orderItem.price_value).toLocaleString('id-ID')}`
                                        : '-'}
                                </p>
                            </div>

                            <div className="space-y-0.5">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase">
                                    Komoditi
                                </span>
                                <p className="font-medium text-gray-800">
                                    {orderItem.commodity || '-'}
                                </p>
                            </div>

                            <div className="space-y-0.5">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                    <Globe className="h-3 w-3 text-gray-400" />
                                    Negara Tujuan
                                </span>
                                <p className="font-medium text-gray-800">
                                    {orderItem.country || '-'}
                                </p>
                            </div>

                            <div className="space-y-0.5">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                    <Ship className="h-3 w-3 text-gray-400" />
                                    Vessel / Kapal
                                </span>
                                <p className="font-medium text-gray-800">
                                    {orderItem.vessel || '-'}
                                </p>
                            </div>

                            <div className="space-y-0.5">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                    <Layers className="h-3 w-3 text-gray-400" />
                                    Produk Tambahan
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {orderItem.additional_products && orderItem.additional_products.length > 0 ? (
                                        orderItem.additional_products.map((p, pIdx) => (
                                            <span
                                                key={pIdx}
                                                className="inline-block bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded text-[11px] font-medium"
                                            >
                                                {p.service_type}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bagian Rekam Suhu & Operasional Reefer */}
                        {hasTemp ? (
                            <div className="mt-4 border-t border-gray-100 pt-4">
                                <ContainerTemperatureView
                                    containerNumber={orderItem.container_number}
                                    rekamSuhu={orderItem.rekam_suhu}
                                    startPlugIn={orderItem.start_plug_in}
                                    plugOut={orderItem.plug_out}
                                    plugDurationMinutes={orderItem.plug_duration_minutes}
                                    totalShifts={orderItem.total_shifts}
                                    printData={{
                                        container_number: orderItem.container_number,
                                        size: orderItem.price_type,
                                        service_type: orderItem.product?.service_type,
                                        commodity: orderItem.commodity,
                                        order_id: order.order_id,
                                        no_aju: order.no_aju,
                                        customer_name: order.customer?.name,
                                        shipper_name: order.shipper?.name,
                                        entry_date: orderItem.entry_date,
                                        exit_date: orderItem.exit_date,
                                        start_plug_in: orderItem.start_plug_in,
                                        plug_out: orderItem.plug_out,
                                        plug_duration_minutes: orderItem.plug_duration_minutes,
                                        total_shifts: orderItem.total_shifts,
                                        rekam_suhu: orderItem.rekam_suhu,
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 text-center text-xs text-gray-500">
                                Kontainer ini tidak memiliki catatan suhu atau data operasional plug-in pendingin.
                            </div>
                        )}
                    </div>
                </div>
            </OrdersLayout>
        </AppLayout>
    );
}
