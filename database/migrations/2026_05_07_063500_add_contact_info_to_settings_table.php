<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->string('adresse')->nullable()->after('programme');
            $table->string('email_contact')->nullable()->after('adresse');
            $table->string('telephone')->nullable()->after('email_contact');
            $table->string('facebook')->nullable()->after('telephone');
            $table->string('instagram')->nullable()->after('facebook');
            $table->string('youtube')->nullable()->after('instagram');
            $table->string('reglement_url')->nullable()->after('youtube');
            $table->string('copyright')->nullable()->after('reglement_url');
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['adresse','email_contact','telephone','facebook','instagram','youtube','reglement_url','copyright']);
        });
    }
};
