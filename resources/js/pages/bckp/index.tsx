import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    Archive,
    Check,
    CheckCircle2,
    Clock,
    Database,
    Download,
    FileArchive,
    HardDrive,
    Info,
    LoaderCircle,
    Lock,
    Save,
    Server,
    ShieldAlert,
    Sliders,
    Terminal,
} from 'lucide-react';
import React from 'react';

interface BackupItem {
    id: string;
    filename: string;
    size_bytes: number;
    size_formatted: string;
    created_at: string;
    created_at_human: string;
    mtime: number;
    status: string;
}

interface BackupStats {
    total_count: number;
    total_size_bytes: number;
    total_size_formatted: string;
    retention_days: number;
    schedule_time: string;
    raw_schedule_time?: string;
    active_connection: string;
    active_driver: string;
    active_database: string;
    storage_relative_path: string;
}

interface Props {
    backups: BackupItem[];
    stats: BackupStats;
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Database Backup',
        href: '/bckp',
    },
];

export default function BackupIndex({ backups, stats, flash }: Props) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        schedule_time: stats.raw_schedule_time || '00:01',
        retention_days: String(stats.retention_days || 14),
    });

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        post('/bckp/settings', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Database Backup Manager" />

            <div className="w-full space-y-6 px-4 sm:px-6 lg:px-8 py-6 pb-16 max-w-7xl mx-auto">
                {/* Header Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm">
                                <Database className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                                        Database Backup Manager
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200">
                                        <Lock className="h-3 w-3" />
                                        Super Admin
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    Arsip cadangan basis data terkompresi (.sql.gz). Unduh langsung tanpa perlu login ke cPanel.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4 text-xs font-semibold text-green-800 shadow-xs">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800 shadow-xs">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-red-600" />
                            <span>{flash.error}</span>
                        </div>
                    </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Total Backups */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between text-gray-500">
                            <span className="text-xs font-medium uppercase tracking-wider">Total File Arsip</span>
                            <Archive className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold tracking-tight text-gray-900">
                                {stats.total_count}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                                ({stats.total_size_formatted})
                            </span>
                        </div>
                        <p className="mt-1 text-[11px] text-gray-400">Tersimpan dalam format gzip</p>
                    </div>

                    {/* Card 2: Jadwal Otomatis */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between text-gray-500">
                            <span className="text-xs font-medium uppercase tracking-wider">Jadwal Otomatis</span>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="mt-2">
                            <span className="text-base sm:text-lg font-bold tracking-tight text-gray-900 block truncate">
                                {stats.schedule_time}
                            </span>
                        </div>
                        <p className="mt-1 text-[11px] text-gray-400">Eksekusi harian via scheduler</p>
                    </div>

                    {/* Card 3: Retensi Penyimpanan */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between text-gray-500">
                            <span className="text-xs font-medium uppercase tracking-wider">Masa Retensi</span>
                            <HardDrive className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="mt-2">
                            <span className="text-2xl font-bold tracking-tight text-gray-900">
                                {stats.retention_days} Hari
                            </span>
                        </div>
                        <p className="mt-1 text-[11px] text-gray-400">File lebih lama dibersihkan otomatis</p>
                    </div>

                    {/* Card 4: Koneksi Database */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between text-gray-500">
                            <span className="text-xs font-medium uppercase tracking-wider">Basis Data Aktif</span>
                            <Server className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="mt-2">
                            <span className="text-sm sm:text-base font-bold tracking-tight text-gray-900 block truncate" title={stats.active_database}>
                                {stats.active_database}
                            </span>
                        </div>
                        <p className="mt-1 text-[11px] text-gray-400">
                            Driver: <span className="font-semibold text-gray-600">{stats.active_driver}</span> ({stats.active_connection})
                        </p>
                    </div>
                </div>

                {/* Form Pengaturan Jadwal & Retensi */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                            <Sliders className="h-4 w-4 text-gray-700" />
                            <h2 className="text-sm font-bold text-gray-900">Pengaturan Waktu & Retensi Backup</h2>
                        </div>
                        <span className="text-[11px] text-gray-400">
                            Zona Waktu: Asia/Jakarta (WIB)
                        </span>
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Waktu Backup (Jam:Menit) */}
                            <div className="space-y-1.5">
                                <Label htmlFor="schedule_time" className="text-xs font-semibold text-gray-700">
                                    Waktu Eksekusi Harian (WIB)
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="schedule_time"
                                        type="time"
                                        value={data.schedule_time}
                                        onChange={(e) => setData('schedule_time', e.target.value)}
                                        disabled={processing}
                                        className="h-10 text-xs font-medium"
                                        required
                                    />
                                </div>
                                <InputError message={errors.schedule_time} />
                                <p className="text-[11px] text-gray-500">
                                    Tentukan jam dan menit backup otomatis setiap hari (contoh: <code className="font-mono">00:01</code> atau <code className="font-mono">02:30</code>).
                                </p>
                            </div>

                            {/* Masa Retensi */}
                            <div className="space-y-1.5">
                                <Label htmlFor="retention_days" className="text-xs font-semibold text-gray-700">
                                    Masa Retensi Penyimpanan (Hari)
                                </Label>
                                <Select
                                    value={data.retention_days}
                                    onValueChange={(val) => setData('retention_days', val)}
                                    disabled={processing}
                                >
                                    <SelectTrigger id="retention_days" className="h-10 text-xs">
                                        <SelectValue placeholder="Pilih masa retensi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">7 Hari (1 Minggu)</SelectItem>
                                        <SelectItem value="14">14 Hari (2 Minggu - Standar)</SelectItem>
                                        <SelectItem value="30">30 Hari (1 Bulan)</SelectItem>
                                        <SelectItem value="60">60 Hari (2 Bulan)</SelectItem>
                                        <SelectItem value="90">90 Hari (3 Bulan)</SelectItem>
                                        <SelectItem value="180">180 Hari (6 Bulan)</SelectItem>
                                        <SelectItem value="365">365 Hari (1 Tahun)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.retention_days} />
                                <p className="text-[11px] text-gray-500">
                                    File yang melebihi batas hari ini akan dibersihkan otomatis setelah backup baru berhasil.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
                            <p className="text-[11px] text-gray-400">
                                Perubahan jadwal langsung berlaku pada cron job tanpa perlu restart server atau mengubah cron cPanel.
                            </p>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={processing}
                                className="bg-gray-900 hover:bg-black text-white h-9 px-4 text-xs font-semibold gap-1.5 shadow-xs shrink-0"
                            >
                                {processing ? (
                                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                ) : recentlySuccessful ? (
                                    <Check className="h-3.5 w-3.5 text-green-400" />
                                ) : (
                                    <Save className="h-3.5 w-3.5" />
                                )}
                                <span>{recentlySuccessful ? 'Tersimpan!' : 'Simpan Pengaturan'}</span>
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Security & Storage Note Box */}
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 sm:p-5 shadow-xs">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-xs text-blue-900">
                            <p className="font-bold text-sm text-blue-950">
                                Perlindungan Keamanan & Privasi File Backup
                            </p>
                            <p className="leading-relaxed">
                                Seluruh file cadangan disimpan pada direktori privat server (<code className="bg-blue-100/80 px-1.5 py-0.5 rounded text-blue-900 font-mono">{stats.storage_relative_path}</code>) di luar Document Root publik. Berkas tidak dapat diakses atau diunduh langsung melalui URL browser tanpa melalui sistem autentikasi Super Admin.
                            </p>
                            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-blue-800">
                                <span className="flex items-center gap-1">
                                    <Terminal className="h-3.5 w-3.5" />
                                    Jalankan manual di terminal: <code className="bg-blue-100 px-1 py-0.2 rounded font-mono font-bold">php artisan db:backup</code>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table of Backups */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-gray-900">Daftar Arsip Cadangan Database</h2>
                            <p className="text-xs text-gray-500">Urutan berkas dari yang paling terbaru.</p>
                        </div>
                        <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded-lg px-2.5 py-1 shadow-2xs">
                            {backups.length} Arsip Tersedia
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/80">
                                <TableRow>
                                    <TableHead className="text-xs font-bold text-gray-700 py-3.5 pl-5">Nama File Backup</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-700 py-3.5">Waktu Pembuatan (WIB)</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-700 py-3.5">Ukuran File</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-700 py-3.5">Status</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-700 py-3.5 text-right pr-5">Aksi Unduh</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {backups.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-16 text-center text-xs text-gray-500">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <FileArchive className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-semibold text-gray-800 text-sm">
                                                        Belum ada arsip backup database
                                                    </p>
                                                    <p className="text-gray-500 max-w-md mx-auto">
                                                        Backup otomatis akan berjalan pada waktu yang ditentukan di atas, atau Anda dapat menjalankan perintah <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-gray-700">php artisan db:backup</code> dari server.
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    backups.map((item, idx) => (
                                        <TableRow key={item.id} className="hover:bg-gray-50/60 transition-colors">
                                            {/* File Name */}
                                            <TableCell className="py-3.5 pl-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                        <FileArchive className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="font-mono text-xs font-semibold text-gray-900 block truncate">
                                                            {item.filename}
                                                        </span>
                                                        {idx === 0 && (
                                                            <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700 border border-emerald-200 mt-0.5">
                                                                Terbaru
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Timestamp */}
                                            <TableCell className="py-3.5 text-xs text-gray-700">
                                                <div className="font-medium text-gray-900">{item.created_at} WIB</div>
                                                <div className="text-[11px] text-gray-400">{item.created_at_human}</div>
                                            </TableCell>

                                            {/* Size */}
                                            <TableCell className="py-3.5 text-xs font-semibold text-gray-800">
                                                {item.size_formatted}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell className="py-3.5">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                                    {item.status}
                                                </span>
                                            </TableCell>

                                            {/* Action: Download */}
                                            <TableCell className="py-3.5 text-right pr-5">
                                                <Button
                                                    size="sm"
                                                    asChild
                                                    className="bg-gray-900 hover:bg-black text-white h-8 text-xs font-semibold px-3 gap-1.5 shadow-xs"
                                                >
                                                    <a
                                                        href={`/bckp/download/${encodeURIComponent(item.filename)}`}
                                                        download
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                        <span>Unduh (.gz)</span>
                                                    </a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="rounded-lg bg-gray-50 p-3.5 border border-gray-200 text-center text-xs text-gray-500">
                    Sesuai kebijakan keamanan data production, operasi restore dan penghapusan berkas tidak disediakan melalui antarmuka web.
                </div>
            </div>
        </AppLayout>
    );
}
