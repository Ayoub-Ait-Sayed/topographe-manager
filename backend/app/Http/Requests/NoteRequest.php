<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'projet_id' => [
                'required',
                'integer',
                'exists:projets,id',
            ],

            'contenu' => [
                'required',
                'string',
                'max:5000',
            ],
        ];
    }
}