<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        // Nonce généré AVANT le rendu de la vue pour que le Blade puisse le poser
        // sur ses <script> inline ; le même nonce est ensuite injecté dans la CSP.
        $nonce = base64_encode(random_bytes(16));
        View::share('cspNonce', $nonce);

        $response = $next($request);

        $adminPath = config('app.admin_path');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        // Pas de CSP sur le panel admin (Filament/Livewire incompatible)
        if ($request->is($adminPath) || $request->is($adminPath.'/*')) {
            return $response;
        }

        $isLocal = app()->environment('local');
        // Les deux hôtes du serveur Vite (selon ce qui est écrit dans public/hot)
        // + le websocket HMR, qui relève de connect-src et n'est pas couvert
        // par l'origine http://.
        $vite    = $isLocal ? ' http://127.0.0.1:5173 http://localhost:5173' : '';
        $viteWs  = $isLocal ? ' ws://127.0.0.1:5173 ws://localhost:5173' : '';

        // En local, Vite HMR injecte des scripts inline non-nonce'd → on garde
        // 'unsafe-inline'. En production, on s'appuie uniquement sur le nonce
        // (les navigateurs ignorent 'unsafe-inline' dès qu'un nonce est présent).
        $scriptInline = $isLocal ? "'unsafe-inline' " : "'nonce-{$nonce}' ";

        $response->headers->set('Content-Security-Policy',
            "default-src 'self'; " .
            "script-src 'self' {$scriptInline}https://unpkg.com{$vite}; " .
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com{$vite}; " .
            "font-src 'self' https://fonts.gstatic.com{$vite}; " .
            "img-src 'self' data: blob: https:; " .
            "connect-src 'self'{$vite}{$viteWs}; " .
            "frame-src https://www.youtube-nocookie.com; " .
            "object-src 'none';"
        );

        return $response;
    }
}
