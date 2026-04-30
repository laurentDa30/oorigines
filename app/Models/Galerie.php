<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Galerie extends Model
{
    protected $fillable = ['titre', 'annee', 'type', 'image', 'url_video', 'featured', 'ordre'];
    protected $casts = ['featured' => 'boolean'];
}
