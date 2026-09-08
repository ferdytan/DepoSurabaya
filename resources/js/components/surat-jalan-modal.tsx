import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer } from 'lucide-react';

export interface SuratJalanData {
    container_number: string;
    size?: string | null; // 20ft, 40ft, 45ft, etc.
    customer_name?: string | null;
    shipper_name?: string | null;
    service_type?: string | null;
    commodity?: string | null;
    no_aju?: string | null;
    order_id?: string | null;
    date?: string | null;
    seal_number?: string | null;
    police_number?: string | null;
    destination?: string | null;
    exit_time?: string | null;
    notes?: string | null;
}

interface SuratJalanModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: SuratJalanData | null;
}

export default function SuratJalanModal({ isOpen, onClose, data }: SuratJalanModalProps) {
    const printRef = useRef<HTMLDivElement>(null);

    // Dynamic state that can be fine-tuned before printing
    const [tanggal, setTanggal] = useState('');
    const [jamKeluar, setJamKeluar] = useState('');
    const [noPol, setNoPol] = useState('');
    const [tujuan, setTujuan] = useState('');
    const [noSegel, setNoSegel] = useState('');
    const [isi, setIsi] = useState('FULL CONT(ON-CHASIS)');
    const [keterangan, setKeterangan] = useState('');

    useEffect(() => {
        if (data) {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');

            setTanggal(data.date ? formatDateIndo(data.date) : `${day} - ${month} - ${year}`);
            setJamKeluar(data.exit_time || `${hours}:${mins}`);
            setNoPol(data.police_number || '');
            setTujuan(data.destination || '');
            setNoSegel(data.seal_number || '-');
            setIsi(data.commodity ? data.commodity.toUpperCase() : 'FULL CONT(ON-CHASIS)');
            setKeterangan(data.notes || '');
        }
    }, [data, isOpen]);

    function formatDateIndo(dateStr: string) {
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day} - ${month} - ${year}`;
        } catch {
            return dateStr;
        }
    }

    const formatContainerSize = (sz?: string | null) => {
        if (!sz) return '1 X 20"';
        const clean = sz.toLowerCase();
        if (clean.includes('45')) return '1 X 45"';
        if (clean.includes('40')) return '1 X 40"';
        if (clean.includes('20')) return '1 X 20"';
        return `1 X ${sz}`;
    };

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const printWindow = window.open('', '_blank', 'width=920,height=650');
        if (!printWindow) {
            alert('Popup terblokir oleh browser. Izinkan popup untuk mencetak Surat Jalan.');
            return;
        }

        const logoUrl = `${window.location.origin}/logo.png`;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Surat Jalan - ${data?.container_number || 'Depo Surabaya'}</title>
                <style>
                    @page {
                        size: 210mm 140mm; /* Ukuran Kertas 21 x 14 cm */
                        margin: 0;
                    }
                    * {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
                        color: #111;
                    }
                    body {
                        width: 210mm;
                        height: 140mm;
                        padding: 5mm 8mm 5mm 8mm;
                        background: #fff;
                        overflow: hidden;
                    }
                    .sj-container {
                        width: 100%;
                        height: 130mm;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }
                    
                    /* Header */
                    .header-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 1.5mm;
                    }
                    .company-brand {
                        display: flex;
                        align-items: center;
                        gap: 3mm;
                    }
                    .company-logo {
                        height: 38px;
                        width: auto;
                        object-fit: contain;
                        filter: grayscale(100%) contrast(150%);
                    }
                    .company-info {
                        flex: 1;
                    }
                    .company-title {
                        font-size: 13pt;
                        font-weight: 900;
                        letter-spacing: -0.2px;
                        line-height: 1.1;
                        color: #000;
                    }
                    .company-address {
                        font-size: 8pt;
                        font-weight: 600;
                        margin-top: 1px;
                        line-height: 1.2;
                    }
                    .company-telp {
                        font-size: 7.5pt;
                        line-height: 1.2;
                    }
                    .customer-row {
                        margin-top: 2.5mm;
                        font-size: 9pt;
                        font-weight: 800;
                        line-height: 1.25;
                    }
                    .customer-row .shipper {
                        font-weight: 700;
                        padding-left: 17mm;
                        color: #222;
                    }

                    /* Center Title Box: SURAT JALAN */
                    .title-sj-box {
                        border: 2px solid #000;
                        padding: 2mm 5mm;
                        text-align: center;
                        align-self: flex-start;
                        margin: 0 3mm;
                    }
                    .title-sj-text {
                        font-size: 12.5pt;
                        font-weight: 900;
                        letter-spacing: 2.5px;
                        line-height: 1;
                        color: #000;
                    }

                    /* Meta Box Kanan */
                    .meta-box {
                        width: 60mm;
                        border: 1.5px solid #000;
                        font-size: 8pt;
                    }
                    .meta-row {
                        display: flex;
                        border-bottom: 1px solid #000;
                        height: 5.8mm;
                        align-items: center;
                    }
                    .meta-row:last-child {
                        border-bottom: none;
                    }
                    .meta-label {
                        width: 21mm;
                        padding-left: 2mm;
                        font-weight: 600;
                    }
                    .meta-colon {
                        width: 3mm;
                    }
                    .meta-val {
                        flex: 1;
                        padding-right: 2mm;
                        font-weight: 700;
                    }
                    
                    /* Grid Data Kontainer Utama */
                    .main-grid {
                        width: 100%;
                        border: 2px solid #000;
                        border-collapse: collapse;
                        margin-top: 1mm;
                    }
                    .main-grid td {
                        border: 1px solid #000;
                        vertical-align: middle;
                    }
                    .col-lbl {
                        width: 32mm;
                        font-size: 8.5pt;
                        font-weight: 800;
                        text-align: center;
                        line-height: 1.15;
                    }
                    .col-cont-num {
                        height: 16mm;
                        font-size: 24pt;
                        font-weight: 900;
                        letter-spacing: 2px;
                        text-align: center;
                        font-family: 'Arial Black', Arial, monospace, sans-serif;
                    }
                    .col-data-text {
                        height: 8.5mm;
                        font-size: 10pt;
                        font-weight: 700;
                        text-align: center;
                    }
                    .col-service {
                        width: 57mm;
                        text-align: center;
                        vertical-align: middle;
                        padding: 0;
                    }
                    .service-size {
                        font-size: 12.5pt;
                        font-weight: 900;
                        padding: 2.5mm 0;
                        border-bottom: 1.5px solid #000;
                    }
                    .service-title {
                        font-size: 13.5pt;
                        font-weight: 900;
                        font-style: italic;
                        padding: 5mm 2mm;
                        line-height: 1.25;
                        text-transform: uppercase;
                    }

                    /* Footer & Tanda Tangan */
                    .footer-grid {
                        width: 100%;
                        border: 2px solid #000;
                        border-top: none;
                        border-collapse: collapse;
                        height: 33mm;
                    }
                    .footer-grid td {
                        border: 1px solid #000;
                        vertical-align: top;
                    }
                    .footer-notice {
                        width: 44mm;
                        padding: 2.5mm;
                        font-size: 7.5pt;
                        line-height: 1.3;
                    }
                    .footer-notice u {
                        font-weight: 700;
                    }
                    .sig-col {
                        width: 36mm;
                        text-align: center;
                        font-size: 8.5pt;
                        font-weight: 700;
                        padding-top: 2mm;
                    }
                    .sig-col-empty {
                        flex: 1;
                        text-align: center;
                        font-size: 8.5pt;
                        font-weight: 700;
                        padding-top: 2mm;
                    }
                </style>
            </head>
            <body>
                <div class="sj-container">
                    ${printContent.innerHTML}
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    if (!data) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full sm:max-w-5xl max-h-[96vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="text-lg font-bold flex items-center justify-between">
                        <span>Cetak Surat Jalan (Format 21 x 14 cm)</span>
                    </DialogTitle>
                </DialogHeader>

                {/* Form Pengaturan Cepat Data Dinamis */}
                <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-3 text-xs space-y-2">
                    <div className="font-semibold text-blue-900">Sesuaikan Data Pengiriman Sebelum Cetak:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                            <Label className="text-[11px] text-gray-700">Tanggal</Label>
                            <Input
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                                className="h-8 text-xs bg-white"
                                placeholder="DD - MM - YYYY"
                            />
                        </div>
                        <div>
                            <Label className="text-[11px] text-gray-700">Jam Keluar</Label>
                            <Input
                                value={jamKeluar}
                                onChange={(e) => setJamKeluar(e.target.value)}
                                className="h-8 text-xs bg-white"
                                placeholder="HH:MM"
                            />
                        </div>
                        <div>
                            <Label className="text-[11px] text-gray-700">No. Polisi Truk</Label>
                            <Input
                                value={noPol}
                                onChange={(e) => setNoPol(e.target.value)}
                                className="h-8 text-xs bg-white"
                                placeholder="Contoh: L 1234 AB"
                            />
                        </div>
                        <div>
                            <Label className="text-[11px] text-gray-700">Tujuan</Label>
                            <Input
                                value={tujuan}
                                onChange={(e) => setTujuan(e.target.value)}
                                className="h-8 text-xs bg-white"
                                placeholder="Contoh: Pelabuhan / Depo"
                            />
                        </div>
                        <div>
                            <Label className="text-[11px] text-gray-700">No. Segel</Label>
                            <Input
                                value={noSegel}
                                onChange={(e) => setNoSegel(e.target.value)}
                                className="h-8 text-xs bg-white"
                                placeholder="Nomor Segel"
                            />
                        </div>
                        <div>
                            <Label className="text-[11px] text-gray-700">Isi Kontainer</Label>
                            <Input
                                value={isi}
                                onChange={(e) => setIsi(e.target.value)}
                                className="h-8 text-xs bg-white"
                                placeholder="FULL CONT(ON-CHASIS)"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Label className="text-[11px] text-gray-700">Keterangan</Label>
                            <Input
                                value={keterangan}
                                onChange={(e) => setKeterangan(e.target.value)}
                                className="h-8 text-xs bg-white"
                                placeholder="Catatan tambahan..."
                            />
                        </div>
                    </div>
                </div>

                {/* AREA PREVIEW SURAT JALAN (21 x 14 cm) */}
                <div className="flex justify-center p-3 bg-gray-100 rounded-xl overflow-x-auto">
                    {/* Wadah Simulasi Kertas Ukuran 210mm x 140mm (~794px x 529px) */}
                    <div className="relative bg-white shadow-lg border border-gray-400 p-5 w-[794px] min-w-[794px] h-[529px] min-h-[529px] rounded flex flex-col justify-between select-none">
                        {/* Sprocket Holes Indicator (Kiri & Kanan Kertas Dot Matrix) */}
                        <div className="absolute left-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
                            {Array.from({ length: 16 }).map((_, i) => (
                                <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-700"></div>
                            ))}
                        </div>
                        <div className="absolute right-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
                            {Array.from({ length: 16 }).map((_, i) => (
                                <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-700"></div>
                            ))}
                        </div>

                        {/* Printable / Preview Content */}
                        <div ref={printRef} className="w-full h-full flex flex-col justify-between px-3">
                            {/* Header Section */}
                            <div>
                                <div className="header-row flex justify-between items-start">
                                    {/* Identitas Depo + Logo */}
                                    <div className="flex items-start gap-2.5 max-w-[340px]">
                                        <img
                                            src="/logo.png"
                                            alt="Logo Depo"
                                            className="h-10 w-auto object-contain filter grayscale contrast-150 shrink-0"
                                        />
                                        <div className="company-info">
                                            <div className="company-title font-black text-[15px] tracking-tight text-black leading-tight">
                                                PT. DEPO SURABAYA SEJAHTERA
                                            </div>
                                            <div className="company-address font-semibold text-[10.5px] text-gray-800 leading-snug">
                                                Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)
                                            </div>
                                            <div className="company-telp text-[10px] text-gray-700 leading-snug">
                                                Telp. 031-353 9484, 031-3539485 &nbsp; Fax. 031-3539482
                                            </div>
                                        </div>
                                    </div>

                                    {/* Box Judul SURAT JALAN */}
                                    <div className="title-sj-box border-2 border-black px-3.5 py-1 text-center self-start">
                                        <div className="title-sj-text font-black text-sm tracking-[3px] text-black">
                                            SURAT JALAN
                                        </div>
                                    </div>

                                    {/* Meta Box Kanan Atas */}
                                    <div className="meta-box w-[230px] border-[1.5px] border-black text-[11px]">
                                        <div className="meta-row flex border-b border-black py-0.5 items-center">
                                            <div className="meta-label w-[80px] pl-2 font-semibold">Tanggal</div>
                                            <div className="meta-colon w-3">:</div>
                                            <div className="meta-val flex-1 pr-2 font-bold">{tanggal || '-'}</div>
                                        </div>
                                        <div className="meta-row flex border-b border-black py-0.5 items-center">
                                            <div className="meta-label w-[80px] pl-2 font-semibold">Jam Keluar</div>
                                            <div className="meta-colon w-3">:</div>
                                            <div className="meta-val flex-1 pr-2 font-bold">{jamKeluar || '-'}</div>
                                        </div>
                                        <div className="meta-row flex border-b border-black py-0.5 items-center">
                                            <div className="meta-label w-[80px] pl-2 font-semibold">No. Pol</div>
                                            <div className="meta-colon w-3">:</div>
                                            <div className="meta-val flex-1 pr-2 font-bold">{noPol || '-'}</div>
                                        </div>
                                        <div className="meta-row flex py-0.5 items-center">
                                            <div className="meta-label w-[80px] pl-2 font-semibold">Tujuan</div>
                                            <div className="meta-colon w-3">:</div>
                                            <div className="meta-val flex-1 pr-2 font-bold">{tujuan || '-'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Baris Customer & Shipper */}
                                <div className="customer-row mt-2 text-[12px] font-bold text-gray-950 leading-tight">
                                    Customer : {data.customer_name || '-'}
                                    {data.shipper_name && (
                                        <div className="shipper font-semibold text-gray-800 pl-16">
                                            ({data.shipper_name})
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Main Table Grid */}
                            <table className="main-grid w-full border-2 border-black border-collapse mt-2">
                                <tbody>
                                    <tr>
                                        <td className="col-lbl w-[125px] border border-black p-2 font-bold text-center text-xs">
                                            NO<br />CONTAINER
                                        </td>
                                        <td className="col-val col-cont-num border border-black p-2 font-black text-2xl sm:text-3xl text-center tracking-wider font-mono">
                                            {data.container_number}
                                        </td>
                                        <td rowSpan={4} className="col-service w-[220px] border border-black p-0 text-center align-middle bg-gray-50/20">
                                            <div className="service-size text-base font-black py-2.5 border-b-[1.5px] border-black">
                                                {formatContainerSize(data.size)}
                                            </div>
                                            <div className="service-title text-base font-black italic py-5 px-2 tracking-wide uppercase leading-tight">
                                                {data.service_type || 'PEMERIKSAAN KARANTINA'}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="col-lbl border border-black p-1.5 font-bold text-center text-xs">
                                            ISI
                                        </td>
                                        <td className="col-data-text border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center">
                                            {isi || 'FULL CONT(ON-CHASIS)'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="col-lbl border border-black p-1.5 font-bold text-center text-xs">
                                            NO SEGEL
                                        </td>
                                        <td className="col-data-text border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center">
                                            {noSegel || '-'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="col-lbl border border-black p-1.5 font-bold text-center text-xs">
                                            KETERANGAN
                                        </td>
                                        <td className="col-data-text border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center">
                                            {keterangan || '-'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Footer Signatures Grid */}
                            <table className="footer-grid w-full border-2 border-black border-t-0 border-collapse h-[120px]">
                                <tbody>
                                    <tr>
                                        <td className="footer-notice w-[190px] border border-black p-2.5 text-[10px] leading-tight text-gray-800 align-top">
                                            <strong><u>PERHATIAN :</u></strong> Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami.
                                        </td>
                                        <td className="sig-col w-[150px] border border-black text-center text-xs p-2 align-top">
                                            <div className="font-semibold">Diserahkan oleh</div>
                                        </td>
                                        <td className="sig-col w-[150px] border border-black text-center text-xs p-2 align-top">
                                            <div className="font-semibold">Sopir</div>
                                        </td>
                                        <td className="sig-col-empty border border-black text-center text-xs p-2 align-top">
                                            <div className="font-semibold">Penerima</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer Tombol Aksi */}
                <div className="flex justify-between items-center pt-2 border-t mt-2">
                    <div className="text-xs text-gray-500">
                        Ukuran Kertas: <strong>21 cm x 14 cm (Continuous Form)</strong>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={onClose}>
                            Tutup
                        </Button>
                        <Button size="sm" onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 font-semibold">
                            <Printer className="h-4 w-4" />
                            Cetak Surat Jalan
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
