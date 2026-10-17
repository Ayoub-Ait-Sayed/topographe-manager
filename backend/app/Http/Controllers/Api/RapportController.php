<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RapportRequest;
use App\Http\Resources\RapportResource;
use App\Models\Rapport;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class RapportController extends Controller
{
    /**
     * Liste des rapports
     */
    public function index()
    {
        $rapports = Rapport::with([
            'projet',
            'createur',
        ])
            ->latest('date')
            ->paginate(15);

        return RapportResource::collection($rapports);
    }

    /**
     * Créer un rapport
     */
    public function store(
        RapportRequest $request
    ): JsonResponse {
        $data = $request->validated();

        /*
        |--------------------------------------------------------------------------
        | Utilisateur connecté
        |--------------------------------------------------------------------------
        */

        $data['created_by'] = auth()->id();

        /*
        |--------------------------------------------------------------------------
        | Upload du fichier
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('fichier')) {
            $data['fichier'] = $request
                ->file('fichier')
                ->store('rapports', 'public');
        }

        /*
        |--------------------------------------------------------------------------
        | Création
        |--------------------------------------------------------------------------
        */

        $rapport = Rapport::create($data);

        $rapport->load([
            'projet',
            'createur',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Rapport créé avec succès.',
            'data' => new RapportResource($rapport),
        ], 201);
    }

    /**
     * Afficher un rapport
     */
    public function show(
        Rapport $rapport
    ): JsonResponse {
        $rapport->load([
            'projet',
            'createur',
        ]);

        return response()->json([
            'success' => true,
            'data' => new RapportResource($rapport),
        ]);
    }

    /**
     * Modifier un rapport
     */
    public function update(
        RapportRequest $request,
        Rapport $rapport
    ): JsonResponse {
        $data = $request->validated();

        /*
        |--------------------------------------------------------------------------
        | Nouveau fichier
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('fichier')) {

            /*
             * Supprimer l'ancien fichier
             */
            if ($rapport->fichier) {
                Storage::disk('public')->delete(
                    $rapport->fichier
                );
            }

            /*
             * Enregistrer le nouveau fichier
             */
            $data['fichier'] = $request
                ->file('fichier')
                ->store('rapports', 'public');
        }

        /*
        |--------------------------------------------------------------------------
        | Ne pas modifier le créateur
        |--------------------------------------------------------------------------
        */

        unset($data['created_by']);

        /*
        |--------------------------------------------------------------------------
        | Mise à jour
        |--------------------------------------------------------------------------
        */

        $rapport->update($data);

        $rapport->load([
            'projet',
            'createur',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Rapport modifié avec succès.',
            'data' => new RapportResource($rapport),
        ]);
    }

    /**
     * Télécharger le fichier du rapport
     */
    public function download(
        Rapport $rapport
    )
    {
        /*
        |--------------------------------------------------------------------------
        | Vérifier qu'un fichier existe
        |--------------------------------------------------------------------------
        */

        if (!$rapport->fichier) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun fichier associé à ce rapport.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Vérifier que le fichier existe dans storage
        |--------------------------------------------------------------------------
        */

        $disk = Storage::disk('public');

        if (!$disk->exists($rapport->fichier)) {
            return response()->json([
                'success' => false,
                'message' => 'Le fichier n’existe pas dans le stockage.',
                'fichier' => $rapport->fichier,
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Chemin physique
        |--------------------------------------------------------------------------
        */

        $path = $disk->path(
            $rapport->fichier
        );

        /*
        |--------------------------------------------------------------------------
        | Nom du fichier
        |--------------------------------------------------------------------------
        */

        $extension = strtolower(
            pathinfo(
                $path,
                PATHINFO_EXTENSION
            )
        );

        $filename = $rapport->titre
            ?: 'rapport';

        /*
        |--------------------------------------------------------------------------
        | Ajouter l'extension
        |--------------------------------------------------------------------------
        */

        if ($extension) {

            $lowerFilename =
                strtolower($filename);

            if (
                !str_ends_with(
                    $lowerFilename,
                    '.' . $extension
                )
            ) {
                $filename .= '.' . $extension;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Télécharger
        |--------------------------------------------------------------------------
        */

        return response()->download(
            $path,
            $filename
        );
    }

    /**
     * Supprimer un rapport
     */
    public function destroy(
        Rapport $rapport
    ): JsonResponse {
        /*
        |--------------------------------------------------------------------------
        | Supprimer le fichier physique
        |--------------------------------------------------------------------------
        */

        if ($rapport->fichier) {
            Storage::disk('public')->delete(
                $rapport->fichier
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Supprimer le rapport
        |--------------------------------------------------------------------------
        */

        $rapport->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rapport supprimé avec succès.',
        ]);
    }
}

