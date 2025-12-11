<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClienteApiController extends Controller
{
    /**
     * Listar todos los clientes
     */
    public function index(Request $request): JsonResponse
    {
        $query = Cliente::query();

        // Filtro por búsqueda
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nombres', 'like', "%{$search}%")
                  ->orWhere('apellidos', 'like', "%{$search}%")
                  ->orWhere('numero_documento', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtro por tipo de documento
        if ($request->has('tipo_documento') && $request->tipo_documento) {
            $query->where('tipo_documento', $request->tipo_documento);
        }

        // Filtro por estado
        if ($request->has('estado') && $request->estado !== '') {
            $query->where('estado', $request->boolean('estado'));
        }

        // Ordenamiento
        $sortBy = $request->get('sort_by', 'apellidos');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginación
        if ($request->has('per_page')) {
            $clientes = $query->paginate($request->get('per_page', 10));
        } else if ($request->has('all')) {
            $clientes = $query->get();
        } else {
            $clientes = $query->paginate(10);
        }

        return response()->json([
            'success' => true,
            'data' => $clientes,
        ]);
    }

    /**
     * Crear nuevo cliente
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tipo_documento' => 'required|string|max:20',
            'numero_documento' => 'required|string|max:20|unique:clientes',
            'nombres' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'direccion' => 'nullable|string|max:255',
            'estado' => 'boolean',
        ]);

        $cliente = Cliente::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cliente creado exitosamente',
            'data' => $cliente,
        ], 201);
    }

    /**
     * Mostrar un cliente
     */
    public function show(Cliente $cliente): JsonResponse
    {
        $cliente->load(['ventas' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(10);
        }]);

        return response()->json([
            'success' => true,
            'data' => $cliente,
        ]);
    }

    /**
     * Actualizar cliente
     */
    public function update(Request $request, Cliente $cliente): JsonResponse
    {
        $validated = $request->validate([
            'tipo_documento' => 'required|string|max:20',
            'numero_documento' => 'required|string|max:20|unique:clientes,numero_documento,' . $cliente->id,
            'nombres' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'direccion' => 'nullable|string|max:255',
            'estado' => 'boolean',
        ]);

        $cliente->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cliente actualizado exitosamente',
            'data' => $cliente,
        ]);
    }

    /**
     * Eliminar cliente
     */
    public function destroy(Cliente $cliente): JsonResponse
    {
        if ($cliente->ventas()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el cliente porque tiene ventas asociadas.',
            ], 422);
        }

        $cliente->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cliente eliminado exitosamente',
        ]);
    }

    /**
     * Buscar clientes (para autocompletado)
     */
    public function buscar(Request $request): JsonResponse
    {
        $search = $request->get('q', '');

        $clientes = Cliente::where('estado', true)
            ->where(function ($query) use ($search) {
                $query->where('nombres', 'like', "%{$search}%")
                      ->orWhere('apellidos', 'like', "%{$search}%")
                      ->orWhere('numero_documento', 'like', "%{$search}%");
            })
            ->select('id', 'tipo_documento', 'numero_documento', 'nombres', 'apellidos', 'telefono', 'email')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $clientes,
        ]);
    }
}
