<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Artisan extends Model
{
    protected $fillable = ['nom', 'description', 'categorie', 'logo', 'site_web', 'instagram', 'visible', 'ordre'];
    protected $casts = ['visible' => 'boolean'];

    public function scopeVisible($query) { return $query->where('visible', true)->orderBy('ordre'); }
}
