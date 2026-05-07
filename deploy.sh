#!/usr/bin/env bash
# Script de déploiement OVH Pro – õ origines
# Le build frontend est inclus dans le dépôt Git (public/build/)
# Usage SSH : bash deploy.sh

set -e

echo "→ Récupération du code..."
git pull origin main

echo "→ Dépendances PHP..."
composer install --no-dev --optimize-autoloader

echo "→ Migrations..."
php artisan migrate --force

echo "→ Cache production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "→ Lien storage..."
php artisan storage:link

echo "✓ Déploiement terminé."
