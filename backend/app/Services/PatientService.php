<?php

namespace App\Services;

use App\Models\Patient;
use App\Repositories\PatientRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
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

        Log::info("Fake email: sending patient welcome email to {$patient->email}");
        // TODO: future SMS sending (not implemented for this challenge).

        return $patient;
    }
}

