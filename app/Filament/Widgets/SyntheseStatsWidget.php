<?php

namespace App\Filament\Widgets;

use App\Models\Artisan;
use App\Models\Course;
use App\Models\Galerie;
use App\Models\Partenaire;
use App\Models\Setting;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SyntheseStatsWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $settings    = Setting::first();
        $eventDate   = $settings?->date_evenement;
        $dateLabel   = $eventDate
            ? $eventDate->locale('fr')->isoFormat('dddd D MMMM YYYY')
            : 'Non définie';

        $nbCourses     = Course::visible()->count();
        $nbArtisans    = Artisan::visible()->count();
        $nbPartenaires = Partenaire::visible()->count();
        $nbPhotos      = Galerie::where('type', 'Photo')->count();
        $nbVideos      = Galerie::where('type', 'Video')->count();

        return [
            Stat::make('Date de l\'événement', $dateLabel)
                ->description($eventDate ? $eventDate->diffForHumans() : '')
                ->color('warning')
                ->icon('heroicon-o-calendar'),

            Stat::make('Courses', $nbCourses)
                ->description('Épreuves visibles sur le site')
                ->color('primary')
                ->icon('heroicon-o-flag'),

            Stat::make('Artisans', $nbArtisans)
                ->description('Artisans visibles sur le site')
                ->color('success')
                ->icon('heroicon-o-user-group'),

            Stat::make('Partenaires', $nbPartenaires)
                ->description('Partenaires visibles')
                ->color('info')
                ->icon('heroicon-o-building-office'),

            Stat::make('Photos', $nbPhotos)
                ->description('Photos dans la galerie')
                ->color('gray')
                ->icon('heroicon-o-photo'),

            Stat::make('Vidéos', $nbVideos)
                ->description('Vidéos dans la galerie')
                ->color('danger')
                ->icon('heroicon-o-video-camera'),
        ];
    }
}
