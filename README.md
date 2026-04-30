# õ origines — Site officiel

Site officiel de l'événement sportif et culturel de Sernhac (Gard).

**URL cible :** [oorigines.sernhacmultisports.fr](https://oorigines.sernhacmultisports.fr)

## Stack technique

| Brique | Outil |
|---|---|
| Framework back-end | Laravel 11 (PHP 8.2+) |
| Panel d'administration | Laravel Filament v3 |
| Front-end | Blade + React 18 (Vite) |
| Base de données | MySQL (production) / SQLite (dev) |
| Emails | Laravel Mail via SMTP OVH |
| Hébergement | OVH Hébergement Pro |

## Installation locale

```bash
git clone https://github.com/laurentDa30/oorigines.git
cd oorigines

composer install
cp .env.example .env
# Éditer .env avec vos identifiants DB
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

npm install
npm run build
```

## Déploiement OVH (production)

```bash
# 1. Connexion SSH OVH
ssh user@ssh.cluster0XX.hosting.ovh.net

# 2. Cloner le projet
cd /home/xxx/oorigines
git clone https://github.com/laurentDa30/oorigines.git .

# 3. Configurer l'environnement
cp .env.example .env
# Remplir .env avec les paramètres OVH (DB, SMTP)
php artisan key:generate

# 4. Installer et migrer
composer install --no-dev --optimize-autoloader
php artisan migrate --seed
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 5. Build frontend
npm ci && npm run build
```

## Panel d'administration

Accessible sur `/admin` après création d'un compte :

```bash
php artisan make:filament-user
```

### Ressources disponibles

- **Artisans** — Gérer les artisans du marché
- **Partenaires** — Gérer les partenaires (Or/Argent/Bronze)
- **Galerie** — Photos et vidéos
- **Messages** — Formulaire de contact reçus
- **Configuration** — Dates d'ouverture et d'événement

## Structure

```
app/
├── Filament/Resources/    ← Panel admin
├── Http/Controllers/      ← PageController + ContactController
├── Mail/                  ← ContactNotification
└── Models/                ← Artisan, Partenaire, Galerie, Message, Setting

resources/
├── js/app.jsx             ← Application React complète
├── css/app.css            ← Styles (Cinzel + EB Garamond, palette romaine)
└── views/
    ├── app.blade.php      ← Shell HTML principal
    └── emails/contact.blade.php

public/images/             ← Photos du Vallon (à remplacer par vos propres photos)
storage/app/public/gpx/    ← Fichiers GPX des parcours
```

## Coûts

| Service | Coût |
|---|---|
| OVH Hébergement Pro | ~5,99 €/mois |
| Nom de domaine (existant) | 0 € |
| Laravel + Filament | 0 € (open source) |
| **Total** | **~6 €/mois** |
