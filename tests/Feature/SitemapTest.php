<?php

namespace Tests\Feature;

use App\Models\Actualite;
use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class SitemapTest extends TestCase
{
    use RefreshDatabase;

    /** lastmod d'une URL du sitemap, ou null si la balise est absente. */
    private function lastmod(string $xml, string $path): ?string
    {
        $doc = simplexml_load_string($xml);
        $base = rtrim(config('app.url'), '/');
        foreach ($doc->url as $u) {
            if ((string) $u->loc === $base.$path) {
                return isset($u->lastmod) ? (string) $u->lastmod : null;
            }
        }
        $this->fail("URL $path absente du sitemap");
    }

    public function test_le_sitemap_est_identique_d_un_appel_a_l_autre(): void
    {
        Course::create(['nom' => 'Le Trail', 'slug' => 'Le Trail', 'visible' => true]);

        $premier = $this->get('/sitemap.xml')->assertOk()->getContent();
        $this->travel(5)->minutes();
        $second = $this->get('/sitemap.xml')->assertOk()->getContent();

        $this->assertSame($premier, $second);
    }

    public function test_la_page_courses_prend_la_date_de_la_derniere_course_visible_modifiee(): void
    {
        $this->travelTo(Carbon::parse('2026-10-01 10:00:00'));
        Course::create(['nom' => 'Ancienne', 'slug' => 'Ancienne', 'visible' => true]);
        $this->travelTo(Carbon::parse('2026-11-02 10:00:00'));
        Course::create(['nom' => 'Recente', 'slug' => 'Recente', 'visible' => true]);
        $this->travelTo(Carbon::parse('2026-11-20 10:00:00'));
        Course::create(['nom' => 'Brouillon', 'slug' => 'Brouillon', 'visible' => false]);
        $this->travelTo(Carbon::parse('2026-11-26 10:00:00'));

        $xml = $this->get('/sitemap.xml')->getContent();

        $this->assertSame(Carbon::parse('2026-11-02 10:00:00')->toAtomString(), $this->lastmod($xml, '/courses'));
    }

    public function test_une_actualite_programmee_compte_a_sa_date_de_publication(): void
    {
        $this->travelTo(Carbon::parse('2026-11-01 10:00:00'));
        Actualite::create(['titre' => 'Programmée', 'visible' => true, 'published_at' => '2026-11-15']);
        $this->travelTo(Carbon::parse('2026-11-26 10:00:00'));

        $xml = $this->get('/sitemap.xml')->getContent();

        $this->assertStringStartsWith('2026-11-15', $this->lastmod($xml, '/actualites'));
    }

    public function test_les_pages_sans_date_connue_n_ont_pas_de_lastmod(): void
    {
        $xml = $this->get('/sitemap.xml')->getContent();

        $this->assertNull($this->lastmod($xml, '/contact'));
        $this->assertNull($this->lastmod($xml, '/vallon'));
    }
}
