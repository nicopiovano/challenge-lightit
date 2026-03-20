<?php

namespace App\Services;

use App\Mail\WelcomePatientMail;
use App\Repositories\PatientRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Throwable;

class PatientService
{
    public function __construct(
        private readonly PatientRepository $patientRepository,
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

        Mail::to($patient->email)->queue(new WelcomePatientMail($patient));
        // SMS::to($patient->phone)->queue(new WelcomePatientSms($patient)); Proximamente.
    }
}

