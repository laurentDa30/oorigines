{{--
  Contenu de repli rendu côté serveur dans #root. React le remplace au montage (createRoot),
  il ne se voit donc qu'une fraction de seconde. Il sert quand le JS ne se charge pas :
  le test en direct de la Search Console a montré des fichiers JS/CSS en « Autre erreur »,
  et Google ne voyait alors qu'un #root vide. Chaque URL a ici son propre H1, son texte et
  des liens HTML. Les textes des pages statiques reprennent ceux des composants React :
  les garder alignés en cas de modification.
--}}
@php
  $annee     = $settings->date_evenement?->format('Y') ?? '2027';
  $dateEvt   = $settings->date_evenement?->locale('fr')->isoFormat('dddd D MMMM YYYY');
  $nbCourses = $fallbackCourses->count();
  $fbDist    = fn ($c) => $c['distance_affichee'] ?: trim(($c['distance_val'] ?? '').' '.($c['distance_unit'] ?? ''));
@endphp
<div class="seo-fb">
  <nav class="seo-fb__nav" aria-label="Navigation principale">
    <a href="/">Accueil</a>
    <a href="/evenement">L'Événement</a>
    <a href="/courses">Les Courses</a>
    @foreach($fallbackCourses as $c)
      <a href="/course/{{ $c['url_slug'] }}">{{ trim($c['nom']) }}</a>
    @endforeach
    <a href="/vallon">Le Vallon</a>
    <a href="/benevoles">Bénévoles</a>
    <a href="/artisans">Artisans</a>
    <a href="/partenaires">Partenaires</a>
    <a href="/galerie">Galerie</a>
    <a href="/actualites">Actualités</a>
    <a href="/contact">Contact</a>
  </nav>

  <main class="wrap seo-fb__main">
    @switch($fallbackPage)
      @case('accueil')
        <h1 class="sec-title">Aux õrigines – Trail &amp; Nature à Sernhac {{ $annee }}</h1>
        <p class="body">{{ $seo['description'] }}</p>
        @if($dateEvt)<p class="body">Rendez-vous le {{ $dateEvt }} au Vallon de Sernhac (Gard).</p>@endif
        <h2>Les épreuves</h2>
        <ul>
          @foreach($fallbackCourses as $c)
            <li><a href="/course/{{ $c['url_slug'] }}">{{ trim($c['nom']) }}</a> – {{ $fbDist($c) }}@if($c['denivele']), {{ $c['denivele'] }}@endif @if($c['tagline'])– {{ $c['tagline'] }}@endif</li>
          @endforeach
        </ul>
        <p class="body"><a href="/evenement">Découvrir l'événement</a> · <a href="/vallon">Le Vallon de Sernhac</a> · <a href="/benevoles">Devenir bénévole</a></p>
        @break

      @case('evenement')
        <h1 class="sec-title">L'Événement Aux õrigines {{ $annee }}</h1>
        <h2>Un trail technique</h2>
        <p class="body">Le Vallon de Sernhac n'est pas un terrain ordinaire. Falaises, sous-bois, sentiers escarpés et passages en crête, les parcours mettent à l'épreuve l'équilibre, la lecture du terrain et l'endurance. Chaque foulée se mérite.</p>
        <p class="body">Coureurs confirmés, débutants, marcheurs, enfants : Aux Origines trace un chemin pour chacun. <a href="/courses">Voir les courses</a>.</p>
        <h2>Au-delà de l'effort</h2>
        <p class="body">L'effort passé la ligne d'arrivée, l'événement continue. Porté par les habitants de Sernhac et les associations locales, Aux õrigines est aussi une fête populaire : marché d'artisans, animations, restauration sur place et remise des récompenses en fin de journée.</p>
        <p class="body">Une journée qui mêle défi personnel et convivialité, dans un cadre naturel où l'histoire romaine de la région n'est jamais très loin.</p>
        @if($sections['programme'] && $programme->isNotEmpty())
          <h2>Programme</h2>
          <ul>
            @foreach($programme as $r)<li>{{ $r['heure'] }} – {{ $r['libelle'] }}</li>@endforeach
          </ul>
        @endif
        @break

      @case('courses')
        <h1 class="sec-title">Les Courses</h1>
        <p class="body">{{ $nbCourses > 1 ? $nbCourses.' épreuves' : ($nbCourses === 1 ? 'Une épreuve' : 'Des épreuves') }} pour tous les niveaux, dans un cadre naturel exceptionnel marqué par l'histoire romaine du Vallon de Sernhac.</p>
        @foreach($fallbackCourses as $c)
          <h2><a href="/course/{{ $c['url_slug'] }}">{{ trim($c['nom']) }}</a></h2>
          <p class="body">
            {{ $fbDist($c) }}@if($c['denivele']) · {{ $c['denivele'] }}@endif
            @if($c['heure_depart']) · départ {{ $c['heure_depart'] }}@endif
            @if($c['tarif']) · {{ $c['tarif'] }}@endif
            @if($c['categorie']) · {{ $c['categorie'] }}@endif
          </p>
          @if($c['tagline'])<p class="body">{{ $c['tagline'] }}</p>@endif
        @endforeach
        @break

      @case('course')
        @php $c = $fallbackCourse; @endphp
        <p class="body"><a href="/courses">← Toutes les courses</a></p>
        <h1 class="sec-title">{{ trim($c['nom']) }}</h1>
        @if($c['tagline'])<p class="body"><strong>{{ $c['tagline'] }}</strong></p>@endif
        <ul>
          <li>Distance : {{ $fbDist($c) }}</li>
          @if($c['denivele'])<li>Dénivelé : {{ $c['denivele'] }}</li>@endif
          @if($c['heure_depart'])<li>Départ : {{ $c['heure_depart'] }}</li>@endif
          @if($c['heure_arrivee'])<li>Arrivée estimée : {{ $c['heure_arrivee'] }}</li>@endif
          @if($c['tarif'])<li>Tarif : {{ $c['tarif'] }}</li>@endif
          @if($c['limite'])<li>Limite : {{ $c['limite'] }}</li>@endif
          @if($c['categorie'])<li>Catégorie : {{ $c['categorie'] }}</li>@endif
          @if($dateEvt)<li>Date : {{ $dateEvt }}, Vallon de Sernhac (Gard)</li>@endif
        </ul>
        @if($c['description'])
          <h2>Le parcours</h2>
          @foreach(preg_split('/\R{2,}/', trim($c['description'])) as $para)
            <p class="body">{!! nl2br(e($para)) !!}</p>
          @endforeach
        @endif
        @foreach(['ravitaillement' => 'Points de ravitaillement', 'equipement_obligatoire' => 'Équipement obligatoire', 'equipement_conseille' => 'Équipement conseillé', 'materiel_interdit' => 'Matériel interdit'] as $cle => $titre)
          @if(!empty($c[$cle]))
            <h2>{{ $titre }}</h2>
            <ul>@foreach($c[$cle] as $item)<li>{{ $item }}</li>@endforeach</ul>
          @endif
        @endforeach
        @break

      @case('vallon')
        <h1 class="sec-title">Le Vallon de Sernhac</h1>
        <p class="body">Le Vallon d'Escaunes à Cantarelles est un site naturel remarquable de Sernhac (Gard), réputé pour ses <strong>galeries romaines</strong>, prolongement du Pont du Gard qui alimentaient Nîmes en eau depuis Uzès.</p>
        <p class="body">Ses terrasses méditerranéennes plantées d'oliviers centenaires, son exceptionnelle biodiversité et ses tunnels taillés dans la roche en font un lieu unique en Occitanie.</p>
        <p class="body">Le site est entretenu et animé par l'association bénévole « Le Vallon d'Escaunes à Cantarelles », partenaire naturel de notre événement.</p>
        <ul>
          <li>Tunnels romains : deux tunnels creusés par les légions romaines au Ier siècle, visibles et praticables.</li>
          <li>Oliviers centenaires : des terrasses entretenues par des familles bénévoles depuis des générations.</li>
          <li>Biodiversité exceptionnelle : orchidées sauvages, faune endémique, végétation méditerranéenne préservée.</li>
          <li>Guide audio : parcours sonore « La Perrotte », QR code à scanner à l'entrée du parking.</li>
        </ul>
        @break

      @case('benevoles')
        <h1 class="sec-title">Devenir Bénévole</h1>
        <p class="body">Aux Õrigines, ce ne sont pas seulement des coureurs, c'est avant tout une équipe de bénévoles qui donne vie à l'événement. Sans eux, il n'y a pas de balisage, pas d'accueil, pas de ravitaillement, pas de cérémonie.</p>
        <p class="body">Être bénévole ici, c'est appartenir à une famille. On ne demande aucune expérience particulière, juste l'envie d'être là et de contribuer à quelque chose d'authentique.</p>
        <h2>Créneaux</h2>
        <ul>
          <li>Matin (7h – 13h) : accueil, installation, départ des coureurs</li>
          <li>Après-midi (13h – 18h) : ravitaillement, arrivées, animations</li>
          <li>Clôture (18h – 20h) : remise des récompenses et rangement</li>
        </ul>
        <p class="body">Pour vous inscrire, utilisez le formulaire de cette page ou <a href="/contact">contactez-nous</a>.</p>
        @break

      @case('artisans')
        <h1 class="sec-title">Les Artisans</h1>
        <p class="body">{{ $seo['description'] }}</p>
        @if($sections['artisans'] && $artisans->isNotEmpty())
          <ul>@foreach($artisans as $a)<li>{{ $a['nom'] }}@if($a['categorie']) – {{ $a['categorie'] }}@endif</li>@endforeach</ul>
        @endif
        @break

      @case('partenaires')
        <h1 class="sec-title">Devenir Partenaire</h1>
        <p class="body">{{ $seo['description'] }}</p>
        @if($partenaires->isNotEmpty())
          <h2>Nos partenaires</h2>
          <ul>
            @foreach($partenaires as $p)
              <li>@if($p['site_web'])<a href="{{ $p['site_web'] }}">{{ $p['nom'] }}</a>@else{{ $p['nom'] }}@endif</li>
            @endforeach
          </ul>
        @endif
        @break

      @case('galerie')
        <h1 class="sec-title">La Galerie</h1>
        <p class="body">{{ $seo['description'] }}</p>
        @break

      @case('actualites')
        <h1 class="sec-title">Toutes les Actualités</h1>
        @forelse($actualites as $a)
          <h2>{{ $a['titre'] }}</h2>
          @if($a['extrait'])<p class="body">{{ $a['extrait'] }}</p>@endif
        @empty
          <p class="body">{{ $seo['description'] }}</p>
        @endforelse
        @break

      @case('contact')
        <h1 class="sec-title">Nous Contacter</h1>
        <p class="body">{{ $seo['description'] }}</p>
        @if($siteInfo['email'])<p class="body">E-mail : <a href="mailto:{{ $siteInfo['email'] }}">{{ $siteInfo['email'] }}</a></p>@endif
        @break
    @endswitch

    <p class="body seo-fb__insc">
      @if($inscriptions['actif'])
        Les inscriptions sont ouvertes : <a href="{{ $inscriptions['url'] }}">s'inscrire en ligne</a>.
      @else
        Les inscriptions ouvriront {{ $inscriptions['date_label'] ? 'le '.$inscriptions['date_label'] : 'prochainement' }}.
      @endif
    </p>
  </main>

  <footer class="seo-fb__foot">
    <p>Aux õrigines {{ $annee }} · Vallon de Sernhac, Sernhac (30210), Gard · <a href="/contact">Contact</a></p>
  </footer>
</div>
