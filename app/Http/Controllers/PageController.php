<?php

namespace App\Http\Controllers;

use App\Models\Actualite;
use App\Models\Artisan;
use App\Models\Course;
use App\Models\Galerie;
use App\Models\Partenaire;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index(Request $request)
    {
        $settings     = Setting::first() ?? new Setting();
        $siteOpen     = $settings->date_ouverture_site ?? now()->addYears(1);
        $artisanCount = Artisan::where('visible', true)->count();

        $partenaires = Partenaire::visible()->get(['id','nom','niveau','logo','site_web'])
            ->map(fn($p) => [
                'id'      => $p->id,
                'nom'     => $p->nom,
                'niveau'  => $p->niveau,
                'logo'    => $p->logo ? '/storage/'.$p->logo : null,
                'site_web'=> $p->site_web,
            ]);

        $artisans = Artisan::visible()->get(['id','nom','description','categorie','logo','site_web','instagram'])
            ->map(fn($a) => [
                'id'          => $a->id,
                'nom'         => $a->nom,
                'description' => $a->description,
                'categorie'   => $a->categorie,
                'logo'        => $a->logo ? '/storage/'.$a->logo : null,
                'site_web'    => $a->site_web,
                'instagram'   => $a->instagram,
            ]);

        $galerie = Galerie::orderByDesc('featured')->orderBy('ordre')->get(['id','titre','annee','type','image','url_video','video_accueil','featured'])
            ->map(fn($g) => [
                'id'            => $g->id,
                'titre'         => $g->titre,
                'annee'         => $g->annee,
                'type'          => $g->type,
                'image'         => $g->image ? '/storage/'.$g->image : null,
                'url_video'     => $g->url_video,
                'video_accueil' => $g->video_accueil,
                'featured'      => $g->featured,
            ]);

        $siteInfo = [
            'adresse'      => $settings->adresse,
            'email'        => $settings->email_contact,
            'telephone'    => $settings->telephone,
            'facebook'     => $settings->facebook,
            'instagram'    => $settings->instagram,
            'youtube'      => $settings->youtube,
            // Repli sur le PDF déposé dans public/ si le champ admin est vide.
            'reglementUrl' => $settings->reglement_url ?: '/reglement.pdf',
            'copyright'    => $settings->copyright,
        ];

        $actualites = Actualite::visible()->orderBy('ordre')->get()
            ->map(fn($a) => [
                'id'         => $a->id,
                'titre'      => $a->titre,
                'categorie'  => $a->categorie,
                'date_label' => $a->date_label,
                'extrait'    => $a->extrait,
                'image'      => $a->image ? '/storage/'.$a->image : null,
                'contenu'    => $a->contenu,
                'ordre'      => $a->ordre,
            ]);

        $courses = Course::visible()->orderBy('ordre')->get()
            ->map(fn($c) => [
                'id'                     => $c->id,
                'slug'                   => $c->slug,
                'nom'                    => $c->nom,
                'categorie'              => $c->categorie,
                'type_course'            => $c->type_course,
                'tagline'                => $c->tagline,
                'description'            => $c->description,
                'distance_val'           => $c->distance_val,
                'distance_unit'          => $c->distance_unit,
                'distance_affichee'      => $c->distance_affichee,
                'heure_depart'           => $c->heure_depart,
                'heure_arrivee'          => $c->heure_arrivee,
                'denivele'               => $c->denivele,
                'couleur'                => $c->couleur,
                'equipement_obligatoire' => $c->equipement_obligatoire ?? [],
                'equipement_conseille'   => $c->equipement_conseille ?? [],
                'materiel_interdit'      => $c->materiel_interdit ?? [],
                'ravitaillement'         => $c->ravitaillement ?? [],
                'profil'                 => $c->profil ?? [],
                'tarif'                  => $c->tarif,
                'limite'                 => $c->limite,
                'ordre'                  => $c->ordre,
            ]);

        $programme = collect($settings->programme ?? [])
            ->map(fn($r) => [
                'heure'   => $r['heure']   ?? '',
                'libelle' => $r['libelle'] ?? '',
            ])
            ->filter(fn($r) => $r['heure'] !== '' || $r['libelle'] !== '')
            ->values();

        $sections = [
            'programme'   => (bool) $settings->programme_actif,
            'partenaires' => (bool) $settings->partenaires_actif,
            'artisans'    => (bool) $settings->artisans_actif,
        ];

        $inscriptions = [
            // ouvert seulement si le toggle est actif ET le lien renseigné :
            // pas de bouton qui ne mène nulle part
            'actif'      => (bool) $settings->inscriptions_actif && filled($settings->inscriptions_url),
            'url'        => $settings->inscriptions_url,
            'date_label' => $settings->inscriptions_date_ouverture?->locale('fr')->translatedFormat('j F Y'),
        ];

        $announce = [
            'actif'      => (bool) $settings->announce_actif,
            'message'    => $settings->announce_message,
            'lien_label' => $settings->announce_lien_label,
            'lien_url'   => $settings->announce_lien_url,
            'ton'        => $settings->announce_ton ?? 'tc',
            'debut'      => $settings->announce_debut?->toIso8601String(),
            'fin'        => $settings->announce_fin?->toIso8601String(),
            // change à chaque édition → réinitialise la fermeture côté visiteur
            'key'        => (string) ($settings->updated_at?->timestamp ?? 0),
        ];

        $path = $request->path() === '/' ? '' : $request->path();
        $seo = $this->buildSeo($path, $settings, $courses);
        if ($seo === null) abort(404);

        // Contenu de repli rendu dans #root (voir partials/seo-fallback) : page courante et course affichée.
        $fallbackCourses = $courses->map(fn($c) => $c + ['url_slug' => $this->toUrlSlug($c['nom'])]);
        $fallbackPage    = $path === '' ? 'accueil' : (str_starts_with($path, 'course/') ? 'course' : $path);
        $fallbackCourse  = $fallbackPage === 'course'
            ? $fallbackCourses->firstWhere('url_slug', substr($path, 7))
            : null;

        return view('app', compact(
            'settings', 'siteOpen', 'artisanCount', 'partenaires', 'artisans',
            'galerie', 'siteInfo', 'courses', 'actualites', 'seo', 'announce',
            'programme', 'sections', 'inscriptions',
            'fallbackCourses', 'fallbackPage', 'fallbackCourse'
        ));
    }

    private function buildSeo(string $path, $settings, $courses): ?array
    {
        $annee      = $settings->date_evenement?->format('Y') ?? '2027';
        $dateLongue = $settings->date_evenement
            ? Carbon::parse($settings->date_evenement)->locale('fr')->isoFormat('D MMMM YYYY')
            : '24 avril 2027';
        $lieu       = 'Sernhac, Gard';
        $base       = rtrim(config('app.url'), '/');
        $canonical  = $base.($path && $path !== '/' ? '/'.$path : '/');
        // Nombre et liste des épreuves tirés de la base : pas de chiffre écrit en dur qui se périme.
        $nbEpreuves = $courses->count();
        $epreuves   = $nbEpreuves > 1 ? "$nbEpreuves épreuves" : ($nbEpreuves === 1 ? '1 épreuve' : 'Des épreuves');
        $listeCourses = $courses
            ->map(fn($c) => trim(trim($c['nom']).' '.($c['distance_affichee'] ?? '')))
            ->values();
        $listeTexte = $listeCourses->count() > 1
            ? $listeCourses->slice(0, -1)->implode(', ').' et '.$listeCourses->last()
            : $listeCourses->implode('');

        $default = [
            'title'       => "Aux õrigines – Trail & Nature au Vallon de Sernhac $annee",
            'description' => "Aux õrigines, événement trail et culturel à Sernhac (Gard) en $annee. $epreuves nature, marché artisanal, un retour aux sources au cœur du Vallon.",
            'canonical'   => $base.'/',
        ];

        $map = [
            '' => $default,
            'evenement' => [
                'title'       => "L'Événement – Programme & Ambiance – Aux õrigines $annee",
                'description' => "Découvrez le programme complet d'Aux õrigines en $annee à $lieu : trail, marché artisanal, remises de récompenses et un retour aux sources.",
                'canonical'   => "$base/evenement",
            ],
            'courses' => [
                'title'       => "Les Courses de Trail – Aux õrigines $annee",
                'description' => $listeTexte
                    ? "$epreuves à Sernhac (Gard) : $listeTexte. Parcours, horaires et inscriptions."
                    : "Les épreuves de trail et de marche d'Aux õrigines à Sernhac (Gard). Parcours, horaires et inscriptions.",
                'canonical'   => "$base/courses",
            ],
            'vallon' => [
                'title'       => "Le Vallon de Sernhac – Aux õrigines $annee",
                'description' => "Partez à la découverte du Vallon de Sernhac : aqueduc romain, garrigues calcaires, falaises et sentiers de caractère au cœur du Gard.",
                'canonical'   => "$base/vallon",
                'jsonld_extra' => [
                    '@context'    => 'https://schema.org',
                    '@type'       => 'TouristAttraction',
                    'name'        => 'Le Vallon de Sernhac',
                    'alternateName' => "Vallon d'Escaunes à Cantarelles",
                    'description' => "Site naturel remarquable de Sernhac (Gard), réputé pour ses galeries romaines prolongement du Pont du Gard, ses terrasses d'oliviers centenaires et ses sentiers balisés.",
                    'url'         => "$base/vallon",
                    'isAccessibleForFree' => true,
                    'publicAccess'        => true,
                    'geo' => [
                        '@type'     => 'GeoCoordinates',
                        'latitude'  => 43.9175,
                        'longitude' => 4.5527,
                    ],
                    'address' => [
                        '@type'           => 'PostalAddress',
                        'streetAddress'   => "Chemin du Vallon d'Escaunes",
                        'addressLocality' => 'Sernhac',
                        'postalCode'      => '30210',
                        'addressRegion'   => 'Gard',
                        'addressCountry'  => 'FR',
                    ],
                    'amenityFeature' => [
                        ['@type' => 'LocationFeatureSpecification', 'name' => 'Galeries romaines visitables', 'value' => true],
                        ['@type' => 'LocationFeatureSpecification', 'name' => 'Sentiers balisés',             'value' => true],
                        ['@type' => 'LocationFeatureSpecification', 'name' => 'Parking gratuit',              'value' => true],
                        ['@type' => 'LocationFeatureSpecification', 'name' => 'Accès libre',                  'value' => true],
                    ],
                    'touristType' => ['Randonnée', 'Histoire romaine', 'Nature & Biodiversité'],
                    'hasMap'      => 'https://www.openstreetmap.org/?mlat=43.9175&mlon=4.5527#map=16/43.9175/4.5527',
                    'containedInPlace' => [
                        '@type' => 'Place',
                        'name'  => 'Sernhac',
                        'address' => [
                            '@type'           => 'PostalAddress',
                            'addressLocality' => 'Sernhac',
                            'postalCode'      => '30210',
                            'addressRegion'   => 'Gard',
                            'addressCountry'  => 'FR',
                        ],
                    ],
                ],
            ],
            'artisans' => [
                'title'       => "Marché d'Artisans – Aux õrigines $annee",
                'description' => "Créateurs, producteurs locaux et artisans du Gard réunis au village départ d'Aux õrigines à Sernhac. Terroir, savoir-faire et authenticité.",
                'canonical'   => "$base/artisans",
            ],
            'benevoles' => [
                'title'       => "Devenir Bénévole – Aux õrigines $annee",
                'description' => "Rejoignez l'équipe de bénévoles d'Aux õrigines à Sernhac : signalisation, ravitaillements, accueil du village départ. Inscrivez-vous et indiquez vos disponibilités.",
                'canonical'   => "$base/benevoles",
            ],
            'galerie' => [
                'title'       => "Galerie Photos & Vidéos – Aux õrigines $annee",
                'description' => "Photos et vidéos du Vallon de Sernhac et des éditions passées d'Aux õrigines : paysages, coureurs, ambiance du trail nature dans le Gard.",
                'canonical'   => "$base/galerie",
            ],
            'partenaires' => [
                'title'       => "Nos Partenaires – Aux õrigines $annee",
                'description' => "Découvrez les partenaires et sponsors qui soutiennent Aux õrigines, événement trail à Sernhac dans le Gard.",
                'canonical'   => "$base/partenaires",
            ],
            'actualites' => [
                'title'       => "Actualités – Aux õrigines $annee",
                'description' => "Toutes les dernières nouvelles d'Aux õrigines : ouverture des inscriptions, tracés des parcours, programme du village départ et annonces.",
                'canonical'   => "$base/actualites",
            ],
            'contact' => [
                'title'       => "Contact – Aux õrigines $annee",
                'description' => "Contactez l'organisation d'Aux õrigines pour toute question sur les courses, le partenariat, les artisans ou l'événement à Sernhac (Gard).",
                'canonical'   => "$base/contact",
            ],
        ];

        if (isset($map[$path])) {
            return $map[$path];
        }

        // Pages course détail : /course/{slug}
        if (str_starts_with($path, 'course/')) {
            $urlSlug = substr($path, 7);
            $course  = $courses->first(fn($c) => $this->toUrlSlug($c['nom']) === $urlSlug);
            if ($course) {
                $dist = $course['distance_affichee'] ?? ($course['distance_val'].' '.($course['distance_unit'] ?? 'km'));
                $course['nom'] = trim($course['nom']);
                return [
                    'title'       => "{$course['nom']} – {$dist} – Aux õrigines $annee",
                    'description' => $course['tagline']
                        ? "{$course['tagline']} – {$course['nom']}, {$dist} à Sernhac le $dateLongue. ".($course['description'] ? mb_substr(strip_tags($course['description']), 0, 120).'…' : '')
                        : "{$course['nom']}, {$dist} de trail nature à Sernhac (Gard) lors d'Aux õrigines le $dateLongue.",
                    'canonical' => "$base/course/$urlSlug",
                ];
            }
        }

        return null;
    }

    private function toUrlSlug(string $str): string
    {
        $str = mb_strtolower($str);
        $str = strtr($str, ['à'=>'a','â'=>'a','ä'=>'a','é'=>'e','è'=>'e','ê'=>'e','ë'=>'e','î'=>'i','ï'=>'i','ô'=>'o','ö'=>'o','ù'=>'u','û'=>'u','ü'=>'u','ç'=>'c','õ'=>'o']);
        $str = preg_replace('/[^a-z0-9]+/', '-', $str);
        return trim($str, '-');
    }
}
