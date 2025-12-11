# Rutas API para Android Studio - Sistema de Ventas LENNIN

## URL Base
```
https://tu-backend.onrender.com/api
```

---

## 🔐 AUTENTICACIÓN (Sin token requerido)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/logout` | Cerrar sesión (requiere token) |
| GET | `/auth/me` | Obtener datos del usuario actual |
| PUT | `/auth/profile` | Actualizar perfil |
| PUT | `/auth/password` | Cambiar contraseña |

### Ejemplos:
```java
// Login
POST /api/auth/login
{
    "email": "usuario@email.com",
    "password": "123456"
}

// Respuesta
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "user": {
            "id": 1,
            "name": "Usuario",
            "email": "usuario@email.com",
            "role": "vendedor"
        }
    }
}

// Registro
POST /api/auth/register
{
    "name": "Nombre Usuario",
    "email": "usuario@email.com",
    "password": "123456",
    "password_confirmation": "123456"
}
```

---

## 📊 DASHBOARD (Requiere token)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/dashboard` | Obtener estadísticas completas |
| GET | `/dashboard/estadisticas` | Solo estadísticas |

---

## 🏷️ CATEGORÍAS (Requiere token)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/categorias` | Listar todas las categorías |
| POST | `/categorias` | Crear nueva categoría |
| GET | `/categorias/{id}` | Obtener categoría por ID |
| PUT | `/categorias/{id}` | Actualizar categoría |
| DELETE | `/categorias/{id}` | Eliminar categoría |

### Parámetros GET `/categorias`:
- `search`: Buscar por nombre
- `estado`: true/false
- `per_page`: Resultados por página
- `all`: true (obtener todos sin paginación)

### Ejemplo:
```java
// Crear categoría
POST /api/categorias
{
    "nombre": "Electrónicos",
    "descripcion": "Productos electrónicos",
    "estado": true
}

// Listar con filtros
GET /api/categorias?search=electro&estado=true&per_page=20
```

---

## 📦 PRODUCTOS (Requiere token)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/productos` | Listar productos |
| GET | `/productos/buscar?q=texto` | Buscar productos (autocompletado) |
| GET | `/productos/bajo-stock` | Productos con stock bajo |
| POST | `/productos` | Crear nuevo producto |
| GET | `/productos/{id}` | Obtener producto por ID |
| PUT | `/productos/{id}` | Actualizar producto |
| DELETE | `/productos/{id}` | Eliminar producto |

### Parámetros GET `/productos`:
- `search`: Buscar por nombre/código
- `categoria_id`: Filtrar por categoría
- `estado`: true/false
- `stock_bajo`: true
- `per_page`: Resultados por página
- `all`: true (sin paginación)

### Ejemplo:
```java
// Crear producto
POST /api/productos
{
    "codigo": "PROD001",
    "nombre": "Laptop Dell",
    "descripcion": "Laptop gaming",
    "categoria_id": 1,
    "precio_compra": 500.00,
    "precio_venta": 750.00,
    "stock": 50,
    "stock_minimo": 5,
    "estado": true
}

// Buscar productos
GET /api/productos/buscar?q=laptop
```

---

## 👥 CLIENTES (Requiere token)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/clientes` | Listar clientes |
| GET | `/clientes/buscar?q=texto` | Buscar clientes (autocompletado) |
| POST | `/clientes` | Crear nuevo cliente |
| GET | `/clientes/{id}` | Obtener cliente por ID |
| PUT | `/clientes/{id}` | Actualizar cliente |
| DELETE | `/clientes/{id}` | Eliminar cliente |

### Parámetros GET `/clientes`:
- `search`: Buscar por nombre/documento
- `tipo_documento`: DNI, RUC, etc.
- `estado`: true/false
- `per_page`: Resultados por página

### Ejemplo:
```java
// Crear cliente
POST /api/clientes
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

// Buscar cliente
GET /api/clientes/buscar?q=juan
```

---

## 💰 VENTAS (Requiere token)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/ventas` | Listar ventas |
| POST | `/ventas` | Crear nueva venta |
| GET | `/ventas/{id}` | Obtener venta por ID |
| POST | `/ventas/{id}/anular` | Anular venta |
| GET | `/ventas/reporte-diario?fecha=YYYY-MM-DD` | Reporte diario |
| GET | `/ventas/reporte-mensual?mes=12&anio=2025` | Reporte mensual |

### Parámetros GET `/ventas`:
- `search`: Número de venta o datos del cliente
- `fecha_desde`: YYYY-MM-DD
- `fecha_hasta`: YYYY-MM-DD
- `estado`: pendiente, completada, anulada
- `cliente_id`: Filtrar por cliente
- `per_page`: Resultados por página

### Ejemplo:
```java
// Crear venta
POST /api/ventas
{
    "cliente_id": 1,
    "observaciones": "Venta al contado",
    "detalles": [
        {
            "producto_id": 1,
            "cantidad": 2,
            "precio_unitario": 750.00,
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

// Anular venta
POST /api/ventas/5/anular

// Reporte diario
GET /api/ventas/reporte-diario?fecha=2025-12-11
```

---

## 🏥 HEALTH CHECK (Público - Sin token)

| Método | Ruta |
|--------|------|
| GET | `/health` |

---

## 📋 FORMATOS DE RESPUESTA

### Éxito
```json
{
    "success": true,
    "message": "Operación exitosa",
    "data": {
        // datos aquí
    }
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

## 🔑 HEADERS REQUERIDOS

```
Authorization: Bearer {token}
Content-Type: application/json
```

El token se obtiene en `/auth/login` y debe incluirse en todas las peticiones excepto:
- POST `/auth/register`
- POST `/auth/login`
- GET `/health`

---

## 🌐 CONFIGURACIÓN CORS

El backend acepta peticiones desde:
- `localhost:3000`
- `localhost:5173`
- `sistema-ventas-lennin.onrender.com`
- Subdominios de: `onrender.com`, `vercel.app`, `netlify.app`

---

## 💡 NOTAS PARA ANDROID

1. **Guardar el token**: Después de login, almacenar el token en SharedPreferences o DataStore
2. **Enviar token**: Incluir en todas las peticiones (excepto las públicas)
3. **Renovar sesión**: Implementar lógica para refrescar si el token expira
4. **Manejo de errores**: Validar `success: false` y mostrar el mensaje de error
5. **Paginación**: Usar `per_page` para controlar resultados
6. **Búsquedas**: Usar endpoints `/buscar` para autocompletados

---

**Última actualización**: 11 de diciembre de 2025
