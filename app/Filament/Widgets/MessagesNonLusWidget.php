<?php

namespace App\Filament\Widgets;

use App\Models\Message;
use Filament\Widgets\Widget;

class MessagesNonLusWidget extends Widget
{
    protected static ?int $sort = 0;

    protected static string $view = 'filament.widgets.messages-non-lus';

    protected int | string | array $columnSpan = 'full';

    public int $count = 0;

    public function mount(): void
    {
        $this->count = Message::where('lu', false)->count();
    }

    public static function canView(): bool
    {
        return Message::where('lu', false)->exists();
    }
}
