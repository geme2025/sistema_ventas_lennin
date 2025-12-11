<?php

namespace Database\Seeders;

use App\Models\Cliente;
use Illuminate\Database\Seeder;

class ClienteSeeder extends Seeder
{
    public function run(): void
    {
        $clientes = [
            [
                'tipo_documento' => 'DNI',
                'numero_documento' => '72345678',
                'nombres' => 'María Elena',
                'apellidos' => 'García López',
                'telefono' => '987654321',
                'email' => 'maria.garcia@email.com',
                'direccion' => 'Av. Arequipa 1234, Lima',
                'estado' => true,
            ],
            [
                'tipo_documento' => 'DNI',
                'numero_documento' => '45678912',
                'nombres' => 'Carlos Alberto',
                'apellidos' => 'Rodríguez Pérez',
                'telefono' => '976543210',
                'email' => 'carlos.rodriguez@email.com',
                'direccion' => 'Jr. Cusco 567, Lima',
                'estado' => true,
            ],
            [
                'tipo_documento' => 'DNI',
                'numero_documento' => '34567891',
                'nombres' => 'Ana Patricia',
                'apellidos' => 'Martínez Torres',
                'telefono' => '965432109',
                'email' => 'ana.martinez@email.com',
                'direccion' => 'Calle Los Olivos 890, San Isidro',
                'estado' => true,
            ],
            [
                'tipo_documento' => 'RUC',
                'numero_documento' => '20123456789',
                'nombres' => 'Distribuidora',
                'apellidos' => 'Los Amigos SAC',
                'telefono' => '014567890',
                'email' => 'ventas@losamigos.com',
                'direccion' => 'Av. Industrial 456, Ate',
                'estado' => true,
            ],
            [
                'tipo_documento' => 'DNI',
                'numero_documento' => '56789123',
                'nombres' => 'Luis Fernando',
                'apellidos' => 'Sánchez Vargas',
                'telefono' => '954321098',
                'email' => 'luis.sanchez@email.com',
                'direccion' => 'Av. Brasil 234, Pueblo Libre',
                'estado' => true,
            ],
            [
                'tipo_documento' => 'DNI',
                'numero_documento' => '67891234',
                'nombres' => 'Rosa María',
                'apellidos' => 'Fernández Díaz',
                'telefono' => '943210987',
                'email' => 'rosa.fernandez@email.com',
                'direccion' => 'Jr. Huancavelica 789, Breña',
                'estado' => true,
            ],
            [
                'tipo_documento' => 'CE',
                'numero_documento' => '001234567',
                'nombres' => 'Juan Pablo',
                'apellidos' => 'González Ruiz',
                'telefono' => '932109876',
                'email' => 'juan.gonzalez@email.com',
                'direccion' => 'Av. Javier Prado 1567, San Borja',
                'estado' => true,
            ],
            [
                'tipo_documento' => 'DNI',
                'numero_documento' => '78912345',
                'nombres' => 'Carmen Julia',
                'apellidos' => 'Herrera Castillo',
                'telefono' => '921098765',
                'email' => 'carmen.herrera@email.com',
                'direccion' => 'Calle Las Flores 123, Miraflores',
                'estado' => true,
            ],
            [
                'tipo_documento' => 'RUC',
                'numero_documento' => '20987654321',
                'nombres' => 'Eventos',
                'apellidos' => 'Felices EIRL',
                'telefono' => '017654321',
                'email' => 'contacto@eventosfelices.pe',
                'direccion' => 'Av. La Marina 890, San Miguel',
                'estado' => true,
            ],
            [
                'tipo_documento' => 'DNI',
                'numero_documento' => '89123456',
                'nombres' => 'Pedro José',
                'apellidos' => 'Vásquez Morales',
                'telefono' => '910987654',
                'email' => 'pedro.vasquez@email.com',
                'direccion' => 'Jr. Puno 456, La Victoria',
                'estado' => true,
            ],
            [
                'tipo_documento' => 'DNI',
                'numero_documento' => '91234567',
                'nombres' => 'Sofía Alejandra',
                'apellidos' => 'Ramírez Luna',
                'telefono' => '909876543',
                'email' => 'sofia.ramirez@email.com',
                'direccion' => 'Av. Universitaria 1234, Los Olivos',
                'estado' => true,
            ],
            [
                'tipo_documento' => 'DNI',
                'numero_documento' => '12345678',
                'nombres' => 'Miguel Ángel',
                'apellidos' => 'Torres Silva',
                'telefono' => '998765432',
                'email' => 'miguel.torres@email.com',
                'direccion' => 'Calle Piura 567, Surco',
                'estado' => true,
            ],
        ];

        foreach ($clientes as $cliente) {
            Cliente::create($cliente);
        }
    }
}
