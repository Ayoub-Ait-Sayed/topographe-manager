<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InterventionRequest extends FormRequest
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

            'technicien_id' => [
                'required',
                'integer',
                'exists:users,id',
            ],

            'date' => [
                'required',
                'date',
            ],

            'heure_debut' => [
                'required',
                'date_format:H:i',
            ],

            'heure_fin' => [
                'nullable',
                'date_format:H:i',
                'after:heure_debut',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'statut' => [
                'required',
                Rule::in([
                    'planifiee',
                    'en_cours',
                    'terminee',
                    'annulee',
                ]),
            ],
        ];
    }
}