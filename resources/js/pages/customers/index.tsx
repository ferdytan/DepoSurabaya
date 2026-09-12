import AppLayout from '@/layouts/app-layout';
import CustomersLayout from '@/layouts/customers/layout';
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
import { Trash2, Pencil, Plus, Search, Users } from 'lucide-react';

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

type Customer = {
    id: number;
    name: string;
    address: string | null;
    city: string | null;
    province: string | null;
    phone: string | null;
    email: string | null;
    default_tariff_20ft: number | null;
    default_tariff_40ft: number | null;
    default_global_tariff: number | null;
};

type Props = {
    customers: {
        data: Customer[];
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
        title: 'Customer Management',
        href: '/customers',
    },
];

export default function CustomersIndex({ customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [customerIdToDelete, setCustomerIdToDelete] = useState<number | null>(null);

    const { props } = usePage<PageProps>();

    const handleSearch = () => {
        router.get('/customers', { search });
    };

    const handleDeleteClick = (id: number) => {
        setCustomerIdToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (customerIdToDelete !== null) {
            router.delete(`/customers/${customerIdToDelete}`);
        }
        setDeleteModalOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Management" />

            <CustomersLayout>
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
                                <Users className="h-7 w-7 text-gray-900" />
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    Customer Management
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Kelola data master customer, alamat, kontak, dan pengaturan tarif penagihan.
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                            <Button size="sm" asChild className="bg-gray-900 hover:bg-black text-white gap-1.5 h-9 text-xs font-semibold px-4 shadow-sm">
                                <Link href="/customers/create">
                                    <Plus className="h-4 w-4" />
                                    <span>Tambah Customer</span>
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
                                    placeholder="Cari berdasarkan nama customer atau email... (Tekan Enter)"
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
                                            router.get('/customers');
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
                                        <TableHead className="font-semibold text-xs text-gray-700">Nama Customer</TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700">Kota</TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700">Provinsi</TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700">Telepon</TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700">Email</TableHead>
                                        <TableHead className="text-right font-semibold text-xs text-gray-700">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-12 text-center text-sm text-gray-400">
                                                Tidak ada data customer ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        customers.data.map((customer) => (
                                            <TableRow key={customer.id} className="hover:bg-gray-50/60 transition-colors">
                                                <TableCell className="py-3.5 font-semibold text-sm text-gray-900">
                                                    {customer.name}
                                                </TableCell>
                                                <TableCell className="py-3.5 text-sm text-gray-600">
                                                    {customer.city || '-'}
                                                </TableCell>
                                                <TableCell className="py-3.5 text-sm text-gray-600">
                                                    {customer.province || '-'}
                                                </TableCell>
                                                <TableCell className="py-3.5 text-sm text-gray-600">
                                                    {customer.phone || '-'}
                                                </TableCell>
                                                <TableCell className="py-3.5 text-sm text-gray-600">
                                                    {customer.email || '-'}
                                                </TableCell>
                                                <TableCell className="py-3.5 text-right whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <Button size="sm" variant="outline" asChild className="h-8 text-xs px-2.5">
                                                            <Link href={`/customers/${customer.id}/edit`}>
                                                                <Pencil className="h-3.5 w-3.5 mr-1 text-gray-500" />
                                                                Edit
                                                            </Link>
                                                        </Button>

                                                        <button
                                                            type="button"
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                                                            onClick={() => handleDeleteClick(customer.id)}
                                                            aria-label="Delete"
                                                            title="Hapus Customer"
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
                        {customers.links && customers.links.length > 3 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3.5 border-t border-gray-100 bg-gray-50/40">
                                <div className="text-xs text-gray-500">
                                    Menampilkan <span className="font-semibold text-gray-900">{customers.data.length}</span> customer
                                </div>
                                <div className="flex flex-wrap justify-center gap-1">
                                    {customers.links.map((link, i) =>
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

                {/* Modal Delete */}
                <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Customer</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus customer ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteModalOpen(false)}>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                                Hapus Customer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CustomersLayout>
        </AppLayout>
    );
}
