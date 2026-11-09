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
        pageHeightMm: 124,
        previewW: 764,
        previewH: 468,
        label: '100% (Rekomendasi Lebar)',
        desc: 'Lebar maksimal memenuhi continuous form rata kiri dan kanan',
    },
    '95': {
        pageWidthMm: 195,
        pageHeightMm: 124,
        previewW: 738,
        previewH: 468,
        label: '95%',
        desc: 'Lebar proporsional dengan margin aman',
    },
    '90': {
        pageWidthMm: 188,
        pageHeightMm: 124,
        previewW: 710,
        previewH: 468,
        label: '90%',
        desc: 'Ukuran sedang',
    },
    '85': {
        pageWidthMm: 180,
        pageHeightMm: 120,
        previewW: 680,
        previewH: 454,
        label: '85% (Kompak)',
        desc: 'Ekstra aman dari pinggiran kertas & lipatan perforasi',
    },
    '88': {
        pageWidthMm: 202,
        pageHeightMm: 124,
        previewW: 764,
        previewH: 468,
        label: '100% (Rekomendasi Lebar)',
        desc: 'Lebar maksimal memenuhi continuous form rata kiri dan kanan',
    },
    '92': {
        pageWidthMm: 195,
        pageHeightMm: 124,
        previewW: 738,
        previewH: 468,
        label: '95%',
        desc: 'Lebar proporsional dengan margin aman',
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
    const [layoutStyle, setLayoutStyle] = useState<'standard' | 'modern'>('modern'); // Opsi pilihan layout (default modern)
    const [printScale, setPrintScale] = useState<PrintScaleKey>('100'); // Default 100% (202mm lebar penuh)

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
            box-sizing: border-box;
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
            background: #ffffff !important;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
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

        // === LAYOUT STANDAR: CONTINUOUS FORM FISIK KLASIK ===
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Jalan - ${containerNumber || 'Depo Surabaya'}</title>
    <style>
        @page {
            size: 210mm 140mm;
            margin: 0mm;
        }
        *, *::before, *::after {
            box-sizing: border-box;
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
            background: #ffffff !important;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
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
        }
        .sj-page {
            width: ${pageWidthMm}mm !important;
            height: ${pageHeightMm}mm !important;
            max-width: ${pageWidthMm}mm !important;
            max-height: ${pageHeightMm}mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            box-sizing: border-box !important;
        }
        .header-section {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1mm;
        }
        .company-wrapper {
            display: flex;
            align-items: flex-start;
            max-width: 85mm;
            min-width: 0;
        }
        .depo-logo {
            height: 30px !important;
            max-height: 30px !important;
            width: 36px !important;
            max-width: 36px !important;
            object-fit: contain !important;
            margin-right: 6px !important;
            flex-shrink: 0;
            filter: grayscale(100%) contrast(150%);
        }
        .company-text {
            flex: 1;
            min-width: 0;
        }
        .company-name {
            font-size: 12.5pt;
            font-weight: 900;
            letter-spacing: 0px;
            line-height: 1.15;
            color: #000000;
            white-space: nowrap;
        }
        .company-address {
            font-size: 8.5pt;
            font-weight: 800;
            line-height: 1.25;
            margin-top: 1px;
            color: #000000;
            white-space: nowrap;
        }
        .company-phone {
            font-size: 8pt;
            font-weight: 800;
            line-height: 1.2;
            color: #000000;
            white-space: nowrap;
        }
        .customer-info {
            margin-top: 1.5mm;
            font-size: 11pt;
            font-weight: 900;
            line-height: 1.2;
            color: #000000;
            text-transform: uppercase;
        }
        .shipper-info {
            font-size: 10.5pt;
            font-weight: 900;
            padding-left: 18mm;
            color: #000000;
            text-transform: uppercase;
            margin-top: 0.5mm;
        }

        /* Title Box */
        .title-box {
            border: 2px solid #000;
            padding: 1.5mm 4mm;
            text-align: center;
            align-self: flex-start;
            margin: 0 1.5mm;
            flex-shrink: 0;
            white-space: nowrap;
        }
        .title-text {
            font-size: 12.5pt;
            font-weight: 900;
            letter-spacing: 2px;
            line-height: 1;
            color: #000000;
            white-space: nowrap;
        }

        /* Meta Box Right */
        .meta-box {
            width: 60mm;
            border: 2px solid #000;
            font-size: 9.5pt;
        }
        .meta-row {
            display: flex;
            border-bottom: 1.5px solid #000;
            height: 5.6mm;
            align-items: center;
        }
        .meta-row:last-child {
            border-bottom: none;
        }
        .meta-lbl {
            width: 22mm;
            padding-left: 2mm;
            font-weight: 900;
            font-size: 9.5pt;
            color: #000000;
        }
        .meta-sep {
            width: 3mm;
            font-weight: 900;
            color: #000000;
        }
        .meta-val {
            flex: 1;
            padding-right: 2mm;
            font-weight: 900;
            font-size: 10pt;
            color: #000000;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        /* Main Grid Table */
        table.grid-table {
            width: 100%;
            border: 2px solid #000;
            border-collapse: collapse;
        }
        table.grid-table td {
            border: 1.5px solid #000;
            vertical-align: middle;
        }
        .td-lbl {
            width: 28mm;
            font-size: 9.5pt;
            font-weight: 900;
            text-align: center;
            line-height: 1.15;
            padding: 0.8mm;
            color: #000000;
        }
        .td-cont-num {
            height: 14mm;
            font-size: 24pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-align: center;
            color: #000000;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
        }
        .td-val-row {
            height: 7.5mm;
            font-size: 10.5pt;
            font-weight: 900;
            text-align: center;
            padding: 0 2mm;
            color: #000000;
        }
        .td-service-col {
            width: 50mm;
            text-align: center;
            vertical-align: middle;
            padding: 0;
        }
        .service-size-box {
            font-size: 13pt;
            font-weight: 900;
            padding: 1.5mm 0;
            border-bottom: 1.5px solid #000;
            color: #000000;
        }
        .service-title-box {
            font-size: 12pt;
            font-weight: 900;
            padding: 3mm 1.5mm;
            line-height: 1.2;
            text-transform: uppercase;
            color: #000000;
        }

        /* Footer Signature Table */
        table.footer-table {
            width: 100%;
            border: 2px solid #000;
            border-top: none;
            border-collapse: collapse;
            height: 25mm;
        }
        table.footer-table td {
            border: 1.5px solid #000;
            vertical-align: top;
        }
        .td-notice {
            width: 50mm;
            padding: 2mm;
            font-size: 8.5pt;
            font-weight: 800;
            line-height: 1.25;
            color: #000000;
        }
        .td-notice u {
            font-weight: 900;
        }
        .td-sig-col {
            width: 30mm;
            text-align: center;
            font-size: 9.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
            padding-top: 2mm;
        }
        .td-sig-empty {
            flex: 1;
            text-align: center;
            font-size: 9.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
            padding-top: 2mm;
        }
    </style>
</head>
<body>
    <div class="sj-print-wrapper">
        <div class="sj-page">
            <!-- Top Section -->
            <div>
                <div class="header-section">
                    <!-- Company Info -->
                    <div class="company-wrapper">
                        ${logoImgTag}
                        <div class="company-text">
                            <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                            <div class="company-address">Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)</div>
                            <div class="company-phone">Telp. 031-353 9484, 031-3539485 &nbsp; Fax. 031-3539482</div>
                        </div>
                    </div>

                    <!-- Center Title SURAT JALAN -->
                    <div class="title-box">
                        <div class="title-text">SURAT JALAN</div>
                    </div>

                    <!-- Meta Box Kanan -->
                    <div class="meta-box">
                        <div class="meta-row">
                            <div class="meta-lbl">Tanggal</div>
                            <div class="meta-sep">:</div>
                            <div class="meta-val">${tanggal || '-'}</div>
                        </div>
                        <div class="meta-row">
                            <div class="meta-lbl">Jam Keluar</div>
                            <div class="meta-sep">:</div>
                            <div class="meta-val">${jamKeluar || '-'}</div>
                        </div>
                        <div class="meta-row">
                            <div class="meta-lbl">No. Pol</div>
                            <div class="meta-sep">:</div>
                            <div class="meta-val">${noPol || '-'}</div>
                        </div>
                        <div class="meta-row">
                            <div class="meta-lbl">Tujuan</div>
                            <div class="meta-sep">:</div>
                            <div class="meta-val">${tujuan || '-'}</div>
                        </div>
                    </div>
                </div>

                <!-- Customer & Shipper Row -->
                <div class="customer-info">
                    Customer : ${customerName}
                    ${shipperName ? `<div class="shipper-info">(${shipperName})</div>` : ''}
                </div>
            </div>

            <!-- Main Grid Table -->
            <table class="grid-table">
                <tbody>
                    <tr>
                        <td class="td-lbl">NO<br>CONTAINER</td>
                        <td class="td-cont-num">${containerNumber}</td>
                        <td rowspan="4" class="td-service-col">
                            <div class="service-size-box">${containerSize}</div>
                            <div class="service-title-box">${serviceType}</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-lbl">ISI</td>
                        <td class="td-val-row">${isi || 'FULL CONT(ON-CHASIS)'}</td>
                    </tr>
                    <tr>
                        <td class="td-lbl">NO SEGEL</td>
                        <td class="td-val-row">${noSegel || '-'}</td>
                    </tr>
                    <tr>
                        <td class="td-lbl">KETERANGAN</td>
                        <td class="td-val-row">${keterangan || '-'}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Footer Signatures Grid -->
            <table class="footer-table">
                <tbody>
                    <tr>
                        <td class="td-notice">
                            <strong><u>PERHATIAN :</u></strong> Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami.
                        </td>
                        <td class="td-sig-col">
                            Diserahkan oleh
                        </td>
                        <td class="td-sig-col">
                            Sopir
                        </td>
                        <td class="td-sig-empty">
                            Penerima
                        </td>
                    </tr>
                </tbody>
            </table>
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
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="text-lg font-bold flex items-center justify-between">
                        <span>Cetak Surat Jalan (Ukuran Media: 21 x 14 cm)</span>
                    </DialogTitle>
                </DialogHeader>

                {/* Form Pengaturan Cepat Data Dinamis & Pemilihan Layout */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        {/* Selector Layout Standar vs Modern */}
                        <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg p-0.5">
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
                                Standar (Continuous Form)
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
                                Desain Baru (Modern Clean)
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
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
                        </div>
                    </div>
                </div>

                {/* AREA PREVIEW SURAT JALAN (Simulasi Kertas Continuous Form 21 x 14 cm) */}
                <div className="flex flex-col items-center p-3 bg-slate-200/70 rounded-xl overflow-x-auto space-y-2">
                    {/* Wadah Simulasi Kertas Ukuran 210mm x 140mm (~794px x 529px) */}
                    <div
                        ref={printContainerRef}
                        className="relative bg-white shadow-md border border-gray-400 w-[794px] min-w-[794px] h-[529px] min-h-[529px] rounded flex flex-col items-center justify-start pt-[20px] select-none"
                        style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
                    >
                        {/* Sprocket Holes Indicator (Kiri & Kanan Kertas Dot Matrix) */}
                        <div className="absolute left-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-25">
                            {Array.from({ length: 16 }).map((_, i) => (
                                <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-700"></div>
                            ))}
                        </div>
                        <div className="absolute right-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-25">
                            {Array.from({ length: 16 }).map((_, i) => (
                                <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-700"></div>
                            ))}
                        </div>

                        {/* Garis Perforasi Batas Traktor */}
                        <div className="absolute left-[44px] top-0 bottom-0 border-r border-dashed border-gray-300 pointer-events-none" title="Batas perforasi traktor kiri"></div>
                        <div className="absolute right-[44px] top-0 bottom-0 border-l border-dashed border-gray-300 pointer-events-none" title="Batas perforasi traktor kanan"></div>

                        {/* Konten Area Cetak Dinamis Sesuai Skala */}
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
                                /* ===== PREVIEW LAYOUT STANDAR: KERTAS CONTINUOUS FORM FISIK ===== */
                                <div className="w-full h-full flex flex-col justify-between">
                                    {/* Top Header Section */}
                                    <div>
                                        <div className="flex justify-between items-start">
                                            {/* Identitas Perusahaan */}
                                            <div className="flex items-start max-w-[340px] min-w-0">
                                                {showLogo && (
                                                    <img
                                                        src="/logo.png"
                                                        alt="Logo Depo"
                                                        className="h-7 w-auto max-w-[36px] object-contain filter grayscale contrast-150 shrink-0 mr-2"
                                                        style={{ maxHeight: '30px', maxWidth: '36px' }}
                                                    />
                                                )}
                                                <div className="company-text min-w-0">
                                                    <div className="font-black text-[13.5px] tracking-normal text-black leading-tight whitespace-nowrap">
                                                        PT. DEPO SURABAYA SEJAHTERA
                                                    </div>
                                                    <div className="font-bold text-[10.5px] text-black leading-snug mt-0.5 whitespace-nowrap">
                                                        Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)
                                                    </div>
                                                    <div className="font-bold text-[10px] text-black leading-snug whitespace-nowrap">
                                                        Telp. 031-353 9484, 031-3539485 &nbsp; Fax. 031-3539482
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Box Judul SURAT JALAN */}
                                            <div className="border-2 border-black px-3 py-1 text-center self-start shrink-0 whitespace-nowrap">
                                                <div className="font-black text-sm tracking-[2px] text-black whitespace-nowrap">
                                                    SURAT JALAN
                                                </div>
                                            </div>

                                            {/* Meta Box Kanan Atas */}
                                            <div className="w-[230px] border-2 border-black text-[12.5px]">
                                                <div className="flex border-b-2 border-black py-0.5 items-center">
                                                    <div className="w-[85px] pl-2 font-black text-black">Tanggal</div>
                                                    <div className="w-3 font-black text-black">:</div>
                                                    <div className="flex-1 pr-1.5 font-black text-black truncate">{tanggal || '-'}</div>
                                                </div>
                                                <div className="flex border-b-2 border-black py-0.5 items-center">
                                                    <div className="w-[85px] pl-2 font-black text-black">Jam Keluar</div>
                                                    <div className="w-3 font-black text-black">:</div>
                                                    <div className="flex-1 pr-1.5 font-black text-black truncate">{jamKeluar || '-'}</div>
                                                </div>
                                                <div className="flex border-b-2 border-black py-0.5 items-center">
                                                    <div className="w-[85px] pl-2 font-black text-black">No. Pol</div>
                                                    <div className="w-3 font-black text-black">:</div>
                                                    <div className="flex-1 pr-1.5 font-black text-black truncate">{noPol || '-'}</div>
                                                </div>
                                                <div className="flex py-0.5 items-center">
                                                    <div className="w-[85px] pl-2 font-black text-black">Tujuan</div>
                                                    <div className="w-3 font-black text-black">:</div>
                                                    <div className="flex-1 pr-1.5 font-black text-black truncate">{tujuan || '-'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Baris Customer & Shipper */}
                                        <div className="mt-1.5 text-[14px] font-black text-black leading-tight uppercase">
                                            Customer : <span className="font-black">{customerName}</span>
                                            {shipperName && (
                                                <div className="font-black text-black text-[13px] pl-16 mt-0.5">
                                                    ({shipperName})
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Main Table Grid */}
                                    <table className="w-full border-2 border-black border-collapse">
                                        <tbody>
                                            <tr>
                                                <td className="w-[115px] border-2 border-black p-1.5 font-black text-center text-[12px] text-black uppercase">
                                                    NO<br />CONTAINER
                                                </td>
                                                <td className="border-2 border-black p-1.5 font-black text-2xl sm:text-3xl text-center tracking-normal text-black">
                                                    {containerNumber}
                                                </td>
                                                <td rowSpan={4} className="w-[200px] border-2 border-black p-0 text-center align-middle bg-white">
                                                    <div className="text-sm font-black py-2 border-b-2 border-black text-black">
                                                        {containerSize}
                                                    </div>
                                                    <div className="text-sm font-black py-4 px-1.5 tracking-wide uppercase leading-tight text-black">
                                                        {serviceType}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border-2 border-black p-1 font-black text-center text-[12px] text-black uppercase">
                                                    ISI
                                                </td>
                                                <td className="border-2 border-black p-1 px-2.5 font-black text-xs sm:text-[13px] text-center text-black">
                                                    {isi || 'FULL CONT(ON-CHASIS)'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border-2 border-black p-1 font-black text-center text-[12px] text-black uppercase">
                                                    NO SEGEL
                                                </td>
                                                <td className="border-2 border-black p-1 px-2.5 font-black text-xs sm:text-[13px] text-center text-black">
                                                    {noSegel || '-'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border-2 border-black p-1 font-black text-center text-[12px] text-black uppercase">
                                                    KETERANGAN
                                                </td>
                                                <td className="border-2 border-black p-1 px-2.5 font-black text-xs sm:text-[13px] text-center text-black">
                                                    {keterangan || '-'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {/* Footer Signatures Grid */}
                                    <table className="w-full border-2 border-black border-t-0 border-collapse h-[95px]">
                                        <tbody>
                                            <tr>
                                                <td className="w-[230px] sm:w-[250px] border-2 border-black p-2 text-[10.5px] font-bold leading-snug text-black align-top">
                                                    <strong className="underline font-black">PERHATIAN :</strong> Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami.
                                                </td>
                                                <td className="w-[125px] border-2 border-black text-center p-1.5 align-top">
                                                    <div className="font-black text-[11px] uppercase text-black">Diserahkan oleh</div>
                                                </td>
                                                <td className="w-[125px] border-2 border-black text-center p-1.5 align-top">
                                                    <div className="font-black text-[11px] uppercase text-black">Sopir</div>
                                                </td>
                                                <td className="border-2 border-black text-center p-1.5 align-top">
                                                    <div className="font-black text-[11px] uppercase text-black">Penerima</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Tombol Aksi */}
                <div className="flex flex-wrap justify-between items-center pt-2 border-t mt-2 gap-2">
                    <div className="text-xs text-gray-600">
                        Media: <strong>21 cm x 14 cm (Dot Matrix Continuous Form)</strong> &bull; Skala:{' '}
                        <strong className="text-indigo-700">{currentDim.label}</strong> &bull; Pilihan Layout:{' '}
                        <strong>{layoutStyle === 'modern' ? 'Desain Baru (Modern Clean)' : 'Standar (Continuous Form)'}</strong>
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
