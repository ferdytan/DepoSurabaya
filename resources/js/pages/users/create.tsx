import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import UsersLayout from '@/layouts/users/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, Shield, User, UserPlus } from 'lucide-react';
import React, { useState } from 'react';

type Role = {
    id: number;
    name: string;
};

type Props = {
    roles: Role[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master User',
        href: '/users',
    },
    {
        title: 'Tambah User Baru',
        href: '/users/create',
    },
];

export default function CreateUser({ roles }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah User Baru" />

            <UsersLayout>
                <div className="mx-auto max-w-4xl space-y-6 pb-12">
                    {/* Header */}
                    <div>
                        <Heading
                            title="Tambah Pengguna / Admin Baru"
                            description="Daftarkan akun staf baru dan tentukan peran wewenang akses dalam sistem operasional Depo."
                        />
                    </div>

                    {/* Form Card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-6">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <UserPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Informasi Akun Pengguna</h3>
                                <p className="text-xs text-gray-500">Lengkapi seluruh kolom yang ditandai dengan tanda bintang (*)</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Row 1: Nama Lengkap & Username */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Nama Lengkap */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs font-semibold text-gray-700">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Contoh: Budi Santoso"
                                            className="h-10 pl-9 text-xs"
                                            required
                                            disabled={processing}
                                        />
                                    </div>
                                    <InputError message={errors.name} />
                                </div>

                                {/* Username */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="username" className="text-xs font-semibold text-gray-700">
                                        Username <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-xs font-semibold text-gray-400">@</span>
                                        <Input
                                            id="username"
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value.toLowerCase().replace(/\s+/g, ''))}
                                            placeholder="budisantoso"
                                            className="h-10 pl-8 text-xs font-mono"
                                            required
                                            disabled={processing}
                                        />
                                    </div>
                                    <InputError message={errors.username} />
                                </div>
                            </div>

                            {/* Row 2: Email & Role */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Email */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                                        Alamat Email <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="budi@deposurabaya.com"
                                            className="h-10 pl-9 text-xs"
                                            required
                                            disabled={processing}
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                {/* Role */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="role_id" className="text-xs font-semibold text-gray-700">
                                        Peran / Hak Akses (Role) <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Select
                                            value={data.role_id}
                                            onValueChange={(val) => setData('role_id', val)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger id="role_id" className="h-10 text-xs">
                                                <SelectValue placeholder="Pilih Role Pengguna" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.id.toString()}>
                                                        <span className="font-semibold">{role.name}</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <InputError message={errors.role_id} />
                                </div>
                            </div>

                            {/* Row 3: Password & Confirm Password */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
                                {/* Password */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-xs font-semibold text-gray-700">
                                        Kata Sandi <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Minimal 6 karakter"
                                            className="h-10 pl-9 pr-10 text-xs"
                                            required
                                            disabled={processing}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="password_confirmation" className="text-xs font-semibold text-gray-700">
                                        Konfirmasi Kata Sandi <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password_confirmation"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Ulangi kata sandi"
                                            className="h-10 pl-9 pr-10 text-xs"
                                            required
                                            disabled={processing}
                                        />
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                                <Button variant="outline" asChild className="h-9 text-xs font-semibold">
                                    <Link href="/users">Batal</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 h-9"
                                >
                                    {processing && <span className="mr-2 animate-spin">●</span>}
                                    {processing ? 'Menyimpan User...' : 'Simpan User Baru'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </UsersLayout>
        </AppLayout>
    );
}
