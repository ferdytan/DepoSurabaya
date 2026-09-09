import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Eye,
    EyeOff,
    LoaderCircle,
    Lock,
    Mail,
    ShieldCheck,
    Thermometer,
    Truck,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

const DEFAULT_LOGIN_IMAGE =
    'https://images.unsplash.com/photo-1634646809203-f3b4adff9127?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export default function Login({ status, canResetPassword }: LoginProps) {
    const { settings } = usePage<SharedData>().props;
    const loginBgImage = settings?.login_image_url || DEFAULT_LOGIN_IMAGE;

    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen w-full bg-gray-50">
            <Head title="Masuk ke Sistem" />

            {/* Left Column: Visual Hero Side (Port/Depot Container Image) */}
            <div className="relative hidden lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white">
                {/* Background Image with Fallback */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out scale-105 hover:scale-100"
                    style={{ backgroundImage: `url("${loginBgImage}")` }}
                />

                {/* Dark Gradient Overlays for readable text & modern feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
                <div className="absolute inset-0 bg-blue-950/30 backdrop-blur-[1px]" />

                {/* Top: Brand Identity */}
                <div className="relative z-10 flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1.5 shadow-lg shadow-black/20">
                        <img
                            src="/logo.png"
                            alt="Logo PT. DEPO SURABAYA SEJAHTERA"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div>
                        <span className="text-base font-extrabold tracking-wider text-white">
                            PT. DEPO SURABAYA SEJAHTERA
                        </span>
                        <p className="text-[11px] font-medium tracking-wide text-blue-200">
                            Container Depot & Logistics Services
                        </p>
                    </div>
                </div>

                {/* Center: Value Statement & Features */}
                <div className="relative z-10 my-auto max-w-xl space-y-6 pt-12">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200 backdrop-blur-md">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                        <span>Sistem Manajemen Terintegrasi Depo & Pelabuhan</span>
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                        Operasional Depo Lebih Cepat, Akurat & Terpercaya.
                    </h1>

                    <p className="text-sm text-slate-200 leading-relaxed">
                        Kelola alur kontainer, rekam suhu 24 jam reefer, penerbitan invoice otomatis, pencatatan EIR, dan pengawasan karantina dalam satu platform terpadu.
                    </p>

                    {/* Highlights Cards */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                            <div className="flex items-center gap-2.5">
                                <div className="rounded-lg bg-blue-500/20 p-2 text-blue-400">
                                    <Thermometer className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Monitoring Suhu</h4>
                                    <p className="text-[11px] text-slate-300">Pencatatan reefer 24 jam</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                            <div className="flex items-center gap-2.5">
                                <div className="rounded-lg bg-cyan-500/20 p-2 text-cyan-400">
                                    <Truck className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Alur Kontainer</h4>
                                    <p className="text-[11px] text-slate-300">Tracking masuk & keluar</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: Footer Info */}
                <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-6">
                    <span>Jl. Tanjung Sadari No. 90, Surabaya</span>
                    <span>Telp. 031-353 9484</span>
                </div>
            </div>

            {/* Right Column: Authentication Form */}
            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 xl:w-5/12 sm:px-12 xl:px-16">
                <div className="mx-auto w-full max-w-sm sm:max-w-md space-y-8">
                    {/* Header for Mobile & Desktop */}
                    <div className="space-y-4 text-left">
                        {/* Company Logo */}
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="Logo PT. DEPO SURABAYA SEJAHTERA"
                                className="h-12 w-auto object-contain"
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Masuk ke Sistem
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Masukkan email dan kata sandi Anda untuk mengakses dashboard operasional.
                            </p>
                        </div>
                    </div>

                    {/* Flash Status Message */}
                    {status && (
                        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3.5 text-xs font-semibold text-green-800">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                            <span>{status}</span>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={submit} className="space-y-5" autoComplete="off">
                        {/* Email Address */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                                Alamat Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    name="user_login_email"
                                    type="text"
                                    inputMode="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck={false}
                                    data-lpignore="true"
                                    data-form-type="other"
                                    aria-autocomplete="none"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@deposurabaya.com"
                                    className="h-10 pl-9 text-xs"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-semibold text-gray-700">
                                    Kata Sandi
                                </Label>
                                {canResetPassword && (
                                    <TextLink
                                        href={route('password.request')}
                                        className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
                                        tabIndex={5}
                                    >
                                        Lupa kata sandi?
                                    </TextLink>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="h-10 pl-9 pr-10 text-xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center space-x-2 pt-1">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', Boolean(checked))}
                                tabIndex={3}
                            />
                            <Label htmlFor="remember" className="text-xs font-normal text-gray-600 cursor-pointer select-none">
                                Ingat saya di perangkat ini
                            </Label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {processing ? 'Memverifikasi Akun...' : 'Masuk ke Sistem'}
                        </Button>
                    </form>

                    {/* Bottom Security Note */}
                    <div className="pt-6 border-t border-gray-100 text-center space-y-2">
                        <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-400">
                            <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                            <span>Sesi terenkripsi & terlindungi secara aman</span>
                        </div>
                        <p className="text-[11px] text-gray-400">
                            © {new Date().getFullYear()} PT. Depo Surabaya Sejahtera
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
