<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Mailtrap\MailtrapClient;
use Mailtrap\Mime\MailtrapEmail;
use Symfony\Component\Mime\Address;
use Throwable;

class MailService
{
    public function sendWelcomePatientMail(string $email, string $name, string $lastName): void
    {
        try {
            $mail = (new MailtrapEmail())
                ->from(new Address(config('mail.from.address'), config('mail.from.name')))
                ->to(new Address($email, "{$name} {$lastName}"))
                ->subject("Bienvenido/a {$name}")
                ->html(view('emails.welcome-patient', [
                    'name'      => $name,
                    'lastName'  => $lastName,
                    'email'     => $email,
                ])->render());

            MailtrapClient::initSendingEmails(
                apiKey: config('services.mailtrap-sdk.apiKey'),
            )->send($mail);
        } catch (Throwable $e) {
            Log::warning('Failed to send welcome email', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
