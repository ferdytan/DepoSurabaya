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
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
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
            font-size: 20pt;
            font-weight: 900;
            letter-spacing: 2.5px;
            line-height: 1;
        }

        /* 4-Box Logistics Bar */
        .m-logistics-bar {
            display: flex;
            gap: 2mm;
            margin-top: 2mm;
        }
        .m-log-card {
            flex: 1;
            border: 1.5px solid #000;
            padding: 1.8mm 2.5mm;
            background: #ffffff;
        }
        .m-log-card:last-child {
            flex: 1.3;
        }
        .m-log-label {
            font-size: 10pt;
            text-transform: uppercase;
            font-weight: 900;
            color: #000000;
            letter-spacing: 0.3px;
        }
        .m-log-value {
            font-size: 11pt;
            font-weight: 900;
            color: #000000;
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
            background: #ffffff;
            border: 2px solid #000;
            border-left: 5.5px solid #000;
            padding: 2.2mm 3.5mm;
            margin-top: 2mm;
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

        /* Hero Container Display (Clean 2-Row Border Grid, Perfectly Aligned) */
        .m-container-hero {
            border: 2px solid #000;
            margin-top: 2mm;
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
            min-height: 22mm;
        }
        .m-hero-row-bottom {
            min-height: 20mm;
        }
        .m-cont-box {
            flex: 1;
            border-right: 2px solid #000;
            padding: 2mm 3.5mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .m-cont-lbl {
            font-size: 10pt;
            font-weight: 900;
            color: #000000;
            letter-spacing: 0.3px;
            text-transform: uppercase;
        }
        .m-cont-number {
            font-size: 28pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
            line-height: 1.1;
            margin-top: 0.8mm;
            color: #000000;
        }
        .m-size-box {
            width: 65mm;
            padding: 2mm 2mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: #ffffff;
        }
        .m-size-val {
            font-size: 19pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            line-height: 1.1;
            margin-top: 0.8mm;
            color: #000000;
        }
        .m-subgrid-box {
            flex: 1;
            border-right: 2px solid #000;
            display: flex;
        }
        .m-subcol {
            padding: 1.2mm 2.5mm 1.5mm 2.5mm;
            border-right: 1.5px solid #000;
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
            letter-spacing: 0.3px;
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
            line-height: 1.25;
            word-break: break-word;
            white-space: normal;
        }
        .m-service-box {
            width: 65mm;
            padding: 1.2mm 2mm 1.5mm 2mm;
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
            font-size: 13.5pt;
            font-weight: 900;
            text-transform: uppercase;
            line-height: 1.2;
            letter-spacing: 0.3px;
            color: #000000;
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
            width: 60mm;
            border: 2px solid #000;
            padding: 2mm 2.5mm;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .m-notice-title {
            font-size: 10pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
            text-decoration: underline;
            margin-bottom: 1.2mm;
            letter-spacing: 0.3px;
        }
        .m-notice-body {
            font-size: 9pt;
            font-weight: 900;
            line-height: 1.3;
            color: #000000;
        }
        .m-sig-card {
            flex: 1;
            border: 1.5px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1.5mm;
            text-align: center;
            background: #ffffff;
        }
        .m-sig-role {
            font-size: 8pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
        }
        .m-sig-line {
            border-bottom: 1.5px dotted #000;
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

        <!-- Hero Container Box (Clean 2-Row Border Grid: Top row aligned, Bottom row aligned) -->
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
            margin-top: 2.5mm;
            font-size: 11pt;
            font-weight: 900;
            line-height: 1.25;
            color: #000;
            text-transform: uppercase;
        }
        .shipper-info {
            font-size: 10.5pt;
            font-weight: 900;
            padding-left: 20mm;
            color: #000;
            text-transform: uppercase;
            margin-top: 0.8mm;
        }

        /* Title Box */
        .title-box {
            border: 2px solid #000;
            padding: 2mm 6mm;
            text-align: center;
            align-self: flex-start;
            margin: 0 2mm;
        }
        .title-text {
            font-size: 13pt;
            font-weight: 900;
            letter-spacing: 2px;
            line-height: 1;
            color: #000;
        }

        /* Meta Box Right */
        .meta-box {
            width: 68mm;
            border: 2px solid #000;
            font-size: 9.5pt;
        }
        .meta-row {
            display: flex;
            border-bottom: 1.5px solid #000;
            height: 6.2mm;
            align-items: center;
        }
        .meta-row:last-child {
            border-bottom: none;
        }
        .meta-lbl {
            width: 25mm;
            padding-left: 2.5mm;
            font-weight: 900;
            color: #000;
        }
        .meta-sep {
            width: 3.5mm;
            font-weight: 900;
            color: #000;
        }
        .meta-val {
            flex: 1;
            padding-right: 2.5mm;
            font-weight: 900;
            color: #000;
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
            font-size: 9.5pt;
            font-weight: 900;
            text-align: center;
            line-height: 1.15;
            padding: 1mm;
            color: #000;
        }
        .td-cont-num {
            height: 16mm;
            font-size: 26pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-align: center;
            color: #000;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
        }
        .td-val-row {
            height: 8.5mm;
            font-size: 10.5pt;
            font-weight: 900;
            text-align: center;
            padding: 0 3mm;
            color: #000;
        }
        .td-service-col {
            width: 56mm;
            text-align: center;
            vertical-align: middle;
            padding: 0;
        }
        .service-size-box {
            font-size: 13pt;
            font-weight: 900;
            padding: 2mm 0;
            border-bottom: 1.5px solid #000;
            color: #000;
        }
        .service-title-box {
            font-size: 13.5pt;
            font-weight: 900;
            padding: 4mm 2mm;
            line-height: 1.25;
            text-transform: uppercase;
            color: #000;
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
            border: 1.5px solid #000;
            vertical-align: top;
        }
        .td-notice {
            width: 56mm;
            padding: 2.5mm;
            font-size: 9pt;
            font-weight: 900;
            line-height: 1.3;
            color: #000;
        }
        .td-notice u {
            font-weight: 900;
        }
        .td-sig-col {
            width: 34mm;
            text-align: center;
            font-size: 9.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000;
            padding-top: 2.5mm;
        }
        .td-sig-empty {
            flex: 1;
            text-align: center;
            font-size: 9.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000;
            padding-top: 2.5mm;
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
                <div className="flex justify-center p-3 bg-slate-200/70 rounded-xl overflow-x-auto">
                    {/* Wadah Simulasi Kertas Ukuran 210mm x 140mm (~794px x 529px) */}
                    <div
                        ref={printContainerRef}
                        className="relative bg-white shadow-md border border-gray-400 p-6 w-[794px] min-w-[794px] h-[529px] min-h-[529px] rounded flex flex-col justify-between select-none"
                        style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
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
                                            <div className="font-black text-2xl tracking-[2.5px] text-black leading-none">
                                                SURAT JALAN
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4-Box Logistics Bar */}
                                    <div className="grid grid-cols-4 gap-2 mt-2">
                                        <div className="border-2 border-black p-2 bg-white rounded-xs">
                                            <div className="text-[13px] sm:text-[14px] uppercase font-black text-black tracking-wide">TANGGAL</div>
                                            <div className="text-[15px] sm:text-[16px] font-black text-black truncate mt-0.5">{tanggal || '-'}</div>
                                        </div>
                                        <div className="border-2 border-black p-2 bg-white rounded-xs">
                                            <div className="text-[13px] sm:text-[14px] uppercase font-black text-black tracking-wide">JAM KELUAR</div>
                                            <div className="text-[15px] sm:text-[16px] font-black text-black truncate mt-0.5">{jamKeluar || '-'}</div>
                                        </div>
                                        <div className="border-2 border-black p-2 bg-white rounded-xs">
                                            <div className="text-[13px] sm:text-[14px] uppercase font-black text-black tracking-wide">NO. POLISI</div>
                                            <div className="text-[15px] sm:text-[16px] font-black text-black truncate mt-0.5">{noPol || '-'}</div>
                                        </div>
                                        <div className="border-2 border-black p-2 bg-white rounded-xs">
                                            <div className="text-[13px] sm:text-[14px] uppercase font-black text-black tracking-wide">TUJUAN</div>
                                            <div className="text-[15px] sm:text-[16px] font-black text-black truncate mt-0.5">{tujuan || '-'}</div>
                                        </div>
                                    </div>

                                    {/* Customer & Shipper Banner */}
                                    <div className="flex justify-between items-center bg-white border-2 border-black border-l-[6px] px-3.5 py-2 mt-2 text-[15px] sm:text-[16px]">
                                        <div className="font-black text-black uppercase tracking-tight" style={{ fontWeight: 900 }}>
                                            CUSTOMER: <span className="font-black" style={{ fontWeight: 900 }}>{customerName}</span>
                                        </div>
                                        {shipperName && (
                                            <div className="font-black text-black uppercase tracking-tight" style={{ fontWeight: 900 }}>
                                                SHIPPER: ({shipperName})
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Hero Container Box (Clean 2-Row Border Grid: Top row aligned, Bottom row aligned) */}
                                <div className="border-2 border-black rounded-xs overflow-hidden flex flex-col bg-white mt-2 min-h-[145px]">
                                    {/* Baris 1: No. Container & Jumlah / Ukuran (Sejajar Sempurna) */}
                                    <div className="flex border-b-2 border-black min-h-[75px]">
                                        <div className="flex-1 border-r-2 border-black p-2.5 flex flex-col justify-center">
                                            <div className="text-[13px] sm:text-[14px] uppercase font-black text-black tracking-wide" style={{ fontWeight: 900 }}>NO. CONTAINER</div>
                                            <div className="text-3xl sm:text-4xl font-black tracking-wider text-black mt-0.5 leading-none" style={{ fontWeight: 900 }}>
                                                {containerNumber || '-'}
                                            </div>
                                        </div>
                                        <div className="w-[240px] sm:w-[260px] p-2 flex flex-col justify-center items-center text-center bg-white">
                                            <div className="text-[13px] sm:text-[14px] uppercase font-black text-black tracking-wide" style={{ fontWeight: 900 }}>JUMLAH / UKURAN</div>
                                            <div className="text-2xl sm:text-3xl font-black text-black mt-0.5 leading-none" style={{ fontWeight: 900 }}>{ukuranCont}</div>
                                        </div>
                                    </div>

                                    {/* Baris 2: Subgrid 3 Kolom & Nama Produk / Layanan */}
                                    <div className="flex min-h-[75px]">
                                        <div className="flex-1 border-r-2 border-black grid grid-cols-12 divide-x-2 divide-black bg-white">
                                            <div className="col-span-5 px-2.5 pt-1.5 pb-2 flex flex-col">
                                                <div className="text-[13px] sm:text-[14px] uppercase font-black text-black tracking-wide leading-tight" style={{ fontWeight: 900 }}>
                                                    ISI KONTAINER
                                                </div>
                                                <div className="flex-1 flex items-center">
                                                    <div className="text-xs sm:text-[14px] font-black text-black break-words whitespace-normal leading-tight" style={{ fontWeight: 900 }}>
                                                        {isi || 'FULL CONT(ON-CHASIS)'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-3 px-2.5 pt-1.5 pb-2 flex flex-col">
                                                <div className="text-[13px] sm:text-[14px] uppercase font-black text-black tracking-wide leading-tight" style={{ fontWeight: 900 }}>
                                                    NO. SEGEL
                                                </div>
                                                <div className="flex-1 flex items-center">
                                                    <div className="text-xs sm:text-[14px] font-black text-black break-words" style={{ fontWeight: 900 }}>
                                                        {noSegel || '-'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-4 px-2.5 pt-1.5 pb-2 flex flex-col">
                                                <div className="text-[13px] sm:text-[14px] uppercase font-black text-black tracking-wide leading-tight" style={{ fontWeight: 900 }}>
                                                    KETERANGAN
                                                </div>
                                                <div className="flex-1 flex items-center">
                                                    <div className="text-xs sm:text-[14px] font-black text-black break-words" style={{ fontWeight: 900 }}>
                                                        {keterangan || '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-[240px] sm:w-[260px] px-2.5 pt-1.5 pb-2 flex flex-col items-center text-center bg-white">
                                            <div className="text-[13px] sm:text-[14px] uppercase font-black text-black tracking-wide leading-tight" style={{ fontWeight: 900 }}>
                                                NAMA PRODUK / LAYANAN
                                            </div>
                                            <div className="flex-1 flex items-center justify-center">
                                                <div className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight text-black" style={{ fontWeight: 900 }}>
                                                    {layanan}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modern Footer & Signatures */}
                                <div className="flex gap-2.5 h-[115px] items-stretch mt-2">
                                    <div className="w-[250px] sm:w-[270px] border-2 border-black p-2.5 bg-white flex flex-col justify-between">
                                        <div className="text-[12.5px] sm:text-[13px] font-black uppercase text-black underline tracking-wide leading-tight">PERHATIAN PENTING :</div>
                                        <div className="text-[12px] sm:text-[12.5px] font-black text-black leading-snug mt-1">Mohon kondisi container dan segel dicek terlebih dahulu sebelum keluar depo. Komplain setelah keluar bukan tanggung jawab kami.</div>
                                    </div>
                                    <div className="flex-1 border-2 border-black p-2 bg-white flex flex-col justify-between text-center">
                                        <div className="text-[12px] font-black uppercase text-black">DISERAHKAN OLEH</div>
                                        <div className="border-b-2 border-dotted border-black mx-4"></div>
                                    </div>
                                    <div className="flex-1 border-2 border-black p-2 bg-white flex flex-col justify-between text-center">
                                        <div className="text-[12px] font-black uppercase text-black">SOPIR TRUK</div>
                                        <div className="border-b-2 border-dotted border-black mx-4"></div>
                                    </div>
                                    <div className="flex-1 border-2 border-black p-2 bg-white flex flex-col justify-between text-center">
                                        <div className="text-[12px] font-black uppercase text-black">PENERIMA</div>
                                        <div className="border-b-2 border-dotted border-black mx-4"></div>
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
                                        <div className="w-[250px] border-2 border-black text-[13px] sm:text-[13.5px]">
                                            <div className="flex border-b-2 border-black py-1 items-center">
                                                <div className="w-[90px] pl-2.5 font-black text-black">Tanggal</div>
                                                <div className="w-3.5 font-black text-black">:</div>
                                                <div className="flex-1 pr-2 font-black text-black truncate">{tanggal || '-'}</div>
                                            </div>
                                            <div className="flex border-b-2 border-black py-1 items-center">
                                                <div className="w-[90px] pl-2.5 font-black text-black">Jam Keluar</div>
                                                <div className="w-3.5 font-black text-black">:</div>
                                                <div className="flex-1 pr-2 font-black text-black truncate">{jamKeluar || '-'}</div>
                                            </div>
                                            <div className="flex border-b-2 border-black py-1 items-center">
                                                <div className="w-[90px] pl-2.5 font-black text-black">No. Pol</div>
                                                <div className="w-3.5 font-black text-black">:</div>
                                                <div className="flex-1 pr-2 font-black text-black truncate">{noPol || '-'}</div>
                                            </div>
                                            <div className="flex py-1 items-center">
                                                <div className="w-[90px] pl-2.5 font-black text-black">Tujuan</div>
                                                <div className="w-3.5 font-black text-black">:</div>
                                                <div className="flex-1 pr-2 font-black text-black truncate">{tujuan || '-'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Baris Customer & Shipper */}
                                    <div className="mt-2.5 text-[14px] sm:text-[15px] font-black text-black leading-tight uppercase">
                                        Customer : <span className="font-black">{customerName}</span>
                                        {shipperName && (
                                            <div className="font-black text-black text-[13px] sm:text-[14px] pl-20 mt-0.5">
                                                ({shipperName})
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Main Table Grid */}
                                <table className="w-full border-2 border-black border-collapse">
                                    <tbody>
                                        <tr>
                                            <td className="w-[125px] border border-black p-2 font-black text-center text-[12.5px] text-black uppercase">
                                                NO<br />CONTAINER
                                            </td>
                                            <td className="border border-black p-2 font-black text-2xl sm:text-3xl text-center tracking-normal text-black">
                                                {containerNumber}
                                            </td>
                                            <td rowSpan={4} className="w-[210px] border border-black p-0 text-center align-middle bg-gray-50/30">
                                                <div className="text-base font-black py-2.5 border-b-[1.5px] border-black text-black">
                                                    {containerSize}
                                                </div>
                                                <div className="text-base font-black py-5 px-2 tracking-wide uppercase leading-tight text-black">
                                                    {serviceType}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black p-1.5 font-black text-center text-[12.5px] text-black uppercase">
                                                ISI
                                            </td>
                                            <td className="border border-black p-1.5 px-3 font-black text-sm text-center text-black">
                                                {isi || 'FULL CONT(ON-CHASIS)'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black p-1.5 font-black text-center text-[12.5px] text-black uppercase">
                                                NO SEGEL
                                            </td>
                                            <td className="border border-black p-1.5 px-3 font-black text-sm text-center text-black">
                                                {noSegel || '-'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black p-1.5 font-black text-center text-[12.5px] text-black uppercase">
                                                KETERANGAN
                                            </td>
                                            <td className="border border-black p-1.5 px-3 font-black text-sm text-center text-black">
                                                {keterangan || '-'}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Footer Signatures Grid */}
                                <table className="w-full border-2 border-black border-t-0 border-collapse h-[115px]">
                                    <tbody>
                                        <tr>
                                            <td className="w-[240px] sm:w-[260px] border border-black p-2.5 text-[11.5px] sm:text-[12px] font-black leading-snug text-black align-top">
                                                <strong className="underline">PERHATIAN :</strong> Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami.
                                            </td>
                                            <td className="w-[135px] border border-black text-center p-2 align-top">
                                                <div className="font-black text-[12px] uppercase text-black">Diserahkan oleh</div>
                                            </td>
                                            <td className="w-[135px] border border-black text-center p-2 align-top">
                                                <div className="font-black text-[12px] uppercase text-black">Sopir</div>
                                            </td>
                                            <td className="border border-black text-center p-2 align-top">
                                                <div className="font-black text-[12px] uppercase text-black">Penerima</div>
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


