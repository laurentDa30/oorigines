<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GalerieResource\Pages;
use App\Models\Galerie;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class GalerieResource extends Resource
{
    protected static ?string $model = Galerie::class;
    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationLabel = 'Galerie';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('titre')->required()->maxLength(255),
            Forms\Components\TextInput::make('annee')->numeric()->minValue(2020)->maxValue(2100),
            Forms\Components\Select::make('type')->options(['Photo' => 'Photo', 'Video' => 'Vidéo'])->required()->live(),
            Forms\Components\FileUpload::make('image')->image()->directory('galerie')->disk('public')->visibility('public')
                ->acceptedFileTypes(['image/jpeg','image/png','image/webp'])->maxSize(8192)
                ->visible(fn (Forms\Get $get) => $get('type') === 'Photo'),
            Forms\Components\TextInput::make('url_video')->url()
                ->visible(fn (Forms\Get $get) => $get('type') === 'Video'),
            Forms\Components\Toggle::make('video_accueil')->label('Vidéo page d\'accueil')
                ->helperText('Afficher cette vidéo dans la section vidéo de la page d\'accueil')
                ->visible(fn (Forms\Get $get) => $get('type') === 'Video'),
            Forms\Components\TextInput::make('ordre')->numeric()->default(0),
            Forms\Components\Toggle::make('featured')->label('Mise en avant'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image'),
                Tables\Columns\TextColumn::make('titre')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('annee')->sortable(),
                Tables\Columns\TextColumn::make('type')->badge(),
                Tables\Columns\IconColumn::make('video_accueil')->boolean()->label('Accueil'),
                Tables\Columns\IconColumn::make('featured')->boolean()->label('Vedette'),
                Tables\Columns\TextColumn::make('ordre')->sortable(),
            ])
            ->defaultSort('ordre')
            ->reorderable('ordre')
            ->actions([Tables\Actions\EditAction::make()])
            ->bulkActions([Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListGaleries::route('/'),
            'create' => Pages\CreateGalerie::route('/create'),
            'edit'   => Pages\EditGalerie::route('/{record}/edit'),
        ];
    }
}
