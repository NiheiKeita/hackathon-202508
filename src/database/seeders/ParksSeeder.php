<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParksSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('parks')->insert([
            [
                'id' => 1,
                'name' => '代々木公園',
                'description' => '東京都渋谷区にある都立公園。広大な芝生エリアと豊かな緑が特徴的で、音の種を植えるのに最適な環境です。営業時間: 5:00-17:00、TEL: 03-3469-6081',
                'latitude' => 35.6719,
                'longitude' => 139.6955,
                'width' => 800,
                'height' => 600,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => '新宿御苑',
                'description' => '新宿区にある国民公園。日本庭園、イギリス風景式庭園、フランス式整形庭園が調和した美しい公園。四季折々の音楽が楽しめます。営業時間: 9:00-16:30、TEL: 03-3350-0151',
                'latitude' => 35.6851,
                'longitude' => 139.7103,
                'width' => 800,
                'height' => 600,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => '井の頭恩賜公園',
                'description' => '武蔵野市と三鷹市にまたがる都立公園。池を中心とした自然豊かな環境で、水の音と音の種のハーモニーが美しく響きます。営業時間: 24時間開放、TEL: 0422-47-6900',
                'latitude' => 35.7004,
                'longitude' => 139.5707,
                'width' => 800,
                'height' => 600,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'name' => '上野恩賜公園',
                'description' => '台東区にある都立公園。桜の名所としても有名で、春には桜と音楽の共演が楽しめる特別な公園です。営業時間: 5:00-23:00、TEL: 03-3828-5644',
                'latitude' => 35.7145,
                'longitude' => 139.7732,
                'width' => 800,
                'height' => 600,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}