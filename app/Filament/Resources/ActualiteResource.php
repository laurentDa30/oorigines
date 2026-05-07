<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ActualiteResource\Pages;
use App\Models\Actualite;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ActualiteResource extends Resource
{
    protected static ?string $model = Actualite::class;
    protected static ?string $navigationIcon = 'heroicon-o-newspaper';
    protected static ?string $navigationLabel = 'Actualités';
    protected static ?string $modelLabel = 'Actualité';
    protected static ?string $pluralModelLabel = 'Actualités';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('titre')
                ->label('Titre')
                ->required()
                ->maxLength(255)
                ->columnSpanFull(),

            Select::make('categorie')
                ->label('Catégorie')
                ->options([
                    'Inscriptions'    => 'Inscriptions',
                    'Parcours'        => 'Parcours',
                    'Village départ'  => 'Village départ',
                    'Programme'       => 'Programme',
                    'Résultats'       => 'Résultats',
                    'Général'         => 'Général',
                ])
                ->required()
                ->default('Général'),

            TextInput::make('date_label')
                ->label('Label de date affiché')
                ->placeholder('ex : Bientôt disponibles, Printemps 2027…')
                ->maxLength(100),

            DatePicker::make('published_at')
                ->label('Publier à partir du')
                ->helperText('Laissez vide pour publier immédiatement. Si une date future est renseignée, l\'article n\'apparaîtra sur le site qu\'à partir de cette date.')
                ->displayFormat('d/m/Y')
                ->native(false),

            Textarea::make('extrait')
                ->label('Extrait (aperçu en liste)')
                ->rows(3)
                ->maxLength(500)
                ->columnSpanFull(),

            RichEditor::make('contenu')
                ->label('Contenu complet')
                ->toolbarButtons(['bold','italic','link','bulletList','orderedList','h2','h3','blockquote','undo','redo'])
                ->columnSpanFull(),

            TextInput::make('ordre')
                ->label('Ordre d\'affichage')
                ->numeric()
                ->default(0),

            Toggle::make('visible')
                ->label('Visible sur le site')
                ->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('ordre')
                    ->label('#')
                    ->sortable()
                    ->width(50),
                TextColumn::make('titre')
                    ->label('Titre')
                    ->searchable()
                    ->limit(50),
                TextColumn::make('categorie')
                    ->label('Catégorie')
                    ->badge()
                    ->color(fn(string $state): string => match($state) {
                        'Inscriptions'   => 'info',
                        'Parcours'       => 'success',
                        'Village départ' => 'warning',
                        'Résultats'      => 'danger',
                        default          => 'gray',
                    }),
                TextColumn::make('date_label')
                    ->label('Date affichée')
                    ->placeholder('—'),
                TextColumn::make('published_at')
                    ->label('Publié le')
                    ->date('d/m/Y')
                    ->sortable()
                    ->placeholder('—'),
                IconColumn::make('visible')
                    ->label('Visible')
                    ->boolean(),
                TextColumn::make('updated_at')
                    ->label('Modifié')
                    ->since()
                    ->sortable(),
            ])
            ->defaultSort('ordre')
            ->reorderable('ordre')
            ->filters([
                TernaryFilter::make('visible')->label('Visible'),
            ])
            ->actions([EditAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListActualites::route('/'),
            'create' => Pages\CreateActualite::route('/create'),
            'edit'   => Pages\EditActualite::route('/{record}/edit'),
        ];
    }
}
