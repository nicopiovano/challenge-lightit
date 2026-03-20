<?php

namespace Tests\Feature;

use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PatientTest extends TestCase
{
    use RefreshDatabase;

    /** Crea un PNG real de 1x1px sin depender de la extensión GD. */
    private function fakeImage(string $filename = 'photo.png'): UploadedFile
    {
        $content = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        $path = sys_get_temp_dir() . '/' . $filename;
        file_put_contents($path, $content);
        return new UploadedFile($path, $filename, 'image/png', null, true);
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name'      => 'Juan',
            'last_name' => 'Pérez',
            'email'     => 'juan@example.com',
            'phone'     => '+541112345678',
            'photo'     => $this->fakeImage(),
        ], $overrides);
    }

    // --- GET /api/patients ---

    public function test_lista_pacientes_vacia(): void
    {
        $this->getJson('/api/patients')
            ->assertOk()
            ->assertJson(['data' => []]);
    }

    public function test_lista_pacientes_con_registros(): void
    {
        Patient::create([
            'name'      => 'Ana',
            'last_name' => 'García',
            'email'     => 'ana@example.com',
            'phone'     => '+541198765432',
            'photo'     => '/storage/patient-photos/test.jpg',
        ]);

        $this->getJson('/api/patients')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    // --- POST /api/patients ---

    public function test_crea_paciente_correctamente(): void
    {
        Storage::fake('public');

        $this->postJson('/api/patients', $this->validPayload())
            ->assertCreated()
            ->assertJsonStructure(['message', 'data' => ['id', 'name', 'last_name', 'email', 'phone', 'photo']]);

        $this->assertDatabaseHas('patients', ['email' => 'juan@example.com']);
    }

    public function test_falla_si_faltan_campos_requeridos(): void
    {
        $this->postJson('/api/patients', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'last_name', 'email', 'phone', 'photo']);
    }

    public function test_falla_si_email_invalido(): void
    {
        $this->postJson('/api/patients', $this->validPayload(['email' => 'no-es-email']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_falla_si_email_duplicado(): void
    {
        Storage::fake('public');

        $this->postJson('/api/patients', $this->validPayload())->assertCreated();

        $this->postJson('/api/patients', $this->validPayload([
            'photo' => $this->fakeImage('photo2.png'),
        ]))->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_falla_si_foto_no_es_imagen(): void
    {
        $this->postJson('/api/patients', $this->validPayload([
            'photo' => UploadedFile::fake()->create('doc.pdf', 100, 'application/pdf'),
        ]))->assertUnprocessable()
            ->assertJsonValidationErrors(['photo']);
    }
}
