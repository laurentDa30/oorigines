<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->boolean('announce_actif')->default(false)->after('copyright');
            $table->text('announce_message')->nullable()->after('announce_actif');
            $table->string('announce_lien_label')->nullable()->after('announce_message');
            $table->string('announce_lien_url')->nullable()->after('announce_lien_label');
            $table->string('announce_ton')->default('tc')->after('announce_lien_url');
            $table->dateTime('announce_debut')->nullable()->after('announce_ton');
            $table->dateTime('announce_fin')->nullable()->after('announce_debut');
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'announce_actif', 'announce_message', 'announce_lien_label',
                'announce_lien_url', 'announce_ton', 'announce_debut', 'announce_fin',
            ]);
        });
    }
};
