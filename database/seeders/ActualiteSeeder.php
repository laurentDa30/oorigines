<?php

namespace Database\Seeders;

use App\Models\Actualite;
use Illuminate\Database\Seeder;

class ActualiteSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'ordre'      => 1,
                'categorie'  => 'Inscriptions',
                'date_label' => 'Bientôt disponibles',
                'titre'      => 'Ouverture des inscriptions 2027',
                'extrait'    => "Les inscriptions pour les quatre épreuves d'aux õrigines ouvriront prochainement. Restez informés pour être parmi les premiers à rejoindre l'aventure.",
                'contenu'    => null,
                'visible'    => true,
            ],
            [
                'ordre'      => 2,
                'categorie'  => 'Parcours',
                'date_label' => 'Printemps 2027',
                'titre'      => "Tracé officiel de l'Astra'trail dévoilé",
                'extrait'    => "20 kilomètres à travers le Vallon de Sernhac, entre garrigues, falaises calcaires et sentiers romains. La trace GPX sera bientôt disponible en téléchargement.",
                'contenu'    => null,
                'visible'    => true,
            ],
            [
                'ordre'      => 3,
                'categorie'  => 'Village départ',
                'date_label' => 'Été 2026',
                'titre'      => "Un marché d'artisans inédit au Vallon",
                'extrait'    => "Créateurs, producteurs locaux et artisans du Gard seront réunis pour composer un marché authentique et généreux au cœur du village départ.",
                'contenu'    => null,
                'visible'    => true,
            ],
        ];

        foreach ($items as $item) {
            Actualite::updateOrCreate(['titre' => $item['titre']], $item);
        }
    }
}
