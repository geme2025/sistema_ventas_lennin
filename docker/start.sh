#!/bin/bash

# Script de inicio para Laravel en Render

# Crear directorios necesarios
mkdir -p /var/www/storage/framework/{sessions,views,cache}
mkdir -p /var/www/bootstrap/cache

# Configurar permisos
chown -R www-data:www-data /var/www/storage
chown -R www-data:www-data /var/www/bootstrap/cache
chmod -R 775 /var/www/storage
chmod -R 775 /var/www/bootstrap/cache

# Limpiar cache anterior
php artisan config:clear
php artisan cache:clear

# Optimizar Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ejecutar migraciones (solo en primer despliegue)
php artisan migrate --force

# Iniciar PHP-FPM en background
php-fpm -D

# Iniciar Nginx en foreground
nginx -g 'daemon off;'
