import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CustomersLayout from '@/layouts/customers/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Building2, DollarSign, Search, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

type Product = {
    id: number;
    name: string;
};

type ProductPrice = {
    product_id: number;
    price_20ft: string;
    price_40ft: string;
    price_45ft: string;
    price_global: string;
};

interface PageProps {
    product_prices: ProductPrice[];
    products: Product[];
    customer: {
        id: number;
        name: string;
        address: string | null;
        city: string | null;
        province: string | null;
        phone: string | null;
        email: string | null;
    };
    [key: string]: unknown;
}

export default function EditCustomer() {
    const { customer, products, product_prices } = usePage<PageProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        name: customer.name,
        address: customer.address ?? '',
        city: customer.city ?? '',
        province: customer.province ?? '',
        phone: customer.phone ?? '',
        email: customer.email ?? '',
        product_prices: product_prices ?? [],
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<number[]>(product_prices.map((p) => p.product_id));

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Customer Management', href: '/customers' },
        { title: `Edit ${customer.name}`, href: `/customers/${customer.id}/edit` },
    ];

    const fetchProducts = async (keyword: string) => {
        try {
            const res = await fetch(route('products.search', { search: keyword }));
            const result = await res.json();
            setAvailableProducts(result);
        } catch (error) {
            console.error('Gagal mengambil produk:', error);
        }
    };

    useEffect(() => {
        fetchProducts('');
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchProducts(searchTerm);
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const handleAddProduct = (product: Product) => {
        if (selectedProducts.includes(product.id)) return;
        setSelectedProducts([...selectedProducts, product.id]);
        setData('product_prices', [
            ...data.product_prices,
            {
                product_id: product.id,
                price_20ft: '',
                price_40ft: '',
                price_45ft: '',
                price_global: '',
            },
        ]);
    };

    const handleRemoveProduct = (productId: number) => {
        if (!confirm('Yakin ingin menghapus produk ini dari daftar harga custom?')) return;
        setSelectedProducts(selectedProducts.filter((id) => id !== productId));
        setData(
            'product_prices',
            data.product_prices.filter((item) => item.product_id !== productId),
        );
    };

    const handlePriceChange = (index: number, field: 'price_20ft' | 'price_40ft' | 'price_45ft' | 'price_global', value: string) => {
        const updated = [...data.product_prices];
        updated[index][field] = value;
        setData('product_prices', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('customers.update', customer.id));
    };

    function formatNumber(value: string | number): string {
        if (!value) return '';
        const num = typeof value === 'number' ? value : parseInt(value.replace(/\D/g, ''), 10);
        if (isNaN(num)) return '';
        return num.toLocaleString('id-ID');
    }

    function parseNumber(value: string): string {
        return value.replace(/\D/g, '');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Customer: ${customer.name}`} />

            <CustomersLayout>
                <div className="mx-auto max-w-4xl space-y-6 pb-12">
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
                                Perbarui data profil customer dan penyesuaian tarif khusus per produk.
                            </p>
                        </div>

                        <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5 self-start sm:self-auto">
                            <Link href="/customers">
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Card 1: Informasi Master Customer */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-5">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                <Building2 className="h-5 w-5 text-gray-700" />
                                <h2 className="text-base font-bold text-gray-900">Informasi Customer</h2>
                            </div>

                            {/* Nama & Email */}
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs font-semibold text-gray-700">
                                        Nama Customer <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: PT. Sejuta Rasa"
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
                                        value={data.email ?? ''}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Contoh: order@perusahaan.com"
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
                                    value={data.address ?? ''}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Contoh: Jl. Kalianak Barat No. 12"
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
                                        value={data.city ?? ''}
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
                                        value={data.province ?? ''}
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
                                        value={data.phone ?? ''}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="Contoh: 081234567890"
                                        className="h-10 text-xs"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Pengaturan Tarif Khusus Produk */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-5">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                <DollarSign className="h-5 w-5 text-gray-700" />
                                <div>
                                    <h2 className="text-base font-bold text-gray-900">
                                        Tarif Kustom Produk (Opsional)
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Atur harga khusus customer ini per produk. Kolom 20', 40', dan 45' untuk layanan kontainer; kolom Global (Flat) untuk tarif flat.
                                    </p>
                                </div>
                            </div>

                            {/* Pencarian Produk */}
                            <div className="space-y-1.5">
                                <Label htmlFor="product-search" className="text-xs font-semibold text-gray-700">
                                    Cari & Tambah Produk
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="product-search"
                                        placeholder="Ketik nama produk / layanan untuk ditambahkan ke tarif khusus..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 h-10 text-xs"
                                    />
                                </div>
                            </div>

                            {/* Daftar Hasil Pencarian Produk */}
                            <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/50 p-2 divide-y divide-gray-100">
                                {availableProducts.length > 0 ? (
                                    availableProducts.map((product) => {
                                        const isAdded = selectedProducts.includes(product.id);
                                        return (
                                            <div
                                                key={product.id}
                                                className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors"
                                            >
                                                <span className="text-xs font-semibold text-gray-800">
                                                    {product.name}
                                                </span>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={isAdded ? 'destructive' : 'default'}
                                                    onClick={() => (isAdded ? handleRemoveProduct(product.id) : handleAddProduct(product))}
                                                    className={`h-7 text-xs px-3 font-semibold ${
                                                        !isAdded ? 'bg-gray-900 hover:bg-black text-white' : ''
                                                    }`}
                                                >
                                                    {isAdded ? 'Hapus' : '+ Tambah'}
                                                </Button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-3 text-center text-xs text-gray-400">
                                        {searchTerm ? 'Produk tidak ditemukan.' : 'Ketik nama produk untuk mencari.'}
                                    </div>
                                )}
                            </div>

                            {/* Tabel Tarif Khusus Terpilih */}
                            {data.product_prices.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-800">
                                            Daftar Tarif Produk Khusus ({data.product_prices.length} Produk)
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50/75">
                                                <tr>
                                                    <th className="px-3.5 py-3 text-left text-xs font-semibold text-gray-700">Produk</th>
                                                    <th className="px-3.5 py-3 text-right text-xs font-semibold text-gray-700">20' (Rp)</th>
                                                    <th className="px-3.5 py-3 text-right text-xs font-semibold text-gray-700">40' (Rp)</th>
                                                    <th className="px-3.5 py-3 text-right text-xs font-semibold text-gray-700">45' (Rp)</th>
                                                    <th className="px-3.5 py-3 text-right text-xs font-semibold text-gray-700">Global Flat (Rp)</th>
                                                    <th className="px-3.5 py-3 text-center text-xs font-semibold text-gray-700 w-12">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 bg-white">
                                                {data.product_prices.map((item, index) => (
                                                    <tr key={item.product_id} className="hover:bg-gray-50/50">
                                                        <td className="px-3.5 py-2.5 text-xs font-semibold text-gray-900 whitespace-nowrap">
                                                            {products.find((p) => p.id === item.product_id)?.name ||
                                                                `Produk ID ${item.product_id}`}
                                                        </td>
                                                        <td className="px-2 py-2 text-right">
                                                            <Input
                                                                type="text"
                                                                inputMode="numeric"
                                                                value={formatNumber(item.price_20ft)}
                                                                onChange={(e) => handlePriceChange(index, 'price_20ft', parseNumber(e.target.value))}
                                                                placeholder="0"
                                                                className="h-8 text-xs text-right font-medium"
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 text-right">
                                                            <Input
                                                                type="text"
                                                                inputMode="numeric"
                                                                value={formatNumber(item.price_40ft)}
                                                                onChange={(e) => handlePriceChange(index, 'price_40ft', parseNumber(e.target.value))}
                                                                placeholder="0"
                                                                className="h-8 text-xs text-right font-medium"
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 text-right">
                                                            <Input
                                                                type="text"
                                                                inputMode="numeric"
                                                                value={formatNumber(item.price_45ft)}
                                                                onChange={(e) => handlePriceChange(index, 'price_45ft', parseNumber(e.target.value))}
                                                                placeholder="0"
                                                                className="h-8 text-xs text-right font-medium"
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 text-right">
                                                            <Input
                                                                type="text"
                                                                inputMode="numeric"
                                                                value={formatNumber(item.price_global)}
                                                                onChange={(e) => handlePriceChange(index, 'price_global', parseNumber(e.target.value))}
                                                                placeholder="0"
                                                                className="h-8 text-xs text-right font-medium"
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveProduct(item.product_id)}
                                                                title="Hapus tarif produk ini"
                                                                className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit & Batal Actions */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button variant="outline" asChild className="h-9 text-xs px-4">
                                <Link href="/customers">Batal</Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-9 text-xs px-6 bg-gray-900 hover:bg-black text-white font-semibold gap-1.5 shadow-sm"
                            >
                                {processing && <span className="mr-1 animate-spin">●</span>}
                                {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </CustomersLayout>
        </AppLayout>
    );
}

