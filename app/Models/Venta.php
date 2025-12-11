<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'ventas';

    protected $fillable = [
        'numero_venta',
        'cliente_id',
        'user_id',
        'fecha_venta',
        'subtotal',
        'descuento',
        'impuesto',
        'igv',
        'total',
        'metodo_pago',
        'estado',
        'observaciones',
    ];

    protected $casts = [
        'fecha_venta' => 'datetime',
        'subtotal' => 'decimal:2',
        'descuento' => 'decimal:2',
        'impuesto' => 'decimal:2',
        'igv' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleVenta::class);
    }

    public static function generarNumeroVenta(): string
    {
        $year = date('Y');
        $month = date('m');
        $ultimaVenta = self::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->orderBy('id', 'desc')
            ->first();

        $numero = $ultimaVenta ? intval(substr($ultimaVenta->numero_venta, -6)) + 1 : 1;

        return 'V' . $year . $month . str_pad($numero, 6, '0', STR_PAD_LEFT);
    }
}
