<?php

namespace App\Filament\Resources\CourseResource\Pages;

use App\Filament\Resources\CourseResource;
use Filament\Actions;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;

class EditCourse extends EditRecord
{
    protected static string $resource = CourseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('importGpx')
                ->label('Importer GPX')
                ->icon('heroicon-o-arrow-up-tray')
                ->color('info')
                ->modalHeading('Importer le profil depuis un fichier GPX')
                ->modalDescription('Export Strava ou tout fichier GPX contenant des points de trace. Le profil d\'altitude sera calculé automatiquement.')
                ->modalSubmitActionLabel('Importer')
                ->form([
                    Forms\Components\FileUpload::make('gpx_file')
                        ->label('Fichier GPX')
                        ->acceptedFileTypes([
                            'application/gpx+xml',
                            'application/xml',
                            'text/xml',
                            'application/octet-stream',
                        ])
                        ->disk('local')
                        ->directory('gpx-temp')
                        ->required(),
                ])
                ->action(function (array $data): void {
                    $path = Storage::disk('local')->path($data['gpx_file']);

                    try {
                        $xml = @simplexml_load_file($path);

                        if ($xml === false) {
                            Notification::make()->title('Fichier GPX invalide')->danger()->send();
                            return;
                        }

                        // Collect trackpoints across all segments
                        $rawPoints = [];
                        foreach ($xml->trk as $trk) {
                            foreach ($trk->trkseg as $seg) {
                                foreach ($seg->trkpt as $pt) {
                                    $lat = (float) $pt['lat'];
                                    $lon = (float) $pt['lon'];
                                    $ele = isset($pt->ele) ? (float) $pt->ele : null;
                                    $rawPoints[] = [$lat, $lon, $ele];
                                }
                            }
                        }

                        if (empty($rawPoints)) {
                            Notification::make()
                                ->title('Aucun point trouvé dans le GPX')
                                ->body('Le fichier ne contient pas de trace (<trkpt>).')
                                ->danger()
                                ->send();
                            return;
                        }

                        // Build [cumDist, ele] pairs
                        $distEle    = [];
                        $cumDist    = 0.0;
                        $prevLat    = null;
                        $prevLon    = null;
                        $hasEle     = false;

                        foreach ($rawPoints as [$lat, $lon, $ele]) {
                            if ($prevLat !== null) {
                                $cumDist += $this->haversine($prevLat, $prevLon, $lat, $lon);
                            }
                            if ($ele !== null && $ele > 0) $hasEle = true;
                            $distEle[] = [$cumDist, $ele ?? 0];
                            $prevLat   = $lat;
                            $prevLon   = $lon;
                        }

                        // Downsample to 80 points
                        $simplified = $this->downsample($distEle, 80);

                        // Normalize elevation: subtract min so profile starts near 0
                        $minEle     = min(array_column($simplified, 1));
                        $simplified = array_map(
                            fn($p) => [round($p[0]), (int) round($p[1] - $minEle)],
                            $simplified
                        );

                        $this->record->update(['profil' => $simplified]);

                        $totalKm = round($cumDist / 1000, 1);
                        $dPlus   = $hasEle ? max(array_column($simplified, 1)).'m' : 'non disponible';

                        Notification::make()
                            ->title('Profil importé avec succès')
                            ->body("{$totalKm} km · D+ {$dPlus} · ".count($simplified).' points')
                            ->success()
                            ->send();

                    } finally {
                        Storage::disk('local')->delete($data['gpx_file']);
                    }
                }),

            Actions\DeleteAction::make(),
        ];
    }

    private function haversine(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $R    = 6371000;
        $phi1 = deg2rad($lat1);
        $phi2 = deg2rad($lat2);
        $dphi = deg2rad($lat2 - $lat1);
        $dlam = deg2rad($lon2 - $lon1);
        $a    = sin($dphi / 2) ** 2 + cos($phi1) * cos($phi2) * sin($dlam / 2) ** 2;
        return $R * 2 * atan2(sqrt($a), sqrt(1 - $a));
    }

    private function downsample(array $points, int $target): array
    {
        $n = count($points);
        if ($n <= $target) return $points;
        $step   = ($n - 1) / ($target - 1);
        $result = [];
        for ($i = 0; $i < $target; $i++) {
            $result[] = $points[(int) round($i * $step)];
        }
        return $result;
    }
}
