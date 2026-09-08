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
}

interface SuratJalanModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: SuratJalanData | null;
}

export default function SuratJalanModal({ isOpen, onClose, data }: SuratJalanModalProps) {
    const printContainerRef = useRef<HTMLDivElement>(null);

    // Dynamic state that can be fine-tuned before printing
    const [tanggal, setTanggal] = useState('');
    const [jamKeluar, setJamKeluar] = useState('');
    const [noPol, setNoPol] = useState('');
    const [tujuan, setTujuan] = useState('');
    const [noSegel, setNoSegel] = useState('-');
    const [isi, setIsi] = useState('FULL CONT(ON-CHASIS)');
    const [keterangan, setKeterangan] = useState('-');
    const [containerNumber, setContainerNumber] = useState('');
    const [showLogo, setShowLogo] = useState(false); // Default false matching continuous form sample photo
    const [layoutStyle, setLayoutStyle] = useState<'standard' | 'modern'>('standard'); // Opsi pilihan layout

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

    const containerSize = formatContainerSize(data?.size);
    const serviceType = data?.service_type || 'PEMERIKSAAN KARANTINA';
    const customerName = data?.customer_name || '-';
    const shipperName = data?.shipper_name || null;

    // Generate standalone, self-contained HTML for printing (guaranteed 1 page, 210mm x 140mm)
    const generatePrintHtml = () => {
        const logoImgTag = showLogo
            ? `<img src="${window.location.origin}/logo.png" class="depo-logo" alt="Logo" style="height: 35px; max-height: 35px; width: 42px; max-width: 42px; object-fit: contain; margin-right: 8px;" />`
            : '';

        if (layoutStyle === 'modern') {
            // === LAYOUT BARU: MODERN CLEAN INDUSTRIAL (210mm x 140mm) ===
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
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
            color: #000000 !important;
            overflow: hidden !important;
        }
        .sj-page {
            width: 210mm !important;
            height: 140mm !important;
            max-height: 140mm !important;
            padding: 4.5mm 7.5mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
        }
        
        /* Modern Header */
        .m-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 2mm;
        }
        .m-brand {
            display: flex;
            align-items: center;
            gap: 3mm;
        }
        .depo-logo {
            height: 36px !important;
            max-height: 36px !important;
            width: 42px !important;
            object-fit: contain !important;
            filter: grayscale(100%) contrast(150%);
        }
        .m-brand-title {
            font-size: 13pt;
            font-weight: 900;
            letter-spacing: -0.3px;
            line-height: 1.1;
        }
        .m-brand-desc {
            font-size: 7.5pt;
            color: #222;
            line-height: 1.25;
            margin-top: 1px;
        }
        .m-doc-box {
            text-align: right;
        }
        .m-doc-title {
            font-size: 15pt;
            font-weight: 900;
            letter-spacing: 2px;
            line-height: 1;
        }
        .m-doc-badge {
            display: inline-block;
            font-size: 7.5pt;
            font-weight: 700;
            background: #000;
            color: #fff !important;
            padding: 1px 6px;
            margin-top: 2px;
            border-radius: 2px;
            letter-spacing: 0.5px;
        }

        /* 4-Box Logistics Bar */
        .m-logistics-bar {
            display: flex;
            gap: 2mm;
            margin-top: 2mm;
        }
        .m-log-card {
            flex: 1;
            border: 1px solid #000;
            padding: 1.5mm 2.5mm;
            background: #fafafa;
        }
        .m-log-card:last-child {
            flex: 1.3;
        }
        .m-log-label {
            font-size: 6.5pt;
            text-transform: uppercase;
            font-weight: 800;
            color: #444;
            letter-spacing: 0.5px;
        }
        .m-log-value {
            font-size: 8.5pt;
            font-weight: 800;
            margin-top: 1px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Customer Banner */
        .m-party-banner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f0f0f0;
            border-left: 3.5px solid #000;
            padding: 1.5mm 3mm;
            margin-top: 2mm;
            font-size: 8.5pt;
        }
        .m-party-cust {
            font-weight: 900;
        }
        .m-party-ship {
            font-weight: 700;
            color: #333;
        }

        /* Hero Container Display */
        .m-container-hero {
            border: 2px solid #000;
            margin-top: 2mm;
        }
        .m-hero-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #000;
            color: #fff;
            padding: 1.2mm 3.5mm;
        }
        .m-hero-top-left {
            font-size: 8pt;
            font-weight: 800;
            color: #fff;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .m-hero-tags {
            display: flex;
            gap: 2mm;
        }
        .m-tag {
            font-size: 7.5pt;
            font-weight: 800;
            background: #fff;
            color: #000;
            padding: 1px 6px;
            border-radius: 2px;
        }
        .m-hero-main {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 2.5mm 4mm;
            border-bottom: 1px solid #000;
            background: #fff;
        }
        .m-cont-number {
            font-size: 27pt;
            font-weight: 900;
            letter-spacing: -0.5px; /* Karakter rapat tegas */
            font-family: "Arial Black", Impact, monospace, sans-serif;
            line-height: 1;
        }
        .m-service-title {
            font-size: 11.5pt;
            font-weight: 900;
            font-style: italic;
            text-align: right;
            text-transform: uppercase;
            line-height: 1.15;
            max-width: 65mm;
        }
        .m-hero-subgrid {
            display: flex;
        }
        .m-subcol {
            flex: 1;
            padding: 1.5mm 3mm;
            border-right: 1px solid #000;
        }
        .m-subcol:last-child {
            border-right: none;
            flex: 1.5;
        }
        .m-subcol-lbl {
            font-size: 6.5pt;
            font-weight: 800;
            text-transform: uppercase;
            color: #444;
        }
        .m-subcol-val {
            font-size: 8.5pt;
            font-weight: 700;
            margin-top: 1px;
        }

        /* Modern Signatures */
        .m-footer-section {
            display: flex;
            gap: 2.5mm;
            margin-top: 2mm;
            align-items: stretch;
            height: 27mm;
        }
        .m-notice-box {
            width: 50mm;
            border: 1px solid #000;
            padding: 2mm;
            font-size: 7pt;
            line-height: 1.3;
            background: #fafafa;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .m-notice-box u {
            font-weight: 800;
        }
        .m-sig-card {
            flex: 1;
            border: 1px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1.5mm;
            text-align: center;
        }
        .m-sig-role {
            font-size: 7.5pt;
            font-weight: 800;
            text-transform: uppercase;
        }
        .m-sig-line {
            border-bottom: 1px dotted #555;
            margin: 0 4mm 1mm 4mm;
        }
    </style>
</head>
<body>
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
                    <span class="m-doc-badge">KONTROL PENGIRIMAN</span>
                </div>
            </div>

            <!-- Logistics Cards -->
            <div class="m-logistics-bar">
                <div class="m-log-card">
                    <div class="m-log-label">Tanggal</div>
                    <div class="m-log-value">${tanggal || '-'}</div>
                </div>
                <div class="m-log-card">
                    <div class="m-log-label">Jam Keluar</div>
                    <div class="m-log-value">${jamKeluar || '-'}</div>
                </div>
                <div class="m-log-card">
                    <div class="m-log-label">No. Polisi</div>
                    <div class="m-log-value">${noPol || '-'}</div>
                </div>
                <div class="m-log-card">
                    <div class="m-log-label">Tujuan Pengiriman</div>
                    <div class="m-log-value">${tujuan || '-'}</div>
                </div>
            </div>

            <!-- Customer & Shipper Banner -->
            <div class="m-party-banner">
                <div class="m-party-cust">Customer: ${customerName}</div>
                ${shipperName ? `<div class="m-party-ship">Shipper: (${shipperName})</div>` : ''}
            </div>
        </div>

        <!-- Hero Container Box -->
        <div class="m-container-hero">
            <div class="m-hero-top">
                <div class="m-hero-top-left">NO CONTAINER &bull; IDENTIFIKASI UTAMA</div>
                <div class="m-hero-tags">
                    <span class="m-tag">${containerSize}</span>
                </div>
            </div>
            <div class="m-hero-main">
                <div class="m-cont-number">${containerNumber}</div>
                <div class="m-service-title">${serviceType}</div>
            </div>
            <div class="m-hero-subgrid">
                <div class="m-subcol">
                    <div class="m-subcol-lbl">Isi Kontainer</div>
                    <div class="m-subcol-val">${isi || 'FULL CONT(ON-CHASIS)'}</div>
                </div>
                <div class="m-subcol">
                    <div class="m-subcol-lbl">No. Segel</div>
                    <div class="m-subcol-val">${noSegel || '-'}</div>
                </div>
                <div class="m-subcol">
                    <div class="m-subcol-lbl">Keterangan / Catatan</div>
                    <div class="m-subcol-val">${keterangan || '-'}</div>
                </div>
            </div>
        </div>

        <!-- Modern Footer & Signatures -->
        <div class="m-footer-section">
            <div class="m-notice-box">
                <div><strong><u>PERHATIAN PENTING :</u></strong></div>
                <div>Mohon kondisi container dan segel dicek terlebih dahulu sebelum meninggalkan area depo. Segala bentuk komplain setelah keluar depo di luar tanggung jawab kami.</div>
            </div>
            <div class="m-sig-card">
                <div class="m-sig-role">Diserahkan Oleh</div>
                <div class="m-sig-line"></div>
            </div>
            <div class="m-sig-card">
                <div class="m-sig-role">Sopir Truk</div>
                <div class="m-sig-line"></div>
            </div>
            <div class="m-sig-card">
                <div class="m-sig-role">Penerima Barang / Depo</div>
                <div class="m-sig-line"></div>
            </div>
        </div>
    </div>
</body>
</html>`;
        }

        // === LAYOUT STANDAR: CONTINUOUS FORM FISIK KLASIK (210mm x 140mm) ===
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
        .sj-page {
            width: 210mm !important;
            height: 140mm !important;
            max-height: 140mm !important;
            padding: 4mm 7mm 4mm 7mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            break-before: avoid !important;
            break-inside: avoid !important;
            break-after: avoid !important;
        }
        .header-section {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5mm;
        }
        .company-wrapper {
            display: flex;
            align-items: flex-start;
            max-width: 95mm;
        }
        .depo-logo {
            height: 35px !important;
            max-height: 35px !important;
            width: 42px !important;
            max-width: 42px !important;
            object-fit: contain !important;
            margin-right: 7px !important;
            filter: grayscale(100%) contrast(150%);
        }
        .company-text {
            flex: 1;
        }
        .company-name {
            font-size: 13.5pt;
            font-weight: 900;
            letter-spacing: 0px;
            line-height: 1.15;
            color: #000;
        }
        .company-address {
            font-size: 8.5pt;
            font-weight: 600;
            line-height: 1.25;
            margin-top: 1px;
            color: #111;
        }
        .company-phone {
            font-size: 8pt;
            font-weight: 500;
            line-height: 1.2;
            color: #222;
        }
        .customer-info {
            margin-top: 2mm;
            font-size: 9pt;
            font-weight: 800;
            line-height: 1.25;
        }
        .shipper-info {
            font-size: 8.5pt;
            font-weight: 700;
            padding-left: 17mm;
            color: #222;
        }

        /* Title Box */
        .title-box {
            border: 1.5px solid #000;
            padding: 2mm 6mm;
            text-align: center;
            align-self: flex-start;
            margin: 0 2mm;
        }
        .title-text {
            font-size: 12.5pt;
            font-weight: 900;
            letter-spacing: 2px;
            line-height: 1;
            color: #000;
        }

        /* Meta Box Right */
        .meta-box {
            width: 62mm;
            border: 1.5px solid #000;
            font-size: 8pt;
        }
        .meta-row {
            display: flex;
            border-bottom: 1px solid #000;
            height: 5.4mm;
            align-items: center;
        }
        .meta-row:last-child {
            border-bottom: none;
        }
        .meta-lbl {
            width: 21mm;
            padding-left: 2mm;
            font-weight: 600;
        }
        .meta-sep {
            width: 3mm;
            font-weight: 700;
        }
        .meta-val {
            flex: 1;
            padding-right: 2mm;
            font-weight: 700;
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
            border: 1px solid #000;
            vertical-align: middle;
        }
        .td-lbl {
            width: 33mm;
            font-size: 8.5pt;
            font-weight: 800;
            text-align: center;
            line-height: 1.15;
            padding: 1mm;
        }
        .td-cont-num {
            height: 16mm;
            font-size: 26pt;
            font-weight: 900;
            letter-spacing: -0.5px !important; /* Rapat antar karakter sesuai permintaan */
            text-align: center;
            font-family: 'Arial Black', Impact, Arial, monospace, sans-serif;
        }
        .td-val-row {
            height: 8.5mm;
            font-size: 10pt;
            font-weight: 700;
            text-align: center;
            padding: 0 3mm;
        }
        .td-service-col {
            width: 56mm;
            text-align: center;
            vertical-align: middle;
            padding: 0;
        }
        .service-size-box {
            font-size: 12.5pt;
            font-weight: 900;
            padding: 2mm 0;
            border-bottom: 1.5px solid #000;
        }
        .service-title-box {
            font-size: 13pt;
            font-weight: 900;
            font-style: italic;
            padding: 4mm 2mm;
            line-height: 1.25;
            text-transform: uppercase;
        }

        /* Footer Signature Table */
        table.footer-table {
            width: 100%;
            border: 2px solid #000;
            border-top: none;
            border-collapse: collapse;
            height: 31mm;
        }
        table.footer-table td {
            border: 1px solid #000;
            vertical-align: top;
        }
        .td-notice {
            width: 46mm;
            padding: 2.5mm;
            font-size: 7.5pt;
            line-height: 1.3;
            color: #111;
        }
        .td-notice u {
            font-weight: 700;
        }
        .td-sig-col {
            width: 36mm;
            text-align: center;
            font-size: 8.5pt;
            font-weight: 700;
            padding-top: 2mm;
        }
        .td-sig-empty {
            flex: 1;
            text-align: center;
            font-size: 8.5pt;
            font-weight: 700;
            padding-top: 2mm;
        }
    </style>
</head>
<body>
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

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
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
                        <div>
                            <Label className="text-[11px] text-gray-700">No. Container</Label>
                            <Input
                                value={containerNumber}
                                onChange={(e) => setContainerNumber(e.target.value)}
                                className="h-8 text-xs bg-white font-mono font-bold tracking-tight"
                                placeholder="Nomor Container"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-4 lg:col-span-7">
                            <Label className="text-[11px] text-gray-700">Keterangan</Label>
                            <Input
                                value={keterangan}
                                onChange={(e) => setKeterangan(e.target.value)}
                                className="h-8 text-xs bg-white"
                                placeholder="Catatan / keterangan tambahan..."
                            />
                        </div>
                    </div>
                </div>

                {/* AREA PREVIEW SURAT JALAN (Simulasi Kertas Continuous Form 21 x 14 cm) */}
                <div className="flex justify-center p-3 bg-slate-200/70 rounded-xl overflow-x-auto">
                    {/* Wadah Simulasi Kertas Ukuran 210mm x 140mm (~794px x 529px) */}
                    <div
                        ref={printContainerRef}
                        className="relative bg-white shadow-md border border-gray-400 p-6 w-[794px] min-w-[794px] h-[529px] min-h-[529px] rounded flex flex-col justify-between select-none"
                    >
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

                        {layoutStyle === 'modern' ? (
                            /* ===== PREVIEW LAYOUT BARU: MODERN CLEAN ===== */
                            <div className="w-full h-full flex flex-col justify-between">
                                {/* Modern Header */}
                                <div>
                                    <div className="flex justify-between items-center border-b-2 border-black pb-2">
                                        <div className="flex items-center gap-3">
                                            {showLogo && (
                                                <img
                                                    src="/logo.png"
                                                    alt="Logo Depo"
                                                    className="h-9 w-auto max-w-[42px] object-contain filter grayscale contrast-150 shrink-0"
                                                    style={{ maxHeight: '36px', maxWidth: '42px' }}
                                                />
                                            )}
                                            <div>
                                                <div className="font-black text-[15px] tracking-tight text-black leading-tight">
                                                    PT. DEPO SURABAYA SEJAHTERA
                                                </div>
                                                <div className="text-[10px] text-gray-700 leading-tight mt-0.5">
                                                    Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) &bull; Telp. 031-353 9484 / 3539485 &bull; Fax. 031-3539482
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-lg tracking-[2px] text-black leading-none">
                                                SURAT JALAN
                                            </div>
                                            <span className="inline-block text-[9px] font-bold bg-black text-white px-1.5 py-0.5 mt-1 rounded-xs tracking-wider">
                                                KONTROL PENGIRIMAN
                                            </span>
                                        </div>
                                    </div>

                                    {/* 4-Box Logistics Bar */}
                                    <div className="grid grid-cols-4 gap-2 mt-2">
                                        <div className="border border-black p-1.5 bg-gray-50 rounded-xs">
                                            <div className="text-[9px] uppercase font-bold text-gray-600">Tanggal</div>
                                            <div className="text-[12px] font-black truncate">{tanggal || '-'}</div>
                                        </div>
                                        <div className="border border-black p-1.5 bg-gray-50 rounded-xs">
                                            <div className="text-[9px] uppercase font-bold text-gray-600">Jam Keluar</div>
                                            <div className="text-[12px] font-black truncate">{jamKeluar || '-'}</div>
                                        </div>
                                        <div className="border border-black p-1.5 bg-gray-50 rounded-xs">
                                            <div className="text-[9px] uppercase font-bold text-gray-600">No. Polisi</div>
                                            <div className="text-[12px] font-black truncate">{noPol || '-'}</div>
                                        </div>
                                        <div className="border border-black p-1.5 bg-gray-50 rounded-xs">
                                            <div className="text-[9px] uppercase font-bold text-gray-600">Tujuan</div>
                                            <div className="text-[12px] font-black truncate">{tujuan || '-'}</div>
                                        </div>
                                    </div>

                                    {/* Customer & Shipper Banner */}
                                    <div className="flex justify-between items-center bg-gray-100 border-l-4 border-black px-3 py-1.5 mt-2 text-xs">
                                        <div className="font-bold text-black">
                                            Customer: <span className="font-black">{customerName}</span>
                                        </div>
                                        {shipperName && (
                                            <div className="font-semibold text-gray-800">
                                                Shipper: ({shipperName})
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Hero Container Box */}
                                <div className="border-2 border-black rounded-xs overflow-hidden">
                                    <div className="flex justify-between items-center bg-black text-white px-3 py-1">
                                        <span className="text-[10px] font-black tracking-wider uppercase text-white">
                                            NO CONTAINER &bull; IDENTIFIKASI UTAMA
                                        </span>
                                        <span className="bg-white text-black text-[10px] font-black px-2 py-0.5 rounded-xs">
                                            {containerSize}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-black">
                                        <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-black">
                                            {containerNumber}
                                        </div>
                                        <div className="text-sm font-black italic uppercase text-right leading-tight max-w-[260px]">
                                            {serviceType}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 divide-x divide-black bg-gray-50/50">
                                        <div className="p-2">
                                            <div className="text-[9px] uppercase font-bold text-gray-600">Isi Kontainer</div>
                                            <div className="text-[11px] font-bold text-black">{isi || 'FULL CONT(ON-CHASIS)'}</div>
                                        </div>
                                        <div className="p-2">
                                            <div className="text-[9px] uppercase font-bold text-gray-600">No. Segel</div>
                                            <div className="text-[11px] font-bold text-black">{noSegel || '-'}</div>
                                        </div>
                                        <div className="p-2">
                                            <div className="text-[9px] uppercase font-bold text-gray-600">Keterangan</div>
                                            <div className="text-[11px] font-bold text-black">{keterangan || '-'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modern Footer & Signatures */}
                                <div className="flex gap-2.5 h-[105px] items-stretch">
                                    <div className="w-[200px] border border-black p-2 bg-gray-50 text-[9.5px] leading-tight flex flex-col justify-between">
                                        <div><strong><u>PERHATIAN PENTING :</u></strong></div>
                                        <div className="text-gray-700">Mohon kondisi container dan segel dicek terlebih dahulu sebelum keluar depo. Komplain setelah keluar bukan tanggung jawab kami.</div>
                                    </div>
                                    <div className="flex-1 border border-black p-2 flex flex-col justify-between text-center">
                                        <div className="text-[11px] font-bold uppercase">Diserahkan Oleh</div>
                                        <div className="border-b border-dashed border-gray-500 mx-4"></div>
                                    </div>
                                    <div className="flex-1 border border-black p-2 flex flex-col justify-between text-center">
                                        <div className="text-[11px] font-bold uppercase">Sopir Truk</div>
                                        <div className="border-b border-dashed border-gray-500 mx-4"></div>
                                    </div>
                                    <div className="flex-1 border border-black p-2 flex flex-col justify-between text-center">
                                        <div className="text-[11px] font-bold uppercase">Penerima</div>
                                        <div className="border-b border-dashed border-gray-500 mx-4"></div>
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
                                        <div className="flex items-start max-w-[360px]">
                                            {showLogo && (
                                                <img
                                                    src="/logo.png"
                                                    alt="Logo Depo"
                                                    className="h-9 w-auto max-w-[42px] object-contain filter grayscale contrast-150 shrink-0 mr-2"
                                                    style={{ maxHeight: '36px', maxWidth: '42px' }}
                                                />
                                            )}
                                            <div className="company-text">
                                                <div className="font-black text-[15px] tracking-normal text-black leading-tight">
                                                    PT. DEPO SURABAYA SEJAHTERA
                                                </div>
                                                <div className="font-semibold text-[11px] text-gray-800 leading-snug mt-0.5">
                                                    Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)
                                                </div>
                                                <div className="text-[10px] text-gray-700 leading-snug">
                                                    Telp. 031-353 9484, 031-3539485 &nbsp; Fax. 031-3539482
                                                </div>
                                            </div>
                                        </div>

                                        {/* Box Judul SURAT JALAN */}
                                        <div className="border-[1.5px] border-black px-3.5 py-1 text-center self-start">
                                            <div className="font-black text-sm tracking-[2px] text-black">
                                                SURAT JALAN
                                            </div>
                                        </div>

                                        {/* Meta Box Kanan Atas */}
                                        <div className="w-[230px] border-[1.5px] border-black text-[11px]">
                                            <div className="flex border-b border-black py-0.5 items-center">
                                                <div className="w-[80px] pl-2 font-semibold">Tanggal</div>
                                                <div className="w-3 font-bold">:</div>
                                                <div className="flex-1 pr-2 font-bold truncate">{tanggal || '-'}</div>
                                            </div>
                                            <div className="flex border-b border-black py-0.5 items-center">
                                                <div className="w-[80px] pl-2 font-semibold">Jam Keluar</div>
                                                <div className="w-3 font-bold">:</div>
                                                <div className="flex-1 pr-2 font-bold truncate">{jamKeluar || '-'}</div>
                                            </div>
                                            <div className="flex border-b border-black py-0.5 items-center">
                                                <div className="w-[80px] pl-2 font-semibold">No. Pol</div>
                                                <div className="w-3 font-bold">:</div>
                                                <div className="flex-1 pr-2 font-bold truncate">{noPol || '-'}</div>
                                            </div>
                                            <div className="flex py-0.5 items-center">
                                                <div className="w-[80px] pl-2 font-semibold">Tujuan</div>
                                                <div className="w-3 font-bold">:</div>
                                                <div className="flex-1 pr-2 font-bold truncate">{tujuan || '-'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Baris Customer & Shipper */}
                                    <div className="mt-2 text-[12px] font-bold text-gray-950 leading-tight">
                                        Customer : {customerName}
                                        {shipperName && (
                                            <div className="font-semibold text-gray-800 pl-16">
                                                ({shipperName})
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Main Table Grid */}
                                <table className="w-full border-2 border-black border-collapse">
                                    <tbody>
                                        <tr>
                                            <td className="w-[125px] border border-black p-2 font-bold text-center text-xs">
                                                NO<br />CONTAINER
                                            </td>
                                            <td className="border border-black p-2 font-black text-2xl sm:text-3xl text-center tracking-tight font-mono">
                                                {containerNumber}
                                            </td>
                                            <td rowSpan={4} className="w-[210px] border border-black p-0 text-center align-middle bg-gray-50/30">
                                                <div className="text-base font-black py-2.5 border-b-[1.5px] border-black">
                                                    {containerSize}
                                                </div>
                                                <div className="text-base font-black italic py-5 px-2 tracking-wide uppercase leading-tight">
                                                    {serviceType}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black p-1.5 font-bold text-center text-xs">
                                                ISI
                                            </td>
                                            <td className="border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center">
                                                {isi || 'FULL CONT(ON-CHASIS)'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black p-1.5 font-bold text-center text-xs">
                                                NO SEGEL
                                            </td>
                                            <td className="border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center">
                                                {noSegel || '-'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black p-1.5 font-bold text-center text-xs">
                                                KETERANGAN
                                            </td>
                                            <td className="border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center">
                                                {keterangan || '-'}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Footer Signatures Grid */}
                                <table className="w-full border-2 border-black border-t-0 border-collapse h-[115px]">
                                    <tbody>
                                        <tr>
                                            <td className="w-[185px] border border-black p-2.5 text-[10px] leading-tight text-gray-800 align-top">
                                                <strong><u>PERHATIAN :</u></strong> Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami.
                                            </td>
                                            <td className="w-[145px] border border-black text-center text-xs p-2 align-top">
                                                <div className="font-semibold">Diserahkan oleh</div>
                                            </td>
                                            <td className="w-[145px] border border-black text-center text-xs p-2 align-top">
                                                <div className="font-semibold">Sopir</div>
                                            </td>
                                            <td className="border border-black text-center text-xs p-2 align-top">
                                                <div className="font-semibold">Penerima</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Tombol Aksi */}
                <div className="flex flex-wrap justify-between items-center pt-2 border-t mt-2 gap-2">
                    <div className="text-xs text-gray-500">
                        Format Cetak: <strong>21 cm x 14 cm (Continuous Form / Dot Matrix)</strong> &bull; Pilihan Layout:{' '}
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


