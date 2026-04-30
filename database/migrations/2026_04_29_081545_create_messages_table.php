<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('email');
            $table->string('sujet')->default('contact');
            $table->string('objet')->nullable();
            $table->text('message');
            $table->boolean('lu')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('messages'); }
};
