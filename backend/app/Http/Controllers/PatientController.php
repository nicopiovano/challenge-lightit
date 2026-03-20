<?php

namespace App\Http\Controllers;

use App\Http\Requests\PatientCreateRequest;
use App\Http\Resources\PatientResource;
use App\Services\PatientService;
use Illuminate\Http\JsonResponse;

class PatientController extends Controller
{
    public function __construct(
        private PatientService $patientService,
    ) {
    }

    public function index(): JsonResponse
    {
        $patients = $this->patientService->listPatients();

        return response()->json([
            'data' => PatientResource::collection($patients)->resolve(),
        ]);
    }

    public function store(PatientCreateRequest $request): JsonResponse
    {
        $patient = $this->patientService->createPatient(
            $request->safe()->except('photo'),
            $request->file('photo'),
        );

        return response()->json([
            'message' => 'Paciente creado correctamente.',
            'data' => (new PatientResource($patient))->resolve(),
        ], 201);
    }
}
