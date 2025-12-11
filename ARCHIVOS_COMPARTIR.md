# 📦 Archivos para Compartir - Sistema de Ventas LENNIN S.A.C

Este documento lista los archivos necesarios para que otra persona pueda probar el sistema localmente.

---

## ✅ Archivos que SÍ se deben compartir

### Archivos de Configuración de Entorno (plantillas)
- ✅ `.env.local.example` - Configuración para desarrollo local (MySQL)
- ✅ `.env.production.example` - Configuración para producción (PostgreSQL)
- ✅ `.env.example` - Plantilla general de referencia

### Scripts de Instalación
- ✅ `instalar_local.ps1` - Script automático para PowerShell
- ✅ `instalar_local.bat` - Script automático para CMD
- ✅ `iniciar_servidor.ps1` - Iniciar servidor (PowerShell)
- ✅ `iniciar_servidor.bat` - Iniciar servidor (CMD)

### Documentación
- ✅ `README.md` - Documentación principal
- ✅ `INSTALACION_LOCAL.md` - Guía detallada de instalación local
- ✅ `DEPLOYMENT.md` - Guía de despliegue
- ✅ `RENDER_DEPLOYMENT.md` - Guía para Render.com

### Archivos de Dependencias
- ✅ `composer.json` - Dependencias PHP
- ✅ `composer.lock` - Versiones exactas de PHP
- ✅ `package.json` - Dependencias JavaScript
- ✅ `package-lock.json` - Versiones exactas de JS

### Todo el código fuente
- ✅ `app/` - Código PHP (Controllers, Models, etc.)
- ✅ `database/` - Migraciones y Seeders
- ✅ `resources/` - Vistas, JS, CSS
- ✅ `routes/` - Rutas de la aplicación
- ✅ `config/` - Configuración de Laravel
- ✅ `public/` - (solo archivos estáticos, NO la carpeta build/)

---

## ❌ Archivos que NO se deben compartir

### Archivos Sensibles
- ❌ `.env` - Contiene credenciales reales
- ❌ `.env.backup` - Respaldos del .env
- ❌ `storage/logs/` - Logs con información sensible

### Archivos Generados
- ❌ `vendor/` - Se genera con `composer install`
- ❌ `node_modules/` - Se genera con `npm install`
- ❌ `public/build/` - Se genera con `npm run build`

### Archivos de IDE
- ❌ `.vscode/`
- ❌ `.idea/`

---

## 📋 Pasos para compartir el proyecto

### Opción 1: Usar Git (Recomendado)
```bash
# Todo lo necesario ya está en el repositorio
git clone <url-repositorio>
```

### Opción 2: Comprimir y enviar
```powershell
# En PowerShell, desde la carpeta del proyecto:

# Crear archivo ZIP excluyendo archivos innecesarios
$exclude = @("vendor", "node_modules", "public\build", ".env", "storage\logs\*.log")
Compress-Archive -Path * -DestinationPath "sistema_ventas_lennin.zip" -Force
```

### Lo que debe hacer la otra persona:

1. **Descomprimir** el archivo o clonar el repositorio
2. **Ejecutar el instalador**:
   ```powershell
   .\instalar_local.ps1
   ```
3. **Seguir las instrucciones** en pantalla
4. **Acceder** a http://localhost:8000

---

## 🔧 Requisitos del equipo destino

- PHP >= 8.2
- Composer >= 2.0
- Node.js >= 18
- MySQL >= 8.0 (o MariaDB >= 10.5)
- **Recomendado**: Laragon (incluye todo lo necesario)

---

## 📞 Si hay problemas

Ver el archivo `INSTALACION_LOCAL.md` para solución de problemas comunes.
