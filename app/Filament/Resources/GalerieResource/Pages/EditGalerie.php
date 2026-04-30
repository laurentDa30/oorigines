<?php
namespace App\Filament\Resources\GalerieResource\Pages;
use App\Filament\Resources\GalerieResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
class EditGalerie extends EditRecord {
    protected static string $resource = GalerieResource::class;
    protected function getHeaderActions(): array { return [Actions\DeleteAction::make()]; }
}
