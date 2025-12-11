<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Agregar campos faltantes a ventas
        Schema::table('ventas', function (Blueprint $table) {
            if (!Schema::hasColumn('ventas', 'descuento')) {
                $table->decimal('descuento', 10, 2)->default(0)->after('subtotal');
            }
            if (!Schema::hasColumn('ventas', 'impuesto')) {
                $table->decimal('impuesto', 10, 2)->default(0)->after('descuento');
            }
        });

        // Agregar campos faltantes a detalle_ventas
        Schema::table('detalle_ventas', function (Blueprint $table) {
            if (!Schema::hasColumn('detalle_ventas', 'codigo')) {
                $table->string('codigo', 50)->nullable()->after('producto_id');
            }
            if (!Schema::hasColumn('detalle_ventas', 'nombre')) {
                $table->string('nombre', 150)->nullable()->after('codigo');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn(['descuento', 'impuesto']);
        });

        Schema::table('detalle_ventas', function (Blueprint $table) {
            $table->dropColumn(['codigo', 'nombre']);
        });
    }
};
