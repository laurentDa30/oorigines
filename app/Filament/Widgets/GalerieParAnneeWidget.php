<?php

namespace App\Filament\Widgets;

use App\Models\Galerie;
use Filament\Widgets\Widget;

class GalerieParAnneeWidget extends Widget
{
    protected static ?int $sort = 2;
    protected static string $view = 'filament.widgets.galerie-par-annee';
    protected int | string | array $columnSpan = 'full';

    public function getViewData(): array
    {
        $rows = Galerie::query()
            ->selectRaw('annee, type, COUNT(*) as total')
            ->whereNotNull('annee')
            ->groupBy('annee', 'type')
            ->orderByDesc('annee')
            ->orderBy('type')
            ->get();

        // Regroupe par année → ['2026' => ['Photo' => 3, 'Video' => 1], ...]
        $byYear = [];
        foreach ($rows as $row) {
            $byYear[$row->annee][$row->type] = $row->total;
        }

        return ['byYear' => $byYear];
    }
}
