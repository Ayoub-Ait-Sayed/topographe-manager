<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DevisRequest;
use App\Http\Resources\DevisResource;
use App\Models\Devis;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DevisController extends Controller
{
    /**
     * Liste des devis.
     */
    public function index()
    {
        $devis = Devis::with([
            'client',
            'projet',
            'items',
        ])
            ->latest('date')
            ->paginate(15);

        return DevisResource::collection($devis);
    }

    /**
     * Créer un devis.
     */
    public function store(DevisRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $items = $validated['items'];

        unset($validated['items']);

        $devis = DB::transaction(function () use ($validated, $items) {

            $devis = Devis::create($validated);

            foreach ($items as $item) {

                $devis->items()->create([
                    'description' => $item['description'],
                    'quantite' => $item['quantite'],
                    'prix_unitaire' => $item['prix_unitaire'],
                    'total' => $item['total'],
                ]);
            }

            return $devis;
        });

        $devis->load([
            'client',
            'projet',
            'items',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Devis créé avec succès.',
            'data' => new DevisResource($devis),
        ], 201);
    }

    /**
     * Afficher un devis.
     */
  
    public function show($id): DevisResource
{
    $devis = Devis::with(['client', 'projet', 'items'])->findOrFail($id);

    return new DevisResource($devis);
}

    /**
     * Modifier un devis.
     */
    public function update(
        DevisRequest $request,
        Devis $devis
    ): JsonResponse {

        $validated = $request->validated();

        $items = $validated['items'];

        unset($validated['items']);

        DB::transaction(function () use (
            $validated,
            $items,
            $devis
        ) {

            $devis->update($validated);

            $devis->items()->delete();

            foreach ($items as $item) {

                $devis->items()->create([
                    'description' => $item['description'],
                    'quantite' => $item['quantite'],
                    'prix_unitaire' => $item['prix_unitaire'],
                    'total' => $item['total'],
                ]);
            }
        });

        $devis->load([
            'client',
            'projet',
            'items',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Devis modifié avec succès.',
            'data' => new DevisResource($devis),
        ]);
    }

    /**
     * Supprimer un devis.
     */
    public function destroy(Devis $devis): JsonResponse
    {
        $devis->delete();

        return response()->json([
            'success' => true,
            'message' => 'Devis supprimé avec succès.',
        ]);
    }
}