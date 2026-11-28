<?php

namespace App\Http\Controllers;

use App\Models\Actualite;
use App\Models\Artisan;
use App\Models\Course;
use App\Models\Galerie;
use App\Models\Partenaire;
use App\Models\Setting;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $base = rtrim(config('app.url'), '/');

        // lastmod = vraie date du contenu affiché (jamais now() : Google ignore un lastmod qui change à chaque appel).
        // reorder() : les scopes visible() d'Artisan/Partenaire trient, ce que MySQL refuse avec un agrégat.
        $courses     = $this->latest(Course::visible()->reorder()->max('updated_at'));
        $actualites  = $this->latest(
            Actualite::visible()->reorder()->max('updated_at'),
            Actualite::visible()->reorder()->max('published_at'), // une actu programmée apparaît sans être modifiée
        );
        $artisans    = $this->latest(Artisan::visible()->reorder()->max('updated_at'));
        $partenaires = $this->latest(Partenaire::visible()->reorder()->max('updated_at'));
        $galerie     = $this->latest(Galerie::max('updated_at'));
        $settings    = $this->latest(Setting::max('updated_at'));

        // Pages statiques. Sans date fiable (texte en dur dans le JS) → pas de lastmod.
        $static = [
            ['loc' => $base.'/',            'priority' => '1.0', 'freq' => 'weekly',  'mod' => $this->latest($courses, $actualites, $artisans, $partenaires, $galerie, $settings)],
            ['loc' => $base.'/evenement',   'priority' => '0.9', 'freq' => 'monthly', 'mod' => $this->latest($courses, $settings)],
            ['loc' => $base.'/courses',     'priority' => '0.9', 'freq' => 'monthly', 'mod' => $courses],
            ['loc' => $base.'/actualites',  'priority' => '0.8', 'freq' => 'weekly',  'mod' => $actualites],
            ['loc' => $base.'/vallon',      'priority' => '0.7', 'freq' => 'monthly', 'mod' => null],
            ['loc' => $base.'/artisans',    'priority' => '0.7', 'freq' => 'monthly', 'mod' => $artisans],
            ['loc' => $base.'/benevoles',   'priority' => '0.6', 'freq' => 'monthly', 'mod' => null],
            ['loc' => $base.'/galerie',     'priority' => '0.6', 'freq' => 'monthly', 'mod' => $galerie],
            ['loc' => $base.'/partenaires', 'priority' => '0.5', 'freq' => 'monthly', 'mod' => $partenaires],
            ['loc' => $base.'/contact',     'priority' => '0.6', 'freq' => 'yearly',  'mod' => null],
        ];
        $urls = $static;

        // Pages courses détail
        $listeCourses = Course::visible()->orderBy('ordre')->get(['nom', 'updated_at']);
        foreach ($listeCourses as $course) {
            $slug = $this->toUrlSlug($course->nom);
            $urls[] = [
                'loc'      => "$base/course/$slug",
                'priority' => '0.8',
                'freq'     => 'monthly',
                'mod'      => $this->latest($course->updated_at),
            ];
        }

        $xml = $this->renderXml($urls);

        return response($xml, 200)->header('Content-Type', 'application/xml; charset=utf-8');
    }

    /**
     * /llms.txt (format llmstxt.org) : Markdown avec un H1 et des liens, généré depuis la base
     * pour rester d'accord avec le site (l'ancien fichier statique s'était désynchronisé).
     */
    public function llms(): Response
    {
        $base     = rtrim(config('app.url'), '/');
        $settings = Setting::first();
        $date     = $settings?->date_evenement?->locale('fr')->isoFormat('dddd D MMMM YYYY');

        $courses = Course::visible()->orderBy('ordre')->get()->map(function ($c) use ($base) {
            $infos = collect([$c->distance_affichee, $c->denivele, $c->tagline])->filter()->implode(' · ');
            return '- ['.trim($c->nom)."]($base/course/".$this->toUrlSlug($c->nom).')'.($infos ? " : $infos" : '');
        })->implode("\n");

        $lignes = [
            '# Aux õrigines – Trail & Nature – Sernhac',
            '',
            '> Événement trail et nature au Vallon de Sernhac (Gard)'.($date ? ", le $date" : '').' : courses nature, marché artisanal et retour aux sources.',
            '',
            "Aux õrigines est un événement sportif et culturel organisé à Sernhac (30210), dans le Gard, au cœur du Vallon de Sernhac, site naturel traversé par l'aqueduc romain de Nîmes. Organisation : association Sernhac Multi Sports.",
            '',
            '## Pages principales',
            '',
            "- [Accueil]($base/) : présentation de l'événement et compte à rebours",
            "- [L'événement]($base/evenement) : programme de la journée",
            "- [Les courses]($base/courses) : toutes les épreuves, tarifs et inscriptions",
            "- [Le Vallon]($base/vallon) : le site naturel, carte et accès",
            "- [Actualités]($base/actualites) : annonces et nouvelles de l'organisation",
            "- [Contact]($base/contact) : formulaire de contact de l'organisation",
            '',
        ];
        if ($courses !== '') {
            array_push($lignes, '## Les épreuves', '', $courses, '');
        }
        array_push($lignes,
            '## Optional',
            '',
            "- [Artisans]($base/artisans) : marché artisanal du village départ",
            "- [Partenaires]($base/partenaires) : partenaires de l'événement",
            "- [Bénévoles]($base/benevoles) : devenir bénévole",
            "- [Galerie]($base/galerie) : photos et vidéos des éditions",
            '',
        );

        return response(implode("\n", $lignes), 200)->header('Content-Type', 'text/plain; charset=utf-8');
    }

    private function renderXml(array $urls): string
    {
        $rows = '';
        foreach ($urls as $u) {
            $rows .= "\n  <url>"
                   . "\n    <loc>".htmlspecialchars($u['loc'])."</loc>"
                   . ($u['mod'] ? "\n    <lastmod>{$u['mod']->toAtomString()}</lastmod>" : '')
                   . "\n    <changefreq>{$u['freq']}</changefreq>"
                   . "\n    <priority>{$u['priority']}</priority>"
                   . "\n  </url>";
        }

        return '<?xml version="1.0" encoding="UTF-8"?>'
            ."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
            .$rows
            ."\n</urlset>";
    }

    /** Date la plus récente parmi celles fournies (null ignorés), ou null si aucune. */
    private function latest(mixed ...$dates): ?Carbon
    {
        return collect($dates)->filter()->map(fn ($d) => Carbon::parse($d))->max();
    }

    private function toUrlSlug(string $str): string
    {
        $str = mb_strtolower($str);
        $str = strtr($str, ['à'=>'a','â'=>'a','ä'=>'a','é'=>'e','è'=>'e','ê'=>'e','ë'=>'e','î'=>'i','ï'=>'i','ô'=>'o','ö'=>'o','ù'=>'u','û'=>'u','ü'=>'u','ç'=>'c','õ'=>'o']);
        $str = preg_replace('/[^a-z0-9]+/', '-', $str);
        return trim($str, '-');
    }
}
