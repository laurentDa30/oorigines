<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="google-site-verification" content="lacvxZ5s_uvDpZb-H4zHxnIyxyCk8HiVMSdb6pCPuaM" />

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
  <meta property="og:image"       content="{{ rtrim(config('app.url'),'/') }}/images/logo/logo-preview.png">
  <meta property="og:image:width"  content="527">
  <meta property="og:image:height" content="473">
  <meta property="og:image:type"   content="image/png">
  <meta property="og:locale"      content="fr_FR">

  {{-- Twitter Card --}}
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="{{ $seo['title'] }}">
  <meta name="twitter:description" content="{{ $seo['description'] }}">
  <meta name="twitter:image"       content="{{ rtrim(config('app.url'),'/') }}/images/logo/logo-preview.png">

  {{-- Favicon --}}
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  {{-- Preloads --}}
  <link rel="preload" as="image" href="/images/hero.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  {{-- Google Fonts non-bloquant (rel basculé par script nonce'd, pas de onload inline pour rester compatible CSP) --}}
  <link id="gfont-css" rel="preload" as="style"
    href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap">
  <script @if(!empty($cspNonce))nonce="{{ $cspNonce }}"@endif>
    (function(){var l=document.getElementById('gfont-css');if(l){l.rel='stylesheet';}})();
  </script>
  <noscript>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap">
  </noscript>

  <link rel="stylesheet" href="/css/leaflet.css">
  @viteReactRefresh
  @vite(['resources/css/app.css', 'resources/js/app.jsx'])

  {{-- JSON-LD : Événement sportif --}}
  @php
    // La date saisie en admin est une heure locale (stockée sans fuseau) → on la réinterprète en Europe/Paris.
    $eventDay  = $settings->date_evenement?->format('Y-m-d') ?? '2027-04-24';
    $eventAt   = fn (string $heure) => \Carbon\Carbon::parse($eventDay.' '.$heure, 'Europe/Paris')->format('c');
    $eventIso  = $eventAt($settings->date_evenement?->format('H:i') ?? '08:00');
    $eventEnd  = $eventAt('20:00');
    $siteUrl   = rtrim(config('app.url'), '/');
    $eventImg  = $siteUrl.'/images/hero.jpg';
    $location = [
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
      'geo' => ['@type' => 'GeoCoordinates', 'latitude' => 43.891, 'longitude' => 4.537],
    ];
    $organizer      = ['@type' => 'Organization', 'name' => 'Sernhac Multi Sports', 'url' => 'https://www.facebook.com/assoc.sms', 'email' => $settings->email_contact ?? ''];
    // Inscriptions ouvertes (toggle admin + lien) → billetterie « en stock » et lien direct vers l'inscription.
    $inscOuvertes   = $inscriptions['actif'];
    $availability   = $inscOuvertes ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder';
    // Prix du JSON-LD : premier nombre du tarif affiché (« À partir de 22 € » → 22), « Gratuit » → 0.
    $prixDe = function (?string $tarif) {
      if ($tarif && preg_match('/\d+(?:[.,]\d+)?/', $tarif, $m)) return str_replace(',', '.', $m[0]);
      return ($tarif && stripos($tarif, 'gratuit') !== false) ? '0' : null;
    };
    // Heure de départ saisie « 15h00 », « 14h », « 15h45 » → « 15:00 ».
    $heureDe = fn (?string $h) => ($h && preg_match('/(\d{1,2})\s*h\s*(\d{2})?/i', $h, $m)) ? sprintf('%02d:%02d', $m[1], $m[2] ?? 0) : null;
    // Dates saisies en heure locale (stockées sans fuseau) → réinterprétées en Europe/Paris.
    $offerValidFrom = ($settings->inscriptions_date_ouverture ?? $settings->date_ouverture_site)?->shiftTimezone('Europe/Paris')->format('c') ?? now()->format('c');
    $coursesList = $courses->map(function ($c) use ($siteUrl, $eventAt, $eventIso, $eventEnd, $eventImg, $location, $organizer, $offerValidFrom, $prixDe, $heureDe, $availability, $inscOuvertes, $inscriptions) {
      // Même slug que SitemapController::toUrlSlug (trim des tirets inclus).
      $url   = $siteUrl.'/course/'.trim(preg_replace('/[^a-z0-9]+/', '-', mb_strtolower(strtr($c['nom'], ['à'=>'a','â'=>'a','ä'=>'a','é'=>'e','è'=>'e','ê'=>'e','ë'=>'e','î'=>'i','ï'=>'i','ô'=>'o','ö'=>'o','ù'=>'u','û'=>'u','ü'=>'u','ç'=>'c','õ'=>'o']))), '-');
      $heure = $heureDe($c['heure_depart'] ?? null);
      $prix  = $prixDe($c['tarif'] ?? null);
      $offer = ['@type' => 'Offer', 'url' => $inscOuvertes ? $inscriptions['url'] : $url, 'availability' => $availability, 'priceCurrency' => 'EUR', 'validFrom' => $offerValidFrom];
      if ($prix !== null) $offer['price'] = $prix;
      return [
        '@type'       => 'Event',
        'name'        => trim($c['nom']),
        'description' => $c['tagline'] ?? '',
        'image'       => $eventImg,
        'startDate'   => $heure ? $eventAt($heure) : $eventIso,
        'endDate'     => $eventEnd,
        'eventStatus' => 'https://schema.org/EventScheduled',
        'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
        'location'    => $location,
        'organizer'   => $organizer,
        'performer'   => ['@type' => 'PerformingGroup', 'name' => 'Participants '.trim($c['nom'])],
        'offers'      => $offer,
        'url'         => $url,
      ];
    })->values()->all();
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
      'image'       => $eventImg,
      'description' => $seo['description'],
      'location'    => $location,
      'organizer'   => $organizer,
      'performer'   => ['@type' => 'PerformingGroup', 'name' => 'Coureurs et marcheurs Aux õrigines'],
      'offers'      => ['@type' => 'AggregateOffer', 'url' => $inscOuvertes ? $inscriptions['url'] : $siteUrl.'/courses', 'availability' => $availability, 'priceCurrency' => 'EUR', 'lowPrice' => '0', 'validFrom' => $offerValidFrom],
      'subEvent' => $coursesList,
    ];
  @endphp
  <script type="application/ld+json" @if(!empty($cspNonce))nonce="{{ $cspNonce }}"@endif>{!! json_encode($jsonLd, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_PRETTY_PRINT) !!}</script>
  @if(!empty($seo['jsonld_extra']))
  <script type="application/ld+json" @if(!empty($cspNonce))nonce="{{ $cspNonce }}"@endif>{!! json_encode($seo['jsonld_extra'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_PRETTY_PRINT) !!}</script>
  @endif
</head>
<body>
  <div id="root"></div>
  <noscript>
    <main style="font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 24px;color:#1a1208">
      <h1>Aux õrigines – Trail &amp; Nature – Sernhac {{ $settings->date_evenement?->format('Y') ?? '2027' }}</h1>
      <p>{{ $seo['description'] }}</p>

      <h2>L'Événement</h2>
      <p>Aux Õrigines est un événement sportif et culturel organisé au cœur du Vallon de Sernhac (Gard). Ce site naturel exceptionnel, traversé par l'aqueduc romain de Nîmes, accueille coureurs, randonneurs et familles pour une journée alliant sport, nature et retour aux sources.</p>
      <h3>Le Vallon de Sernhac</h3>
      <p>Niché dans le Gard, le Vallon de Sernhac est un écrin de nature sauvage avec ses garrigues, falaises calcaires et sentiers romains. Un cadre d'exception pour un événement trail hors du commun.</p>

      <h2>Les Courses</h2>
      @php $nbCourses = $courses->count(); @endphp
      <p>{{ $nbCourses > 1 ? $nbCourses.' épreuves' : ($nbCourses === 1 ? 'Une épreuve' : 'Des épreuves') }} pour tous les niveaux, du trail technique au parcours enfants :</p>
      <ul>
        @foreach($courses as $course)
          <li>
            <strong>{{ trim($course['nom']) }}</strong> – {{ $course['distance_affichee'] }}
            @if($course['tagline']) – {{ $course['tagline'] }} @endif
            @if($course['denivele']) ({{ $course['denivele'] }}) @endif
          </li>
        @endforeach
      </ul>
      <h3>Inscriptions et tarifs</h3>
      @if($inscriptions['actif'])
        <p>Les inscriptions sont ouvertes : <a href="{{ $inscriptions['url'] }}">s'inscrire en ligne</a>. Consultez la page des courses pour les tarifs et conditions de participation.</p>
      @else
        <p>Les inscriptions ouvriront {{ $inscriptions['date_label'] ? 'le '.$inscriptions['date_label'] : 'prochainement' }}. Consultez la page des courses pour les tarifs et conditions de participation.</p>
      @endif

      <h2>Marché d'Artisans</h2>
      <p>Un marché artisanal authentique réunit créateurs, producteurs locaux et artisans du Gard au village départ. Terroir, savoir-faire et convivialité au rendez-vous.</p>

      <h2>Informations pratiques</h2>
      <h3>Lieu</h3>
      <p>Vallon de Sernhac, Sernhac (30210), Gard, France.</p>
      <h3>Contact</h3>
      <p>Pour toute question, rendez-vous sur <a href="{{ rtrim(config('app.url'),'/') }}/contact">la page contact</a>.</p>
      <p><em>Ce site nécessite JavaScript pour s'afficher correctement.</em></p>
    </main>
  </noscript>
  @php
    // Flags d'échappement pour toute donnée injectée dans un <script> inline :
    // neutralise </script>, &, ', " → aucune évasion possible du contexte script.
    $jsScriptFlags = JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT;
  @endphp
  <script @if(!empty($cspNonce))nonce="{{ $cspNonce }}"@endif>
    window.__ADMIN_PATH     = {!! json_encode(config('app.admin_path'), $jsScriptFlags) !!};
    {{-- Heure saisie en admin = heure de Paris (stockée sans fuseau) : sans shiftTimezone elle partait en +00:00 (2 h de décalage). --}}
    window.__EVENT_DATE     = {!! json_encode($settings->date_evenement?->shiftTimezone('Europe/Paris')->toIso8601String() ?? '2027-04-24T08:00:00+02:00', $jsScriptFlags) !!};
    window.__CSRF_TOKEN     = {!! json_encode(csrf_token(), $jsScriptFlags) !!};
    window.__ARTISAN_COUNT  = {{ (int) $artisanCount }};
    window.__PARTENAIRES    = {!! json_encode($partenaires, $jsScriptFlags) !!};
    window.__ARTISANS       = {!! json_encode($artisans, $jsScriptFlags) !!};
    window.__GALERIE        = {!! json_encode($galerie, $jsScriptFlags) !!};
    window.__SITE_INFO      = {!! json_encode($siteInfo, $jsScriptFlags) !!};
    window.__COURSES        = {!! json_encode($courses, $jsScriptFlags) !!};
    window.__ACTUALITES     = {!! json_encode($actualites, $jsScriptFlags) !!};
    window.__SEO_BASE       = {!! json_encode(['title' => $seo['title'], 'description' => $seo['description']], $jsScriptFlags) !!};
    window.__ANNOUNCE       = {!! json_encode($announce, $jsScriptFlags) !!};
    window.__PROGRAMME      = {!! json_encode($programme, $jsScriptFlags) !!};
    window.__SECTIONS       = {!! json_encode($sections, $jsScriptFlags) !!};
    window.__INSCRIPTIONS   = {!! json_encode($inscriptions, $jsScriptFlags) !!};
  </script>
</body>
</html>
