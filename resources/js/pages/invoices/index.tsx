import AppLayout from '@/layouts/app-layout';
import InvoicesLayout from '@/layouts/invoices/layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// UI Components
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RotateCcw, Trash2, Pencil, Plus, Search, Receipt, CheckCircle2, Clock, Eye } from 'lucide-react';

// Types
interface FlashProps {
    success?: string;
    error?: string;
}

interface Invoice {
    id: number;
    invoice_number: string;
    customer: { name: string };
    period_start: string;
    period_end: string;
    subtotal: number;
    ppn: number;
    materai: number;
    grand_total: number;
    status: 'paid' | 'unpaid';
    created_at: string;
    items_count: number; // jumlah kontainer (tetap)
    additional_qty_total?: number; // <-- NEW: total qty additional (dari backend)
    deleted_reason?: string | null; // alasan penghapusan
    deleted_at?: string | null; // tanggal penghapusan
    deleted_by?: string | null; // siapa yang menghapus
    is_reused?: boolean;
    reused_by?: string | null;
    reused_at?: string | null;
}

interface InvoicesData {
    data: Invoice[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface PageProps {
    [k: string]: unknown;
    invoices: InvoicesData;
    filters: {
        search?: string;
        trashed?: string;
    };
    flash?: FlashProps;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role_id: number;
            role?: {
                id: number;
                name: string;
            };
        };
    };
}

export default function InvoicesIndex() {
    const page = usePage<PageProps>();
    const { invoices, filters, flash } = page.props;
    const user = page.props.auth?.user;
    const roleId = user?.role_id;
    const roleName = user?.role?.name;

    // Check if user is admin (role_id = 2) or super admin (role_id = 1)
    const canDeleteRestore = roleId === 1 || roleId === 2 || roleName === 'Super User' || roleName === 'Admin';

    const [search, setSearch] = useState(filters?.search || '');
    const [isTrashed, setIsTrashed] = useState(!!filters?.trashed);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [invoiceIdToDelete, setInvoiceIdToDelete] = useState<number | null>(null);
    const [deleteReason, setDeleteReason] = useState('');

    // Reuse modal state
    const [reuseModalOpen, setReuseModalOpen] = useState(false);
    const [invoiceToReuse, setInvoiceToReuse] = useState<Invoice | null>(null);

    // Sync isTrashed with filters.trashed from server
    useEffect(() => {
        setIsTrashed(!!filters?.trashed);
    }, [filters?.trashed]);

    const handleSearch = () => {
        router.get(
            '/invoices',
            { search, trashed: isTrashed ? '1' : undefined },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDeleteClick = (id: number) => {
        if (!canDeleteRestore) {
            alert('Anda tidak memiliki izin untuk menghapus invoice.');
            return;
        }
        setInvoiceIdToDelete(id);
        setDeleteReason('');
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (invoiceIdToDelete !== null && deleteReason.trim()) {
            router.delete(`/invoices/${invoiceIdToDelete}`, {
                data: { delete_reason: deleteReason },
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setInvoiceIdToDelete(null);
                    setDeleteReason('');
                    router.reload({ only: ['invoices'] });
                },
            });
        } else if (invoiceIdToDelete !== null) {
            alert('Mohon masukkan alasan penghapusan.');
        }
    };

    const handleReuseClick = (inv: Invoice) => {
        if (!canDeleteRestore) {
            alert('Anda tidak memiliki izin untuk me-reuse invoice.');
            return;
        }
        setInvoiceToReuse(inv);
        setReuseModalOpen(true);
    };

    const confirmReuse = () => {
        if (invoiceToReuse) {
            router.post(`/invoices/${invoiceToReuse.id}/reuse`, {}, {
                onSuccess: () => {
                    setReuseModalOpen(false);
                    setInvoiceToReuse(null);
                },
            });
        }
    };

    const toggleTrashed = () => {
        const newTrashed = !isTrashed;
        setIsTrashed(newTrashed);
        router.get('/invoices', { trashed: newTrashed ? '1' : undefined, search }, {
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isTrashed ? 'Invoice Dihapus (Recycle Bin)' : 'Daftar Invoice'} />
            <InvoicesLayout>
                <div className="w-full space-y-6">
                    {/* Flash Messages */}
                    {flash?.success && <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 font-medium">{flash.success}</div>}
                    {flash?.error && <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-800 font-medium">{flash.error}</div>}

                    {/* Header Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Receipt className="h-7 w-7 text-gray-900" />
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    {isTrashed ? 'Invoice Dihapus (Recycle Bin)' : 'Daftar Invoice'}
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {isTrashed
                                    ? 'Riwayat invoice yang telah dihapus beserta alasan dan opsi reuse.'
                                    : 'Kelola semua tagihan invoice, status pembayaran, dan rincian transaksi.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                            {canDeleteRestore && (
                                <Button
                                    variant={isTrashed ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={toggleTrashed}
                                    className={`gap-1.5 h-9 text-xs font-semibold ${isTrashed ? 'bg-gray-900 hover:bg-black text-white' : ''}`}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    <span>{isTrashed ? '← Invoice Aktif' : 'Invoice Dihapus'}</span>
                                </Button>
                            )}

                            {!isTrashed && (
                                <Button size="sm" asChild className="bg-gray-900 hover:bg-black text-white gap-1.5 h-9 text-xs font-semibold px-4 shadow-sm">
                                    <Link href="/invoices/create">
                                        <Plus className="h-4 w-4" />
                                        <span>Buat Invoice</span>
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Unified Search & Filter Card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Cari berdasarkan nomor invoice, nama customer, atau kontainer... (Tekan Enter)"
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
                                            router.get('/invoices', { trashed: isTrashed ? '1' : undefined });
                                        }}
                                        className="h-9 text-xs px-3"
                                    >
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabel Daftar Invoice Modern Full-Width */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50/75">
                                    <TableRow>
                                        <TableHead className="font-semibold text-xs text-gray-700">Nomor Invoice</TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700">Customer</TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700">Periode</TableHead>
                                        <TableHead className="text-center font-semibold text-xs text-gray-700">Jumlah Kontainer</TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700">Total Tagihan</TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700">Status</TableHead>
                                        <TableHead className="font-semibold text-xs text-gray-700">{isTrashed ? 'Dihapus Pada' : 'Dibuat Pada'}</TableHead>
                                        {isTrashed && <TableHead className="font-semibold text-xs text-gray-700">Dihapus Oleh</TableHead>}
                                        {isTrashed && <TableHead className="font-semibold text-xs text-gray-700">Alasan Dihapus</TableHead>}
                                        <TableHead className="text-right font-semibold text-xs text-gray-700">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices?.data?.length ? (
                                        invoices.data.map((invoice) => {
                                            const st = (invoice.status ?? 'unpaid').toString().toLowerCase();

                                            return (
                                                <TableRow key={invoice.id} className="hover:bg-gray-50/60 transition-colors">
                                                    <TableCell className="py-3.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-xs text-gray-900">
                                                                {invoice.invoice_number}
                                                            </span>
                                                            {invoice.is_reused && !isTrashed && (
                                                                <span
                                                                    className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200"
                                                                    title={`Di-reuse oleh ${invoice.reused_by || 'Admin'}`}
                                                                >
                                                                    Reused
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-3.5 font-medium text-xs text-gray-800">
                                                        {invoice.customer.name}
                                                    </TableCell>

                                                    <TableCell className="py-3.5 text-xs text-gray-600 whitespace-nowrap">
                                                        {new Date(invoice.period_start).toLocaleDateString('id-ID')} -{' '}
                                                        {new Date(invoice.period_end).toLocaleDateString('id-ID')}
                                                    </TableCell>

                                                    <TableCell className="py-3.5 text-center text-xs font-semibold text-gray-800">
                                                        {invoice.items_count}
                                                    </TableCell>

                                                    <TableCell className="py-3.5 text-xs font-bold text-gray-900 whitespace-nowrap">
                                                        Rp {Number(invoice.grand_total ?? 0).toLocaleString('id-ID')}
                                                    </TableCell>

                                                    <TableCell className="py-3.5 whitespace-nowrap">
                                                        {st === 'paid' ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Lunas
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                                <Clock className="h-3 w-3" />
                                                                Belum Lunas
                                                            </span>
                                                        )}
                                                    </TableCell>

                                                    <TableCell className="py-3.5 text-xs text-gray-500 whitespace-nowrap">
                                                        {isTrashed
                                                            ? (invoice.deleted_at ? new Date(invoice.deleted_at).toLocaleDateString('id-ID') : '-')
                                                            : new Date(invoice.created_at).toLocaleDateString('id-ID')
                                                        }
                                                    </TableCell>

                                                    {isTrashed && (
                                                        <TableCell className="py-3.5 font-medium text-xs text-gray-700">
                                                            {invoice.deleted_by || 'Admin'}
                                                        </TableCell>
                                                    )}

                                                    {isTrashed && (
                                                        <TableCell className="py-3.5 text-xs text-red-600 max-w-[200px] truncate" title={invoice.deleted_reason || ''}>
                                                            {invoice.deleted_reason || '-'}
                                                        </TableCell>
                                                    )}

                                                    <TableCell className="py-3.5 text-right whitespace-nowrap">
                                                        {isTrashed ? (
                                                            canDeleteRestore && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleReuseClick(invoice)}
                                                                    className="inline-flex items-center gap-1 bg-emerald-600 text-white hover:bg-emerald-700 h-8 text-xs font-medium px-3 shadow-xs"
                                                                    title="Reuse Nomor Invoice"
                                                                >
                                                                    <RotateCcw className="h-3.5 w-3.5" />
                                                                    Reuse
                                                                </Button>
                                                            )
                                                        ) : (
                                                            <div className="inline-flex items-center gap-1.5">
                                                                {st === 'unpaid' && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => router.put(`/invoices/${invoice.id}/pay`)}
                                                                        className="h-8 text-xs font-medium border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                                                                    >
                                                                        Lunas
                                                                    </Button>
                                                                )}

                                                                {st === 'paid' && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => router.put(`/invoices/${invoice.id}/unpay`)}
                                                                        className="h-8 text-xs font-medium border-amber-600 text-amber-700 hover:bg-amber-50"
                                                                    >
                                                                        Belum Lunas
                                                                    </Button>
                                                                )}

                                                                <Button size="sm" variant="outline" asChild className="h-8 text-xs px-2.5">
                                                                    <Link href={`/invoices/${invoice.id}`}>
                                                                        <Eye className="h-3.5 w-3.5 mr-1 text-gray-500" />
                                                                        Detail
                                                                    </Link>
                                                                </Button>

                                                                <Button size="sm" variant="outline" asChild className="h-8 text-xs px-2.5">
                                                                    <Link href={`/invoices/${invoice.id}/edit`}>
                                                                        <Pencil className="h-3.5 w-3.5 mr-1 text-gray-500" />
                                                                        Edit
                                                                    </Link>
                                                                </Button>

                                                                {canDeleteRestore && (
                                                                    <button
                                                                        type="button"
                                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                                                                        onClick={() => handleDeleteClick(invoice.id)}
                                                                        aria-label="Hapus"
                                                                        title="Hapus Invoice"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={isTrashed ? 10 : 8} className="py-12 text-center text-sm text-gray-400">
                                                {isTrashed ? 'Tidak ada invoice yang dihapus.' : 'Belum ada invoice ditemukan.'}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Footer */}
                        {invoices?.links && invoices.links.length > 3 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3.5 border-t border-gray-100 bg-gray-50/40">
                                <div className="text-xs text-gray-500">
                                    Menampilkan <span className="font-semibold text-gray-900">{invoices.data.length}</span> invoice
                                </div>
                                <div className="flex flex-wrap justify-center gap-1">
                                    {invoices.links.map((link, i) =>
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

                {/* Modal Hapus dengan input alasan */}
                <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Invoice</AlertDialogTitle>
                            <AlertDialogDescription>
                                Masukkan alasan penghapusan invoice ini:
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-4">
                            <Input
                                placeholder="Alasan penghapusan"
                                value={deleteReason}
                                onChange={(e) => setDeleteReason(e.target.value)}
                                required
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteModalOpen(false)}>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                disabled={!deleteReason.trim()}
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Hapus Invoice
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Modal Konfirmasi Reuse */}
                <AlertDialog open={reuseModalOpen} onOpenChange={setReuseModalOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Reuse Nomor Invoice</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menggunakan kembali (reuse) nomor invoice{' '}
                                <strong className="text-gray-900">{invoiceToReuse?.invoice_number}</strong>?
                                <br /><br />
                                Nomor invoice ini akan digunakan kembali. Anda akan diarahkan ke form pembuatan invoice di mana Anda dapat bebas <strong>mengganti Customer</strong>, <strong>memilih Nomor Order / AJU</strong> yang baru, serta menyesuaikan seluruh rincian kontainer dan layanan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setReuseModalOpen(false)}>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmReuse}
                                className="bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                Ya, Reuse Nomor Invoice
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </InvoicesLayout>
        </AppLayout>
    );
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Invoice',
        href: '/invoices',
    },
];
