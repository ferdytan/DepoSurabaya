import Heading from '@/components/heading';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Building2,
    Check,
    Coins,
    Edit2,
    ExternalLink,
    Filter,
    Package,
    Plus,
    Search,
    Sparkles,
    Tag,
    Trash2,
    Users,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface CustomerSummary {
    id: number;
    name: string;
    city?: string | null;
    phone?: string | null;
    products_count?: number;
}

interface ProductItem {
    id: number;
    service_type: string;
    description?: string | null;
    requires_temperature: boolean;
    master_price?: number | string | null;
    master_price_20ft?: number | string | null;
    master_price_40ft?: number | string | null;
    master_price_45ft?: number | string | null;
    master_price_global?: number | string | null;
    has_custom_price: boolean;
    custom_price?: number | string | null;
    custom_price_20ft?: number | string | null;
    custom_price_40ft?: number | string | null;
    custom_price_45ft?: number | string | null;
    custom_global_price?: number | string | null;
    custom_updated_at?: string | null;
}

interface PageProps {
    all_customers: CustomerSummary[];
    selected_customer: CustomerSummary | null;
    products: ProductItem[];
    customers_with_special_prices: CustomerSummary[];
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

function formatRupiah(val?: number | string | null): string {
    if (val === undefined || val === null || val === '') return '-';
    const num = Number(val);
    if (isNaN(num) || num === 0) return '-';
    return `Rp ${num.toLocaleString('id-ID')}`;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Harga Khusus Customer', href: '/special-prices' },
];

export default function SpecialPricesIndex({
    all_customers = [],
    selected_customer = null,
    products = [],
    customers_with_special_prices = [],
}: PageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOnlyCustom, setFilterOnlyCustom] = useState(false);

    // Modal state for Add / Edit Special Price
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

    // Modal state for Delete
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);

    // Form for setting special price
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        price: '',
        price_20ft: '',
        price_40ft: '',
        price_45ft: '',
        price_global: '',
    });

    const handleSelectCustomer = (customerId: string) => {
        if (!customerId) return;
        router.get(route('special-prices.index', { customer_id: customerId }), {}, { preserveState: true });
    };

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        reset();
        setData({
            product_id: '',
            price: '',
            price_20ft: '',
            price_40ft: '',
            price_45ft: '',
            price_global: '',
        });
        setModalOpen(true);
    };

    const handleOpenEditModal = (product: ProductItem) => {
        setEditingProduct(product);
        const pVal = product.custom_price 
            ?? product.custom_global_price 
            ?? product.custom_price_20ft 
            ?? product.custom_price_40ft 
            ?? product.custom_price_45ft 
            ?? '';
        setData({
            product_id: product.id.toString(),
            price: pVal ? String(pVal) : '',
            price_20ft: pVal ? String(pVal) : '',
            price_40ft: pVal ? String(pVal) : '',
            price_45ft: pVal ? String(pVal) : '',
            price_global: pVal ? String(pVal) : '',
        });
        setModalOpen(true);
    };

    const handleSubmitSpecialPrice = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected_customer) return;

        post(route('special-prices.store', selected_customer.id), {
            onSuccess: () => {
                setModalOpen(false);
                reset();
            },
        });
    };

    const handleConfirmDelete = () => {
        if (!selected_customer || !productToDelete) return;

        router.delete(
            route('special-prices.destroy', {
                customer: selected_customer.id,
                product: productToDelete.id,
            }),
            {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setProductToDelete(null);
                },
            },
        );
    };

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch = p.service_type.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCustom = filterOnlyCustom ? p.has_custom_price : true;
            return matchesSearch && matchesCustom;
        });
    }, [products, searchTerm, filterOnlyCustom]);

    const customProductsCount = useMemo(() => {
        return products.filter((p) => p.has_custom_price).length;
    }, [products]);

    const targetProductForModal = useMemo(() => {
        if (editingProduct) return editingProduct;
        if (data.product_id) {
            return products.find((p) => p.id.toString() === data.product_id) || null;
        }
        return null;
    }, [editingProduct, data.product_id, products]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Harga Khusus Customer" />

            <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8 pb-16">
                {/* Header Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <Tag className="h-7 w-7 text-gray-900" />
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Manajemen Harga Khusus Customer
                            </h1>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Atur harga kesepakatan khusus per customer. Order dari customer terpilih akan otomatis menggunakan tarif khusus ini daripada tarif Master.
                        </p>
                    </div>

                    {selected_customer && (
                        <Button
                            onClick={handleOpenAddModal}
                            className="h-9 text-xs px-4 bg-gray-900 hover:bg-black text-white font-semibold gap-1.5 shadow-sm self-start sm:self-auto"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Tarif Khusus
                        </Button>
                    )}
                </div>

                {/* Customer Selector Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="w-full md:max-w-md space-y-1.5">
                            <Label htmlFor="customer_select" className="text-xs font-bold text-gray-700">
                                Pilih Customer untuk Dikelola Harganya <span className="text-red-500">*</span>
                            </Label>
                            <SearchableSelect
                                options={all_customers.map((c) => ({
                                    value: c.id.toString(),
                                    label: `${c.name}${c.city ? ` (${c.city})` : ''}`,
                                }))}
                                value={selected_customer ? selected_customer.id.toString() : ''}
                                onChange={handleSelectCustomer}
                                placeholder="Cari nama customer..."
                                searchPlaceholder="Ketik nama customer..."
                            />
                        </div>

                        {selected_customer && (
                            <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                                <div className="text-right">
                                    <div className="text-xs text-gray-400">Total Tarif Khusus</div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {customProductsCount} <span className="text-xs font-normal text-gray-500">dari {products.length} Layanan</span>
                                    </div>
                                </div>
                                <span className="h-8 w-px bg-gray-200" />
                                <Button variant="outline" size="sm" asChild className="h-8 text-xs px-2.5">
                                    <Link href={`/customers/${selected_customer.id}/edit`}>
                                        <ExternalLink className="h-3.5 w-3.5 mr-1 text-gray-500" />
                                        Profil Customer
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                {selected_customer ? (
                    <div className="space-y-4">
                        {/* Filter & Search Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari layanan produk..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 h-9 text-xs"
                                    />
                                </div>
                                <Button
                                    variant={filterOnlyCustom ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterOnlyCustom(!filterOnlyCustom)}
                                    className={`h-9 text-xs gap-1.5 font-medium ${
                                        filterOnlyCustom ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''
                                    }`}
                                >
                                    <Filter className="h-3.5 w-3.5" />
                                    {filterOnlyCustom ? 'Semua Produk' : 'Hanya yang Ada Harga Khusus'}
                                </Button>
                            </div>

                            <div className="text-xs text-gray-500">
                                Menampilkan <span className="font-semibold text-gray-900">{filteredProducts.length}</span> layanan
                            </div>
                        </div>

                        {/* Table */}
                        <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-gray-50/75">
                                        <TableRow>
                                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 pl-5 min-w-[180px]">
                                                Layanan Produk
                                            </TableHead>
                                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 text-center w-28">
                                                Status
                                            </TableHead>
                                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 text-right w-40 px-4">
                                                Tarif Master (Rp)
                                            </TableHead>
                                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 text-right w-44 px-4">
                                                Harga Khusus (Rp)
                                            </TableHead>
                                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 min-w-[160px] pl-6">
                                                Keterangan
                                            </TableHead>
                                            <TableHead className="font-semibold text-xs text-gray-700 py-3.5 text-right pr-5 w-24">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProducts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="py-12 text-center text-xs text-gray-500">
                                                    <div className="flex flex-col items-center justify-center space-y-2">
                                                        <Package className="h-8 w-8 text-gray-300" />
                                                        <span>Tidak ada produk yang sesuai dengan filter.</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredProducts.map((p) => {
                                                const mPrice = p.master_price ?? p.master_price_global ?? p.master_price_20ft ?? p.master_price_40ft ?? p.master_price_45ft;
                                                const cPrice = p.custom_price ?? p.custom_global_price ?? p.custom_price_20ft ?? p.custom_price_40ft ?? p.custom_price_45ft;
                                                const hasCustom = p.has_custom_price && cPrice !== null && cPrice !== undefined && Number(cPrice) > 0;

                                                return (
                                                    <TableRow
                                                        key={p.id}
                                                        className={`transition-colors ${
                                                            hasCustom
                                                                ? 'bg-blue-50/30 hover:bg-blue-50/50'
                                                                : 'hover:bg-gray-50/60'
                                                        }`}
                                                    >
                                                        <TableCell className="py-3.5 pl-5 font-semibold text-xs text-gray-900">
                                                            {p.service_type}
                                                        </TableCell>
                                                        <TableCell className="py-3.5 text-center">
                                                            {hasCustom ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                                                    <Sparkles className="h-3 w-3" />
                                                                    Khusus
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                                    Master
                                                                </span>
                                                            )}
                                                        </TableCell>

                                                        {/* Tarif Master */}
                                                        <TableCell className="py-3.5 text-right px-4 text-xs">
                                                            {mPrice && Number(mPrice) > 0 ? (
                                                                <span className="font-semibold text-gray-800">
                                                                    {formatRupiah(mPrice)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-300 font-normal select-none">-</span>
                                                            )}
                                                        </TableCell>

                                                        {/* Harga Khusus */}
                                                        <TableCell className="py-3.5 text-right px-4 text-xs">
                                                            {hasCustom ? (
                                                                <div className="flex flex-col items-end gap-0.5">
                                                                    <span className="font-bold text-blue-700 text-sm">
                                                                        {formatRupiah(cPrice)}
                                                                    </span>
                                                                    {mPrice && Number(mPrice) > 0 && Number(mPrice) !== Number(cPrice) && (
                                                                        <span className="text-[10px] text-gray-400 line-through">
                                                                            Master: {formatRupiah(mPrice)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 font-normal text-xs italic">Sesuai Master</span>
                                                            )}
                                                        </TableCell>

                                                        {/* Keterangan */}
                                                        <TableCell className="py-3.5 pl-6 text-xs text-gray-600 max-w-[200px] truncate">
                                                            {p.description || <span className="text-gray-300 font-normal select-none">-</span>}
                                                        </TableCell>

                                                        {/* Aksi */}
                                                        <TableCell className="py-3.5 text-right pr-5">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleOpenEditModal(p)}
                                                                    className="h-8 px-2.5 text-xs font-semibold gap-1 text-gray-700 hover:text-gray-900"
                                                                >
                                                                    <Edit2 className="h-3 w-3" />
                                                                    {p.has_custom_price ? 'Edit' : 'Atur'}
                                                                </Button>

                                                                {p.has_custom_price && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setProductToDelete(p);
                                                                            setDeleteModalOpen(true);
                                                                        }}
                                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                                                                        title="Reset ke Tarif Master"
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
                        <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="font-semibold text-gray-900">Belum ada customer yang dipilih</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Silakan pilih customer pada menu di atas untuk mengelola harga khusus.
                        </p>
                    </div>
                )}

                {/* Customer List with Special Prices Overview */}
                {customers_with_special_prices.length > 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                Customer dengan Tarif Khusus Aktif ({customers_with_special_prices.length})
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {customers_with_special_prices.map((cust) => {
                                const isCurrent = selected_customer?.id === cust.id;
                                return (
                                    <button
                                        key={cust.id}
                                        type="button"
                                        onClick={() => handleSelectCustomer(cust.id.toString())}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                                            isCurrent
                                                ? 'border-gray-900 bg-gray-900 text-white shadow-xs'
                                                : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-white'
                                        }`}
                                    >
                                        <span>{cust.name}</span>
                                        <span
                                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                                isCurrent ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                                            }`}
                                        >
                                            {cust.products_count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Add / Edit Special Price */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:max-w-xl p-6">
                    <DialogHeader className="pb-3 border-b border-gray-100">
                        <div>
                            <DialogTitle className="text-base font-bold text-gray-900">
                                {editingProduct ? 'Edit Tarif Khusus Customer' : 'Tambah Tarif Khusus Customer'}
                            </DialogTitle>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Customer: <strong className="text-gray-800">{selected_customer?.name}</strong>
                            </p>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleSubmitSpecialPrice} className="space-y-4 pt-2">
                        {/* Pilih Produk (jika mode tambah baru) */}
                        {!editingProduct ? (
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-700">
                                    Pilih Produk Layanan <span className="text-red-500">*</span>
                                </Label>
                                <SearchableSelect
                                    options={products.map((p) => ({
                                        value: p.id.toString(),
                                        label: `${p.service_type}${p.has_custom_price ? ' (Sudah ada harga khusus)' : ''}`,
                                    }))}
                                    value={data.product_id}
                                    onChange={(val) => {
                                        setData('product_id', val);
                                        const found = products.find((p) => p.id.toString() === val);
                                        if (found && found.has_custom_price) {
                                            const cVal = found.custom_price ?? found.custom_global_price ?? found.custom_price_20ft ?? found.custom_price_40ft ?? found.custom_price_45ft ?? '';
                                            setData({
                                                product_id: val,
                                                price: cVal ? String(cVal) : '',
                                                price_20ft: cVal ? String(cVal) : '',
                                                price_40ft: cVal ? String(cVal) : '',
                                                price_45ft: cVal ? String(cVal) : '',
                                                price_global: cVal ? String(cVal) : '',
                                            });
                                        }
                                    }}
                                    placeholder="Pilih produk layanan..."
                                    searchPlaceholder="Ketik nama produk..."
                                />
                                {errors.product_id && <p className="text-xs text-red-500">{errors.product_id}</p>}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-3 flex items-center justify-between">
                                <div>
                                    <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Produk Layanan</div>
                                    <div className="text-sm font-bold text-gray-900 mt-0.5">{editingProduct.service_type}</div>
                                    {editingProduct.description && (
                                        <div className="text-xs text-gray-500 mt-0.5">{editingProduct.description}</div>
                                    )}
                                </div>
                                {editingProduct.requires_temperature ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <Check className="h-3 w-3" /> Rekam Suhu
                                    </span>
                                ) : null}
                            </div>
                        )}

                        {/* Card Section: Tarif Harga Khusus */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
                            <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                                <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                    <Coins className="h-4 w-4 text-emerald-600" />
                                    <span>Tarif Khusus Customer</span>
                                </div>
                                <span className="text-[11px] text-gray-500">Kosongkan jika ingin kembali ke tarif master</span>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modal_price" className="text-xs font-semibold text-gray-700">
                                    Harga Khusus (Rp)
                                </Label>
                                <div className="relative max-w-sm">
                                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-gray-400 select-none">
                                        Rp
                                    </span>
                                    <Input
                                        id="modal_price"
                                        type="number"
                                        min={0}
                                        value={data.price}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setData((prev) => ({
                                                ...prev,
                                                price: val,
                                                price_global: val,
                                                price_20ft: val,
                                                price_40ft: val,
                                                price_45ft: val,
                                            }));
                                        }}
                                        placeholder="0"
                                        className="h-10 text-sm pl-9 font-semibold text-gray-900 focus:border-blue-500"
                                        disabled={processing}
                                    />
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-2 pt-1">
                                    <span>Tarif Master Produk:</span>
                                    <span className="font-semibold text-gray-800">
                                        {formatRupiah(targetProductForModal?.master_price ?? targetProductForModal?.master_price_global)}
                                    </span>
                                </div>
                                {errors.price && <p className="text-[11px] text-red-500">{errors.price}</p>}
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setModalOpen(false)}
                                className="h-9 text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.product_id}
                                className="h-9 text-xs bg-gray-900 hover:bg-black text-white font-semibold shadow-xs"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Harga Khusus'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Harga Khusus?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Harga khusus untuk layanan{' '}
                            <strong>{productToDelete?.service_type}</strong> pada customer{' '}
                            <strong>{selected_customer?.name}</strong> akan dihapus. Layanan ini akan kembali
                            menggunakan tarif standar Master Produk.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Hapus & Gunakan Tarif Master
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
