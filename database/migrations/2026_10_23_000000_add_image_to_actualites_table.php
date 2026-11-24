<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (in_array('image', $this->existingColumns(), true)) {
            return;
        }

        Schema::table('actualites', function (Blueprint $table) {
            $table->string('image')->nullable()->after('extrait');
        });
    }

    public function down(): void
    {
        Schema::table('actualites', function (Blueprint $table) {
            $table->dropColumn('image');
        });
    }

    /**
     * Liste les colonnes de `actualites` sans passer par Schema::hasColumn() :
     * le MySQL de la prod est trop ancien (erreur 1054 generation_expression).
     */
    private function existingColumns(): array
    {
        $connection = Schema::getConnection();

        if (in_array($connection->getDriverName(), ['mysql', 'mariadb'], true)) {
            $table = $connection->getTablePrefix().'actualites';

            return array_column($connection->select('SHOW COLUMNS FROM `'.$table.'`'), 'Field');
        }

        return Schema::getColumnListing('actualites'); // SQLite en local
    }
};
