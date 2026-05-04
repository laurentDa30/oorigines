<?php
namespace App\Filament\Resources\GalerieResource\Pages;
use App\Filament\Resources\GalerieResource;
use App\Models\Galerie;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Pages\ListRecords;
use Filament\Notifications\Notification;

class ListGaleries extends ListRecords {
    protected static string $resource = GalerieResource::class;

    protected function getHeaderActions(): array {
        return [
            Actions\Action::make('import_multiple')
                ->label('Importer plusieurs photos')
                ->icon('heroicon-o-arrow-up-tray')
                ->color('gray')
                ->form([
                    Forms\Components\FileUpload::make('images')
                        ->label('Photos')
                        ->image()
                        ->multiple()
                        ->directory('galerie')
                        ->disk('public')
                        ->visibility('public')
                        ->reorderable()
                        ->required(),
                    Forms\Components\TextInput::make('annee')
                        ->label('Année')
                        ->numeric()
                        ->default(date('Y'))
                        ->minValue(2020)
                        ->maxValue(2100),
                    Forms\Components\Toggle::make('featured')
                        ->label('Mise en avant'),
                ])
                ->action(function (array $data): void {
                    $ordre = Galerie::max('ordre') ?? 0;
                    foreach ($data['images'] as $path) {
                        $ordre++;
                        Galerie::create([
                            'titre'    => pathinfo($path, PATHINFO_FILENAME),
                            'annee'    => $data['annee'] ?? date('Y'),
                            'type'     => 'Photo',
                            'image'    => $path,
                            'featured' => $data['featured'] ?? false,
                            'ordre'    => $ordre,
                        ]);
                    }
                    Notification::make()
                        ->title(count($data['images']) . ' photo(s) ajoutée(s)')
                        ->success()
                        ->send();
                }),
            Actions\CreateAction::make()->label('Ajouter une photo'),
        ];
    }
}
