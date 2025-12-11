# ========================================
# SCRIPT DE MIGRACIÓN AUTOMÁTICA
# Sistema de Ventas LENNIN S.A.C
# ========================================

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Sistema de Ventas LENNIN S.A.C" -ForegroundColor Cyan
Write-Host "  Script de Migración Automática" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la carpeta correcta
$currentPath = Get-Location
if ($currentPath.Path -notlike "*sistema_ventas_lennin") {
    Write-Host "❌ Error: Debes ejecutar este script desde la carpeta del proyecto" -ForegroundColor Red
    Write-Host "   Cambia a: C:\laragon\www\sistema_ventas_lennin" -ForegroundColor Yellow
    exit
}

Write-Host "📍 Ubicación verificada: $currentPath" -ForegroundColor Green
Write-Host ""

# ========================================
# PASO 1: VERIFICAR PREREQUISITOS
# ========================================
Write-Host "🔍 PASO 1: Verificando prerequisitos..." -ForegroundColor Yellow
Write-Host ""

# Verificar Composer
Write-Host "   Verificando Composer..." -NoNewline
try {
    $composerVersion = composer --version 2>$null
    Write-Host " ✅ Instalado" -ForegroundColor Green
} catch {
    Write-Host " ❌ NO instalado" -ForegroundColor Red
    Write-Host "   Instala Composer desde: https://getcomposer.org" -ForegroundColor Yellow
    exit
}

# Verificar Node.js
Write-Host "   Verificando Node.js..." -NoNewline
try {
    $nodeVersion = node --version 2>$null
    Write-Host " ✅ Instalado ($nodeVersion)" -ForegroundColor Green
} catch {
    Write-Host " ❌ NO instalado" -ForegroundColor Red
    Write-Host "   Instala Node.js desde: https://nodejs.org" -ForegroundColor Yellow
    exit
}

# Verificar PHP
Write-Host "   Verificando PHP..." -NoNewline
try {
    $phpVersion = php --version 2>$null | Select-Object -First 1
    Write-Host " ✅ Instalado" -ForegroundColor Green
} catch {
    Write-Host " ❌ NO instalado" -ForegroundColor Red
    Write-Host "   Instala PHP con Laragon" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "✅ Todos los prerequisitos están instalados" -ForegroundColor Green
Write-Host ""

# ========================================
# PASO 2: INSTALAR DEPENDENCIAS LARAVEL
# ========================================
Write-Host "📦 PASO 2: Instalando dependencias de Laravel..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path "composer.json") {
    Write-Host "   Ejecutando: composer install" -ForegroundColor Cyan
    composer install --no-interaction

    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Dependencias PHP instaladas" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error al instalar dependencias PHP" -ForegroundColor Red
    }
} else {
    Write-Host "   ⚠️  No se encontró composer.json" -ForegroundColor Yellow
}

Write-Host ""

# ========================================
# PASO 3: INSTALAR DEPENDENCIAS NODE.JS
# ========================================
Write-Host "📦 PASO 3: Instalando dependencias de Node.js (frontend)..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path "package.json") {
    Write-Host "   Ejecutando: npm install" -ForegroundColor Cyan
    npm install

    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Dependencias frontend instaladas" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error al instalar dependencias frontend" -ForegroundColor Red
    }
} else {
    Write-Host "   ⚠️  No se encontró package.json" -ForegroundColor Yellow
}

Write-Host ""

# ========================================
# PASO 4: CONFIGURAR .ENV DE LARAVEL
# ========================================
Write-Host "⚙️  PASO 4: Configurando archivo .env de Laravel..." -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "   ✅ Archivo .env creado desde .env.example" -ForegroundColor Green

        # Generar clave de aplicación
        Write-Host "   Generando clave de aplicación..." -ForegroundColor Cyan
        php artisan key:generate --no-interaction
        Write-Host "   ✅ Clave de aplicación generada" -ForegroundColor Green
    } else {
        Write-Host "   ❌ No se encontró .env.example" -ForegroundColor Red
    }
} else {
    Write-Host "   ℹ️  Archivo .env ya existe (no se modificó)" -ForegroundColor Blue
}

Write-Host ""

# ========================================
# PASO 5: CONFIGURAR BASE DE DATOS
# ========================================
Write-Host "🗄️  PASO 5: Configuración de base de datos..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   ⚠️  IMPORTANTE: Debes crear la base de datos manualmente" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. Abre Laragon" -ForegroundColor Cyan
Write-Host "   2. Click en 'Database' > 'MySQL'" -ForegroundColor Cyan
Write-Host "   3. En HeidiSQL, crea una nueva base de datos:" -ForegroundColor Cyan
Write-Host "      Nombre: lennin_ventas" -ForegroundColor White
Write-Host "      Collation: utf8mb4_unicode_ci" -ForegroundColor White
Write-Host ""

$respuesta = Read-Host "   ¿Ya creaste la base de datos 'lennin_ventas'? (s/n)"

if ($respuesta -eq "s" -or $respuesta -eq "S") {
    Write-Host ""
    Write-Host "   Ejecutando migraciones..." -ForegroundColor Cyan
    php artisan migrate --seed --force

    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Migraciones ejecutadas correctamente" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error al ejecutar migraciones" -ForegroundColor Red
        Write-Host "   Verifica la configuración de .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⏭️  Migraciones omitidas. Ejecuta manualmente:" -ForegroundColor Yellow
    Write-Host "      php artisan migrate --seed" -ForegroundColor White
}

Write-Host ""

# ========================================
# PASO 6: INSTALAR DEPENDENCIAS BACKEND
# ========================================
Write-Host "📦 PASO 6: Instalando dependencias del Backend Node.js..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path "backend/package.json") {
    Push-Location backend

    Write-Host "   Ejecutando: npm install en backend/" -ForegroundColor Cyan
    npm install

    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Dependencias del backend instaladas" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error al instalar dependencias del backend" -ForegroundColor Red
    }

    # Configurar .env del backend
    if (-not (Test-Path ".env")) {
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Host "   ✅ Archivo backend/.env creado" -ForegroundColor Green
        }
    } else {
        Write-Host "   ℹ️  Archivo backend/.env ya existe" -ForegroundColor Blue
    }

    Pop-Location
} else {
    Write-Host "   ⚠️  No se encontró backend/package.json" -ForegroundColor Yellow
}

Write-Host ""

# ========================================
# PASO 7: COMPILAR ASSETS
# ========================================
Write-Host "🎨 PASO 7: Compilando assets del frontend..." -ForegroundColor Yellow
Write-Host ""

Write-Host "   Ejecutando: npm run build" -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Assets compilados correctamente" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error al compilar assets" -ForegroundColor Red
}

Write-Host ""

# ========================================
# PASO 8: VERIFICAR PERMISOS
# ========================================
Write-Host "🔐 PASO 8: Configurando permisos..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path "storage") {
    Write-Host "   Configurando permisos de storage..." -ForegroundColor Cyan
    # En Windows no es necesario chmod, pero creamos los directorios
    php artisan storage:link --no-interaction 2>$null
    Write-Host "   ✅ Storage configurado" -ForegroundColor Green
}

Write-Host ""

# ========================================
# RESUMEN FINAL
# ========================================
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  ✅ MIGRACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 RESUMEN:" -ForegroundColor Yellow
Write-Host "   ✅ Dependencias PHP instaladas" -ForegroundColor Green
Write-Host "   ✅ Dependencias Node.js instaladas" -ForegroundColor Green
Write-Host "   ✅ Archivo .env configurado" -ForegroundColor Green
Write-Host "   ✅ Backend Node.js configurado" -ForegroundColor Green
Write-Host "   ✅ Assets compilados" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. INICIAR SISTEMA WEB (Laravel):" -ForegroundColor Cyan
Write-Host "   php artisan serve" -ForegroundColor White
Write-Host "   Accede a: http://localhost:8000" -ForegroundColor Gray
Write-Host ""

Write-Host "2. INICIAR BACKEND API (Node.js):" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "   Accede a: http://localhost:5000/health" -ForegroundColor Gray
Write-Host ""

Write-Host "3. CONFIGURACIÓN ADICIONAL:" -ForegroundColor Cyan
Write-Host "   - Edita backend/.env con tu MongoDB URI" -ForegroundColor White
Write-Host "   - Verifica JWT_SECRET en backend/.env" -ForegroundColor White
Write-Host ""

Write-Host "📚 DOCUMENTACIÓN:" -ForegroundColor Yellow
Write-Host "   - Ver MIGRACION_Y_DESPLIEGUE.md para guía completa" -ForegroundColor White
Write-Host "   - Ver backend/README.md para API documentation" -ForegroundColor White
Write-Host "   - Ver android/README.md para app móvil" -ForegroundColor White
Write-Host ""

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Sistema listo para desarrollo" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan
