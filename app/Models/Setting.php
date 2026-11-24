<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'date_ouverture_site', 'date_evenement', 'texte_intro', 'programme',
        'programme_actif', 'partenaires_actif', 'artisans_actif',
        'adresse', 'email_contact', 'telephone',
        'facebook', 'instagram', 'youtube',
        'reglement_url', 'copyright',
        'announce_actif', 'announce_message', 'announce_lien_label',
        'announce_lien_url', 'announce_ton', 'announce_debut', 'announce_fin',
        'inscriptions_actif', 'inscriptions_url', 'inscriptions_date_ouverture',
    ];
    protected $casts = [
        'date_ouverture_site' => 'datetime',
        'date_evenement'      => 'datetime',
        'programme'           => 'array',
        'programme_actif'     => 'boolean',
        'partenaires_actif'   => 'boolean',
        'artisans_actif'      => 'boolean',
        'announce_actif'      => 'boolean',
        'announce_debut'      => 'datetime',
        'announce_fin'        => 'datetime',
        'inscriptions_actif'  => 'boolean',
        'inscriptions_date_ouverture' => 'date',
    ];
}
