<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['nom', 'email', 'sujet', 'objet', 'message', 'lu'];
    protected $casts = ['lu' => 'boolean'];
}
