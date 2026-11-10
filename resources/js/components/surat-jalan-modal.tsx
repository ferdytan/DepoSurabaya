import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer, CheckSquare, Square, LayoutTemplate, FileText } from 'lucide-react';

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
    fuel_option?: string | null;
}

interface SuratJalanModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: SuratJalanData | null;
}

export const SCALE_CONFIG = {
    '100': {
        pageWidthMm: 202,
        pageHeightMm: 128,
        previewW: 764,
        previewH: 485,
        label: '100% (Rekomendasi Lebar & Tinggi 13 cm)',
        desc: 'Lebar maksimal memenuhi continuous form dan tinggi 13 cm',
    },
    '95': {
        pageWidthMm: 195,
        pageHeightMm: 128,
        previewW: 738,
        previewH: 485,
        label: '95%',
        desc: 'Lebar proporsional dengan margin aman',
    },
    '90': {
        pageWidthMm: 188,
        pageHeightMm: 128,
        previewW: 710,
        previewH: 485,
        label: '90%',
        desc: 'Ukuran sedang',
    },
    '85': {
        pageWidthMm: 180,
        pageHeightMm: 128,
        previewW: 680,
        previewH: 485,
        label: '85% (Kompak)',
        desc: 'Ekstra aman dari pinggiran kertas & lipatan perforasi',
    },
} as const;

export type PrintScaleKey = keyof typeof SCALE_CONFIG;

export default function SuratJalanModal({ isOpen, onClose, data }: SuratJalanModalProps) {
    const printContainerRef = useRef<HTMLDivElement>(null);

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

    // Dynamic state that can be fine-tuned before printing
    const [tanggal, setTanggal] = useState('');
    const [jamKeluar, setJamKeluar] = useState('');
    const [noPol, setNoPol] = useState('');
    const [tujuan, setTujuan] = useState('');
    const [noSegel, setNoSegel] = useState('-');
    const [isi, setIsi] = useState('FULL CONT(ON-CHASIS)');
    const [keterangan, setKeterangan] = useState('-');
    const [containerNumber, setContainerNumber] = useState('');
    const [ukuranCont, setUkuranCont] = useState(() => formatContainerSize(data?.size));
    const [layanan, setLayanan] = useState(() => data?.service_type || 'PLUG & MONITORING TEMPERATURE');
    const [showLogo, setShowLogo] = useState(false); // Default false matching continuous form sample photo
    const [layoutStyle, setLayoutStyle] = useState<'standard' | 'modern'>('standard'); // Default Versi 2 (Format Excel / Continuous Form)
    const [printScale, setPrintScale] = useState<PrintScaleKey>('100'); // Default 100% (202mm lebar penuh)
    const [recipientTitle, setRecipientTitle] = useState('Vessel Schedule'); // Label Kolom TTD 4 (default Vessel Schedule sesuai continuous form)

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
            setKeterangan(data.notes || '-');
            setContainerNumber(data.container_number || '');
            setUkuranCont(formatContainerSize(data.size));
            setLayanan(data.service_type || 'PLUG & MONITORING TEMPERATURE');
        }
    }, [data, isOpen]);

    const containerSize = ukuranCont;
    const serviceType = layanan || data?.service_type || 'PLUG & MONITORING TEMPERATURE';
    const customerName = data?.customer_name || '-';
    const shipperName = data?.shipper_name || null;

    const currentDim = SCALE_CONFIG[printScale] || SCALE_CONFIG['100'];

    // Generate standalone, self-contained HTML for printing (guaranteed 1 page, 210mm x 140mm)
    const generatePrintHtml = () => {
        const logoImgTag = showLogo
            ? `<img src="${window.location.origin}/logo.png" class="depo-logo" alt="Logo" style="height: 30px; max-height: 30px; width: 36px; max-width: 36px; object-fit: contain;" />`
            : '';

        const { pageWidthMm, pageHeightMm } = currentDim;

        if (layoutStyle === 'modern') {
            // === LAYOUT BARU: MODERN CLEAN INDUSTRIAL (Dioptimasi untuk Dot Matrix: Font Tebal & Konten Rapat) ===
            return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Jalan (Modern) - ${containerNumber || 'Depo Surabaya'}</title>
    <style>
        @page {
            size: 210mm 140mm;
            margin: 0mm;
        }
        *, *::before, *::after {
            box-sizing: border-box !important;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        html, body {
            width: 210mm !important;
            height: 140mm !important;
            max-height: 140mm !important;
            min-height: 140mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            font-family: "Courier New", Courier, monospace !important;
            -webkit-font-smoothing: none !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: geometricPrecision !important;
            color: #000000 !important;
            overflow: hidden !important;
        }
        .sj-print-wrapper {
            width: 210mm !important;
            height: 140mm !important;
            max-height: 140mm !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            box-sizing: border-box !important;
            padding-top: 20px !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-bottom: 0 !important;
            margin: 0 !important;
            background: transparent !important;
        }
        .sj-page {
            width: ${pageWidthMm}mm !important;
            height: ${pageHeightMm}mm !important;
            max-width: ${pageWidthMm}mm !important;
            max-height: ${pageHeightMm}mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            box-sizing: border-box !important;
            background: transparent !important;
        }
        table, tr, td, th, .page-break-avoid, .m-unified-frame, .m-row-footer {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }
        
        /* Modern Header */
        .m-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2.5px solid #000;
            padding-bottom: 1.5mm;
            gap: 2mm;
        }
        .m-brand {
            display: flex;
            align-items: center;
            gap: 2mm;
            min-width: 0;
            flex: 1;
        }
        .depo-logo {
            height: 30px !important;
            max-height: 30px !important;
            width: 36px !important;
            max-width: 36px !important;
            object-fit: contain !important;
            flex-shrink: 0;
            filter: grayscale(100%) contrast(150%);
        }
        .m-brand-info {
            min-width: 0;
            flex: 1;
        }
        .m-brand-title {
            font-size: 12.5pt;
            font-weight: 900;
            letter-spacing: -0.2px;
            line-height: 1.1;
            color: #000000;
            white-space: nowrap;
        }
        .m-brand-desc {
            font-size: 7.8pt;
            font-weight: 800;
            color: #000000;
            line-height: 1.2;
            margin-top: 1px;
            white-space: nowrap;
            letter-spacing: -0.25px;
        }
        .m-doc-box {
            text-align: right;
            flex-shrink: 0;
            margin-left: 2mm;
        }
        .m-doc-title {
            font-size: 16pt;
            font-weight: 900;
            letter-spacing: 1.5px;
            line-height: 1;
            color: #000000;
            white-space: nowrap;
        }

        /* Unified Master Form Frame (Mengisi 1 Halaman Penuh Secara Proporsional) */
        .m-unified-frame {
            border: 2px solid #000;
            margin-top: 2mm;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            flex: 1 !important;
        }

        /* Row 1: Logistics Bar (4 Kolom Terpadu) */
        .m-row-logistics {
            display: flex;
            border-bottom: 2px solid #000;
            flex-shrink: 0;
            min-height: 12mm;
        }
        .m-col-log {
            flex: 1;
            padding: 1.5mm 2.5mm;
            border-right: 2px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .m-col-log:last-child {
            border-right: none;
        }
        .m-lbl {
            font-size: 8.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
            letter-spacing: 0.3px;
            line-height: 1;
        }
        .m-val-log {
            font-size: 11pt;
            font-weight: 900;
            color: #000000;
            margin-top: 1mm;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.1;
        }

        /* Row 2: Customer & Shipper Banner (2 Kolom Terpisah, Label di Atas, Nama di Bawah) */
        .m-row-party {
            display: flex;
            border-bottom: 2px solid #000;
            background: #ffffff;
            flex-shrink: 0;
            min-height: 11mm;
        }
        .m-party-col {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 1.5mm 3mm;
            box-sizing: border-box;
            min-width: 0;
        }
        .m-party-col:first-child {
            border-right: 2px solid #000;
        }
        .m-party-val {
            font-size: 10.5pt;
            font-weight: 900;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 0.1px;
            line-height: 1.2;
            word-break: break-word;
            margin-top: 0.8mm;
            text-align: left;
        }

        /* Row 3: Hero Container Box (Lapang & Menonjol) */
        .m-row-hero {
            display: flex;
            border-bottom: 2px solid #000;
            flex: 1.3;
            min-height: 22mm;
        }
        .m-hero-left {
            flex: 1;
            border-right: 2px solid #000;
            padding: 2mm 3.5mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .m-hero-cont-num {
            font-size: 28pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
            line-height: 1.05;
            margin-top: 1mm;
            color: #000000;
        }
        .m-hero-right {
            width: 58mm;
            padding: 2mm 2mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: #ffffff;
        }
        .m-hero-size-val {
            font-size: 20pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            line-height: 1.05;
            margin-top: 1mm;
            color: #000000;
        }

        /* Row 4: Subgrid Muatan & Layanan */
        .m-row-subgrid {
            display: flex;
            border-bottom: 2px solid #000;
            flex: 1.1;
            min-height: 20mm;
        }
        .m-sub-col {
            padding: 2mm 2.5mm;
            border-right: 2px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }
        .m-sub-isi {
            flex: 1.6;
        }
        .m-sub-segel {
            flex: 1;
        }
        .m-sub-ket {
            flex: 1.2;
        }
        .m-sub-layanan {
            width: 58mm;
            border-right: none;
            align-items: center;
            text-align: center;
        }
        .m-sub-val-wrap {
            flex: 1;
            display: flex;
            align-items: center;
            margin-top: 1mm;
        }
        .m-sub-val {
            font-size: 11pt;
            font-weight: 900;
            color: #000000;
            line-height: 1.25;
            word-break: break-word;
        }
        .m-layanan-val {
            font-size: 12.5pt;
            font-weight: 900;
            text-transform: uppercase;
            line-height: 1.2;
            letter-spacing: 0.2px;
            color: #000000;
            text-align: center;
        }

        /* Row 5: Signatures & Disclaimer */
        .m-row-footer {
            display: flex;
            flex: 1.4;
            min-height: 28mm;
        }
        .m-footer-notice {
            width: 74mm;
            border-right: 2px solid #000;
            padding: 2mm 3mm;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: 1.2mm;
            background: #ffffff;
            box-sizing: border-box;
        }
        .m-notice-title {
            font-size: 9.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
            text-decoration: underline;
            letter-spacing: 0.2px;
            line-height: 1.15;
        }
        .m-notice-body {
            font-size: 9.5pt;
            font-weight: 900;
            line-height: 1.25;
            color: #000000;
            margin-top: 0.5mm;
        }
        .m-sig-col {
            flex: 1;
            border-right: 2px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 2mm 1.5mm 1.5mm 1.5mm;
            text-align: center;
            background: #ffffff;
            box-sizing: border-box;
        }
        .m-sig-col:last-child {
            border-right: none;
        }
        .m-sig-role {
            font-size: 8.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
            letter-spacing: 0.2px;
        }
        .m-sig-line {
            border-bottom: 2px dotted #000;
            margin: 0 2mm 1mm 2mm;
        }
    </style>
</head>
<body>
    <div class="sj-print-wrapper">
        <div class="sj-page">
            <!-- Modern Header -->
            <div class="m-header">
                <div class="m-brand">
                    ${logoImgTag}
                    <div class="m-brand-info">
                        <div class="m-brand-title">PT. DEPO SURABAYA SEJAHTERA</div>
                        <div class="m-brand-desc">Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) &bull; Telp. 031-353 9484 / 3539485 &bull; Fax. 031-3539482</div>
                    </div>
                </div>
                <div class="m-doc-box">
                    <div class="m-doc-title">SURAT JALAN</div>
                </div>
            </div>

            <!-- Unified Master Form Frame (Rapat, Kokoh, Tanpa Celah Kosong) -->
            <div class="m-unified-frame">
                <!-- Row 1: Logistics Bar (4 Kolom Terpadu) -->
                <div class="m-row-logistics">
                    <div class="m-col-log">
                        <div class="m-lbl">TANGGAL</div>
                        <div class="m-val-log">${tanggal || '-'}</div>
                    </div>
                    <div class="m-col-log">
                        <div class="m-lbl">JAM KELUAR</div>
                        <div class="m-val-log">${jamKeluar || '-'}</div>
                    </div>
                    <div class="m-col-log">
                        <div class="m-lbl">NO. POLISI</div>
                        <div class="m-val-log">${noPol || '-'}</div>
                    </div>
                    <div class="m-col-log">
                        <div class="m-lbl">TUJUAN</div>
                        <div class="m-val-log">${tujuan || '-'}</div>
                    </div>
                </div>

                <!-- Row 2: Customer & Shipper Banner (2 Kolom, Label di Atas) -->
                <div class="m-row-party">
                    <div class="m-party-col">
                        <div class="m-lbl">CUSTOMER</div>
                        <div class="m-party-val">${customerName || '-'}</div>
                    </div>
                    <div class="m-party-col">
                        <div class="m-lbl">SHIPPER</div>
                        <div class="m-party-val">${shipperName ? (shipperName.startsWith('(') ? shipperName : `(${shipperName})`) : '-'}</div>
                    </div>
                </div>

                <!-- Row 3: Hero Container Box -->
                <div class="m-row-hero">
                    <div class="m-hero-left">
                        <div class="m-lbl">NO. CONTAINER</div>
                        <div class="m-hero-cont-num">${containerNumber || '-'}</div>
                    </div>
                    <div class="m-hero-right">
                        <div class="m-lbl">JUMLAH / UKURAN</div>
                        <div class="m-hero-size-val">${ukuranCont}</div>
                    </div>
                </div>

                <!-- Row 4: Subgrid Muatan & Layanan -->
                <div class="m-row-subgrid">
                    <div class="m-sub-col m-sub-isi">
                        <div class="m-lbl">ISI KONTAINER</div>
                        <div class="m-sub-val-wrap">
                            <div class="m-sub-val">${isi || 'FULL CONT(ON-CHASIS)'}</div>
                        </div>
                    </div>
                    <div class="m-sub-col m-sub-segel">
                        <div class="m-lbl">NO. SEGEL</div>
                        <div class="m-sub-val-wrap">
                            <div class="m-sub-val">${noSegel || '-'}</div>
                        </div>
                    </div>
                    <div class="m-sub-col m-sub-ket">
                        <div class="m-lbl">KETERANGAN</div>
                        <div class="m-sub-val-wrap">
                            <div class="m-sub-val">${keterangan || '-'}</div>
                        </div>
                    </div>
                    <div class="m-sub-col m-sub-layanan">
                        <div class="m-lbl">NAMA PRODUK / LAYANAN</div>
                        <div class="m-sub-val-wrap" style="justify-content: center;">
                            <div class="m-layanan-val">${layanan}</div>
                        </div>
                    </div>
                </div>

                <!-- Row 5: Signatures & Disclaimer -->
                <div class="m-row-footer">
                    <div class="m-footer-notice">
                        <div class="m-notice-title">PERHATIAN PENTING :</div>
                        <div class="m-notice-body">Mohon kondisi container dan segel dicek terlebih dahulu sebelum meninggalkan area depo. Segala bentuk komplain setelah keluar depo di luar tanggung jawab kami.</div>
                    </div>
                    <div class="m-sig-col">
                        <div class="m-sig-role">DISERAHKAN OLEH</div>
                        <div class="m-sig-line"></div>
                    </div>
                    <div class="m-sig-col">
                        <div class="m-sig-role">SOPIR TRUK</div>
                        <div class="m-sig-line"></div>
                    </div>
                    <div class="m-sig-col">
                        <div class="m-sig-role">PENERIMA BARANG / DEPO</div>
                        <div class="m-sig-line"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
        }

        // === LAYOUT VERSI 2: FORMAT EXCEL / CONTINUOUS FORM FISIK KLASIK ===
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Jalan (Versi 2) - ${containerNumber || 'Depo Surabaya'}</title>
    <style>
        @page {
            size: 210mm 140mm;
            margin: 0mm;
        }
        *, *::before, *::after {
            box-sizing: border-box !important;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        html, body {
            width: 210mm !important;
            height: 140mm !important;
            max-height: 140mm !important;
            min-height: 140mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            font-family: "Courier New", Courier, monospace !important;
            -webkit-font-smoothing: none !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: geometricPrecision !important;
            color: #000000 !important;
            overflow: hidden !important;
        }
        .sj-print-wrapper {
            width: 210mm !important;
            height: 140mm !important;
            max-height: 140mm !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            box-sizing: border-box !important;
            padding-top: 5mm !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-bottom: 0 !important;
            margin: 0 !important;
            background: transparent !important;
        }
        .sj-page {
            width: ${pageWidthMm}mm !important;
            max-width: ${pageWidthMm}mm !important;
            height: 128mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            box-sizing: border-box !important;
            background: transparent !important;
        }

        /* V2 Excel Master Frame (1 Kotak Utuh Mengelilingi Keseluruhan Tinggi ~128mm / 13 cm) */
        .v2-master-frame {
            width: 100%;
            height: 128mm !important;
            border: 1px solid #000000 !important;
            box-sizing: border-box !important;
            background: transparent !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            page-break-inside: avoid !important;
        }
        .v2-top-header {
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            height: 32mm !important;
            border-bottom: 1px solid #000000 !important;
            background: transparent !important;
            box-sizing: border-box !important;
        }
        .v2-company-box {
            flex: 1;
            padding: 2mm 3mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-width: 0;
            background: transparent !important;
        }
        .v2-company-name {
            font-size: 14.5pt;
            font-weight: bold;
            line-height: 1.15;
            color: #000000 !important;
            white-space: nowrap;
            letter-spacing: 0px;
        }
        .v2-company-addr {
            font-size: 9.5pt;
            font-weight: bold;
            line-height: 1.25;
            color: #000000 !important;
            margin-top: 0.8mm;
            white-space: nowrap;
        }
        .v2-company-telp {
            font-size: 9pt;
            font-weight: bold;
            line-height: 1.2;
            color: #000000 !important;
            white-space: nowrap;
        }
        .v2-customer-line {
            margin-top: 2.5mm;
            font-size: 11pt;
            font-weight: bold;
            color: #000000 !important;
            line-height: 1.2;
            text-transform: uppercase;
            word-break: break-word;
        }
        .v2-shipper-line {
            font-size: 10pt;
            font-weight: bold;
            color: #000000 !important;
            line-height: 1.2;
            text-transform: uppercase;
            word-break: break-word;
            padding-left: 24mm;
        }
        .v2-meta-table {
            width: 65mm;
            height: 32mm !important;
            border-left: 1px solid #000000 !important;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: transparent !important;
            box-sizing: border-box !important;
        }
        .v2-meta-row {
            display: flex;
            align-items: center;
            border-bottom: 1px solid #000000 !important;
            height: 8mm !important;
            font-size: 9.5pt;
            font-weight: bold;
            color: #000000 !important;
            box-sizing: border-box !important;
        }
        .v2-meta-row:last-child {
            border-bottom: none !important;
        }
        .v2-meta-lbl {
            width: 24mm;
            padding-left: 2mm;
            color: #000000 !important;
            white-space: nowrap;
        }
        .v2-meta-sep {
            width: 3mm;
            text-align: center;
            color: #000000 !important;
        }
        .v2-meta-val {
            flex: 1;
            padding-right: 2mm;
            color: #000000 !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* V2 Main Grid Table (~51mm) */
        table.v2-grid {
            width: 100%;
            height: 51mm !important;
            border-collapse: collapse !important;
            border: none !important;
            background: transparent !important;
            page-break-inside: avoid !important;
            box-sizing: border-box !important;
        }
        table.v2-grid tr {
            page-break-inside: avoid !important;
        }
        table.v2-grid td {
            border: 1px solid #000000 !important;
            color: #000000 !important;
            background: transparent !important;
            box-sizing: border-box !important;
        }
        .v2-lbl-col {
            width: 32mm;
            font-size: 9.5pt;
            font-weight: bold;
            text-align: center;
            line-height: 1.2;
            vertical-align: middle;
            color: #000000 !important;
        }
        .v2-cont-num {
            height: 13.5mm;
            font-size: 14.5pt;
            font-weight: bold;
            letter-spacing: 1px;
            text-align: center;
            vertical-align: middle;
            color: #000000 !important;
        }
        .v2-size-col {
            width: 52mm;
            height: 13.5mm;
            font-size: 12pt;
            font-weight: bold;
            text-align: center;
            vertical-align: middle;
            border-bottom: 1px solid #000000 !important;
            color: #000000 !important;
        }
        .v2-val-row {
            height: 12.5mm;
            font-size: 10.5pt;
            font-weight: bold;
            text-align: center;
            vertical-align: middle;
            padding: 0 2mm;
            color: #000000 !important;
        }
        .v2-service-col {
            width: 52mm;
            height: 37.5mm;
            text-align: center;
            vertical-align: middle;
            padding: 2mm 1mm;
            font-size: 15pt;
            font-weight: bold;
            font-style: italic;
            text-transform: uppercase;
            line-height: 1.2;
            color: #000000 !important;
        }

        /* V2 Footer Table (~45mm - Ruang TTD Luas & Proporsional) */
        table.v2-footer {
            width: 100%;
            height: 45mm !important;
            border-collapse: collapse !important;
            border: none !important;
            border-top: 1px solid #000000 !important;
            background: transparent !important;
            page-break-inside: avoid !important;
            box-sizing: border-box !important;
        }
        table.v2-footer tr {
            page-break-inside: avoid !important;
        }
        table.v2-footer td {
            border: 1px solid #000000 !important;
            border-top: none !important;
            color: #000000 !important;
            background: transparent !important;
            vertical-align: top;
            box-sizing: border-box !important;
        }
        .v2-notice-col {
            width: 58mm;
            padding: 2.5mm 3mm;
            font-size: 9pt;
            font-weight: bold;
            line-height: 1.35;
            color: #000000 !important;
        }
        .v2-notice-col u {
            font-weight: bold;
        }
        .v2-sig-col {
            width: 34mm;
            text-align: center;
            padding-top: 2mm;
            font-size: 9.5pt;
            font-weight: bold;
            color: #000000 !important;
        }
        .v2-sig-last {
            text-align: center;
            padding-top: 2mm;
            font-size: 9.5pt;
            font-weight: bold;
            color: #000000 !important;
        }
    </style>
</head>
<body>
    <div class="sj-print-wrapper">
        <div class="sj-page">
            <div class="v2-master-frame">
                <!-- Header Section -->
                <div class="v2-top-header">
                    <div class="v2-company-box">
                        <div style="display: flex; align-items: flex-start;">
                            ${logoImgTag}
                            <div>
                                <div class="v2-company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                                <div class="v2-company-addr">Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)</div>
                                <div class="v2-company-telp">Telp. 031-353 9484, 031-3539485 &nbsp; Fax. 031-3539482</div>
                            </div>
                        </div>
                        <div class="v2-customer-line">
                            Customer : ${customerName || '-'}
                        </div>
                        ${shipperName ? `
                        <div class="v2-shipper-line">
                            (${shipperName})
                        </div>` : ''}
                    </div>
                    <div class="v2-meta-table">
                        <div class="v2-meta-row">
                            <div class="v2-meta-lbl">Tanggal</div>
                            <div class="v2-meta-sep">:</div>
                            <div class="v2-meta-val">${tanggal || '-'}</div>
                        </div>
                        <div class="v2-meta-row">
                            <div class="v2-meta-lbl">Jam Keluar</div>
                            <div class="v2-meta-sep">:</div>
                            <div class="v2-meta-val">${jamKeluar || '-'}</div>
                        </div>
                        <div class="v2-meta-row">
                            <div class="v2-meta-lbl">No. Pol</div>
                            <div class="v2-meta-sep">:</div>
                            <div class="v2-meta-val">${noPol || '-'}</div>
                        </div>
                        <div class="v2-meta-row">
                            <div class="v2-meta-lbl">Tujuan</div>
                            <div class="v2-meta-sep">:</div>
                            <div class="v2-meta-val">${tujuan || '-'}</div>
                        </div>
                    </div>
                </div>

                <!-- Main Table Grid -->
                <table class="v2-grid">
                    <tbody>
                        <tr>
                            <td class="v2-lbl-col">NO<br>CONTAINER</td>
                            <td class="v2-cont-num">${containerNumber || '-'}</td>
                            <td class="v2-size-col">${containerSize}</td>
                        </tr>
                        <tr>
                            <td class="v2-lbl-col">ISI</td>
                            <td class="v2-val-row">${isi || 'FULL CONT(ON-CHASIS)'}</td>
                            <td rowspan="3" class="v2-service-col">${serviceType}</td>
                        </tr>
                        <tr>
                            <td class="v2-lbl-col">NO SEGEL</td>
                            <td class="v2-val-row">${noSegel || '-'}</td>
                        </tr>
                        <tr>
                            <td class="v2-lbl-col">KETERANGAN</td>
                            <td class="v2-val-row">${keterangan || '-'}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Footer Signatures Grid -->
                <table class="v2-footer">
                    <tbody>
                        <tr>
                            <td class="v2-notice-col">
                                <u>PERHATIAN :</u> Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami.
                            </td>
                            <td class="v2-sig-col">
                                Diserahkan Oleh
                            </td>
                            <td class="v2-sig-col">
                                Sopir
                            </td>
                            <td class="v2-sig-last">
                                ${recipientTitle || 'Vessel Schedule'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>`;
    };

    // Print using an invisible iframe to prevent about:blank tabs, popup blockers, and style detachment
    const handlePrint = () => {
        const html = generatePrintHtml();

        // Check if there is an old print iframe and remove it
        const oldFrame = document.getElementById('sj-print-iframe');
        if (oldFrame) {
            oldFrame.remove();
        }

        const iframe = document.createElement('iframe');
        iframe.id = 'sj-print-iframe';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);

        const frameDoc = iframe.contentWindow?.document || iframe.contentDocument;
        if (!frameDoc) {
            alert('Gagal menyiapkan pencetakan. Silakan coba lagi.');
            return;
        }

        frameDoc.open();
        frameDoc.write(html);
        frameDoc.close();

        const executePrint = () => {
            setTimeout(() => {
                try {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                } catch (e) {
                    console.error('Print error:', e);
                } finally {
                    setTimeout(() => {
                        if (document.body.contains(iframe)) {
                            iframe.remove();
                        }
                    }, 1000);
                }
            }, 250);
        };

        if (showLogo) {
            const img = frameDoc.querySelector('img');
            if (img && !img.complete) {
                img.onload = executePrint;
                img.onerror = executePrint;
            } else {
                executePrint();
            }
        } else {
            executePrint();
        }
    };

    if (!data) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full sm:max-w-5xl lg:max-w-6xl max-h-[96vh] overflow-y-auto p-4 sm:p-6">
                {/* Print Stylesheet Khusus Dot Matrix & Sembunyikan UI Web App saat Ctrl+P */}
                <style dangerouslySetInnerHTML={{ __html: `
                    @media print {
                        @page {
                            size: 210mm 140mm;
                            margin: 0mm;
                        }
                        *, *::before, *::after {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        body > *:not([data-radix-portal]),
                        nav, aside, header, footer,
                        .sj-ui-header,
                        .sj-ui-toolbar,
                        .sj-ui-controls,
                        .sj-ui-footer,
                        .sj-sprocket-holes,
                        .sj-perforation-line,
                        [data-radix-dialog-overlay],
                        button {
                            display: none !important;
                        }
                        html, body {
                            width: 210mm !important;
                            height: 140mm !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            background: transparent !important;
                            overflow: hidden !important;
                            font-family: "Courier New", Courier, monospace !important;
                            -webkit-font-smoothing: none !important;
                            -moz-osx-font-smoothing: grayscale !important;
                            text-rendering: geometricPrecision !important;
                            color: #000000 !important;
                        }
                        .sj-printable-paper {
                            position: fixed !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 210mm !important;
                            height: 140mm !important;
                            margin: 0 !important;
                            padding-top: 15px !important;
                            box-shadow: none !important;
                            border: none !important;
                            background: transparent !important;
                            z-index: 999999 !important;
                        }
                        table, tr, td, th {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                    }
                ` }} />

                <DialogHeader className="border-b pb-3 sj-ui-header">
                    <DialogTitle className="text-lg font-bold flex items-center justify-between">
                        <span>Cetak Surat Jalan (Ukuran Media: 21 x 14 cm)</span>
                    </DialogTitle>
                </DialogHeader>

                {/* Form Pengaturan Cepat Data Dinamis & Pemilihan Layout */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2.5 sj-ui-controls">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        {/* Selector Layout Versi 2 (Excel / Continuous Form) vs Versi 1 (Modern Industrial) */}
                        <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg p-0.5 sj-ui-toolbar">
                            <button
                                type="button"
                                onClick={() => setLayoutStyle('standard')}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                                    layoutStyle === 'standard'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <FileText className="h-3.5 w-3.5" />
                                Versi 2 (Format Excel / Continuous)
                            </button>
                            <button
                                type="button"
                                onClick={() => setLayoutStyle('modern')}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                                    layoutStyle === 'modern'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <LayoutTemplate className="h-3.5 w-3.5" />
                                Versi 1 (Modern Industrial)
                            </button>
                        </div>

                        {/* Selector Skala Ukuran Cetak (Anti Terpotong di Printer Dot Matrix) */}
                        <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5">
                            <span className="text-[11px] font-semibold text-slate-500 pl-2 pr-1">Skala Cetak:</span>
                            {(['100', '95', '90', '85'] as const).map((key) => {
                                const s = SCALE_CONFIG[key];
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setPrintScale(key)}
                                        className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                                            printScale === key
                                                ? 'bg-indigo-600 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                        title={s.desc}
                                    >
                                        {key === '100' ? '100% (Lebar Maksimal)' : `${key}%`}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Toggle Logo */}
                        <button
                            type="button"
                            onClick={() => setShowLogo(!showLogo)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition"
                        >
                            {showLogo ? (
                                <CheckSquare className="h-3.5 w-3.5 text-blue-600" />
                            ) : (
                                <Square className="h-3.5 w-3.5 text-slate-400" />
                            )}
                            Sertakan Logo Perusahaan
                        </button>
                    </div>

                    <div className="space-y-2">
                        {/* Baris 1: Data Pengiriman Utama */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
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
                                <Label className="text-[11px] text-gray-700">No. Polisi</Label>
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
                                    placeholder="Contoh: Pelabuhan"
                                />
                            </div>
                            <div>
                                <Label className="text-[11px] text-gray-700">No. Container</Label>
                                <Input
                                    value={containerNumber}
                                    onChange={(e) => setContainerNumber(e.target.value)}
                                    className="h-8 text-xs bg-white font-bold"
                                    placeholder="Nomor Container"
                                />
                            </div>
                            <div>
                                <Label className="text-[11px] text-gray-700">Jumlah / Ukuran</Label>
                                <Input
                                    value={ukuranCont}
                                    onChange={(e) => setUkuranCont(e.target.value)}
                                    className="h-8 text-xs bg-white font-bold"
                                    placeholder='1 X 20"'
                                />
                            </div>
                        </div>

                        {/* Baris 2: Nama Produk / Layanan & Detail Muatan */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                            <div>
                                <Label className="text-[11px] text-gray-700 font-semibold">Nama Produk / Layanan</Label>
                                <Input
                                    value={layanan}
                                    onChange={(e) => setLayanan(e.target.value)}
                                    className="h-8 text-xs bg-white font-bold"
                                    placeholder="PLUG & MONITORING TEMPERATURE"
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
                                <Label className="text-[11px] text-gray-700">Keterangan / Catatan</Label>
                                <Input
                                    value={keterangan}
                                    onChange={(e) => setKeterangan(e.target.value)}
                                    className="h-8 text-xs bg-white"
                                    placeholder="Catatan tambahan..."
                                />
                            </div>
                            <div>
                                <Label className="text-[11px] text-gray-700 font-semibold">Kolom TTD 4 (Penerima)</Label>
                                <Input
                                    value={recipientTitle}
                                    onChange={(e) => setRecipientTitle(e.target.value)}
                                    className="h-8 text-xs bg-white font-medium"
                                    placeholder="Vessel Schedule / Penerima"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* AREA PREVIEW SURAT JALAN (Simulasi Kertas 21 x 14 cm) */}
                <div className="flex flex-col items-center p-3 bg-slate-200/70 rounded-xl overflow-x-auto space-y-2 sj-preview-container">
                    {/* Wadah Kertas Bersih Ukuran 210mm x 140mm (~794px x 529px) */}
                    <div
                        ref={printContainerRef}
                        id="sj-print-paper-root"
                        className="relative bg-white shadow-md border border-slate-300 w-[794px] min-w-[794px] h-[529px] min-h-[529px] rounded-lg flex flex-col items-center justify-start pt-[18px] select-none sj-printable-paper"
                        style={{ fontFamily: layoutStyle === 'standard' ? '"Courier New", Courier, monospace' : 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
                    >
                        {/* Konten Area Cetak Dinamis Sesuai Skala (~13 cm / 485px tinggi) */}
                        <div
                            className="flex flex-col justify-between"
                            style={{
                                width: `${currentDim.previewW}px`,
                                height: `${currentDim.previewH}px`,
                                transition: 'all 0.15s ease',
                            }}
                        >
                            {layoutStyle === 'modern' ? (
                                /* ===== PREVIEW LAYOUT BARU: MODERN CLEAN ===== */
                                <div className="w-full h-full flex flex-col justify-start">
                                    {/* Modern Header */}
                                    <div className="flex justify-between items-center border-b-2 border-black pb-1.5 gap-2">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            {showLogo && (
                                                <img
                                                    src="/logo.png"
                                                    alt="Logo Depo"
                                                    className="h-7 w-auto max-w-[36px] object-contain filter grayscale contrast-150 shrink-0"
                                                    style={{ maxHeight: '30px', maxWidth: '36px' }}
                                                />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="font-black text-[13.5px] tracking-tight text-black leading-tight whitespace-nowrap">
                                                    PT. DEPO SURABAYA SEJAHTERA
                                                </div>
                                                <div className="text-[10px] sm:text-[10.5px] font-bold text-black leading-tight mt-0.5 whitespace-nowrap tracking-tight">
                                                    Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) &bull; Telp. 031-353 9484 / 3539485 &bull; Fax. 031-3539482
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 ml-2">
                                            <div className="font-black text-lg sm:text-xl tracking-[1.5px] text-black leading-none whitespace-nowrap">
                                                SURAT JALAN
                                            </div>
                                        </div>
                                    </div>

                                    {/* Master Unified Form Frame (Mengisi 1 Halaman Penuh Secara Proporsional) */}
                                    <div className="border-2 border-black bg-white flex flex-col mt-2 flex-1">
                                        {/* Row 1: Logistics Bar (4 Kolom Terpadu) */}
                                        <div className="shrink-0 grid grid-cols-4 border-b-2 border-black divide-x-2 divide-black min-h-[46px]">
                                            <div className="p-1.5 flex flex-col justify-center">
                                                <div className="text-[10.5px] uppercase font-black text-black tracking-wide leading-tight">TANGGAL</div>
                                                <div className="text-[13px] font-black text-black truncate mt-0.5">{tanggal || '-'}</div>
                                            </div>
                                            <div className="p-1.5 flex flex-col justify-center">
                                                <div className="text-[10.5px] uppercase font-black text-black tracking-wide leading-tight">JAM KELUAR</div>
                                                <div className="text-[13px] font-black text-black truncate mt-0.5">{jamKeluar || '-'}</div>
                                            </div>
                                            <div className="p-1.5 flex flex-col justify-center">
                                                <div className="text-[10.5px] uppercase font-black text-black tracking-wide leading-tight">NO. POLISI</div>
                                                <div className="text-[13px] font-black text-black truncate mt-0.5">{noPol || '-'}</div>
                                            </div>
                                            <div className="p-1.5 flex flex-col justify-center">
                                                <div className="text-[10.5px] uppercase font-black text-black tracking-wide leading-tight">TUJUAN</div>
                                                <div className="text-[13px] font-black text-black truncate mt-0.5">{tujuan || '-'}</div>
                                            </div>
                                        </div>

                                        {/* Row 2: Customer & Shipper Banner (2 Kolom Terpisah, Label di Atas, Nama di Bawah) */}
                                        <div className="shrink-0 border-b-2 border-black grid grid-cols-2 divide-x-2 divide-black bg-white min-h-[44px]">
                                            <div className="px-3 py-1.5 flex flex-col justify-center min-w-0">
                                                <div className="text-[10px] uppercase font-black text-black tracking-wide leading-tight">CUSTOMER</div>
                                                <div className="text-[12px] font-black text-black uppercase tracking-tight leading-tight break-words mt-0.5 text-left">
                                                    {customerName || '-'}
                                                </div>
                                            </div>
                                            <div className="px-3 py-1.5 flex flex-col justify-center min-w-0">
                                                <div className="text-[10px] uppercase font-black text-black tracking-wide leading-tight">SHIPPER</div>
                                                <div className="text-[12px] font-black text-black uppercase tracking-tight leading-tight break-words mt-0.5 text-left">
                                                    {shipperName ? (shipperName.startsWith('(') ? shipperName : `(${shipperName})`) : '-'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 3: Hero Container Box */}
                                        <div className="flex-[1.3] min-h-[75px] border-b-2 border-black flex">
                                            <div className="flex-1 border-r-2 border-black p-2 flex flex-col justify-center">
                                                <div className="text-[10.5px] uppercase font-black text-black tracking-wide leading-tight">NO. CONTAINER</div>
                                                <div className="text-2xl sm:text-3xl font-black tracking-wider text-black mt-0.5 leading-none">
                                                    {containerNumber || '-'}
                                                </div>
                                            </div>
                                            <div className="w-[200px] sm:w-[220px] p-2 flex flex-col justify-center items-center text-center bg-white">
                                                <div className="text-[10.5px] uppercase font-black text-black tracking-wide leading-tight">JUMLAH / UKURAN</div>
                                                <div className="text-xl sm:text-2xl font-black text-black mt-0.5 leading-none">{ukuranCont}</div>
                                            </div>
                                        </div>

                                        {/* Row 4: Subgrid Muatan & Layanan */}
                                        <div className="flex-[1.1] min-h-[70px] border-b-2 border-black flex">
                                            <div className="flex-1 border-r-2 border-black grid grid-cols-12 divide-x-2 divide-black bg-white">
                                                <div className="col-span-5 px-2 pt-1 pb-1.5 flex flex-col justify-between">
                                                    <div className="text-[10.5px] uppercase font-black text-black tracking-wide leading-tight">
                                                        ISI KONTAINER
                                                    </div>
                                                    <div className="flex-1 flex items-center">
                                                        <div className="text-[11.5px] font-black text-black break-words whitespace-normal leading-tight">
                                                            {isi || 'FULL CONT(ON-CHASIS)'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-3 px-2 pt-1 pb-1.5 flex flex-col justify-between">
                                                    <div className="text-[10.5px] uppercase font-black text-black tracking-wide leading-tight">
                                                        NO. SEGEL
                                                    </div>
                                                    <div className="flex-1 flex items-center">
                                                        <div className="text-[11.5px] font-black text-black break-words">
                                                            {noSegel || '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-4 px-2 pt-1 pb-1.5 flex flex-col justify-between">
                                                    <div className="text-[10.5px] uppercase font-black text-black tracking-wide leading-tight">
                                                        KETERANGAN
                                                    </div>
                                                    <div className="flex-1 flex items-center">
                                                        <div className="text-[11.5px] font-black text-black break-words">
                                                            {keterangan || '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-[200px] sm:w-[220px] px-2 pt-1 pb-1.5 flex flex-col items-center text-center bg-white justify-between">
                                                <div className="text-[10.5px] uppercase font-black text-black tracking-wide leading-tight">
                                                    NAMA PRODUK / LAYANAN
                                                </div>
                                                <div className="flex-1 flex items-center justify-center">
                                                    <div className="text-xs sm:text-sm font-black uppercase tracking-tight leading-tight text-black">
                                                        {layanan}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 5: Modern Footer & Signatures */}
                                        <div className="flex-[1.4] min-h-[95px] flex items-stretch divide-x-2 divide-black">
                                            <div className="w-[300px] sm:w-[325px] p-2 bg-white flex flex-col justify-start gap-1">
                                                <div className="text-[10.5px] font-black uppercase text-black underline tracking-wide leading-tight">PERHATIAN PENTING :</div>
                                                <div className="text-[11px] font-black text-black leading-snug mt-0.5">Mohon kondisi container dan segel dicek terlebih dahulu sebelum meninggalkan area depo. Segala bentuk komplain setelah keluar depo di luar tanggung jawab kami.</div>
                                            </div>
                                            <div className="flex-1 p-1.5 bg-white flex flex-col justify-between text-center">
                                                <div className="text-[10px] font-black uppercase text-black">DISERAHKAN OLEH</div>
                                                <div className="border-b-2 border-dotted border-black mx-2 mb-0.5"></div>
                                            </div>
                                            <div className="flex-1 p-1.5 bg-white flex flex-col justify-between text-center">
                                                <div className="text-[10px] font-black uppercase text-black">SOPIR TRUK</div>
                                                <div className="border-b-2 border-dotted border-black mx-2 mb-0.5"></div>
                                            </div>
                                            <div className="flex-1 p-1.5 bg-white flex flex-col justify-between text-center">
                                                <div className="text-[10px] font-black uppercase text-black">PENERIMA BARANG / DEPO</div>
                                                <div className="border-b-2 border-dotted border-black mx-2 mb-0.5"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* ===== PREVIEW LAYOUT VERSI 2: FORMAT EXCEL / CONTINUOUS FORM FISIK KLASIK (TINGGI 13 CM) ===== */
                                <div
                                    className="w-full h-full flex flex-col justify-between select-none"
                                    style={{ fontFamily: '"Courier New", Courier, monospace' }}
                                >
                                    <div className="w-full h-full border border-black bg-white flex flex-col justify-between">
                                        {/* Top Header Section (Tinggi ~120px / 32mm) */}
                                        <div className="flex justify-between items-stretch border-b border-black h-[120px] shrink-0">
                                            {/* Identitas Perusahaan & Customer */}
                                            <div className="flex-1 p-2.5 flex flex-col justify-between min-w-0">
                                                <div className="flex items-start">
                                                    {showLogo && (
                                                        <img
                                                            src="/logo.png"
                                                            alt="Logo Depo"
                                                            className="h-8 w-auto max-w-[38px] object-contain filter grayscale contrast-150 shrink-0 mr-2"
                                                            style={{ maxHeight: '32px', maxWidth: '38px' }}
                                                        />
                                                    )}
                                                    <div className="min-w-0">
                                                        {/* Font Nama PT Depo sama besar dengan No. Container (~18px / 14.5pt) */}
                                                        <div className="font-bold text-[18px] tracking-normal text-black leading-tight whitespace-nowrap">
                                                            PT. DEPO SURABAYA SEJAHTERA
                                                        </div>
                                                        <div className="font-bold text-[11px] text-black leading-tight mt-1 whitespace-nowrap">
                                                            Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)
                                                        </div>
                                                        <div className="font-bold text-[10.5px] text-black leading-tight mt-0.5 whitespace-nowrap">
                                                            Telp. 031-353 9484, 031-3539485 &nbsp; Fax. 031-3539482
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-1">
                                                    <div className="text-[13px] font-bold text-black leading-tight uppercase">
                                                        Customer : {customerName || '-'}
                                                    </div>
                                                    {shipperName && (
                                                        <div className="text-[12px] font-bold text-black leading-tight uppercase pl-24 mt-0.5">
                                                            ({shipperName})
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Meta Box Kanan Atas (4 Baris Bergaris Tipis, Total Tinggi 120px, Masing-masing 30px) */}
                                            <div className="w-[230px] sm:w-[245px] border-l border-black text-[12px] flex flex-col justify-between shrink-0">
                                                <div className="flex items-center border-b border-black h-[30px] px-2.5 font-bold">
                                                    <div className="w-[85px] text-black">Tanggal</div>
                                                    <div className="w-3 text-center text-black">:</div>
                                                    <div className="flex-1 text-black truncate">{tanggal || '-'}</div>
                                                </div>
                                                <div className="flex items-center border-b border-black h-[30px] px-2.5 font-bold">
                                                    <div className="w-[85px] text-black">Jam Keluar</div>
                                                    <div className="w-3 text-center text-black">:</div>
                                                    <div className="flex-1 text-black truncate">{jamKeluar || '-'}</div>
                                                </div>
                                                <div className="flex items-center border-b border-black h-[30px] px-2.5 font-bold">
                                                    <div className="w-[85px] text-black">No. Pol</div>
                                                    <div className="w-3 text-center text-black">:</div>
                                                    <div className="flex-1 text-black truncate">{noPol || '-'}</div>
                                                </div>
                                                <div className="flex items-center h-[30px] px-2.5 font-bold">
                                                    <div className="w-[85px] text-black">Tujuan</div>
                                                    <div className="w-3 text-center text-black">:</div>
                                                    <div className="flex-1 text-black truncate">{tujuan || '-'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Main Table Grid (Tinggi ~195px / 51mm) */}
                                        <table className="w-full border-collapse border-b border-black text-black h-[195px]">
                                            <tbody>
                                                <tr className="h-[50px]">
                                                    <td className="w-[120px] sm:w-[130px] border-r border-b border-black p-1.5 font-bold text-center text-[12px] uppercase leading-tight align-middle">
                                                        NO<br />CONTAINER
                                                    </td>
                                                    {/* Font No. Container sama besar dengan Nama PT Depo (~18px / 14.5pt) */}
                                                    <td className="border-r border-b border-black p-1 font-bold text-[18px] text-center tracking-wider align-middle">
                                                        {containerNumber || '-'}
                                                    </td>
                                                    <td className="w-[190px] sm:w-[205px] border-b border-black p-1 text-center align-middle font-bold text-sm sm:text-[15px]">
                                                        {ukuranCont}
                                                    </td>
                                                </tr>
                                                <tr className="h-[48px]">
                                                    <td className="border-r border-b border-black p-1 font-bold text-center text-[12px] uppercase align-middle">
                                                        ISI
                                                    </td>
                                                    <td className="border-r border-b border-black p-1 px-2.5 font-bold text-xs sm:text-[13px] text-center align-middle">
                                                        {isi || 'FULL CONT(ON-CHASIS)'}
                                                    </td>
                                                    <td rowSpan={3} className="border-black p-2 text-center align-middle">
                                                        <div className="text-[16px] sm:text-[17px] font-bold italic uppercase tracking-wide leading-tight">
                                                            {layanan}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="h-[48px]">
                                                    <td className="border-r border-b border-black p-1 font-bold text-center text-[12px] uppercase align-middle">
                                                        NO SEGEL
                                                    </td>
                                                    <td className="border-r border-b border-black p-1 px-2.5 font-bold text-xs sm:text-[13px] text-center align-middle">
                                                        {noSegel || '-'}
                                                    </td>
                                                </tr>
                                                <tr className="h-[48px]">
                                                    <td className="border-r border-black p-1 font-bold text-center text-[12px] uppercase align-middle">
                                                        KETERANGAN
                                                    </td>
                                                    <td className="border-r border-black p-1 px-2.5 font-bold text-xs sm:text-[13px] text-center align-middle">
                                                        {keterangan || '-'}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* Footer Signatures Grid (Tinggi ~170px / 45mm - Ruang Tanda Tangan Sangat Lapang) */}
                                        <table className="w-full border-collapse h-[170px] text-black">
                                            <tbody>
                                                <tr>
                                                    <td className="w-[220px] sm:w-[245px] border-r border-black p-3 text-[11px] font-bold leading-relaxed align-top">
                                                        <u className="font-bold">PERHATIAN :</u> Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami.
                                                    </td>
                                                    <td className="w-[125px] sm:w-[135px] border-r border-black text-center p-2 align-top">
                                                        <div className="font-bold text-[12px]">Diserahkan Oleh</div>
                                                    </td>
                                                    <td className="w-[125px] sm:w-[135px] border-r border-black text-center p-2 align-top">
                                                        <div className="font-bold text-[12px]">Sopir</div>
                                                    </td>
                                                    <td className="text-center p-2 align-top">
                                                        <div className="font-bold text-[12px]">{recipientTitle || 'Vessel Schedule'}</div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Tombol Aksi */}
                <div className="flex flex-wrap justify-between items-center pt-2 border-t mt-2 gap-2 sj-ui-footer">
                    <div className="text-xs text-gray-600">
                        Media: <strong>21 cm x 14 cm (Dot Matrix Continuous Form)</strong> &bull; Skala:{' '}
                        <strong className="text-indigo-700">{currentDim.label}</strong> &bull; Pilihan Layout:{' '}
                        <strong>{layoutStyle === 'standard' ? 'Versi 2 (Format Excel / Continuous)' : 'Versi 1 (Modern Industrial)'}</strong>
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
