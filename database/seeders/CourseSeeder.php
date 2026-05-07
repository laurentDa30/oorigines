<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            [
                'slug'                  => 'trail20',
                'nom'                   => "Astra'trail",
                'categorie'             => '+18 ans',
                'tagline'               => 'Le défi phare du Vallon',
                'description'           => "Le parcours technique et engagé de l'édition. À travers garrigues, falaises calcaires et sentiers romains, ce trail met à l'épreuve l'endurance et la technicité des coureurs dans un cadre d'exception.",
                'distance_val'          => '20',
                'distance_unit'         => 'km',
                'distance_affichee'     => '20 km',
                'heure_depart'          => '8h00',
                'heure_arrivee'         => '09h45',
                'denivele'              => '+700m',
                'couleur'               => 'var(--tc)',
                'equipement_obligatoire'=> ['Sac / gilet de trail','Eau – 500ml minimum','Couverture de survie','Téléphone chargé','Dossard visible','Cardigan ou coupe-vent'],
                'equipement_conseille'  => ['Bâtons de trail','Crème solaire','Ravitaillement solide','Guêtres basses','Lampe frontale (départ tôt)'],
                'ravitaillement'        => ['Km 6 – à définir','Km 13 – à définir'],
                'profil'                => [[0,0],[2,80],[4,200],[6,320],[8,420],[10,500],[12,580],[14,520],[16,440],[18,280],[20,0]],
                'tarif'                 => '18 €',
                'limite'                => '200 participants',
                'ordre'                 => 1,
            ],
            [
                'slug'                  => 'trail8',
                'nom'                   => "Sarnacum'trail",
                'categorie'             => '+18 ans',
                'tagline'               => 'Accessible, engagé, inoubliable',
                'description'           => "Un tracé accessible pour découvrir le Vallon à votre rythme. Idéal pour les coureurs débutants ou ceux souhaitant partager la course en famille. Le parcours emprunte les plus beaux sentiers du site.",
                'distance_val'          => '8',
                'distance_unit'         => 'km',
                'distance_affichee'     => '8 km',
                'heure_depart'          => '8h30',
                'heure_arrivee'         => '9h30',
                'denivele'              => '+500m',
                'couleur'               => 'oklch(52% 0.13 160)',
                'equipement_obligatoire'=> ['Dossard visible','Eau – 500ml minimum','Téléphone chargé'],
                'equipement_conseille'  => ['Chaussures de trail','Crème solaire','Casquette'],
                'ravitaillement'        => ['Km 4 – à définir'],
                'profil'                => [[0,0],[1.5,60],[3,150],[4.5,200],[6,140],[8,0]],
                'tarif'                 => '12 €',
                'limite'                => '300 participants',
                'ordre'                 => 2,
            ],
            [
                'slug'                  => 'marcheNordik',
                'nom'                   => 'Nordic-walking',
                'categorie'             => 'Tout public',
                'tagline'               => "Une balade guidée dans l'histoire",
                'description'           => "Une promenade guidée à travers les sentiers historiques du Vallon. Ouverte à tous, sans condition physique particulière. Un guide local accompagne les participants et partage l'histoire romaine du site.",
                'distance_val'          => '20',
                'distance_unit'         => 'km',
                'distance_affichee'     => '~6 km',
                'heure_depart'          => '9h00',
                'heure_arrivee'         => '~12h00',
                'denivele'              => '+300m',
                'couleur'               => 'var(--ocre)',
                'equipement_obligatoire'=> ['Eau','Chaussures fermées'],
                'equipement_conseille'  => ['Chapeau','Crème solaire','Appareil photo'],
                'ravitaillement'        => [],
                'profil'                => [[0,0],[1,20],[2,50],[3,70],[4,60],[5,30],[6,0]],
                'tarif'                 => 'Gratuit',
                'limite'                => 'Illimité',
                'ordre'                 => 3,
            ],
            [
                'slug'                  => 'marche',
                'nom'                   => 'Tempore',
                'categorie'             => 'Tout public',
                'tagline'               => "Une balade guidée dans l'histoire",
                'description'           => "Une promenade guidée à travers les sentiers historiques du Vallon. Ouverte à tous, sans condition physique particulière. Un guide local accompagne les participants et partage l'histoire romaine du site.",
                'distance_val'          => '8',
                'distance_unit'         => 'km',
                'distance_affichee'     => '~6 km',
                'heure_depart'          => '9h00',
                'heure_arrivee'         => '~12h00',
                'denivele'              => '+300m',
                'couleur'               => 'var(--ocre)',
                'equipement_obligatoire'=> ['Eau','Chaussures fermées'],
                'equipement_conseille'  => ['Chapeau','Crème solaire','Appareil photo'],
                'ravitaillement'        => [],
                'profil'                => [[0,0],[1,20],[2,50],[3,70],[4,60],[5,30],[6,0]],
                'tarif'                 => 'Gratuit',
                'limite'                => 'Illimité',
                'ordre'                 => 4,
            ],
            [
                'slug'                  => 'enfants',
                'nom'                   => "Irréductibles'Kid trail",
                'categorie'             => 'Enfants',
                'tagline'               => 'Les petits gladiateurs du Vallon !',
                'description'           => "Un parcours ludique, sécurisé et encadré pour les plus petits. Déguisements romains fortement encouragés ! Chaque enfant repart avec sa médaille de finisher.",
                'distance_val'          => '500',
                'distance_unit'         => 'm',
                'distance_affichee'     => '~1 km',
                'heure_depart'          => '9h15',
                'heure_arrivee'         => '~9h25',
                'denivele'              => 'Plat / très faible',
                'couleur'               => 'oklch(60% 0.14 55)',
                'equipement_obligatoire'=> ['Accompagnement adulte requis pour les – 6 ans'],
                'equipement_conseille'  => ['Déguisement romain','Eau'],
                'ravitaillement'        => [],
                'profil'                => [[0,0],[0.3,5],[0.6,8],[0.9,5],[1,0]],
                'tarif'                 => 'Gratuit',
                'limite'                => 'Illimité',
                'ordre'                 => 5,
            ],
        ];

        foreach ($courses as $data) {
            Course::updateOrCreate(['slug' => $data['slug']], $data);
        }
    }
}
