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
            Forms\Components\Tabs::make('Configuration')->tabs([

                Forms\Components\Tabs\Tab::make('Événement')->schema([
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
                ]),

                Forms\Components\Tabs\Tab::make('Infos & contact')->schema([
                    Forms\Components\TextInput::make('adresse')
                        ->label('Adresse')
                        ->placeholder('Sernhac, Gard, France')
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('email_contact')
                        ->label('Email de contact')
                        ->email()
                        ->placeholder('contact@oorigines.fr'),
                    Forms\Components\TextInput::make('telephone')
                        ->label('Téléphone')
                        ->tel()
                        ->placeholder('+33 6 00 00 00 00'),
                ]),

                Forms\Components\Tabs\Tab::make('Réseaux sociaux')->schema([
                    Forms\Components\TextInput::make('facebook')
                        ->label('Facebook (URL)')
                        ->url()
                        ->placeholder('https://www.facebook.com/oorigines'),
                    Forms\Components\TextInput::make('instagram')
                        ->label('Instagram (URL)')
                        ->url()
                        ->placeholder('https://www.instagram.com/oorigines'),
                    Forms\Components\TextInput::make('youtube')
                        ->label('YouTube (URL chaîne)')
                        ->url()
                        ->placeholder('https://www.youtube.com/@oorigines'),
                ]),

                Forms\Components\Tabs\Tab::make('Footer')->schema([
                    Forms\Components\TextInput::make('reglement_url')
                        ->label('URL du règlement')
                        ->url()
                        ->helperText('Lien vers le PDF ou la page du règlement')
                        ->placeholder('https://oorigines.fr/reglement.pdf')
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('copyright')
                        ->label('Texte copyright')
                        ->placeholder('© 2027 õ origines · Sernhac · Gard · Tous droits réservés')
                        ->columnSpanFull(),
                ]),

            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('date_ouverture_site')->label('Ouverture site')->dateTime('d/m/Y H:i'),
                Tables\Columns\TextColumn::make('date_evenement')->label('Événement')->dateTime('d/m/Y H:i'),
                Tables\Columns\TextColumn::make('adresse')->label('Adresse'),
                Tables\Columns\TextColumn::make('email_contact')->label('Email'),
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
