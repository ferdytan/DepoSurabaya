import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CustomersLayout from '@/layouts/customers/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit2, ExternalLink, Tag, Users } from 'lucide-react';
import React from 'react';

interface PageProps {
    customer: {
        id: number;
        name: string;
        address: string | null;
        city: string | null;
        province: string | null;
        phone: string | null;
        email: string | null;
    };
    special_prices_count?: number;
    return_url?: string;
    [key: string]: unknown;
}

export default function EditCustomer() {
    const pageProps = usePage<PageProps>().props;
    const { customer, special_prices_count = 0 } = pageProps;
    const returnUrl = pageProps.return_url || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('return_url') : null) || '/customers';

    const { data, setData, put, processing, errors } = useForm({
        name: customer.name,
        address: customer.address ?? '',
        city: customer.city ?? '',
        province: customer.province ?? '',
        phone: customer.phone ?? '',
        email: customer.email ?? '',
        return_url: returnUrl,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Customer Management', href: returnUrl },
        { title: `Edit ${customer.name}`, href: `/customers/${customer.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('customers.update', customer.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Customer: ${customer.name}`} />

            <CustomersLayout>
                <div className="w-full max-w-4xl space-y-6 pb-12">
                    {/* Header Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Users className="h-7 w-7 text-gray-900" />
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    Edit Customer: {customer.name}
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Perbarui data profil customer dan kontak perusahaan.
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5 self-start sm:self-auto">
                            <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5">
                                <Link href={returnUrl}>
                                    <ArrowLeft className="h-4 w-4" />
                                    Kembali
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Special Price Quick Action Card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                                <Tag className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-gray-900">
                                        Pengaturan Harga Khusus
                                    </h4>
                                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
                                        {special_prices_count} Produk Khusus
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {special_prices_count > 0
                                        ? 'Customer ini memiliki tarif kesepakatan khusus yang berbeda dari Master Produk.'
                                        : 'Customer ini saat ini menggunakan tarif standar dari Master Produk untuk seluruh layanan.'}
                                </p>
                            </div>
                        </div>

                        <Button size="sm" asChild className="h-9 text-xs px-4 bg-gray-900 hover:bg-black text-white font-medium gap-1.5 shrink-0">
                            <Link href={`/special-prices?customer_id=${customer.id}`}>
                                <Tag className="h-3.5 w-3.5" />
                                Kelola Harga Khusus
                                <ExternalLink className="h-3 w-3 ml-0.5 opacity-60" />
                            </Link>
                        </Button>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-6">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-900">
                                <Edit2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Profil & Informasi Kontak Customer</h3>
                                <p className="text-xs text-gray-500">Sesuaikan data identitas dan kontak customer sesuai kebutuhan</p>
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
                                    {processing ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </CustomersLayout>
        </AppLayout>
    );
}
