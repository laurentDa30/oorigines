<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JsonLdTest extends TestCase
{
    use RefreshDatabase;

    /** Le SportsEvent principal injecté dans la page d'accueil. */
    private function evenement(): array
    {
        $html = $this->get('/')->assertOk()->getContent();
        preg_match_all('#<script type="application/ld\+json"[^>]*>(.*?)</script>#s', $html, $m);
        foreach ($m[1] as $json) {
            $data = json_decode($json, true);
            if (($data['@type'] ?? null) === 'SportsEvent') return $data;
        }
        $this->fail('SportsEvent absent du JSON-LD');
    }

    private function course(array $attrs): void
    {
        Course::create(['slug' => $attrs['nom'], 'visible' => true] + $attrs);
    }

    public function test_sans_heure_d_arrivee_ni_programme_aucune_heure_de_fin_n_est_inventee(): void
    {
        $this->course(['nom' => 'Trail', 'heure_depart' => '08h00']);

        $ev = $this->evenement();

        $this->assertArrayNotHasKey('endDate', $ev);
        $this->assertArrayNotHasKey('endDate', $ev['subEvent'][0]);
    }

    public function test_la_fin_d_une_course_est_son_heure_d_arrivee_affichee(): void
    {
        $this->course(['nom' => 'Trail', 'heure_depart' => '08h00', 'heure_arrivee' => '11h30 – 13h15']);

        $sub = $this->evenement()['subEvent'][0];

        $this->assertStringContainsString('T13:15:00', $sub['endDate']); // dernière heure de la plage
    }

    public function test_la_fin_de_l_evenement_est_la_derniere_heure_affichee_du_programme_ou_des_courses(): void
    {
        $this->course(['nom' => 'Trail', 'heure_depart' => '08h00', 'heure_arrivee' => '13h00']);
        Setting::create([
            'date_evenement'  => '2027-04-24 08:00:00',
            'programme_actif' => true,
            'programme'       => [['heure' => '10h00', 'libelle' => 'Kid Trail'], ['heure' => '17h30', 'libelle' => 'Remise des récompenses']],
        ]);

        $ev = $this->evenement();

        $this->assertStringContainsString('2027-04-24T17:30:00', $ev['endDate']);
    }

    public function test_un_programme_masque_n_entre_pas_dans_l_heure_de_fin(): void
    {
        $this->course(['nom' => 'Trail', 'heure_depart' => '08h00', 'heure_arrivee' => '13h00']);
        Setting::create([
            'date_evenement'  => '2027-04-24 08:00:00',
            'programme_actif' => false,
            'programme'       => [['heure' => '17h30', 'libelle' => 'Remise des récompenses']],
        ]);

        $this->assertStringContainsString('T13:00:00', $this->evenement()['endDate']);
    }
}
