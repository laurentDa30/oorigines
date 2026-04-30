<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partenaires', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->enum('niveau', ['Or', 'Argent', 'Bronze', 'Institutionnel'])->default('Bronze');
            $table->string('logo')->nullable();
            $table->string('site_web')->nullable();
            $table->boolean('visible')->default(true);
            $table->integer('ordre')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('partenaires'); }
};
