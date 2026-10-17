<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NoteRequest;
use App\Http\Resources\NoteResource;
use App\Models\Note;
use Illuminate\Http\JsonResponse;

class NoteController extends Controller
{
    public function index()
    {
        $notes = Note::with([
            'projet',
            'user',
        ])
            ->latest()
            ->get();

        return NoteResource::collection($notes);
    }

    public function store(NoteRequest $request)
    {
        $data = $request->validated();

        $note = Note::create([
            'projet_id' => $data['projet_id'],

            'user_id' => auth()->id(),

            'contenu' => $data['contenu'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Note ajoutée avec succès.',
            'data' => new NoteResource(
                $note->load([
                    'projet',
                    'user',
                ])
            ),
        ], 201);
    }

    public function show(Note $note)
    {
        return new NoteResource(
            $note->load([
                'projet',
                'user',
            ])
        );
    }

    public function update(
        NoteRequest $request,
        Note $note
    ) {
        $data = $request->validated();

        unset($data['projet_id']);

        $note->update([
            'contenu' => $data['contenu'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Note modifiée avec succès.',
            'data' => new NoteResource(
                $note->fresh()->load([
                    'projet',
                    'user',
                ])
            ),
        ]);
    }

    public function destroy(Note $note): JsonResponse
    {
        $note->delete();

        return response()->json([
            'success' => true,
            'message' => 'Note supprimée avec succès.',
        ]);
    }

}