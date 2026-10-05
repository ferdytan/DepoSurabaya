import React, { useState } from 'react';
import TemperaturePrintModal, {
    parseDayRecords,
    formatDateTimeIndo,
    type TemperaturePrintData,
} from '@/components/temperature-print-modal';
import { Button } from '@/components/ui/button';
import {
    Thermometer,
    Printer,
    Clock,
    Zap,
    TrendingDown,
    TrendingUp,
    Gauge,
    CheckCircle2,
    Calendar,
} from 'lucide-react';

interface ContainerTemperatureViewProps {
    containerNumber: string;
    rekamSuhu?: Array<{
        id?: number;
        tanggal: string;
        jam_data: Record<string, string>;
    }>;
    startPlugIn?: string | null;
    plugOut?: string | null;
    plugDurationMinutes?: number | null;
    totalShifts?: number | null;
    // Data tambahan untuk print PDF jika user klik "Cetak / Unduh PDF"
    printData?: TemperaturePrintData;
    compact?: boolean;
}

export default function ContainerTemperatureView({
    containerNumber,
    rekamSuhu,
    startPlugIn,
    plugOut,
    plugDurationMinutes,
    totalShifts,
    printData,
    compact = false,
}: ContainerTemperatureViewProps) {
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    const hasRekamSuhu = Array.isArray(rekamSuhu) && rekamSuhu.length > 0;
    const hasPlugData = Boolean(startPlugIn || plugOut);

    if (!hasRekamSuhu && !hasPlugData) {
        return null;
    }

    // Dummy print data wrapper jika printData tidak dikirim langsung
    const modalData: TemperaturePrintData = printData || {
        container_number: containerNumber,
        start_plug_in: startPlugIn,
        plug_out: plugOut,
        plug_duration_minutes: plugDurationMinutes,
        total_shifts: totalShifts,
        rekam_suhu: rekamSuhu,
    };

    const dayRecords = parseDayRecords({
        container_number: containerNumber,
        rekam_suhu: rekamSuhu,
    });

    // Format durasi jam menit
    const formatDuration = (minutes?: number | null) => {
        if (!minutes || minutes <= 0) return '-';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins} Menit`;
        if (mins === 0) return `${hours} Jam`;
        return `${hours} Jam ${mins} Menit`;
    };

    return (
        <div className="space-y-4 pt-2">
            {/* Header Bagian Suhu & Aksi Cetak */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                        <Thermometer className="h-4 w-4" />
                    </div>
                    <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider">
                            Monitoring Suhu & Operasional Reefer
                        </h4>
                        <p className="text-[11px] text-gray-500">
                            Log rekam temperatur 24 jam & siklus daya pendingin
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setIsPrintModalOpen(true)}
                        className="h-8 px-3 text-xs font-semibold gap-1.5 border-gray-300 hover:bg-gray-100 text-gray-800 shadow-2xs"
                    >
                        <Printer className="h-3.5 w-3.5 text-gray-600" />
                        <span>Cetak / PDF Suhu</span>
                    </Button>
                </div>
            </div>

            {/* Box Status Plug In / Plug Out Operasional */}
            {hasPlugData && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 rounded-lg border border-slate-200 bg-slate-50/80 p-3 shadow-2xs">
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-emerald-600" />
                            Start Plug-In
                        </span>
                        <p className="text-xs font-bold text-slate-900 font-mono">
                            {formatDateTimeIndo(startPlugIn)}
                        </p>
                    </div>

                    <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-amber-600" />
                            Plug-Out
                        </span>
                        <p className="text-xs font-bold text-slate-900 font-mono">
                            {formatDateTimeIndo(plugOut)}
                        </p>
                    </div>

                    <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <Gauge className="h-3 w-3 text-blue-600" />
                            Total Durasi
                        </span>
                        <p className="text-xs font-bold text-slate-900">
                            {formatDuration(plugDurationMinutes)}
                        </p>
                    </div>

                    <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <Zap className="h-3 w-3 text-indigo-600" />
                            Total Shift
                        </span>
                        <p className="text-xs font-bold text-indigo-900">
                            <span className="text-sm font-black">{totalShifts || 0}</span> Shift
                        </p>
                    </div>
                </div>
            )}

            {/* Matriks Rekam Suhu Harian (Sesuai Format PDF) */}
            {hasRekamSuhu && (
                <div className="space-y-3">
                    {dayRecords.map((day) => (
                        <div
                            key={day.tanggal}
                            className="rounded-lg border border-gray-300 bg-white overflow-hidden shadow-2xs text-xs"
                        >
                            {/* Header Tanggal & Statistik Min / Max / Rata-rata */}
                            <div className="bg-slate-100 border-b border-gray-300 px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5 text-slate-600" />
                                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                        {day.tanggalFormatted}
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-mono">
                                        ({day.tanggal})
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-700">
                                    {day.minTemp !== null && (
                                        <span className="flex items-center gap-1">
                                            <TrendingDown className="h-3 w-3 text-blue-600" />
                                            <span>Min: <strong>{day.minTemp}°C</strong></span>
                                        </span>
                                    )}
                                    {day.maxTemp !== null && (
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3 text-rose-600" />
                                            <span>Max: <strong>{day.maxTemp}°C</strong></span>
                                        </span>
                                    )}
                                    {day.avgTemp !== null && (
                                        <span className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                            <span>Rata-rata: <strong className="text-indigo-700">{day.avgTemp}°C</strong></span>
                                        </span>
                                    )}
                                    <span className="text-slate-400 font-normal">
                                        ({day.count} bacaan)
                                    </span>
                                </div>
                            </div>

                            {/* Matrix Grid 12 Kolom (00:00 - 11:00 dan 12:00 - 23:00) */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-center text-[11px] table-fixed min-w-[620px]">
                                    {/* Baris 1: 00:00 - 11:00 */}
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                                            {day.row1.map((cell) => (
                                                <th key={cell.hour} className="py-1 px-0.5 font-semibold border-r border-slate-200 last:border-r-0">
                                                    {cell.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-slate-200 bg-white">
                                            {day.row1.map((cell) => {
                                                const hasVal = cell.value !== null && cell.value !== undefined;
                                                return (
                                                    <td
                                                        key={cell.hour}
                                                        className={`py-1.5 px-0.5 border-r border-slate-200 last:border-r-0 font-mono ${
                                                            hasVal ? 'font-bold text-slate-900 bg-blue-50/30' : 'text-slate-300'
                                                        }`}
                                                    >
                                                        {hasVal ? `${cell.value}°` : '-'}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    </tbody>

                                    {/* Baris 2: 12:00 - 23:00 */}
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                                            {day.row2.map((cell) => (
                                                <th key={cell.hour} className="py-1 px-0.5 font-semibold border-r border-slate-200 last:border-r-0">
                                                    {cell.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-white">
                                            {day.row2.map((cell) => {
                                                const hasVal = cell.value !== null && cell.value !== undefined;
                                                return (
                                                    <td
                                                        key={cell.hour}
                                                        className={`py-1.5 px-0.5 border-r border-slate-200 last:border-r-0 font-mono ${
                                                            hasVal ? 'font-bold text-slate-900 bg-blue-50/30' : 'text-slate-300'
                                                        }`}
                                                    >
                                                        {hasVal ? `${cell.value}°` : '-'}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Custom Entries (Bacaan Menit Tambahan) */}
                            {day.customEntries && day.customEntries.length > 0 && (
                                <div className="border-t border-slate-200 bg-slate-50/50 p-2 text-[11px] flex flex-wrap items-center gap-1.5">
                                    <span className="font-semibold text-slate-600 mr-1">
                                        Pencatatan Menit Khusus:
                                    </span>
                                    {day.customEntries.map((c, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 border border-slate-200 font-mono font-medium text-slate-800 shadow-2xs"
                                        >
                                            <span className="text-slate-500">{c.time}:</span>
                                            <span className="font-bold text-blue-700">{c.value}°C</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Cetak Suhu */}
            <TemperaturePrintModal
                isOpen={isPrintModalOpen}
                onClose={() => setIsPrintModalOpen(false)}
                data={modalData}
            />
        </div>
    );
}
