import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRangePicker, type DateRange } from '@/components/date-range-picker';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { Head, router, useForm } from '@inertiajs/react';
import {
    Archive,
    ArrowDownToLine,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    Database,
    Download,
    FileArchive,
    Filter,
    Globe,
    HardDrive,
    Info,
    Layers,
    LoaderCircle,
    Lock,
    Play,
    RefreshCw,
    Save,
    Server,
    ShieldAlert,
    Sliders,
    Sparkles,
    Terminal,
    Trash2,
    TriangleAlert,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

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

interface AutoBackupStatus {
    today_date: string;
    has_backed_up_today: boolean;
    schedule_time: string;
    is_time_passed_today: boolean;
    last_backup_at: string | null;
    last_backup_file: string;
    last_backup_status: string;
    cron_token: string;
    cron_url: string;
}

interface Props {
    backups: BackupItem[];
    stats: BackupStats;
    auto_backup: AutoBackupStatus;
    flash?: {
        success?: string;
        error?: string;
    };
}

interface PreviewCounts {
    orders: number;
    order_items: number;
    order_item_rekam_suhus: number;
    reefer_temperature_logs: number;
    temperature_records: number;
    order_item_additional_products: number;
    invoices: number;
    invoice_items: number;
    activity_logs: number;
    total_rows: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Database Backup & Cleanup',
        href: '/bckp',
    },
];

const MODULE_OPTIONS = [
    {
        id: 'orders',
        label: 'Orders (Master Order)',
        desc: 'Header order, customer & shipper mapping, No AJU, status.',
    },
    {
        id: 'containers',
        label: 'Containers & Riwayat Plug In/Out',
        desc: 'Nomor kontainer, entry/exit date, shift plugin/out, log suhu kontainer & add-ons.',
    },
    {
        id: 'temperature_records',
        label: 'Matriks Suhu 24-Jam Harian',
        desc: 'Catatan suhu berkala 24 jam (impout_00 - impout_23) dan log reefer.',
    },
    {
        id: 'invoices',
        label: 'Invoices & Invoice Items',
        desc: 'Nomor invoice, rincian biaya container & additional fee, log aktivitas invoice.',
    },
];

export default function BackupIndex({ backups, stats, auto_backup, flash }: Props) {
    // Tab State: 'overview' | 'selective_backup' | 'cleanup'
    const [activeTab, setActiveTab] = useState<'overview' | 'selective_backup' | 'cleanup'>('overview');

    const [isRunningBackup, setIsRunningBackup] = useState(false);
    const [copiedCurl, setCopiedCurl] = useState(false);

    // Form Pengaturan Jadwal
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        schedule_time: stats.raw_schedule_time || '00:01',
        retention_days: String(stats.retention_days || 14),
    });

    // State Seleksi Date Range & Modul (Dipakai untuk Selective Backup & Cleanup)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('2026-09-30'); // Default tanggal yang diminta user (30 September)
    const [selectedModules, setSelectedModules] = useState<string[]>([
        'orders',
        'containers',
        'temperature_records',
        'invoices',
    ]);
    const [activeTemplate, setActiveTemplate] = useState<string>('all_container_invoice');

    // State Preview Count
    const [previewCounts, setPreviewCounts] = useState<PreviewCounts | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    // State Modals
    const [isExporting, setIsExporting] = useState(false);
    const [isCleanupModalOpen, setIsCleanupModalOpen] = useState(false);
    const [cleanupConfirmText, setCleanupConfirmText] = useState('');
    const [autoSafetyBackup, setAutoSafetyBackup] = useState(true);
    const [isCleaningUp, setIsCleaningUp] = useState(false);

    // Handlers Pengaturan
    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        post('/bckp/settings', {
            preserveScroll: true,
        });
    };

    const handleRunManualBackup = () => {
        if (isRunningBackup) return;
        if (!confirm('Jalankan proses backup database penuh (Full DB) sekarang?')) {
            return;
        }

        setIsRunningBackup(true);
        router.post(
            '/bckp/run',
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsRunningBackup(false),
            }
        );
    };

    const handleRegenerateToken = () => {
        if (!confirm('Generate ulang token cron? URL webhook cron lama akan dinonaktifkan.')) {
            return;
        }
        router.post('/bckp/token/regenerate', {}, { preserveScroll: true });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedCurl(true);
        setTimeout(() => setCopiedCurl(false), 2000);
    };

    // Preset / Template Selection Helper
    const handleSelectTemplate = (templateKey: string) => {
        setActiveTemplate(templateKey);
        if (templateKey === 'all_container_invoice') {
            setSelectedModules(['orders', 'containers', 'temperature_records', 'invoices']);
        } else if (templateKey === 'container_only') {
            setSelectedModules(['orders', 'containers', 'temperature_records']);
        } else if (templateKey === 'invoice_only') {
            setSelectedModules(['invoices']);
        } else if (templateKey === 'custom') {
            // Keep current
        }
    };

    const toggleModule = (moduleId: string) => {
        setActiveTemplate('custom');
        setSelectedModules((prev) =>
            prev.includes(moduleId) ? prev.filter((m) => m !== moduleId) : [...prev, moduleId]
        );
    };

    // Fetch Preview Counts dari backend
    const fetchPreview = async (s = startDate, e = endDate, mods = selectedModules) => {
        setIsLoadingPreview(true);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
            const res = await fetch('/bckp/selective/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({
                    start_date: s || null,
                    end_date: e || null,
                    modules: mods,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setPreviewCounts(data.counts);
            }
        } catch (err) {
            console.error('Failed to fetch preview counts', err);
        } finally {
            setIsLoadingPreview(false);
        }
    };

    // Trigger preview fetch saat tab dibuka atau filter diganti
    useEffect(() => {
        if (activeTab === 'selective_backup' || activeTab === 'cleanup') {
            fetchPreview(startDate, endDate, selectedModules);
        }
    }, [activeTab, startDate, endDate, selectedModules]);

    // Eksekusi Selective Backup
    const handleRunSelectiveBackup = () => {
        if (selectedModules.length === 0) {
            alert('Pilih minimal 1 kategori data yang akan di-backup.');
            return;
        }

        setIsExporting(true);
        router.post(
            '/bckp/selective/run',
            {
                start_date: startDate || null,
                end_date: endDate || null,
                modules: selectedModules,
                template: activeTemplate,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsExporting(false),
            }
        );
    };

    // Eksekusi Clean Up Data
    const handleRunCleanup = () => {
        if (cleanupConfirmText.trim().toUpperCase() !== 'HAPUS DATA') {
            alert('Silakan ketik "HAPUS DATA" untuk mengonfirmasi tindakan ini.');
            return;
        }

        setIsCleaningUp(true);
        router.post(
            '/bckp/cleanup/run',
            {
                start_date: startDate || null,
                end_date: endDate || null,
                modules: selectedModules,
                confirmation: cleanupConfirmText.trim().toUpperCase(),
                safety_backup: autoSafetyBackup,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsCleaningUp(false);
                    setIsCleanupModalOpen(false);
                    setCleanupConfirmText('');
                    fetchPreview();
                },
            }
        );
    };

    const curlCommand = `curl -s "${auto_backup.cron_url}" > /dev/null 2>&1`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Database Backup & Data Cleanup" />

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
                                        Database Backup & Data Clean Up
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-800 border border-slate-200">
                                        <Lock className="h-3 w-3" />
                                        Super Admin
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    Kelola backup berkala, export selektif berdasarkan rentang tanggal kontainer/invoice, dan pembersihan data aman.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Button
                            type="button"
                            onClick={handleRunManualBackup}
                            disabled={isRunningBackup}
                            className="bg-gray-900 hover:bg-black text-white h-9 px-4 text-xs font-semibold gap-2 shadow-xs shrink-0 transition-all cursor-pointer"
                        >
                            {isRunningBackup ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                                <Play className="h-3.5 w-3.5 fill-white" />
                            )}
                            <span>{isRunningBackup ? 'Sedang Mem-backup...' : 'Full Backup Sekarang'}</span>
                        </Button>
                    </div>
                </div>

                {/* Navigasi Tab */}
                <div className="flex border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
                            activeTab === 'overview'
                                ? 'border-gray-900 text-gray-900'
                                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                        }`}
                    >
                        <Archive className="h-4 w-4" />
                        <span>Daftar Arsip & Jadwal Backup</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('selective_backup')}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
                            activeTab === 'selective_backup'
                                ? 'border-blue-600 text-blue-700'
                                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                        }`}
                    >
                        <ArrowDownToLine className="h-4 w-4 text-blue-600" />
                        <span>Backup Selektif (Date Range)</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('cleanup')}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
                            activeTab === 'cleanup'
                                ? 'border-red-600 text-red-700'
                                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                        }`}
                    >
                        <Trash2 className="h-4 w-4 text-red-600" />
                        <span>Clean Up Data Database</span>
                    </button>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4 text-xs font-semibold text-green-800 shadow-xs">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800 shadow-xs">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
                            <span>{flash.error}</span>
                        </div>
                    </div>
                )}

                {/* =================================================================== */}
                {/* TAB 1: OVERVIEW & JADWAL OTOMATIS */}
                {/* =================================================================== */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Status Auto-Backup Hari Ini */}
                        <div
                            className={`rounded-xl border p-4 sm:p-5 shadow-xs transition-all ${
                                auto_backup.has_backed_up_today
                                    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
                                    : 'border-amber-200 bg-amber-50/70 text-amber-950'
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    {auto_backup.has_backed_up_today ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-sm">
                                                {auto_backup.has_backed_up_today
                                                    ? 'Auto Backup Hari Ini Telah Berhasil'
                                                    : `Menunggu Jadwal Backup Hari Ini (${auto_backup.schedule_time} WIB)`}
                                            </h3>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                                    auto_backup.has_backed_up_today
                                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                        : 'bg-amber-100 text-amber-800 border-amber-300'
                                                }`}
                                            >
                                                {auto_backup.has_backed_up_today ? 'Hari Ini Selesai' : 'Pending'}
                                            </span>
                                        </div>
                                        <p className="text-xs mt-1 text-gray-600 leading-relaxed">
                                            {auto_backup.has_backed_up_today ? (
                                                <>
                                                    Arsip terakhir berhasil dibuat pada{' '}
                                                    <span className="font-semibold text-gray-800">
                                                        {auto_backup.last_backup_at || 'Hari ini'}
                                                    </span>
                                                    {auto_backup.last_backup_file && (
                                                        <>
                                                            {' '}
                                                            (
                                                            <code className="font-mono text-[11px] bg-emerald-100/80 px-1 py-0.2 rounded text-emerald-900">
                                                                {auto_backup.last_backup_file}
                                                            </code>
                                                            )
                                                        </>
                                                    )}
                                                    . Sistem tidak akan melakukan duplikasi backup pada hari yang sama.
                                                </>
                                            ) : auto_backup.is_time_passed_today ? (
                                                <>
                                                    Waktu jadwal pukul <span className="font-semibold">{auto_backup.schedule_time} WIB</span> telah tercapai. Sistem otomatis (web-triggered / cron) akan mengeksekusi backup saat ada aktivitas sistem berikutnya.
                                                </>
                                            ) : (
                                                <>
                                                    Jadwal harian diatur pada pukul{' '}
                                                    <span className="font-semibold">{auto_backup.schedule_time} WIB</span>. Backup otomatis akan dieksekusi secara instan saat jam tersebut tiba.
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                <p className="mt-1 text-[11px] text-gray-400">Tersimpan dalam format gzip (.sql.gz)</p>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                                <div className="flex items-center justify-between text-gray-500">
                                    <span className="text-xs font-medium uppercase tracking-wider">Jadwal Harian</span>
                                    <Clock className="h-4 w-4 text-amber-500" />
                                </div>
                                <div className="mt-2">
                                    <span className="text-base sm:text-lg font-bold tracking-tight text-gray-900 block truncate">
                                        {stats.schedule_time}
                                    </span>
                                </div>
                                <p className="mt-1 text-[11px] text-gray-400">Eksekusi harian otomatis</p>
                            </div>

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
                                <span className="text-[11px] text-gray-400">Zona Waktu: Asia/Jakarta (WIB)</span>
                            </div>

                            <form onSubmit={handleSaveSettings} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="schedule_time" className="text-xs font-semibold text-gray-700">
                                            Waktu Eksekusi Harian (WIB)
                                        </Label>
                                        <Input
                                            id="schedule_time"
                                            type="time"
                                            value={data.schedule_time}
                                            onChange={(e) => setData('schedule_time', e.target.value)}
                                            disabled={processing}
                                            className="h-10 text-xs font-medium"
                                            required
                                        />
                                        <InputError message={errors.schedule_time} />
                                        <p className="text-[11px] text-gray-500">
                                            Tentukan jam dan menit backup otomatis (contoh: <code className="font-mono">00:01</code>).
                                        </p>
                                    </div>

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
                                            Arsip lawas dibersihkan otomatis setelah backup baru berhasil dibuat.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
                                    <p className="text-[11px] text-gray-400">
                                        Perubahan jadwal langsung aktif pada sistem trigger otomatis.
                                    </p>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={processing}
                                        className="bg-gray-900 hover:bg-black text-white h-9 px-4 text-xs font-semibold gap-1.5 shadow-xs shrink-0 cursor-pointer"
                                    >
                                        {processing ? (
                                            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                        ) : recentlySuccessful ? (
                                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                                        ) : (
                                            <Save className="h-3.5 w-3.5" />
                                        )}
                                        <span>{recentlySuccessful ? 'Tersimpan!' : 'Simpan Pengaturan'}</span>
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Panduan Eksekusi Otomatis & cPanel Cron */}
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-blue-600" />
                                    <h2 className="text-sm font-bold text-gray-900">Metode Otomasi Backup Harian</h2>
                                </div>
                                <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    Web-Trigger Aktif
                                </span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-gray-900 font-semibold text-xs">
                                        <Globe className="h-4 w-4 text-blue-600" />
                                        <span>1. Web-Trigger Otomatis (Sudah Aktif)</span>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Sistem secara otomatis mendeteksi jadwal backup harian. Begitu jam backup terlewati dan ada aktivitas pada aplikasi web, proses backup akan berjalan di background tanpa menghambat pengguna dan tanpa perlu login ke cPanel.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-900 font-semibold text-xs">
                                            <Terminal className="h-4 w-4 text-slate-700" />
                                            <span>2. cPanel Cron via Webhook URL</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRegenerateToken}
                                            className="text-[11px] text-gray-500 hover:text-gray-900 flex items-center gap-1 cursor-pointer underline"
                                        >
                                            <RefreshCw className="h-3 w-3" />
                                            Reset Token
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        Pasang baris berikut di menu <strong>cPanel &gt; Cron Jobs</strong> (misal pukul {auto_backup.schedule_time}):
                                    </p>
                                    <div className="flex items-center gap-2 bg-gray-900 text-gray-100 p-2 rounded-md font-mono text-[11px]">
                                        <span className="truncate flex-1">{curlCommand}</span>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(curlCommand)}
                                            className="h-6 px-2 text-white hover:bg-gray-800 text-[10px] shrink-0"
                                        >
                                            {copiedCurl ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                                            <span className="ml-1">{copiedCurl ? 'Disalin' : 'Salin'}</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table of Backups */}
                        <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-gray-900">Daftar Berkas Cadangan Tersedia (.sql.gz)</h2>
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
                                                                Klik tombol <strong>Full Backup Sekarang</strong> di atas untuk membuat arsip cadangan pertama Anda.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            backups.map((item, idx) => (
                                                <TableRow key={item.id} className="hover:bg-gray-50/60 transition-colors">
                                                    <TableCell className="py-3.5 pl-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
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

                                                    <TableCell className="py-3.5 text-xs text-gray-700">
                                                        <div className="font-medium text-gray-900">{item.created_at} WIB</div>
                                                        <div className="text-[11px] text-gray-400">{item.created_at_human}</div>
                                                    </TableCell>

                                                    <TableCell className="py-3.5 text-xs font-semibold text-gray-800">
                                                        {item.size_formatted}
                                                    </TableCell>

                                                    <TableCell className="py-3.5">
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                                            {item.status}
                                                        </span>
                                                    </TableCell>

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
                                                                <span>Unduh (.sql.gz)</span>
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
                    </div>
                )}

                {/* =================================================================== */}
                {/* TAB 2 & TAB 3: SELECTIVE BACKUP & CLEAN UP DATA */}
                {/* =================================================================== */}
                {(activeTab === 'selective_backup' || activeTab === 'cleanup') && (
                    <div className="space-y-6">
                        {/* Banner Panduan */}
                        <div
                            className={`rounded-xl border p-4 sm:p-5 shadow-xs ${
                                activeTab === 'cleanup'
                                    ? 'border-red-200 bg-red-50/60 text-red-950'
                                    : 'border-blue-200 bg-blue-50/60 text-blue-950'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                {activeTab === 'cleanup' ? (
                                    <TriangleAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                ) : (
                                    <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                )}
                                <div className="space-y-1 text-xs">
                                    <h3 className="font-bold text-sm">
                                        {activeTab === 'cleanup'
                                            ? 'Clean Up Data Database (Pembersihan Entri Tertentu)'
                                            : 'Export Selective Backup Berdasarkan Rentang Tanggal'}
                                    </h3>
                                    <p className="leading-relaxed">
                                        {activeTab === 'cleanup' ? (
                                            <>
                                                Fitur ini menghapus entri operasional (Order, Kontainer, Riwayat Suhu, dan/atau Invoice) sesuai rentang tanggal yang Anda tentukan. Master data penting seperti <strong>Customer, Shipper, Product (tarif), Pengguna, dan Setting</strong> dijamin <strong>100% AMAN dan TIDAK AKAN DIHAPUS</strong>.
                                            </>
                                        ) : (
                                            <>
                                                Fitur ini menghasilkan file dump SQL terkompresi (<code className="font-mono bg-blue-100 px-1 py-0.2 rounded text-blue-900">.sql.gz</code>) khusus untuk data operasional dalam rentang waktu yang Anda pilih (misal dari awal s/d 30 September). File ini mandiri dan dapat di-import kembali ke database kapan saja tanpa merusak master data.
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Filter Control Box: Date Range & Modul Selection */}
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-6">
                            {/* Baris 1: Date Range Picker & Template Preset */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                                {/* Date Range Picker */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                        <span>Rentang Tanggal (Date Range)</span>
                                    </Label>
                                    <DateRangePicker
                                        startDate={startDate}
                                        endDate={endDate}
                                        placeholder="Pilih rentang tanggal (kosongkan awal untuk sejak awal)..."
                                        onChange={(range: DateRange) => {
                                            setStartDate(range.startDate);
                                            setEndDate(range.endDate);
                                        }}
                                        className="w-full"
                                    />
                                    <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-500">
                                        <span>Preset cepat:</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStartDate('');
                                                setEndDate('2026-09-30');
                                            }}
                                            className="underline hover:text-gray-900 font-semibold cursor-pointer"
                                        >
                                            Awal s/d 30 September
                                        </button>
                                        <span>•</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStartDate('');
                                                setEndDate('');
                                            }}
                                            className="underline hover:text-gray-900 cursor-pointer"
                                        >
                                            Semua Waktu (All Entries)
                                        </button>
                                    </div>
                                </div>

                                {/* Template Preset Selection */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                        <Layers className="h-3.5 w-3.5 text-gray-500" />
                                        <span>Template / Preset Pilihan Data</span>
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleSelectTemplate('all_container_invoice')}
                                            className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                                                activeTemplate === 'all_container_invoice'
                                                    ? 'border-gray-900 bg-gray-900 text-white shadow-xs font-semibold'
                                                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            <div className="font-bold">Order + Invoice</div>
                                            <div className="text-[10px] opacity-80 mt-0.5">Semua kontainer, suhu & invoice</div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleSelectTemplate('container_only')}
                                            className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                                                activeTemplate === 'container_only'
                                                    ? 'border-gray-900 bg-gray-900 text-white shadow-xs font-semibold'
                                                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            <div className="font-bold">Kontainer & Suhu</div>
                                            <div className="text-[10px] opacity-80 mt-0.5">Hanya order & suhu (tanpa invoice)</div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleSelectTemplate('invoice_only')}
                                            className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                                                activeTemplate === 'invoice_only'
                                                    ? 'border-gray-900 bg-gray-900 text-white shadow-xs font-semibold'
                                                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            <div className="font-bold">Hanya Invoice</div>
                                            <div className="text-[10px] opacity-80 mt-0.5">Invoice & invoice item saja</div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Baris 2: Multiple Selection Checklist Modul */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-gray-800">
                                        Pilih Kategori Data Spesifik (Multiple Checkboxes)
                                    </Label>
                                    <span className="text-[11px] text-gray-500">
                                        {selectedModules.length} dari {MODULE_OPTIONS.length} kategori dipilih
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {MODULE_OPTIONS.map((mod) => {
                                        const isChecked = selectedModules.includes(mod.id);
                                        return (
                                            <div
                                                key={mod.id}
                                                onClick={() => toggleModule(mod.id)}
                                                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                                                    isChecked
                                                        ? 'border-gray-900 bg-gray-50/80 shadow-2xs'
                                                        : 'border-gray-200 bg-white hover:bg-gray-50'
                                                }`}
                                            >
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={() => toggleModule(mod.id)}
                                                    className="mt-0.5"
                                                />
                                                <div className="space-y-0.5 flex-1 min-w-0">
                                                    <div className="text-xs font-bold text-gray-900 flex items-center justify-between">
                                                        <span>{mod.label}</span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 leading-relaxed">
                                                        {mod.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Baris 3: Live Preview Hitungan Baris Data */}
                            <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-gray-600" />
                                        <h4 className="text-xs font-bold text-gray-900">
                                            Estimasi Data Terpilih ({startDate || 'Awal'} s/d {endDate || 'Sekarang'})
                                        </h4>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => fetchPreview()}
                                        disabled={isLoadingPreview}
                                        className="h-7 text-[11px] px-2.5 gap-1 bg-white hover:bg-gray-100 text-gray-700"
                                    >
                                        <RefreshCw className={`h-3 w-3 ${isLoadingPreview ? 'animate-spin' : ''}`} />
                                        <span>Refresh Hitungan</span>
                                    </Button>
                                </div>

                                {isLoadingPreview ? (
                                    <div className="py-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                                        <LoaderCircle className="h-4 w-4 animate-spin text-gray-700" />
                                        <span>Menghitung baris database...</span>
                                    </div>
                                ) : previewCounts ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                        <div className="p-2.5 bg-white rounded-md border border-gray-200">
                                            <span className="text-[11px] text-gray-500 block">Orders Terpilih</span>
                                            <span className="text-base font-bold text-gray-900">
                                                {previewCounts.orders.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="p-2.5 bg-white rounded-md border border-gray-200">
                                            <span className="text-[11px] text-gray-500 block">Kontainer (Order Items)</span>
                                            <span className="text-base font-bold text-gray-900">
                                                {previewCounts.order_items.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="p-2.5 bg-white rounded-md border border-gray-200">
                                            <span className="text-[11px] text-gray-500 block">Riwayat & Log Suhu</span>
                                            <span className="text-base font-bold text-gray-900">
                                                {(
                                                    previewCounts.order_item_rekam_suhus +
                                                    previewCounts.reefer_temperature_logs +
                                                    previewCounts.temperature_records
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="p-2.5 bg-white rounded-md border border-gray-200">
                                            <span className="text-[11px] text-gray-500 block">Invoices & Rincian</span>
                                            <span className="text-base font-bold text-gray-900">
                                                {(previewCounts.invoices + previewCounts.invoice_items).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ) : null}

                                <div className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-1">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>Tabel Customer, Shipper, dan Produk (tarif) diproteksi secara permanen dari penghapusan.</span>
                                </div>
                            </div>

                            {/* Tombol Aksi Sesuai Tab Aktif */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                                <div className="text-xs text-gray-500">
                                    {activeTab === 'cleanup' ? (
                                        <span className="text-red-600 font-semibold">
                                            Perhatian: Clean Up akan menghapus data terpilih dari database utama secara permanen.
                                        </span>
                                    ) : (
                                        <span>
                                            File SQL hasil backup akan otomatis muncul pada daftar arsip dan langsung dapat diunduh.
                                        </span>
                                    )}
                                </div>

                                {activeTab === 'selective_backup' ? (
                                    <Button
                                        type="button"
                                        onClick={handleRunSelectiveBackup}
                                        disabled={isExporting || selectedModules.length === 0}
                                        className="bg-gray-900 hover:bg-black text-white h-9 px-5 text-xs font-bold gap-2 shadow-sm cursor-pointer"
                                    >
                                        {isExporting ? (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <ArrowDownToLine className="h-4 w-4" />
                                        )}
                                        <span>{isExporting ? 'Sedang Mengekspor SQL...' : 'Generate Selective Backup (.sql.gz)'}</span>
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => setIsCleanupModalOpen(true)}
                                        disabled={selectedModules.length === 0 || !!(previewCounts && previewCounts.total_rows === 0)}
                                        className="bg-red-600 hover:bg-red-700 text-white h-9 px-5 text-xs font-bold gap-2 shadow-sm cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Mulai Clean Up Data...</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Note */}
                <div className="rounded-lg bg-gray-50 p-3.5 border border-gray-200 text-center text-xs text-gray-500">
                    Sistem perlindungan data aktif: Seluruh file backup tersimpan dalam direktori privat server dan dilindungi autentikasi Super Admin.
                </div>
            </div>

            {/* Modal Konfirmasi Keamanan Clean Up Data */}
            <Dialog open={isCleanupModalOpen} onOpenChange={setIsCleanupModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600 text-base">
                            <TriangleAlert className="h-5 w-5" />
                            <span>Konfirmasi Clean Up Data Database</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-gray-600 pt-2 leading-relaxed">
                            Anda akan menghapus data entri operasional berikut:
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2 text-xs">
                        {/* Rincian yang akan dihapus */}
                        <div className="rounded-lg bg-red-50 p-3 border border-red-200 space-y-1.5 text-red-950 font-medium">
                            <div>• Rentang Tanggal: <strong>{startDate || 'Sejak Awal'}</strong> s/d <strong>{endDate || 'Sekarang'}</strong></div>
                            <div>• Kategori: <strong>{selectedModules.join(', ')}</strong></div>
                            {previewCounts && (
                                <div className="pt-1 border-t border-red-200/80 font-bold text-red-700">
                                    Total data yang akan dihapus: {previewCounts.total_rows.toLocaleString()} baris
                                </div>
                            )}
                        </div>

                        {/* Opsi Auto Safety Backup */}
                        <div className="flex items-start gap-2.5 p-3 rounded-lg border border-gray-200 bg-gray-50/80">
                            <Checkbox
                                id="auto_safety_backup"
                                checked={autoSafetyBackup}
                                onCheckedChange={(c) => setAutoSafetyBackup(!!c)}
                                className="mt-0.5"
                            />
                            <Label htmlFor="auto_safety_backup" className="text-xs cursor-pointer font-medium leading-relaxed">
                                <span className="font-bold text-gray-900 block">Buat Safety Backup Otomatis Terlebih Dahulu (Direkomendasikan)</span>
                                <span className="text-gray-500 text-[11px]">
                                    Sistem akan mengekspor backup .sql.gz dari data ini sebelum dihapus, sehingga data tetap dapat dipulihkan kapan saja jika diperlukan.
                                </span>
                            </Label>
                        </div>

                        {/* Ketik Konfirmasi */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-800">
                                Ketik <code className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-mono font-bold">HAPUS DATA</code> untuk melanjutkan:
                            </Label>
                            <Input
                                value={cleanupConfirmText}
                                onChange={(e) => setCleanupConfirmText(e.target.value)}
                                placeholder="Ketik HAPUS DATA di sini..."
                                className="h-9 text-xs"
                                disabled={isCleaningUp}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsCleanupModalOpen(false)}
                            disabled={isCleaningUp}
                            className="text-xs"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleRunCleanup}
                            disabled={isCleaningUp || cleanupConfirmText.trim().toUpperCase() !== 'HAPUS DATA'}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold gap-1.5 cursor-pointer"
                        >
                            {isCleaningUp ? (
                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                            )}
                            <span>{isCleaningUp ? 'Sedang Menghapus Data...' : 'Konfirmasi & Eksekusi Cleanup'}</span>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
