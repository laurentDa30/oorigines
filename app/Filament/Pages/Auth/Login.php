<?php

namespace App\Filament\Pages\Auth;

use Filament\Pages\Auth\Login as BaseLogin;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\HtmlString;

class Login extends BaseLogin
{
    public function getSubheading(): string|Htmlable|null
    {
        return new HtmlString(
            '<div style="
                margin-top: 1rem;
                padding: 0.75rem 1rem;
                background: oklch(96% 0.02 75);
                border: 1px solid oklch(80% 0.06 75);
                border-radius: 6px;
                font-size: 0.8rem;
                color: oklch(40% 0.06 38);
                line-height: 1.6;
            ">
                <div style="font-weight:600; margin-bottom:4px; letter-spacing:.05em; text-transform:uppercase; font-size:.7rem; color:oklch(50% 0.1 38);">
                    Identifiants de connexion
                </div>
                <div>Email&nbsp;: <code style="background:white;padding:1px 5px;border-radius:3px;border:1px solid #ddd;">admin@admin.fr</code></div>
                <div style="margin-top:2px;">Mot de passe&nbsp;: <code style="background:white;padding:1px 5px;border-radius:3px;border:1px solid #ddd;">origines2027!</code></div>
            </div>'
        );
    }
}
