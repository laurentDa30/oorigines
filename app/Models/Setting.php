<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'date_ouverture_site', 'date_evenement', 'texte_intro', 'programme',
        'adresse', 'email_contact', 'telephone',
        'facebook', 'instagram', 'youtube',
        'reglement_url', 'copyright',
    ];
    protected $casts = ['date_ouverture_site' => 'datetime', 'date_evenement' => 'datetime', 'programme' => 'array'];
}
