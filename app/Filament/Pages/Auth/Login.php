<?php

namespace App\Filament\Pages\Auth;

use Filament\Notifications\Notification;
use Filament\Pages\Auth\Login as BaseLogin;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Filament\Http\Responses\Auth\Contracts\LoginResponse;
use Filament\Facades\Filament;
use Filament\Models\Contracts\FilamentUser;
use DanHarrin\LivewireRateLimiting\Exceptions\TooManyRequestsException;

class Login extends BaseLogin
{
    public function getSubheading(): string|Htmlable|null
    {
        return null;
    }

    public function authenticate(): ?LoginResponse
    {
        // Blocage : 5 tentatives max, puis 15 minutes d'attente
        try {
            $this->rateLimit(5);
        } catch (TooManyRequestsException $exception) {
            $this->alertAdminIfNeeded();

            Notification::make()
                ->title("Trop de tentatives — réessayez dans {$exception->minutesUntilAvailable} min")
                ->danger()
                ->send();

            return null;
        }

        $data = $this->form->getState();

        if (! Filament::auth()->attempt($this->getCredentialsFromFormData($data), $data['remember'] ?? false)) {
            $this->logFailedAttempt($data['email'] ?? '');
            $this->throwFailureValidationException();
        }

        $user = Filament::auth()->user();

        if (($user instanceof FilamentUser) && ! $user->canAccessPanel(Filament::getCurrentPanel())) {
            Filament::auth()->logout();
            $this->throwFailureValidationException();
        }

        session()->regenerate();

        return app(LoginResponse::class);
    }

    private function logFailedAttempt(string $email): void
    {
        $ip      = request()->ip();
        $key     = 'admin-login-failures:'.$ip;
        $count   = RateLimiter::attempts($key) + 1;

        RateLimiter::hit($key, 3600); // compte les échecs sur 1h

        Log::warning("Admin login failed — IP: {$ip} | email: {$email} | attempt #{$count}");

        // Alerte email à partir du 3e échec sur la même IP
        if ($count === 3) {
            $this->sendAlertEmail($ip, $email, $count);
        }
    }

    private function alertAdminIfNeeded(): void
    {
        $ip  = request()->ip();
        $key = 'admin-login-alert-sent:'.$ip;

        if (RateLimiter::tooManyAttempts($key, 1)) {
            return; // alerte déjà envoyée pour cette IP
        }

        RateLimiter::hit($key, 3600);
        $this->sendAlertEmail($ip, 'inconnue (bloquée)', 5);
    }

    private function sendAlertEmail(string $ip, string $email, int $count): void
    {
        $adminEmail = config('mail.from.address');
        if (! $adminEmail) {
            return;
        }

        try {
            Mail::raw(
                "⚠️ Tentatives de connexion suspectes sur l'administration d'Aux õrigines.\n\n"
                ."IP : {$ip}\n"
                ."Email essayé : {$email}\n"
                ."Nombre de tentatives : {$count}\n"
                ."Date : ".now()->format('d/m/Y H:i:s')."\n\n"
                ."Si ce n'est pas vous, changez votre mot de passe immédiatement.",
                fn ($message) => $message
                    ->to($adminEmail)
                    ->subject('[Aux õrigines] ⚠️ Tentatives de connexion suspectes')
            );
        } catch (\Exception $e) {
            Log::error('Admin alert email failed: '.$e->getMessage());
        }
    }
}
