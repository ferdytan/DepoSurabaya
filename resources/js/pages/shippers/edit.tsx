import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import ShippersLayout from '@/layouts/shippers/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Truck } from 'lucide-react';

type Props = {
    shipper: {
        id: number;
        name: string;
        address: string | null;
        city: string | null;
        province: string | null;
        phone: string | null;
        email: string | null;
    };
};

export default function EditShipper({ shipper }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: shipper.name,
        address: shipper.address ?? '',
        city: shipper.city ?? '',
        province: shipper.province ?? '',
        phone: shipper.phone ?? '',
        email: shipper.email ?? '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Shipper Management', href: '/shippers' },
        { title: `Edit ${shipper.name}`, href: `/shippers/${shipper.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('shippers.update', shipper.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Shipper - ${shipper.name}`} />

            <ShippersLayout>
                <div className="mx-auto max-w-3xl space-y-6 pb-12">
                    {/* Header Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Truck className="h-7 w-7 text-gray-900" />
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    Edit Shipper: {shipper.name}
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Perbarui data profil dan kontak untuk shipper ini.
                            </p>
                        </div>

                        <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5 self-start sm:self-auto">
                            <Link href="/shippers">
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Card: Informasi Master Shipper */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-5">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                <Building2 className="h-5 w-5 text-gray-700" />
                                <h2 className="text-base font-bold text-gray-900">Informasi Shipper</h2>
                            </div>

                            {/* Nama & Email */}
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs font-semibold text-gray-700">
                                        Nama Shipper <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: PT. Tiga Rasa Indonesia"
                                        required
                                        className="h-10 text-xs"
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
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
                                        placeholder="Contoh: order@tigarasa.com"
                                        className="h-10 text-xs"
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>
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
                                    placeholder="Contoh: Jl. Kalianak Utara No. 88"
                                    className="h-10 text-xs"
                                />
                                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                            </div>

                            {/* Kota, Provinsi, & Telepon */}
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
                                    />
                                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
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
                                    />
                                    {errors.province && <p className="text-xs text-red-500">{errors.province}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">
                                        Nomor Telepon
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="Contoh: 08122224445"
                                        className="h-10 text-xs"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit & Batal Actions */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button variant="outline" asChild className="h-9 text-xs px-4">
                                <Link href="/shippers">Batal</Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-9 text-xs px-6 bg-gray-900 hover:bg-black text-white font-semibold gap-1.5 shadow-sm"
                            >
                                {processing && <span className="mr-1 animate-spin">●</span>}
                                {processing ? 'Memperbarui...' : 'Perbarui Shipper'}
                            </Button>
                        </div>
                    </form>
                </div>
            </ShippersLayout>
        </AppLayout>
    );
}
