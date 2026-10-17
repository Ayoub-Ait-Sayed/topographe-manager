<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FactureRequest extends FormRequest
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
                'max:100',
                Rule::unique('factures', 'numero')->ignore($this->facture),
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
                Rule::in([
                    'impayée',
                    'partiellement_payée',
                    'payée',
                    'annulée',
                ]),
            ],
        ];
    }
}