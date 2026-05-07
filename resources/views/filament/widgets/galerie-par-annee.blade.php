<x-filament-widgets::widget>
    <x-filament::section heading="Galerie — répartition par année" icon="heroicon-o-photo">
        @if(empty($byYear))
            <p class="text-sm text-gray-500 dark:text-gray-400">Aucune entrée dans la galerie pour le moment.</p>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-200 dark:border-gray-700">
                            <th class="py-2 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">Année</th>
                            <th class="py-2 px-4 text-center font-semibold text-gray-600 dark:text-gray-300">
                                <span class="inline-flex items-center gap-1">
                                    <x-heroicon-o-photo class="w-4 h-4"/> Photos
                                </span>
                            </th>
                            <th class="py-2 px-4 text-center font-semibold text-gray-600 dark:text-gray-300">
                                <span class="inline-flex items-center gap-1">
                                    <x-heroicon-o-video-camera class="w-4 h-4"/> Vidéos
                                </span>
                            </th>
                            <th class="py-2 px-4 text-center font-semibold text-gray-600 dark:text-gray-300">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($byYear as $annee => $types)
                            @php
                                $photos = $types['Photo'] ?? 0;
                                $videos = $types['Video'] ?? 0;
                                $total  = $photos + $videos;
                            @endphp
                            <tr class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td class="py-3 px-4 font-bold text-gray-800 dark:text-gray-200">{{ $annee }}</td>
                                <td class="py-3 px-4 text-center">
                                    @if($photos > 0)
                                        <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {{ $photos }}
                                        </span>
                                    @else
                                        <span class="text-gray-400">—</span>
                                    @endif
                                </td>
                                <td class="py-3 px-4 text-center">
                                    @if($videos > 0)
                                        <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                            {{ $videos }}
                                        </span>
                                    @else
                                        <span class="text-gray-400">—</span>
                                    @endif
                                </td>
                                <td class="py-3 px-4 text-center font-semibold text-gray-700 dark:text-gray-300">{{ $total }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                    <tfoot>
                        <tr class="border-t-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
                            <td class="py-2 px-4 font-bold text-gray-700 dark:text-gray-300">Total</td>
                            <td class="py-2 px-4 text-center font-bold text-blue-700 dark:text-blue-300">
                                {{ collect($byYear)->sum('Photo') }}
                            </td>
                            <td class="py-2 px-4 text-center font-bold text-red-700 dark:text-red-300">
                                {{ collect($byYear)->sum('Video') }}
                            </td>
                            <td class="py-2 px-4 text-center font-bold text-gray-800 dark:text-gray-200">
                                {{ collect($byYear)->reduce(fn($carry, $types) => $carry + array_sum($types), 0) }}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        @endif
    </x-filament::section>
</x-filament-widgets::widget>
