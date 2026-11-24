<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->boolean('programme_actif')->default(false)->after('programme');
            $table->boolean('partenaires_actif')->default(false)->after('programme_actif');
            $table->boolean('artisans_actif')->default(false)->after('partenaires_actif');
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['programme_actif', 'partenaires_actif', 'artisans_actif']);
        });
    }
};
