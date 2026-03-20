<?php

namespace App\Services;

use App\Repositories\PatientRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Throwable;
use App\Services\MailService;

class PatientService
{
    public function __construct(
        private readonly PatientRepository $patientRepository,
        private readonly MailService $mailService,
    ) {
    }

    public function listPatients()
    {
        return $this->patientRepository->all();
    }

    public function createPatient(array $data, UploadedFile $photoFile): void
    {
        $storedPath = $photoFile->store('patient-photos', 'public');

        try {
            $patient = $this->patientRepository->create([
                ...$data,
                'photo' => Storage::url($storedPath),
            ]);
        } catch (Throwable $e) {
            Storage::disk('public')->delete($storedPath);
            throw $e;
        }

        $this->mailService->sendWelcomePatientMail(
            $patient->email,
            $patient->name,
            $patient->last_name,
        );

        // SMS::to($patient->phone)->queue(new WelcomePatientSms($patient)); Proximamente.
    }
}
