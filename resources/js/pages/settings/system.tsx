import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    CalendarCheck,
    CalendarX,
    Check,
    CheckCircle2,
    PanelLeft,
    PanelLeftClose,
    PanelLeftOpen,
    Receipt,
    TableProperties,
} from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
    },
    {
        title: 'Pengaturan Sistem',
        href: '/settings/system',
    },
];

interface SystemSettingsProps {
    settings: {
        default_pagination: number;
        default_sidebar_state?: 'expanded' | 'collapsed';
        default_invoice_show_period?: boolean;
    };
    status?: string;
}

const paginationOptions = [10, 25, 50, 100];

export default function SystemSettings({ settings, status }: SystemSettingsProps) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        default_pagination: settings.default_pagination || 25,
        default_sidebar_state: settings.default_sidebar_state || 'expanded',
        default_invoice_show_period: settings.default_invoice_show_period ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('settings.system.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Sistem" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="border-b pb-4">
                        <HeadingSmall
                            title="Pengaturan Sistem & Antarmuka"
                            description="Konfigurasikan jumlah data default per halaman dan status default bilah samping (sidebar) untuk kenyamanan navigasi."
                        />
                    </div>

                    {status && (
                        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-800">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>{status}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section 1: Default Pagination */}
                        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
                            <div className="flex items-center gap-2">
                                <TableProperties className="h-4 w-4 text-gray-900" />
                                <Label className="text-sm font-bold text-gray-900">
                                    Jumlah Baris Per Halaman Default
                                </Label>
                            </div>
                            <p className="text-xs text-gray-500">
                                Menentukan jumlah baris data default yang dimuat saat membuka daftar Order, User/Admin, dan tabel data lainnya.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 w-full">
                                {paginationOptions.map((opt) => {
                                    const isSelected = Number(data.default_pagination) === opt;
                                    return (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setData('default_pagination', opt)}
                                            className={`flex flex-col items-center justify-center p-3.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'border-gray-900 bg-gray-100 text-gray-950 shadow-xs ring-2 ring-gray-900/10'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="text-xl">{opt}</span>
                                            <span className="text-[11px] font-normal text-gray-500">Baris / Hal</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.default_pagination} />
                        </div>

                        {/* Section 2: Default Sidebar / Navbar State */}
                        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
                            <div className="flex items-center gap-2">
                                <PanelLeft className="h-4 w-4 text-gray-900" />
                                <Label className="text-sm font-bold text-gray-900">
                                    Status Default Navbar / Sidebar
                                </Label>
                            </div>
                            <p className="text-xs text-gray-500">
                                Tentukan apakah bilah samping (sidebar menu) tampil terbuka penuh (expanded) atau tertutup/mini (collapsed) secara default saat membuka aplikasi.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 w-full">
                                <button
                                    type="button"
                                    onClick={() => setData('default_sidebar_state', 'expanded')}
                                    className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                        data.default_sidebar_state === 'expanded'
                                            ? 'border-gray-900 bg-gray-100/70 shadow-xs ring-2 ring-gray-900/10'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-lg shrink-0 ${
                                        data.default_sidebar_state === 'expanded'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        <PanelLeftOpen className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-900">Expanded (Terbuka Penuh)</span>
                                            {data.default_sidebar_state === 'expanded' && (
                                                <span className="text-[10px] font-extrabold text-gray-800 bg-gray-200 px-2 py-0.5 rounded-full">Aktif</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">
                                            Sidebar selalu terbuka penuh menampilkan ikon dan label teks menu lengkap.
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setData('default_sidebar_state', 'collapsed')}
                                    className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                        data.default_sidebar_state === 'collapsed'
                                            ? 'border-gray-900 bg-gray-100/70 shadow-xs ring-2 ring-gray-900/10'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-lg shrink-0 ${
                                        data.default_sidebar_state === 'collapsed'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        <PanelLeftClose className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-900">Collapsed (Tertutup / Mini)</span>
                                            {data.default_sidebar_state === 'collapsed' && (
                                                <span className="text-[10px] font-extrabold text-gray-800 bg-gray-200 px-2 py-0.5 rounded-full">Aktif</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">
                                            Sidebar tampil ringkas hanya berupa ikon saja, memaksimalkan area konten tabel dan formulir.
                                        </p>
                                    </div>
                                </button>
                            </div>
                            <InputError message={errors.default_sidebar_state} />
                        </div>

                        {/* Section 3: Default Invoice Period Checkbox */}
                        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
                            <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-gray-900" />
                                <Label className="text-sm font-bold text-gray-900">
                                    Default Tampilkan Periode pada Buat Invoice
                                </Label>
                            </div>
                            <p className="text-xs text-gray-500">
                                Tentukan apakah opsi "Tampilkan Periode" saat pembuatan invoice baru secara otomatis dicentang (aktif) atau tidak dicentang (non-aktif).
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 w-full">
                                <button
                                    type="button"
                                    onClick={() => setData('default_invoice_show_period', true)}
                                    className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                        data.default_invoice_show_period === true
                                            ? 'border-gray-900 bg-gray-100/70 shadow-xs ring-2 ring-gray-900/10'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-lg shrink-0 ${
                                        data.default_invoice_show_period === true
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        <CalendarCheck className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-900">Otomatis Dicentang (Default)</span>
                                            {data.default_invoice_show_period === true && (
                                                <span className="text-[10px] font-extrabold text-gray-800 bg-gray-200 px-2 py-0.5 rounded-full">Aktif</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">
                                            Checkbox "Tampilkan Periode" otomatis tercentang saat membuka form pembuatan invoice baru.
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setData('default_invoice_show_period', false)}
                                    className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                        data.default_invoice_show_period === false
                                            ? 'border-gray-900 bg-gray-100/70 shadow-xs ring-2 ring-gray-900/10'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-lg shrink-0 ${
                                        data.default_invoice_show_period === false
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        <CalendarX className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-900">Tidak Dicentang</span>
                                            {data.default_invoice_show_period === false && (
                                                <span className="text-[10px] font-extrabold text-gray-800 bg-gray-200 px-2 py-0.5 rounded-full">Aktif</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">
                                            Checkbox "Tampilkan Periode" dimulai dalam keadaan tidak dicentang (off). User dapat mencentangnya manual jika diperlukan.
                                        </p>
                                    </div>
                                </button>
                            </div>
                            <InputError message={errors.default_invoice_show_period} />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center gap-3">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-gray-900 hover:bg-black text-white font-semibold text-xs px-6 h-9"
                            >
                                {processing && <span className="mr-2 animate-spin">●</span>}
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan Sistem'}
                            </Button>

                            {recentlySuccessful && (
                                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                    <Check className="h-3.5 w-3.5" />
                                    Tersimpan
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
