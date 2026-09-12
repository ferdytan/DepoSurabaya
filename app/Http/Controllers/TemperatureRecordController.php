<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
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
}
