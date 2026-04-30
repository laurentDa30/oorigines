<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/{any?}', [PageController::class, 'index'])->where('any', '.*')->name('home');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');
