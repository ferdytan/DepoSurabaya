import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Check, CheckCircle2, Clock, ShieldCheck, Thermometer } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
    },
    {
        title: 'Shift Plug Suhu',
        href: '/settings/plug-temperature',
    },
];

interface PlugTemperatureSettingsProps {
    settings: {
        shift_duration_hours?: number;
        shift_compensation_minutes?: number;
    };
    status?: string;
}

export default function PlugTemperatureSettings({ settings, status }: PlugTemperatureSettingsProps) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        shift_duration_hours: Number(settings.shift_duration_hours ?? 8),
        shift_compensation_minutes: Number(settings.shift_compensation_minutes ?? 45),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('settings.plug-temperature.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Shift Plug Suhu" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4">
                        <div>
                            <HeadingSmall
                                title="Pengaturan Shift Plug Suhu"
                                description="Konfigurasikan durasi standar kerja per shift dan toleransi kompensasi waktu untuk layanan plug-in & monitoring suhu kontainer reefer. Pengaturan ini hanya dapat diakses oleh peran Superadmin."
                            />
                        </div>
                        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-800 border border-gray-200">
                            <ShieldCheck className="h-3.5 w-3.5 text-gray-700" />
                            <span>Khusus Superadmin</span>
                        </div>
                    </div>

                    {status && (
                        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-800">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>{status}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
                            <div className="flex items-center gap-2">
                                <Thermometer className="h-4 w-4 text-gray-900" />
                                <Label className="text-sm font-bold text-gray-900">
                                    Parameter Jam & Toleransi Shift Reefer
                                </Label>
                            </div>
                            <p className="text-xs text-gray-500">
                                Parameter ini menjadi basis penghitungan otomatis jumlah shift penagihan saat petugas checker/admin mencatat Plug Out pada menu Monitoring Suhu & pembuatan invoice.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl pt-1">
                                <div className="space-y-1.5">
                                    <Label htmlFor="shift_duration_hours" className="text-xs font-semibold text-gray-700">
                                        Durasi Kerja Per Shift (Jam) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="shift_duration_hours"
                                        type="number"
                                        min={1}
                                        max={24}
                                        value={data.shift_duration_hours}
                                        onChange={(e) => setData('shift_duration_hours', Number(e.target.value))}
                                        className="bg-white text-xs h-9"
                                        required
                                    />
                                    <InputError message={errors.shift_duration_hours} />
                                    <p className="text-[11px] text-gray-400">Standar operasional normal: 8 jam</p>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="shift_compensation_minutes" className="text-xs font-semibold text-gray-700">
                                        Waktu Toleransi / Kompensasi (Menit) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="shift_compensation_minutes"
                                        type="number"
                                        min={0}
                                        max={180}
                                        value={data.shift_compensation_minutes}
                                        onChange={(e) => setData('shift_compensation_minutes', Number(e.target.value))}
                                        className="bg-white text-xs h-9"
                                        required
                                    />
                                    <InputError message={errors.shift_compensation_minutes} />
                                    <p className="text-[11px] text-gray-400">Standar toleransi keterlambatan: 45 menit</p>
                                </div>
                            </div>

                            {/* Live Shift Formula Preview Box */}
                            {(() => {
                                const hours = Number(data.shift_duration_hours) || 8;
                                const comp = Number(data.shift_compensation_minutes) || 0;
                                const shiftMins = hours * 60;
                                const maxShiftMins = shiftMins + comp;

                                return (
                                    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50/70 p-4 max-w-2xl space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5 text-gray-600" />
                                                Aturan Durasi & Toleransi Shift:
                                            </span>
                                            <span className="text-xs font-extrabold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-2xs">
                                                1 Shift = {hours} Jam (Toleransi +{comp} Mnt)
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-gray-600 leading-relaxed">
                                            Menit pertama s.d. <strong>{hours} Jam</strong> dihitung 1 shift. Kelebihan waktu setelah kelipatan {hours} jam yang <strong>lewat dari {comp} menit</strong> langsung dihitung sebagai 1 shift baru (berlaku hingga {hours} jam berikutnya). Sisa waktu &le; {comp} menit masih dalam toleransi.
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-gray-600">
                                            <span className="bg-white border border-gray-200 px-2 py-0.5 rounded">
                                                &le; {hours} Jam ({shiftMins} mnt) &rarr; <strong className="text-gray-900">1 Shift</strong>
                                            </span>
                                            <span className="bg-white border border-gray-200 px-2 py-0.5 rounded">
                                                {hours}j {comp}m ({maxShiftMins} mnt) &rarr; <strong className="text-gray-900">1 Shift</strong>
                                            </span>
                                            <span className="bg-white border border-gray-200 px-2 py-0.5 rounded">
                                                {hours}j {comp + 1}m ({maxShiftMins + 1} mnt) &rarr; <strong className="text-gray-900">2 Shift</strong>
                                            </span>
                                            <span className="bg-white border border-gray-200 px-2 py-0.5 rounded">
                                                152j 45m &rarr; <strong className="text-gray-900">19 Shift</strong>
                                            </span>
                                            <span className="bg-white border border-gray-200 px-2 py-0.5 rounded">
                                                152j 46m &rarr; <strong className="text-gray-900">20 Shift</strong>
                                            </span>
                                            <span className="bg-white border border-gray-200 px-2 py-0.5 rounded">
                                                159j 34m &rarr; <strong className="text-gray-900">20 Shift</strong>
                                            </span>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center gap-3">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-gray-900 hover:bg-black text-white font-semibold text-xs px-6 h-9"
                            >
                                {processing && <span className="mr-2 animate-spin">●</span>}
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan Shift'}
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
