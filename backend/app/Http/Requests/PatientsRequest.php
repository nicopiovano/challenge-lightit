<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PatientsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:patients,email'],
            'phone' => ['required', 'string', 'regex:/^\+\d{2,4}\d+$/'],
            'photo' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,gif,svg', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'photo.uploaded' => 'La imagen es muy pesada. Debe ser menor a 2MB.',
            'photo.max'      => 'La imagen es muy pesada. Debe ser menor a 2MB.',
        ];
    }
}

