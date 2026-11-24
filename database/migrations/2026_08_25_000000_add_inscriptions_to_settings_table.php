<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $existing = $this->existingColumns();

        Schema::table('settings', function (Blueprint $table) use ($existing) {
            if (! in_array('inscriptions_actif', $existing, true)) {
                $table->boolean('inscriptions_actif')->default(false);
            }
            if (! in_array('inscriptions_url', $existing, true)) {
                $table->string('inscriptions_url')->nullable();
            }
            if (! in_array('inscriptions_date_ouverture', $existing, true)) {
                $table->date('inscriptions_date_ouverture')->nullable();
            }
        });
    }

    public function down(): void
    {
        $existing = $this->existingColumns();

        $drop = array_values(array_intersect([
            'inscriptions_actif',
            'inscriptions_url',
            'inscriptions_date_ouverture',
        ], $existing));

        if ($drop === []) {
            return;
        }

        Schema::table('settings', function (Blueprint $table) use ($drop) {
            $table->dropColumn($drop);
        });
    }

    /**
     * Liste les colonnes de `settings` sans passer par Schema::hasColumn().
     *
     * Schema::hasColumn() interroge information_schema.generation_expression,
     * colonne qui n'existe qu'à partir de MySQL 5.7.6 / MariaDB 10.2. Sur un
     * hébergement plus ancien elle déclenche une erreur SQL 1054 et fait
     * échouer toute la migration. SHOW COLUMNS, lui, est supporté par toutes
     * les versions.
     *
     * @return array<int, string>
     */
    private function existingColumns(): array
    {
        $connection = Schema::getConnection();

        if (in_array($connection->getDriverName(), ['mysql', 'mariadb'], true)) {
            $table = $connection->getTablePrefix().'settings';

            return array_column($connection->select('SHOW COLUMNS FROM `'.$table.'`'), 'Field');
        }

        return Schema::getColumnListing('settings');
    }
};
