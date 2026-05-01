<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(SettingSeeder::class);

        User::firstOrCreate(
            ['email' => 'admin@admin.fr'],
            ['name' => 'Admin', 'password' => Hash::make(env('ADMIN_PASSWORD', 'changeme'))]
        );
    }
}
