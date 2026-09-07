import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import InvoicesLayout from '@/layouts/invoices/layout';
import { terbilang as toTerbilangWords } from '@/lib/terbilang';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Printer } from 'lucide-react';
import React, { useState } from 'react';

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
    order_items: OrderItem[];
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

interface InvoicePreviewProps {
    reuse_id?: number | null;
    customer: Customer;
    invoice_number: string;
    order: Order;
    period_start: string;
    period_end: string;
    status: string;
    subtotal: number;
    discount?: number;
    ppn: number;
    materai: number;
    grand_total: number;
    terbilang: string;
    show_period?: boolean;
}

type PageProps = { preview: InvoicePreviewProps; company?: Company };

export default function InvoicePreview() {
    const page = usePage<PageProps>();
    const { preview, company } = page.props;
    const {
        customer,
        invoice_number,
        order,
        period_start,
        period_end,
        show_period = true,
        discount = 0,
    } = preview;

    const dateID = (d?: string | null) => (d ? new Date(d).toLocaleDateString('id-ID') : '-');
    const rupiah = (n: number) => Number(n || 0).toLocaleString('id-ID');

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

    // --- State Qty untuk Additional Products ---
    const [addQty, setAddQty] = useState<Record<string, number>>(() => {
        const m: Record<string, number> = {};
        for (const item of order.order_items) {
            for (const ap of item.additional_products ?? []) {
                m[`${item.id}:${ap.id}`] = Number(ap.pivot?.quantity ?? 1);
            }
        }
        return m;
    });

    const getQty = (itemId: number, prodId: number) => addQty[`${itemId}:${prodId}`] ?? 0;
    const setQty = (itemId: number, prodId: number, val: number) => {
        const v = Number.isFinite(val) && val >= 0 ? Math.floor(val) : 0;
        setAddQty((prev) => ({ ...prev, [`${itemId}:${prodId}`]: v }));
    };

    // --- Hitung ulang total berdasarkan qty terbaru ---
    const materai = Number(preview.materai ?? 0);
    const safeDiscount = Number(discount || 0);

    const calc = () => {
        let subtotal = 0;
        for (const item of order.order_items) {
            subtotal += Number(item.price_value ?? 0);
            for (const ap of item.additional_products ?? []) {
                const price = Number(ap.pivot?.price_value ?? ap.price_value ?? 0);
                const qty = getQty(item.id, ap.id);
                subtotal += price * qty;
            }
        }
        const afterDiscount = Math.max(0, subtotal - safeDiscount);
        const ppn = Math.round(afterDiscount * 0.11);
        const grand_total = afterDiscount + ppn + materai;
        return { subtotal, afterDiscount, ppn, grand_total };
    };

    const totals = calc();
    const liveTerbilang = toTerbilangWords(totals.grand_total);

    const [isSaving, setIsSaving] = useState(false);

    const additionalSelections = order.order_items.flatMap((item) =>
        (item.additional_products ?? []).map((ap) => ({
            order_item_id: item.id,
            additional_product_id: ap.id,
            quantity: getQty(item.id, ap.id),
        })),
    );

    const formData = {
        reuse_id: preview.reuse_id || null,
        invoice_number,
        customer_id: customer.id,
        order_id: order.id,
        period_start,
        period_end,
        subtotal: totals.subtotal,
        discount: safeDiscount,
        ppn: totals.ppn,
        materai,
        grand_total: totals.grand_total,
        terbilang: liveTerbilang,
        order_item_ids: order.order_items.map((item) => item.id),
        additional_product_quantities: additionalSelections,
        show_period,
    };

    const handleSaveInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        router.post('/invoices/store', formData, {
            onSuccess: () => setIsSaving(false),
            onError: () => setIsSaving(false),
        });
    };

    // Fungsi cetak A4 (mencetak tampilan asli yang rapi dan presisi)
    const printInvoice = () => {
        window.print();
    };

    // Struktur urutan baris
    let runningNo = 1;

    return (
        <AppLayout>
            <Head title={`Preview Invoice - Order #${order.id}`} />

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
                    .screen-only {
                        display: none !important;
                    }
                    .print-only {
                        display: inline !important;
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
                                    <span>: {customer.name ?? '-'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-24 font-bold text-gray-900">Invoice No</span>
                                    <span>: {invoice_number || '(Draft Otomatis)'}</span>
                                    {preview.reuse_id && (
                                        <span className="ml-2 inline-flex items-center rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300 print:hidden">
                                            REUSE
                                        </span>
                                    )}
                                </div>
                                {order?.order_id && (
                                    <div className="flex">
                                        <span className="w-24 font-bold text-gray-900">No Order/AJU</span>
                                        <span>: {order.order_id}</span>
                                    </div>
                                )}
                            </div>

                            {show_period && (
                                <div className="text-right text-xs">
                                    <span className="font-bold">Periode:</span>{' '}
                                    <span>
                                        {dateID(period_start)} – {dateID(period_end)}
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
                                {order.order_items.map((item, itemIdx) => {
                                    const mainPrice = Number(item.price_value || 0);
                                    const itemNo = runningNo++;

                                    return (
                                        <React.Fragment key={item.id || itemIdx}>
                                            {/* Bar Informasi Kontainer & Waktu Gate In / Gate Out MERGED (TANPA PEMBATAS DI TENGAH) */}
                                            <tr className="bg-gray-50/50 print:bg-transparent">
                                                <td colSpan={5} className="border border-black px-2.5 py-1 align-top text-xs">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="font-bold text-xs pt-0.5">
                                                            No. Kontainer : <span className="tracking-wide">{item.container_number}</span>
                                                        </div>
                                                        <div className="text-xs space-y-0.5">
                                                            <div className="flex justify-end gap-3">
                                                                <span className="font-semibold text-gray-800">Tanggal / Jam Masuk :</span>
                                                                <span className="font-semibold">{formatDateTimeSample(item.entry_date)}</span>
                                                            </div>
                                                            <div className="flex justify-end gap-3">
                                                                <span className="font-semibold text-gray-800">Tanggal / Jam Keluar :</span>
                                                                <span className="font-semibold">{formatDateTimeSample(item.exit_date)}</span>
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

                                            {/* Baris Jasa Utama */}
                                            <tr>
                                                <td className="border border-black px-2 py-1 text-center align-top">{itemNo}</td>
                                                <td className="border border-black px-2 py-1 align-top">
                                                    {item.product?.service_type || (item.price_type ? `Jasa Kontainer (${item.price_type})` : 'Biaya Kontainer')}
                                                </td>
                                                <td className="border border-black px-2 py-1 text-right align-top">
                                                    <div className="flex justify-between">
                                                        <span>Rp</span>
                                                        <span>{rupiah(mainPrice)}</span>
                                                    </div>
                                                </td>
                                                <td className="border border-black px-2 py-1 text-center align-top">1</td>
                                                <td className="border border-black px-2.5 py-1 text-right align-top">
                                                    <div className="flex justify-between">
                                                        <span>Rp</span>
                                                        <span>{rupiah(mainPrice)}</span>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Baris Produk Tambahan (jika ada) */}
                                            {(item.additional_products ?? [])
                                                .filter((ap) => getQty(item.id, ap.id) > 0)
                                                .map((ap) => {
                                                    const price = Number(ap.pivot?.price_value ?? ap.price_value ?? 0);
                                                    const qty = getQty(item.id, ap.id);
                                                    const lineTotal = price * qty;
                                                    const addNo = runningNo++;

                                                    return (
                                                        <tr key={ap.id}>
                                                            <td className="border border-black px-2 py-1 text-center align-top">{addNo}</td>
                                                            <td className="border border-black px-2 py-1 align-top">
                                                                {ap.service_type || 'Layanan Tambahan'}
                                                            </td>
                                                            <td className="border border-black px-2 py-1 text-right align-top">
                                                                <div className="flex justify-between">
                                                                    <span>Rp</span>
                                                                    <span>{rupiah(price)}</span>
                                                                </div>
                                                            </td>
                                                            <td className="border border-black px-2 py-1 text-center align-top">
                                                                {/* Tampilan layar (bisa input) */}
                                                                <span className="screen-only inline-block">
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        step="1"
                                                                        value={qty}
                                                                        onChange={(e) => setQty(item.id, ap.id, Number(e.target.value))}
                                                                        className="w-12 rounded border border-gray-300 px-1 py-0.5 text-center text-xs font-semibold"
                                                                    />
                                                                </span>
                                                                {/* Tampilan print (teks saja) */}
                                                                <span className="print-only hidden">{qty}</span>
                                                            </td>
                                                            <td className="border border-black px-2.5 py-1 text-right align-top">
                                                                <div className="flex justify-between">
                                                                    <span>Rp</span>
                                                                    <span>{rupiah(lineTotal)}</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </React.Fragment>
                                    );
                                })}

                                {/* Baris Total (Subtotal) */}
                                <tr>
                                    <td colSpan={4} className="border-t border-black px-2.5 py-1 text-right font-bold">
                                        Total :
                                    </td>
                                    <td className="border-t border-l border-black px-2.5 py-1 text-right font-bold">
                                        <div className="flex justify-between">
                                            <span>Rp</span>
                                            <span>{rupiah(totals.subtotal)}</span>
                                        </div>
                                    </td>
                                </tr>

                                {/* Baris Terbilang (Kiri: Cols 1-2) & Rincian Grand Total (Kanan: Cols 3-4 dan Col 5) */}
                                {safeDiscount > 0 ? (
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
                                                    <span>-{rupiah(safeDiscount)}</span>
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
                                                    <span>{rupiah(totals.afterDiscount)}</span>
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
                                                <span>{rupiah(totals.afterDiscount)}</span>
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
                                            <span>{rupiah(totals.ppn)}</span>
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
                                            <span>{rupiah(totals.grand_total)}</span>
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
                                        Surabaya, {formatSurabayaDate(period_end)}
                                    </div>
                                    <div className="h-20" />
                                    <div className="font-semibold whitespace-nowrap">
                                        (PT. Depo Surabaya Sejahtera)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-2 print:hidden">
                        <Button variant="outline" asChild>
                            <Link
                                href={preview.reuse_id ? `/invoices/create?reuse_id=${preview.reuse_id}` : '/invoices/create'}
                                className="inline-flex items-center gap-1.5 text-xs"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Form
                            </Link>
                        </Button>
                        <button
                            type="button"
                            onClick={printInvoice}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
                        >
                            <Printer className="h-4 w-4" />
                            Cetak A4
                        </button>
                        <Button
                            onClick={handleSaveInvoice}
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 shadow-sm inline-flex items-center gap-2"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {isSaving ? 'Menyimpan...' : (preview.reuse_id ? 'Simpan Invoice (Reuse)' : 'Simpan Invoice')}
                        </Button>
                    </div>
                </div>
            </InvoicesLayout>
        </AppLayout>
    );
}
