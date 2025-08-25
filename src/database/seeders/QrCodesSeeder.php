<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class QrCodesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('qr_codes')->insert([
            // === 和楽器パックのQRコード ===
            [
                'id' => 1,
                'code' => 'KODAMA-JAPANESE-KOTO-' . strtoupper(Str::random(8)),
                'sound_source_id' => 4, // 琴
                'is_active' => true,
                'max_uses' => 100,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'code' => 'KODAMA-JAPANESE-SHAKUHACHI-' . strtoupper(Str::random(8)),
                'sound_source_id' => 5, // 尺八
                'is_active' => true,
                'max_uses' => 100,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'code' => 'KODAMA-JAPANESE-TAIKO-' . strtoupper(Str::random(8)),
                'sound_source_id' => 6, // 太鼓
                'is_active' => true,
                'max_uses' => 100,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'code' => 'KODAMA-JAPANESE-SUZU-' . strtoupper(Str::random(8)),
                'sound_source_id' => 7, // 鈴
                'is_active' => true,
                'max_uses' => 100,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // === 80'sシンセパックのQRコード ===
            [
                'id' => 5,
                'code' => 'KODAMA-80S-DX7-' . strtoupper(Str::random(8)),
                'sound_source_id' => 8, // DX7エレピ
                'is_active' => true,
                'max_uses' => 50,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'code' => 'KODAMA-80S-JUPITER8-' . strtoupper(Str::random(8)),
                'sound_source_id' => 9, // Jupiter-8
                'is_active' => true,
                'max_uses' => 50,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 7,
                'code' => 'KODAMA-80S-JUNO106-' . strtoupper(Str::random(8)),
                'sound_source_id' => 10, // Juno-106
                'is_active' => true,
                'max_uses' => 50,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 8,
                'code' => 'KODAMA-80S-MOOG-' . strtoupper(Str::random(8)),
                'sound_source_id' => 11, // Moog Bass
                'is_active' => true,
                'max_uses' => 50,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // === 自然音パックのQRコード ===
            [
                'id' => 9,
                'code' => 'KODAMA-NATURE-BIRDS-' . strtoupper(Str::random(8)),
                'sound_source_id' => 12, // 鳥のさえずり
                'is_active' => true,
                'max_uses' => 200,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 10,
                'code' => 'KODAMA-NATURE-WATER-' . strtoupper(Str::random(8)),
                'sound_source_id' => 13, // 水の音
                'is_active' => true,
                'max_uses' => 200,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 11,
                'code' => 'KODAMA-NATURE-WIND-' . strtoupper(Str::random(8)),
                'sound_source_id' => 14, // 風の音
                'is_active' => true,
                'max_uses' => 200,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 12,
                'code' => 'KODAMA-NATURE-INSECTS-' . strtoupper(Str::random(8)),
                'sound_source_id' => 15, // 虫の声
                'is_active' => true,
                'max_uses' => 200,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // === パック販売用QRコード（複数音源セット） ===
            [
                'id' => 13,
                'code' => 'KODAMA-PACK-JAPANESE-' . strtoupper(Str::random(8)),
                'sound_source_id' => 4, // 和楽器パック代表
                'is_active' => true,
                'max_uses' => 20,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 14,
                'code' => 'KODAMA-PACK-80S-' . strtoupper(Str::random(8)),
                'sound_source_id' => 8, // 80sシンセパック代表
                'is_active' => true,
                'max_uses' => 15,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 15,
                'code' => 'KODAMA-PACK-NATURE-' . strtoupper(Str::random(8)),
                'sound_source_id' => 12, // 自然音パック代表
                'is_active' => true,
                'max_uses' => 30,
                'used_count' => 0,
                'expires_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
