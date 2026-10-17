<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PhotoRequest;
use App\Http\Resources\PhotoResource;
use App\Models\Photo;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
    /**
     * Liste des photos
     */
    public function index()
    {
        $photos = Photo::with([
            'projet',
            'uploadedBy',
        ])
            ->latest()
            ->get();

        return PhotoResource::collection($photos);
    }

    /**
     * Ajouter une photo
     */
    public function store(PhotoRequest $request)
    {
        $data = $request->validated();

        $file = $request->file('image');

        if (!$file) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune image sélectionnée.',
            ], 422);
        }

        // Stockage dans storage/app/public/photos
        $path = $file->store('photos', 'public');

        $photo = Photo::create([
            'projet_id' => $data['projet_id'],
            'uploaded_by' => auth()->id(),
            'nom' => $data['nom'] ?? $file->getClientOriginalName(),
            'chemin' => $path,
            'description' => $data['description'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Photo ajoutée avec succès.',
            'data' => new PhotoResource(
                $photo->load([
                    'projet',
                    'uploadedBy',
                ])
            ),
        ], 201);
    }

    /**
     * Afficher une photo
     */
    public function show(Photo $photo)
    {
        return new PhotoResource(
            $photo->load([
                'projet',
                'uploadedBy',
            ])
        );
    }

    /**
     * Modifier une photo
     */
    public function update(PhotoRequest $request, Photo $photo)
    {
        $data = $request->validated();

        /*
        |--------------------------------------------------------------------------
        | Remplacement de l'image
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('image')) {

            // Supprimer l'ancienne image
            if ($photo->chemin) {
                Storage::disk('public')->delete($photo->chemin);
            }

            // Nouvelle image
            $file = $request->file('image');

            $photo->chemin = $file->store('photos', 'public');

            // Si aucun nom n'est envoyé
            if (!isset($data['nom']) || empty($data['nom'])) {
                $photo->nom = $file->getClientOriginalName();
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Nom
        |--------------------------------------------------------------------------
        */

        if (array_key_exists('nom', $data)) {
            $photo->nom = $data['nom'];
        }

        /*
        |--------------------------------------------------------------------------
        | Description
        |--------------------------------------------------------------------------
        */

        if (array_key_exists('description', $data)) {
            $photo->description = $data['description'];
        }

        $photo->save();

        return response()->json([
            'success' => true,
            'message' => 'Photo modifiée avec succès.',
            'data' => new PhotoResource(
                $photo->fresh()->load([
                    'projet',
                    'uploadedBy',
                ])
            ),
        ]);
    }

    /**
     * Télécharger la photo
     */
    public function download(Photo $photo)
    {
        /*
        |--------------------------------------------------------------------------
        | Vérifier le chemin
        |--------------------------------------------------------------------------
        */

        if (!$photo->chemin) {
            return response()->json([
                'success' => false,
                'message' => 'Le fichier de la photo est introuvable.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Vérifier que le fichier existe
        |--------------------------------------------------------------------------
        */

        $disk = Storage::disk('public');

        if (!$disk->exists($photo->chemin)) {
            return response()->json([
                'success' => false,
                'message' => 'Le fichier n’existe pas dans le stockage.',
                'chemin' => $photo->chemin,
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Chemin physique
        |--------------------------------------------------------------------------
        */

        $path = $disk->path($photo->chemin);

        /*
        |--------------------------------------------------------------------------
        | Récupérer l'extension
        |--------------------------------------------------------------------------
        */

        $extension = strtolower(
            pathinfo($path, PATHINFO_EXTENSION)
        );

        /*
        |--------------------------------------------------------------------------
        | MIME type
        |--------------------------------------------------------------------------
        */

        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp',
            'gif' => 'image/gif',
            'bmp' => 'image/bmp',
            'svg' => 'image/svg+xml',
        ];

        $mimeType = $mimeTypes[$extension]
            ?? mime_content_type($path)
            ?? 'application/octet-stream';

        /*
        |--------------------------------------------------------------------------
        | Nom du fichier téléchargé
        |--------------------------------------------------------------------------
        */

        $filename = $photo->nom ?: 'photo';

        /*
        |--------------------------------------------------------------------------
        | Ajouter l'extension si elle n'existe pas
        |--------------------------------------------------------------------------
        */

        if (
            $extension &&
            !str_ends_with(
                strtolower($filename),
                '.' . $extension
            )
        ) {
            $filename .= '.' . $extension;
        }

        /*
        |--------------------------------------------------------------------------
        | Télécharger avec le bon Content-Type
        |--------------------------------------------------------------------------
        */

        return response()->download(
            $path,
            $filename,
            [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]
        );
    }

    /**
     * Supprimer une photo
     */
    public function destroy(Photo $photo): JsonResponse
    {
        /*
        |--------------------------------------------------------------------------
        | Supprimer le fichier physique
        |--------------------------------------------------------------------------
        */

        if ($photo->chemin) {
            Storage::disk('public')->delete($photo->chemin);
        }

        /*
        |--------------------------------------------------------------------------
        | Supprimer l'enregistrement DB
        |--------------------------------------------------------------------------
        */

        $photo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Photo supprimée avec succès.',
        ]);
    }
}