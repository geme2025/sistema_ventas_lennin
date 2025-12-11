<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            [
                'nombre' => 'Muñecas y Accesorios',
                'descripcion' => 'Muñecas, casas de muñecas y accesorios relacionados',
                'estado' => true,
            ],
            [
                'nombre' => 'Vehículos y Pistas',
                'descripcion' => 'Carros, motos, aviones, trenes y pistas de carreras',
                'estado' => true,
            ],
            [
                'nombre' => 'Figuras de Acción',
                'descripcion' => 'Superhéroes, personajes de películas y series animadas',
                'estado' => true,
            ],
            [
                'nombre' => 'Juegos de Mesa',
                'descripcion' => 'Juegos educativos, estrategia y diversión familiar',
                'estado' => true,
            ],
            [
                'nombre' => 'Peluches',
                'descripcion' => 'Animales de peluche y personajes suaves',
                'estado' => true,
            ],
            [
                'nombre' => 'LEGO y Bloques',
                'descripcion' => 'Sets de construcción LEGO y bloques armables',
                'estado' => true,
            ],
            [
                'nombre' => 'Juguetes Educativos',
                'descripcion' => 'Juguetes para el desarrollo cognitivo y aprendizaje',
                'estado' => true,
            ],
            [
                'nombre' => 'Deportes y Aire Libre',
                'descripcion' => 'Pelotas, bicicletas, patines y juegos al aire libre',
                'estado' => true,
            ],
            [
                'nombre' => 'Electrónicos',
                'descripcion' => 'Tablets infantiles, robots y juguetes tecnológicos',
                'estado' => true,
            ],
            [
                'nombre' => 'Disfraces y Accesorios',
                'descripcion' => 'Disfraces de personajes y accesorios para juego de roles',
                'estado' => true,
            ],
        ];

        foreach ($categorias as $categoria) {
            Categoria::create($categoria);
        }
    }
}
