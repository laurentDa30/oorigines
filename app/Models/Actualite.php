<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Actualite extends Model
{
    protected $fillable = [
        'titre', 'categorie', 'date_label', 'extrait', 'contenu',
        'visible', 'ordre', 'published_at',
    ];

    protected $casts = [
        'visible'      => 'boolean',
        'published_at' => 'date',
    ];

    public function scopeVisible($query)
    {
        return $query->where('visible', true)
            ->where(fn($q) => $q->whereNull('published_at')->orWhereDate('published_at', '<=', now()));
    }
}
