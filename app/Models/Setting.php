<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['date_ouverture_site', 'date_evenement', 'texte_intro', 'programme'];
    protected $casts = ['date_ouverture_site' => 'datetime', 'date_evenement' => 'datetime', 'programme' => 'array'];
}
