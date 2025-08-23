<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Park;
use App\Models\SoundSeed;
use Illuminate\Http\JsonResponse;

class ParkController extends Controller
{
    public function index(): JsonResponse
    {
        $parks = Park::all();
        return response()->json($parks);
    }

    public function show(Park $park): JsonResponse
    {
        $park->load(['soundSeeds.soundSource', 'soundSeeds.user']);
        return response()->json($park);
    }

    public function getSoundSeeds(Park $park): JsonResponse
    {
        $soundSeeds = SoundSeed::with(['soundSource', 'user'])
            ->where('park_id', $park->id)
            ->get();

        return response()->json($soundSeeds);
    }
}