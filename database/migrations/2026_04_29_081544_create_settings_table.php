<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date_ouverture_site')->default('2026-09-01 00:00:00');
            $table->dateTime('date_evenement')->default('2027-04-24 08:00:00');
            $table->text('texte_intro')->nullable();
            $table->json('programme')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('settings'); }
};
