<?php

namespace App\Repositories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Collection;

class PatientRepository
{
    public function all(): Collection
    {
        return Patient::all();
    }

    public function create(array $data): Patient
    {
        return Patient::create($data);
    }
}

