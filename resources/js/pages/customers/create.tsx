import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CustomersLayout from '@/layouts/customers/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Building2, Sparkles, UserPlus, Users } from 'lucide-react';
import React from 'react';

interface PageProps {
    return_url?: string;
    [key: string]: unknown;
}

export default function CreateCustomer() {
    const pageProps = usePage<PageProps>().props;
    const returnUrl = pageProps.return_url || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('return_url') : null) || '/customers';

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        city: '',
        province: '',
        phone: '',
        email: '',
        return_url: returnUrl,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Customer Management', href: returnUrl },
        { title: 'Tambah Customer', href: '/customers/create' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('customers.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Customer Baru" />

            <CustomersLayout>
                <div className="w-full max-w-4xl space-y-6 pb-12">
                    {/* Header Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Users className="h-7 w-7 text-gray-900" />
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    Tambah Customer Baru
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Daftarkan customer baru untuk depo. Semua customer dapat langsung menggunakan seluruh produk layanan master.
                            </p>
                        </div>

                        <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5 self-start sm:self-auto">
                            <Link href={returnUrl}>
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>

                    {/* Notice Banner */}
                    <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900 flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-blue-950">
                                Sistem Tarif Universal Aktif
                            </p>
                            <p className="mt-0.5 text-blue-800 leading-relaxed">
                                Anda tidak perlu lagi memilih produk dan tarif satu per satu. Customer baru ini dapat langsung memesan seluruh produk layanan dengan tarif master. Jika customer ini memerlukan harga kesepakatan khusus, Anda dapat mengaturnya di menu <strong>Harga Khusus</strong> kapan saja.
                            </p>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-6">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-900">
                                <UserPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Profil & Informasi Kontak Customer</h3>
                                <p className="text-xs text-gray-500">Lengkapi data identitas dan kontak customer di bawah ini</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nama Customer */}
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-semibold text-gray-700">
                                    Nama Customer / Perusahaan <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: PT Samudera Logistik Indonesia"
                                    required
                                    className="h-10 text-xs"
                                    disabled={processing}
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Alamat */}
                            <div className="space-y-1.5">
                                <Label htmlFor="address" className="text-xs font-semibold text-gray-700">
                                    Alamat Lengkap
                                </Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Contoh: Jl. Tanjung Perak Timur No. 123"
                                    className="h-10 text-xs"
                                    disabled={processing}
                                />
                                <InputError message={errors.address} />
                            </div>

                            {/* Kota & Provinsi */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="city" className="text-xs font-semibold text-gray-700">
                                        Kota
                                    </Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="Contoh: Surabaya"
                                        className="h-10 text-xs"
                                        disabled={processing}
                                    />
                                    <InputError message={errors.city} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="province" className="text-xs font-semibold text-gray-700">
                                        Provinsi
                                    </Label>
                                    <Input
                                        id="province"
                                        name="province"
                                        value={data.province}
                                        onChange={(e) => setData('province', e.target.value)}
                                        placeholder="Contoh: Jawa Timur"
                                        className="h-10 text-xs"
                                        disabled={processing}
                                    />
                                    <InputError message={errors.province} />
                                </div>
                            </div>

                            {/* Telepon & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">
                                        Nomor Telepon
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="Contoh: 081234567890 / 031-123456"
                                        className="h-10 text-xs"
                                        disabled={processing}
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                                        Alamat Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Contoh: contact@samudera.com"
                                        className="h-10 text-xs"
                                        disabled={processing}
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            {/* Submit & Cancel Actions */}
                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 border-t border-gray-100">
                                <Button variant="outline" asChild className="h-10 sm:h-9 text-xs font-semibold px-4 w-full sm:w-auto justify-center">
                                    <Link href={returnUrl}>Batal</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-10 sm:h-9 text-xs px-6 bg-gray-900 hover:bg-black text-white font-semibold gap-1.5 shadow-sm w-full sm:w-auto justify-center"
                                >
                                    {processing && <span className="mr-1 animate-spin">●</span>}
                                    {processing ? 'Menyimpan Customer...' : 'Simpan Customer Baru'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </CustomersLayout>
        </AppLayout>
    );
}
