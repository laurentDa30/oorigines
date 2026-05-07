<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CourseResource\Pages;
use App\Models\Course;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CourseResource extends Resource
{
    protected static ?string $model = Course::class;
    protected static ?string $navigationIcon = 'heroicon-o-flag';
    protected static ?string $navigationLabel = 'Courses';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Tabs::make('Course')->tabs([

                Forms\Components\Tabs\Tab::make('Informations générales')->schema([
                    Forms\Components\TextInput::make('nom')
                        ->label('Nom de la course')->required()->maxLength(255),
                    Forms\Components\TextInput::make('slug')
                        ->label('Identifiant technique (slug)')->required()
                        ->unique(ignoreRecord: true)
                        ->helperText('Ne pas modifier après création')->maxLength(50),
                    Forms\Components\TextInput::make('categorie')
                        ->label('Catégorie')->placeholder('+18 ans / Tout public / Enfants'),
                    Forms\Components\TextInput::make('tagline')
                        ->label('Sous-titre / accroche')->maxLength(255)->columnSpanFull(),
                    Forms\Components\Textarea::make('description')
                        ->label('Description')->rows(4)->columnSpanFull(),
                    Forms\Components\TextInput::make('couleur')
                        ->label('Couleur CSS')->placeholder('var(--tc) ou oklch(52% 0.13 160)'),
                    Forms\Components\Toggle::make('visible')->label('Visible sur le site')->default(true),
                    Forms\Components\TextInput::make('ordre')->label('Ordre d\'affichage')->numeric()->default(0),
                ]),

                Forms\Components\Tabs\Tab::make('Distances & Horaires')->schema([
                    Forms\Components\TextInput::make('distance_val')->label('Distance (valeur)')->placeholder('20'),
                    Forms\Components\Select::make('distance_unit')->label('Unité')
                        ->options(['km' => 'km', 'm' => 'm'])->default('km'),
                    Forms\Components\TextInput::make('distance_affichee')->label('Distance affichée')
                        ->placeholder('20 km / ~6 km')->helperText('Texte affiché tel quel sur le site'),
                    Forms\Components\TextInput::make('denivele')->label('Dénivelé')->placeholder('+700m'),
                    Forms\Components\TextInput::make('heure_depart')->label('Heure de départ')->placeholder('8h00'),
                    Forms\Components\TextInput::make('heure_arrivee')->label('Heure d\'arrivée estimée')->placeholder('09h45 ou ~12h00'),
                    Forms\Components\TextInput::make('tarif')->label('Tarif d\'inscription')->placeholder('18 € / Gratuit'),
                    Forms\Components\TextInput::make('limite')->label('Limite de participants')->placeholder('200 participants / Illimité'),
                ]),

                Forms\Components\Tabs\Tab::make('Équipement & Ravitaillement')->schema([
                    Forms\Components\TagsInput::make('equipement_obligatoire')
                        ->label('Équipement obligatoire')->placeholder('Ajouter un élément…')->columnSpanFull(),
                    Forms\Components\TagsInput::make('equipement_conseille')
                        ->label('Équipement conseillé')->placeholder('Ajouter un élément…')->columnSpanFull(),
                    Forms\Components\TagsInput::make('ravitaillement')
                        ->label('Points de ravitaillement')->placeholder('Ex : Km 6 – à définir')->columnSpanFull(),
                ]),

            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('ordre')->label('#')->sortable()->width(50),
                Tables\Columns\TextColumn::make('nom')->searchable()->sortable()->weight('bold'),
                Tables\Columns\TextColumn::make('distance_affichee')->label('Distance'),
                Tables\Columns\TextColumn::make('categorie')->label('Catégorie')->badge(),
                Tables\Columns\TextColumn::make('heure_depart')->label('Départ'),
                Tables\Columns\TextColumn::make('tarif')->label('Tarif'),
                Tables\Columns\IconColumn::make('visible')->boolean()->label('Visible'),
            ])
            ->defaultSort('ordre')
            ->reorderable('ordre')
            ->actions([Tables\Actions\EditAction::make()])
            ->bulkActions([Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListCourses::route('/'),
            'create' => Pages\CreateCourse::route('/create'),
            'edit'   => Pages\EditCourse::route('/{record}/edit'),
        ];
    }
}
