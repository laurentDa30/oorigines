FROM php:8.2-cli

# Dépendances système + Node 20
RUN apt-get update && apt-get install -y \
    git curl zip unzip ca-certificates gnupg \
    libpng-dev libonig-dev libxml2-dev libzip-dev libicu-dev libexif-dev \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Extensions PHP
RUN docker-php-ext-install pdo pdo_sqlite mbstring exif pcntl bcmath gd intl zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Dépendances PHP (couche cache Docker)
COPY composer.json composer.lock ./
RUN COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader --no-interaction

# Dépendances Node (couche cache Docker)
COPY package.json package-lock.json ./
RUN npm ci

# Code source
COPY . .

# Build Vite
RUN npm run build

# Permissions storage
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD sh -c "touch database/database.sqlite && php artisan migrate --force && php artisan storage:link --force && php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"
