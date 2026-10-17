<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RapportRequest extends FormRequest
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

            'contenu' => [
                'required',
                'string',
            ],

            'fichier' => [
                'nullable',
                'file',
                'mimes:pdf,doc,docx,xls,xlsx',
                'max:10240',
            ],

            'date' => [
                'required',
                'date',
            ],
        ];
    }
}