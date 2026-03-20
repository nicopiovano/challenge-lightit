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
        // Usamos fotos que ya están cargadas en `storage/app/public/patient-photos`.
        $existingPhotos = Storage::disk('public')->files('patient-photos');
        $seedPhotoRelPath = $existingPhotos[array_rand($existingPhotos)] ?? null;
        $photoUrl = $seedPhotoRelPath ? Storage::url($seedPhotoRelPath) : '';

        return [
            'name' => 'Cosme',
            'last_name' => 'Fulanito',
            'email' => 'fulanito@gmail.com',
            'phone' => fake()->numerify('+54 9 ### ### ####'),
            'photo' => $photoUrl,
        ];
    }
}
