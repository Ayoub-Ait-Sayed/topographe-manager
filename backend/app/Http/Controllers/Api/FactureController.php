<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FactureRequest;
use App\Http\Resources\FactureResource;
use App\Models\Facture;
use Illuminate\Http\JsonResponse;

class FactureController extends Controller
{
    /**
     * Liste des factures.
     */
    public function index()
    {
        $factures = Facture::with([
            'client',
            'projet',
            'items',
            'paiements',
        ])
            ->latest('date')
            ->paginate(15);

        return FactureResource::collection($factures);
    }

    /**
     * Créer une facture.
     */
    public function store(
        FactureRequest $request
    ): JsonResponse {
        $facture = Facture::create(
            $request->validated()
        );

        $facture->load([
            'client',
            'projet',
            'items',
            'paiements',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Facture créée avec succès.',
            'data' => new FactureResource($facture),
        ], 201);
    }

    /**
     * Afficher une facture.
     */
    public function show(
        Facture $facture
    ): JsonResponse {
        $facture->load([
            'client',
            'projet',
            'items',
            'paiements',
        ]);

        return response()->json([
            'success' => true,
            'data' => new FactureResource($facture),
        ]);
    }

    /**
     * Modifier une facture.
     */
    public function update(
        FactureRequest $request,
        Facture $facture
    ): JsonResponse {
        $facture->update(
            $request->validated()
        );

        $facture->load([
            'client',
            'projet',
            'items',
            'paiements',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Facture modifiée avec succès.',
            'data' => new FactureResource(
                $facture->fresh()
            ),
        ]);
    }

    /**
     * Supprimer une facture.
     */
    public function destroy(
        Facture $facture
    ): JsonResponse {
        $facture->delete();

        return response()->json([
            'success' => true,
            'message' => 'Facture supprimée avec succès.',
        ]);
    }

}