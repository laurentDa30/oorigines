<?php

namespace App\Http\Controllers;

use App\Mail\ContactNotification;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'nom'     => 'required|string|max:100',
            'email'   => 'required|email|max:200',
            'sujet'   => 'required|string|max:50',
            'objet'   => 'required|string|max:200',
            'message' => 'required|string|max:2000',
        ]);

        Message::create($validated);

        try {
            Mail::to(config('mail.from.address'))
                ->send(new ContactNotification($validated));
        } catch (\Exception $e) {
            \Log::warning('Contact mail failed: ' . $e->getMessage());
        }

        return response()->json(['success' => true]);
    }
}
