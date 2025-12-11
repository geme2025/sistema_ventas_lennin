<?php

use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\VentaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $hoy = now()->format('Y-m-d');

        return Inertia::render('dashboard', [
            'estadisticas' => [
                'ventas_hoy' => \App\Models\Venta::whereDate('fecha_venta', $hoy)
                    ->where('estado', 'completada')
                    ->sum('total'),
                'ventas_mes' => \App\Models\Venta::whereMonth('fecha_venta', now()->month)
                    ->whereYear('fecha_venta', now()->year)
                    ->where('estado', 'completada')
                    ->sum('total'),
                'productos_bajo_stock' => \App\Models\Producto::whereColumn('stock', '<=', 'stock_minimo')
                    ->where('estado', true)
                    ->count(),
                'total_clientes' => \App\Models\Cliente::where('estado', true)->count(),
                'total_productos' => \App\Models\Producto::where('estado', true)->count(),
                'ventas_pendientes' => \App\Models\Venta::where('estado', 'pendiente')->count(),
            ],
            'ultimas_ventas' => \App\Models\Venta::with(['cliente', 'usuario'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
            'productos_mas_vendidos' => \App\Models\DetalleVenta::select('producto_id')
                ->selectRaw('SUM(cantidad) as total_vendido')
                ->with('producto.categoria')
                ->groupBy('producto_id')
                ->orderByDesc('total_vendido')
                ->limit(5)
                ->get(),
        ]);
    })->name('dashboard');

    // Categorías
    Route::resource('categorias', CategoriaController::class)->except(['show']);

    // Productos
    Route::get('productos/buscar', [ProductoController::class, 'buscar'])->name('productos.buscar');
    Route::resource('productos', ProductoController::class);

    // Clientes
    Route::get('clientes/buscar', [ClienteController::class, 'buscar'])->name('clientes.buscar');
    Route::resource('clientes', ClienteController::class);

    // Ventas
    Route::get('ventas/reporte-diario', [VentaController::class, 'reporteDiario'])->name('ventas.reporte-diario');
     Route::resource('ventas', VentaController::class)->except(['edit', 'update', 'destroy']);
});

require __DIR__.'/settings.php';
