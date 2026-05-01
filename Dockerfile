FROM php:8.2-cli

# Dépendances système + Node 20
RUN apt-get update && apt-get install -y \
    git curl zip unzip ca-certificates gnupg \
    libpng-dev libonig-dev libxml2-dev libzip-dev libicu-dev libexif-dev libsqlite3-dev \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Extensions PHP
RUN docker-php-ext-install pdo pdo_sqlite mbstring exif pcntl bcmath gd intl zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Dépendances PHP sans scripts (artisan pas encore disponible)
COPY composer.json composer.lock ./
RUN COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --no-scripts --no-interaction

# Dépendances Node
COPY package.json package-lock.json ./
RUN npm ci

# Code source complet
COPY . .

# Post-install scripts maintenant qu'artisan est disponible
RUN COMPOSER_ALLOW_SUPERUSER=1 composer dump-autoload --no-dev --optimize

# Build Vite
RUN npm run build

# Permissions storage
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD sh -c "touch database/database.sqlite; php artisan migrate --force; php artisan db:seed --force; php artisan storage:link --force; php artisan config:cache; php artisan route:cache; php artisan view:cache; exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"
