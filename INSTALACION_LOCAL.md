# 🖥️ Guía de Instalación Local - Sistema de Ventas LENNIN S.A.C

Esta guía te ayudará a configurar el sistema en tu computadora local con MySQL.

---

## 📋 Requisitos Previos

### Software necesario:
- **PHP** >= 8.2 con extensiones: pdo_mysql, mbstring, openssl, tokenizer, xml, ctype, json, bcmath
- **Composer** >= 2.0
- **Node.js** >= 18.x
- **NPM** >= 9.x
- **MySQL** >= 8.0 (o MariaDB >= 10.5)
- **Git** (opcional)

### Recomendaciones:
- **Laragon** (Windows) - Incluye todo lo necesario ✅ Recomendado
- **XAMPP** (Windows/Mac/Linux)
- **WAMP** (Windows)
- **Homebrew** (Mac) - php, mysql, composer, node

---

## 🚀 Instalación Rápida (5 minutos)

### Opción 1: Script Automático (Windows PowerShell)

```powershell
# Ejecutar desde la carpeta del proyecto
.\instalar_local.ps1
```

### Opción 2: Instalación Manual

#### Paso 1: Clonar o descargar el proyecto
```bash
# Si tienes Git:
git clone <url-repositorio>
cd sistema_ventas_lennin

# O descarga el ZIP y extrae
```

#### Paso 2: Instalar dependencias PHP
```bash
composer install
```

#### Paso 3: Instalar dependencias JavaScript
```bash
npm install
```

#### Paso 4: Configurar archivo de entorno
```bash
# Windows (PowerShell)
Copy-Item .env.local.example .env

# Windows (CMD)
copy .env.local.example .env

# Linux/Mac
cp .env.local.example .env
```

#### Paso 5: Generar clave de aplicación
```bash
php artisan key:generate
```

#### Paso 6: Crear base de datos MySQL

**Opción A - Usando línea de comandos:**
```bash
# Conectar a MySQL
mysql -u root -p

# Crear la base de datos
CREATE DATABASE sistema_ventas_lennin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Opción B - Usando phpMyAdmin:**
1. Abrir http://localhost/phpmyadmin
2. Click en "Nueva"
3. Nombre: `sistema_ventas_lennin`
4. Cotejamiento: `utf8mb4_unicode_ci`
5. Click "Crear"

**Opción C - Usando HeidiSQL (Laragon):**
1. Abrir HeidiSQL desde Laragon
2. Click derecho → Crear nuevo → Base de datos
3. Nombre: `sistema_ventas_lennin`

#### Paso 7: Ejecutar migraciones y seeders
```bash
php artisan migrate:fresh --seed
```

#### Paso 8: Compilar assets
```bash
npm run build
```

#### Paso 9: Iniciar el servidor
```bash
php artisan serve
```

#### Paso 10: Abrir en el navegador
```
http://localhost:8000
```

---

## 🔑 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@lennin.com | password |
| Vendedor 1 | vendedor1@lennin.com | password |
| Vendedor 2 | vendedor2@lennin.com | password |

---

## 🔧 Configuración de MySQL

### Si usas Laragon (recomendado):
El archivo `.env.local.example` ya viene configurado para Laragon:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sistema_ventas_lennin
DB_USERNAME=root
DB_PASSWORD=
```

### Si tu MySQL tiene contraseña:
Edita el archivo `.env` y cambia:
```env
DB_PASSWORD=tu_contraseña_aqui
```

### Si usas un puerto diferente:
```env
DB_PORT=3307
```

---

## 🛠️ Comandos Útiles

### Desarrollo (con hot reload)
```bash
# Terminal 1: Servidor PHP
php artisan serve

# Terminal 2: Vite (hot reload de assets)
npm run dev
```

### O usar el comando combinado:
```bash
composer dev
```

### Limpiar caché
```bash
php artisan optimize:clear
```

### Resetear base de datos
```bash
php artisan migrate:fresh --seed
```

### Ver logs en tiempo real
```bash
# Windows PowerShell
Get-Content storage/logs/laravel.log -Wait

# Linux/Mac
tail -f storage/logs/laravel.log
```

---

## ⚠️ Solución de Problemas

### Error: "SQLSTATE[HY000] [1049] Unknown database"
**Solución:** La base de datos no existe. Créala manualmente:
```sql
CREATE DATABASE sistema_ventas_lennin;
```

### Error: "Access denied for user 'root'@'localhost'"
**Solución:** Verifica tu contraseña de MySQL en el archivo `.env`:
```env
DB_PASSWORD=tu_contraseña
```

### Error: "php artisan: command not found"
**Solución:** PHP no está en el PATH. Usa la ruta completa o agrega PHP al PATH:
```bash
# Windows (ruta típica de Laragon)
C:\laragon\bin\php\php-8.2.0\php artisan serve
```

### Error: "npm: command not found"
**Solución:** Node.js no está instalado. Descárgalo de https://nodejs.org

### Error: Página en blanco o error 500
**Solución:**
1. Verifica que el archivo `.env` existe
2. Ejecuta: `php artisan key:generate`
3. Verifica permisos de la carpeta `storage`:
   ```bash
   # Linux/Mac
   chmod -R 775 storage bootstrap/cache
   ```

### Error: "Vite manifest not found"
**Solución:** Compila los assets:
```bash
npm run build
```

### Error: Puerto 8000 en uso
**Solución:** Usa otro puerto:
```bash
php artisan serve --port=8080
```

---

## 📁 Estructura de Archivos Importantes

```
sistema_ventas_lennin/
├── .env                    # ⚠️ NO compartir (configuración local)
├── .env.local.example      # Plantilla para desarrollo local
├── .env.example            # Plantilla para producción
├── instalar_local.ps1      # Script de instalación automática
├── INSTALACION_LOCAL.md    # Esta guía
└── storage/
    └── logs/
        └── laravel.log     # Logs de la aplicación
```

---

## 🔄 Actualizar el Proyecto

Si descargas una nueva versión:

```bash
# 1. Actualizar dependencias
composer install
npm install

# 2. Ejecutar nuevas migraciones
php artisan migrate

# 3. Recompilar assets
npm run build

# 4. Limpiar caché
php artisan optimize:clear
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en `storage/logs/laravel.log`
2. Verifica la configuración del archivo `.env`
3. Asegúrate de que MySQL esté corriendo
4. Contacta al equipo de desarrollo

---

**¡Listo! El sistema debería estar funcionando en http://localhost:8000** 🎉
