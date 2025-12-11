<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoriaApiController extends Controller
{
    /**
     * Listar todas las categorías
     */
    public function index(Request $request): JsonResponse
    {
        $query = Categoria::query();

        // Filtro por búsqueda
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('descripcion', 'like', "%{$search}%");
            });
        }

        // Filtro por estado
        if ($request->has('estado') && $request->estado !== '') {
            $query->where('estado', $request->boolean('estado'));
        }

        // Ordenamiento
        $sortBy = $request->get('sort_by', 'nombre');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginación o lista completa
        if ($request->has('per_page')) {
            $categorias = $query->paginate($request->get('per_page', 10));
        } else if ($request->has('all')) {
            $categorias = $query->get();
        } else {
            $categorias = $query->paginate(10);
        }

        return response()->json([
            'success' => true,
            'data' => $categorias,
        ]);
    }

    /**
     * Crear nueva categoría
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:categorias',
            'descripcion' => 'nullable|string|max:500',
            'estado' => 'boolean',
        ]);

        $categoria = Categoria::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Categoría creada exitosamente',
            'data' => $categoria,
        ], 201);
    }

    /**
     * Mostrar una categoría
     */
    public function show(Categoria $categoria): JsonResponse
    {
        $categoria->load('productos');

        return response()->json([
            'success' => true,
            'data' => $categoria,
        ]);
    }

    /**
     * Actualizar categoría
     */
    public function update(Request $request, Categoria $categoria): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:categorias,nombre,' . $categoria->id,
            'descripcion' => 'nullable|string|max:500',
            'estado' => 'boolean',
        ]);

        $categoria->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Categoría actualizada exitosamente',
            'data' => $categoria,
        ]);
    }

    /**
     * Eliminar categoría
     */
    public function destroy(Categoria $categoria): JsonResponse
    {
        if ($categoria->productos()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar la categoría porque tiene productos asociados.',
            ], 422);
        }

        $categoria->delete();

        return response()->json([
            'success' => true,
            'message' => 'Categoría eliminada exitosamente',
        ]);
    }
}
