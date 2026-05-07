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
        $artisanCount = Artisan::count();

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
            'reglementUrl' => $settings->reglement_url,
            'copyright'    => $settings->copyright,
        ];

        $actualites = Actualite::visible()->orderBy('ordre')->get()
            ->map(fn($a) => [
                'id'         => $a->id,
                'titre'      => $a->titre,
                'categorie'  => $a->categorie,
                'date_label' => $a->date_label,
                'extrait'    => $a->extrait,
                'contenu'    => $a->contenu,
                'ordre'      => $a->ordre,
            ]);

        $courses = Course::visible()->orderBy('ordre')->get()
            ->map(fn($c) => [
                'id'                     => $c->id,
                'slug'                   => $c->slug,
                'nom'                    => $c->nom,
                'categorie'              => $c->categorie,
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
                'ravitaillement'         => $c->ravitaillement ?? [],
                'profil'                 => $c->profil ?? [],
                'tarif'                  => $c->tarif,
                'limite'                 => $c->limite,
                'ordre'                  => $c->ordre,
            ]);

        $seo = $this->buildSeo($request->path(), $settings, $courses);

        return view('app', compact(
            'settings', 'siteOpen', 'artisanCount', 'partenaires', 'artisans',
            'galerie', 'siteInfo', 'courses', 'actualites', 'seo'
        ));
    }

    private function buildSeo(string $path, $settings, $courses): array
    {
        $annee      = $settings->date_evenement?->format('Y') ?? '2027';
        $dateLongue = $settings->date_evenement
            ? Carbon::parse($settings->date_evenement)->locale('fr')->isoFormat('D MMMM YYYY')
            : '24 avril 2027';
        $lieu       = 'Sernhac, Gard';
        $base       = rtrim(config('app.url'), '/');
        $canonical  = $base.($path && $path !== '/' ? '/'.$path : '/');

        $default = [
            'title'       => "Aux õrigines – Trail & Nature – Sernhac $annee",
            'description' => "Aux õrigines, événement trail et culturel à Sernhac (Gard) le $dateLongue. 4 épreuves nature, marché artisanal, ambiance romaine au cœur du Vallon.",
            'canonical'   => $base.'/',
        ];

        $map = [
            '' => $default,
            'evenement' => [
                'title'       => "L'Événement – Programme & Ambiance – Aux õrigines $annee",
                'description' => "Découvrez le programme complet d'Aux õrigines le $dateLongue à $lieu : trail, marché artisanal, remises de récompenses et ambiance romaine.",
                'canonical'   => "$base/evenement",
            ],
            'courses' => [
                'title'       => "Les Courses de Trail – Aux õrigines $annee",
                'description' => "4 épreuves de trail à Sernhac : Astra'trail 20 km, Sarnacum'trail 12 km, Marche Nordique et course enfants. Parcours, horaires et inscriptions.",
                'canonical'   => "$base/courses",
            ],
            'vallon' => [
                'title'       => "Le Vallon de Sernhac – Aux õrigines $annee",
                'description' => "Partez à la découverte du Vallon de Sernhac : aqueduc romain, garrigues calcaires, falaises et sentiers de caractère au cœur du Gard.",
                'canonical'   => "$base/vallon",
            ],
            'artisans' => [
                'title'       => "Marché d'Artisans – Aux õrigines $annee",
                'description' => "Créateurs, producteurs locaux et artisans du Gard réunis au village départ d'Aux õrigines à Sernhac. Terroir, savoir-faire et authenticité.",
                'canonical'   => "$base/artisans",
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
                return [
                    'title'       => "{$course['nom']} – {$dist} – Aux õrigines $annee",
                    'description' => $course['tagline']
                        ? "{$course['tagline']} – {$course['nom']}, {$dist} à Sernhac le $dateLongue. ".($course['description'] ? mb_substr(strip_tags($course['description']), 0, 120).'…' : '')
                        : "{$course['nom']}, {$dist} de trail nature à Sernhac (Gard) lors d'Aux õrigines le $dateLongue.",
                    'canonical' => "$base/course/$urlSlug",
                ];
            }
        }

        return $default;
    }

    private function toUrlSlug(string $str): string
    {
        $str = mb_strtolower($str);
        $str = strtr($str, ['à'=>'a','â'=>'a','ä'=>'a','é'=>'e','è'=>'e','ê'=>'e','ë'=>'e','î'=>'i','ï'=>'i','ô'=>'o','ö'=>'o','ù'=>'u','û'=>'u','ü'=>'u','ç'=>'c','õ'=>'o']);
        $str = preg_replace('/[^a-z0-9]+/', '-', $str);
        return trim($str, '-');
    }
}
