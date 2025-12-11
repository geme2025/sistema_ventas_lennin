@echo off
REM ============================================
REM Script de Instalacion Local - Sistema de Ventas LENNIN S.A.C
REM Para Windows CMD
REM ============================================

echo.
echo ============================================
echo   INSTALACION LOCAL - SISTEMA DE VENTAS
echo          LENNIN S.A.C
echo ============================================
echo.

REM Verificar PHP
echo Verificando PHP...
php -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PHP no esta instalado o no esta en el PATH.
    echo Instala Laragon o XAMPP.
    pause
    exit /b 1
)
echo [OK] PHP instalado

REM Verificar Composer
echo Verificando Composer...
composer --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Composer no esta instalado.
    echo Descargalo de https://getcomposer.org
    pause
    exit /b 1
)
echo [OK] Composer instalado

REM Verificar Node.js
echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado.
    echo Descargalo de https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js instalado

REM Verificar NPM
echo Verificando NPM...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] NPM no esta instalado.
    pause
    exit /b 1
)
echo [OK] NPM instalado

echo.
echo Todos los requisitos estan instalados!
echo.

REM Paso 1: Instalar dependencias PHP
echo ============================================
echo Paso 1/7: Instalando dependencias PHP...
echo ============================================
call composer install --no-interaction
if %errorlevel% neq 0 (
    echo [ERROR] Error al instalar dependencias de Composer
    pause
    exit /b 1
)
echo [OK] Dependencias PHP instaladas
echo.

REM Paso 2: Instalar dependencias NPM
echo ============================================
echo Paso 2/7: Instalando dependencias JavaScript...
echo ============================================
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error al instalar dependencias de NPM
    pause
    exit /b 1
)
echo [OK] Dependencias JavaScript instaladas
echo.

REM Paso 3: Crear archivo .env
echo ============================================
echo Paso 3/7: Configurando archivo de entorno...
echo ============================================
if exist .env (
    echo [INFO] El archivo .env ya existe. Creando respaldo...
    copy .env .env.backup
)
copy .env.local.example .env
echo [OK] Archivo .env creado para desarrollo local
echo.

REM Paso 4: Generar clave
echo ============================================
echo Paso 4/7: Generando clave de aplicacion...
echo ============================================
call php artisan key:generate
echo [OK] Clave generada
echo.

REM Paso 5: Base de datos
echo ============================================
echo Paso 5/7: Configurando base de datos...
echo ============================================
echo.
echo IMPORTANTE: Asegurate de que MySQL este corriendo.
echo.
echo Crea la base de datos manualmente si no existe:
echo   CREATE DATABASE sistema_ventas_lennin;
echo.
pause
echo.

REM Paso 6: Migraciones
echo ============================================
echo Paso 6/7: Ejecutando migraciones y seeders...
echo ============================================
call php artisan migrate:fresh --seed --force
if %errorlevel% neq 0 (
    echo [ERROR] Error en migraciones.
    echo Verifica que la base de datos existe y MySQL esta corriendo.
    pause
    exit /b 1
)
echo [OK] Migraciones completadas
echo.

REM Paso 7: Compilar assets
echo ============================================
echo Paso 7/7: Compilando assets...
echo ============================================
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Error al compilar assets
    pause
    exit /b 1
)
echo [OK] Assets compilados
echo.

echo.
echo ============================================
echo   INSTALACION COMPLETADA EXITOSAMENTE!
echo ============================================
echo.
echo Para iniciar el servidor, ejecuta:
echo   php artisan serve
echo.
echo Luego abre: http://localhost:8000
echo.
echo CREDENCIALES DE PRUEBA:
echo   Admin:     admin@lennin.com / password
echo   Vendedor1: vendedor1@lennin.com / password
echo   Vendedor2: vendedor2@lennin.com / password
echo.

set /p iniciar="Deseas iniciar el servidor ahora? (s/n): "
if /i "%iniciar%"=="s" (
    echo.
    echo Iniciando servidor...
    start http://localhost:8000
    php artisan serve
)

pause
