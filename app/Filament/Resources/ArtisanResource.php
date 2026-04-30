<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArtisanResource\Pages;
use App\Models\Artisan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ArtisanResource extends Resource
{
    protected static ?string $model = Artisan::class;
    protected static ?string $navigationIcon = 'heroicon-o-star';
    protected static ?string $navigationLabel = 'Artisans';
    protected static ?string $modelLabel = 'Artisan';
    protected static ?string $pluralModelLabel = 'Artisans';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('nom')->required()->maxLength(255),
            Forms\Components\Select::make('categorie')->options([
                'Poterie & Céramique'    => 'Poterie & Céramique',
                'Textile & Tissage'      => 'Textile & Tissage',
                'Produits du Terroir'    => 'Produits du Terroir',
                'Forge & Métal'          => 'Forge & Métal',
                'Sculpture sur Bois'     => 'Sculpture sur Bois',
                'Cosmétiques Naturels'   => 'Cosmétiques Naturels',
                'Bijoux & Parures'       => 'Bijoux & Parures',
                'Arts Graphiques'        => 'Arts Graphiques',
                'Gastronomie Locale'     => 'Gastronomie Locale',
                'Vannerie'               => 'Vannerie',
                'Autre'                  => 'Autre',
            ]),
            Forms\Components\Textarea::make('description')->rows(4)->columnSpanFull(),
            Forms\Components\FileUpload::make('logo')->image()->directory('artisans'),
            Forms\Components\TextInput::make('site_web')->url()->prefix('https://'),
            Forms\Components\TextInput::make('instagram')->prefix('@'),
            Forms\Components\TextInput::make('ordre')->numeric()->default(0),
            Forms\Components\Toggle::make('visible')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('logo')->circular(),
                Tables\Columns\TextColumn::make('nom')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('categorie')->badge(),
                Tables\Columns\TextColumn::make('ordre')->sortable(),
                Tables\Columns\IconColumn::make('visible')->boolean(),
            ])
            ->defaultSort('ordre')
            ->reorderable('ordre')
            ->filters([])
            ->actions([Tables\Actions\EditAction::make()])
            ->bulkActions([Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListArtisans::route('/'),
            'create' => Pages\CreateArtisan::route('/create'),
            'edit'   => Pages\EditArtisan::route('/{record}/edit'),
        ];
    }
}
