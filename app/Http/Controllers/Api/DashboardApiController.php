<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\Venta;
use Illuminate\Http\JsonResponse;

class DashboardApiController extends Controller
{
    /**
     * Obtener datos del dashboard
     */
    public function index(): JsonResponse
    {
        $hoy = now()->format('Y-m-d');

        $estadisticas = [
            'ventas_hoy' => Venta::whereDate('fecha_venta', $hoy)
                ->where('estado', 'completada')
                ->sum('total'),
            'ventas_mes' => Venta::whereMonth('fecha_venta', now()->month)
                ->whereYear('fecha_venta', now()->year)
                ->where('estado', 'completada')
                ->sum('total'),
            'productos_bajo_stock' => Producto::whereColumn('stock', '<=', 'stock_minimo')
                ->where('estado', true)
                ->count(),
            'total_clientes' => Cliente::where('estado', true)->count(),
            'total_productos' => Producto::where('estado', true)->count(),
            'ventas_pendientes' => Venta::where('estado', 'pendiente')->count(),
        ];

        $ultimas_ventas = Venta::with(['cliente', 'usuario'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $productos_mas_vendidos = DetalleVenta::select('producto_id')
            ->selectRaw('SUM(cantidad) as total_vendido')
            ->with('producto.categoria')
            ->groupBy('producto_id')
            ->orderByDesc('total_vendido')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'estadisticas' => $estadisticas,
                'ultimas_ventas' => $ultimas_ventas,
                'productos_mas_vendidos' => $productos_mas_vendidos,
            ],
        ]);
    }

    /**
     * Obtener solo estadísticas
     */
    public function estadisticas(): JsonResponse
    {
        $hoy = now()->format('Y-m-d');

        return response()->json([
            'success' => true,
            'data' => [
                'ventas_hoy' => Venta::whereDate('fecha_venta', $hoy)
                    ->where('estado', 'completada')
                    ->sum('total'),
                'ventas_mes' => Venta::whereMonth('fecha_venta', now()->month)
                    ->whereYear('fecha_venta', now()->year)
                    ->where('estado', 'completada')
                    ->sum('total'),
                'ventas_semana' => Venta::whereBetween('fecha_venta', [
                    now()->startOfWeek(),
                    now()->endOfWeek()
                ])
                    ->where('estado', 'completada')
                    ->sum('total'),
                'productos_bajo_stock' => Producto::whereColumn('stock', '<=', 'stock_minimo')
                    ->where('estado', true)
                    ->count(),
                'total_clientes' => Cliente::where('estado', true)->count(),
                'total_productos' => Producto::where('estado', true)->count(),
                'ventas_pendientes' => Venta::where('estado', 'pendiente')->count(),
                'total_ventas_completadas' => Venta::where('estado', 'completada')->count(),
            ],
        ]);
    }
}
