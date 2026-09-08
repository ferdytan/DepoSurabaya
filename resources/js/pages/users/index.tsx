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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import UsersLayout from '@/layouts/users/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Plus,
    Search,
    Shield,
    Trash2,
    UserCheck,
    UserX,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

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

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    role: {
        id: number;
        name: string;
    } | null;
    email_verified_at: string | null;
};

type Props = {
    users: {
        data: User[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        per_page: number;
    };
    filters: {
        search?: string;
        per_page?: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master User',
        href: '/users',
    },
];

export default function UsersIndex({ users, filters }: Props) {
    const { props } = usePage<PageProps>();
    const currentUserId = props.auth?.user?.id;

    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState<string>(String(filters.per_page || users.per_page || 25));

    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [userToVerify, setUserToVerify] = useState<User | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleSearch = () => {
        router.get('/users', {
            search: search.trim(),
            per_page: perPage,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePerPageChange = (val: string) => {
        setPerPage(val);
        router.get('/users', {
            search: search.trim(),
            per_page: val,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get('/users', {
            search: '',
            per_page: perPage,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleVerifyClick = (user: User) => {
        setUserToVerify(user);
        setVerifyModalOpen(true);
    };

    const confirmVerify = () => {
        if (userToVerify) {
            router.post(`/users/${userToVerify.id}/verify`, {}, {
                preserveScroll: true,
            });
        }
        setVerifyModalOpen(false);
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            router.delete(`/users/${userToDelete.id}`, {
                preserveScroll: true,
            });
        }
        setDeleteModalOpen(false);
    };

    const getRoleBadge = (roleName?: string) => {
        const name = (roleName || '').toLowerCase();
        if (name.includes('super')) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Shield className="h-3 w-3 text-indigo-500" />
                    {roleName || 'Super Admin'}
                </span>
            );
        }
        if (name.includes('admin')) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {roleName || 'Admin'}
                </span>
            );
        }
        if (name.includes('checker')) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {roleName || 'Checker'}
                </span>
            );
        }
        if (name.includes('karantina')) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    {roleName || 'Karantina'}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700">
                {roleName || '-'}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master User" />

            <UsersLayout>
                <div className="mx-auto max-w-6xl space-y-6 pb-12">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Heading
                                    title="Daftar Pengguna & Admin"
                                    description="Kelola akun, hak akses peran (role), dan status verifikasi seluruh staf dan admin operasional."
                                />
                            </div>
                        </div>

                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 gap-1.5 shadow-sm">
                            <Link href="/users/create">
                                <Plus className="h-4 w-4" />
                                Tambah User Baru
                            </Link>
                        </Button>
                    </div>

                    {/* Flash Messages */}
                    {props.flash?.success && (
                        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4 text-xs font-semibold text-green-800 shadow-xs">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span>{props.flash.success}</span>
                            </div>
                        </div>
                    )}

                    {props.flash?.error && (
                        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800 shadow-xs">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <span>{props.flash.error}</span>
                            </div>
                        </div>
                    )}

                    {/* Toolbar: Search & Per Page */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                id="search"
                                placeholder="Cari berdasarkan nama, username, atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                                className="h-9 pl-9 pr-8 text-xs bg-gray-50/50"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Right: Per Page & Search Action */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <Button
                                type="button"
                                onClick={handleSearch}
                                variant="outline"
                                size="sm"
                                className="text-xs h-9 font-semibold"
                            >
                                Cari
                            </Button>

                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium pl-2 border-l border-gray-200">
                                <span>Tampilkan:</span>
                                <Select value={perPage} onValueChange={handlePerPageChange}>
                                    <SelectTrigger className="h-9 w-[80px] text-xs font-semibold">
                                        <SelectValue placeholder="25" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/80">
                                <TableRow>
                                    <TableHead className="text-xs font-bold text-gray-700 py-3.5 pl-5">Pengguna</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-700 py-3.5">Email</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-700 py-3.5">Peran (Role)</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-700 py-3.5">Status Verifikasi</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-700 py-3.5 text-right pr-5">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-12 text-center text-xs text-gray-500">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Users className="h-8 w-8 text-gray-300" />
                                                <span>Tidak ada pengguna yang sesuai dengan pencarian.</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => {
                                        const isSelf = user.id === currentUserId;
                                        const isVerified = Boolean(user.email_verified_at);

                                        return (
                                            <TableRow key={user.id} className="hover:bg-gray-50/60 transition-colors">
                                                {/* Name & Username with Avatar */}
                                                <TableCell className="py-3.5 pl-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-semibold text-xs text-gray-900 truncate">
                                                                    {user.name}
                                                                </span>
                                                                {isSelf && (
                                                                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                                                                        Anda
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-[11px] font-mono text-gray-500 block truncate">
                                                                @{user.username}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Email */}
                                                <TableCell className="py-3.5 text-xs text-gray-600 font-medium">
                                                    {user.email}
                                                </TableCell>

                                                {/* Role */}
                                                <TableCell className="py-3.5">
                                                    {getRoleBadge(user.role?.name)}
                                                </TableCell>

                                                {/* Status Verifikasi */}
                                                <TableCell className="py-3.5">
                                                    {isVerified ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">
                                                            <Check className="h-3 w-3 text-green-600" />
                                                            Terverifikasi
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                                <UserX className="h-3 w-3 text-amber-600" />
                                                                Belum Terverifikasi
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleVerifyClick(user)}
                                                                className="h-6 px-2 text-[11px] font-medium border-amber-300 text-amber-800 hover:bg-amber-100"
                                                            >
                                                                Verifikasi
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="py-3.5 text-right pr-5">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            asChild
                                                            className="h-8 px-2.5 text-xs font-semibold gap-1 text-gray-700 hover:text-blue-600 hover:border-blue-300"
                                                        >
                                                            <Link href={route('users.edit', user.id)}>
                                                                <Edit2 className="h-3.5 w-3.5" />
                                                                Edit
                                                            </Link>
                                                        </Button>

                                                        {!isSelf && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteClick(user)}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                                                                title="Hapus Pengguna"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
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

                        {/* Pagination Footer */}
                        {users.total > 0 && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-500">
                                <div>
                                    Menampilkan <span className="font-semibold text-gray-700">{users.from || 0}</span> sampai{' '}
                                    <span className="font-semibold text-gray-700">{users.to || 0}</span> dari total{' '}
                                    <span className="font-semibold text-gray-700">{users.total}</span> pengguna
                                </div>

                                <div className="flex items-center gap-1">
                                    {users.links.map((link, i) => {
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
                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
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

                    {/* Dialog Verifikasi */}
                    <AlertDialog open={verifyModalOpen} onOpenChange={setVerifyModalOpen}>
                        <AlertDialogContent className="max-w-md">
                            <AlertDialogHeader>
                                <div className="flex items-center gap-2.5 text-blue-600 pb-1">
                                    <UserCheck className="h-5 w-5" />
                                    <AlertDialogTitle className="text-base">Verifikasi Akun Pengguna</AlertDialogTitle>
                                </div>
                                <AlertDialogDescription className="text-xs text-gray-600">
                                    Apakah Anda yakin ingin memverifikasi akun <strong>{userToVerify?.name}</strong> ({userToVerify?.email})? Pengguna akan dapat langsung masuk dan menggunakan sistem.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2 pt-3">
                                <AlertDialogCancel onClick={() => setVerifyModalOpen(false)} className="text-xs">
                                    Batal
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={confirmVerify} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                                    Ya, Verifikasi Akun
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Dialog Hapus User */}
                    <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                        <AlertDialogContent className="max-w-md">
                            <AlertDialogHeader>
                                <div className="flex items-center gap-2.5 text-red-600 pb-1">
                                    <Trash2 className="h-5 w-5" />
                                    <AlertDialogTitle className="text-base">Hapus Akun Pengguna</AlertDialogTitle>
                                </div>
                                <AlertDialogDescription className="text-xs text-gray-600">
                                    Apakah Anda yakin ingin menghapus akun <strong>{userToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan dan seluruh sesi pengguna tersebut akan ditutup.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2 pt-3">
                                <AlertDialogCancel onClick={() => setDeleteModalOpen(false)} className="text-xs">
                                    Batal
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white text-xs">
                                    Ya, Hapus Pengguna
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </UsersLayout>
        </AppLayout>
    );
}
