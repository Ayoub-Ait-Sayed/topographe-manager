<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaiementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'facture_id' => [
                'required',
                'integer',
                'exists:factures,id',
            ],

            'montant' => [
                'required',
                'numeric',
                'min:0.01',
            ],

            'date' => [
                'required',
                'date',
            ],

            'mode_paiement' => [
                'required',
                Rule::in([
                    'especes',
                    'virement',
                    'cheque',
                    'carte',
                ]),
            ],

            'reference' => [
                'nullable',
                'string',
                'max:255',
            ],
        ];
    }
}