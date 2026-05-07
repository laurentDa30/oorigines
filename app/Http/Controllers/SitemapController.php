<?php

namespace App\Http\Controllers;

use App\Models\Actualite;
use App\Models\Course;
use App\Models\Setting;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $base     = rtrim(config('app.url'), '/');
        $settings = Setting::first() ?? new Setting();
        $now      = now()->toAtomString();

        $eventDate = $settings->date_evenement?->toAtomString() ?? now()->toAtomString();

        $urls = [];

        // Pages statiques avec priorité
        $static = [
            ['loc' => $base.'/',              'priority' => '1.0',  'freq' => 'weekly',  'mod' => $now],
            ['loc' => $base.'/evenement',     'priority' => '0.9',  'freq' => 'monthly', 'mod' => $eventDate],
            ['loc' => $base.'/courses',       'priority' => '0.9',  'freq' => 'monthly', 'mod' => $now],
            ['loc' => $base.'/actualites',    'priority' => '0.8',  'freq' => 'weekly',  'mod' => $now],
            ['loc' => $base.'/vallon',        'priority' => '0.7',  'freq' => 'monthly', 'mod' => $now],
            ['loc' => $base.'/artisans',      'priority' => '0.7',  'freq' => 'monthly', 'mod' => $now],
            ['loc' => $base.'/galerie',       'priority' => '0.6',  'freq' => 'monthly', 'mod' => $now],
            ['loc' => $base.'/partenaires',   'priority' => '0.5',  'freq' => 'monthly', 'mod' => $now],
            ['loc' => $base.'/contact',       'priority' => '0.6',  'freq' => 'yearly',  'mod' => $now],
        ];
        $urls = array_merge($urls, $static);

        // Pages courses détail
        $courses = Course::visible()->orderBy('ordre')->get(['nom', 'updated_at']);
        foreach ($courses as $course) {
            $slug = $this->toUrlSlug($course->nom);
            $urls[] = [
                'loc'      => "$base/course/$slug",
                'priority' => '0.8',
                'freq'     => 'monthly',
                'mod'      => $course->updated_at->toAtomString(),
            ];
        }

        // Pages actualités (liens directs si on en a)
        $actualites = Actualite::visible()->orderBy('ordre')->get(['updated_at']);
        if ($actualites->isNotEmpty()) {
            // La page liste suffit ; les articles s'ouvrent en SPA sans URL propre
            // → déjà incluse dans $static
        }

        $xml = $this->renderXml($urls);

        return response($xml, 200)->header('Content-Type', 'application/xml; charset=utf-8');
    }

    private function renderXml(array $urls): string
    {
        $rows = '';
        foreach ($urls as $u) {
            $rows .= "\n  <url>"
                   . "\n    <loc>".htmlspecialchars($u['loc'])."</loc>"
                   . "\n    <lastmod>{$u['mod']}</lastmod>"
                   . "\n    <changefreq>{$u['freq']}</changefreq>"
                   . "\n    <priority>{$u['priority']}</priority>"
                   . "\n  </url>";
        }

        return '<?xml version="1.0" encoding="UTF-8"?>'
            ."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
            .$rows
            ."\n</urlset>";
    }

    private function toUrlSlug(string $str): string
    {
        $str = mb_strtolower($str);
        $str = strtr($str, ['à'=>'a','â'=>'a','ä'=>'a','é'=>'e','è'=>'e','ê'=>'e','ë'=>'e','î'=>'i','ï'=>'i','ô'=>'o','ö'=>'o','ù'=>'u','û'=>'u','ü'=>'u','ç'=>'c','õ'=>'o']);
        $str = preg_replace('/[^a-z0-9]+/', '-', $str);
        return trim($str, '-');
    }
}
