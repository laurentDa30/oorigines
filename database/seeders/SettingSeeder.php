<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::firstOrCreate([], [
            'date_ouverture_site' => '2026-09-01 00:00:00',
            'date_evenement'      => '2027-04-24 08:00:00',
            'texte_intro'         => null,
        ]);
    }
}
