<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QrCode;
use App\Models\PurchasedSoundSource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class QrCodeController extends Controller
{
    public function scan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'qr_code' => 'required|string',
        ]);

        $qrCode = QrCode::with('soundSource')
            ->where('code', $validated['qr_code'])
            ->first();

        if (!$qrCode) {
            throw ValidationException::withMessages([
                'qr_code' => 'QRコードが見つかりません'
            ]);
        }

        if (!$qrCode->canBeUsed()) {
            throw ValidationException::withMessages([
                'qr_code' => 'このQRコードは使用できません'
            ]);
        }

        return response()->json([
            'qr_code' => $qrCode,
            'sound_source' => $qrCode->soundSource,
            'message' => 'QRコードを認識しました'
        ]);
    }

    public function purchase(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'qr_code' => 'required|string',
        ]);

        $user = $request->user();
        $qrCode = QrCode::with('soundSource')
            ->where('code', $validated['qr_code'])
            ->first();

        if (!$qrCode || !$qrCode->canBeUsed()) {
            throw ValidationException::withMessages([
                'qr_code' => 'QRコードが無効です'
            ]);
        }

        // 既に購入済みかチェック
        $existingPurchase = PurchasedSoundSource::where('user_id', $user->id)
            ->where('sound_source_id', $qrCode->sound_source_id)
            ->first();

        if ($existingPurchase) {
            return response()->json([
                'message' => '既に購入済みです',
                'sound_source' => $qrCode->soundSource
            ]);
        }

        // 購入処理
        $purchase = PurchasedSoundSource::create([
            'user_id' => $user->id,
            'sound_source_id' => $qrCode->sound_source_id,
            'qr_code' => $qrCode->code,
            'purchased_at' => now(),
        ]);

        // QRコード使用回数を増やす
        $qrCode->incrementUsage();

        return response()->json([
            'message' => '音源を購入しました！',
            'sound_source' => $qrCode->soundSource,
            'purchase' => $purchase
        ], 201);
    }

    public function purchaseSet(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:japanese,80s_synth',
        ]);

        $user = $request->user();
        $soundSources = \App\Models\SoundSource::where('category', $validated['category'])
            ->where('is_free', false)
            ->get();

        $purchasedCount = 0;
        $alreadyOwned = 0;

        foreach ($soundSources as $soundSource) {
            $existingPurchase = PurchasedSoundSource::where('user_id', $user->id)
                ->where('sound_source_id', $soundSource->id)
                ->first();

            if (!$existingPurchase) {
                PurchasedSoundSource::create([
                    'user_id' => $user->id,
                    'sound_source_id' => $soundSource->id,
                    'qr_code' => 'SET_PURCHASE_' . $validated['category'],
                    'purchased_at' => now(),
                ]);
                $purchasedCount++;
            } else {
                $alreadyOwned++;
            }
        }

        return response()->json([
            'message' => "{$validated['category']}セットを購入しました！",
            'purchased_count' => $purchasedCount,
            'already_owned' => $alreadyOwned,
            'sound_sources' => $soundSources
        ], 201);
    }
}