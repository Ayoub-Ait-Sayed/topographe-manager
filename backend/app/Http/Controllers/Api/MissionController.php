<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MissionRequest;
use App\Http\Resources\MissionResource;
use App\Models\Mission;

class MissionController extends Controller
{
    /**
     * Display a listing of missions.
     */
    public function index()
    {
        $missions = Mission::with('projet')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => MissionResource::collection($missions),
            'message' => 'Liste des missions récupérée avec succès.',
        ]);
    }

    /**
     * Store a newly created mission.
     */
    public function store(MissionRequest $request)
    {
        $mission = Mission::create(
            $request->validated()
        );

        $mission->load('projet');

        return response()->json([
            'success' => true,
            'data' => new MissionResource($mission),
            'message' => 'Mission créée avec succès.',
        ], 201);
    }

    /**
     * Display the specified mission.
     */
    public function show(Mission $mission)
    {
        $mission->load('projet');

        return response()->json([
            'success' => true,
            'data' => new MissionResource($mission),
            'message' => 'Mission récupérée avec succès.',
        ]);
    }

    /**
     * Update the specified mission.
     */
    public function update(
        MissionRequest $request,
        Mission $mission
    ) {
        $mission->update(
            $request->validated()
        );

        $mission->load('projet');

        return response()->json([
            'success' => true,
            'data' => new MissionResource($mission),
            'message' => 'Mission modifiée avec succès.',
        ]);
    }

    /**
     * Remove the specified mission.
     */
    public function destroy(Mission $mission)
    {
        $mission->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mission supprimée avec succès.',
        ]);
    }
}
