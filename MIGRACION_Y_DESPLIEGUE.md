# 🚀 Guía de Migración y Despliegue - Sistema de Ventas LENNIN S.A.C

Esta guía te permite:
1. ✅ Migrar el proyecto a otra laptop con Laragon
2. ✅ Desplegar el backend Node.js en internet (Render)
3. ✅ Conectar la app móvil Android al backend en producción

---

## 📦 PARTE 1: MIGRAR A OTRA LAPTOP CON LARAGON

### Prerequisitos en la Nueva Laptop
- ✅ Laragon instalado (incluye PHP, MySQL, Apache)
- ✅ Node.js >= 18 instalado
- ✅ Composer instalado
- ✅ Git instalado (opcional)

### Paso 1: Copiar el Proyecto

**Opción A - Con Git:**
```bash
cd C:\laragon\www
git clone https://github.com/tu-usuario/sistema_ventas_lennin.git
cd sistema_ventas_lennin
```

**Opción B - Copiar manualmente:**
1. Copia toda la carpeta `sistema_ventas_lennin` a `C:\laragon\www\`
2. O comprime el proyecto, transfiere y descomprime en la nueva laptop

### Paso 2: Configurar Laravel (Sistema Web)

```bash
# Abrir PowerShell en C:\laragon\www\sistema_ventas_lennin

# 1. Instalar dependencias PHP
composer install

# 2. Instalar dependencias Node.js (para frontend React)
npm install

# 3. Copiar archivo de configuración
copy .env.example .env

# 4. Generar clave de aplicación Laravel
php artisan key:generate

# 5. Crear la base de datos MySQL en Laragon
# - Abre Laragon
# - Click en "Database" > "MySQL" > Abre HeidiSQL
# - Crea nueva base de datos: "lennin_ventas"

# 6. Configurar .env de Laravel
# Edita el archivo .env:
```

**.env (Laravel) - Configuración:**
```env
APP_NAME="LENNIN S.A.C - Sistema de Ventas"
APP_ENV=local
APP_KEY=base64:TU_CLAVE_GENERADA_AQUI
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lennin_ventas
DB_USERNAME=root
DB_PASSWORD=

# Si usas el backend Node.js (opcional)
BACKEND_API_URL=http://localhost:5000/api
```

```bash
# 7. Ejecutar migraciones y seeders
php artisan migrate --seed

# 8. Compilar assets frontend
npm run build

# 9. Iniciar servidor Laravel
php artisan serve
```

### Paso 3: Configurar Backend Node.js

```bash
cd backend

# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
copy .env.example .env
```

**backend/.env - Configuración:**
```env
# Servidor
PORT=5000
NODE_ENV=development

# MongoDB Atlas (usar tu cluster existente)
MONGODB_URI=mongodb+srv://gemenismago_db_user:fG0D3zJnJHxcF6DH@cluster0.eqn19i5.mongodb.net/lennin_ventas?retryWrites=true&w=majority

# JWT Secret (generar nuevo)
JWT_SECRET=5c59ed2c7cad0c040ecbaf8d68805d7fed0b8019e5fa9a7fa0f1ea82f9c1a1bada6ed8e31e2fb8e81b6c08d0d9eafae9da69b68d6224b496075353
JWT_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:8000,http://127.0.0.1:8000,http://192.168.101.13:8000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

```bash
# 3. Iniciar backend
npm run dev
```

### Paso 4: Verificar que Todo Funciona

```bash
# Terminal 1 - Laravel (puerto 8000)
php artisan serve

# Terminal 2 - Backend Node.js (puerto 5000)
cd backend
npm run dev

# Acceder a:
# Sistema Web: http://localhost:8000
# API Backend: http://localhost:5000/api
# Health Check: http://localhost:5000/health
```

---

## 🌐 PARTE 2: DESPLEGAR BACKEND EN INTERNET (RENDER)

### Paso 1: Preparar MongoDB Atlas

1. **Accede a MongoDB Atlas**: https://cloud.mongodb.com
2. **Ve a tu cluster** → Database Access
3. **Verifica/Crea usuario**: `gemenismago_db_user`
4. **Network Access**: Permite acceso desde cualquier IP (`0.0.0.0/0`)
5. **Copia la cadena de conexión**

### Paso 2: Crear Cuenta en Render

1. **Registrarse**: https://render.com (usa GitHub, GitLab o email)
2. **Verificar email**
3. **Plan gratuito**: 750 horas/mes gratis

### Paso 3: Preparar Repositorio Git

```bash
# En la raíz del proyecto
cd C:\laragon\www\sistema_ventas_lennin

# Inicializar Git (si no lo has hecho)
git init

# Agregar .gitignore
# Asegúrate que incluya:
# node_modules/
# .env
# vendor/
# .DS_Store
```

**Crear archivo `.gitignore` en la raíz:**
```gitignore
# Backend Node.js
backend/node_modules/
backend/.env
backend/package-lock.json

# Laravel
/node_modules
/public/build
/public/hot
/public/storage
/storage/*.key
/vendor
.env
.env.backup
.env.production
.phpunit.result.cache
Homestead.json
Homestead.yaml
auth.json
npm-debug.log
yarn-error.log

# IDEs
.idea
.vscode
*.swp
*.swo
*~
.DS_Store
```

```bash
# Hacer commit
git add .
git commit -m "Initial commit - Sistema Ventas LENNIN"

# Subir a GitHub
# 1. Crea un repositorio en GitHub: https://github.com/new
# 2. Sigue las instrucciones para push
git remote add origin https://github.com/TU_USUARIO/sistema_ventas_lennin.git
git branch -M main
git push -u origin main
```

### Paso 4: Desplegar en Render

#### 4.1 Crear Web Service

1. **Dashboard de Render** → "New +" → "Web Service"
2. **Conectar repositorio**: 
   - Autoriza GitHub
   - Selecciona `sistema_ventas_lennin`
3. **Configuración del servicio**:

```
Name: lennin-ventas-api
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

#### 4.2 Configurar Variables de Entorno

En Render → Environment → Add Environment Variable:

```
NODE_ENV = production
PORT = 5000

MONGODB_URI = mongodb+srv://gemenismago_db_user:fG0D3zJnJHxcF6DH@cluster0.eqn19i5.mongodb.net/lennin_ventas?retryWrites=true&w=majority

JWT_SECRET = 5c59ed2c7cad0c040ecbaf8d68805d7fed0b8019e5fa9a7fa0f1ea82f9c1a1bada6ed8e31e2fb8e81b6c08d0d9eafae9da69b68d6224b496075353

JWT_EXPIRE = 30d

CORS_ORIGIN = https://tu-frontend.com,http://localhost:8000

RATE_LIMIT_WINDOW = 15
RATE_LIMIT_MAX_REQUESTS = 100
```

#### 4.3 Desplegar

1. Click en "Create Web Service"
2. **Render comenzará el despliegue** (tarda 5-10 minutos)
3. Verás los logs en tiempo real
4. Cuando termine: ✅ "Deploy successful"

#### 4.4 Obtener URL de la API

Tu API estará disponible en:
```
https://lennin-ventas-api.onrender.com
```

**Probar endpoints:**
```bash
# Health check
curl https://lennin-ventas-api.onrender.com/health

# Info de la API
curl https://lennin-ventas-api.onrender.com/api
```

### Paso 5: Configurar Dominio Personalizado (Opcional)

1. **Render Dashboard** → Tu servicio → "Settings"
2. **Custom Domain** → "Add Custom Domain"
3. **Opciones**:
   - Subdominio gratuito de Render: `lennin-ventas-api.onrender.com`
   - Tu propio dominio: `api.lennin.com` (requiere configurar DNS)

**Configurar DNS si tienes dominio propio:**
```
Tipo: CNAME
Nombre: api
Valor: lennin-ventas-api.onrender.com
```

---

## 📱 PARTE 3: CONECTAR APP ANDROID AL BACKEND EN PRODUCCIÓN

### Paso 1: Actualizar RetrofitClient.kt

```kotlin
// android/RetrofitClient.kt

// URL de producción (cambiar después del despliegue)
private const val BASE_URL_PROD = "https://lennin-ventas-api.onrender.com/api/"

// Usar producción
private const val BASE_URL = BASE_URL_PROD

// O para desarrollo local:
// private const val BASE_URL = BASE_URL_DEV
```

### Paso 2: Configurar HTTPS en Android

**AndroidManifest.xml:**
```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:usesCleartextTraffic="false"
        ...>
    </application>
</manifest>
```

**Nota**: En producción NO uses `usesCleartextTraffic="true"` porque Render usa HTTPS automáticamente.

### Paso 3: Probar la Conexión

```kotlin
// En tu Activity o Fragment
class MainActivity : AppCompatActivity() {
    
    private val repository = VentasRepository()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Probar conexión
        CoroutineScope(Dispatchers.Main).launch {
            try {
                val result = withContext(Dispatchers.IO) {
                    repository.login("admin@lennin.com", "admin123")
                }
                
                result.onSuccess { authData ->
                    Log.d("API", "✅ Conexión exitosa: ${authData.name}")
                    Toast.makeText(this@MainActivity, 
                        "Conectado a la API en producción", 
                        Toast.LENGTH_LONG).show()
                }
            } catch (e: Exception) {
                Log.e("API", "❌ Error: ${e.message}")
            }
        }
    }
}
```

---

## 🔄 PARTE 4: FLUJO DE TRABAJO COMPLETO

### Desarrollo Local (Nueva Laptop)

```bash
# Terminal 1 - Laravel
cd C:\laragon\www\sistema_ventas_lennin
php artisan serve

# Terminal 2 - Backend Node.js
cd C:\laragon\www\sistema_ventas_lennin\backend
npm run dev

# Terminal 3 - Watch assets (si modificas React)
npm run dev

# Accesos:
# Web: http://localhost:8000
# API Local: http://localhost:5000/api
```

### Despliegue a Producción

```bash
# 1. Hacer cambios en el código
# 2. Commit y push
git add .
git commit -m "Actualización de funcionalidades"
git push origin main

# 3. Render detecta el push y redespliega automáticamente
# 4. Esperar 5-10 minutos
# 5. Verificar en https://lennin-ventas-api.onrender.com/health
```

### App Android - Cambiar entre Desarrollo y Producción

```kotlin
// RetrofitClient.kt

// DESARROLLO - Backend local
// private const val BASE_URL = BASE_URL_DEV

// PRODUCCIÓN - Backend en Render
private const val BASE_URL = BASE_URL_PROD
```

---

## 📊 VERIFICACIÓN DE DESPLIEGUE

### Checklist de Producción

- [ ] MongoDB Atlas accesible desde cualquier IP
- [ ] Backend desplegado en Render
- [ ] Variables de entorno configuradas
- [ ] Health check responde: `https://tu-api.onrender.com/health`
- [ ] Login funciona desde Postman/Insomnia
- [ ] CORS configurado correctamente
- [ ] App Android conecta a producción
- [ ] JWT tokens se generan correctamente

### Comandos de Verificación

```bash
# 1. Verificar API en producción
curl https://lennin-ventas-api.onrender.com/health

# 2. Test de login
curl -X POST https://lennin-ventas-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lennin.com","password":"admin123"}'

# 3. Verificar MongoDB Atlas
# Conectar desde Compass: mongodb+srv://...
```

---

## ⚠️ NOTAS IMPORTANTES

### Plan Gratuito de Render
- ✅ 750 horas/mes gratis
- ⚠️ El servidor se "duerme" después de 15 minutos sin uso
- ⚠️ Primera petición tarda ~30 segundos en "despertar"
- ✅ SSL/HTTPS automático y gratuito
- ✅ Redepliegue automático con Git push

### Mantener el Servidor Activo (Opcional)
Crea un cron job que haga ping cada 10 minutos:
```bash
# Usar un servicio como cron-job.org
# URL: https://lennin-ventas-api.onrender.com/health
# Intervalo: cada 10 minutos
```

### Monitoreo
- **Logs en Render**: Dashboard → Tu servicio → Logs
- **Métricas**: Dashboard → Tu servicio → Metrics
- **Alertas**: Configura notificaciones por email

---

## 🎯 RESUMEN RÁPIDO

### Migración a Nueva Laptop
```bash
1. Instalar: Laragon, Node.js, Composer
2. Copiar proyecto a C:\laragon\www\
3. composer install && npm install
4. Configurar .env y crear DB
5. php artisan migrate --seed
6. php artisan serve
```

### Despliegue a Internet
```bash
1. Subir código a GitHub
2. Crear Web Service en Render
3. Conectar repo y configurar
4. Agregar variables de entorno
5. Deploy automático
6. URL: https://tu-app.onrender.com
```

### App Android
```kotlin
1. Cambiar BASE_URL a producción
2. usesCleartextTraffic = false
3. Compilar y probar
```

---

## 📞 SOPORTE

**Documentación:**
- Backend API: `backend/README.md`
- Android: `android/README.md`
- MongoDB Schema: `MONGODB_SCHEMA.md`
- Render: `RENDER_DEPLOYMENT.md`

**URLs de Producción (después del despliegue):**
- API Backend: `https://lennin-ventas-api.onrender.com/api`
- Health Check: `https://lennin-ventas-api.onrender.com/health`

---

## 🌐 PARTE 5: DESPLEGAR SISTEMA WEB LARAVEL EN INTERNET (RENDER)

### ¿Qué vamos a desplegar?

- Frontend React + Inertia.js
- Backend Laravel (PHP)
- Base de datos PostgreSQL (Render lo proporciona gratis)

### Prerequisitos

- ✅ Cuenta en GitHub
- ✅ Cuenta en Render.com (gratuita)
- ✅ Proyecto funcionando localmente

---

### Paso 1: Preparar el Proyecto para Producción

#### 1.1 Crear archivo de configuración para Render

**Crear `render.yaml` en la raíz del proyecto:**

```yaml
services:
  - type: web
    name: lennin-ventas-web
    env: php
    buildCommand: |
      composer install --no-dev --optimize-autoloader
      npm install
      npm run build
      php artisan config:cache
      php artisan route:cache
      php artisan view:cache
    startCommand: php artisan serve --host=0.0.0.0 --port=$PORT
    envVars:
      - key: APP_NAME
        value: LENNIN S.A.C - Sistema de Ventas
      - key: APP_ENV
        value: production
      - key: APP_DEBUG
        value: false
      - key: APP_URL
        sync: false
      - key: APP_KEY
        generateValue: true
      - key: DB_CONNECTION
        value: pgsql
      - key: DB_HOST
        fromDatabase:
          name: lennin-db
          property: host
      - key: DB_PORT
        fromDatabase:
          name: lennin-db
          property: port
      - key: DB_DATABASE
        fromDatabase:
          name: lennin-db
          property: database
      - key: DB_USERNAME
        fromDatabase:
          name: lennin-db
          property: user
      - key: DB_PASSWORD
        fromDatabase:
          name: lennin-db
          property: password

databases:
  - name: lennin-db
    databaseName: lennin_ventas
    user: lennin_user
```

#### 1.2 Actualizar composer.json

Asegúrate que `composer.json` tenga:

```json
{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11.0"
  },
  "scripts": {
    "post-install-cmd": [
      "php artisan clear-compiled",
      "php artisan optimize"
    ]
  }
}
```

#### 1.3 Crear Procfile (alternativa a render.yaml)

**Crear archivo `Procfile` en la raíz:**

```
web: php artisan serve --host=0.0.0.0 --port=$PORT
```

#### 1.4 Actualizar .gitignore

Asegúrate que `.gitignore` incluya:

```gitignore
/node_modules
/public/build
/public/hot
/public/storage
/storage/*.key
/vendor
.env
.env.backup
.env.production
.phpunit.result.cache
Homestead.json
Homestead.yaml
auth.json
npm-debug.log
yarn-error.log
```

---

### Paso 2: Subir Proyecto a GitHub

```bash
# En la raíz del proyecto
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Preparar para despliegue en Render"

# Crear repositorio en GitHub
# Ve a https://github.com/new y crea: sistema_ventas_lennin

# Conectar y subir
git remote add origin https://github.com/TU_USUARIO/sistema_ventas_lennin.git
git branch -M main
git push -u origin main
```

---

### Paso 3: Configurar Base de Datos en Render

#### 3.1 Crear Base de Datos PostgreSQL

1. Ve a **Render Dashboard**: https://dashboard.render.com
2. Click en **"New +"** → **"PostgreSQL"**
3. Configuración:
   ```
   Name: lennin-ventas-db
   Database: lennin_ventas
   User: lennin_user
   Region: Oregon (US West) o Frankfurt (Europe)
   Plan: Free
   ```
4. Click en **"Create Database"**
5. Espera 2-3 minutos a que se cree
6. **Guarda las credenciales** que aparecen:
   - Internal Database URL
   - External Database URL
   - Host
   - Port
   - Database
   - Username
   - Password

---

### Paso 4: Crear Web Service en Render

#### 4.1 Crear Servicio Web

1. En Render Dashboard → **"New +"** → **"Web Service"**
2. **Conectar repositorio de GitHub**:
   - Autoriza Render a acceder a GitHub
   - Selecciona `sistema_ventas_lennin`
3. **Configuración del servicio**:

```
Name: lennin-ventas-web
Region: Oregon (US West)
Branch: main
Runtime: PHP
Build Command: 
  composer install --no-dev --optimize-autoloader && 
  npm install && 
  npm run build && 
  php artisan config:cache && 
  php artisan route:cache && 
  php artisan view:cache
  
Start Command: php artisan serve --host=0.0.0.0 --port=$PORT

Instance Type: Free
```

#### 4.2 Variables de Entorno

En **"Environment"** → **"Add Environment Variable"**, agrega:

```bash
# Aplicación
APP_NAME="LENNIN S.A.C - Sistema de Ventas"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://lennin-ventas-web.onrender.com

# Generar APP_KEY (ejecuta localmente):
# php artisan key:generate --show
APP_KEY=base64:TU_CLAVE_GENERADA_AQUI

# Base de datos PostgreSQL (copiar de Render DB)
DB_CONNECTION=pgsql
DB_HOST=oregon-postgres.render.com
DB_PORT=5432
DB_DATABASE=lennin_ventas
DB_USERNAME=lennin_user
DB_PASSWORD=TU_PASSWORD_DE_RENDER_DB

# Sesiones y Cache
SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync

# Si usas el backend Node.js
BACKEND_API_URL=https://lennin-ventas-api.onrender.com/api
```

**Para generar APP_KEY:**
```bash
# En tu laptop, ejecuta:
php artisan key:generate --show

# Copia el resultado y úsalo en APP_KEY
```

---

### Paso 5: Desplegar

1. Click en **"Create Web Service"**
2. Render comenzará el despliegue automáticamente
3. **Proceso (10-15 minutos)**:
   - Clona el repositorio
   - Instala dependencias PHP (composer)
   - Instala dependencias Node.js (npm)
   - Compila assets React
   - Cachea configuraciones
   - Inicia el servidor

4. Monitorea el progreso en la pestaña **"Logs"**

---

### Paso 6: Ejecutar Migraciones

Una vez desplegado:

1. Ve a **"Shell"** en el menú del servicio
2. Ejecuta:
```bash
php artisan migrate --force
php artisan db:seed --force
```

O configura un hook de despliegue agregando en `render.yaml`:

```yaml
services:
  - type: web
    # ... configuración anterior
    buildCommand: |
      composer install --no-dev --optimize-autoloader
      npm install
      npm run build
      php artisan migrate --force
      php artisan db:seed --force
      php artisan config:cache
      php artisan route:cache
```

---

### Paso 7: Configurar Dominio (Opcional)

#### Opción A: Usar subdominio de Render (Gratis)

Tu app estará en:
```
https://lennin-ventas-web.onrender.com
```

#### Opción B: Dominio Personalizado

Si tienes un dominio propio (ej: `ventas.lennin.com`):

1. En Render → **"Settings"** → **"Custom Domain"**
2. Agrega: `ventas.lennin.com`
3. Render te dará registros DNS:
   ```
   Tipo: CNAME
   Nombre: ventas
   Valor: lennin-ventas-web.onrender.com
   ```
4. Configura estos registros en tu proveedor de dominio
5. Espera propagación DNS (5-60 minutos)
6. SSL automático se activará

---

### Paso 8: Optimizaciones para Producción

#### 8.1 Actualizar composer.json

```json
{
  "require": {
    "php": "^8.2",
    "ext-pdo": "*",
    "ext-mbstring": "*",
    "ext-openssl": "*"
  },
  "scripts": {
    "post-autoload-dump": [
      "Illuminate\\Foundation\\ComposerScripts::postAutoloadDump",
      "@php artisan package:discover --ansi"
    ],
    "post-update-cmd": [
      "@php artisan vendor:publish --tag=laravel-assets --ansi --force"
    ],
    "post-root-package-install": [
      "@php -r \"file_exists('.env') || copy('.env.example', '.env');\""
    ],
    "post-create-project-cmd": [
      "@php artisan key:generate --ansi"
    ]
  }
}
```

#### 8.2 Configurar Storage

Si usas almacenamiento de archivos:

```bash
# Agregar en build command
php artisan storage:link
```

O usa S3/Cloudinary para archivos en producción.

---

### Paso 9: Monitoreo y Mantenimiento

#### Ver Logs en Tiempo Real
- Render Dashboard → Tu servicio → **"Logs"**

#### Métricas
- Dashboard → **"Metrics"** (CPU, RAM, requests)

#### Actualizar la App

Cada vez que hagas `git push` a la rama `main`, Render redespliegará automáticamente:

```bash
# Hacer cambios en el código
git add .
git commit -m "Actualización de funcionalidad X"
git push origin main

# Render detecta el push y redespliega (5-10 min)
```

---

### Paso 10: Mantener el Servidor Activo (Opcional)

El plan gratuito de Render "duerme" el servicio después de 15 minutos sin tráfico.

**Solución**: Crear cron job que haga ping cada 10 minutos

#### Usar Cron-Job.org (Gratis)

1. Ve a https://cron-job.org/en/
2. Registrarse gratis
3. Crear nuevo cron job:
   ```
   URL: https://lennin-ventas-web.onrender.com
   Intervalo: cada 10 minutos
   ```

---

## 🔄 ARQUITECTURA COMPLETA EN PRODUCCIÓN

```
┌─────────────────────────────────────────┐
│         RENDER.COM (Gratis)             │
├─────────────────────────────────────────┤
│                                         │
│  📱 App Android                         │
│       ↓                                 │
│  🌐 Backend Node.js (Puerto 5000)      │
│     lennin-ventas-api.onrender.com     │
│       ↓                                 │
│  🗄️  MongoDB Atlas                      │
│                                         │
│  💻 Sistema Web Laravel (Puerto 10000) │
│     lennin-ventas-web.onrender.com     │
│       ↓                                 │
│  🗄️  PostgreSQL (Render)                │
│                                         │
└─────────────────────────────────────────┘
```

---

## ✅ CHECKLIST DE DESPLIEGUE WEB

### Antes de Desplegar
- [ ] Proyecto funciona en local
- [ ] Código subido a GitHub
- [ ] `.env.example` actualizado
- [ ] Assets compilados con `npm run build`
- [ ] Migraciones probadas

### Configuración en Render
- [ ] Base de datos PostgreSQL creada
- [ ] Web Service creado
- [ ] Variables de entorno configuradas
- [ ] APP_KEY generado
- [ ] Credenciales de DB correctas

### Post-Despliegue
- [ ] Migraciones ejecutadas
- [ ] Seeders ejecutados (opcional)
- [ ] URL funciona correctamente
- [ ] Login funciona
- [ ] Assets se cargan (CSS/JS)
- [ ] Base de datos conecta

---

## 🆚 COMPARACIÓN: RENDER vs OTRAS OPCIONES

| Característica | Render | Railway | Fly.io | Heroku |
|---------------|--------|---------|--------|--------|
| **Precio** | Gratis | $5 crédito/mes | Gratis | Desde $7/mes |
| **Laravel** | ✅ Excelente | ✅ Excelente | ✅ Bueno | ✅ Excelente |
| **Base de datos** | PostgreSQL gratis | MySQL/Postgres | Postgres | Desde $5/mes |
| **SSL/HTTPS** | ✅ Automático | ✅ Automático | ✅ Automático | ✅ Automático |
| **Despliegue** | Git push | Git push | Git push | Git push |
| **Facilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Límites** | Se duerme | $5/mes gratis | 3 apps | - |

---

## 🎯 URLS FINALES DEL PROYECTO

Después de desplegar todo:

```bash
# Sistema Web Laravel
https://lennin-ventas-web.onrender.com

# API Backend Node.js
https://lennin-ventas-api.onrender.com

# Health check de la API
https://lennin-ventas-api.onrender.com/health

# Endpoints de la API
https://lennin-ventas-api.onrender.com/api/auth/login
https://lennin-ventas-api.onrender.com/api/productos
https://lennin-ventas-api.onrender.com/api/ventas
```

---

## 📞 TROUBLESHOOTING

### Error: "Application key not set"
```bash
# Generar nueva key:
php artisan key:generate --show

# Agregar en Render Environment Variables
APP_KEY=base64:LA_CLAVE_GENERADA
```

### Error: "SQLSTATE[08006] Connection refused"
- Verifica que las credenciales de PostgreSQL sean correctas
- Copia exactamente desde Render Database dashboard

### Assets no se cargan (CSS/JS)
```bash
# Verificar que build command incluya:
npm run build

# Y en .env de producción:
APP_ENV=production
```

### La app se "duerme"
- Normal en plan gratuito
- Usa cron-job.org para hacer ping cada 10 min

---

**LENNIN S.A.C** - Sistema de Ventas © 2025
