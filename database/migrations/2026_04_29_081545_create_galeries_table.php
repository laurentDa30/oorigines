<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('galeries', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->year('annee')->nullable();
            $table->enum('type', ['Photo', 'Video'])->default('Photo');
            $table->string('image')->nullable();
            $table->string('url_video')->nullable();
            $table->boolean('featured')->default(false);
            $table->integer('ordre')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('galeries'); }
};
