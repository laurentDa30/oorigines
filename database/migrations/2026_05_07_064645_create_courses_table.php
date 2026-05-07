<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('nom');
            $table->string('categorie')->nullable();
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();
            $table->string('distance_val')->nullable();
            $table->string('distance_unit')->default('km');
            $table->string('distance_affichee')->nullable();
            $table->string('heure_depart')->nullable();
            $table->string('heure_arrivee')->nullable();
            $table->string('denivele')->nullable();
            $table->string('couleur')->default('var(--tc)');
            $table->json('equipement_obligatoire')->nullable();
            $table->json('equipement_conseille')->nullable();
            $table->json('ravitaillement')->nullable();
            $table->json('profil')->nullable();
            $table->string('tarif')->nullable();
            $table->string('limite')->nullable();
            $table->integer('ordre')->default(0);
            $table->boolean('visible')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
