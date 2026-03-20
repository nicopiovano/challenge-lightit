<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

/**
 * @extends Factory<Patient>
 */
class PatientFactory extends Factory
{
    public function definition(): array
    {
        $seedImage = database_path('seeders/images/patient.png');
        $filename  = 'patient-photos/seed-patient.png';

        if (!Storage::disk('public')->exists($filename)) {
            Storage::disk('public')->put($filename, file_get_contents($seedImage));
        }

        return [
            'name'      => 'Cosme',
            'last_name' => 'Fulanito',
            'email'     => fake()->unique()->safeEmail(),
            'phone'     => fake()->numerify('+54911########'),
            'photo'     => Storage::url($filename),
        ];
    }
}
