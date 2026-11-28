<?php

namespace Tests\Feature;

use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LlmsTxtTest extends TestCase
{
    use RefreshDatabase;

    public function test_llms_txt_est_un_markdown_avec_titre_et_liens_vers_les_pages(): void
    {
        $base = rtrim(config('app.url'), '/');

        $res = $this->get('/llms.txt')->assertOk();

        $this->assertStringStartsWith('text/plain', $res->headers->get('Content-Type'));
        $txt = $res->getContent();
        $this->assertMatchesRegularExpression('/^# .+/', $txt);
        $this->assertStringContainsString("]($base/courses)", $txt);
        $this->assertStringContainsString("]($base/contact)", $txt);
    }

    public function test_les_courses_viennent_de_la_base_avec_leur_lien(): void
    {
        $base = rtrim(config('app.url'), '/');
        Course::create(['nom' => 'Nordic-walking', 'slug' => 'nw', 'distance_affichee' => '10 km', 'visible' => true]);
        Course::create(['nom' => 'Cachée', 'slug' => 'c', 'distance_affichee' => '3 km', 'visible' => false]);

        $txt = $this->get('/llms.txt')->getContent();

        $this->assertStringContainsString("[Nordic-walking]($base/course/nordic-walking)", $txt);
        $this->assertStringContainsString('10 km', $txt);
        $this->assertStringNotContainsString('Cachée', $txt);
    }
}
