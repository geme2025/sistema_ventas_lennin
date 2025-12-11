# API Routes - Sistema de Ventas LENNIN

## Base URL
```
https://tu-backend.onrender.com/api
```

## Autenticación

### Registro
```
POST /api/auth/register
Content-Type: application/json

{
    "name": "Nombre Usuario",
    "email": "usuario@email.com",
    "password": "123456",
    "password_confirmation": "123456",
    "role": "vendedor" // opcional: "admin" o "vendedor"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
    "email": "usuario@email.com",
    "password": "123456"
}
```

### Logout (requiere autenticación)
```
POST /api/auth/logout
Authorization: Bearer {token}
```

### Obtener usuario actual (requiere autenticación)
```
GET /api/auth/me
Authorization: Bearer {token}
```

### Actualizar perfil (requiere autenticación)
```
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Nuevo Nombre",
    "email": "nuevo@email.com"
}
```

### Cambiar contraseña (requiere autenticación)
```
PUT /api/auth/password
Authorization: Bearer {token}
Content-Type: application/json

{
    "current_password": "password_actual",
    "password": "nueva_password",
    "password_confirmation": "nueva_password"
}
```

---

## Dashboard (requiere autenticación)

### Obtener estadísticas del dashboard
```
GET /api/dashboard
Authorization: Bearer {token}
```

### Solo estadísticas
```
GET /api/dashboard/estadisticas
Authorization: Bearer {token}
```

---

## Categorías (requiere autenticación)

### Listar categorías
```
GET /api/categorias
Authorization: Bearer {token}

Query params opcionales:
- search: texto a buscar
- estado: true/false
- per_page: número de resultados por página
- all: true (para obtener todas sin paginación)
- sort_by: campo para ordenar
- sort_order: asc/desc
```

### Crear categoría
```
POST /api/categorias
Authorization: Bearer {token}
Content-Type: application/json

{
    "nombre": "Electrónicos",
    "descripcion": "Productos electrónicos",
    "estado": true
}
```

### Ver categoría
```
GET /api/categorias/{id}
Authorization: Bearer {token}
```

### Actualizar categoría
```
PUT /api/categorias/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "nombre": "Electrónicos Actualizado",
    "descripcion": "Nueva descripción",
    "estado": true
}
```

### Eliminar categoría
```
DELETE /api/categorias/{id}
Authorization: Bearer {token}
```

---

## Productos (requiere autenticación)

### Listar productos
```
GET /api/productos
Authorization: Bearer {token}

Query params opcionales:
- search: texto a buscar
- categoria_id: filtrar por categoría
- estado: true/false
- stock_bajo: true (productos con stock bajo)
- per_page: número de resultados por página
- all: true (para obtener todos sin paginación)
```

### Buscar productos (para autocompletado)
```
GET /api/productos/buscar?q=texto
Authorization: Bearer {token}
```

### Productos con stock bajo
```
GET /api/productos/bajo-stock
Authorization: Bearer {token}
```

### Crear producto
```
POST /api/productos
Authorization: Bearer {token}
Content-Type: application/json

{
    "codigo": "PROD001",
    "nombre": "Producto Ejemplo",
    "descripcion": "Descripción del producto",
    "categoria_id": 1,
    "precio_compra": 10.00,
    "precio_venta": 15.00,
    "stock": 100,
    "stock_minimo": 10,
    "estado": true
}
```

### Ver producto
```
GET /api/productos/{id}
Authorization: Bearer {token}
```

### Actualizar producto
```
PUT /api/productos/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "codigo": "PROD001",
    "nombre": "Producto Actualizado",
    ...
}
```

### Eliminar producto
```
DELETE /api/productos/{id}
Authorization: Bearer {token}
```

---

## Clientes (requiere autenticación)

### Listar clientes
```
GET /api/clientes
Authorization: Bearer {token}

Query params opcionales:
- search: texto a buscar
- tipo_documento: DNI/RUC/etc
- estado: true/false
- per_page: número de resultados por página
```

### Buscar clientes (para autocompletado)
```
GET /api/clientes/buscar?q=texto
Authorization: Bearer {token}
```

### Crear cliente
```
POST /api/clientes
Authorization: Bearer {token}
Content-Type: application/json

{
    "tipo_documento": "DNI",
    "numero_documento": "12345678",
    "nombres": "Juan",
    "apellidos": "Pérez García",
    "telefono": "999888777",
    "email": "juan@email.com",
    "direccion": "Av. Principal 123",
    "estado": true
}
```

### Ver cliente
```
GET /api/clientes/{id}
Authorization: Bearer {token}
```

### Actualizar cliente
```
PUT /api/clientes/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

### Eliminar cliente
```
DELETE /api/clientes/{id}
Authorization: Bearer {token}
```

---

## Ventas (requiere autenticación)

### Listar ventas
```
GET /api/ventas
Authorization: Bearer {token}

Query params opcionales:
- search: número de venta o datos del cliente
- fecha_desde: YYYY-MM-DD
- fecha_hasta: YYYY-MM-DD
- estado: pendiente/completada/anulada
- cliente_id: filtrar por cliente
- per_page: número de resultados por página
```

### Crear venta
```
POST /api/ventas
Authorization: Bearer {token}
Content-Type: application/json

{
    "cliente_id": 1,
    "observaciones": "Venta al contado",
    "detalles": [
        {
            "producto_id": 1,
            "cantidad": 2,
            "precio_unitario": 15.00,
            "descuento": 0
        },
        {
            "producto_id": 2,
            "cantidad": 1,
            "precio_unitario": 25.00,
            "descuento": 5.00
        }
    ]
}
```

### Ver venta
```
GET /api/ventas/{id}
Authorization: Bearer {token}
```

### Anular venta
```
POST /api/ventas/{id}/anular
Authorization: Bearer {token}
```

### Reporte diario
```
GET /api/ventas/reporte-diario?fecha=2025-12-11
Authorization: Bearer {token}
```

### Reporte mensual
```
GET /api/ventas/reporte-mensual?mes=12&anio=2025
Authorization: Bearer {token}
```

---

## Health Check (público)
```
GET /api/health
```

---

## Formato de Respuestas

### Éxito
```json
{
    "success": true,
    "message": "Operación exitosa",
    "data": { ... }
}
```

### Error
```json
{
    "success": false,
    "message": "Descripción del error"
}
```

### Error de validación
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "campo": ["Mensaje de error"]
    }
}
```

---

## Notas importantes

1. **Autenticación**: Todas las rutas excepto `/api/health`, `/api/auth/register` y `/api/auth/login` requieren el header `Authorization: Bearer {token}`.

2. **Content-Type**: Para peticiones POST/PUT, usar `Content-Type: application/json`.

3. **CORS**: El backend está configurado para aceptar peticiones desde:
   - localhost:3000
   - localhost:5173
   - sistema-ventas-lennin.onrender.com
   - Cualquier subdominio de onrender.com, vercel.app y netlify.app
