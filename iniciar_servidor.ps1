# ============================================
# Iniciar Servidor de Desarrollo
# Sistema de Ventas LENNIN S.A.C
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SERVIDOR DE DESARROLLO                   " -ForegroundColor Cyan
Write-Host "  Sistema de Ventas LENNIN S.A.C           " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que .env existe
if (-not (Test-Path ".env")) {
    Write-Host "[ERROR] Archivo .env no encontrado." -ForegroundColor Red
    Write-Host "Ejecuta primero: .\instalar_local.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "Selecciona el modo de inicio:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Solo servidor PHP (recomendado para produccion local)" -ForegroundColor White
Write-Host "  2. Servidor PHP + Vite (desarrollo con hot reload)" -ForegroundColor White
Write-Host "  3. Compilar assets y salir" -ForegroundColor White
Write-Host ""

$opcion = Read-Host "Opcion (1/2/3)"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "Iniciando servidor PHP..." -ForegroundColor Green
        Write-Host "URL: http://localhost:8000" -ForegroundColor Cyan
        Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
        Write-Host ""
        Start-Process "http://localhost:8000"
        php artisan serve
    }
    "2" {
        Write-Host ""
        Write-Host "Iniciando servidor en modo desarrollo..." -ForegroundColor Green
        Write-Host "Este modo ejecuta PHP y Vite en paralelo." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "URLs:" -ForegroundColor Cyan
        Write-Host "  - App: http://localhost:8000" -ForegroundColor White
        Write-Host "  - Vite: http://localhost:5173 (HMR)" -ForegroundColor White
        Write-Host ""
        Write-Host "Presiona Ctrl+C para detener ambos servidores" -ForegroundColor Yellow
        Write-Host ""
        Start-Process "http://localhost:8000"
        composer dev
    }
    "3" {
        Write-Host ""
        Write-Host "Compilando assets..." -ForegroundColor Green
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "[OK] Assets compilados exitosamente!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "[ERROR] Error al compilar assets" -ForegroundColor Red
        }
    }
    default {
        Write-Host ""
        Write-Host "Opcion no valida. Iniciando servidor PHP por defecto..." -ForegroundColor Yellow
        Start-Process "http://localhost:8000"
        php artisan serve
    }
}
