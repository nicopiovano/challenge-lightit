<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PatientCreateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'      => ['required', 'string', 'min:3',  'max:15'],
            'last_name' => ['required', 'string', 'min:2',  'max:30'],
            'email'     => ['required', 'email',  'min:5',  'max:25', 'unique:patients,email'],
            'phone'     => ['required', 'string', 'regex:/^\+\d{2,4}\d{6,12}$/'],
            'photo'     => ['required', 'file',   'mimes:jpg,jpeg,png,webp,gif,svg', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es requerido.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.min' => 'El nombre debe tener al menos 3 caracteres.',
            'name.max' => 'El nombre debe tener menos de 15 caracteres.',
            'last_name.required' => 'El apellido es requerido.',
            'last_name.string' => 'El apellido debe ser una cadena de texto.',
            'last_name.min' => 'El apellido debe tener al menos 2 caracteres.',
            'last_name.max' => 'El apellido debe tener menos de 30 caracteres.',
            'email.required' => 'El email es requerido.',
            'email.email' => 'El email debe ser una dirección de email válida.',
            'email.unique' => 'El email ya está en uso. Elija otro.',
            'email.min' => 'El email debe tener al menos 5 caracteres.',
            'email.max' => 'El email debe tener menos de 25 caracteres.',
            'phone.required' => 'El teléfono es requerido.',
            'phone.string' => 'El teléfono debe ser una cadena de texto.',
            'phone.regex' => 'El teléfono debe ser un número de teléfono válido.',
            'photo.required' => 'La imagen es requerida.',
            'photo.file' => 'La imagen debe ser un archivo.',
            'photo.mimes' => 'La imagen debe ser un archivo de imagen válido.',
            'photo.uploaded' => 'La imagen es muy pesada. Debe ser menor a 2MB.',
            'photo.max'      => 'La imagen es muy pesada. Debe ser menor a 2MB.',
        ];
    }
}

