<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SettingResource\Pages;
use App\Models\Setting;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SettingResource extends Resource
{
    protected static ?string $model = Setting::class;
    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static ?string $navigationLabel = 'Configuration';
    protected static ?int $navigationSort = 5;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\DateTimePicker::make('date_ouverture_site')
                ->label('Date ouverture du site')
                ->required()
                ->helperText('Avant cette date : écran compte à rebours'),
            Forms\Components\DateTimePicker::make('date_evenement')
                ->label("Date de l'événement")
                ->required(),
            Forms\Components\Textarea::make('texte_intro')
                ->label("Texte d'introduction")
                ->rows(4)
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('date_ouverture_site')->label('Ouverture site')->dateTime('d/m/Y H:i'),
                Tables\Columns\TextColumn::make('date_evenement')->label('Événement')->dateTime('d/m/Y H:i'),
            ])
            ->actions([Tables\Actions\EditAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSettings::route('/'),
            'edit'  => Pages\EditSetting::route('/{record}/edit'),
        ];
    }
}
