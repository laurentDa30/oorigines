<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="õ origines – Événement sportif et culturel à Sernhac (Gard), le 24 avril 2027. Trail, nature, tradition et époque romaine.">
  <meta property="og:title" content="õ origines – Sernhac 2027">
  <meta property="og:description" content="Trail · Nature · Tradition · Époque Romaine – Le 24 avril 2027">
  <meta property="og:type" content="website">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>õ origines – Sernhac 2027</title>
  <link rel="preload" as="image" href="/images/hero.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="anonymous">
  @viteReactRefresh
  @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
  <div id="root"></div>
  <script>
    window.__SITE_OPEN      = "{{ $settings->date_ouverture_site?->toIso8601String() ?? '2026-09-01T00:00:00' }}";
    window.__EVENT_DATE     = "{{ $settings->date_evenement?->toIso8601String() ?? '2027-04-24T08:00:00' }}";
    window.__CSRF_TOKEN     = "{{ csrf_token() }}";
    window.__ARTISAN_COUNT  = {{ $artisanCount }};
    window.__PARTENAIRES    = {!! $partenaires->toJson() !!};
    window.__ARTISANS       = {!! $artisans->toJson() !!};
    window.__GALERIE        = {!! $galerie->toJson() !!};
  </script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin="anonymous"></script>
</body>
</html>
