<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaiementRequest;
use App\Http\Resources\PaiementResource;
use App\Models\Paiement;
use Illuminate\Http\JsonResponse;

class PaiementController extends Controller
{
    /**
     * Liste des paiements.
     */
    public function index()
    {
        $paiements = Paiement::with('facture')
            ->latest('date')
            ->paginate(15);

        return PaiementResource::collection($paiements);
    }

    /**
     * Créer un paiement.
     */
    public function store(
        PaiementRequest $request
    ): JsonResponse {
        $paiement = Paiement::create(
            $request->validated()
        );

        $paiement->load('facture');

        return response()->json([
            'success' => true,
            'message' => 'Paiement enregistré avec succès.',
            'data' => new PaiementResource($paiement),
        ], 201);
    }

    /**
     * Afficher un paiement.
     */
    public function show(
        Paiement $paiement
    ): JsonResponse {
        $paiement->load('facture');

        return response()->json([
            'success' => true,
            'data' => new PaiementResource($paiement),
        ]);
    }

    /**
     * Modifier un paiement.
     */
    public function update(
        PaiementRequest $request,
        Paiement $paiement
    ): JsonResponse {
        $paiement->update(
            $request->validated()
        );

        $paiement->load('facture');

        return response()->json([
            'success' => true,
            'message' => 'Paiement modifié avec succès.',
            'data' => new PaiementResource(
                $paiement->fresh()
            ),
        ]);
    }

    /**
     * Supprimer un paiement.
     */
    public function destroy(
        Paiement $paiement
    ): JsonResponse {
        $paiement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Paiement supprimé avec succès.',
        ]);
    }

}