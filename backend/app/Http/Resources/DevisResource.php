<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DevisResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'numero' => $this->numero,

            'client_id' => $this->client_id,

            'client' => $this->client
                ? [
                    'id' => $this->client->id,
                    'nom' => $this->client->nom,
                    'entreprise' => $this->client->entreprise,
                    'telephone' => $this->client->telephone,
                    'email' => $this->client->email,
                    'adresse' => $this->client->adresse,
                    'ville' => $this->client->ville,
                ]
                : null,

            'projet_id' => $this->projet_id,

            'projet' => $this->projet
                ? [
                    'id' => $this->projet->id,
                    'reference' => $this->projet->reference,
                    'nom' => $this->projet->nom,
                    'description' => $this->projet->description,
                    'type_mission' => $this->projet->type_mission,
                    'adresse' => $this->projet->adresse,
                    'ville' => $this->projet->ville,
                    'latitude' => $this->projet->latitude,
                    'longitude' => $this->projet->longitude,
                    'date_debut' => $this->projet->date_debut,
                    'date_fin' => $this->projet->date_fin,
                    'statut' => $this->projet->statut,
                    'montant' => $this->projet->montant,
                ]
                : null,

            'date' => $this->date
                ? $this->date->format('Y-m-d')
                : null,

            'validite' => $this->validite
                ? $this->validite->format('Y-m-d')
                : null,

            'montant_ht' => $this->montant_ht,

            'tva' => $this->tva,

            'montant_ttc' => $this->montant_ttc,

            'statut' => $this->statut,

            'items' => $this->items
                ? $this->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'devis_id' => $item->devis_id,
                        'description' => $item->description,
                        'quantite' => $item->quantite,
                        'prix_unitaire' => $item->prix_unitaire,
                        'total' => $item->total,
                    ];
                })->values()
                : [],

            'created_at' => $this->created_at
                ? $this->created_at->toISOString()
                : null,

            'updated_at' => $this->updated_at
                ? $this->updated_at->toISOString()
                : null,
        ];
    }
}