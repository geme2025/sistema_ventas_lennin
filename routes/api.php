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
});

// Rutas de autenticación (públicas)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'updatePassword']);
    });

    // Dashboard
    Route::get('/dashboard', [DashboardApiController::class, 'index']);
    Route::get('/dashboard/estadisticas', [DashboardApiController::class, 'estadisticas']);

    // Categorías
    Route::apiResource('categorias', CategoriaApiController::class);

    // Productos
    Route::get('/productos/buscar', [ProductoApiController::class, 'buscar']);
    Route::get('/productos/bajo-stock', [ProductoApiController::class, 'bajoStock']);
    Route::apiResource('productos', ProductoApiController::class);

    // Clientes
    Route::get('/clientes/buscar', [ClienteApiController::class, 'buscar']);
    Route::apiResource('clientes', ClienteApiController::class);

    // Ventas
    Route::get('/ventas/reporte-diario', [VentaApiController::class, 'reporteDiario']);
    Route::get('/ventas/reporte-mensual', [VentaApiController::class, 'reporteMensual']);
    Route::post('/ventas/{venta}/anular', [VentaApiController::class, 'anular']);
    Route::apiResource('ventas', VentaApiController::class)->except(['update', 'destroy']);
});
