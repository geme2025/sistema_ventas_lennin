<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\Venta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class VentaController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Venta::with(['cliente', 'usuario']);

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

        if ($request->has('fecha_desde') && $request->fecha_desde) {
            $query->whereDate('fecha_venta', '>=', $request->fecha_desde);
        }

        if ($request->has('fecha_hasta') && $request->fecha_hasta) {
            $query->whereDate('fecha_venta', '<=', $request->fecha_hasta);
        }

        if ($request->has('estado') && $request->estado) {
            $query->where('estado', $request->estado);
        }

        if ($request->has('metodo_pago') && $request->metodo_pago) {
            $query->where('metodo_pago', $request->metodo_pago);
        }

        $ventas = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        // Estadísticas
        $hoy = now()->format('Y-m-d');
        $ventasHoy = Venta::whereDate('fecha_venta', $hoy)
            ->where('estado', 'completada')
            ->sum('total');

        $ventasMes = Venta::whereMonth('fecha_venta', now()->month)
            ->whereYear('fecha_venta', now()->year)
            ->where('estado', 'completada')
            ->sum('total');

        return Inertia::render('ventas/index', [
            'ventas' => $ventas,
            'filters' => $request->only(['search', 'fecha_desde', 'fecha_hasta', 'estado', 'metodo_pago']),
            'estadisticas' => [
                'ventas_hoy' => $ventasHoy,
                'ventas_mes' => $ventasMes,
            ],
        ]);
    }

    public function create(): Response
    {
        $clientes = Cliente::where('estado', true)
            ->orderBy('apellidos')
            ->get(['id', 'tipo_documento', 'numero_documento', 'nombres', 'apellidos']);

        $productos = Producto::where('estado', true)
            ->where('stock', '>', 0)
            ->with('categoria:id,nombre')
            ->orderBy('nombre')
            ->get(['id', 'codigo', 'nombre', 'precio_venta', 'stock', 'categoria_id']);

        return Inertia::render('ventas/create', [
            'clientes' => $clientes,
            'productos' => $productos,
            'numero_venta' => Venta::generarNumeroVenta(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id' => 'nullable|exists:clientes,id',
            'tipo_comprobante' => 'required|in:boleta,factura,ticket',
            'metodo_pago' => 'required|in:efectivo,tarjeta,yape,plin,transferencia',
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
            foreach ($validated['detalles'] as $detalle) {
                $subtotalItem = ($detalle['precio_unitario'] * $detalle['cantidad']) - ($detalle['descuento'] ?? 0);
                $subtotal += $subtotalItem;
            }

            $igv = $subtotal * 0.18; // 18% IGV
            $total = $subtotal + $igv;

            // Crear la venta
            $venta = Venta::create([
                'numero_venta' => Venta::generarNumeroVenta(),
                'cliente_id' => $validated['cliente_id'],
                'user_id' => Auth::id(),
                'fecha' => now(),
                'subtotal' => $subtotal,
                'igv' => $igv,
                'descuento' => 0,
                'total' => $total,
                'tipo_comprobante' => $validated['tipo_comprobante'],
                'metodo_pago' => $validated['metodo_pago'],
                'estado' => 'completada',
                'observaciones' => $validated['observaciones'],
            ]);

            // Crear detalles y actualizar stock
            foreach ($validated['detalles'] as $detalle) {
                $producto = Producto::find($detalle['producto_id']);

                if ($producto->stock < $detalle['cantidad']) {
                    throw new \Exception("Stock insuficiente para el producto: {$producto->nombre}");
                }

                $subtotalDetalle = ($detalle['precio_unitario'] * $detalle['cantidad']) - ($detalle['descuento'] ?? 0);

                DetalleVenta::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $detalle['producto_id'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'descuento' => $detalle['descuento'] ?? 0,
                    'subtotal' => $subtotalDetalle,
                ]);

                // Actualizar stock
                $producto->decrement('stock', $detalle['cantidad']);
            }

            // Simular pago (siempre exitoso por ahora)
            $pagoExitoso = $this->procesarPagoSimulado($validated['metodo_pago'], $total);

            if (!$pagoExitoso) {
                throw new \Exception('Error al procesar el pago');
            }

            DB::commit();

            return redirect()->route('ventas.show', $venta)
                ->with('success', 'Venta registrada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    public function show(Venta $venta): Response
    {
        $venta->load(['cliente', 'usuario', 'detalles.producto']);

        return Inertia::render('ventas/show', [
            'venta' => $venta,
        ]);
    }

    public function anular(Venta $venta)
    {
        if ($venta->estado === 'anulada') {
            return back()->with('error', 'La venta ya está anulada.');
        }

        try {
            DB::beginTransaction();

            // Restaurar stock
            foreach ($venta->detalles as $detalle) {
                $detalle->producto->increment('stock', $detalle->cantidad);
            }

            $venta->update(['estado' => 'anulada']);

            DB::commit();

            return back()->with('success', 'Venta anulada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error al anular la venta.');
        }
    }

    /**
     * Simula el procesamiento de pago
     * En producción, aquí se integraría con pasarelas de pago reales
     */
    private function procesarPagoSimulado(string $metodoPago, float $monto): bool
    {
        // Simulación de pago - siempre retorna true
        // En producción, integrar con:
        // - Yape/Plin: APIs de BCP/Interbank
        // - Tarjeta: Culqi, MercadoPago, etc.
        // - Transferencia: Validación manual

        // Simular delay de procesamiento
        // usleep(500000); // 0.5 segundos

        return true;
    }

    public function reporteDiario(Request $request)
    {
        $fecha = $request->get('fecha', now()->format('Y-m-d'));

        $ventas = Venta::with(['cliente', 'detalles.producto'])
            ->whereDate('fecha_venta', $fecha)
            ->where('estado', 'completada')
            ->get();

        $totales = [
            'cantidad' => $ventas->count(),
            'subtotal' => $ventas->sum('subtotal'),
            'igv' => $ventas->sum('igv'),
            'total' => $ventas->sum('total'),
        ];

        $porMetodoPago = $ventas->groupBy('metodo_pago')->map(function ($group) {
            return [
                'cantidad' => $group->count(),
                'total' => $group->sum('total'),
            ];
        });

        return Inertia::render('ventas/reporte-diario', [
            'fecha' => $fecha,
            'ventas' => $ventas,
            'totales' => $totales,
            'por_metodo_pago' => $porMetodoPago,
        ]);
    }
}
