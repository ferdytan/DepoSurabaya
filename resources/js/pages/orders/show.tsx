import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import OrdersLayout from '@/layouts/orders/layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Pencil,
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
} from 'lucide-react';
import { type SharedData } from '@/types';
import ContainerTemperatureView from '@/components/container-temperature-view';
import { formatDateTimeIndo } from '@/components/temperature-print-modal';

// Tipe data
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

interface OrderProps {
    id: number;
    order_id: string;
    no_aju?: string | null;
    customer: { id?: number; name: string };
    shipper?: { id?: number; name: string } | null;
    items: OrderItem[];
}

interface Props {
    order: OrderProps;
    return_url?: string;
}

export default function ShowOrder({ order, return_url: initialReturnUrl }: Props) {
    const { auth } = usePage<SharedData>().props;
    const roleId = auth?.user?.role_id;
    const isRoleKarantina = roleId == 4;

    const returnUrl =
        initialReturnUrl ||
        (typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('return_url')
            : null);
    const backUrl = isRoleKarantina ? '/karantina' : returnUrl || '/orders';

    // Highlight container yang dituju jika ada parameter `item` atau `highlight` di URL
    const highlightedItemId = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('item') ||
          new URLSearchParams(window.location.search).get('highlight')
        : null;

    const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

    useEffect(() => {
        if (highlightedItemId && itemRefs.current[highlightedItemId]) {
            setTimeout(() => {
                itemRefs.current[highlightedItemId]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 300);
        }
    }, [highlightedItemId]);

    return (
        <AppLayout>
            <Head title={`Detail Order: ${order.order_id}`} />
            <OrdersLayout>
                <div className="space-y-6 max-w-7xl mx-auto pb-12">
                    {/* Header Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                                    Detail Order: {order.order_id}
                                </h1>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                                    {order.items?.length || 0} Kontainer
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                Informasi lengkap manifest, rincian kontainer layanan, dan rekam temperatur.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {!isRoleKarantina && (
                                <Button variant="outline" size="sm" asChild className="h-9 gap-1.5 shadow-2xs">
                                    <Link
                                        href={`${route('orders.edit', order.id)}${
                                            backUrl ? `?return_url=${encodeURIComponent(backUrl)}` : ''
                                        }`}
                                    >
                                        <Pencil className="h-3.5 w-3.5 text-gray-600" />
                                        <span>Edit Order</span>
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

                    {/* Card Informasi Order Utama (Format Resmi & Rapi) */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                            <FileText className="h-4 w-4 text-indigo-600" />
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Informasi Order & Mitra
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-xs">
                            {/* Nomor Order */}
                            <div className="space-y-1">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                                    Nomor Order
                                </span>
                                <p className="font-mono font-bold text-gray-900 text-sm">
                                    {order.order_id}
                                </p>
                            </div>

                            {/* Nomor AJU */}
                            <div className="space-y-1">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                                    Nomor AJU
                                </span>
                                <p className="font-mono font-medium text-gray-800 text-sm">
                                    {order.no_aju || '-'}
                                </p>
                            </div>

                            {/* Customer */}
                            <div className="space-y-1">
                                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    <Building2 className="h-3 w-3 text-gray-400" />
                                    Customer
                                </span>
                                <p className="font-bold text-gray-900 text-sm">
                                    {order.customer?.name || '-'}
                                </p>
                            </div>

                            {/* Shipper */}
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

                    {/* Section Rincian Kontainer Layanan */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Container className="h-4 w-4 text-gray-700" />
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                    Daftar Layanan Kontainer ({order.items?.length || 0})
                                </h2>
                            </div>
                            <span className="text-xs text-gray-500">
                                Klik 'Detail Kontainer' untuk melihat lembar operasional spesifik
                            </span>
                        </div>

                        {order.items.map((item, idx) => {
                            const isHighlighted = highlightedItemId === String(item.id);
                            const hasTemp = Boolean(
                                (item.rekam_suhu && item.rekam_suhu.length > 0) ||
                                item.start_plug_in ||
                                item.plug_out
                            );

                            const statusText = item.exit_date
                                ? 'Gate Out'
                                : item.entry_date
                                ? 'In Yard'
                                : 'Belum Masuk';

                            const statusBadgeClass = item.exit_date
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : item.entry_date
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200';

                            return (
                                <div
                                    key={item.id}
                                    ref={(el) => {
                                        itemRefs.current[String(item.id)] = el;
                                    }}
                                    className={`rounded-xl border bg-white p-5 shadow-xs transition-all ${
                                        isHighlighted
                                            ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/10'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    {/* Header Kontainer Hero */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-4">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-800 font-bold text-xs">
                                                #{idx + 1}
                                            </span>

                                            <span className="font-mono font-extrabold text-base sm:text-lg text-gray-900 tracking-wider">
                                                {item.container_number}
                                            </span>

                                            {item.price_type && (
                                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-800 border border-slate-200">
                                                    {item.price_type}
                                                </span>
                                            )}

                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${statusBadgeClass}`}
                                            >
                                                {statusText}
                                            </span>

                                            <span className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-2 py-0.5">
                                                {item.product?.service_type || 'Layanan Depo'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                asChild
                                                className="h-8 text-xs font-semibold gap-1.5 border-gray-300 text-gray-700 hover:text-gray-900 shadow-2xs"
                                            >
                                                <Link href={`/orders/item/${item.id}`}>
                                                    <span>Detail Kontainer</span>
                                                    <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Data Logistik & Spesifikasi (Grid) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pb-3">
                                        {/* Entry Date */}
                                        <div className="space-y-0.5">
                                            <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                Entry Date
                                            </span>
                                            <p className="font-mono text-gray-800">
                                                {formatDateTimeIndo(item.entry_date)}
                                            </p>
                                        </div>

                                        {/* EIR Date */}
                                        <div className="space-y-0.5">
                                            <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-gray-400" />
                                                EIR Date
                                            </span>
                                            <p className="font-mono text-gray-800">
                                                {formatDateTimeIndo(item.eir_date)}
                                            </p>
                                        </div>

                                        {/* Exit Date */}
                                        <div className="space-y-0.5">
                                            <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                Exit Date
                                            </span>
                                            <p className="font-mono text-gray-800">
                                                {formatDateTimeIndo(item.exit_date)}
                                            </p>
                                        </div>

                                        {/* Harga */}
                                        <div className="space-y-0.5">
                                            <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                                <Tag className="h-3 w-3 text-gray-400" />
                                                Harga Layanan
                                            </span>
                                            <p className="font-semibold text-gray-900">
                                                {item.price_value
                                                    ? `Rp ${Number(item.price_value).toLocaleString('id-ID')}`
                                                    : '-'}
                                            </p>
                                        </div>

                                        {/* Komoditi */}
                                        <div className="space-y-0.5">
                                            <span className="text-[11px] font-semibold text-gray-500 uppercase">
                                                Komoditi
                                            </span>
                                            <p className="font-medium text-gray-800">
                                                {item.commodity || '-'}
                                            </p>
                                        </div>

                                        {/* Country */}
                                        <div className="space-y-0.5">
                                            <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                                <Globe className="h-3 w-3 text-gray-400" />
                                                Negara Tujuan
                                            </span>
                                            <p className="font-medium text-gray-800">
                                                {item.country || '-'}
                                            </p>
                                        </div>

                                        {/* Vessel */}
                                        <div className="space-y-0.5">
                                            <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                                <Ship className="h-3 w-3 text-gray-400" />
                                                Vessel / Kapal
                                            </span>
                                            <p className="font-medium text-gray-800">
                                                {item.vessel || '-'}
                                            </p>
                                        </div>

                                        {/* Additional Products */}
                                        <div className="space-y-0.5">
                                            <span className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                                <Layers className="h-3 w-3 text-gray-400" />
                                                Produk Tambahan
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                                {item.additional_products && item.additional_products.length > 0 ? (
                                                    item.additional_products.map((p, pIdx) => (
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

                                    {/* Monitoring & Matriks Suhu (Format Representatif PDF) */}
                                    {hasTemp && (
                                        <div className="mt-3 border-t border-gray-100 pt-3">
                                            <ContainerTemperatureView
                                                containerNumber={item.container_number}
                                                rekamSuhu={item.rekam_suhu}
                                                startPlugIn={item.start_plug_in}
                                                plugOut={item.plug_out}
                                                plugDurationMinutes={item.plug_duration_minutes}
                                                totalShifts={item.total_shifts}
                                                printData={{
                                                    container_number: item.container_number,
                                                    size: item.price_type,
                                                    service_type: item.product?.service_type,
                                                    commodity: item.commodity,
                                                    order_id: order.order_id,
                                                    no_aju: order.no_aju,
                                                    customer_name: order.customer?.name,
                                                    shipper_name: order.shipper?.name,
                                                    entry_date: item.entry_date,
                                                    exit_date: item.exit_date,
                                                    start_plug_in: item.start_plug_in,
                                                    plug_out: item.plug_out,
                                                    plug_duration_minutes: item.plug_duration_minutes,
                                                    total_shifts: item.total_shifts,
                                                    rekam_suhu: item.rekam_suhu,
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </OrdersLayout>
        </AppLayout>
    );
}
