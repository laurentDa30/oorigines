<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partenaire extends Model
{
    protected $fillable = ['nom', 'niveau', 'logo', 'site_web', 'visible', 'ordre'];
    protected $casts = ['visible' => 'boolean'];

    public function scopeVisible($query) { return $query->where('visible', true)->orderBy('ordre'); }
}
