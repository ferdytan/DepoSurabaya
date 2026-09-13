import AppLayout from '@/layouts/app-layout';
import ProductsLayout from '@/layouts/products/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

// UI Components
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
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp, ArrowUpDown, Check, ChevronLeft, ChevronRight, Package, Pencil, Plus, Search, Trash2 } from 'lucide-react';

// Types
interface FlashProps {
    success?: string;
    error?: string;
}

interface PageProps {
    [key: string]: unknown;
    flash?: FlashProps;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

type SortButtonProps = {
    label: string;
    field: string;
    currentSort?: string;
    currentDir?: string;
    trashed?: string;
    search?: string;
};

type Product = {
    id: number;
    service_type: string;
    description: string | null;
    requires_temperature: number;
};

type Props = {
    products: {
        data: Product[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        from?: number | null;
        to?: number | null;
        total?: number;
    };
    filters: {
        search?: string;
        sort_by?: string;
        sort_dir?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Produk',
        href: '/products',
    },
];

const SortButton = ({ label, field, currentSort, currentDir, trashed, search }: SortButtonProps) => {
    const direction = currentSort === field ? (currentDir === 'asc' ? 'desc' : 'asc') : 'asc';

    return (
        <Link
            href={route('products.index', {
                sort_by: field,
                sort_dir: direction,
                trashed,
                search,
            })}
            className="flex items-center gap-1 font-semibold text-xs text-gray-700 hover:text-black"
        >
            {label}
            {currentSort === field ? (
                currentDir === 'asc' ? (
                    <ArrowUp className="h-3.5 w-3.5" />
                ) : (
                    <ArrowDown className="h-3.5 w-3.5" />
                )
            ) : (
                <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
            )}
        </Link>
    );
};

export default function ProductsIndex({ products, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null);

    const { props } = usePage<PageProps>();

    const handleSearch = () => {
        router.get('/products', {
            search,
            sort_by: filters.sort_by,
            sort_dir: filters.sort_dir,
        });
    };

    const handleDeleteClick = (id: number) => {
        setProductIdToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (productIdToDelete !== null) {
            router.delete(`/products/${productIdToDelete}`);
        }
        setDeleteModalOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Produk" />

            <ProductsLayout>
                <div className="w-full space-y-6 pb-12">
                    {/* Flash Message */}
                    {props.flash?.success && (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 font-medium">
                            {props.flash.success}
                        </div>
                    )}
                    {props.flash?.error && (
                        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-800 font-medium">
                            {props.flash.error}
                        </div>
                    )}

                    {/* Header Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Package className="h-7 w-7 text-gray-900" />
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    Master Produk & Layanan
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Kelola katalog jenis layanan depo, integrasi pencatatan rekam suhu, dan keterangan operasional.
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                            <Button size="sm" asChild className="bg-gray-900 hover:bg-black text-white gap-1.5 h-9 text-xs font-semibold px-4 shadow-sm">
                                <Link href="/products/create">
                                    <Plus className="h-4 w-4" />
                                    <span>Tambah Produk</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Unified Search Bar Card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Cari berdasarkan jenis layanan... (Tekan Enter)"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-9 h-9 text-xs"
                                />
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button
                                    size="sm"
                                    onClick={handleSearch}
                                    className="h-9 text-xs px-4 bg-gray-900 hover:bg-black text-white gap-1.5 font-medium shadow-xs"
                                >
                                    <Search className="h-3.5 w-3.5" />
                                    Cari
                                </Button>
                                {search && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSearch('');
                                            router.get('/products');
                                        }}
                                        className="h-9 text-xs px-3"
                                    >
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modern Data Table */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50/75">
                                    <TableRow>
                                        <TableHead className="font-semibold text-xs text-gray-700 py-3.5 pl-5">
                                            <SortButton
                                                label="Jenis Layanan"
                                                field="service_type"
                                                currentSort={filters.sort_by}
                                                currentDir={filters.sort_dir}
                                                search={filters.search}
                                            />
                                        </TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700 py-3.5">
                                            <SortButton
                                                label="Rekam Suhu"
                                                field="requires_temperature"
                                                currentSort={filters.sort_by}
                                                currentDir={filters.sort_dir}
                                                search={filters.search}
                                            />
                                        </TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700 py-3.5">
                                            <SortButton
                                                label="Keterangan"
                                                field="description"
                                                currentSort={filters.sort_by}
                                                currentDir={filters.sort_dir}
                                                search={filters.search}
                                            />
                                        </TableHead>
                                        <TableHead className="text-right font-semibold text-xs text-gray-700 py-3.5 pr-5">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-12 text-center text-xs text-gray-500">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <Package className="h-8 w-8 text-gray-300" />
                                                    <span>Tidak ada produk layanan yang ditemukan.</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.data.map((product) => (
                                            <TableRow key={product.id} className="hover:bg-gray-50/60 transition-colors">
                                                <TableCell className="py-3.5 pl-5 font-semibold text-xs text-gray-900">
                                                    {product.service_type}
                                                </TableCell>
                                                <TableCell className="py-3.5">
                                                    {product.requires_temperature === 1 ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <Check className="h-3 w-3 text-emerald-600" />
                                                            Wajib Suhu
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                            Tidak
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-3.5 text-xs text-gray-600">
                                                    {product.description || '-'}
                                                </TableCell>
                                                <TableCell className="py-3.5 text-right pr-5">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            asChild
                                                            className="h-8 px-2.5 text-xs font-semibold gap-1 text-gray-700 hover:text-gray-900 hover:border-gray-400"
                                                        >
                                                            <Link href={route('products.edit', product.id)}>
                                                                <Pencil className="h-3.5 w-3.5" />
                                                                Edit
                                                            </Link>
                                                        </Button>

                                                        <button
                                                            type="button"
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                                                            onClick={() => handleDeleteClick(product.id)}
                                                            title="Hapus Produk"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Footer */}
                        {products.links && products.links.length > 3 && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-500">
                                <div>
                                    {products.total !== undefined && (
                                        <span>
                                            Menampilkan <span className="font-semibold text-gray-700">{products.from || 0}</span> sampai{' '}
                                            <span className="font-semibold text-gray-700">{products.to || 0}</span> dari total{' '}
                                            <span className="font-semibold text-gray-700">{products.total}</span> produk
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1">
                                    {products.links.map((link, i) => {
                                        const isPrev = link.label.includes('&laquo;') || link.label.toLowerCase().includes('prev');
                                        const isNext = link.label.includes('&raquo;') || link.label.toLowerCase().includes('next');

                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={i}
                                                    className="px-2.5 py-1 text-xs text-gray-300 cursor-not-allowed select-none"
                                                >
                                                    {isPrev ? <ChevronLeft className="h-4 w-4" /> : isNext ? <ChevronRight className="h-4 w-4" /> : link.label}
                                                </span>
                                            );
                                        }

                                        return (
                                            <Button
                                                key={i}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => router.get(link.url!, {}, { preserveState: true })}
                                                className={`h-8 px-3 text-xs font-semibold ${
                                                    link.active
                                                        ? 'bg-gray-900 hover:bg-black text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {isPrev ? <ChevronLeft className="h-4 w-4" /> : isNext ? <ChevronRight className="h-4 w-4" /> : link.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Konfirmasi Delete */}
                <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                    <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader>
                            <div className="flex items-center gap-2.5 text-red-600 pb-1">
                                <Trash2 className="h-5 w-5" />
                                <AlertDialogTitle className="text-base">Hapus Produk Layanan</AlertDialogTitle>
                            </div>
                            <AlertDialogDescription className="text-xs text-gray-600">
                                Apakah Anda yakin ingin menghapus produk layanan ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2 pt-3">
                            <AlertDialogCancel onClick={() => setDeleteModalOpen(false)} className="text-xs">
                                Batal
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white text-xs">
                                Ya, Hapus Produk
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </ProductsLayout>
        </AppLayout>
    );
}
