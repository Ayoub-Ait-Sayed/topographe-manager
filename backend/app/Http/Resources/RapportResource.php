<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RapportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'projet_id' => $this->projet_id,

            'projet' => new ProjetResource(
                $this->whenLoaded('projet')
            ),

            'user_id' => $this->user_id,

            'user' => $this->whenLoaded(
                'user',
                function () {
                    return [
                        'id' => $this->user->id,
                        'name' => $this->user->name,
                        'email' => $this->user->email,
                    ];
                }
            ),

            'titre' => $this->titre,
            'contenu' => $this->contenu,
            'fichier' => $this->fichier,
            'date' => $this->date,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}