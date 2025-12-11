<?php

namespace Database\Seeders;

use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Producto;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class VentaSeeder extends Seeder
{
    public function run(): void
    {
        $ventas = [
            // Venta 1 - Completada
            [
                'venta' => [
                    'cliente_id' => 1,
                    'user_id' => 1,
                    'numero_venta' => 'VTA-' . Carbon::now()->format('Ymd') . '-001',
                    'fecha_venta' => Carbon::now()->subDays(5),
                    'metodo_pago' => 'efectivo',
                    'estado' => 'completada',
                    'observaciones' => 'Venta navideña',
                ],
                'detalles' => [
                    ['producto_id' => 1, 'cantidad' => 2],  // Barbie
                    ['producto_id' => 4, 'cantidad' => 1],  // Hot Wheels
                    ['producto_id' => 14, 'cantidad' => 1], // Pikachu
                ],
            ],
            // Venta 2 - Completada
            [
                'venta' => [
                    'cliente_id' => 2,
                    'user_id' => 2,
                    'numero_venta' => 'VTA-' . Carbon::now()->format('Ymd') . '-002',
                    'fecha_venta' => Carbon::now()->subDays(4),
                    'metodo_pago' => 'tarjeta',
                    'estado' => 'completada',
                    'observaciones' => null,
                ],
                'detalles' => [
                    ['producto_id' => 7, 'cantidad' => 1],  // Spider-Man
                    ['producto_id' => 8, 'cantidad' => 1],  // Batman
                ],
            ],
            // Venta 3 - Completada
            [
                'venta' => [
                    'cliente_id' => 3,
                    'user_id' => 1,
                    'numero_venta' => 'VTA-' . Carbon::now()->format('Ymd') . '-003',
                    'fecha_venta' => Carbon::now()->subDays(3),
                    'metodo_pago' => 'yape',
                    'estado' => 'completada',
                    'observaciones' => 'Regalo de cumpleaños',
                ],
                'detalles' => [
                    ['producto_id' => 16, 'cantidad' => 1], // LEGO City
                    ['producto_id' => 10, 'cantidad' => 2], // Monopoly
                ],
            ],
            // Venta 4 - Completada
            [
                'venta' => [
                    'cliente_id' => 4,
                    'user_id' => 2,
                    'numero_venta' => 'VTA-' . Carbon::now()->format('Ymd') . '-004',
                    'fecha_venta' => Carbon::now()->subDays(2),
                    'metodo_pago' => 'transferencia',
                    'estado' => 'completada',
                    'observaciones' => 'Pedido mayorista',
                ],
                'detalles' => [
                    ['producto_id' => 11, 'cantidad' => 10], // UNO
                    ['producto_id' => 12, 'cantidad' => 5],  // Jenga
                    ['producto_id' => 13, 'cantidad' => 3],  // Oso peluche
                ],
            ],
            // Venta 5 - Completada
            [
                'venta' => [
                    'cliente_id' => 5,
                    'user_id' => 3,
                    'numero_venta' => 'VTA-' . Carbon::now()->format('Ymd') . '-005',
                    'fecha_venta' => Carbon::now()->subDays(1),
                    'metodo_pago' => 'plin',
                    'estado' => 'completada',
                    'observaciones' => null,
                ],
                'detalles' => [
                    ['producto_id' => 19, 'cantidad' => 1], // Microscopio
                    ['producto_id' => 21, 'cantidad' => 2], // Rompecabezas
                ],
            ],
            // Venta 6 - Completada (hoy)
            [
                'venta' => [
                    'cliente_id' => 6,
                    'user_id' => 1,
                    'numero_venta' => 'VTA-' . Carbon::now()->format('Ymd') . '-006',
                    'fecha_venta' => Carbon::now(),
                    'metodo_pago' => 'efectivo',
                    'estado' => 'completada',
                    'observaciones' => 'Cliente frecuente',
                ],
                'detalles' => [
                    ['producto_id' => 28, 'cantidad' => 1], // Tablet infantil
                    ['producto_id' => 27, 'cantidad' => 2], // Walkie Talkie
                ],
            ],
            // Venta 7 - Pendiente
            [
                'venta' => [
                    'cliente_id' => 7,
                    'user_id' => 2,
                    'numero_venta' => 'VTA-' . Carbon::now()->format('Ymd') . '-007',
                    'fecha_venta' => Carbon::now(),
                    'metodo_pago' => 'transferencia',
                    'estado' => 'pendiente',
                    'observaciones' => 'Esperando confirmación de pago',
                ],
                'detalles' => [
                    ['producto_id' => 17, 'cantidad' => 1], // LEGO Star Wars
                ],
            ],
            // Venta 8 - Anulada
            [
                'venta' => [
                    'cliente_id' => 8,
                    'user_id' => 1,
                    'numero_venta' => 'VTA-' . Carbon::now()->format('Ymd') . '-008',
                    'fecha_venta' => Carbon::now()->subDays(3),
                    'metodo_pago' => 'efectivo',
                    'estado' => 'anulada',
                    'observaciones' => 'Cliente canceló el pedido',
                ],
                'detalles' => [
                    ['producto_id' => 2, 'cantidad' => 1], // Casa de muñecas
                ],
            ],
        ];

        foreach ($ventas as $ventaData) {
            // Calcular totales
            $subtotal = 0;
            $detallesCalculados = [];

            foreach ($ventaData['detalles'] as $detalle) {
                $producto = Producto::find($detalle['producto_id']);
                $precioUnitario = $producto->precio_venta;
                $detalleSubtotal = $precioUnitario * $detalle['cantidad'];
                $subtotal += $detalleSubtotal;

                $detallesCalculados[] = [
                    'producto_id' => $detalle['producto_id'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $precioUnitario,
                    'descuento' => 0,
                    'subtotal' => $detalleSubtotal,
                ];

                // Solo descontar stock si la venta está completada
                if ($ventaData['venta']['estado'] === 'completada') {
                    $producto->decrement('stock', $detalle['cantidad']);
                }
            }

            $igv = $subtotal * 0.18;
            $total = $subtotal + $igv;

            // Crear venta
            $venta = Venta::create(array_merge($ventaData['venta'], [
                'subtotal' => $subtotal,
                'igv' => $igv,
                'total' => $total,
            ]));

            // Crear detalles
            foreach ($detallesCalculados as $detalle) {
                DetalleVenta::create(array_merge($detalle, [
                    'venta_id' => $venta->id,
                ]));
            }
        }
    }
}
