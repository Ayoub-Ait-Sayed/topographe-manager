<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DevisRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'numero' => [
                'required',
                'string',
                'max:255',
            ],

            'client_id' => [
                'required',
                'integer',
                'exists:clients,id',
            ],

            'projet_id' => [
                'nullable',
                'integer',
                'exists:projets,id',
            ],

            'date' => [
                'required',
                'date',
            ],

            'validite' => [
                'required',
                'date',
                'after_or_equal:date',
            ],

            'montant_ht' => [
                'required',
                'numeric',
                'min:0',
            ],

            'tva' => [
                'required',
                'numeric',
                'min:0',
            ],

            'montant_ttc' => [
                'required',
                'numeric',
                'min:0',
            ],

            'statut' => [
                'required',
                'string',
                Rule::in([
                    'brouillon',
                    'envoyé',
                    'accepté',
                    'refusé',
                    'expiré',
                ]),
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.description' => [
                'required',
                'string',
                'max:255',
            ],

            'items.*.quantite' => [
                'required',
                'numeric',
                'min:0.01',
            ],

            'items.*.prix_unitaire' => [
                'required',
                'numeric',
                'min:0',
            ],

            'items.*.total' => [
                'required',
                'numeric',
                'min:0',
            ],
        ];
    }
}