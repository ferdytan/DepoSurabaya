import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    Check,
    CheckCircle2,
    Image as ImageIcon,
    PanelLeft,
    PanelLeftClose,
    PanelLeftOpen,
    RefreshCcw,
    TableProperties,
} from 'lucide-react';
import React, { useState } from 'react';

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
        login_image_url: string;
        default_sidebar_state?: 'expanded' | 'collapsed';
    };
    default_login_image: string;
    status?: string;
}

const paginationOptions = [10, 25, 50, 100];

export default function SystemSettings({ settings, default_login_image, status }: SystemSettingsProps) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        default_pagination: settings.default_pagination || 25,
        login_image_url: settings.login_image_url || default_login_image,
        default_sidebar_state: settings.default_sidebar_state || 'expanded',
    });

    const [imgError, setImgError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('settings.system.update'), {
            preserveScroll: true,
        });
    };

    const handleResetImage = () => {
        setData('login_image_url', default_login_image);
        setImgError(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Sistem" />

            <SettingsLayout>
                <div className="space-y-8">
                    <div>
                        <HeadingSmall
                            title="Pengaturan Sistem & Tampilan"
                            description="Konfigurasikan jumlah data default per halaman, status default navbar (sidebar), dan gambar latar belakang layar login."
                        />
                    </div>

                    {status && (
                        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-800">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>{status}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Default Pagination */}
                        <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/60 p-5 sm:p-6">
                            <div className="flex items-center gap-2">
                                <TableProperties className="h-4 w-4 text-blue-600" />
                                <Label className="text-sm font-bold text-gray-900">
                                    Jumlah Baris Per Halaman Default
                                </Label>
                            </div>
                            <p className="text-xs text-gray-500">
                                Menentukan jumlah baris data default yang dimuat saat membuka daftar Order, User/Admin, dan tabel lainnya.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 max-w-2xl">
                                {paginationOptions.map((opt) => {
                                    const isSelected = Number(data.default_pagination) === opt;
                                    return (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setData('default_pagination', opt)}
                                            className={`flex flex-col items-center justify-center p-3.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xs ring-2 ring-blue-500/20'
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
                        <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/60 p-5 sm:p-6">
                            <div className="flex items-center gap-2">
                                <PanelLeft className="h-4 w-4 text-blue-600" />
                                <Label className="text-sm font-bold text-gray-900">
                                    Status Default Navbar / Sidebar
                                </Label>
                            </div>
                            <p className="text-xs text-gray-500">
                                Tentukan apakah bilah samping (sidebar menu) tampil terbuka penuh (expanded) atau tertutup/mini (collapsed) secara default saat membuka aplikasi.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 max-w-2xl">
                                <button
                                    type="button"
                                    onClick={() => setData('default_sidebar_state', 'expanded')}
                                    className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                        data.default_sidebar_state === 'expanded'
                                            ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-lg shrink-0 ${
                                        data.default_sidebar_state === 'expanded'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        <PanelLeftOpen className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-900">Expanded (Terbuka Penuh)</span>
                                            {data.default_sidebar_state === 'expanded' && (
                                                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Aktif</span>
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
                                            ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-lg shrink-0 ${
                                        data.default_sidebar_state === 'collapsed'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        <PanelLeftClose className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-900">Collapsed (Tertutup / Mini)</span>
                                            {data.default_sidebar_state === 'collapsed' && (
                                                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Aktif</span>
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

                        {/* Section 3: Login Screen Background Image */}
                        <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/60 p-5 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-blue-600" />
                                    <Label htmlFor="login_image_url" className="text-sm font-bold text-gray-900">
                                        URL Gambar Layar Login
                                    </Label>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleResetImage}
                                    className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                                >
                                    <RefreshCcw className="h-3 w-3" />
                                    Gunakan Gambar Default
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">
                                Masukkan tautan (URL) gambar bertema pelabuhan peti kemas atau depo (rekomendasi resolusi horizontal minimal 1600x1000 px).
                            </p>

                            <div className="space-y-2 max-w-2xl">
                                <Input
                                    id="login_image_url"
                                    type="url"
                                    value={data.login_image_url}
                                    onChange={(e) => {
                                        setData('login_image_url', e.target.value);
                                        setImgError(false);
                                    }}
                                    placeholder="https://images.unsplash.com/..."
                                    className="bg-white text-xs h-10 font-mono"
                                    required
                                />
                                <InputError message={errors.login_image_url} />
                            </div>

                            {/* Live Image Preview Card */}
                            <div className="space-y-2 pt-2">
                                <span className="text-xs font-semibold text-gray-700">Pratinjau Gambar Login:</span>
                                <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-lg border border-gray-200 bg-gray-900 shadow-xs">
                                    {imgError ? (
                                        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-xs text-red-400">
                                            <span>Gagal memuat gambar dari URL tersebut. Pastikan tautan gambar aktif dan dapat diakses publik.</span>
                                        </div>
                                    ) : (
                                        <>
                                            <img
                                                src={data.login_image_url}
                                                alt="Login Hero Preview"
                                                onError={() => setImgError(true)}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
                                                <span className="text-xs font-bold text-white tracking-wide">
                                                    PT. DEPO SURABAYA SEJAHTERA
                                                </span>
                                                <span className="text-[10px] text-gray-300">
                                                    Sistem Informasi & Manajemen Operasional Depo
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 h-9"
                            >
                                {processing && <span className="mr-2 animate-spin">●</span>}
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
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
