<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FactureResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero' => $this->numero,

            'client_id' => $this->client_id,
            'client' => new ClientResource(
                $this->whenLoaded('client')
            ),

            'projet_id' => $this->projet_id,
            'projet' => new ProjetResource(
                $this->whenLoaded('projet')
            ),

            'date' => $this->date,

            'montant_ht' => $this->montant_ht,
            'tva' => $this->tva,
            'montant_ttc' => $this->montant_ttc,

            'statut' => $this->statut,

            'items' => $this->whenLoaded('items'),
            'paiements' => $this->whenLoaded('paiements'),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}