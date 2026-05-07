<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('actualites', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('categorie')->default('Général');
            $table->string('date_label')->nullable();
            $table->text('extrait')->nullable();
            $table->longText('contenu')->nullable();
            $table->boolean('visible')->default(true);
            $table->unsignedSmallInteger('ordre')->default(0);
            $table->date('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('actualites');
    }
};
