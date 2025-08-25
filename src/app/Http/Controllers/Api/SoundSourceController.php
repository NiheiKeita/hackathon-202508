<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SoundSource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SoundSourceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SoundSource::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('is_free')) {
            $query->where('is_free', $request->boolean('is_free'));
        }

        $soundSources = $query->get();
        return response()->json($soundSources);
    }

    public function show(SoundSource $soundSource): JsonResponse
    {
        return response()->json($soundSource);
    }

    public function getUserSoundSources(Request $request): JsonResponse
    {
        $user = $request->user();

        // 無料音源
        $freeSounds = SoundSource::where('is_free', true)->get();

        // 購入済み音源
        $purchasedSounds = SoundSource::whereHas('purchasedSoundSources', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();

        $availableSounds = $freeSounds->merge($purchasedSounds)->unique('id');

        return response()->json($availableSounds);
    }
}
