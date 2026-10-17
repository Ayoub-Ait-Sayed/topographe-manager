<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'projet_id' => $this->projet_id,

            'user_id' => $this->user_id,

            'contenu' => $this->contenu,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'projet' => $this->whenLoaded('projet'),

            'user' => $this->whenLoaded('user'),
        ];
    }
}