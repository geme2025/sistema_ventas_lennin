<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductoApiController extends Controller
{
    /**
     * Listar todos los productos
     */
    public function index(Request $request): JsonResponse
    {
        $query = Producto::with('categoria');

        // Filtro por búsqueda
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('codigo', 'like', "%{$search}%")
                  ->orWhere('descripcion', 'like', "%{$search}%");
            });
        }

        // Filtro por categoría
        if ($request->has('categoria_id') && $request->categoria_id) {
            $query->where('categoria_id', $request->categoria_id);
        }

        // Filtro por estado
        if ($request->has('estado') && $request->estado !== '') {
            $query->where('estado', $request->boolean('estado'));
        }

        // Filtro por stock bajo
        if ($request->has('stock_bajo') && $request->boolean('stock_bajo')) {
            $query->whereColumn('stock', '<=', 'stock_minimo');
        }

        // Ordenamiento
        $sortBy = $request->get('sort_by', 'nombre');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginación
        if ($request->has('per_page')) {
            $productos = $query->paginate($request->get('per_page', 10));
        } else if ($request->has('all')) {
            $productos = $query->get();
        } else {
            $productos = $query->paginate(10);
        }

        return response()->json([
            'success' => true,
            'data' => $productos,
        ]);
    }

    /**
     * Crear nuevo producto
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:50|unique:productos',
            'nombre' => 'required|string|max:150',
            'descripcion' => 'nullable|string|max:1000',
            'categoria_id' => 'required|exists:categorias,id',
            'precio_compra' => 'required|numeric|min:0',
            'precio_venta' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'stock_minimo' => 'required|integer|min:0',
            'estado' => 'boolean',
        ]);

        $producto = Producto::create($validated);
        $producto->load('categoria');

        return response()->json([
            'success' => true,
            'message' => 'Producto creado exitosamente',
            'data' => $producto,
        ], 201);
    }

    /**
     * Mostrar un producto
     */
    public function show(Producto $producto): JsonResponse
    {
        $producto->load('categoria');

        return response()->json([
            'success' => true,
            'data' => $producto,
        ]);
    }

    /**
     * Actualizar producto
     */
    public function update(Request $request, Producto $producto): JsonResponse
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:50|unique:productos,codigo,' . $producto->id,
            'nombre' => 'required|string|max:150',
            'descripcion' => 'nullable|string|max:1000',
            'categoria_id' => 'required|exists:categorias,id',
            'precio_compra' => 'required|numeric|min:0',
            'precio_venta' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'stock_minimo' => 'required|integer|min:0',
            'estado' => 'boolean',
        ]);

        $producto->update($validated);
        $producto->load('categoria');

        return response()->json([
            'success' => true,
            'message' => 'Producto actualizado exitosamente',
            'data' => $producto,
        ]);
    }

    /**
     * Eliminar producto
     */
    public function destroy(Producto $producto): JsonResponse
    {
        // Verificar si tiene ventas asociadas
        if ($producto->detalleVentas()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el producto porque tiene ventas asociadas.',
            ], 422);
        }

        $producto->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado exitosamente',
        ]);
    }

    /**
     * Buscar productos (para autocompletado)
     */
    public function buscar(Request $request): JsonResponse
    {
        $search = $request->get('q', '');

        $productos = Producto::where('estado', true)
            ->where('stock', '>', 0)
            ->where(function ($query) use ($search) {
                $query->where('nombre', 'like', "%{$search}%")
                      ->orWhere('codigo', 'like', "%{$search}%");
            })
            ->with('categoria:id,nombre')
            ->select('id', 'codigo', 'nombre', 'precio_venta', 'stock', 'categoria_id')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $productos,
        ]);
    }

    /**
     * Productos con stock bajo
     */
    public function bajoStock(): JsonResponse
    {
        $productos = Producto::with('categoria')
            ->whereColumn('stock', '<=', 'stock_minimo')
            ->where('estado', true)
            ->orderBy('stock', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $productos,
        ]);
    }
}
