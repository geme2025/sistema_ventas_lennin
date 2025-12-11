# ============================================
# Script de Instalación Local - Sistema de Ventas LENNIN S.A.C
# Para Windows PowerShell
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  INSTALACION LOCAL - SISTEMA DE VENTAS    " -ForegroundColor Cyan
Write-Host "         LENNIN S.A.C                      " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Función para mostrar errores y salir
function Exit-WithError {
    param([string]$Message)
    Write-Host ""
    Write-Host "[ERROR] $Message" -ForegroundColor Red
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Función para mostrar éxito
function Write-Success {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

# Función para mostrar información
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Yellow
}

# ============================================
# VERIFICACIONES PREVIAS
# ============================================

Write-Host "Verificando requisitos..." -ForegroundColor Yellow
Write-Host ""

# Verificar PHP
Write-Host "Verificando PHP..." -NoNewline
try {
    $phpVersion = php -v 2>&1
    if ($LASTEXITCODE -ne 0) { throw "PHP no encontrado" }
    Write-Success " PHP instalado"
} catch {
    Exit-WithError "PHP no esta instalado o no esta en el PATH. Instala Laragon o XAMPP."
}

# Verificar Composer
Write-Host "Verificando Composer..." -NoNewline
try {
    $composerVersion = composer --version 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Composer no encontrado" }
    Write-Success " Composer instalado"
} catch {
    Exit-WithError "Composer no esta instalado. Descargalo de https://getcomposer.org"
}

# Verificar Node.js
Write-Host "Verificando Node.js..." -NoNewline
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Node no encontrado" }
    Write-Success " Node.js instalado ($nodeVersion)"
} catch {
    Exit-WithError "Node.js no esta instalado. Descargalo de https://nodejs.org"
}

# Verificar NPM
Write-Host "Verificando NPM..." -NoNewline
try {
    $npmVersion = npm --version 2>&1
    if ($LASTEXITCODE -ne 0) { throw "NPM no encontrado" }
    Write-Success " NPM instalado (v$npmVersion)"
} catch {
    Exit-WithError "NPM no esta instalado."
}

Write-Host ""
Write-Host "Todos los requisitos estan instalados!" -ForegroundColor Green
Write-Host ""

# ============================================
# INSTALACION
# ============================================

# Paso 1: Instalar dependencias de Composer
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Paso 1/7: Instalando dependencias PHP..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
composer install --no-interaction
if ($LASTEXITCODE -ne 0) {
    Exit-WithError "Error al instalar dependencias de Composer"
}
Write-Success "Dependencias PHP instaladas"
Write-Host ""

# Paso 2: Instalar dependencias de NPM
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Paso 2/7: Instalando dependencias JavaScript..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Exit-WithError "Error al instalar dependencias de NPM"
}
Write-Success "Dependencias JavaScript instaladas"
Write-Host ""

# Paso 3: Crear archivo .env
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Paso 3/7: Configurando archivo de entorno..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
if (Test-Path ".env") {
    Write-Info "El archivo .env ya existe. Creando respaldo..."
    Copy-Item ".env" ".env.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Write-Success "Respaldo creado"
}
Copy-Item ".env.local.example" ".env" -Force
Write-Success "Archivo .env creado para desarrollo local"
Write-Host ""

# Paso 4: Generar clave de aplicación
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Paso 4/7: Generando clave de aplicacion..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
php artisan key:generate
if ($LASTEXITCODE -ne 0) {
    Exit-WithError "Error al generar la clave de aplicacion"
}
Write-Success "Clave de aplicacion generada"
Write-Host ""

# Paso 5: Crear base de datos
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Paso 5/7: Configurando base de datos..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "IMPORTANTE: Asegurate de que MySQL este corriendo." -ForegroundColor Yellow
Write-Host ""
Write-Host "Opciones para crear la base de datos:" -ForegroundColor White
Write-Host "  1. Intentar crear automaticamente (MySQL sin password)" -ForegroundColor White
Write-Host "  2. Ya la cree manualmente" -ForegroundColor White
Write-Host "  3. Salir y crearla manualmente" -ForegroundColor White
Write-Host ""

$dbOption = Read-Host "Selecciona una opcion (1/2/3)"

switch ($dbOption) {
    "1" {
        Write-Info "Intentando crear base de datos..."
        try {
            # Intentar con mysql sin password (Laragon por defecto)
            $result = mysql -u root -e "CREATE DATABASE IF NOT EXISTS sistema_ventas_lennin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Base de datos creada exitosamente"
            } else {
                Write-Host ""
                Write-Host "No se pudo crear automaticamente." -ForegroundColor Yellow
                Write-Host "Por favor, crea la base de datos manualmente:" -ForegroundColor Yellow
                Write-Host ""
                Write-Host "  CREATE DATABASE sistema_ventas_lennin;" -ForegroundColor White
                Write-Host ""
                Read-Host "Presiona Enter cuando hayas creado la base de datos"
            }
        } catch {
            Write-Host ""
            Write-Host "MySQL no esta disponible o tiene password." -ForegroundColor Yellow
            Write-Host "Por favor, crea la base de datos manualmente:" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "  CREATE DATABASE sistema_ventas_lennin;" -ForegroundColor White
            Write-Host ""
            Read-Host "Presiona Enter cuando hayas creado la base de datos"
        }
    }
    "2" {
        Write-Success "Continuando con la instalacion..."
    }
    "3" {
        Write-Host ""
        Write-Host "Instrucciones para crear la base de datos:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1. Abre phpMyAdmin, HeidiSQL o MySQL CLI" -ForegroundColor White
        Write-Host "2. Ejecuta: CREATE DATABASE sistema_ventas_lennin;" -ForegroundColor White
        Write-Host "3. Vuelve a ejecutar este script" -ForegroundColor White
        Write-Host ""
        exit 0
    }
    default {
        Write-Info "Opcion no valida. Continuando..."
    }
}
Write-Host ""

# Paso 6: Ejecutar migraciones y seeders
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Paso 6/7: Ejecutando migraciones y seeders..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Esto creara las tablas y datos de prueba." -ForegroundColor Yellow
Write-Host "Si la base de datos ya tiene datos, seran eliminados." -ForegroundColor Yellow
Write-Host ""

$continuar = Read-Host "Continuar? (s/n)"
if ($continuar -eq "s" -or $continuar -eq "S" -or $continuar -eq "si" -or $continuar -eq "SI") {
    php artisan migrate:fresh --seed --force
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "Error en las migraciones. Posibles causas:" -ForegroundColor Red
        Write-Host "  - La base de datos no existe" -ForegroundColor Red
        Write-Host "  - MySQL no esta corriendo" -ForegroundColor Red
        Write-Host "  - Credenciales incorrectas en .env" -ForegroundColor Red
        Write-Host ""
        Write-Host "Revisa el archivo .env y asegurate de que:" -ForegroundColor Yellow
        Write-Host "  DB_DATABASE=sistema_ventas_lennin" -ForegroundColor White
        Write-Host "  DB_USERNAME=root" -ForegroundColor White
        Write-Host "  DB_PASSWORD= (vacio para Laragon)" -ForegroundColor White
        Write-Host ""
        Exit-WithError "Error en migraciones"
    }
    Write-Success "Migraciones y seeders ejecutados"
} else {
    Write-Info "Migraciones omitidas. Ejecuta manualmente: php artisan migrate:fresh --seed"
}
Write-Host ""

# Paso 7: Compilar assets
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Paso 7/7: Compilando assets..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Exit-WithError "Error al compilar assets"
}
Write-Success "Assets compilados"
Write-Host ""

# ============================================
# FINALIZACION
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  INSTALACION COMPLETADA EXITOSAMENTE!     " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar el servidor, ejecuta:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  php artisan serve" -ForegroundColor White
Write-Host ""
Write-Host "Luego abre en tu navegador:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "CREDENCIALES DE PRUEBA:" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Admin:     admin@lennin.com / password" -ForegroundColor White
Write-Host "  Vendedor1: vendedor1@lennin.com / password" -ForegroundColor White
Write-Host "  Vendedor2: vendedor2@lennin.com / password" -ForegroundColor White
Write-Host ""
Write-Host "============================================" -ForegroundColor Yellow
Write-Host ""

$iniciar = Read-Host "Deseas iniciar el servidor ahora? (s/n)"
if ($iniciar -eq "s" -or $iniciar -eq "S" -or $iniciar -eq "si" -or $iniciar -eq "SI") {
    Write-Host ""
    Write-Host "Iniciando servidor en http://localhost:8000..." -ForegroundColor Green
    Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
    Write-Host ""
    Start-Process "http://localhost:8000"
    php artisan serve
}
