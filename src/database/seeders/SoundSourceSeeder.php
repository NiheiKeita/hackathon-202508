<?php

namespace Database\Seeders;

use App\Models\SoundSource;
use Illuminate\Database\Seeder;

class SoundSourceSeeder extends Seeder
{
    public function run(): void
    {
        // 無料の基本音源
        $freeSounds = [
            [
                'name' => 'ピアノ C',
                'type' => 'piano',
                'category' => 'basic',
                'is_free' => true,
                'price' => 0,
                'description' => '基本的なピアノ音（C音）',
            ],
            [
                'name' => 'ピアノ D',
                'type' => 'piano',
                'category' => 'basic',
                'is_free' => true,
                'price' => 0,
                'description' => '基本的なピアノ音（D音）',
            ],
            [
                'name' => 'ピアノ E',
                'type' => 'piano',
                'category' => 'basic',
                'is_free' => true,
                'price' => 0,
                'description' => '基本的なピアノ音（E音）',
            ],
            [
                'name' => 'ハープ',
                'type' => 'harp',
                'category' => 'basic',
                'is_free' => true,
                'price' => 0,
                'description' => '基本的なハープ音',
            ],
            [
                'name' => 'シンセパッド',
                'type' => 'synth_pad',
                'category' => 'basic',
                'is_free' => true,
                'price' => 0,
                'description' => '基本的なシンセサイザーパッド音',
            ],
        ];

        foreach ($freeSounds as $sound) {
            SoundSource::create($sound);
        }

        // 和楽器セット（有料）
        $japaneseSounds = [
            [
                'name' => '琴',
                'type' => 'koto',
                'category' => 'japanese',
                'is_free' => false,
                'price' => 300,
                'description' => '美しい琴の音色',
            ],
            [
                'name' => '三味線',
                'type' => 'shamisen',
                'category' => 'japanese',
                'is_free' => false,
                'price' => 300,
                'description' => '伝統的な三味線の音色',
            ],
            [
                'name' => '笛',
                'type' => 'fue',
                'category' => 'japanese',
                'is_free' => false,
                'price' => 300,
                'description' => '日本の竹笛の音色',
            ],
            [
                'name' => '太鼓',
                'type' => 'taiko',
                'category' => 'japanese',
                'is_free' => false,
                'price' => 300,
                'description' => '力強い太鼓の音',
            ],
        ];

        foreach ($japaneseSounds as $sound) {
            SoundSource::create($sound);
        }

        // 80'sシンセセット（有料）
        $synthSounds = [
            [
                'name' => 'DX7ベル',
                'type' => 'dx7_bell',
                'category' => '80s_synth',
                'is_free' => false,
                'price' => 500,
                'description' => 'クラシックなDX7のベル音',
            ],
            [
                'name' => 'アナログベース',
                'type' => 'analog_bass',
                'category' => '80s_synth',
                'is_free' => false,
                'price' => 500,
                'description' => '80年代風アナログシンセベース',
            ],
            [
                'name' => 'リードシンセ',
                'type' => 'lead_synth',
                'category' => '80s_synth',
                'is_free' => false,
                'price' => 500,
                'description' => '80年代風リードシンセ',
            ],
        ];

        foreach ($synthSounds as $sound) {
            SoundSource::create($sound);
        }
    }
}