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
            'photo.uploaded' => 'La imagen es muy pesada. Debe ser menor a 2MB.',
            'photo.max'      => 'La imagen es muy pesada. Debe ser menor a 2MB.',
        ];
    }
}

