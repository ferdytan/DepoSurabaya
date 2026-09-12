import AppLayout from '@/layouts/app-layout';
import ShippersLayout from '@/layouts/shippers/layout';
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
import { Trash2, Pencil, Plus, Search, Truck } from 'lucide-react';

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

type Shipper = {
    id: number;
    name: string;
    address: string;
    city: string | null;
    province: string | null;
    phone: string | null;
    email: string;
};

type Props = {
    shippers: {
        data: Shipper[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        search?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Shipper Management',
        href: '/shippers',
    },
];

export default function ShippersIndex({ shippers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [shipperIdToDelete, setShipperIdToDelete] = useState<number | null>(null);

    const { props } = usePage<PageProps>();

    const handleSearch = () => {
        router.get('/shippers', { search });
    };

    const handleDeleteClick = (id: number) => {
        setShipperIdToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (shipperIdToDelete !== null) {
            router.delete(`/shippers/${shipperIdToDelete}`);
        }
        setDeleteModalOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shipper Management" />
            <ShippersLayout>
                <div className="w-full space-y-6">
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
                                <Truck className="h-7 w-7 text-gray-900" />
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    Shipper Management
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Kelola data master shipper, alamat, kontak, dan informasi pengirim barang.
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                            <Button size="sm" asChild className="bg-gray-900 hover:bg-black text-white gap-1.5 h-9 text-xs font-semibold px-4 shadow-sm">
                                <Link href="/shippers/create">
                                    <Plus className="h-4 w-4" />
                                    <span>Tambah Shipper</span>
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
                                    placeholder="Cari berdasarkan nama shipper atau email... (Tekan Enter)"
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
                                    className="h-9 text-xs px-4 bg-gray-900 hover:bg-black text-white gap-1.5 font-medium"
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
                                            router.get('/shippers');
                                        }}
                                        className="h-9 text-xs px-3"
                                    >
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Data Table Modern Full-Width */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50/75">
                                    <TableRow>
                                        <TableHead className="font-semibold text-xs text-gray-700">Nama Shipper</TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700">Alamat</TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700">Kota / Provinsi</TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700">Telepon</TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700">Email</TableHead>
                                        <TableHead className="text-right font-semibold text-xs text-gray-700">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {shippers.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-12 text-center text-sm text-gray-400">
                                                Tidak ada data shipper ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        shippers.data.map((shipper) => (
                                            <TableRow key={shipper.id} className="hover:bg-gray-50/60 transition-colors">
                                                <TableCell className="py-3.5 font-semibold text-sm text-gray-900">
                                                    {shipper.name}
                                                </TableCell>
                                                <TableCell className="py-3.5 text-sm text-gray-600 max-w-[200px] truncate" title={shipper.address || ''}>
                                                    {shipper.address || '-'}
                                                </TableCell>
                                                <TableCell className="py-3.5 text-sm text-gray-600">
                                                    {[shipper.city, shipper.province].filter(Boolean).join(', ') || '-'}
                                                </TableCell>
                                                <TableCell className="py-3.5 text-sm text-gray-600">
                                                    {shipper.phone || '-'}
                                                </TableCell>
                                                <TableCell className="py-3.5 text-sm text-gray-600">
                                                    {shipper.email || '-'}
                                                </TableCell>
                                                <TableCell className="py-3.5 text-right whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <Button size="sm" variant="outline" asChild className="h-8 text-xs px-2.5">
                                                            <Link href={`/shippers/${shipper.id}/edit`}>
                                                                <Pencil className="h-3.5 w-3.5 mr-1 text-gray-500" />
                                                                Edit
                                                            </Link>
                                                        </Button>

                                                        <button
                                                            type="button"
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                                                            onClick={() => handleDeleteClick(shipper.id)}
                                                            aria-label="Delete"
                                                            title="Hapus Shipper"
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
                        {shippers.links && shippers.links.length > 3 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3.5 border-t border-gray-100 bg-gray-50/40">
                                <div className="text-xs text-gray-500">
                                    Menampilkan <span className="font-semibold text-gray-900">{shippers.data.length}</span> shipper
                                </div>
                                <div className="flex flex-wrap justify-center gap-1">
                                    {shippers.links.map((link, i) =>
                                        link.url ? (
                                            <Button
                                                key={i}
                                                size="sm"
                                                variant={link.active ? 'default' : 'outline'}
                                                onClick={() => router.get(link.url!)}
                                                className={`h-8 px-3 text-xs whitespace-nowrap ${link.active ? 'bg-gray-900 hover:bg-black text-white' : ''}`}
                                            >
                                                {link.label.replace(/&laquo; Previous|Next &raquo;/, (match) => {
                                                    if (match.includes('Previous')) return '← Sebelumnya';
                                                    if (match.includes('Next')) return 'Selanjutnya →';
                                                    return match;
                                                })}
                                            </Button>
                                        ) : (
                                            <span key={i} className="px-2.5 py-1 text-xs text-gray-400">
                                                ...
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Konfirmasi Delete */}
                <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Shipper</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus shipper ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteModalOpen(false)}>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                                Hapus Shipper
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </ShippersLayout>
        </AppLayout>
    );
}
