import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Printer, Download, Eye, FileText, CheckCircle2, Zap, Clock, Thermometer, ShieldCheck } from 'lucide-react';

export interface TemperaturePrintData {
    id?: number;
    container_number: string;
    price_type?: string | null;
    size?: string | null;
    commodity?: string | null;
    service_type?: string | null;
    additional_products?: Array<{ id?: number; service_type: string }>;
    additional_services?: string[];
    order_id?: string | null;
    no_aju?: string | null;
    customer_name?: string | null;
    shipper_name?: string | null;
    entry_date?: string | null;
    exit_date?: string | null;
    start_plug_in?: string | null;
    plug_out?: string | null;
    set_point?: number | string | null;
    plug_duration_minutes?: number | null;
    total_shifts?: number | null;
    rekam_suhu?: Array<{
        id?: number;
        tanggal: string;
        jam_data: Record<string, string>;
    }>;
    temperature?: Record<string, Record<string, string>>;
    order?: {
        id?: number;
        order_id?: string;
        no_aju?: string | null;
        customer?: { id?: number; name: string };
        shipper?: { id?: number; name: string };
    };
    product?: {
        id?: number;
        service_type: string;
    };
}

interface TemperaturePrintModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: TemperaturePrintData | null;
}

export function formatDateTimeIndo(dateStr?: string | null): string {
    if (!dateStr) return '-';
    const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
    if (match) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const day = match[3];
        const month = months[parseInt(match[2], 10) - 1] || match[2];
        const year = match[1];
        const time = match[4] && match[5] ? `, ${match[4]}:${match[5]} WIB` : '';
        return `${day} ${month} ${year}${time}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const day = d.getDate().toString().padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
}

export function formatDateIndoFull(dateStr: string): string {
    try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const monthIdx = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            const d = new Date(year, monthIdx, day);
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const months = [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
            ];
            const dayName = days[d.getDay()] || '';
            const monthName = months[monthIdx] || parts[1];
            return `${dayName}, ${day.toString().padStart(2, '0')} ${monthName} ${year}`;
        }
    } catch {
        // fallback
    }
    return dateStr;
}

export interface DayRecord {
    tanggal: string;
    tanggalFormatted: string;
    jamData: Record<string, string>;
    row1: Array<{ hour: string; label: string; value: string | null }>; // 00 to 11
    row2: Array<{ hour: string; label: string; value: string | null }>; // 12 to 23
    customEntries: Array<{ time: string; value: string }>;
    minTemp: number | null;
    maxTemp: number | null;
    avgTemp: number | null;
    count: number;
}

export function parseDayRecords(data: TemperaturePrintData | null): DayRecord[] {
    if (!data) return [];

    const rawRecords: Array<{ tanggal: string; jam_data: Record<string, string> }> = [];

    if (Array.isArray(data.rekam_suhu) && data.rekam_suhu.length > 0) {
        data.rekam_suhu.forEach((r) => {
            if (r && r.tanggal) {
                rawRecords.push({
                    tanggal: r.tanggal,
                    jam_data: r.jam_data || {},
                });
            }
        });
    } else if (data.temperature && typeof data.temperature === 'object') {
        Object.entries(data.temperature).forEach(([date, jamData]) => {
            rawRecords.push({
                tanggal: date,
                jam_data: jamData || {},
            });
        });
    }

    // Sort dates ascending for chronological log sheet reading
    rawRecords.sort((a, b) => a.tanggal.localeCompare(b.tanggal));

    return rawRecords.map((item) => {
        const jamData = item.jam_data || {};
        const numericTemps: number[] = [];

        // Row 1: 00 to 11
        const row1 = Array.from({ length: 12 }).map((_, i) => {
            const hour = i.toString().padStart(2, '0');
            const val = jamData[hour] ?? jamData[`${hour}:00`] ?? null;
            if (val !== null && val !== undefined && val !== '') {
                const num = parseFloat(String(val).replace(',', '.'));
                if (!isNaN(num)) numericTemps.push(num);
            }
            return {
                hour,
                label: `${hour}:00`,
                value: val !== null && val !== undefined && val !== '' ? String(val) : null,
            };
        });

        // Row 2: 12 to 23
        const row2 = Array.from({ length: 12 }).map((_, i) => {
            const h = i + 12;
            const hour = h.toString().padStart(2, '0');
            const val = jamData[hour] ?? jamData[`${hour}:00`] ?? null;
            if (val !== null && val !== undefined && val !== '') {
                const num = parseFloat(String(val).replace(',', '.'));
                if (!isNaN(num)) numericTemps.push(num);
            }
            return {
                hour,
                label: `${hour}:00`,
                value: val !== null && val !== undefined && val !== '' ? String(val) : null,
            };
        });

        // Custom minute entries (e.g. 09:25 or 14:15)
        const customEntries: Array<{ time: string; value: string }> = [];
        Object.entries(jamData).forEach(([k, v]) => {
            if (k.includes(':') && !k.endsWith(':00') && v !== '' && v !== null && v !== undefined) {
                customEntries.push({ time: k, value: String(v) });
                const num = parseFloat(String(v).replace(',', '.'));
                if (!isNaN(num)) numericTemps.push(num);
            }
        });
        customEntries.sort((a, b) => a.time.localeCompare(b.time));

        const minTemp = numericTemps.length > 0 ? Math.min(...numericTemps) : null;
        const maxTemp = numericTemps.length > 0 ? Math.max(...numericTemps) : null;
        const avgTemp =
            numericTemps.length > 0
                ? Number((numericTemps.reduce((acc, val) => acc + val, 0) / numericTemps.length).toFixed(1))
                : null;

        return {
            tanggal: item.tanggal,
            tanggalFormatted: formatDateIndoFull(item.tanggal),
            jamData,
            row1,
            row2,
            customEntries,
            minTemp,
            maxTemp,
            avgTemp,
            count: numericTemps.length,
        };
    });
}

/**
 * Generate Printable HTML String for A4 Portrait Document
 */
export function generateTemperaturePrintHtml(
    data: TemperaturePrintData,
    notes: string = '',
    customTitle: string = 'LEMBAR PEMANTAUAN SUHU & PLUG IN/OUT REEFER',
): string {
    const dayRecords = parseDayRecords(data);
    const containerNumber = data.container_number || '-';
    const size = data.size || data.price_type || '20ft / 40ft';
    const orderId = data.order_id || data.order?.order_id || '-';
    const noAju = data.no_aju || data.order?.no_aju || '-';
    const customerName = data.customer_name || data.order?.customer?.name || '-';
    const shipperName = data.shipper_name || data.order?.shipper?.name || '-';
    const commodity = data.commodity || 'REEFER COMMODITY';
    const serviceType = data.service_type || data.product?.service_type || 'PLUG IN & MONITORING SUHU';

    // Additional services
    const addServices: string[] = [];
    if (Array.isArray(data.additional_services)) {
        addServices.push(...data.additional_services);
    }
    if (Array.isArray(data.additional_products)) {
        data.additional_products.forEach((p) => {
            if (p?.service_type && !addServices.includes(p.service_type)) {
                addServices.push(p.service_type);
            }
        });
    }

    const entryDateStr = formatDateTimeIndo(data.entry_date);
    const exitDateStr = data.exit_date ? formatDateTimeIndo(data.exit_date) : 'Sedang di Depo';

    const startPlugStr = formatDateTimeIndo(data.start_plug_in);
    const plugOutStr = data.plug_out
        ? formatDateTimeIndo(data.plug_out)
        : data.start_plug_in
          ? 'SEDANG MENYALA / AKTIF'
          : 'Belum Plug In';

    let durationStr = '-';
    let runningShifts: number | null = data.total_shifts ?? null;

    if (data.plug_duration_minutes !== null && data.plug_duration_minutes !== undefined) {
        const hours = Math.floor(data.plug_duration_minutes / 60);
        const mins = data.plug_duration_minutes % 60;
        durationStr = `${hours} Jam ${mins} Menit (${data.plug_duration_minutes} mnt)`;
        if (!runningShifts || runningShifts < 1) {
            runningShifts = Math.max(1, Math.ceil(data.plug_duration_minutes / (8 * 60)));
        }
    } else if (data.start_plug_in && !data.plug_out) {
        try {
            const start = new Date(data.start_plug_in.replace(' ', 'T')).getTime();
            const now = new Date().getTime();
            const diffMins = Math.max(0, Math.floor((now - start) / (1000 * 60)));
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            durationStr = `${hours} Jam ${mins} Menit (Sedang berjalan)`;
            if (!runningShifts || runningShifts < 1) {
                runningShifts = Math.max(1, Math.ceil(diffMins / (8 * 60)));
            }
        } catch {
            durationStr = 'Sedang berjalan...';
        }
    }

    // Shift pertama adalah menit pertama di plug sampai 8 jam (minimal 1 shift)
    if (data.start_plug_in && (!runningShifts || runningShifts < 1)) {
        runningShifts = 1;
    }

    const totalShiftsStr =
        runningShifts !== null && runningShifts !== undefined && runningShifts > 0
            ? `${runningShifts} Shift`
            : '-';

    const setPointDisplay =
        data.set_point !== null && data.set_point !== undefined && String(data.set_point).trim() !== ''
            ? `${data.set_point} &deg;C`
            : '-';

    const nowPrinted = new Date().toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    const logoUrl = `${window.location.origin}/logo.png`;

    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Lembar Suhu - ${containerNumber}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 10mm 12mm 12mm 12mm;
        }
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        html, body {
            background: #ffffff !important;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
            color: #000000 !important;
            font-size: 8.5pt;
            line-height: 1.25;
        }
        .page-container {
            width: 100%;
        }

        /* Kop Surat Resmi */
        .kop-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2.5px solid #000000;
            padding-bottom: 2.5mm;
            margin-bottom: 3mm;
        }
        .kop-brand {
            display: flex;
            align-items: center;
            gap: 3.5mm;
        }
        .kop-logo {
            height: 48px;
            max-height: 48px;
            width: auto;
            max-width: 52px;
            object-fit: contain;
            filter: grayscale(100%) contrast(150%);
        }
        .kop-company {
            display: flex;
            flex-direction: column;
        }
        .company-name {
            font-size: 14pt;
            font-weight: 900;
            letter-spacing: 0.2px;
            color: #000000;
            line-height: 1.1;
        }
        .company-sub {
            font-size: 8pt;
            font-weight: 700;
            color: #333333;
            letter-spacing: 0.3px;
            margin-top: 1px;
        }
        .company-address {
            font-size: 7.5pt;
            color: #222222;
            margin-top: 1px;
            line-height: 1.2;
        }
        .kop-doc-box {
            text-align: right;
            border-left: 1.5px solid #000;
            padding-left: 3.5mm;
        }
        .doc-title {
            font-size: 12pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            color: #000000;
            line-height: 1.15;
            text-transform: uppercase;
        }
        .doc-subtitle {
            font-size: 7.5pt;
            font-weight: 800;
            color: #444444;
            letter-spacing: 0.8px;
            margin-top: 1px;
            text-transform: uppercase;
        }
        .doc-meta {
            font-size: 7pt;
            color: #555555;
            margin-top: 2px;
        }

        /* 3-Column Container Info Card */
        .info-card {
            width: 100%;
            border: 1.5px solid #000000;
            border-collapse: collapse;
            margin-bottom: 2.5mm;
        }
        .info-card td {
            border: 1px solid #000000;
            padding: 2mm 2.5mm;
            vertical-align: top;
            font-size: 8pt;
        }
        .info-label {
            font-size: 7pt;
            font-weight: 700;
            color: #444444;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .info-value {
            font-weight: 900;
            color: #000000;
            margin-top: 0.5mm;
            font-size: 8.5pt;
        }
        .cont-num-hero {
            font-size: 14pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            color: #000000;
            line-height: 1.1;
        }

        /* Operational Plug-In Box */
        .plug-card {
            width: 100%;
            border: 1.5px solid #000000;
            background-color: #f8fafc;
            border-collapse: collapse;
            margin-bottom: 3.5mm;
        }
        .plug-card td {
            border: 1px solid #000000;
            padding: 2mm 2.5mm;
            text-align: center;
            vertical-align: middle;
        }
        .plug-title {
            font-size: 7pt;
            font-weight: 800;
            color: #444444;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        .plug-val {
            font-size: 8.5pt;
            font-weight: 900;
            color: #000000;
            margin-top: 1px;
        }
        .plug-shift-highlight {
            font-size: 11pt;
            font-weight: 900;
            color: #000000;
        }

        /* Section Title Bar */
        .section-bar {
            font-size: 8pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1.5px solid #000000;
            padding-bottom: 1mm;
            margin-bottom: 2mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* Day Block */
        .day-block {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 3mm;
            border: 1.5px solid #000000;
        }
        .day-header {
            background-color: #e2e8f0;
            padding: 1.5mm 2.5mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1.5px solid #000000;
        }
        .day-date {
            font-size: 8.5pt;
            font-weight: 900;
            color: #000000;
        }
        .day-stats {
            font-size: 7.5pt;
            font-weight: 800;
            color: #1e293b;
            letter-spacing: 0.2px;
        }

        /* Matrix Table 12 columns per row */
        .matrix-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        .matrix-table th {
            background-color: #f1f5f9;
            border: 1px solid #000000;
            padding: 1.2mm 0.5mm;
            text-align: center;
            font-size: 7pt;
            font-weight: 800;
            color: #334155;
            width: 8.33%;
        }
        .matrix-table td {
            border: 1px solid #000000;
            padding: 1.6mm 0.5mm;
            text-align: center;
            font-size: 8.5pt;
            font-weight: 800;
            color: #000000;
            width: 8.33%;
            height: 6mm;
        }
        .temp-has-val {
            font-weight: 900;
            color: #000000;
        }
        .temp-empty {
            color: #94a3b8;
            font-size: 7.5pt;
            font-weight: normal;
        }

        /* Custom Minute Readings */
        .custom-entries-row {
            padding: 1.5mm 2.5mm;
            background-color: #ffffff;
            border-top: 1px solid #000000;
            font-size: 7.5pt;
            color: #1e293b;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 2mm;
        }
        .custom-chip {
            display: inline-block;
            border: 1px solid #000000;
            padding: 0.5mm 1.5mm;
            border-radius: 2px;
            font-weight: 800;
            background-color: #f8fafc;
        }

        /* Field Notes Box */
        .notes-card {
            border: 1.5px solid #000000;
            padding: 2mm 2.5mm;
            margin-top: 2.5mm;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .notes-title {
            font-size: 7pt;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            color: #333333;
        }
        .notes-content {
            font-size: 7.5pt;
            color: #111111;
            margin-top: 1mm;
            line-height: 1.3;
        }

        /* Signatures Grid */
        .signatures-grid {
            width: 100%;
            border: 1.5px solid #000000;
            border-collapse: collapse;
            margin-top: 3.5mm;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .signatures-grid td {
            width: 33.33%;
            border: 1px solid #000000;
            text-align: center;
            vertical-align: top;
            padding: 2mm 2mm;
        }
        .sig-role {
            font-size: 8pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            color: #000000;
        }
        .sig-sub {
            font-size: 7pt;
            color: #555555;
            margin-top: 0.5mm;
        }
        .sig-space {
            height: 18mm;
        }
        .sig-line {
            font-size: 8pt;
            font-weight: 900;
            color: #000000;
        }
        .sig-date {
            font-size: 7pt;
            color: #444444;
            margin-top: 1mm;
        }

        /* Bottom Footer */
        .page-footer {
            margin-top: 3mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 6.5pt;
            color: #666666;
            border-top: 1px dashed #aaaaaa;
            padding-top: 1.5mm;
        }
    </style>
</head>
<body>
    <div class="page-container">
        <!-- Header Kop Surat -->
        <div class="kop-header">
            <div class="kop-brand">
                <img src="${logoUrl}" alt="Logo PT. Depo Surabaya Sejahtera" class="kop-logo" />
                <div class="kop-company">
                    <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                    <div class="company-sub">DEPO CONTAINER & REEFER COLD STORAGE SERVICES</div>
                    <div class="company-address">
                        Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1), Surabaya &bull; Telp. 031-353 9484, 031-3539485 &bull; Fax. 031-3539482
                    </div>
                </div>
            </div>
            <div class="kop-doc-box">
                <div class="doc-title">${customTitle}</div>
                <div class="doc-subtitle">REEFER TEMPERATURE LOG SHEET</div>
                <div class="doc-meta">Tgl Cetak: ${nowPrinted} WIB</div>
            </div>
        </div>

        <!-- 3-Column Info Card Kontainer & Order -->
        <table class="info-card">
            <tbody>
                <tr>
                    <td style="width: 36%;">
                        <div class="info-label">Nomor Kontainer</div>
                        <div class="cont-num-hero">${containerNumber}</div>
                        <div style="margin-top: 1.5mm; display: flex; gap: 2.5mm; flex-wrap: wrap;">
                            <div>
                                <span class="info-label">Ukuran / Tipe:</span>
                                <span class="info-value" style="display: block;">${size}</span>
                            </div>
                            <div>
                                <span class="info-label">Komoditi:</span>
                                <span class="info-value" style="display: block;">${commodity}</span>
                            </div>
                            <div>
                                <span class="info-label">Set Point:</span>
                                <span class="info-value" style="display: block; font-weight: 900; color: #0284c7;">${setPointDisplay}</span>
                            </div>
                        </div>
                    </td>
                    <td style="width: 32%;">
                        <div class="info-label">Order & Registrasi</div>
                        <div class="info-value">Order ID: ${orderId}</div>
                        ${noAju && noAju !== '-' ? `<div class="info-value" style="margin-top: 1px;">No. AJU: ${noAju}</div>` : ''}
                        <div style="margin-top: 1.5mm;">
                            <span class="info-label">Layanan Operasional:</span>
                            <span class="info-value" style="display: block;">${serviceType}</span>
                            ${addServices.length > 0 ? `<div style="font-size: 7pt; color: #444; margin-top: 1px;">+ ${addServices.join(', ')}</div>` : ''}
                        </div>
                    </td>
                    <td style="width: 32%;">
                        <div class="info-label">Pihak Terkait & Status Gate</div>
                        <div class="info-value">Cust: ${customerName}</div>
                        ${shipperName && shipperName !== '-' ? `<div style="font-size: 7.5pt; color: #333; font-weight: 700;">Shipper: ${shipperName}</div>` : ''}
                        <div style="margin-top: 1.5mm; font-size: 7.5pt; line-height: 1.25;">
                            <div><strong style="color: #444;">Gate In:</strong> ${entryDateStr}</div>
                            <div><strong style="color: #444;">Gate Out:</strong> ${exitDateStr}</div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Ringkasan Operasional Plug In & Shift -->
        <table class="plug-card">
            <tbody>
                <tr>
                    <td style="width: 22%;">
                        <div class="plug-title">Start Plug In</div>
                        <div class="plug-val">${startPlugStr}</div>
                    </td>
                    <td style="width: 20%;">
                        <div class="plug-title">Plug Out</div>
                        <div class="plug-val">${plugOutStr}</div>
                    </td>
                    <td style="width: 16%; background-color: #f0f9ff;">
                        <div class="plug-title" style="color: #0369a1;">Set Point</div>
                        <div class="plug-val" style="font-weight: 900; font-size: 9.5pt; color: #0284c7;">${setPointDisplay}</div>
                    </td>
                    <td style="width: 22%;">
                        <div class="plug-title">Total Durasi Plug In</div>
                        <div class="plug-val">${durationStr}</div>
                    </td>
                    <td style="width: 20%; background-color: #f1f5f9;">
                        <div class="plug-title">Total Tagihan Shift</div>
                        <div class="plug-shift-highlight">${totalShiftsStr}</div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Header Section Catatan Rekaman Suhu -->
        <div class="section-bar">
            <span>RIWAYAT PENCATATAN SUHU 24 JAM PER HARI (&deg;C)</span>
            <span>Total: ${dayRecords.length} Hari Pencatatan</span>
        </div>

        <!-- Render Tiap Hari -->
        ${
            dayRecords.length === 0
                ? `<div style="border: 1px dashed #999; padding: 6mm; text-align: center; font-size: 8.5pt; color: #666; margin-bottom: 4mm;">
                    Belum ada riwayat pencatatan suhu 24 jam yang tersimpan untuk kontainer ini.
                </div>`
                : dayRecords
                      .map((day) => {
                          const minLabel = day.minTemp !== null ? `${day.minTemp}&deg;C` : '-';
                          const maxLabel = day.maxTemp !== null ? `${day.maxTemp}&deg;C` : '-';
                          const avgLabel = day.avgTemp !== null ? `${day.avgTemp}&deg;C` : '-';

                          return `
            <div class="day-block">
                <!-- Baris Tanggal & Stats -->
                <div class="day-header">
                    <span class="day-date">TANGGAL: ${day.tanggalFormatted.toUpperCase()}</span>
                    <span class="day-stats">Statistik Suhu: Min: ${minLabel} | Max: ${maxLabel} | Rata-rata: ${avgLabel} | ${day.count} Jam Tercatat</span>
                </div>

                <!-- Baris 1: Jam 00:00 s/d 11:00 -->
                <table class="matrix-table">
                    <thead>
                        <tr>
                            ${day.row1.map((cell) => `<th>${cell.label}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            ${day.row1
                                .map((cell) => {
                                    return cell.value !== null
                                        ? `<td class="temp-has-val">${cell.value}&deg;C</td>`
                                        : `<td class="temp-empty">-</td>`;
                                })
                                .join('')}
                        </tr>
                    </tbody>
                </table>

                <!-- Baris 2: Jam 12:00 s/d 23:00 -->
                <table class="matrix-table" style="border-top: none;">
                    <thead>
                        <tr>
                            ${day.row2.map((cell) => `<th>${cell.label}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            ${day.row2
                                .map((cell) => {
                                    return cell.value !== null
                                        ? `<td class="temp-has-val">${cell.value}&deg;C</td>`
                                        : `<td class="temp-empty">-</td>`;
                                })
                                .join('')}
                        </tr>
                    </tbody>
                </table>

                <!-- Entri Khusus Non-Jam Bulat (jika ada) -->
                ${
                    day.customEntries.length > 0
                        ? `
                <div class="custom-entries-row">
                    <strong>Pencatatan Waktu Khusus:</strong>
                    ${day.customEntries
                        .map((c) => `<span class="custom-chip">${c.time} WIB: ${c.value}&deg;C</span>`)
                        .join(' ')}
                </div>`
                        : ''
                }
            </div>
            `;
                      })
                      .join('')
        }

        <!-- Keterangan / Catatan Tambahan Lapangan -->
        <div class="notes-card">
            <div class="notes-title">Keterangan / Catatan Operasional Reefer:</div>
            <div class="notes-content">
                ${
                    notes.trim() !== ''
                        ? notes.replace(/\n/g, '<br/>')
                        : '1. Pemantauan suhu dilaksanakan secara rutin dan berkala oleh petugas piket reefer PT. Depo Surabaya Sejahtera.<br/>2. Tegangan listrik dan pasokan daya generator terjaga dalam ambang batas aman selama masa plugging kontainer.<br/>3. Mohon verifikasi kondisi fisik dan suhu kontainer sebelum meninggalkan depo.'
                }
            </div>
        </div>

        <!-- Kolom Tanda Tangan & Pengesahan (3 Kolom) -->
        <table class="signatures-grid">
            <tbody>
                <tr>
                    <td>
                        <div class="sig-role">Petugas Reefer / Checker</div>
                        <div class="sig-sub">Pencatat Suhu & Plugging</div>
                        <div class="sig-space"></div>
                        <div class="sig-line">( .................................................... )</div>
                        <div class="sig-date">Tgl: .......................................</div>
                    </td>
                    <td>
                        <div class="sig-role">Supervisor / Admin Depo</div>
                        <div class="sig-sub">Verifikasi Shift & Operasional</div>
                        <div class="sig-space"></div>
                        <div class="sig-line">( .................................................... )</div>
                        <div class="sig-date">Tgl: .......................................</div>
                    </td>
                    <td>
                        <div class="sig-role">Penerima / Driver / Shipper</div>
                        <div class="sig-sub">Serah Terima & Konfirmasi</div>
                        <div class="sig-space"></div>
                        <div class="sig-line">( .................................................... )</div>
                        <div class="sig-date">Tgl: .......................................</div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Page Footer -->
        <div class="page-footer">
            <span>PT. DEPO SURABAYA SEJAHTERA &bull; Dokumen Lembar Pemantauan Suhu & Shift Reefer Resmi</span>
            <span>Halaman 1 dari 1 (Dokumen Dicetak Sistem: ${nowPrinted} WIB)</span>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Trigger Silent Background Print via Hidden Iframe (No Blank Tabs, No Popup Blockers)
 */
export function executeTemperaturePrint(
    data: TemperaturePrintData,
    notes: string = '',
    customTitle?: string,
): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const html = generateTemperaturePrintHtml(data, notes, customTitle);

            const oldFrame = document.getElementById('temp-print-iframe');
            if (oldFrame) {
                oldFrame.remove();
            }

            const iframe = document.createElement('iframe');
            iframe.id = 'temp-print-iframe';
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
                iframe.remove();
                reject(new Error('Cannot access iframe document'));
                return;
            }

            frameDoc.open();
            frameDoc.write(html);
            frameDoc.close();

            setTimeout(() => {
                try {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                    resolve();
                } catch (e) {
                    console.error('Print error:', e);
                    reject(e);
                } finally {
                    setTimeout(() => {
                        if (document.body.contains(iframe)) {
                            iframe.remove();
                        }
                    }, 1000);
                }
            }, 300);
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Generate Printable HTML for Rekap Pemantauan Suhu Depo (List of Containers)
 */
export function generateTemperatureRekapPrintHtml(
    records: TemperaturePrintData[],
    filterStatus: string = 'active',
    searchKeyword?: string,
): string {
    const statusLabel =
        filterStatus === 'active'
            ? 'Sedang di Depo'
            : filterStatus === 'out'
              ? 'Sudah Keluar Depo'
              : 'Semua Kontainer';

    const nowPrinted = new Date().toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    const logoUrl = `${window.location.origin}/logo.png`;

    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Rekap Pemantauan Suhu Reefer Depo</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 10mm 12mm 10mm 12mm;
        }
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        html, body {
            background: #ffffff !important;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
            color: #000000 !important;
            font-size: 8pt;
            line-height: 1.25;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 2.5mm;
            margin-bottom: 3mm;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 3mm;
        }
        .logo {
            height: 42px;
            width: auto;
            object-fit: contain;
            filter: grayscale(100%) contrast(150%);
        }
        .company-name {
            font-size: 13pt;
            font-weight: 900;
            line-height: 1.1;
        }
        .title-box {
            text-align: right;
        }
        .rekap-title {
            font-size: 12pt;
            font-weight: 900;
            text-transform: uppercase;
        }
        .meta-bar {
            display: flex;
            justify-content: space-between;
            background: #f1f5f9;
            border: 1px solid #000;
            padding: 1.5mm 3mm;
            font-weight: bold;
            font-size: 8pt;
            margin-bottom: 3mm;
        }
        table.rekap-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7.5pt;
        }
        table.rekap-table th {
            background-color: #e2e8f0;
            border: 1px solid #000;
            padding: 2mm 1.5mm;
            text-align: center;
            font-weight: 900;
            text-transform: uppercase;
        }
        table.rekap-table td {
            border: 1px solid #000;
            padding: 1.8mm 1.5mm;
            vertical-align: middle;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .font-mono { font-family: monospace; }
        .signatures {
            margin-top: 5mm;
            display: flex;
            justify-content: space-around;
            page-break-inside: avoid;
        }
        .sig-box {
            width: 35%;
            text-align: center;
            font-size: 8pt;
        }
        .sig-space { height: 18mm; }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">
            <img src="${logoUrl}" alt="Logo" class="logo" />
            <div>
                <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                <div style="font-size: 7.5pt; color: #333;">DEPO CONTAINER & REEFER SERVICES &bull; TANJUNG SADARI SURABAYA</div>
            </div>
        </div>
        <div class="title-box">
            <div class="rekap-title">REKAPITULASI PEMANTAUAN SUHU & PLUGGING REEFER</div>
            <div style="font-size: 7pt; color: #555;">Dicetak pada: ${nowPrinted} WIB</div>
        </div>
    </div>

    <div class="meta-bar">
        <span>Status Kontainer: <strong>${statusLabel}</strong> ${searchKeyword ? `(Pencarian: "${searchKeyword}")` : ''}</span>
        <span>Total Kontainer: <strong>${records.length} Unit</strong></span>
    </div>

    <table class="rekap-table">
        <thead>
            <tr>
                <th style="width: 4%;">No.</th>
                <th style="width: 14%;">No. Kontainer</th>
                <th style="width: 7%;">Size</th>
                <th style="width: 15%;">Customer / Shipper</th>
                <th style="width: 10%;">Order ID</th>
                <th style="width: 11%;">Gate In</th>
                <th style="width: 13%;">Start Plug In</th>
                <th style="width: 13%;">Plug Out</th>
                <th style="width: 8%;">Shift</th>
                <th style="width: 5%;">Status</th>
            </tr>
        </thead>
        <tbody>
            ${
                records.length === 0
                    ? `<tr><td colspan="10" class="text-center" style="padding: 6mm;">Tidak ada data kontainer yang sesuai.</td></tr>`
                    : records
                          .map((item, idx) => {
                              const customer = item.customer_name || item.order?.customer?.name || '-';
                              const shipper = item.shipper_name || item.order?.shipper?.name || '';
                              const inDepo = !item.exit_date;
                              const itemShifts = item.total_shifts && item.total_shifts > 0
                                  ? item.total_shifts
                                  : (item.start_plug_in ? 1 : null);
                              return `
                <tr>
                    <td class="text-center">${idx + 1}</td>
                    <td class="font-bold font-mono" style="font-size: 8.5pt;">${item.container_number}</td>
                    <td class="text-center">
                        <div>${item.price_type || item.size || '-'}</div>
                        ${item.set_point !== null && item.set_point !== undefined && String(item.set_point).trim() !== '' ? `<div style="font-size: 6.5pt; color: #0284c7; font-weight: 800; margin-top: 1px;">SP: ${item.set_point}&deg;C</div>` : ''}
                    </td>
                    <td>
                        <div class="font-bold">${customer}</div>
                        ${shipper && shipper !== '-' ? `<div style="font-size: 6.5pt; color: #444;">${shipper}</div>` : ''}
                    </td>
                    <td>${item.order_id || item.order?.order_id || '-'}</td>
                    <td class="text-center">${item.entry_date ? formatDateTimeIndo(item.entry_date) : '-'}</td>
                    <td class="text-center">${item.start_plug_in ? formatDateTimeIndo(item.start_plug_in) : '<span style="color:#888;">Belum Plug In</span>'}</td>
                    <td class="text-center">${item.plug_out ? formatDateTimeIndo(item.plug_out) : item.start_plug_in ? '<strong>Aktif (In)</strong>' : '-'}</td>
                    <td class="text-center font-bold">${itemShifts ? `${itemShifts} Shift` : '-'}</td>
                    <td class="text-center font-bold">${inDepo ? 'Depo' : 'Keluar'}</td>
                </tr>
                `;
                          })
                          .join('')
            }
        </tbody>
    </table>

    <div class="signatures">
        <div class="sig-box">
            <div>Dibuat Oleh,</div>
            <div style="font-size: 7pt; color: #555;">Petugas Checker / Reefer</div>
            <div class="sig-space"></div>
            <div class="font-bold">( .................................................... )</div>
            <div style="font-size: 7pt; margin-top: 1mm;">Tgl: .......................................</div>
        </div>
        <div class="sig-box">
            <div>Mengetahui & Memverifikasi,</div>
            <div style="font-size: 7pt; color: #555;">Kepala Operasional / Admin Depo</div>
            <div class="sig-space"></div>
            <div class="font-bold">( .................................................... )</div>
            <div style="font-size: 7pt; margin-top: 1mm;">Tgl: .......................................</div>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Execute Rekap Print
 */
export function executeTemperatureRekapPrint(
    records: TemperaturePrintData[],
    filterStatus: string = 'active',
    searchKeyword?: string,
): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const html = generateTemperatureRekapPrintHtml(records, filterStatus, searchKeyword);
            const oldFrame = document.getElementById('temp-rekap-print-iframe');
            if (oldFrame) oldFrame.remove();

            const iframe = document.createElement('iframe');
            iframe.id = 'temp-rekap-print-iframe';
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
                alert('Gagal menyiapkan pencetakan rekap.');
                iframe.remove();
                reject(new Error('Cannot access iframe'));
                return;
            }

            frameDoc.open();
            frameDoc.write(html);
            frameDoc.close();

            setTimeout(() => {
                try {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                    resolve();
                } catch (e) {
                    console.error('Rekap print error:', e);
                    reject(e);
                } finally {
                    setTimeout(() => {
                        if (document.body.contains(iframe)) iframe.remove();
                    }, 1000);
                }
            }, 300);
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Interactive React Modal for Previewing and Printing Lembar Pemantauan Suhu
 */
export default function TemperaturePrintModal({ isOpen, onClose, data }: TemperaturePrintModalProps) {
    const [notes, setNotes] = useState('');
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setNotes(
                '1. Pemantauan suhu dilaksanakan secara rutin dan berkala oleh petugas piket reefer PT. Depo Surabaya Sejahtera.\n' +
                '2. Pasokan daya listrik dan temperatur ruangan pendingin terjaga dalam ambang batas aman operasional.\n' +
                '3. Harap memeriksa kondisi fisik dan temperatur kontainer sebelum keluar pintu depo.'
            );
        }
    }, [isOpen, data]);

    if (!data) return null;

    const dayRecords = parseDayRecords(data);
    const containerNumber = data.container_number || '-';
    const size = data.size || data.price_type || '20ft / 40ft';
    const orderId = data.order_id || data.order?.order_id || '-';
    const noAju = data.no_aju || data.order?.no_aju || '-';
    const customerName = data.customer_name || data.order?.customer?.name || '-';
    const shipperName = data.shipper_name || data.order?.shipper?.name || '-';
    const commodity = data.commodity || 'REEFER COMMODITY';
    const serviceType = data.service_type || data.product?.service_type || 'PLUG IN & MONITORING SUHU';

    let durationStr = '-';
    let effectiveShifts: number | null = data.total_shifts ?? null;

    if (data.plug_duration_minutes !== null && data.plug_duration_minutes !== undefined) {
        const hours = Math.floor(data.plug_duration_minutes / 60);
        const mins = data.plug_duration_minutes % 60;
        durationStr = `${hours}j ${mins}m (${data.plug_duration_minutes} mnt)`;
        if (!effectiveShifts || effectiveShifts < 1) {
            effectiveShifts = Math.max(1, Math.ceil(data.plug_duration_minutes / (8 * 60)));
        }
    } else if (data.start_plug_in && !data.plug_out) {
        try {
            const start = new Date(data.start_plug_in.replace(' ', 'T')).getTime();
            const now = new Date().getTime();
            const diffMins = Math.max(0, Math.floor((now - start) / (1000 * 60)));
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            durationStr = `${hours}j ${mins}m (Sedang berjalan)`;
            if (!effectiveShifts || effectiveShifts < 1) {
                effectiveShifts = Math.max(1, Math.ceil(diffMins / (8 * 60)));
            }
        } catch {
            durationStr = 'Sedang berjalan...';
        }
    }

    if (data.start_plug_in && (!effectiveShifts || effectiveShifts < 1)) {
        effectiveShifts = 1;
    }

    const handlePrint = async () => {
        setIsPrinting(true);
        try {
            await executeTemperaturePrint(data, notes);
        } catch (err) {
            console.error('Print failed:', err);
        } finally {
            setIsPrinting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/75 shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-6">
                        <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700">
                                <Thermometer className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base sm:text-lg font-bold text-gray-900">
                                    Cetak Lembar Pemantauan Suhu & Plugging
                                </DialogTitle>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Kontainer <span className="font-bold text-gray-800">{containerNumber}</span> &bull; {customerName}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                onClick={handlePrint}
                                disabled={isPrinting}
                                className="bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-4 gap-1.5 shadow-sm"
                            >
                                <Printer className="h-4 w-4" />
                                {isPrinting ? 'Menyiapkan...' : 'Cetak / Simpan PDF'}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                {/* Scrollable Document Preview Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/60 space-y-4">
                    {/* Visual A4 Paper Preview */}
                    <div className="max-w-[780px] mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-5 sm:p-8 space-y-4 text-gray-900">
                        {/* Kop Surat */}
                        <div className="flex items-center justify-between border-b-2 border-black pb-3">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/logo.png"
                                    alt="Logo Depo"
                                    className="h-11 w-auto max-w-[50px] object-contain filter grayscale contrast-150 shrink-0"
                                />
                                <div>
                                    <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                                        PT. DEPO SURABAYA SEJAHTERA
                                    </h2>
                                    <p className="text-[10px] font-bold text-gray-700 tracking-wide uppercase mt-0.5">
                                        DEPO CONTAINER & REEFER COLD STORAGE SERVICES
                                    </p>
                                    <p className="text-[9px] text-gray-600 leading-tight">
                                        Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1), Surabaya &bull; Telp. 031-353 9484 &bull; Fax. 031-3539482
                                    </p>
                                </div>
                            </div>
                            <div className="text-right border-l-2 border-black pl-3 hidden sm:block">
                                <div className="text-xs font-black tracking-wider uppercase">
                                    LEMBAR PEMANTAUAN SUHU
                                </div>
                                <div className="text-[9px] font-bold text-gray-600 uppercase">
                                    REEFER TEMPERATURE LOG SHEET
                                </div>
                                <div className="text-[8px] text-gray-500 mt-1">
                                    Format: A4 Portrait
                                </div>
                            </div>
                        </div>

                        {/* Kontainer & Order Meta */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 border border-black text-xs divide-y sm:divide-y-0 sm:divide-x divide-black">
                            <div className="p-2.5 space-y-1">
                                <span className="text-[10px] font-bold text-gray-500 uppercase block">No. Kontainer</span>
                                <div className="text-base font-black tracking-wide">{containerNumber}</div>
                                <div className="text-[11px] text-gray-700">Size: <strong>{size}</strong> &bull; {commodity}</div>
                            </div>
                            <div className="p-2.5 space-y-1">
                                <span className="text-[10px] font-bold text-gray-500 uppercase block">Order & Layanan</span>
                                <div className="font-bold">Order ID: {orderId}</div>
                                {noAju && noAju !== '-' && <div className="text-[11px] text-gray-700">AJU: {noAju}</div>}
                                <div className="text-[11px] text-gray-800 font-semibold">{serviceType}</div>
                            </div>
                            <div className="p-2.5 space-y-1">
                                <span className="text-[10px] font-bold text-gray-500 uppercase block">Customer & Gate</span>
                                <div className="font-bold truncate">{customerName}</div>
                                {shipperName && shipperName !== '-' && <div className="text-[11px] text-gray-600 truncate">{shipperName}</div>}
                                <div className="text-[10px] text-gray-600">In: {formatDateTimeIndo(data.entry_date)}</div>
                            </div>
                        </div>

                        {/* Status Plug In & Shift */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 border border-black bg-slate-50/80 divide-x divide-black text-center text-xs">
                            <div className="p-2">
                                <span className="text-[9px] font-bold text-gray-500 uppercase block">Start Plug In</span>
                                <span className="font-bold text-[11px] mt-0.5 block">{formatDateTimeIndo(data.start_plug_in)}</span>
                            </div>
                            <div className="p-2">
                                <span className="text-[9px] font-bold text-gray-500 uppercase block">Plug Out</span>
                                <span className="font-bold text-[11px] mt-0.5 block">
                                    {data.plug_out ? formatDateTimeIndo(data.plug_out) : data.start_plug_in ? 'AKTIF PLUGGED IN' : '-'}
                                </span>
                            </div>
                            <div className="p-2 bg-sky-50/50">
                                <span className="text-[9px] font-bold text-gray-500 uppercase block">Set Point</span>
                                <span className="font-bold text-[11px] mt-0.5 block text-sky-700">
                                    {data.set_point !== null && data.set_point !== undefined && String(data.set_point).trim() !== ''
                                        ? `${data.set_point} °C`
                                        : '-'}
                                </span>
                            </div>
                            <div className="p-2">
                                <span className="text-[9px] font-bold text-gray-500 uppercase block">Total Durasi</span>
                                <span className="font-bold text-[11px] mt-0.5 block">{durationStr}</span>
                            </div>
                            <div className="p-2 bg-slate-100">
                                <span className="text-[9px] font-bold text-gray-500 uppercase block">Total Tagihan Shift</span>
                                <span className="font-black text-sm text-gray-900 mt-0.5 block">
                                    {effectiveShifts !== null && effectiveShifts !== undefined && effectiveShifts > 0 ? `${effectiveShifts} Shift` : '-'}
                                </span>
                            </div>
                        </div>

                        {/* Temperature Log Tables */}
                        <div className="space-y-3 pt-1">
                            <div className="text-xs font-black uppercase tracking-wider flex items-center justify-between border-b pb-1">
                                <span>Pencatatan Suhu 24 Jam ({dayRecords.length} Hari)</span>
                                <span className="text-[10px] text-gray-500 font-semibold">Satuan: Derajat Celcius (&deg;C)</span>
                            </div>

                            {dayRecords.length === 0 ? (
                                <div className="p-6 text-center text-xs text-gray-500 italic border border-dashed rounded">
                                    Belum ada data rekaman suhu yang tercatat.
                                </div>
                            ) : (
                                dayRecords.map((day, dIdx) => (
                                    <div key={dIdx} className="border border-black rounded-xs overflow-hidden">
                                        {/* Day Banner */}
                                        <div className="bg-slate-200/80 px-2.5 py-1 text-[11px] font-bold flex items-center justify-between border-b border-black">
                                            <span>Tanggal: {day.tanggalFormatted}</span>
                                            <span className="text-[10px] text-gray-700">
                                                Min: {day.minTemp !== null ? `${day.minTemp}°C` : '-'} &bull; Max:{' '}
                                                {day.maxTemp !== null ? `${day.maxTemp}°C` : '-'} &bull; Avg:{' '}
                                                {day.avgTemp !== null ? `${day.avgTemp}°C` : '-'}
                                            </span>
                                        </div>

                                        {/* Row 1: 00 to 11 */}
                                        <table className="w-full text-center border-collapse text-[10px]">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-black text-[9px] text-gray-600">
                                                    {day.row1.map((c) => (
                                                        <th key={c.hour} className="border-r border-black last:border-r-0 py-0.5">
                                                            {c.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-black">
                                                    {day.row1.map((c) => (
                                                        <td
                                                            key={c.hour}
                                                            className={`border-r border-black last:border-r-0 py-1 font-semibold ${
                                                                c.value !== null ? 'font-bold text-gray-900 bg-orange-50/40' : 'text-gray-400'
                                                            }`}
                                                        >
                                                            {c.value !== null ? `${c.value}°` : '-'}
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* Row 2: 12 to 23 */}
                                        <table className="w-full text-center border-collapse text-[10px]">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-black text-[9px] text-gray-600">
                                                    {day.row2.map((c) => (
                                                        <th key={c.hour} className="border-r border-black last:border-r-0 py-0.5">
                                                            {c.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {day.row2.map((c) => (
                                                        <td
                                                            key={c.hour}
                                                            className={`border-r border-black last:border-r-0 py-1 font-semibold ${
                                                                c.value !== null ? 'font-bold text-gray-900 bg-orange-50/40' : 'text-gray-400'
                                                            }`}
                                                        >
                                                            {c.value !== null ? `${c.value}°` : '-'}
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* Custom Minute Entries */}
                                        {day.customEntries.length > 0 && (
                                            <div className="bg-white px-2 py-1 border-t border-black text-[10px] flex items-center gap-1.5 flex-wrap">
                                                <span className="font-bold text-gray-700">Waktu Khusus:</span>
                                                {day.customEntries.map((c, ci) => (
                                                    <span key={ci} className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-[9px] font-bold">
                                                        {c.time}: {c.value}°C
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Signatures Preview */}
                        <div className="grid grid-cols-3 border border-black divide-x divide-black text-center text-xs mt-3 pt-1">
                            <div className="p-2">
                                <div className="font-bold uppercase text-[10px]">Petugas Reefer</div>
                                <div className="text-[9px] text-gray-500">Pencatat Suhu</div>
                                <div className="h-12"></div>
                                <div className="font-bold text-[10px]">( ................................ )</div>
                            </div>
                            <div className="p-2">
                                <div className="font-bold uppercase text-[10px]">Supervisor / Admin</div>
                                <div className="text-[9px] text-gray-500">Verifikasi Shift</div>
                                <div className="h-12"></div>
                                <div className="font-bold text-[10px]">( ................................ )</div>
                            </div>
                            <div className="p-2">
                                <div className="font-bold uppercase text-[10px]">Driver / Penerima</div>
                                <div className="text-[9px] text-gray-500">Serah Terima</div>
                                <div className="h-12"></div>
                                <div className="font-bold text-[10px]">( ................................ )</div>
                            </div>
                        </div>
                    </div>

                    {/* Editable Notes Card */}
                    <div className="max-w-[780px] mx-auto bg-white rounded-lg border border-gray-200 p-4 space-y-2">
                        <Label htmlFor="print-notes" className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            Sesuaikan Catatan Keterangan Lapangan (Opsional):
                        </Label>
                        <textarea
                            id="print-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-black focus:outline-none"
                            placeholder="Tulis catatan operasional yang akan tercetak pada lembar pemantauan suhu..."
                        />
                    </div>
                </div>

                {/* Footer Controls */}
                <DialogFooter className="p-3.5 sm:p-4 border-t border-gray-200 bg-white shrink-0 flex flex-row justify-between items-center">
                    <div className="text-xs text-gray-500">
                        Tips: Pilih <strong>"Save as PDF"</strong> / <strong>"Simpan sebagai PDF"</strong> pada dialog print browser.
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
                            Tutup
                        </Button>
                        <Button
                            size="sm"
                            onClick={handlePrint}
                            disabled={isPrinting}
                            className="h-8 text-xs bg-gray-900 hover:bg-black text-white font-semibold gap-1.5"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            {isPrinting ? 'Memproses...' : 'Cetak / Simpan PDF'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
