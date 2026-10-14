import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    CalendarCheck,
    CalendarX,
    Check,
    CheckCircle2,
    Clock,
    PanelLeft,
    PanelLeftClose,
    PanelLeftOpen,
    Receipt,
    TableProperties,
    Shield,
    Search,
    X,
    Sparkles,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
    },
    {
        title: 'Pengaturan Sistem',
        href: '/settings/system',
    },
];

interface ProductItem {
    id: number;
    service_type: string;
    description?: string | null;
}

interface SystemSettingsProps {
    settings: {
        default_pagination: number;
        default_sidebar_state?: 'expanded' | 'collapsed';
        default_invoice_show_period?: boolean;
        storage_free_hours?: number;
        storage_fumigasi_free_hours?: number;
        karantina_default_product_ids?: number[];
    };
    products?: ProductItem[];
    status?: string;
}

const paginationOptions = [10, 25, 50, 100];

export default function SystemSettings({ settings, products = [], status }: SystemSettingsProps) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        default_pagination: settings.default_pagination || 25,
        default_sidebar_state: settings.default_sidebar_state || 'expanded',
        default_invoice_show_period: settings.default_invoice_show_period ?? true,
        storage_free_hours: settings.storage_free_hours ?? 72,
        storage_fumigasi_free_hours: settings.storage_fumigasi_free_hours ?? 120,
        karantina_default_product_ids: settings.karantina_default_product_ids || [],
    });

    const [productSearch, setProductSearch] = useState('');

    const toggleKarantinaProduct = (id: number) => {
        const current = [...data.karantina_default_product_ids];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('karantina_default_product_ids', current);
    };

    const isKarantinaOrFumigasi = (p: ProductItem) =>
        /karantina|fumigasi/i.test(p.service_type) || /karantina|fumigasi/i.test(p.description || '');

    const selectKarantinaOnly = () => {
        const matched = products.filter(isKarantinaOrFumigasi).map((p) => p.id);
        setData('karantina_default_product_ids', matched);
    };

    const selectAllProducts = () => {
        setData('karantina_default_product_ids', products.map((p) => p.id));
    };

    const clearAllProducts = () => {
        setData('karantina_default_product_ids', []);
    };

    const filteredProducts = useMemo(() => {
        if (!productSearch.trim()) return products;
        const q = productSearch.toLowerCase();
        return products.filter(
            (p) =>
                p.service_type.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q))
        );
    }, [products, productSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('settings.system.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Sistem" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="border-b pb-4">
                        <HeadingSmall
                            title="Pengaturan Sistem & Antarmuka"
                            description="Konfigurasikan jumlah data default per halaman dan status default bilah samping (sidebar) untuk kenyamanan navigasi."
                        />
                    </div>

                    {status && (
                        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-800">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>{status}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section 1: Default Pagination */}
                        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
                            <div className="flex items-center gap-2">
                                <TableProperties className="h-4 w-4 text-gray-900" />
                                <Label className="text-sm font-bold text-gray-900">
                                    Jumlah Baris Per Halaman Default
                                </Label>
                            </div>
                            <p className="text-xs text-gray-500">
                                Menentukan jumlah baris data default yang dimuat saat membuka daftar Order, User/Admin, dan tabel data lainnya.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 w-full">
                                {paginationOptions.map((opt) => {
                                    const isSelected = Number(data.default_pagination) === opt;
                                    return (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setData('default_pagination', opt)}
                                            className={`flex flex-col items-center justify-center p-3.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'border-gray-900 bg-gray-100 text-gray-950 shadow-xs ring-2 ring-gray-900/10'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="text-xl">{opt}</span>
                                            <span className="text-[11px] font-normal text-gray-500">Baris / Hal</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.default_pagination} />
                        </div>

                        {/* Section 2: Default Sidebar / Navbar State */}
                        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
                            <div className="flex items-center gap-2">
                                <PanelLeft className="h-4 w-4 text-gray-900" />
                                <Label className="text-sm font-bold text-gray-900">
                                    Status Default Navbar / Sidebar
                                </Label>
                            </div>
                            <p className="text-xs text-gray-500">
                                Tentukan apakah bilah samping (sidebar menu) tampil terbuka penuh (expanded) atau tertutup/mini (collapsed) secara default saat membuka aplikasi.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 w-full">
                                <button
                                    type="button"
                                    onClick={() => setData('default_sidebar_state', 'expanded')}
                                    className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                        data.default_sidebar_state === 'expanded'
                                            ? 'border-gray-900 bg-gray-100/70 shadow-xs ring-2 ring-gray-900/10'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-lg shrink-0 ${
                                        data.default_sidebar_state === 'expanded'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        <PanelLeftOpen className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-900">Expanded (Terbuka Penuh)</span>
                                            {data.default_sidebar_state === 'expanded' && (
                                                <span className="text-[10px] font-extrabold text-gray-800 bg-gray-200 px-2 py-0.5 rounded-full">Aktif</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">
                                            Sidebar selalu terbuka penuh menampilkan ikon dan label teks menu lengkap.
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setData('default_sidebar_state', 'collapsed')}
                                    className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                        data.default_sidebar_state === 'collapsed'
                                            ? 'border-gray-900 bg-gray-100/70 shadow-xs ring-2 ring-gray-900/10'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-lg shrink-0 ${
                                        data.default_sidebar_state === 'collapsed'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        <PanelLeftClose className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-900">Collapsed (Tertutup / Mini)</span>
                                            {data.default_sidebar_state === 'collapsed' && (
                                                <span className="text-[10px] font-extrabold text-gray-800 bg-gray-200 px-2 py-0.5 rounded-full">Aktif</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">
                                            Sidebar tampil ringkas hanya berupa ikon saja, memaksimalkan area konten tabel dan formulir.
                                        </p>
                                    </div>
                                </button>
                            </div>
                            <InputError message={errors.default_sidebar_state} />
                        </div>

                        {/* Section 3: Default Invoice Period Checkbox */}
                        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
                            <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-gray-900" />
                                <Label className="text-sm font-bold text-gray-900">
                                    Default Tampilkan Periode pada Buat Invoice
                                </Label>
                            </div>
                            <p className="text-xs text-gray-500">
                                Tentukan apakah opsi "Tampilkan Periode" saat pembuatan invoice baru secara otomatis dicentang (aktif) atau tidak dicentang (non-aktif).
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 w-full">
                                <button
                                    type="button"
                                    onClick={() => setData('default_invoice_show_period', true)}
                                    className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                        data.default_invoice_show_period === true
                                            ? 'border-gray-900 bg-gray-100/70 shadow-xs ring-2 ring-gray-900/10'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-lg shrink-0 ${
                                        data.default_invoice_show_period === true
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        <CalendarCheck className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-900">Otomatis Dicentang (Default)</span>
                                            {data.default_invoice_show_period === true && (
                                                <span className="text-[10px] font-extrabold text-gray-800 bg-gray-200 px-2 py-0.5 rounded-full">Aktif</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">
                                            Checkbox "Tampilkan Periode" otomatis tercentang saat membuka form pembuatan invoice baru.
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setData('default_invoice_show_period', false)}
                                    className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                        data.default_invoice_show_period === false
                                            ? 'border-gray-900 bg-gray-100/70 shadow-xs ring-2 ring-gray-900/10'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-lg shrink-0 ${
                                        data.default_invoice_show_period === false
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        <CalendarX className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-900">Tidak Dicentang</span>
                                            {data.default_invoice_show_period === false && (
                                                <span className="text-[10px] font-extrabold text-gray-800 bg-gray-200 px-2 py-0.5 rounded-full">Aktif</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">
                                            Checkbox "Tampilkan Periode" dimulai dalam keadaan tidak dicentang (off). User dapat mencentangnya manual jika diperlukan.
                                        </p>
                                    </div>
                                </button>
                            </div>
                            <InputError message={errors.default_invoice_show_period} />
                        </div>

                        {/* Section 4: Free Time Storage (Penyimpanan Kontainer) */}
                        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-900" />
                                <Label className="text-sm font-bold text-gray-900">
                                    Free Time Durasi Storage (Penyimpanan Kontainer)
                                </Label>
                            </div>
                            <p className="text-xs text-gray-500">
                                Tentukan batas waktu bebas biaya (free hours) sejak kontainer Gate In. Durasi penumpukan dihitung otomatis dari (Gate Out - Gate In) - Free Hours, lalu dibulatkan ke hari penuh (1, 2, dst) saat pembuatan tagihan invoice.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 w-full">
                                <div className="space-y-2 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="storage_free_hours" className="text-xs font-bold text-gray-800">
                                            Storage Biasa (20' & 40')
                                        </Label>
                                        <span className="text-[11px] text-gray-500 font-medium">
                                            {Math.floor((Number(data.storage_free_hours) || 0) / 24)} hari {(Number(data.storage_free_hours) || 0) % 24 > 0 ? `${(Number(data.storage_free_hours) || 0) % 24} jam` : ''}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="storage_free_hours"
                                            type="number"
                                            min={0}
                                            max={720}
                                            value={data.storage_free_hours}
                                            onChange={(e) => setData('storage_free_hours', Number(e.target.value))}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 pr-14 focus:border-gray-900 focus:outline-none"
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-gray-400 font-medium">
                                            Jam
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-500 leading-relaxed">
                                        Default: 72 jam (3 hari). Berlaku untuk jenis layanan Storage 20', Storage 40', Storage Empty, dll.
                                    </p>
                                    <InputError message={errors.storage_free_hours} />
                                </div>

                                <div className="space-y-2 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="storage_fumigasi_free_hours" className="text-xs font-bold text-gray-800">
                                            Storage Fumigasi (20' & 40')
                                        </Label>
                                        <span className="text-[11px] text-gray-500 font-medium">
                                            {Math.floor((Number(data.storage_fumigasi_free_hours) || 0) / 24)} hari {(Number(data.storage_fumigasi_free_hours) || 0) % 24 > 0 ? `${(Number(data.storage_fumigasi_free_hours) || 0) % 24} jam` : ''}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="storage_fumigasi_free_hours"
                                            type="number"
                                            min={0}
                                            max={720}
                                            value={data.storage_fumigasi_free_hours}
                                            onChange={(e) => setData('storage_fumigasi_free_hours', Number(e.target.value))}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 pr-14 focus:border-gray-900 focus:outline-none"
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-gray-400 font-medium">
                                            Jam
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-500 leading-relaxed">
                                        Default: 120 jam (5 hari). Berlaku untuk jenis layanan Storage Fumigasi 20' & 40' atau order fumigasi.
                                    </p>
                                    <InputError message={errors.storage_fumigasi_free_hours} />
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Default Produk / Layanan Halaman Karantina */}
                        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-blue-600" />
                                        <Label className="text-sm font-bold text-gray-900">
                                            Default Produk / Layanan Halaman Karantina
                                        </Label>
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                                            {data.karantina_default_product_ids.length} layanan dipilih
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tentukan layanan yang otomatis tercentang (aktif) setiap kali pengguna membuka menu <strong>Karantina & Fumigasi</strong>. Fitur ini bersifat multi-select.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:pt-0">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={selectKarantinaOnly}
                                        className="text-xs h-7 px-2.5 text-blue-700 border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 font-semibold gap-1"
                                        title="Centang otomatis produk yang memiliki kata Karantina atau Fumigasi"
                                    >
                                        <Sparkles className="h-3 w-3 text-blue-600" />
                                        <span>Pilih Karantina & Fumigasi</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={selectAllProducts}
                                        className="text-xs h-7 px-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Pilih Semua ({products.length})
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearAllProducts}
                                        className="text-xs h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                    >
                                        Kosongkan
                                    </Button>
                                </div>
                            </div>

                            {/* Search box layanan */}
                            <div className="relative max-w-sm">
                                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Cari nama produk / layanan..."
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                    className="h-8 pl-8 pr-7 text-xs rounded-lg border-gray-200 bg-gray-50/50 focus:bg-white"
                                />
                                {productSearch && (
                                    <button
                                        type="button"
                                        onClick={() => setProductSearch('')}
                                        className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Grid list produk dengan checkbox */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto p-1 rounded-lg border border-gray-100 bg-slate-50/40">
                                {filteredProducts.length === 0 ? (
                                    <div className="col-span-full py-8 text-center text-xs text-gray-400">
                                        Tidak ada produk / layanan yang cocok dengan kata kunci.
                                    </div>
                                ) : (
                                    filteredProducts.map((p) => {
                                        const isSelected = data.karantina_default_product_ids.includes(p.id);
                                        const isKarantina = isKarantinaOrFumigasi(p);
                                        return (
                                            <div
                                                key={p.id}
                                                onClick={() => toggleKarantinaProduct(p.id)}
                                                className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all select-none ${
                                                    isSelected
                                                        ? 'bg-blue-50/70 border-blue-300 shadow-2xs'
                                                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                                                }`}
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleKarantinaProduct(p.id)}
                                                    className="mt-0.5 h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span
                                                            className={`text-xs font-bold leading-tight ${
                                                                isSelected ? 'text-blue-950' : 'text-gray-800'
                                                            }`}
                                                        >
                                                            {p.service_type}
                                                        </span>
                                                        {isKarantina && (
                                                            <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded">
                                                                Karantina/Fumigasi
                                                            </span>
                                                        )}
                                                    </div>
                                                    {p.description && (
                                                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                                                            {p.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <InputError message={errors.karantina_default_product_ids as any} />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center gap-3">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-gray-900 hover:bg-black text-white font-semibold text-xs px-6 h-9"
                            >
                                {processing && <span className="mr-2 animate-spin">●</span>}
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan Sistem'}
                            </Button>

                            {recentlySuccessful && (
                                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                    <Check className="h-3.5 w-3.5" />
                                    Tersimpan
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
