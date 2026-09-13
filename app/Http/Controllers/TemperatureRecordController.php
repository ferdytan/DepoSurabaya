<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TemperatureRecordController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status', 'active');
        $perPage = (int) $request->input('per_page', 15);
        if ($perPage < 5 || $perPage > 100) {
            $perPage = 15;
        }

        // Kriteria kontainer yang memerlukan rekam suhu
        $tempCondition = function ($q) {
            $q->whereHas('product', function ($p) {
                $p->where('requires_temperature', 1)
                  ->orWhere('service_type', 'LIKE', '%plug%')
                  ->orWhere('service_type', 'LIKE', '%reefer%')
                  ->orWhere('service_type', 'LIKE', '%suhu%');
            })->orWhereHas('additionalProducts', function ($p) {
                $p->where('requires_temperature', 1)
                  ->orWhere('service_type', 'LIKE', '%plug%')
                  ->orWhere('service_type', 'LIKE', '%reefer%')
                  ->orWhere('service_type', 'LIKE', '%suhu%');
            })->orWhereHas('rekamSuhu');
        };

        // Hitung total kontainer berdasarkan status
        $activeCount = OrderItem::where($tempCondition)->whereNull('exit_date')->count();
        $allCount = OrderItem::where($tempCondition)->count();
        $outCount = OrderItem::where($tempCondition)->whereNotNull('exit_date')->count();

        $query = OrderItem::query();

        if ($search && trim($search) !== '') {
            $searchTerm = trim($search);
            $query->where(function ($q) use ($searchTerm) {
                $q->where('container_number', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('commodity', 'LIKE', "%{$searchTerm}%")
                  ->orWhereHas('order', function ($oq) use ($searchTerm) {
                      $oq->where('order_id', 'LIKE', "%{$searchTerm}%")
                         ->orWhere('no_aju', 'LIKE', "%{$searchTerm}%")
                         ->orWhereHas('customer', function ($cq) use ($searchTerm) {
                             $cq->where('name', 'LIKE', "%{$searchTerm}%");
                         })
                         ->orWhereHas('shipper', function ($sq) use ($searchTerm) {
                             $sq->where('name', 'LIKE', "%{$searchTerm}%");
                         });
                  });
            });
        } else {
            $query->where($tempCondition);
        }

        // Filter status Depo
        if ($status === 'active') {
            $query->whereNull('exit_date');
        } elseif ($status === 'out') {
            $query->whereNotNull('exit_date');
        }

        $records = $query->with([
            'order:id,order_id,no_aju,customer_id,shipper_id',
            'order.customer:id,name',
            'order.shipper:id,name',
            'product:id,service_type,requires_temperature',
            'additionalProducts:id,service_type,requires_temperature',
            'rekamSuhu' => function ($q) {
                $q->orderBy('tanggal', 'desc');
            },
        ])
        ->orderByRaw('CASE WHEN exit_date IS NULL THEN 0 ELSE 1 END')
        ->orderByDesc('entry_date')
        ->paginate($perPage)
        ->withQueryString();

        return Inertia::render('temperature-records/index', [
            'records' => $records,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'per_page' => $perPage,
            ],
            'counts' => [
                'active' => $activeCount,
                'all' => $allCount,
                'out' => $outCount,
            ],
        ]);
    }

    /**
     * Catat Start Plug In (Real-Time atau Kustom)
     */
    public function recordPlugIn(Request $request, OrderItem $orderItem)
    {
        $time = $request->filled('time')
            ? Carbon::parse($request->input('time'), 'Asia/Jakarta')
            : Carbon::now('Asia/Jakarta');

        $orderItem->start_plug_in = $time;
        $orderItem->plug_out = null;
        $orderItem->plug_duration_minutes = null;
        $orderItem->total_shifts = null;
        $orderItem->save();

        return redirect()->back()->with('success', "Start Plug In untuk kontainer {$orderItem->container_number} berhasil dicatat pada {$time->format('d/m/Y H:i:s')} WIB.");
    }

    /**
     * Catat Plug Out (Real-Time atau Kustom) dan otomatis hitung shift
     */
    public function recordPlugOut(Request $request, OrderItem $orderItem)
    {
        if (!$orderItem->start_plug_in) {
            return redirect()->back()->with('error', "Kontainer {$orderItem->container_number} belum memiliki catatan Start Plug In.");
        }

        $time = $request->filled('time')
            ? Carbon::parse($request->input('time'), 'Asia/Jakarta')
            : Carbon::now('Asia/Jakarta');

        $start = Carbon::parse($orderItem->start_plug_in, 'Asia/Jakarta');

        if ($time->lt($start)) {
            return redirect()->back()->with('error', 'Waktu Plug Out tidak boleh lebih awal dari Start Plug In.');
        }

        $calc = OrderItem::calculateShifts($start, $time);

        $orderItem->plug_out = $time;
        $orderItem->plug_duration_minutes = $calc['duration_minutes'];
        $orderItem->total_shifts = $calc['total_shifts'];
        $orderItem->save();

        $durasiJam = floor($calc['duration_minutes'] / 60);
        $durasiMenit = $calc['duration_minutes'] % 60;
        $durasiStr = "{$durasiJam} Jam {$durasiMenit} Menit";

        return redirect()->back()->with('success', "Plug Out kontainer {$orderItem->container_number} berhasil dicatat: {$time->format('d/m/Y H:i:s')} WIB. Durasi: {$durasiStr} ({$calc['total_shifts']} Shift).");
    }

    /**
     * Update Manual Waktu Plug In & Plug Out
     */
    public function updatePlugTimes(Request $request, OrderItem $orderItem)
    {
        $validated = $request->validate([
            'start_plug_in' => ['nullable', 'date'],
            'plug_out' => ['nullable', 'date'],
        ]);

        $start = !empty($validated['start_plug_in'])
            ? Carbon::parse($validated['start_plug_in'], 'Asia/Jakarta')
            : null;
        $out = !empty($validated['plug_out'])
            ? Carbon::parse($validated['plug_out'], 'Asia/Jakarta')
            : null;

        if ($out && !$start) {
            return redirect()->back()->with('error', 'Harap masukkan Start Plug In terlebih dahulu sebelum Plug Out.');
        }

        if ($start && $out && $out->lt($start)) {
            return redirect()->back()->with('error', 'Waktu Plug Out tidak boleh lebih awal dari Start Plug In.');
        }

        $orderItem->start_plug_in = $start;
        $orderItem->plug_out = $out;

        if ($start && $out) {
            $calc = OrderItem::calculateShifts($start, $out);
            $orderItem->plug_duration_minutes = $calc['duration_minutes'];
            $orderItem->total_shifts = $calc['total_shifts'];
        } else {
            $orderItem->plug_duration_minutes = null;
            $orderItem->total_shifts = null;
        }

        $orderItem->save();

        return redirect()->back()->with('success', "Waktu Plug In & Out kontainer {$orderItem->container_number} berhasil diperbarui.");
    }

    /**
     * Reset Status Plug In & Out Kontainer
     */
    public function resetPlug(Request $request, OrderItem $orderItem)
    {
        $orderItem->start_plug_in = null;
        $orderItem->plug_out = null;
        $orderItem->plug_duration_minutes = null;
        $orderItem->total_shifts = null;
        $orderItem->save();

        return redirect()->back()->with('success', "Status Plug In & Out kontainer {$orderItem->container_number} berhasil di-reset.");
    }
}
