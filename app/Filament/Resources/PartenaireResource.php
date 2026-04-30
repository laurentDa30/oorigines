<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PartenaireResource\Pages;
use App\Models\Partenaire;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PartenaireResource extends Resource
{
    protected static ?string $model = Partenaire::class;
    protected static ?string $navigationIcon = 'heroicon-o-building-office';
    protected static ?string $navigationLabel = 'Partenaires';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('nom')->required()->maxLength(255),
            Forms\Components\Select::make('niveau')
                ->options(['Or' => 'Or', 'Argent' => 'Argent', 'Bronze' => 'Bronze', 'Institutionnel' => 'Institutionnel'])
                ->required(),
            Forms\Components\FileUpload::make('logo')->image()->directory('partenaires'),
            Forms\Components\TextInput::make('site_web')->url()->prefix('https://'),
            Forms\Components\TextInput::make('ordre')->numeric()->default(0),
            Forms\Components\Toggle::make('visible')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('logo'),
                Tables\Columns\TextColumn::make('nom')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('niveau')->badge()
                    ->color(fn (string $state): string => match($state) {
                        'Or'            => 'warning',
                        'Argent'        => 'gray',
                        'Bronze'        => 'danger',
                        'Institutionnel'=> 'info',
                        default         => 'gray',
                    }),
                Tables\Columns\TextColumn::make('ordre')->sortable(),
                Tables\Columns\IconColumn::make('visible')->boolean(),
            ])
            ->defaultSort('ordre')
            ->reorderable('ordre')
            ->actions([Tables\Actions\EditAction::make()])
            ->bulkActions([Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListPartenaires::route('/'),
            'create' => Pages\CreatePartenaire::route('/create'),
            'edit'   => Pages\EditPartenaire::route('/{record}/edit'),
        ];
    }
}
