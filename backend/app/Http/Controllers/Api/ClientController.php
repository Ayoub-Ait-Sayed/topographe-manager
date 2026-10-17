<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\JsonResponse;

class ClientController extends Controller
{
    /**
     * Liste des clients.
     */
    public function index(): JsonResponse
    {
        $clients = Client::latest()->get();

        return response()->json([
            'success' => true,
            'data' => ClientResource::collection($clients),
            'message' => 'Liste des clients récupérée avec succès.',
        ]);
    }

    /**
     * Créer un client.
     */
    public function store(ClientRequest $request): JsonResponse
    {
        $client = Client::create($request->validated());

        return response()->json([
            'success' => true,
            'data' => new ClientResource($client),
            'message' => 'Client créé avec succès.',
        ], 201);
    }

    /**
     * Afficher un client avec toutes ses données.
     */
    public function show($id): JsonResponse
    {
        $client = Client::with([
            'projets.missions',
            'projets.interventions',
            'projets.rapports',
            'projets.documents',
            'projets.photos',
            'projets.notes',
            'devis',
            'factures',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new ClientResource($client),
            'message' => 'Client récupéré avec succès.',
        ]);
    }

    /**
     * Modifier un client.
     */
    public function update(ClientRequest $request, $id): JsonResponse
    {
        $client = Client::findOrFail($id);

        $client->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => new ClientResource($client->fresh()),
            'message' => 'Client modifié avec succès.',
        ]);
    }

    /**
     * Supprimer un client.
     */
    public function destroy($id): JsonResponse
    {
        $client = Client::findOrFail($id);

        $client->delete();

        return response()->json([
            'success' => true,
            'message' => 'Client supprimé avec succès.',
        ]);
    }
}