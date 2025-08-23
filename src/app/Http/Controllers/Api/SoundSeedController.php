<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SoundSeed;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SoundSeedController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'park_id' => 'required|exists:parks,id',
            'sound_source_id' => 'required|exists:sound_sources,id',
            'x_position' => 'required|integer|min:0',
            'y_position' => 'required|integer|min:0',
            'volume' => 'integer|min:0|max:100',
        ]);

        // ユーザーが音源にアクセス権限があるかチェック
        $user = $request->user();
        $soundSource = \App\Models\SoundSource::find($validated['sound_source_id']);
        
        if (!$soundSource->is_free) {
            $hasPurchased = \App\Models\PurchasedSoundSource::where('user_id', $user->id)
                ->where('sound_source_id', $soundSource->id)
                ->exists();
            
            if (!$hasPurchased) {
                throw ValidationException::withMessages([
                    'sound_source_id' => 'この音源は購入が必要です。'
                ]);
            }
        }

        $soundSeed = SoundSeed::create([
            'park_id' => $validated['park_id'],
            'user_id' => $user->id,
            'sound_source_id' => $validated['sound_source_id'],
            'x_position' => $validated['x_position'],
            'y_position' => $validated['y_position'],
            'volume' => $validated['volume'] ?? 70,
        ]);

        $soundSeed->load(['soundSource', 'user']);

        return response()->json($soundSeed, 201);
    }

    public function destroy(Request $request, SoundSeed $soundSeed): JsonResponse
    {
        $user = $request->user();
        
        if ($soundSeed->user_id !== $user->id) {
            return response()->json(['message' => '削除権限がありません'], 403);
        }

        $soundSeed->delete();

        return response()->json(['message' => '音の種を削除しました']);
    }

    public function update(Request $request, SoundSeed $soundSeed): JsonResponse
    {
        $user = $request->user();
        
        if ($soundSeed->user_id !== $user->id) {
            return response()->json(['message' => '編集権限がありません'], 403);
        }

        $validated = $request->validate([
            'x_position' => 'integer|min:0',
            'y_position' => 'integer|min:0',
            'volume' => 'integer|min:0|max:100',
        ]);

        $soundSeed->update($validated);
        $soundSeed->load(['soundSource', 'user']);

        return response()->json($soundSeed);
    }
}