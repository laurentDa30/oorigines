<?php

namespace Tests\Feature;

use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Contenu de repli rendu côté serveur dans #root : si Google n'arrive pas à charger le JS
 * (constaté dans le test en direct de la Search Console), chaque URL doit quand même
 * présenter son propre H1, son propre texte et des liens HTML vers les autres pages.
 */
class SeoFallbackTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Course::create([
            'slug' => 'trail20', 'nom' => "Astra'trail", 'visible' => true, 'ordre' => 0,
            'tagline' => 'Le défi phare du Vallon', 'description' => "Le parcours le plus technique.\nPensez à vos chevilles.",
            'distance_val' => '22', 'distance_unit' => 'km', 'denivele' => '+740m',
            'heure_depart' => '15h00', 'heure_arrivee' => '17h15', 'tarif' => 'À partir de 22 €', 'limite' => '300 participants',
            'equipement_obligatoire' => ['Téléphone chargé'],
        ]);
        Course::create([
            'slug' => 'trail500', 'nom' => 'Irréductibles’Kid trail ', 'visible' => true, 'ordre' => 5,
            'distance_val' => '500', 'distance_unit' => 'm',
        ]);
    }

    /** Contenu de #root (le repli est la seule chose dedans avant le montage de React). */
    private function root(string $url): string
    {
        $html = $this->get($url)->assertOk()->getContent();
        $this->assertMatchesRegularExpression('#<div id="root">(.+?)</div>\s*<!-- /root -->#s', $html, "#root vide sur $url");
        preg_match('#<div id="root">(.+?)</div>\s*<!-- /root -->#s', $html, $m);
        return $m[1];
    }

    private function h1s(string $html): array
    {
        preg_match_all('#<h1[^>]*>(.*?)</h1>#s', $html, $m);
        return array_map(fn ($h) => trim(html_entity_decode(strip_tags($h), ENT_QUOTES)), $m[1]);
    }

    public function test_chaque_page_a_un_seul_h1_qui_lui_est_propre(): void
    {
        $pages = ['/', '/evenement', '/courses', '/course/astra-trail', '/vallon', '/benevoles',
                  '/artisans', '/partenaires', '/galerie', '/actualites', '/contact'];
        $vus = [];
        foreach ($pages as $url) {
            $h1 = $this->h1s($this->root($url));
            $this->assertCount(1, $h1, "$url doit avoir exactement un H1");
            $this->assertNotContains($h1[0], $vus, "H1 « {$h1[0]} » en double ($url)");
            $vus[] = $h1[0];
        }
    }

    public function test_la_page_d_une_course_montre_ses_donnees_reelles(): void
    {
        $root = html_entity_decode($this->root('/course/astra-trail'), ENT_QUOTES);

        $this->assertSame(["Astra'trail"], $this->h1s($root));
        foreach (['22 km', '+740m', '15h00', '17h15', 'À partir de 22 €', '300 participants',
                  'Le défi phare du Vallon', 'Le parcours le plus technique.', 'Téléphone chargé'] as $attendu) {
            $this->assertStringContainsString($attendu, $root);
        }
        $this->assertStringContainsString('href="/courses"', $root);
    }

    public function test_la_page_des_courses_lie_chaque_course_en_html(): void
    {
        $root = $this->root('/courses');

        $this->assertStringContainsString('href="/course/astra-trail"', $root);
        $this->assertStringContainsString('href="/course/irreductibles-kid-trail"', $root);
    }

    public function test_le_repli_contient_la_navigation_vers_les_pages_principales(): void
    {
        $root = $this->root('/vallon');

        foreach (['/', '/evenement', '/courses', '/vallon', '/benevoles', '/contact'] as $href) {
            $this->assertStringContainsString('href="'.$href.'"', $root);
        }
    }

    public function test_plus_de_bloc_noscript_commun_a_toutes_les_pages(): void
    {
        $html = $this->get('/courses')->getContent();

        $this->assertDoesNotMatchRegularExpression('#<noscript>\s*<main#', $html);
    }

    public function test_l_image_hero_n_est_prechargee_que_la_ou_elle_s_affiche(): void
    {
        $preload = '<link rel="preload" as="image" href="/images/hero.jpg">';

        $this->assertStringContainsString($preload, $this->get('/')->getContent());
        $this->assertStringContainsString($preload, $this->get('/course/astra-trail')->getContent());
        $this->assertStringNotContainsString($preload, $this->get('/vallon')->getContent());
        $this->assertStringNotContainsString($preload, $this->get('/courses')->getContent());
    }
}
