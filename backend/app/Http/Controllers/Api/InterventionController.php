<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InterventionRequest;
use App\Http\Resources\InterventionResource;
use App\Models\Intervention;
use Illuminate\Http\JsonResponse;

class InterventionController extends Controller
{
    /**
     * Liste des interventions.
     */
    public function index()
    {
        $interventions = Intervention::with([
            'projet',
            'technicien',
        ])
            ->latest('date')
            ->paginate(15);

        return InterventionResource::collection($interventions);
    }

    /**
     * Créer une intervention.
     */
    public function store(
        InterventionRequest $request
    ): JsonResponse {
        $intervention = Intervention::create(
            $request->validated()
        );

        $intervention->load([
            'projet',
            'technicien',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Intervention créée avec succès.',
            'data' => new InterventionResource($intervention),
        ], 201);
    }

    /**
     * Afficher une intervention.
     */
    public function show(
        Intervention $intervention
    ): JsonResponse {
        $intervention->load([
            'projet',
            'technicien',
        ]);

        return response()->json([
            'success' => true,
            'data' => new InterventionResource($intervention),
        ]);
    }

    /**
     * Modifier une intervention.
     */
    public function update(
        InterventionRequest $request,
        Intervention $intervention
    ): JsonResponse {
        $intervention->update(
            $request->validated()
        );

        $intervention->load([
            'projet',
            'technicien',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Intervention modifiée avec succès.',
            'data' => new InterventionResource(
                $intervention->fresh()
            ),
        ]);
    }

    /**
     * Supprimer une intervention.
     */
    public function destroy(
        Intervention $intervention
    ): JsonResponse {
        $intervention->delete();

        return response()->json([
            'success' => true,
            'message' => 'Intervention supprimée avec succès.',
        ]);
    }

}