<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoriaApiController;
use App\Http\Controllers\Api\ClienteApiController;
use App\Http\Controllers\Api\DashboardApiController;
use App\Http\Controllers\Api\ProductoApiController;
use App\Http\Controllers\Api\VentaApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Rutas API para el frontend separado (React, Vue, Mobile, etc.)
| Todas las rutas usan el prefijo /api automáticamente
|
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API funcionando correctamente',
        'timestamp' => now()->toISOString(),
    ]);
})->name('api.health');

// Rutas de autenticación (públicas)
Route::prefix('auth')->name('api.auth.')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
});

// Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::prefix('auth')->name('api.auth.')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/me', [AuthController::class, 'me'])->name('me');
        Route::put('/profile', [AuthController::class, 'updateProfile'])->name('profile');
        Route::put('/password', [AuthController::class, 'updatePassword'])->name('password');
    });

    // Dashboard
    Route::get('/dashboard', [DashboardApiController::class, 'index'])->name('api.dashboard');
    Route::get('/dashboard/estadisticas', [DashboardApiController::class, 'estadisticas'])->name('api.dashboard.estadisticas');

    // Categorías - con nombres prefijados
    Route::get('/productos/buscar', [ProductoApiController::class, 'buscar'])->name('api.productos.buscar');
    Route::get('/productos/bajo-stock', [ProductoApiController::class, 'bajoStock'])->name('api.productos.bajo-stock');
    Route::get('/clientes/buscar', [ClienteApiController::class, 'buscar'])->name('api.clientes.buscar');
    Route::get('/ventas/reporte-diario', [VentaApiController::class, 'reporteDiario'])->name('api.ventas.reporte-diario');
    Route::get('/ventas/reporte-mensual', [VentaApiController::class, 'reporteMensual'])->name('api.ventas.reporte-mensual');
    Route::post('/ventas/{venta}/anular', [VentaApiController::class, 'anular'])->name('api.ventas.anular');

    // Resources con nombres prefijados con 'api.'
    Route::apiResource('categorias', CategoriaApiController::class)->names('api.categorias');
    Route::apiResource('productos', ProductoApiController::class)->names('api.productos');
    Route::apiResource('clientes', ClienteApiController::class)->names('api.clientes');
    Route::apiResource('ventas', VentaApiController::class)->names('api.ventas')->except(['update', 'destroy']);
});
