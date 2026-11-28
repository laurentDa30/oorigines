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
    // Heure de fin : la DERNIÈRE heure du texte (« 11h30 – 13h15 » → « 13:15 »).
    $finDe = function (?string $h) {
      if (!$h || !preg_match_all('/(\d{1,2})\s*h\s*(\d{2})?/i', $h, $m, PREG_SET_ORDER)) return null;
      $d = end($m);
      return sprintf('%02d:%02d', $d[1], ($d[2] ?? '') !== '' ? $d[2] : 0);
    };
    // Fin de la course : son heure d'arrivée affichée, si elle suit le départ. Jamais d'heure inventée.
    $finCourse = function ($c) use ($heureDe, $finDe, $settings) {
      $fin = $finDe($c['heure_arrivee'] ?? null);
      $debut = $heureDe($c['heure_depart'] ?? null) ?? ($settings->date_evenement?->format('H:i') ?? '08:00');
      return ($fin && $fin > $debut) ? $fin : null;
    };
    // Fin de l'événement : dernière heure affichée (arrivées des courses + programme s'il est visible).
    $heuresFin = $courses->map($finCourse)->filter();
    if ($settings->programme_actif) {
      $heuresFin = $heuresFin->merge(collect($settings->programme ?? [])->map(fn ($r) => $finDe($r['heure'] ?? null))->filter());
    }
    $finEvenement = $heuresFin->max();
    $eventEnd = ($finEvenement && $finEvenement > ($settings->date_evenement?->format('H:i') ?? '08:00')) ? $eventAt($finEvenement) : null;
    // Dates saisies en heure locale (stockées sans fuseau) → réinterprétées en Europe/Paris.
    $offerValidFrom = ($settings->inscriptions_date_ouverture ?? $settings->date_ouverture_site)?->shiftTimezone('Europe/Paris')->format('c') ?? now()->format('c');
    $coursesList = $courses->map(function ($c) use ($siteUrl, $eventAt, $eventIso, $finCourse, $eventImg, $location, $organizer, $offerValidFrom, $prixDe, $heureDe, $availability, $inscOuvertes, $inscriptions) {
      // Même slug que SitemapController::toUrlSlug (trim des tirets inclus).
      $url   = $siteUrl.'/course/'.trim(preg_replace('/[^a-z0-9]+/', '-', mb_strtolower(strtr($c['nom'], ['à'=>'a','â'=>'a','ä'=>'a','é'=>'e','è'=>'e','ê'=>'e','ë'=>'e','î'=>'i','ï'=>'i','ô'=>'o','ö'=>'o','ù'=>'u','û'=>'u','ü'=>'u','ç'=>'c','õ'=>'o']))), '-');
      $heure = $heureDe($c['heure_depart'] ?? null);
      $prix  = $prixDe($c['tarif'] ?? null);
      $fin   = $finCourse($c);
      $offer = ['@type' => 'Offer', 'url' => $inscOuvertes ? $inscriptions['url'] : $url, 'availability' => $availability, 'priceCurrency' => 'EUR', 'validFrom' => $offerValidFrom];
      if ($prix !== null) $offer['price'] = $prix;
      return array_filter([
        '@type'       => 'Event',
        'name'        => trim($c['nom']),
        'description' => $c['tagline'] ?? '',
        'image'       => $eventImg,
        'startDate'   => $heure ? $eventAt($heure) : $eventIso,
        'endDate'     => $fin ? $eventAt($fin) : null,
        'eventStatus' => 'https://schema.org/EventScheduled',
        'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
        'location'    => $location,
        'organizer'   => $organizer,
        'performer'   => ['@type' => 'PerformingGroup', 'name' => 'Participants '.trim($c['nom'])],
        'offers'      => $offer,
        'url'         => $url,
      ], fn ($v) => $v !== null);
    })->values()->all();
    $jsonLd = array_filter([
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
    ], fn ($v) => $v !== null);
  @endphp
  <script type="application/ld+json" @if(!empty($cspNonce))nonce="{{ $cspNonce }}"@endif>{!! json_encode($jsonLd, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_PRETTY_PRINT) !!}</script>
  @if(!empty($seo['jsonld_extra']))
  <script type="application/ld+json" @if(!empty($cspNonce))nonce="{{ $cspNonce }}"@endif>{!! json_encode($seo['jsonld_extra'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_PRETTY_PRINT) !!}</script>
  @endif
</head>
<body>
  <div id="root">@include('partials.seo-fallback')</div><!-- /root -->
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
