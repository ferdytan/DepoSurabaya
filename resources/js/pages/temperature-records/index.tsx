import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import TemperatureRecordsLayout from '@/layouts/temperature-records/layout';
import { Head, router } from '@inertiajs/react';
import { Fragment, useState } from 'react';

type TemperatureRecord = {
    id: number;
    container_number: string;
    order: {
        id: number;
        order_id: string;
        no_aju?: string;
    };
    product?: { service_type: string };
    rekam_suhu: Array<{
        tanggal: string;
        jam_data: Record<string, string>;
    }>;
};

type Props = {
    records: {
        data: TemperatureRecord[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { search?: string };
};

export default function TemperatureRecordsIndex({ records, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get('/temperature-records', { search });
    };

    const isSearched = !!(filters.search && filters.search.trim() !== '');

    return (
        <AppLayout breadcrumbs={[{ title: 'Master Temperature', href: '/temperature-records' }]}>
            <Head title="Master Temperature" />
            <TemperatureRecordsLayout>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold">Master Temperature</h2>
                        <p className="text-sm text-muted-foreground">Cari rekaman suhu kontainer.</p>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Input Nomor Kontainer"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch}>Cari</Button>
                    </div>

                    {isSearched ? (
                        records.data.length > 0 ? (
                            records.data.map((rec) => (
                                <div key={rec.id} className="rounded border bg-white shadow-sm">
                                    <div className="border-b px-4 py-2">
                                        <strong>Kontainer:</strong> {rec.container_number} | <strong>Order:</strong> {rec.order.order_id}{' '}
                                        {rec.order.no_aju ? `(${rec.order.no_aju})` : ''}
                                        <br />
                                        <strong>Produk:</strong> {rec.product?.service_type ?? '-'}
                                    </div>
                                    <Table className="w-full overflow-x-auto">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tanggal</TableHead>
                                                {Array.from({ length: 24 }).map((_, i) => (
                                                    <TableHead key={i}>{i.toString().padStart(2, '0')}:00</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rec.rekam_suhu.map((suhu, idx) => {
                                                const sortedEntries = Object.entries(suhu.jam_data || {}).sort(([a], [b]) => a.localeCompare(b));
                                                return (
                                                    <Fragment key={idx}>
                                                        <TableRow className="border-b border-slate-100">
                                                            <TableCell className="font-semibold whitespace-nowrap">{suhu.tanggal}</TableCell>
                                                            {Array.from({ length: 24 }).map((_, jam) => {
                                                                const hourStr = jam.toString().padStart(2, '0');
                                                                const val = suhu.jam_data[hourStr] || suhu.jam_data[`${hourStr}:00`];
                                                                return (
                                                                    <TableCell key={jam} className="text-center text-xs">
                                                                        {val ? `${val}°C` : ''}
                                                                    </TableCell>
                                                                );
                                                            })}
                                                        </TableRow>
                                                        {sortedEntries.length > 0 && (
                                                            <TableRow className="bg-slate-50/70 hover:bg-slate-50 border-b-2 border-slate-200">
                                                                <TableCell colSpan={25} className="py-2 px-4">
                                                                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                                                        <span className="font-semibold text-slate-500 text-[11px]">Log Lengkap ({suhu.tanggal}):</span>
                                                                        {sortedEntries.map(([jamKey, tempVal], i) => {
                                                                            const isFirst = i === 0;
                                                                            const isLast = i === sortedEntries.length - 1 && sortedEntries.length > 1;
                                                                            const isMinute = jamKey.includes(':') && !jamKey.endsWith(':00');
                                                                            return (
                                                                                <span
                                                                                    key={jamKey}
                                                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                                                                                        isFirst && isMinute
                                                                                            ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                                                                                            : isLast && isMinute
                                                                                            ? 'bg-amber-50 text-amber-700 border-amber-200 font-bold'
                                                                                            : 'bg-white text-slate-700 border-slate-200'
                                                                                    }`}
                                                                                >
                                                                                    <span className="font-mono font-semibold">{jamKey.includes(':') ? jamKey : `${jamKey}:00`}:</span>
                                                                                    <span className="font-bold">{tempVal}°C</span>
                                                                                    {isFirst && isMinute && <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded">Plug In</span>}
                                                                                    {isLast && isMinute && <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded">Plug Out</span>}
                                                                                </span>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </Fragment>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">Data tidak ditemukan.</div>
                        )
                    ) : (
                        <div className="py-8 text-center text-muted-foreground">Silakan input nomor kontainer untuk mencari data suhu.</div>
                    )}

                    <div className="mt-4 flex justify-center gap-1">
                        {records.links.map((link, i) =>
                            link.url ? (
                                <Button key={i} variant={link.active ? 'default' : 'outline'} onClick={() => router.get(link.url!)}>
                                    {link.label.replace(/&laquo; Previous|Next &raquo;/, (match) => {
                                        return match.includes('Previous') ? '← Prev' : match.includes('Next') ? 'Next →' : match;
                                    })}
                                </Button>
                            ) : (
                                <span key={i} className="px-3 py-1">
                                    ...
                                </span>
                            ),
                        )}
                    </div>
                </div>
            </TemperatureRecordsLayout>
        </AppLayout>
    );
}
