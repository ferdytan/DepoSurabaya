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
    '88': {
        pageWidthMm: 184,
        pageHeightMm: 124,
        previewW: 696,
        previewH: 466,
        label: '88% (Rekomendasi Dot Matrix)',
        desc: 'Standar paling optimal untuk continuous form agar tidak terpotong tepi/traktor',
    },
    '85': {
        pageWidthMm: 178,
        pageHeightMm: 120,
        previewW: 672,
        previewH: 450,
        label: '85% (Kompak)',
        desc: 'Ekstra aman dari pinggiran kertas & lipatan perforasi',
    },
    '92': {
        pageWidthMm: 192,
        pageHeightMm: 128,
        previewW: 726,
        previewH: 484,
        label: '92%',
        desc: 'Sedikit lebih lebar',
    },
    '100': {
        pageWidthMm: 200,
        pageHeightMm: 132,
        previewW: 756,
        previewH: 500,
        label: '100% (Penuh)',
        desc: 'Ukuran media penuh tanpa pengurangan',
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
    const [printScale, setPrintScale] = useState<PrintScaleKey>('88'); // Default 88% untuk dot matrix anti terpotong

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

    const currentDim = SCALE_CONFIG[printScale] || SCALE_CONFIG['88'];

    // Generate standalone, self-contained HTML for printing (guaranteed 1 page, 210mm x 140mm)
    const generatePrintHtml = () => {
        const logoImgTag = showLogo
            ? `<img src="${window.location.origin}/logo.png" class="depo-logo" alt="Logo" style="height: 32px; max-height: 32px; width: 38px; max-width: 38px; object-fit: contain; margin-right: 6px;" />`
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
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
            padding: 0 !important;
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
        
        /* Modern Header */
        .m-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 1.2mm;
        }
        .m-brand {
            display: flex;
            align-items: center;
            gap: 2.5mm;
        }
        .depo-logo {
            height: 32px !important;
            max-height: 32px !important;
            width: 38px !important;
            object-fit: contain !important;
            filter: grayscale(100%) contrast(150%);
        }
        .m-brand-title {
            font-size: 12.5pt;
            font-weight: 900;
            letter-spacing: -0.2px;
            line-height: 1.1;
            color: #000000;
        }
        .m-brand-desc {
            font-size: 9pt;
            font-weight: 800;
            color: #000000;
            line-height: 1.2;
            margin-top: 1px;
        }
        .m-doc-box {
            text-align: right;
        }
        .m-doc-title {
            font-size: 18pt;
            font-weight: 900;
            letter-spacing: 2px;
            line-height: 1;
            color: #000000;
        }

        /* 4-Box Logistics Bar */
        .m-logistics-bar {
            display: flex;
            gap: 1.5mm;
            margin-top: 1.2mm;
        }
        .m-log-card {
            flex: 1;
            border: 2px solid #000;
            padding: 1.2mm 2mm;
            background: #ffffff;
        }
        .m-log-card:last-child {
            flex: 1.2;
        }
        .m-log-label {
            font-size: 9.5pt;
            text-transform: uppercase;
            font-weight: 900;
            color: #000000;
            letter-spacing: 0.3px;
        }
        .m-log-value {
            font-size: 11pt;
            font-weight: 900;
            color: #000000;
            margin-top: 0.5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Customer Banner */
        .m-party-banner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #ffffff;
            border: 2px solid #000;
            border-left: 5px solid #000;
            padding: 1.2mm 3mm;
            margin-top: 1.2mm;
            font-size: 11pt;
        }
        .m-party-cust {
            font-weight: 900;
            font-size: 11pt;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 0.2px;
        }
        .m-party-ship {
            font-weight: 900;
            font-size: 11pt;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 0.2px;
        }

        /* Hero Container Display */
        .m-container-hero {
            border: 2px solid #000;
            margin-top: 1.2mm;
            background: #ffffff;
            display: flex;
            flex-direction: column;
        }
        .m-hero-row {
            display: flex;
            width: 100%;
        }
        .m-hero-row-top {
            border-bottom: 2px solid #000;
            min-height: 18mm;
        }
        .m-hero-row-bottom {
            min-height: 16mm;
        }
        .m-cont-box {
            flex: 1;
            border-right: 2px solid #000;
            padding: 1.2mm 3mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .m-cont-lbl {
            font-size: 9.5pt;
            font-weight: 900;
            color: #000000;
            letter-spacing: 0.3px;
            text-transform: uppercase;
        }
        .m-cont-number {
            font-size: 25pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
            line-height: 1.05;
            margin-top: 0.5mm;
            color: #000000;
        }
        .m-size-box {
            width: 58mm;
            padding: 1.2mm 1.5mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: #ffffff;
        }
        .m-size-val {
            font-size: 17pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            line-height: 1.05;
            margin-top: 0.5mm;
            color: #000000;
        }
        .m-subgrid-box {
            flex: 1;
            border-right: 2px solid #000;
            display: flex;
        }
        .m-subcol {
            padding: 1mm 2mm;
            border-right: 2px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }
        .m-subcol:last-child {
            border-right: none;
        }
        .m-subcol-isi {
            flex: 1.5;
        }
        .m-subcol-segel {
            flex: 1;
        }
        .m-subcol-ket {
            flex: 1.3;
        }
        .m-subcol-lbl {
            font-size: 9.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
            letter-spacing: 0.2px;
            line-height: 1.1;
        }
        .m-subcol-val-wrap {
            flex: 1;
            display: flex;
            align-items: center;
        }
        .m-subcol-val {
            font-size: 10.5pt;
            font-weight: 900;
            color: #000000;
            line-height: 1.2;
            word-break: break-word;
            white-space: normal;
        }
        .m-service-box {
            width: 58mm;
            padding: 1mm 1.5mm;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            text-align: center;
            background: #ffffff;
        }
        .m-service-val-wrap {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .m-service-val {
            font-size: 12.5pt;
            font-weight: 900;
            text-transform: uppercase;
            line-height: 1.15;
            letter-spacing: 0.2px;
            color: #000000;
        }

        /* Modern Signatures */
        .m-footer-section {
            display: flex;
            gap: 2mm;
            margin-top: 1.2mm;
            align-items: stretch;
            height: 23mm;
        }
        .m-notice-box {
            width: 54mm;
            border: 2px solid #000;
            padding: 1.5mm 2mm;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .m-notice-title {
            font-size: 9.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
            text-decoration: underline;
            margin-bottom: 0.8mm;
            letter-spacing: 0.2px;
        }
        .m-notice-body {
            font-size: 8.5pt;
            font-weight: 800;
            line-height: 1.25;
            color: #000000;
        }
        .m-sig-card {
            flex: 1;
            border: 2px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1.2mm;
            text-align: center;
            background: #ffffff;
        }
        .m-sig-role {
            font-size: 9pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
        }
        .m-sig-line {
            border-bottom: 2px dotted #000;
            margin: 0 3mm 0.8mm 3mm;
        }
    </style>
</head>
<body>
    <div class="sj-print-wrapper">
        <div class="sj-page">
            <!-- Modern Header -->
            <div>
                <div class="m-header">
                    <div class="m-brand">
                        ${logoImgTag}
                        <div>
                            <div class="m-brand-title">PT. DEPO SURABAYA SEJAHTERA</div>
                            <div class="m-brand-desc">Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) &bull; Telp. 031-353 9484 / 3539485 &bull; Fax. 031-3539482</div>
                        </div>
                    </div>
                    <div class="m-doc-box">
                        <div class="m-doc-title">SURAT JALAN</div>
                    </div>
                </div>

                <!-- Logistics Cards -->
                <div class="m-logistics-bar">
                    <div class="m-log-card">
                        <div class="m-log-label">TANGGAL</div>
                        <div class="m-log-value">${tanggal || '-'}</div>
                    </div>
                    <div class="m-log-card">
                        <div class="m-log-label">JAM KELUAR</div>
                        <div class="m-log-value">${jamKeluar || '-'}</div>
                    </div>
                    <div class="m-log-card">
                        <div class="m-log-label">NO. POLISI</div>
                        <div class="m-log-value">${noPol || '-'}</div>
                    </div>
                    <div class="m-log-card">
                        <div class="m-log-label">TUJUAN</div>
                        <div class="m-log-value">${tujuan || '-'}</div>
                    </div>
                </div>

                <!-- Customer & Shipper Banner -->
                <div class="m-party-banner">
                    <div class="m-party-cust">CUSTOMER: ${customerName}</div>
                    ${shipperName ? `<div class="m-party-ship">SHIPPER: (${shipperName})</div>` : ''}
                </div>
            </div>

            <!-- Hero Container Box -->
            <div class="m-container-hero">
                <div class="m-hero-row m-hero-row-top">
                    <div class="m-cont-box">
                        <div class="m-cont-lbl">NO. CONTAINER</div>
                        <div class="m-cont-number">${containerNumber || '-'}</div>
                    </div>
                    <div class="m-size-box">
                        <div class="m-cont-lbl">JUMLAH / UKURAN</div>
                        <div class="m-size-val">${ukuranCont}</div>
                    </div>
                </div>
                <div class="m-hero-row m-hero-row-bottom">
                    <div class="m-subgrid-box">
                        <div class="m-subcol m-subcol-isi">
                            <div class="m-subcol-lbl">ISI KONTAINER</div>
                            <div class="m-subcol-val-wrap">
                                <div class="m-subcol-val">${isi || 'FULL CONT(ON-CHASIS)'}</div>
                            </div>
                        </div>
                        <div class="m-subcol m-subcol-segel">
                            <div class="m-subcol-lbl">NO. SEGEL</div>
                            <div class="m-subcol-val-wrap">
                                <div class="m-subcol-val">${noSegel || '-'}</div>
                            </div>
                        </div>
                        <div class="m-subcol m-subcol-ket">
                            <div class="m-subcol-lbl">KETERANGAN</div>
                            <div class="m-subcol-val-wrap">
                                <div class="m-subcol-val">${keterangan || '-'}</div>
                            </div>
                        </div>
                    </div>
                    <div class="m-service-box">
                        <div class="m-cont-lbl">NAMA PRODUK / LAYANAN</div>
                        <div class="m-service-val-wrap">
                            <div class="m-service-val">${layanan}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modern Footer & Signatures -->
            <div class="m-footer-section">
                <div class="m-notice-box">
                    <div class="m-notice-title">PERHATIAN PENTING :</div>
                    <div class="m-notice-body">Mohon kondisi container dan segel dicek terlebih dahulu sebelum meninggalkan area depo. Segala bentuk komplain setelah keluar depo di luar tanggung jawab kami.</div>
                </div>
                <div class="m-sig-card">
                    <div class="m-sig-role">DISERAHKAN OLEH</div>
                    <div class="m-sig-line"></div>
                </div>
                <div class="m-sig-card">
                    <div class="m-sig-role">SOPIR TRUK</div>
                    <div class="m-sig-line"></div>
                </div>
                <div class="m-sig-card">
                    <div class="m-sig-role">PENERIMA BARANG / DEPO</div>
                    <div class="m-sig-line"></div>
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
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
            padding: 0 !important;
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
            max-width: 82mm;
        }
        .depo-logo {
            height: 32px !important;
            max-height: 32px !important;
            width: 38px !important;
            max-width: 38px !important;
            object-fit: contain !important;
            margin-right: 6px !important;
            filter: grayscale(100%) contrast(150%);
        }
        .company-text {
            flex: 1;
        }
        .company-name {
            font-size: 13pt;
            font-weight: 900;
            letter-spacing: 0px;
            line-height: 1.15;
            color: #000000;
        }
        .company-address {
            font-size: 9pt;
            font-weight: 800;
            line-height: 1.25;
            margin-top: 1px;
            color: #000000;
        }
        .company-phone {
            font-size: 8.5pt;
            font-weight: 800;
            line-height: 1.2;
            color: #000000;
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
        }
        .title-text {
            font-size: 12.5pt;
            font-weight: 900;
            letter-spacing: 2px;
            line-height: 1;
            color: #000000;
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
                            {(['88', '85', '92', '100'] as const).map((key) => {
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
                                        {key === '88' ? '88% (Rekomendasi Dot Matrix)' : `${key}%`}
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
                        className="relative bg-white shadow-md border border-gray-400 w-[794px] min-w-[794px] h-[529px] min-h-[529px] rounded flex items-center justify-center select-none"
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
                                <div className="w-full h-full flex flex-col justify-between">
                                    {/* Modern Header */}
                                    <div>
                                        <div className="flex justify-between items-center border-b-2 border-black pb-1.5">
                                            <div className="flex items-center gap-2.5">
                                                {showLogo && (
                                                    <img
                                                        src="/logo.png"
                                                        alt="Logo Depo"
                                                        className="h-8 w-auto max-w-[38px] object-contain filter grayscale contrast-150 shrink-0"
                                                        style={{ maxHeight: '32px', maxWidth: '38px' }}
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-black text-[14px] tracking-tight text-black leading-tight">
                                                        PT. DEPO SURABAYA SEJAHTERA
                                                    </div>
                                                    <div className="text-[11px] font-bold text-black leading-tight mt-0.5">
                                                        Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) &bull; Telp. 031-353 9484 / 3539485 &bull; Fax. 031-3539482
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-xl tracking-[2px] text-black leading-none">
                                                    SURAT JALAN
                                                </div>
                                            </div>
                                        </div>

                                        {/* 4-Box Logistics Bar */}
                                        <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                                            <div className="border-2 border-black p-1.5 bg-white rounded-xs">
                                                <div className="text-[12px] uppercase font-black text-black tracking-wide">TANGGAL</div>
                                                <div className="text-[14px] font-black text-black truncate mt-0.5">{tanggal || '-'}</div>
                                            </div>
                                            <div className="border-2 border-black p-1.5 bg-white rounded-xs">
                                                <div className="text-[12px] uppercase font-black text-black tracking-wide">JAM KELUAR</div>
                                                <div className="text-[14px] font-black text-black truncate mt-0.5">{jamKeluar || '-'}</div>
                                            </div>
                                            <div className="border-2 border-black p-1.5 bg-white rounded-xs">
                                                <div className="text-[12px] uppercase font-black text-black tracking-wide">NO. POLISI</div>
                                                <div className="text-[14px] font-black text-black truncate mt-0.5">{noPol || '-'}</div>
                                            </div>
                                            <div className="border-2 border-black p-1.5 bg-white rounded-xs">
                                                <div className="text-[12px] uppercase font-black text-black tracking-wide">TUJUAN</div>
                                                <div className="text-[14px] font-black text-black truncate mt-0.5">{tujuan || '-'}</div>
                                            </div>
                                        </div>

                                        {/* Customer & Shipper Banner */}
                                        <div className="flex justify-between items-center bg-white border-2 border-black border-l-[5px] px-3 py-1.5 mt-1.5 text-[14px]">
                                            <div className="font-black text-black uppercase tracking-tight">
                                                CUSTOMER: <span className="font-black">{customerName}</span>
                                            </div>
                                            {shipperName && (
                                                <div className="font-black text-black uppercase tracking-tight">
                                                    SHIPPER: ({shipperName})
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Hero Container Box */}
                                    <div className="border-2 border-black rounded-xs overflow-hidden flex flex-col bg-white mt-1.5 min-h-[135px]">
                                        {/* Baris 1: No. Container & Jumlah / Ukuran */}
                                        <div className="flex border-b-2 border-black min-h-[70px]">
                                            <div className="flex-1 border-r-2 border-black p-2 flex flex-col justify-center">
                                                <div className="text-[12px] uppercase font-black text-black tracking-wide">NO. CONTAINER</div>
                                                <div className="text-2xl sm:text-3xl font-black tracking-wider text-black mt-0.5 leading-none">
                                                    {containerNumber || '-'}
                                                </div>
                                            </div>
                                            <div className="w-[220px] sm:w-[240px] p-2 flex flex-col justify-center items-center text-center bg-white">
                                                <div className="text-[12px] uppercase font-black text-black tracking-wide">JUMLAH / UKURAN</div>
                                                <div className="text-xl sm:text-2xl font-black text-black mt-0.5 leading-none">{ukuranCont}</div>
                                            </div>
                                        </div>

                                        {/* Baris 2: Subgrid 3 Kolom & Nama Produk / Layanan */}
                                        <div className="flex min-h-[65px]">
                                            <div className="flex-1 border-r-2 border-black grid grid-cols-12 divide-x-2 divide-black bg-white">
                                                <div className="col-span-5 px-2 pt-1 pb-1.5 flex flex-col justify-between">
                                                    <div className="text-[11.5px] uppercase font-black text-black tracking-wide leading-tight">
                                                        ISI KONTAINER
                                                    </div>
                                                    <div className="flex-1 flex items-center">
                                                        <div className="text-[12px] font-black text-black break-words whitespace-normal leading-tight">
                                                            {isi || 'FULL CONT(ON-CHASIS)'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-3 px-2 pt-1 pb-1.5 flex flex-col justify-between">
                                                    <div className="text-[11.5px] uppercase font-black text-black tracking-wide leading-tight">
                                                        NO. SEGEL
                                                    </div>
                                                    <div className="flex-1 flex items-center">
                                                        <div className="text-[12px] font-black text-black break-words">
                                                            {noSegel || '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-4 px-2 pt-1 pb-1.5 flex flex-col justify-between">
                                                    <div className="text-[11.5px] uppercase font-black text-black tracking-wide leading-tight">
                                                        KETERANGAN
                                                    </div>
                                                    <div className="flex-1 flex items-center">
                                                        <div className="text-[12px] font-black text-black break-words">
                                                            {keterangan || '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-[220px] sm:w-[240px] px-2 pt-1 pb-1.5 flex flex-col items-center text-center bg-white justify-between">
                                                <div className="text-[11.5px] uppercase font-black text-black tracking-wide leading-tight">
                                                    NAMA PRODUK / LAYANAN
                                                </div>
                                                <div className="flex-1 flex items-center justify-center">
                                                    <div className="text-sm sm:text-base font-black uppercase tracking-tight leading-tight text-black">
                                                        {layanan}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modern Footer & Signatures */}
                                    <div className="flex gap-2 h-[100px] items-stretch mt-1.5">
                                        <div className="w-[230px] sm:w-[250px] border-2 border-black p-2 bg-white flex flex-col justify-between">
                                            <div className="text-[11.5px] font-black uppercase text-black underline tracking-wide leading-tight">PERHATIAN PENTING :</div>
                                            <div className="text-[10.5px] font-bold text-black leading-snug mt-0.5">Mohon kondisi container dan segel dicek terlebih dahulu sebelum keluar depo. Komplain setelah keluar bukan tanggung jawab kami.</div>
                                        </div>
                                        <div className="flex-1 border-2 border-black p-1.5 bg-white flex flex-col justify-between text-center">
                                            <div className="text-[11px] font-black uppercase text-black">DISERAHKAN OLEH</div>
                                            <div className="border-b-2 border-dotted border-black mx-3"></div>
                                        </div>
                                        <div className="flex-1 border-2 border-black p-1.5 bg-white flex flex-col justify-between text-center">
                                            <div className="text-[11px] font-black uppercase text-black">SOPIR TRUK</div>
                                            <div className="border-b-2 border-dotted border-black mx-3"></div>
                                        </div>
                                        <div className="flex-1 border-2 border-black p-1.5 bg-white flex flex-col justify-between text-center">
                                            <div className="text-[11px] font-black uppercase text-black">PENERIMA</div>
                                            <div className="border-b-2 border-dotted border-black mx-3"></div>
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
                                            <div className="flex items-start max-w-[340px]">
                                                {showLogo && (
                                                    <img
                                                        src="/logo.png"
                                                        alt="Logo Depo"
                                                        className="h-8 w-auto max-w-[38px] object-contain filter grayscale contrast-150 shrink-0 mr-2"
                                                        style={{ maxHeight: '32px', maxWidth: '38px' }}
                                                    />
                                                )}
                                                <div className="company-text">
                                                    <div className="font-black text-[14px] tracking-normal text-black leading-tight">
                                                        PT. DEPO SURABAYA SEJAHTERA
                                                    </div>
                                                    <div className="font-bold text-[11px] text-black leading-snug mt-0.5">
                                                        Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)
                                                    </div>
                                                    <div className="font-bold text-[10.5px] text-black leading-snug">
                                                        Telp. 031-353 9484, 031-3539485 &nbsp; Fax. 031-3539482
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Box Judul SURAT JALAN */}
                                            <div className="border-2 border-black px-3 py-1 text-center self-start">
                                                <div className="font-black text-sm tracking-[2px] text-black">
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
