<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaiementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'facture_id' => $this->facture_id,

            'facture' => new FactureResource(
                $this->whenLoaded('facture')
            ),

            'montant' => $this->montant,
            'date' => $this->date,
            'mode_paiement' => $this->mode_paiement,
            'reference' => $this->reference,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}