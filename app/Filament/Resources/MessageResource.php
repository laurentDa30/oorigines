<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MessageResource\Pages;
use App\Models\Message;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class MessageResource extends Resource
{
    protected static ?string $model = Message::class;
    protected static ?string $navigationIcon = 'heroicon-o-envelope';
    protected static ?string $navigationLabel = 'Messages';
    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form { return $form->schema([]); }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            Infolists\Components\TextEntry::make('nom'),
            Infolists\Components\TextEntry::make('email'),
            Infolists\Components\TextEntry::make('sujet'),
            Infolists\Components\TextEntry::make('objet'),
            Infolists\Components\TextEntry::make('message')->columnSpanFull(),
            Infolists\Components\TextEntry::make('created_at')->label('Reçu le')->dateTime('d/m/Y à H:i'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nom')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('email')->searchable(),
                Tables\Columns\TextColumn::make('sujet')->badge(),
                Tables\Columns\TextColumn::make('objet')->limit(40),
                Tables\Columns\IconColumn::make('lu')->boolean()->label('Lu'),
                Tables\Columns\TextColumn::make('created_at')->label('Date')->dateTime('d/m/Y H:i')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\Action::make('marquer_lu')
                    ->label('Marquer lu')
                    ->icon('heroicon-o-check')
                    ->action(fn (Message $record) => $record->update(['lu' => true]))
                    ->visible(fn (Message $record) => !$record->lu),
            ])
            ->bulkActions([Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMessages::route('/'),
            'view'  => Pages\ViewMessage::route('/{record}'),
        ];
    }
}
