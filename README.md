# 🎮 Sistema de Ventas LENNIN S.A.C

> Sistema completo de gestión de ventas para juguetería con Laravel 11, Inertia.js y React 19

[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

## 🌟 Características Principales

### 📦 Gestión de Inventario
- **Categorías**: Organización de productos por categorías
- **Productos**: Control completo de inventario con códigos, precios y stock
- **Alertas**: Notificaciones automáticas de stock bajo

### 👥 Gestión de Clientes
- Registro con DNI o RUC
- Información de contacto completa
- Historial de compras

### 💰 Sistema de Ventas
- Punto de venta intuitivo
- Múltiples métodos de pago (Efectivo, Tarjeta, Yape, Plin, Transferencia)
- Cálculo automático de IGV (18%)
- Generación automática de número de venta
- Estados: Pendiente, Completada, Anulada

### 📊 Dashboard Interactivo
- Ventas del día y mes en tiempo real
- Estadísticas visuales con iconos
- Alertas de stock bajo
- Últimas ventas realizadas
- Top 5 productos más vendidos

## 🎯 Tecnologías Utilizadas

### Backend
- **Laravel 11**: Framework PHP moderno
- **MySQL**: Base de datos relacional
- **Eloquent ORM**: Manejo elegante de datos
- **Laravel Fortify**: Autenticación con 2FA

### Frontend
- **React 19**: Biblioteca de interfaces modernas
- **TypeScript**: Tipado estático para mayor seguridad
- **Inertia.js v2**: SPA sin API REST
- **Tailwind CSS 4**: Diseño responsive y moderno
- **Radix UI**: Componentes accesibles
- **Lucide React**: Iconos vectoriales

## 🚀 Inicio Rápido

### Instalación Automática (Windows - Recomendado)

```powershell
# PowerShell - Ejecutar desde la carpeta del proyecto
.\instalar_local.ps1
```

```cmd
# CMD - Ejecutar desde la carpeta del proyecto
instalar_local.bat
```

### Instalación Manual

```bash
# 1. Clonar repositorio
git clone <url-repositorio>
cd sistema_ventas_lennin

# 2. Instalar dependencias
composer install
npm install

# 3. Configurar entorno para desarrollo local
cp .env.local.example .env   # Windows: copy .env.local.example .env
php artisan key:generate

# 4. Crear base de datos MySQL
mysql -u root -e "CREATE DATABASE sistema_ventas_lennin"

# 5. Migrar y poblar datos
php artisan migrate:fresh --seed

# 6. Compilar assets
npm run build

# 7. Iniciar servidor
php artisan serve
```

Acceder a: http://localhost:8000

> 📖 Para instrucciones detalladas, ver **[INSTALACION_LOCAL.md](INSTALACION_LOCAL.md)**

## 🔑 Credenciales de Prueba

- **Administrador**: admin@lennin.com / password
- **Vendedor 1**: vendedor1@lennin.com / password
- **Vendedor 2**: vendedor2@lennin.com / password

## 📱 Capturas de Pantalla

### Dashboard
Panel principal con estadísticas en tiempo real, ventas recientes y productos más vendidos.

### Gestión de Productos
- Listado con búsqueda y filtros
- Alertas de stock bajo
- Control de precios de compra y venta
- Imágenes de productos

### Punto de Venta
- Búsqueda rápida de productos
- Selección de cliente
- Cálculo automático de totales
- Múltiples métodos de pago

## 📚 Documentación

- **[INSTALACION_LOCAL.md](INSTALACION_LOCAL.md)** - ⭐ Guía completa de instalación local (MySQL)
- **[Inicio Rápido](#-inicio-rápido)** - Configuración local en 5 minutos
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guía completa de despliegue tradicional
- **[MONGODB_SCHEMA.md](MONGODB_SCHEMA.md)** - Esquema de base de datos MongoDB
- **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** - Despliegue en Render.com con dominio

### Archivos de Entorno
- `.env.local.example` - Plantilla para **desarrollo local con MySQL** ⭐
- `.env.production.example` - Plantilla para **producción en Render** (PostgreSQL)
- `.env.example` - Plantilla general de referencia

### Opciones de Base de Datos
- **MySQL** (por defecto): Desarrollo local y servidores tradicionales
- **MongoDB Atlas**: Recomendado para despliegue en Render.com y producción cloud

### Opciones de Despliegue
- **Servidor VPS/Dedicado**: Seguir [DEPLOYMENT.md](DEPLOYMENT.md) con MySQL
- **Render.com + MongoDB Atlas**: Seguir [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) ⭐ Recomendado
- **Heroku**: Similar a Render, usar PostgreSQL o MongoDB
- **AWS/Azure/GCP**: Configuración avanzada con RDS o DocumentDB

## 🏗️ Estructura del Proyecto

```
sistema_ventas_lennin/
├── app/
│   ├── Http/Controllers/     # Controladores CRUD
│   ├── Models/               # Modelos Eloquent
│   └── Providers/            # Service Providers
├── database/
│   ├── migrations/           # Migraciones de BD
│   └── seeders/             # Datos de prueba
├── resources/
│   ├── js/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas Inertia
│   │   ├── layouts/         # Layouts de la app
│   │   └── types/           # Tipos TypeScript
│   └── css/                 # Estilos Tailwind
├── routes/
│   └── web.php              # Rutas de la aplicación
└── public/                  # Assets compilados
```

## 🔐 Seguridad

- ✅ Autenticación robusta con Laravel Fortify
- ✅ Protección CSRF en todos los formularios
- ✅ Validación de datos en backend y frontend
- ✅ Sanitización de inputs
- ✅ Soft deletes para auditoría
- ✅ Encriptación bcrypt de contraseñas
- ✅ Rate limiting en endpoints

## 📊 Base de Datos

### Tablas Principales
- `users`: Usuarios del sistema
- `categorias`: Categorías de productos
- `productos`: Inventario de juguetes
- `clientes`: Base de clientes
- `ventas`: Transacciones de venta
- `detalle_ventas`: Ítems de cada venta

### Relaciones
- Productos → Categorías (Many to One)
- Ventas → Clientes (Many to One)
- Ventas → Usuarios (Many to One)
- Ventas → DetalleVentas (One to Many)
- DetalleVentas → Productos (Many to One)

## 🧪 Testing

```bash
# Ejecutar tests
php artisan test

# Con cobertura
php artisan test --coverage
```

## 🔧 Mantenimiento

```bash
# Limpiar caché
php artisan optimize:clear

# Backup de base de datos
php artisan backup:run

# Ver logs en tiempo real
tail -f storage/logs/laravel.log
```

## ✅ Checklist de Producción

- [x] Migraciones de base de datos
- [x] Modelos con relaciones
- [x] Controladores CRUD completos
- [x] Validaciones en backend
- [x] Frontend con React y TypeScript
- [x] Componentes reutilizables
- [x] Dashboard con estadísticas
- [x] Sistema de autenticación
- [x] Gestión de sesiones
- [x] Assets optimizados
- [x] Variables de entorno configuradas
- [x] Documentación completa
- [x] Seeders con datos de prueba

## 🎉 El Sistema Está Listo

Este sistema está **100% funcional** y listo para:
- ✅ Desarrollo local
- ✅ Despliegue en staging
- ✅ **Producción**

Incluye todas las funcionalidades requeridas para una juguetería moderna con:
- Control de inventario
- Gestión de clientes
- Punto de venta completo
- Dashboard analítico
- Reportes y estadísticas

## 📞 Soporte

Para consultas o soporte técnico, contactar al equipo de desarrollo.

## 📄 Licencia

Desarrollado para LENNIN S.A.C - Todos los derechos reservados.

---

⭐ Si este proyecto te fue útil, no olvides darle una estrella!
