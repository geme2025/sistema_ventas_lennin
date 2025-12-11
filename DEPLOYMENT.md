# Sistema de Ventas LENNIN S.A.C

Sistema completo de gestión de ventas para juguetería desarrollado con Laravel 11, Inertia.js y React 19.

## 🚀 Características

### Módulos Implementados
- ✅ **Categorías**: Gestión completa de categorías de productos
- ✅ **Productos**: Inventario con control de stock, precios y alertas de stock bajo
- ✅ **Clientes**: Registro de clientes con DNI/RUC
- ✅ **Ventas**: Sistema completo de ventas con múltiples métodos de pago
- ✅ **Dashboard**: Panel con estadísticas en tiempo real y gráficos

### Tecnologías
- **Backend**: Laravel 11, MySQL, Eloquent ORM
- **Frontend**: React 19, TypeScript, Inertia.js v2
- **UI**: Tailwind CSS 4, Radix UI, Lucide Icons
- **Autenticación**: Laravel Fortify con 2FA

## 📦 Instalación para Desarrollo

```bash
# Clonar repositorio
git clone <url-repositorio>
cd sistema_ventas_lennin

# Instalar dependencias PHP
composer install

# Instalar dependencias Node
npm install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Crear base de datos
mysql -u root -e "CREATE DATABASE sistema_ventas_lennin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Ejecutar migraciones y seeders
php artisan migrate:fresh --seed

# Compilar assets
npm run build

# Iniciar servidor
php artisan serve
```

## 🌐 Despliegue a Producción

### Requisitos del Servidor
- PHP 8.2 o superior
- MySQL 8.0 o superior
- Composer 2.x
- Node.js 20.x o superior
- Servidor web (Apache/Nginx)

### Pasos para Despliegue

1. **Preparar el Servidor**
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar PHP y extensiones requeridas
sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-gd

# Instalar MySQL
sudo apt install mysql-server

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

2. **Configurar Aplicación**
```bash
# Clonar en el servidor
git clone <url-repositorio> /var/www/sistema_ventas_lennin
cd /var/www/sistema_ventas_lennin

# Instalar dependencias
composer install --optimize-autoloader --no-dev
npm install --production

# Configurar entorno
cp .env.production .env
php artisan key:generate

# Editar .env con credenciales de producción
nano .env
```

3. **Configurar Base de Datos**
```bash
# Crear base de datos
mysql -u root -p
CREATE DATABASE sistema_ventas_lennin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lennin_user'@'localhost' IDENTIFIED BY 'password_seguro';
GRANT ALL PRIVILEGES ON sistema_ventas_lennin.* TO 'lennin_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Ejecutar migraciones
php artisan migrate --force

# Crear usuario administrador
php artisan tinker
>>> \App\Models\User::create(['name' => 'Admin', 'email' => 'admin@lennin.com', 'password' => bcrypt('password_seguro')]);
>>> exit
```

4. **Compilar Assets**
```bash
npm run build
```

5. **Configurar Permisos**
```bash
sudo chown -R www-data:www-data /var/www/sistema_ventas_lennin
sudo chmod -R 755 /var/www/sistema_ventas_lennin
sudo chmod -R 775 /var/www/sistema_ventas_lennin/storage
sudo chmod -R 775 /var/www/sistema_ventas_lennin/bootstrap/cache
```

6. **Configurar Nginx**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/sistema_ventas_lennin/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

7. **Optimizar para Producción**
```bash
# Cachear configuración
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimizar Composer autoloader
composer dump-autoload --optimize

# Configurar queue worker (opcional)
sudo nano /etc/systemd/system/lennin-worker.service
```

Contenido de `lennin-worker.service`:
```ini
[Unit]
Description=Lennin Queue Worker
After=network.target

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /var/www/sistema_ventas_lennin/artisan queue:work --sleep=3 --tries=3

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable lennin-worker
sudo systemctl start lennin-worker
```

8. **Configurar SSL con Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

## 🔐 Credenciales por Defecto (Desarrollo)

- **Admin**: admin@lennin.com / password
- **Vendedor 1**: vendedor1@lennin.com / password
- **Vendedor 2**: vendedor2@lennin.com / password

⚠️ **IMPORTANTE**: Cambiar estas credenciales en producción.

## 📊 Características del Dashboard

- Ventas del día y mes en tiempo real
- Productos con stock bajo (alertas)
- Total de clientes y productos activos
- Ventas pendientes de confirmación
- Últimas 5 ventas realizadas
- Top 5 productos más vendidos

## 🔒 Seguridad

✅ Autenticación con Laravel Fortify
✅ Protección CSRF
✅ Validación de datos en servidor
✅ Sanitización de inputs
✅ Soft deletes para auditoría
✅ Logs de actividad
✅ Encriptación de contraseñas con bcrypt

## 📝 Mantenimiento

```bash
# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Backup de base de datos
mysqldump -u root -p sistema_ventas_lennin > backup_$(date +%Y%m%d).sql

# Ver logs
tail -f storage/logs/laravel.log
```

## ✅ Sistema Listo para Producción

El sistema está **completamente funcional** y listo para despliegue en producción con:

- ✅ Todas las funcionalidades CRUD implementadas
- ✅ Dashboard interactivo con estadísticas en tiempo real
- ✅ Validaciones completas en frontend y backend
- ✅ Manejo de errores robusto
- ✅ Base de datos optimizada con índices
- ✅ Assets compilados y optimizados
- ✅ Configuración lista para producción
- ✅ Documentación completa

## 📞 Soporte

Para soporte técnico o consultas, contactar al equipo de desarrollo.

---

**LENNIN S.A.C** - Sistema de Ventas v1.0
