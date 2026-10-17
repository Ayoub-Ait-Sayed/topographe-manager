<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InterventionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'projet_id' => $this->projet_id,

            'projet' => new ProjetResource(
                $this->whenLoaded('projet')
            ),

            'technicien_id' => $this->technicien_id,

            'technicien' => $this->whenLoaded(
                'technicien',
                function () {
                    return [
                        'id' => $this->technicien->id,
                        'name' => $this->technicien->name,
                        'email' => $this->technicien->email,
                    ];
                }
            ),

            'date' => $this->date,
            'heure_debut' => $this->heure_debut,
            'heure_fin' => $this->heure_fin,
            'description' => $this->description,
            'statut' => $this->statut,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}