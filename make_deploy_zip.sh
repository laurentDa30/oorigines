#!/bin/bash
# Génère un ZIP de déploiement pour hébergement mutualisé
# Usage : bash make_deploy_zip.sh

set -e

OUTPUT="oorigines_deploy_$(date +%Y%m%d).zip"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "→ Création de ${OUTPUT}..."

cd "$PROJECT_DIR"

# Vérifier que vendor/ est présent (nécessaire pour l'hébergement sans SSH)
if [ ! -d "vendor" ]; then
    echo "ERREUR : vendor/ absent. Lance d'abord : composer install --no-dev --optimize-autoloader"
    exit 1
fi

zip -r "../${OUTPUT}" . \
    --exclude "*.git*" \
    --exclude "*/node_modules/*" \
    --exclude ".env" \
    --exclude ".env.*" \
    --exclude "make_deploy_zip.sh" \
    --exclude "*.zip" \
    --exclude "storage/logs/*.log" \
    --exclude "storage/framework/cache/*" \
    --exclude "storage/framework/sessions/*" \
    --exclude "storage/framework/views/*" \
    --exclude "storage/app/public/*" \
    --exclude "tests/*" \
    --exclude "phpunit.xml" \
    --exclude "*.lock" \
    --exclude "Dockerfile" \
    --exclude "railway.json" \
    --exclude "nixpacks.toml" \
    --exclude "deploy.sh"

echo "✓ Zip créé : ../${OUTPUT}"
echo "  Taille : $(du -sh ../${OUTPUT} | cut -f1)"
echo ""
echo "Prochaines étapes :"
echo "  1. Upload ce zip via le File Manager du panel"
echo "  2. Extraire dans le dossier de ton domaine"
echo "  3. Uploader .env.hosting renommé en .env"
echo "  4. Ouvrir https://aux-origines.sernhac.fr/setup_server.php?token=TON_TOKEN&action=all"
