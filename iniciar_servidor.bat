@echo off
REM ============================================
REM Iniciar Servidor de Desarrollo
REM Sistema de Ventas LENNIN S.A.C
REM ============================================

echo.
echo ============================================
echo   SERVIDOR DE DESARROLLO
echo   Sistema de Ventas LENNIN S.A.C
echo ============================================
echo.

if not exist .env (
    echo [ERROR] Archivo .env no encontrado.
    echo Ejecuta primero: instalar_local.bat
    pause
    exit /b 1
)

echo Iniciando servidor PHP...
echo URL: http://localhost:8000
echo Presiona Ctrl+C para detener
echo.

start http://localhost:8000
php artisan serve
