import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Check, CheckCircle2, Image as ImageIcon, RefreshCcw, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
    },
    {
        title: 'Gambar Layar Login',
        href: '/settings/login-image',
    },
];

interface LoginImageSettingsProps {
    settings: {
        login_image_url: string;
    };
    default_login_image: string;
    status?: string;
}

export default function LoginImageSettings({ settings, default_login_image, status }: LoginImageSettingsProps) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        login_image_url: settings.login_image_url || default_login_image,
    });

    const [imgError, setImgError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('settings.login-image.update'), {
            preserveScroll: true,
        });
    };

    const handleResetImage = () => {
        setData('login_image_url', default_login_image);
        setImgError(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Gambar Login" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4">
                        <div>
                            <HeadingSmall
                                title="Gambar Layar Login"
                                description="Atur gambar latar belakang (hero image) pada halaman masuk (login). Pengaturan ini hanya dapat diubah oleh peran Superadmin."
                            />
                        </div>
                        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-800 border border-gray-200">
                            <ShieldCheck className="h-3.5 w-3.5 text-gray-700" />
                            <span>Khusus Superadmin</span>
                        </div>
                    </div>

                    {status && (
                        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-800">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>{status}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-gray-900" />
                                    <Label htmlFor="login_image_url" className="text-sm font-bold text-gray-900">
                                        URL Gambar Latar Belakang Login
                                    </Label>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleResetImage}
                                    className="flex items-center gap-1 text-[11px] font-medium text-gray-700 hover:text-gray-900 hover:underline cursor-pointer"
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
                                <span className="text-xs font-semibold text-gray-700">Pratinjau Tampilan Layar Login:</span>
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
                        <div className="flex items-center gap-3">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-gray-900 hover:bg-black text-white font-semibold text-xs px-6 h-9"
                            >
                                {processing && <span className="mr-2 animate-spin">●</span>}
                                {processing ? 'Menyimpan...' : 'Simpan Gambar Login'}
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
