#!/usr/bin/env bash
# Script de déploiement OVH – õ origines
# Usage : bash deploy.sh

set -e

echo "→ Récupération du code..."
git pull origin main

echo "→ Installation des dépendances PHP..."
composer install --no-dev --optimize-autoloader

echo "→ Migrations..."
php artisan migrate --force --seed

echo "→ Build frontend..."
npm ci && npm run build

echo "→ Cache production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "→ Lien storage..."
php artisan storage:link

echo "✓ Déploiement terminé."
