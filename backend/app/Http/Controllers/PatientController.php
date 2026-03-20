<?php

namespace App\Http\Controllers;

use App\Http\Requests\PatientsRequest;
use App\Http\Resources\PatientResource;
use App\Services\PatientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Throwable;

class PatientController extends Controller
{
    public function __construct(
        private PatientService $patientService,
    ) {
    }

    public function index(): JsonResponse
    {
        // try catch no necesario, laravel entrega 500 sin informacion sensible pq no hay logica extra.
        $patients = $this->patientService->listPatients();

        return response()->json([
            'data' => PatientResource::collection($patients)->resolve(),
        ]);
    }

    public function store(PatientsRequest $request): JsonResponse
    {
        // try catch necesario, involucra DB y Disco -> mensaje controlado.
        try {

            $photoFile = $request->file('photo');
            $validated = $request->safe()->except('photo');

            $patient = $this->patientService->createPatient($validated, $photoFile);

            return response()->json([
                'message' => 'Paciente creado correctamente.',
                'data' => (new PatientResource($patient))->resolve(),
            ], 201);
        } catch (Throwable $e) {
            Log::error('Patient store failed', [
                'exception' => $e::class,
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Error al crear el paciente.',
            ], 500);
        }
    }
}

