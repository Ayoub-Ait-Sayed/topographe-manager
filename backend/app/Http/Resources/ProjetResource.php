<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'nom' => $this->nom,
            'description' => $this->description,

            'client_id' => $this->client_id,

            'client' => new ClientResource(
                $this->whenLoaded('client')
            ),

            'type_mission' => $this->type_mission,
            'adresse' => $this->adresse,
            'ville' => $this->ville,

            'latitude' => $this->latitude,
            'longitude' => $this->longitude,

            'date_debut' => $this->date_debut,
            'date_fin' => $this->date_fin,

            'statut' => $this->statut,
            'montant' => $this->montant,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}