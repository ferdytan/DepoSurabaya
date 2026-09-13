import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import ProductsLayout from '@/layouts/products/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit2, Package } from 'lucide-react';
import React from 'react';

// Tipe Props
interface PageProps {
    product: {
        id: number;
        service_type: string;
        description: string | null;
        requires_temperature: number; // 0 atau 1
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Produk',
        href: '/products',
    },
    {
        title: 'Edit Produk',
        href: '#',
    },
];

export default function EditProduct() {
    const { product } = usePage<PageProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        service_type: product.service_type,
        description: product.description ?? '',
        requires_temperature: Number(product.requires_temperature),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Produk: ${product.service_type}`} />

            <ProductsLayout>
                <div className="w-full space-y-6 pb-12">
                    {/* Header Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Package className="h-7 w-7 text-gray-900" />
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    Edit Produk: {product.service_type}
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Perbarui informasi nama layanan, status rekam suhu, atau keterangan layanan.
                            </p>
                        </div>

                        <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5 self-start sm:self-auto">
                            <Link href="/products">
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>

                    {/* Form Card */}
                    <div className="max-w-3xl rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-6">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-900">
                                <Edit2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Perbarui Data Produk Layanan</h3>
                                <p className="text-xs text-gray-500">Sesuaikan data produk layanan sesuai kebutuhan</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Jenis Layanan */}
                            <div className="space-y-1.5">
                                <Label htmlFor="service_type" className="text-xs font-semibold text-gray-700">
                                    Jenis Layanan <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="service_type"
                                    name="service_type"
                                    value={data.service_type}
                                    onChange={(e) => setData('service_type', e.target.value)}
                                    placeholder="Contoh: Biaya LoLo Full / Plug In Temperature"
                                    required
                                    className="h-10 text-xs"
                                    disabled={processing}
                                />
                                <InputError message={errors.service_type} />
                            </div>

                            {/* Rekam Suhu Switch */}
                            <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="record_temperature" className="text-xs font-bold text-gray-900 cursor-pointer">
                                            Wajib Rekam Suhu (Temperature Tracking)
                                        </Label>
                                        <p className="text-[11px] text-gray-500">
                                            Aktifkan bila kontainer yang menggunakan layanan ini memerlukan pencatatan & monitoring suhu berkala.
                                        </p>
                                    </div>
                                    <Switch
                                        id="record_temperature"
                                        checked={data.requires_temperature === 1}
                                        onCheckedChange={(checked: boolean) => setData('requires_temperature', checked ? 1 : 0)}
                                        disabled={processing}
                                    />
                                </div>
                                <InputError message={errors.requires_temperature} />
                            </div>

                            {/* Keterangan */}
                            <div className="space-y-1.5">
                                <Label htmlFor="description" className="text-xs font-semibold text-gray-700">
                                    Keterangan
                                </Label>
                                <Input
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Contoh: Lift On & Lift Off Kontainer"
                                    className="h-10 text-xs"
                                    disabled={processing}
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Submit & Cancel Actions */}
                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                                <Button variant="outline" asChild className="h-9 text-xs font-semibold px-4">
                                    <Link href="/products">Batal</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-9 text-xs px-6 bg-gray-900 hover:bg-black text-white font-semibold gap-1.5 shadow-sm"
                                >
                                    {processing && <span className="mr-1 animate-spin">●</span>}
                                    {processing ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </ProductsLayout>
        </AppLayout>
    );
}
