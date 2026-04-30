<?php
namespace App\Filament\Resources\GalerieResource\Pages;
use App\Filament\Resources\GalerieResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
class ListGaleries extends ListRecords {
    protected static string $resource = GalerieResource::class;
    protected function getHeaderActions(): array { return [Actions\CreateAction::make()]; }
}
