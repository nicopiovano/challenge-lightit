<?php

namespace App\Services;

use App\Mail\WelcomePatientMail;
use App\Models\Patient;
use App\Repositories\PatientRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

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

    public function createPatient(array $data, UploadedFile $photoFile): Patient
    {
        $storedPath = $photoFile->store('patient-photos', 'public');
        $photoPath = Storage::url($storedPath); // /storage/patient-photos/...

        $patient = $this->patientRepository->create([
            ...$data,
            'photo' => $photoPath,
        ]);

        Mail::to($patient->email)->queue(new WelcomePatientMail($patient));
        // SMS::to($patient->phone)->queue(new WelcomePatientSms($patient)); Proximamente.

        return $patient;
    }
}

