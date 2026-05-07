<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  {{-- SEO : titre, description, canonical --}}
  <title>{{ $seo['title'] }}</title>
  <meta name="description" content="{{ $seo['description'] }}">
  <link rel="canonical" href="{{ $seo['canonical'] }}">

  {{-- Open Graph --}}
  <meta property="og:type"        content="website">
  <meta property="og:site_name"   content="Aux õrigines">
  <meta property="og:title"       content="{{ $seo['title'] }}">
  <meta property="og:description" content="{{ $seo['description'] }}">
  <meta property="og:url"         content="{{ $seo['canonical'] }}">
  <meta property="og:image"       content="{{ rtrim(config('app.url'),'/') }}/images/hero.jpg">
  <meta property="og:locale"      content="fr_FR">

  {{-- Twitter Card --}}
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="{{ $seo['title'] }}">
  <meta name="twitter:description" content="{{ $seo['description'] }}">
  <meta name="twitter:image"       content="{{ rtrim(config('app.url'),'/') }}/images/hero.jpg">

  {{-- Favicon --}}
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  {{-- Preloads --}}
  <link rel="preload" as="image" href="/images/hero.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="anonymous">
  @viteReactRefresh
  @vite(['resources/css/app.css', 'resources/js/app.jsx'])

  {{-- JSON-LD : Événement sportif --}}
  @php
    $eventIso  = $settings->date_evenement?->format('c') ?? '2027-04-24T08:00:00+02:00';
    $eventEnd  = $settings->date_evenement
      ? $settings->date_evenement->copy()->setTime(20, 0)->format('c')
      : '2027-04-24T20:00:00+02:00';
    $siteUrl   = rtrim(config('app.url'), '/');
    $coursesList = $courses->map(fn($c) => [
      '@type'       => 'Event',
      'name'        => $c['nom'],
      'description' => $c['tagline'] ?? '',
      'startDate'   => $eventIso,
      'url'         => $siteUrl.'/course/'.preg_replace('/[^a-z0-9]+/','-',mb_strtolower(strtr($c['nom'],['à'=>'a','â'=>'a','é'=>'e','è'=>'e','ê'=>'e','î'=>'i','ô'=>'o','ù'=>'u','û'=>'u','ç'=>'c','õ'=>'o']))),
    ])->values()->all();
    $jsonLd = [
      '@context'    => 'https://schema.org',
      '@type'       => 'SportsEvent',
      'name'        => 'Aux õrigines',
      'alternateName' => 'Aux Origines – Trail de Sernhac',
      'url'         => $siteUrl,
      'startDate'   => $eventIso,
      'endDate'     => $eventEnd,
      'eventStatus' => 'https://schema.org/EventScheduled',
      'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
      'image'       => $siteUrl.'/images/hero.jpg',
      'description' => $seo['description'],
      'location'    => [
        '@type'   => 'Place',
        'name'    => 'Le Vallon de Sernhac',
        'address' => [
          '@type'           => 'PostalAddress',
          'streetAddress'   => 'Le Vallon',
          'addressLocality' => 'Sernhac',
          'postalCode'      => '30210',
          'addressRegion'   => 'Gard',
          'addressCountry'  => 'FR',
        ],
        'geo' => [
          '@type'     => 'GeoCoordinates',
          'latitude'  => 43.891,
          'longitude' => 4.537,
        ],
      ],
      'organizer' => [
        '@type' => 'Organization',
        'name'  => 'Aux õrigines',
        'url'   => $siteUrl,
        'email' => $settings->email_contact ?? '',
      ],
      'subEvent' => $coursesList,
    ];
  @endphp
  <script type="application/ld+json">{!! json_encode($jsonLd, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}</script>
</head>
<body>
  <div id="root"></div>
  <script>
    window.__ADMIN_PATH     = "{{ env('ADMIN_PATH', 'gestion-origines') }}";
    window.__SITE_OPEN      = "{{ $settings->date_ouverture_site?->toIso8601String() ?? '2026-09-01T00:00:00' }}";
    window.__EVENT_DATE     = "{{ $settings->date_evenement?->toIso8601String() ?? '2027-04-24T08:00:00' }}";
    window.__CSRF_TOKEN     = "{{ csrf_token() }}";
    window.__ARTISAN_COUNT  = {{ $artisanCount }};
    window.__PARTENAIRES    = {!! $partenaires->toJson() !!};
    window.__ARTISANS       = {!! $artisans->toJson() !!};
    window.__GALERIE        = {!! $galerie->toJson() !!};
    window.__SITE_INFO      = {!! json_encode($siteInfo) !!};
    window.__COURSES        = {!! $courses->toJson() !!};
    window.__ACTUALITES     = {!! $actualites->toJson() !!};
    window.__SEO_BASE       = {!! json_encode(['title' => $seo['title'], 'description' => $seo['description']]) !!};
  </script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin="anonymous"></script>
</body>
</html>
