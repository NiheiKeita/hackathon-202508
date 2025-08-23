<?php

namespace Database\Seeders;

use App\Models\QrCode;
use App\Models\SoundSource;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class QrCodeSeeder extends Seeder
{
    public function run(): void
    {
        // 和楽器セット用QRコード
        $japaneseSounds = SoundSource::where('category', 'japanese')->get();
        foreach ($japaneseSounds as $sound) {
            QrCode::create([
                'code' => 'KODAMA_JAPANESE_' . strtoupper(Str::random(8)),
                'sound_source_id' => $sound->id,
                'is_active' => true,
                'max_uses' => 10,
                'used_count' => 0,
            ]);
        }

        // 80'sシンセセット用QRコード
        $synthSounds = SoundSource::where('category', '80s_synth')->get();
        foreach ($synthSounds as $sound) {
            QrCode::create([
                'code' => 'KODAMA_SYNTH_' . strtoupper(Str::random(8)),
                'sound_source_id' => $sound->id,
                'is_active' => true,
                'max_uses' => 5,
                'used_count' => 0,
            ]);
        }

        // セット購入用QRコード
        QrCode::create([
            'code' => 'KODAMA_JAPANESE_SET_' . strtoupper(Str::random(8)),
            'sound_source_id' => $japaneseSounds->first()->id, // 代表として最初の音源を設定
            'is_active' => true,
            'max_uses' => null, // 無制限
            'used_count' => 0,
        ]);

        QrCode::create([
            'code' => 'KODAMA_SYNTH_SET_' . strtoupper(Str::random(8)),
            'sound_source_id' => $synthSounds->first()->id, // 代表として最初の音源を設定
            'is_active' => true,
            'max_uses' => null, // 無制限
            'used_count' => 0,
        ]);
    }
}