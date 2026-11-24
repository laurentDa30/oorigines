<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Fix MySQL < 5.7.7 / MariaDB : index column size limit (767 bytes)
        Schema::defaultStringLength(191);
    }
}
