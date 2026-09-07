import AppLayout from '@/layouts/app-layout';
import InvoicesLayout from '@/layouts/invoices/layout';
import { terbilang } from '@/lib/terbilang';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Edit, Printer } from 'lucide-react';
import React, { useMemo } from 'react';

// ==== Types ====
interface AdditionalProduct {
    id: number;
    service_type?: string;
    price_value?: number;
    pivot?: { price_value?: number; quantity?: number };
}

interface Product {
    service_type?: string;
}

interface OrderItem {
    id: number;
    container_number: string;
    entry_date?: string | null;
    exit_date?: string | null;
    price_value: number | string;
    price_type?: string;
    product?: Product;
    additional_products?: AdditionalProduct[];
}

interface Order {
    id: number;
    order_id: string;
}

interface Customer {
    id: number;
    name: string;
}

interface Company {
    name?: string;
    address?: string;
    phone?: string;
    fax?: string;
    bank_name?: string;
    bank_account?: string;
    bank_holder?: string;
    logo?: string;
}

interface InvoicePayload {
    id: number;
    invoice_number: string;
    period_start: string;
    period_end: string;
    subtotal: number;
    discount?: number;
    ppn: number;
    materai: number;
    grand_total: number;
    terbilang: string;
    status: string;
    show_period?: boolean;
    customer: Customer;
    order: Order;
    order_items: OrderItem[];
}

interface ActivityLogItem {
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

type PageProps = { invoice: InvoicePayload; company?: Company; activityLogs?: ActivityLogItem[] };

export default function ShowInvoice() {
    const page = usePage<PageProps>();
    const { invoice, company, activityLogs = [] } = page.props;
    const showPeriod = invoice.show_period ?? true;
    const discount = Number(invoice.discount || 0);
    const materai = Number(invoice.materai || 0);

    const st = (invoice.status ?? 'unpaid').toString().toLowerCase();
    const rupiah = (n: number) => Number(n || 0).toLocaleString('id-ID');
    const dateID = (d?: string | null) => (d ? new Date(d).toLocaleDateString('id-ID') : '-');

    // Format Tanggal / Jam: "8 Sep 2026 ; 23.41"
    const formatDateTimeSample = (d?: string | null) => {
        if (!d) return '-';
        try {
            const date = new Date(d);
            if (isNaN(date.getTime())) return '-';
            const day = date.getDate();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            const pad = (n: number) => n.toString().padStart(2, '0');
            const hours = pad(date.getHours());
            const minutes = pad(date.getMinutes());
            return `${day} ${month} ${year} ; ${hours}.${minutes}`;
        } catch {
            return '-';
        }
    };

    // Format tanggal kota Surabaya: "22 - 05 -2025"
    const formatSurabayaDate = (d?: string | null) => {
        const date = d ? new Date(d) : new Date();
        if (isNaN(date.getTime())) return new Date().toLocaleDateString('id-ID');
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(date.getDate())} - ${pad(date.getMonth() + 1)} - ${date.getFullYear()}`;
    };

    const formatPhone = (phone?: string) => {
        if (!phone) return 'Telp. 031-353 9484, 031-3539485';
        const clean = phone.trim();
        return /^telp\.?/i.test(clean) ? clean : `Telp. ${clean}`;
    };

    const formatFax = (fax?: string) => {
        if (!fax) return 'Fax. 031-3539482';
        const clean = fax.trim();
        return /^fax\.?/i.test(clean) ? clean : `Fax. ${clean}`;
    };

    // Struktur kontainer & rincian jasa
    const containers = useMemo(() => {
        let runningNo = 1;
        return (invoice.order_items ?? []).map((item) => {
            const mainPrice = Number(item.price_value ?? 0);
            const mainRow = {
                no: runningNo++,
                service: item.product?.service_type || (item.price_type ? `Jasa Kontainer (${item.price_type})` : 'Biaya Kontainer'),
                price: mainPrice,
                qty: 1,
                subtotal: mainPrice,
            };

            const additionals = (item.additional_products ?? [])
                .filter((ap) => (ap.pivot?.quantity ?? 1) > 0)
                .map((ap) => {
                    const price = Number(ap.pivot?.price_value ?? ap.price_value ?? 0);
                    const qty = Number(ap.pivot?.quantity ?? 1);
                    return {
                        no: runningNo++,
                        service: ap.service_type || 'Layanan Tambahan',
                        price,
                        qty,
                        subtotal: price * qty,
                    };
                });

            return {
                id: item.id,
                container_number: item.container_number,
                entry_date: item.entry_date,
                exit_date: item.exit_date,
                services: [mainRow, ...additionals],
            };
        });
    }, [invoice.order_items]);

    // Subtotal setelah diskon
    const afterDiscount = Math.max(0, invoice.subtotal - discount);
    const liveTerbilang = invoice.terbilang || terbilang(invoice.grand_total);

    // Fungsi cetak A4 (mencetak tampilan asli yang rapi dan presisi)
    const printInvoice = () => {
        window.print();
    };

    const markAsPaid = () => router.put(`/invoices/${invoice.id}/pay`);
    const markAsUnpaid = () => router.put(`/invoices/${invoice.id}/unpay`);

    return (
        <AppLayout>
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <style>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 8mm 10mm;
                    }
                    html, body {
                        background: #fff !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    aside, header, nav, [data-sidebar], .print\\:hidden, button, [role="navigation"] {
                        display: none !important;
                    }
                    .overflow-x-hidden {
                        overflow: visible !important;
                    }
                    main, section {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .px-4, .py-6, .pb-12, .space-y-4, .space-y-8, .space-y-12 {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    #invoice-content {
                        display: block !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 auto !important;
                        padding: 16px 20px !important;
                        border: 1.5px solid #000 !important;
                        box-sizing: border-box !important;
                        background: #fff !important;
                        box-shadow: none !important;
                    }
                    img.company-logo {
                        height: 46px !important;
                        max-height: 46px !important;
                        width: auto !important;
                        object-fit: contain !important;
                    }
                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                    }
                    .border { border: 1px solid #000 !important; }
                    .border-t { border-top: 1px solid #000 !important; }
                    .border-b { border-bottom: 1px solid #000 !important; }
                    .border-l { border-left: 1px solid #000 !important; }
                    .border-r { border-right: 1px solid #000 !important; }
                    .border-0 { border: none !important; }
                }
            `}</style>

            <InvoicesLayout>
                <div className="mx-auto max-w-4xl space-y-4 pb-12">
                    {/* Invoice Printable Frame Container */}
                    <div
                        id="invoice-content"
                        className="mx-auto w-full border-[1.5px] border-black bg-white p-5 text-black shadow-xs print:m-0 print:w-full print:border-[1.5px] print:border-black print:p-5"
                    >
                        {/* 1. Header Perusahaan */}
                        <div className="flex items-center gap-3.5 pb-1.5">
                            <img
                                src={company?.logo || '/logo.png'}
                                alt="DSS Logo"
                                style={{ height: '46px', maxHeight: '46px', width: 'auto', objectFit: 'contain' }}
                                className="company-logo h-11 w-auto object-contain shrink-0"
                            />
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-black leading-tight">
                                    {company?.name ?? 'PT. DEPO SURABAYA SEJAHTERA'}
                                </h1>
                                <div className="text-xs text-black font-medium leading-relaxed">
                                    {company?.address ?? 'Jl. Tanjung Sadari No. 90'}
                                </div>
                                <div className="text-xs text-black font-medium leading-relaxed">
                                    <span>{formatPhone(company?.phone)}</span>
                                    <span className="ml-4">{formatFax(company?.fax)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Garis Pembatas Header */}
                        <div className="border-t-[1.5px] border-black my-1.5" />

                        {/* 2. Customer & Informasi Invoice */}
                        <div className="flex justify-between items-start text-xs font-medium pb-1.5 pt-0.5">
                            <div className="space-y-0.5">
                                <div className="flex">
                                    <span className="w-24 font-bold text-gray-900">Customer</span>
                                    <span>: {invoice.customer?.name ?? '-'}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-24 font-bold text-gray-900">Invoice No</span>
                                    <span>: {invoice.invoice_number}</span>
                                </div>
                                {invoice.order?.order_id && (
                                    <div className="flex">
                                        <span className="w-24 font-bold text-gray-900">No Order/AJU</span>
                                        <span>: {invoice.order.order_id}</span>
                                    </div>
                                )}
                            </div>

                            {showPeriod && (
                                <div className="text-right text-xs">
                                    <span className="font-bold">Periode:</span>{' '}
                                    <span>
                                        {dateID(invoice.period_start)} – {dateID(invoice.period_end)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* 3. Tabel Layanan & Kontainer (Langsung di bawah AJU tanpa HR line pemisah) */}
                        <table className="w-full border-collapse border border-black text-xs">
                            <colgroup>
                                <col className="w-[6%]" />
                                <col className="w-[46%]" />
                                <col className="w-[16%]" />
                                <col className="w-[10%]" />
                                <col className="w-[22%]" />
                            </colgroup>
                            <tbody>
                                {containers.map((cont, contIdx) => (
                                    <React.Fragment key={cont.id || contIdx}>
                                        {/* Bar Informasi Kontainer & Waktu Gate In / Gate Out MERGED (TANPA PEMBATAS DI TENGAH) */}
                                        <tr className="bg-gray-50/50 print:bg-transparent">
                                            <td colSpan={5} className="border border-black px-2.5 py-1 align-top text-xs">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="font-bold text-xs pt-0.5">
                                                        No. Kontainer : <span className="tracking-wide">{cont.container_number}</span>
                                                    </div>
                                                    <div className="text-xs space-y-0.5">
                                                        <div className="flex justify-end gap-3">
                                                            <span className="font-semibold text-gray-800">Tanggal / Jam Masuk :</span>
                                                            <span className="font-semibold">{formatDateTimeSample(cont.entry_date)}</span>
                                                        </div>
                                                        <div className="flex justify-end gap-3">
                                                            <span className="font-semibold text-gray-800">Tanggal / Jam Keluar :</span>
                                                            <span className="font-semibold">{formatDateTimeSample(cont.exit_date)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Header Kolom Tabel */}
                                        <tr className="bg-gray-100/60 print:bg-transparent font-bold text-center">
                                            <td className="border border-black px-2 py-1 text-center">No</td>
                                            <td className="border border-black px-2 py-1 text-left">Jasa</td>
                                            <td className="border border-black px-2 py-1 text-right">Price</td>
                                            <td className="border border-black px-2 py-1 text-center">Qty</td>
                                            <td className="border border-black px-2.5 py-1 text-right">Subtotal</td>
                                        </tr>

                                        {/* Baris-baris Jasa */}
                                        {cont.services.map((svc) => (
                                            <tr key={svc.no}>
                                                <td className="border border-black px-2 py-1 text-center align-top">{svc.no}</td>
                                                <td className="border border-black px-2 py-1 align-top">{svc.service}</td>
                                                <td className="border border-black px-2 py-1 text-right align-top">
                                                    <div className="flex justify-between">
                                                        <span>Rp</span>
                                                        <span>{rupiah(svc.price)}</span>
                                                    </div>
                                                </td>
                                                <td className="border border-black px-2 py-1 text-center align-top">{svc.qty}</td>
                                                <td className="border border-black px-2.5 py-1 text-right align-top">
                                                    <div className="flex justify-between">
                                                        <span>Rp</span>
                                                        <span>{rupiah(svc.subtotal)}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}

                                {/* Baris Total (Subtotal) */}
                                <tr>
                                    <td colSpan={4} className="border-t border-black px-2.5 py-1 text-right font-bold">
                                        Total :
                                    </td>
                                    <td className="border-t border-l border-black px-2.5 py-1 text-right font-bold">
                                        <div className="flex justify-between">
                                            <span>Rp</span>
                                            <span>{rupiah(invoice.subtotal)}</span>
                                        </div>
                                    </td>
                                </tr>

                                {/* Baris Terbilang (Kiri: Cols 1-2) & Rincian Grand Total (Kanan: Cols 3-4 dan Col 5) */}
                                {discount > 0 ? (
                                    <>
                                        <tr>
                                            <td
                                                colSpan={2}
                                                rowSpan={5}
                                                className="border-t border-black px-3 py-2 align-top text-xs"
                                            >
                                                <div className="font-bold mb-1">Terbilang :</div>
                                                <div className="italic text-gray-900 leading-relaxed">
                                                    {liveTerbilang}
                                                </div>
                                            </td>
                                            <td colSpan={2} className="border-t border-black px-2.5 py-1 text-right font-medium">
                                                Diskon :
                                            </td>
                                            <td className="border-t border-l border-black px-2.5 py-1 text-right font-medium">
                                                <div className="flex justify-between">
                                                    <span>Rp</span>
                                                    <span>-{rupiah(discount)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2} className="px-2.5 py-1 text-right font-semibold">
                                                Grand Total :
                                            </td>
                                            <td className="border-l border-black px-2.5 py-1 text-right font-semibold">
                                                <div className="flex justify-between">
                                                    <span>Rp</span>
                                                    <span>{rupiah(afterDiscount)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={2}
                                            rowSpan={4}
                                            className="border-t border-black px-3 py-2 align-top text-xs"
                                        >
                                            <div className="font-bold mb-1">Terbilang :</div>
                                            <div className="italic text-gray-900 leading-relaxed">
                                                {liveTerbilang}
                                            </div>
                                        </td>
                                        <td colSpan={2} className="border-t border-black px-2.5 py-1 text-right font-semibold">
                                            Grand Total :
                                        </td>
                                        <td className="border-t border-l border-black px-2.5 py-1 text-right font-semibold">
                                            <div className="flex justify-between">
                                                <span>Rp</span>
                                                <span>{rupiah(afterDiscount)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                <tr>
                                    <td colSpan={2} className="px-2.5 py-1 text-right">
                                        PPN 11 % :
                                    </td>
                                    <td className="border-l border-black px-2.5 py-1 text-right">
                                        <div className="flex justify-between">
                                            <span>Rp</span>
                                            <span>{rupiah(invoice.ppn)}</span>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td colSpan={2} className="px-2.5 py-1 text-right">
                                        Materai :
                                    </td>
                                    <td className="border-l border-black px-2.5 py-1 text-right">
                                        {materai > 0 ? (
                                            <div className="flex justify-between">
                                                <span>Rp</span>
                                                <span>{rupiah(materai)}</span>
                                            </div>
                                        ) : (
                                            <span></span>
                                        )}
                                    </td>
                                </tr>

                                <tr className="font-bold text-sm">
                                    <td colSpan={2} className="px-2.5 py-1.5 text-right">
                                        Grand Total :
                                    </td>
                                    <td className="border-l border-black px-2.5 py-1.5 text-right">
                                        <div className="flex justify-between">
                                            <span>Rp</span>
                                            <span>{rupiah(invoice.grand_total)}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* 4. Footer: Pembayaran & Tanda Tangan */}
                        <div className="mt-3 pt-1 text-xs">
                            <div className="flex justify-between items-start">
                                {/* Kiri: Rekening Pembayaran */}
                                <div className="space-y-0.5 pt-1">
                                    <div className="font-semibold">Pembayaran ke Rekening {company?.bank_name ?? 'BCA'}:</div>
                                    <div className="text-sm font-bold tracking-wider">{company?.bank_account ?? '463 521 9999'}</div>
                                    <div className="text-gray-800">{company?.bank_holder ?? 'Depo Surabaya Sejahtera'}</div>
                                </div>

                                {/* Kanan: Tanggal Surabaya & Tanda Tangan (Rata Kanan Rapi & Pas di Tepi) */}
                                <div className="space-y-1 text-right">
                                    <div className="font-medium whitespace-nowrap">
                                        Surabaya, {formatSurabayaDate(invoice.period_end)}
                                    </div>
                                    <div className="h-20" />
                                    <div className="font-semibold whitespace-nowrap">
                                        (PT. Depo Surabaya Sejahtera)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi (Print, Edit, Bayar, Kembali) */}
                    <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 print:hidden">
                        <Link
                            href="/invoices"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                        <Link
                            href={`/invoices/${invoice.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 shadow-xs hover:bg-blue-100"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Invoice
                        </Link>
                        <button
                            type="button"
                            onClick={printInvoice}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-black"
                        >
                            <Printer className="h-4 w-4" />
                            Cetak A4
                        </button>
                        {st === 'unpaid' && (
                            <button
                                type="button"
                                onClick={markAsPaid}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Tandai Lunas
                            </button>
                        )}
                        {st === 'paid' && (
                            <button
                                type="button"
                                onClick={markAsUnpaid}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700"
                            >
                                Set Belum Lunas
                            </button>
                        )}
                    </div>

                    {/* Riwayat Aktivitas Invoice (Audit Trail) */}
                    {activityLogs && activityLogs.length > 0 && (
                        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs print:hidden">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                                Riwayat Aktivitas Invoice
                            </h3>
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
                                            <div className="text-gray-400 text-[11px]">
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
