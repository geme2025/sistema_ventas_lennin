# ========================================
# SCRIPT DE VERIFICACIÓN DEL SISTEMA
# Sistema de Ventas LENNIN S.A.C
# ========================================

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Sistema de Ventas LENNIN S.A.C" -ForegroundColor Cyan
Write-Host "  Verificación del Sistema" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$errores = 0
$warnings = 0

# ========================================
# VERIFICAR ESTRUCTURA DEL PROYECTO
# ========================================
Write-Host "📁 Verificando estructura del proyecto..." -ForegroundColor Yellow
Write-Host ""

$archivosRequeridos = @(
    "composer.json",
    "package.json",
    "artisan",
    ".env",
    "backend/package.json",
    "backend/.env",
    "backend/server.js"
)

foreach ($archivo in $archivosRequeridos) {
    Write-Host "   Verificando: $archivo..." -NoNewline
    if (Test-Path $archivo) {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌ NO ENCONTRADO" -ForegroundColor Red
        $errores++
    }
}

Write-Host ""

# ========================================
# VERIFICAR DEPENDENCIAS
# ========================================
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow
Write-Host ""

# Vendor Laravel
Write-Host "   Laravel vendor/..." -NoNewline
if (Test-Path "vendor/autoload.php") {
    Write-Host " ✅" -ForegroundColor Green
} else {
    Write-Host " ❌ Ejecuta: composer install" -ForegroundColor Red
    $errores++
}

# Node modules frontend
Write-Host "   Node modules (frontend)..." -NoNewline
if (Test-Path "node_modules") {
    Write-Host " ✅" -ForegroundColor Green
} else {
    Write-Host " ❌ Ejecuta: npm install" -ForegroundColor Red
    $errores++
}

# Node modules backend
Write-Host "   Node modules (backend)..." -NoNewline
if (Test-Path "backend/node_modules") {
    Write-Host " ✅" -ForegroundColor Green
} else {
    Write-Host " ⚠️  Ejecuta: cd backend && npm install" -ForegroundColor Yellow
    $warnings++
}

Write-Host ""

# ========================================
# VERIFICAR CONFIGURACIÓN
# ========================================
Write-Host "⚙️  Verificando configuración..." -ForegroundColor Yellow
Write-Host ""

# Leer .env de Laravel
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw

    Write-Host "   APP_KEY de Laravel..." -NoNewline
    if ($envContent -match "APP_KEY=base64:") {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌ Ejecuta: php artisan key:generate" -ForegroundColor Red
        $errores++
    }

    Write-Host "   DB_DATABASE configurado..." -NoNewline
    if ($envContent -match "DB_DATABASE=lennin_ventas") {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ⚠️  Verifica DB_DATABASE en .env" -ForegroundColor Yellow
        $warnings++
    }
}

# Leer .env del backend
if (Test-Path "backend/.env") {
    $backendEnv = Get-Content "backend/.env" -Raw

    Write-Host "   MongoDB URI configurado..." -NoNewline
    if ($backendEnv -match "MONGODB_URI=mongodb") {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ⚠️  Verifica MONGODB_URI en backend/.env" -ForegroundColor Yellow
        $warnings++
    }

    Write-Host "   JWT_SECRET configurado..." -NoNewline
    if ($backendEnv -match "JWT_SECRET=" -and $backendEnv -notmatch "JWT_SECRET=tu_clave") {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ⚠️  Genera un JWT_SECRET seguro" -ForegroundColor Yellow
        $warnings++
    }
}

Write-Host ""

# ========================================
# VERIFICAR SERVICIOS
# ========================================
Write-Host "🔌 Verificando servicios..." -ForegroundColor Yellow
Write-Host ""

# Verificar MySQL
Write-Host "   MySQL (puerto 3306)..." -NoNewline
try {
    $mysqlTest = Test-NetConnection -ComputerName localhost -Port 3306 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($mysqlTest.TcpTestSucceeded) {
        Write-Host " ✅ Corriendo" -ForegroundColor Green
    } else {
        Write-Host " ❌ NO disponible" -ForegroundColor Red
        Write-Host "      Inicia MySQL desde Laragon" -ForegroundColor Yellow
        $errores++
    }
} catch {
    Write-Host " ⚠️  No se pudo verificar" -ForegroundColor Yellow
    $warnings++
}

# Verificar si Laravel está corriendo
Write-Host "   Laravel (puerto 8000)..." -NoNewline
try {
    $laravelTest = Test-NetConnection -ComputerName localhost -Port 8000 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($laravelTest.TcpTestSucceeded) {
        Write-Host " ✅ Corriendo" -ForegroundColor Green
    } else {
        Write-Host " ⏸️  No iniciado (ejecuta: php artisan serve)" -ForegroundColor Gray
    }
} catch {
    Write-Host " ⏸️  No iniciado" -ForegroundColor Gray
}

# Verificar si Backend Node.js está corriendo
Write-Host "   Backend Node.js (puerto 5000)..." -NoNewline
try {
    $backendTest = Test-NetConnection -ComputerName localhost -Port 5000 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($backendTest.TcpTestSucceeded) {
        Write-Host " ✅ Corriendo" -ForegroundColor Green
    } else {
        Write-Host " ⏸️  No iniciado (ejecuta: cd backend && npm run dev)" -ForegroundColor Gray
    }
} catch {
    Write-Host " ⏸️  No iniciado" -ForegroundColor Gray
}

Write-Host ""

# ========================================
# VERIFICAR BASE DE DATOS
# ========================================
Write-Host "🗄️  Verificando base de datos..." -ForegroundColor Yellow
Write-Host ""

try {
    $dbCheck = php artisan migrate:status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   Migraciones..." -NoNewline
        Write-Host " ✅ Ejecutadas" -ForegroundColor Green
    } else {
        Write-Host "   Migraciones..." -NoNewline
        Write-Host " ❌ Pendientes" -ForegroundColor Red
        Write-Host "      Ejecuta: php artisan migrate --seed" -ForegroundColor Yellow
        $errores++
    }
} catch {
    Write-Host "   ⚠️  No se pudo verificar estado de migraciones" -ForegroundColor Yellow
    $warnings++
}

Write-Host ""

# ========================================
# VERIFICAR COMPILACIÓN DE ASSETS
# ========================================
Write-Host "🎨 Verificando assets compilados..." -ForegroundColor Yellow
Write-Host ""

Write-Host "   public/build/manifest.json..." -NoNewline
if (Test-Path "public/build/manifest.json") {
    Write-Host " ✅" -ForegroundColor Green
} else {
    Write-Host " ⚠️  Ejecuta: npm run build" -ForegroundColor Yellow
    $warnings++
}

Write-Host ""

# ========================================
# RESUMEN
# ========================================
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE VERIFICACIÓN" -ForegroundColor White
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

if ($errores -eq 0 -and $warnings -eq 0) {
    Write-Host "✅ Sistema completamente funcional" -ForegroundColor Green
    Write-Host "   No se encontraron errores ni advertencias" -ForegroundColor Green
} elseif ($errores -eq 0) {
    Write-Host "⚠️  Sistema funcional con advertencias" -ForegroundColor Yellow
    Write-Host "   Errores: $errores" -ForegroundColor Green
    Write-Host "   Advertencias: $warnings" -ForegroundColor Yellow
} else {
    Write-Host "❌ Sistema con errores" -ForegroundColor Red
    Write-Host "   Errores: $errores" -ForegroundColor Red
    Write-Host "   Advertencias: $warnings" -ForegroundColor Yellow
}

Write-Host ""

if ($errores -eq 0) {
    Write-Host "🚀 Comandos para iniciar el sistema:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Terminal 1 - Laravel:" -ForegroundColor White
    Write-Host "   php artisan serve" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Terminal 2 - Backend Node.js:" -ForegroundColor White
    Write-Host "   cd backend" -ForegroundColor Gray
    Write-Host "   npm run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Accesos:" -ForegroundColor White
    Write-Host "   http://localhost:8000  (Sistema Web)" -ForegroundColor Gray
    Write-Host "   http://localhost:5000  (API Backend)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
