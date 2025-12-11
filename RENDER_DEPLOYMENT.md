# 🚀 Guía de Despliegue en Render con Dominio Personalizado

Esta guía te llevará paso a paso para desplegar el Sistema de Ventas LENNIN S.A.C en Render.com con MongoDB Atlas y dominio personalizado.

---

## 📋 Requisitos Previos

- ✅ Cuenta en [Render.com](https://render.com) (gratis)
- ✅ Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratis)
- ✅ Dominio propio (ej: lennin.com) o usar subdominio de Render
- ✅ Repositorio Git (GitHub, GitLab, Bitbucket)

---

## 1️⃣ Preparar MongoDB Atlas

### Paso 1.1: Crear Cluster
1. Ir a https://www.mongodb.com/cloud/atlas
2. Click en "Build a Database"
3. Seleccionar **M0 Free Tier**
4. Elegir región más cercana (ej: AWS São Paulo)
5. Nombrar cluster: `lennin-ventas`

### Paso 1.2: Configurar Usuario
1. En "Security > Database Access"
2. Click "Add New Database User"
3. Username: `lennin_admin`
4. Password: Generar contraseña segura (guardar)
5. Database User Privileges: **Read and write to any database**

### Paso 1.3: Configurar IP Whitelist
1. En "Security > Network Access"
2. Click "Add IP Address"
3. Seleccionar **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Necesario para que Render pueda conectarse

### Paso 1.4: Obtener Connection String
1. En "Database > Connect"
2. Seleccionar "Connect your application"
3. Driver: **PHP** versión 1.13 o superior
4. Copiar el connection string:
```
mongodb+srv://lennin_admin:<password>@lennin-ventas.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Reemplazar `<password>` con tu contraseña

---

## 2️⃣ Preparar el Código para Render

### Paso 2.1: Crear archivo `render.yaml`

Crear en la raíz del proyecto:

```yaml
services:
  - type: web
    name: lennin-ventas
    env: php
    plan: free
    buildCommand: |
      composer install --no-dev --optimize-autoloader
      npm ci
      npm run build
      php artisan config:cache
      php artisan route:cache
      php artisan view:cache
    startCommand: |
      php artisan serve --host=0.0.0.0 --port=$PORT
    envVars:
      - key: APP_NAME
        value: "LENNIN S.A.C - Sistema de Ventas"
      - key: APP_ENV
        value: production
      - key: APP_KEY
        generateValue: true
      - key: APP_DEBUG
        value: false
      - key: APP_URL
        value: https://lennin-ventas.onrender.com
      - key: APP_LOCALE
        value: es
      - key: APP_FALLBACK_LOCALE
        value: es
      - key: LOG_CHANNEL
        value: errorlog
      - key: LOG_LEVEL
        value: error
      - key: DB_CONNECTION
        value: mongodb
      - key: DB_HOST
        sync: false
      - key: DB_DATABASE
        value: lennin_ventas
      - key: DB_USERNAME
        sync: false
      - key: DB_PASSWORD
        sync: false
      - key: SESSION_DRIVER
        value: database
      - key: CACHE_STORE
        value: database
      - key: QUEUE_CONNECTION
        value: database
```

### Paso 2.2: Crear archivo `Procfile`

```
web: php artisan serve --host=0.0.0.0 --port=$PORT
```

### Paso 2.3: Crear `build.sh`

```bash
#!/usr/bin/env bash
set -e

echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "Installing NPM dependencies..."
npm ci --omit=dev

echo "Building frontend assets..."
npm run build

echo "Clearing and caching config..."
php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Build completed successfully!"
```

Dar permisos de ejecución:
```bash
chmod +x build.sh
```

### Paso 2.4: Actualizar `composer.json`

Añadir scripts post-install:

```json
{
  "scripts": {
    "post-autoload-dump": [
      "Illuminate\\Foundation\\ComposerScripts::postAutoloadDump",
      "@php artisan package:discover --ansi"
    ],
    "post-install-cmd": [
      "@php artisan optimize:clear",
      "@php artisan config:cache",
      "@php artisan route:cache"
    ]
  }
}
```

### Paso 2.5: Instalar MongoDB para Laravel

```bash
composer require mongodb/laravel-mongodb
```

### Paso 2.6: Actualizar Modelos

Cambiar los modelos para usar MongoDB:

```php
// app/Models/Categoria.php
use MongoDB\Laravel\Eloquent\Model;

class Categoria extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'categorias';
    // ... resto del código
}
```

Hacer lo mismo para todos los modelos.

### Paso 2.7: Actualizar `config/database.php`

```php
'mongodb' => [
    'driver' => 'mongodb',
    'dsn' => env('MONGODB_URI'),
    'database' => env('DB_DATABASE', 'lennin_ventas'),
],

'default' => env('DB_CONNECTION', 'mongodb'),
```

---

## 3️⃣ Subir Código a GitHub

```bash
# Inicializar Git si no está
git init

# Añadir archivos
git add .
git commit -m "Preparar para despliegue en Render"

# Crear repositorio en GitHub y subir
git remote add origin https://github.com/tu-usuario/lennin-ventas.git
git branch -M main
git push -u origin main
```

---

## 4️⃣ Desplegar en Render

### Paso 4.1: Crear Web Service
1. Ir a https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Conectar con tu repositorio GitHub
4. Configurar:
   - **Name:** `lennin-ventas`
   - **Region:** Oregon (US West) - más cercano
   - **Branch:** `main`
   - **Runtime:** `PHP`
   - **Build Command:** `./build.sh`
   - **Start Command:** `php artisan serve --host=0.0.0.0 --port=$PORT`
   - **Plan:** Free

### Paso 4.2: Configurar Variables de Entorno

En "Environment" añadir:

```env
APP_NAME="LENNIN S.A.C - Sistema de Ventas"
APP_ENV=production
APP_KEY=base64:GENERAR_CON_php_artisan_key:generate
APP_DEBUG=false
APP_URL=https://lennin-ventas.onrender.com

APP_LOCALE=es
APP_FALLBACK_LOCALE=es

LOG_CHANNEL=errorlog
LOG_LEVEL=error

# MongoDB Atlas
MONGODB_URI=mongodb+srv://lennin_admin:TU_PASSWORD@lennin-ventas.xxxxx.mongodb.net
DB_CONNECTION=mongodb
DB_DATABASE=lennin_ventas

SESSION_DRIVER=database
SESSION_LIFETIME=120
CACHE_STORE=database
QUEUE_CONNECTION=database

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@lennin.com
```

### Paso 4.3: Generar APP_KEY

Localmente ejecutar:
```bash
php artisan key:generate --show
```

Copiar el valor y añadirlo en Render.

### Paso 4.4: Desplegar

1. Click **"Create Web Service"**
2. Esperar 5-10 minutos mientras se despliega
3. Ver logs en tiempo real
4. URL temporal: `https://lennin-ventas.onrender.com`

---

## 5️⃣ Configurar Dominio Personalizado

### Opción A: Usar Dominio Propio (ej: ventas.lennin.com)

#### En Render:
1. Ir a tu servicio en Render
2. Click en **"Settings"** → **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Ingresar: `ventas.lennin.com`
5. Render te dará un registro CNAME

#### En tu Proveedor DNS (Namecheap, GoDaddy, etc):
1. Ir a DNS Settings
2. Añadir registro **CNAME**:
   - **Host:** `ventas`
   - **Target:** `lennin-ventas.onrender.com`
   - **TTL:** Automático o 300

3. Esperar propagación DNS (5-30 minutos)

#### Verificar SSL
Render automáticamente generará certificado SSL con Let's Encrypt.

### Opción B: Usar Dominio Raíz (ej: lennin.com)

#### En Render:
1. Añadir dominio: `lennin.com`
2. Render te dará IPs A Records

#### En tu Proveedor DNS:
1. Añadir registros **A**:
   - **Host:** `@`
   - **Value:** IP proporcionada por Render
   - **TTL:** 300

2. Añadir registro **CNAME** para www:
   - **Host:** `www`
   - **Target:** `lennin-ventas.onrender.com`

---

## 6️⃣ Ejecutar Migraciones Iniciales

### Via Render Shell

1. En Render Dashboard, ir a tu servicio
2. Click **"Shell"** (terminal en la nube)
3. Ejecutar:

```bash
# Crear colecciones e índices
php artisan migrate --force

# Poblar datos iniciales
php artisan db:seed --force

# Crear usuario admin
php artisan tinker
>>> \App\Models\User::create(['name' => 'Admin LENNIN', 'email' => 'admin@lennin.com', 'password' => bcrypt('Password123!')]);
>>> exit
```

---

## 7️⃣ Configurar Workers (Opcional)

Si usas colas, crear Background Worker:

1. En Render, **"New +"** → **"Background Worker"**
2. Conectar mismo repositorio
3. **Start Command:** `php artisan queue:work --tries=3`
4. Usar mismas variables de entorno

---

## 8️⃣ Configurar Backups Automáticos

### En MongoDB Atlas:
1. Ir a "Backup"
2. Activar "Continuous Backups" (gratis en M2+)
3. O configurar Cloud Backup

### Script de Backup Semanal:
```bash
# backup.sh
mongodump --uri="$MONGODB_URI" --out=./backup-$(date +%Y%m%d)
```

Configurar en Render como Cron Job.

---

## 9️⃣ Monitoreo y Logs

### Ver Logs en Tiempo Real
```bash
# En Render Dashboard
Dashboard → Tu Servicio → Logs
```

### Configurar Alertas
1. En Render: Settings → Notifications
2. Activar alertas por email para:
   - Deploy failures
   - Service crashes
   - High resource usage

---

## 🔟 Optimizaciones Post-Despliegue

### 10.1 Configurar CDN (Opcional)
- Usar Cloudflare para CDN gratuito
- Añadir dominio a Cloudflare
- Proxy activado para SSL y caché

### 10.2 Configurar Índices MongoDB
```javascript
// En MongoDB Compass o Shell
db.productos.createIndex({ "nombre": "text", "descripcion": "text" });
db.ventas.createIndex({ "fecha_venta": -1 });
db.clientes.createIndex({ "numero_documento": 1 }, { unique: true });
```

### 10.3 Activar Compresión
En `public/.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

---

## ✅ Checklist de Despliegue

- [ ] MongoDB Atlas configurado
- [ ] Código actualizado para MongoDB
- [ ] Variables de entorno configuradas
- [ ] Repositorio GitHub actualizado
- [ ] Web Service creado en Render
- [ ] Despliegue exitoso
- [ ] Migraciones ejecutadas
- [ ] Usuario admin creado
- [ ] Dominio personalizado configurado
- [ ] SSL activado
- [ ] Backups configurados
- [ ] Monitoreo activado

---

## 🆘 Solución de Problemas

### Error: "APP_KEY not set"
```bash
php artisan key:generate --show
# Añadir el valor en Render Environment
```

### Error: "Connection refused MongoDB"
- Verificar IP Whitelist (0.0.0.0/0)
- Verificar credenciales en MONGODB_URI
- Verificar que usuario tiene permisos

### Error: "Storage not writable"
```bash
chmod -R 775 storage bootstrap/cache
```

### Build Fails
- Revisar logs en Render
- Verificar `composer.json` y `package.json`
- Verificar que `build.sh` tiene permisos

### Sitio muy lento
- Activar caché: `php artisan optimize`
- Usar índices en MongoDB
- Considerar plan paid de Render

---

## 📱 URLs del Sistema Desplegado

- **Aplicación:** `https://ventas.lennin.com` (o tu dominio)
- **Panel Admin:** `https://ventas.lennin.com/dashboard`
- **MongoDB Atlas:** `https://cloud.mongodb.com`
- **Render Dashboard:** `https://dashboard.render.com`

---

## 🎉 ¡Sistema en Producción!

Tu sistema de ventas LENNIN S.A.C está ahora:
- ✅ Desplegado en Render (hosting gratuito/paid)
- ✅ Usando MongoDB Atlas (base de datos cloud)
- ✅ Con dominio personalizado
- ✅ SSL activado automáticamente
- ✅ Backups configurados
- ✅ Listo para usuarios reales

**Siguientes pasos:**
1. Crear usuarios vendedores
2. Cargar catálogo de productos
3. Registrar clientes
4. ¡Empezar a vender!

---

**Soporte:** Para ayuda adicional, consultar documentación de Render y MongoDB Atlas.
