<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PhotoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'projet_id' => $this->projet_id,

            'nom' => $this->nom,

            'chemin' => $this->chemin,

            'description' => $this->description,

            'url' => $this->chemin
                ? Storage::disk('public')->url($this->chemin)
                : null,

            'projet' => $this->whenLoaded(
                'projet',
                function () {
                    return [
                        'id' => $this->projet->id,
                        'nom' => $this->projet->nom,
                        'reference' => $this->projet->reference,
                    ];
                }
            ),

            'uploadedBy' => $this->whenLoaded(
                'uploadedBy',
                function () {
                    return [
                        'id' => $this->uploadedBy->id,
                        'name' => $this->uploadedBy->name,
                        'email' => $this->uploadedBy->email,
                    ];
                }
            ),

            // Pour compatibilité avec ton frontend actuel
            'uploader' => $this->whenLoaded(
                'uploadedBy',
                function () {
                    return [
                        'id' => $this->uploadedBy->id,
                        'name' => $this->uploadedBy->name,
                        'email' => $this->uploadedBy->email,
                    ];
                }
            ),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}