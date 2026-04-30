<?php
namespace App\Filament\Resources\PartenaireResource\Pages;
use App\Filament\Resources\PartenaireResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
class ListPartenaires extends ListRecords {
    protected static string $resource = PartenaireResource::class;
    protected function getHeaderActions(): array { return [Actions\CreateAction::make()]; }
}
