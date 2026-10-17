<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'projet_id' => $this->projet_id,

            'nom' => $this->nom,

            'description' => $this->description,

            'fichier' => $this->fichier,

            'url' => $this->fichier
                ? asset('storage/' . $this->fichier)
                : null,

            'type' => $this->type,

            'taille' => $this->taille,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'projet' => $this->whenLoaded('projet'),
        ];
    }
}