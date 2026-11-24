<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'slug', 'nom', 'categorie', 'type_course', 'tagline', 'description',
        'distance_val', 'distance_unit', 'distance_affichee',
        'heure_depart', 'heure_arrivee', 'denivele', 'couleur',
        'equipement_obligatoire', 'equipement_conseille', 'materiel_interdit', 'ravitaillement',
        'profil', 'tarif', 'limite', 'ordre', 'visible',
    ];

    protected $casts = [
        'equipement_obligatoire' => 'array',
        'equipement_conseille'   => 'array',
        'materiel_interdit'      => 'array',
        'ravitaillement'         => 'array',
        'profil'                 => 'array',
        'visible'                => 'boolean',
    ];

    public function scopeVisible($query)
    {
        return $query->where('visible', true);
    }
}
