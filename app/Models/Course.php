<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'slug', 'nom', 'categorie', 'tagline', 'description',
        'distance_val', 'distance_unit', 'distance_affichee',
        'heure_depart', 'heure_arrivee', 'denivele', 'couleur',
        'equipement_obligatoire', 'equipement_conseille', 'ravitaillement',
        'profil', 'tarif', 'limite', 'ordre', 'visible',
    ];

    protected $casts = [
        'equipement_obligatoire' => 'array',
        'equipement_conseille'   => 'array',
        'ravitaillement'         => 'array',
        'profil'                 => 'array',
        'visible'                => 'boolean',
    ];

    public function scopeVisible($query)
    {
        return $query->where('visible', true);
    }
}
