<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reference' => [
                'required',
                'string',
                'max:100',
                Rule::unique('projets', 'reference')->ignore($this->projet),
            ],

            'nom' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'client_id' => [
                'required',
                'integer',
                'exists:clients,id',
            ],

            'type_mission' => [
                'required',
                'string',
                'max:255',
            ],

            'adresse' => [
                'nullable',
                'string',
                'max:500',
            ],

            'ville' => [
                'nullable',
                'string',
                'max:100',
            ],

            'latitude' => [
                'nullable',
                'numeric',
                'between:-90,90',
            ],

            'longitude' => [
                'nullable',
                'numeric',
                'between:-180,180',
            ],

            'date_debut' => [
                'nullable',
                'date',
            ],

            'date_fin' => [
                'nullable',
                'date',
                'after_or_equal:date_debut',
            ],

            'statut' => [
                'required',
                Rule::in([
                    'en_attente',
                    'en_cours',
                    'termine',
                    'annule',
                ]),
            ],

            'montant' => [
                'nullable',
                'numeric',
                'min:0',
            ],
        ];
    }
}