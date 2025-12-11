<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\Venta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class VentaApiController extends Controller
{
    /**
     * Listar todas las ventas
     */
    public function index(Request $request): JsonResponse
    {
        $query = Venta::with(['cliente', 'usuario']);

        // Filtro por búsqueda
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('numero_venta', 'like', "%{$search}%")
                  ->orWhereHas('cliente', function ($q2) use ($search) {
                      $q2->where('nombres', 'like', "%{$search}%")
                         ->orWhere('apellidos', 'like', "%{$search}%")
                         ->orWhere('numero_documento', 'like', "%{$search}%");
                  });
            });
        }

        // Filtro por fecha desde
        if ($request->has('fecha_desde') && $request->fecha_desde) {
            $query->whereDate('fecha_venta', '>=', $request->fecha_desde);
        }

        // Filtro por fecha hasta
        if ($request->has('fecha_hasta') && $request->fecha_hasta) {
            $query->whereDate('fecha_venta', '<=', $request->fecha_hasta);
        }

        // Filtro por estado
        if ($request->has('estado') && $request->estado) {
            $query->where('estado', $request->estado);
        }

        // Filtro por cliente
        if ($request->has('cliente_id') && $request->cliente_id) {
            $query->where('cliente_id', $request->cliente_id);
        }

        // Ordenamiento
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginación
        $perPage = $request->get('per_page', 10);
        $ventas = $query->paginate($perPage);

        // Estadísticas
        $hoy = now()->format('Y-m-d');
        $estadisticas = [
            'ventas_hoy' => Venta::whereDate('fecha_venta', $hoy)
                ->where('estado', 'completada')
                ->sum('total'),
            'ventas_mes' => Venta::whereMonth('fecha_venta', now()->month)
                ->whereYear('fecha_venta', now()->year)
                ->where('estado', 'completada')
                ->sum('total'),
            'total_ventas' => Venta::where('estado', 'completada')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $ventas,
            'estadisticas' => $estadisticas,
        ]);
    }

    /**
     * Crear nueva venta
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cliente_id' => 'nullable|exists:clientes,id',
            'observaciones' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.producto_id' => 'required|exists:productos,id',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'detalles.*.descuento' => 'nullable|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            // Calcular totales
            $subtotal = 0;
            $descuentoTotal = 0;

            foreach ($validated['detalles'] as $detalle) {
                $descuentoItem = $detalle['descuento'] ?? 0;
                $subtotalItem = ($detalle['precio_unitario'] * $detalle['cantidad']) - $descuentoItem;
                $subtotal += $subtotalItem;
                $descuentoTotal += $descuentoItem;
            }

            $impuesto = $subtotal * 0.18; // 18% IGV
            $total = $subtotal + $impuesto;

            // Crear la venta
            $venta = Venta::create([
                'numero_venta' => Venta::generarNumeroVenta(),
                'cliente_id' => $validated['cliente_id'],
                'user_id' => Auth::id(),
                'fecha_venta' => now(),
                'subtotal' => $subtotal,
                'descuento' => $descuentoTotal,
                'impuesto' => $impuesto,
                'total' => $total,
                'estado' => 'completada',
                'observaciones' => $validated['observaciones'] ?? null,
            ]);

            // Crear detalles y actualizar stock
            foreach ($validated['detalles'] as $detalle) {
                $producto = Producto::find($detalle['producto_id']);

                if ($producto->stock < $detalle['cantidad']) {
                    throw new \Exception("Stock insuficiente para el producto: {$producto->nombre}. Stock disponible: {$producto->stock}");
                }

                $descuentoItem = $detalle['descuento'] ?? 0;
                $subtotalDetalle = ($detalle['precio_unitario'] * $detalle['cantidad']) - $descuentoItem;

                DetalleVenta::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $detalle['producto_id'],
                    'codigo' => $producto->codigo,
                    'nombre' => $producto->nombre,
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'descuento' => $descuentoItem,
                    'subtotal' => $subtotalDetalle,
                ]);

                // Actualizar stock
                $producto->decrement('stock', $detalle['cantidad']);
            }

            DB::commit();

            // Cargar relaciones
            $venta->load(['cliente', 'usuario', 'detalles.producto']);

            return response()->json([
                'success' => true,
                'message' => 'Venta registrada exitosamente',
                'data' => $venta,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Mostrar una venta
     */
    public function show(Venta $venta): JsonResponse
    {
        $venta->load(['cliente', 'usuario', 'detalles.producto']);

        return response()->json([
            'success' => true,
            'data' => $venta,
        ]);
    }

    /**
     * Anular una venta
     */
    public function anular(Venta $venta): JsonResponse
    {
        if ($venta->estado === 'anulada') {
            return response()->json([
                'success' => false,
                'message' => 'La venta ya está anulada.',
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Restaurar stock
            foreach ($venta->detalles as $detalle) {
                $detalle->producto->increment('stock', $detalle->cantidad);
            }

            $venta->update(['estado' => 'anulada']);

            DB::commit();

            $venta->load(['cliente', 'usuario', 'detalles.producto']);

            return response()->json([
                'success' => true,
                'message' => 'Venta anulada exitosamente',
                'data' => $venta,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al anular la venta: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reporte diario de ventas
     */
    public function reporteDiario(Request $request): JsonResponse
    {
        $fecha = $request->get('fecha', now()->format('Y-m-d'));

        $ventas = Venta::with(['cliente', 'detalles.producto'])
            ->whereDate('fecha_venta', $fecha)
            ->where('estado', 'completada')
            ->get();

        $totales = [
            'cantidad_ventas' => $ventas->count(),
            'subtotal' => $ventas->sum('subtotal'),
            'impuesto' => $ventas->sum('impuesto'),
            'descuento' => $ventas->sum('descuento'),
            'total' => $ventas->sum('total'),
        ];

        // Productos más vendidos del día
        $productosMasVendidos = DetalleVenta::whereHas('venta', function ($q) use ($fecha) {
            $q->whereDate('fecha_venta', $fecha)->where('estado', 'completada');
        })
            ->select('producto_id')
            ->selectRaw('SUM(cantidad) as total_vendido')
            ->selectRaw('SUM(subtotal) as total_ingresos')
            ->with('producto:id,codigo,nombre')
            ->groupBy('producto_id')
            ->orderByDesc('total_vendido')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'fecha' => $fecha,
                'ventas' => $ventas,
                'totales' => $totales,
                'productos_mas_vendidos' => $productosMasVendidos,
            ],
        ]);
    }

    /**
     * Reporte mensual de ventas
     */
    public function reporteMensual(Request $request): JsonResponse
    {
        $mes = $request->get('mes', now()->month);
        $anio = $request->get('anio', now()->year);

        $ventas = Venta::with(['cliente'])
            ->whereMonth('fecha_venta', $mes)
            ->whereYear('fecha_venta', $anio)
            ->where('estado', 'completada')
            ->orderBy('fecha_venta', 'desc')
            ->get();

        $totales = [
            'cantidad_ventas' => $ventas->count(),
            'subtotal' => $ventas->sum('subtotal'),
            'impuesto' => $ventas->sum('impuesto'),
            'descuento' => $ventas->sum('descuento'),
            'total' => $ventas->sum('total'),
        ];

        // Ventas por día del mes
        $ventasPorDia = Venta::whereMonth('fecha_venta', $mes)
            ->whereYear('fecha_venta', $anio)
            ->where('estado', 'completada')
            ->selectRaw('DATE(fecha_venta) as fecha')
            ->selectRaw('COUNT(*) as cantidad')
            ->selectRaw('SUM(total) as total')
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'mes' => $mes,
                'anio' => $anio,
                'ventas' => $ventas,
                'totales' => $totales,
                'ventas_por_dia' => $ventasPorDia,
            ],
        ]);
    }
}
