<x-filament-widgets::widget>
    <a href="{{ route('filament.admin.resources.messages.index') }}"
       class="block w-full rounded-xl border border-warning-300 bg-warning-50 px-5 py-4 shadow-sm hover:bg-warning-100 transition-colors dark:border-warning-700 dark:bg-warning-950/40 dark:hover:bg-warning-950/60">
        <div class="flex items-center gap-3">
            <x-heroicon-o-envelope class="h-6 w-6 flex-shrink-0 text-warning-600 dark:text-warning-400" style="margin-left:0.75rem" />
            <p class="text-sm font-semibold text-warning-800 dark:text-warning-300">
                Vous avez
                <span class="inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-warning">
                    {{ $count }}
                </span>
                {{ Str::plural('message', $count) }} non {{ $count > 1 ? 'lus' : 'lu' }} - cliquez pour les consulter.
            </p>
        </div>
    </a>
</x-filament-widgets::widget>
