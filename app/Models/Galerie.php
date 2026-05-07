<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Galerie extends Model
{
    protected $fillable = ['titre', 'annee', 'type', 'image', 'url_video', 'video_accueil', 'featured', 'ordre'];
    protected $casts = ['featured' => 'boolean', 'video_accueil' => 'boolean'];
}
