<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjetRequest;
use App\Http\Resources\ProjetResource;
use App\Models\Projet;
use Illuminate\Http\JsonResponse;

class ProjetController extends Controller
{
    /**
     * Liste des projets.
     */
    public function index()
    {
        $projets = Projet::with('client')
            ->latest()
            ->paginate(15);

        return ProjetResource::collection($projets);
    }

    /**
     * Créer un projet.
     */
    public function store(ProjetRequest $request): JsonResponse
    {
        $projet = Projet::create($request->validated());

        $projet->load('client');

        return response()->json([
            'success' => true,
            'message' => 'Projet créé avec succès.',
            'data' => new ProjetResource($projet),
        ], 201);
    }

    /**
     * Afficher un projet.
     */
    public function show(Projet $projet): JsonResponse
    {
        $projet->load([
            'client',
            'missions',
            'interventions',
            'documents',
            'photos',
            'notes',
            'rapports',
            'devis',
            'factures',
        ]);

        return response()->json([
            'success' => true,
            'data' => new ProjetResource($projet),
        ]);
    }

    /**
     * Modifier un projet.
     */
    public function update(
        ProjetRequest $request,
        Projet $projet
    ): JsonResponse {
        $projet->update($request->validated());

        $projet->load('client');

        return response()->json([
            'success' => true,
            'message' => 'Projet modifié avec succès.',
            'data' => new ProjetResource($projet->fresh()),
        ]);
    }

    /**
     * Supprimer un projet.
     */
    public function destroy(Projet $projet): JsonResponse
    {
        $projet->delete();

        return response()->json([
            'success' => true,
            'message' => 'Projet supprimé avec succès.',
        ]);
    }
}

