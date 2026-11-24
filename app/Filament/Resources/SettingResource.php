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

                Forms\Components\Tabs\Tab::make('Programme & sections')->schema([
                    Forms\Components\Toggle::make('programme_actif')
                        ->label('Afficher le programme de la journée')
                        ->helperText('Désactivé : la page Événement affiche « Le programme sera dévoilé prochainement » en conservant l\'encadré.')
                        ->columnSpanFull(),
                    Forms\Components\Repeater::make('programme')
                        ->label('Programme de la journée')
                        ->helperText('Les lignes s\'affichent dans l\'ordre ci-dessous. Glissez pour réordonner.')
                        ->schema([
                            Forms\Components\TextInput::make('heure')
                                ->label('Heure')
                                ->placeholder('15h00')
                                ->required()
                                ->columnSpan(1),
                            Forms\Components\TextInput::make('libelle')
                                ->label('Événement')
                                ->placeholder("Départ Trail 20km – Astra'trail")
                                ->required()
                                ->columnSpan(3),
                        ])
                        ->columns(4)
                        ->reorderable()
                        ->addActionLabel('Ajouter une ligne')
                        ->collapsible()
                        ->itemLabel(fn (array $state): ?string => trim(($state['heure'] ?? '').' · '.($state['libelle'] ?? '')) ?: null)
                        ->columnSpanFull(),
                    Forms\Components\Toggle::make('partenaires_actif')
                        ->label('Afficher la liste des partenaires')
                        ->helperText('Désactivé : « Partenaires dévoilés prochainement ». Le bloc « Avec le soutien de » (institutionnels) reste toujours affiché.')
                        ->columnSpanFull(),
                    Forms\Components\Toggle::make('artisans_actif')
                        ->label('Afficher la liste des artisans')
                        ->helperText('Désactivé : « Les artisans seront dévoilés prochainement ».')
                        ->columnSpanFull(),
                ]),

                Forms\Components\Tabs\Tab::make('Inscriptions')->schema([
                    Forms\Components\Toggle::make('inscriptions_actif')
                        ->label('Les inscriptions sont ouvertes')
                        ->helperText('Activé : les boutons « Je m\'inscris » du site pointent vers le lien ci-dessous. Désactivé : ils sont grisés et le site annonce la date d\'ouverture.')
                        ->live()
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('inscriptions_url')
                        ->label("Lien vers le site d'inscription")
                        ->url()
                        ->placeholder('https://www.klikego.com/...')
                        ->helperText('Obligatoire pour pouvoir ouvrir les inscriptions. Le lien s\'ouvre dans un nouvel onglet.')
                        ->required(fn (Forms\Get $get) => (bool) $get('inscriptions_actif'))
                        ->columnSpanFull(),
                    Forms\Components\DatePicker::make('inscriptions_date_ouverture')
                        ->label("Date d'ouverture annoncée")
                        ->displayFormat('d/m/Y')
                        ->helperText('Affichée sur le site tant que les inscriptions sont fermées : « Les inscriptions ouvriront le 2 octobre 2026 ». Laissez vide pour afficher « prochainement ».')
                        ->columnSpanFull(),
                ]),

                Forms\Components\Tabs\Tab::make("Bandeau d'annonce")->schema([
                    Forms\Components\Toggle::make('announce_actif')
                        ->label('Afficher le bandeau')
                        ->helperText('Bandeau d\'info en haut du site (jeu-concours, ouverture des inscriptions, météo jour J…). S\'affiche aussi uniquement dans la période choisie ci-dessous, si renseignée.')
                        ->columnSpanFull(),
                    Forms\Components\Textarea::make('announce_message')
                        ->label('Message')
                        ->rows(2)
                        ->maxLength(180)
                        ->helperText('Message court (une phrase). Les emojis sont autorisés. 180 caractères max.')
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('announce_lien_label')
                        ->label('Texte du lien (optionnel)')
                        ->placeholder('Participer'),
                    Forms\Components\TextInput::make('announce_lien_url')
                        ->label('URL du lien (optionnel)')
                        ->url()
                        ->placeholder('https://www.facebook.com/auxoriginestrail/'),
                    Forms\Components\Select::make('announce_ton')
                        ->label('Couleur')
                        ->options([
                            'tc'   => 'Terracotta (principal)',
                            'ocre' => 'Ocre',
                            'dark' => 'Sombre',
                        ])
                        ->default('tc')
                        ->native(false),
                    Forms\Components\Placeholder::make('announce_periode_hint')
                        ->label('')
                        ->content('Laissez les dates vides pour afficher le bandeau en permanence (tant qu\'il est activé).')
                        ->columnSpanFull(),
                    Forms\Components\DateTimePicker::make('announce_debut')
                        ->label('Début d\'affichage (optionnel)'),
                    Forms\Components\DateTimePicker::make('announce_fin')
                        ->label('Fin d\'affichage (optionnel)')
                        ->after('announce_debut'),
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
