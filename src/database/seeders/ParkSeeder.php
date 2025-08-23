<?php

namespace Database\Seeders;

use App\Models\Park;
use Illuminate\Database\Seeder;

class ParkSeeder extends Seeder
{
    public function run(): void
    {
        Park::create([
            'name' => '代々木公園',
            'latitude' => 35.6719,
            'longitude' => 139.6963,
            'description' => '東京都渋谷区にある都立公園',
            'width' => 800,
            'height' => 600,
        ]);

        Park::create([
            'name' => '上野公園',
            'latitude' => 35.7153,
            'longitude' => 139.7740,
            'description' => '東京都台東区にある都立公園',
            'width' => 1000,
            'height' => 700,
        ]);

        Park::create([
            'name' => '井の頭公園',
            'latitude' => 35.7009,
            'longitude' => 139.5797,
            'description' => '東京都武蔵野市と三鷹市にまたがる都立公園',
            'width' => 900,
            'height' => 650,
        ]);
    }
}