<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MissionRequest extends FormRequest
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

            'titre' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'date_debut' => [
                'required',
                'date',
            ],

            'date_fin' => [
                'nullable',
                'date',
                'after_or_equal:date_debut',
            ],

            'statut' => [
                'required',
                'string',
                Rule::in([
                    'en_attente',
                    'en_cours',
                    'termine',
                    'annule',
                ]),
            ],
        ];
    }
}