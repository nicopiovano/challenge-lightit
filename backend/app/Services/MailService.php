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
            $apiKey = config('services.mailtrap.api_key');
            $isSandbox = (bool) config('services.mailtrap.use_sandbox', true);
            $inboxId = $isSandbox ? config('services.mailtrap.inbox_id') : null;

            if (empty($apiKey)) {
                Log::warning('Mailtrap API key is missing, welcome email was not sent.', [
                    'email' => $email,
                ]);
                return;
            }

            $mail = (new MailtrapEmail())
                ->from(new Address(config('mail.from.address'), config('mail.from.name')))
                ->to(new Address($email, "{$name} {$lastName}"))
                ->subject("Bienvenido/a {$name}")
                ->html(view('emails.welcome-patient', [
                    'name'     => $name,
                    'lastName' => $lastName,
                    'email'    => $email,
                ])->render());

            $response = MailtrapClient::initSendingEmails(
                apiKey: $apiKey,
                isSandbox: $isSandbox,
                inboxId: $inboxId !== null ? (int) $inboxId : null,
            )->send($mail);

            Log::info('Welcome email sent successfully', [
                'email' => $email,
                'status_code' => $response->getStatusCode(),
                'sandbox' => $isSandbox,
            ]);
        } catch (Throwable $e) {
            Log::warning('Failed to send welcome email', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
