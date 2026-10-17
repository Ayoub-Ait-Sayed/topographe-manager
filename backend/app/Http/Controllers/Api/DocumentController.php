<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Liste des documents.
     */
    public function index(Request $request)
    {
        $documents = Document::with([
            'projet',
            'uploadedBy',
        ])
            ->latest()
            ->paginate(15);

        return response()->json($documents);
    }

    /**
     * Ajouter un document.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:255'],
            'projet_id' => ['nullable', 'exists:projets,id'],
            'date' => ['nullable', 'date'],
            'fichier' => ['required', 'file', 'max:10240'],
        ]);

        $file = $request->file('fichier');

        $chemin = $file->store('documents', 'public');

        $document = Document::create([
            'nom' => $validated['nom'],
            'type' => $validated['type'] ?? $file->getClientMimeType(),
            'chemin' => $chemin,
            'projet_id' => $validated['projet_id'] ?? null,
            'uploaded_by' => auth()->id(),
            'date' => $validated['date'] ?? now()->toDateString(),
        ]);

        $document->load([
            'projet',
            'uploadedBy',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Document ajouté avec succès.',
            'data' => $document,
        ], 201);
    }

    /**
     * Afficher un document.
     */
    public function show(Document $document)
    {
        $document->load([
            'projet',
            'uploadedBy',
        ]);

        return response()->json([
            'success' => true,
            'data' => $document,
        ]);
    }

    /**
     * Télécharger un document.
     */
    public function download(Document $document)
    {
        if (!$document->chemin) {
            return response()->json([
                'success' => false,
                'message' => 'Le fichier du document est introuvable.',
            ], 404);
        }

        if (!Storage::disk('public')->exists($document->chemin)) {
            return response()->json([
                'success' => false,
                'message' => 'Le fichier n’existe pas dans le stockage.',
            ], 404);
        }

        return Storage::disk('public')->download(
            $document->chemin,
            $document->nom . $this->getExtension($document->type)
        );
    }

    /**
     * Modifier un document.
     */
    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'nom' => ['sometimes', 'required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:255'],
            'projet_id' => ['nullable', 'exists:projets,id'],
            'date' => ['nullable', 'date'],
            'fichier' => ['nullable', 'file', 'max:10240'],
        ]);

        if ($request->hasFile('fichier')) {
            if ($document->chemin) {
                Storage::disk('public')->delete($document->chemin);
            }

            $file = $request->file('fichier');

            $document->chemin = $file->store('documents', 'public');

            $document->type = $validated['type']
                ?? $file->getClientMimeType();
        }

        if (array_key_exists('nom', $validated)) {
            $document->nom = $validated['nom'];
        }

        if (
            array_key_exists('type', $validated)
            && !$request->hasFile('fichier')
        ) {
            $document->type = $validated['type'];
        }

        if (array_key_exists('projet_id', $validated)) {
            $document->projet_id = $validated['projet_id'];
        }

        if (array_key_exists('date', $validated)) {
            $document->date = $validated['date'];
        }

        $document->save();

        $document->load([
            'projet',
            'uploadedBy',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Document modifié avec succès.',
            'data' => $document,
        ]);
    }

    /**
     * Supprimer un document.
     */
    public function destroy(Document $document)
    {
        if ($document->chemin) {
            Storage::disk('public')->delete($document->chemin);
        }

        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Document supprimé avec succès.',
        ]);
    }

    /**
     * Retourner l'extension correcte selon le MIME type.
     */
    private function getExtension(?string $mimeType): string
    {
        return match ($mimeType) {
            'application/pdf' => '.pdf',

            'application/msword' => '.doc',

            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                => '.docx',

            'application/vnd.ms-excel' => '.xls',

            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                => '.xlsx',

            'image/jpeg' => '.jpg',

            'image/png' => '.png',

            default => '',
        };
    }
}