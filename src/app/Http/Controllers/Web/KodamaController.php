<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Park;
use App\Models\SoundSource;
use App\Models\SoundSeed;
use App\Models\WeatherData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KodamaController extends Controller
{
    public function index()
    {
        return Inertia::render('Kodama/Home');
    }

    public function park(Park $park)
    {
        $soundSeeds = SoundSeed::with(['soundSource', 'user'])
            ->where('park_id', $park->id)
            ->get();

        $weather = WeatherData::where('park_id', $park->id)
            ->latest('recorded_at')
            ->first();

        return Inertia::render('Kodama/Park', [
            'park' => $park,
            'soundSeeds' => $soundSeeds,
            'weather' => $weather ? [
                'temperature' => $weather->temperature,
                'humidity' => $weather->humidity,
                'wind_speed' => $weather->wind_speed,
                'rain_level' => $weather->rain_level,
                'thunder' => $weather->thunder,
                'weather_condition' => $weather->weather_condition,
                'tempo_multiplier' => $weather->tempo_multiplier,
                'reverb_level' => $weather->reverb_level,
                'is_major_key' => $weather->is_major_key,
            ] : [
                'temperature' => 20.0,
                'humidity' => 60,
                'wind_speed' => 2.0,
                'rain_level' => 0.0,
                'thunder' => false,
                'weather_condition' => 'clear',
                'tempo_multiplier' => 1.0,
                'reverb_level' => 0.2,
                'is_major_key' => true,
            ],
        ]);
    }

    public function soundSources(Request $request)
    {
        $user = $request->user();
        
        // 無料音源
        $freeSounds = SoundSource::where('is_free', true)->get();
        
        // 購入済み音源
        $purchasedSounds = [];
        if ($user) {
            $purchasedSounds = SoundSource::whereHas('purchasedSoundSources', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->get();
        }

        return Inertia::render('Kodama/SoundSources', [
            'freeSounds' => $freeSounds,
            'purchasedSounds' => $purchasedSounds,
            'allSounds' => SoundSource::all(),
        ]);
    }

    public function shop()
    {
        // 公園と天候データを取得
        $parks = Park::with(['weatherData' => function ($query) {
            $query->latest('recorded_at')->limit(1);
        }])->get();

        // 各公園の天候・気温に応じたQRコードを生成
        $availableQrCodes = [];
        
        foreach ($parks as $park) {
            $weather = $park->weatherData->first();
            $qrCodes = [];

            // 各音源の天候・温度条件を設定
            $soundSources = SoundSource::where('is_free', false)->get();
            
            foreach ($soundSources as $source) {
                $weatherCondition = $this->getWeatherConditionForSound($source->category);
                $temperatureRange = $this->getTemperatureRangeForSound($source->category);
                
                $qrCodes[] = [
                    'id' => $source->id,
                    'code' => 'KODAMA-' . strtoupper($source->type) . '-' . $park->id . '-' . now()->format('Ymd'),
                    'sound_source' => $source,
                    'weather_condition' => $weatherCondition,
                    'temperature_range' => $temperatureRange,
                ];
            }

            $availableQrCodes[] = [
                'park_id' => $park->id,
                'park_name' => $park->name,
                'qr_codes' => $qrCodes,
            ];
        }

        // 各公園に天候データを追加
        $parksWithWeather = $parks->map(function ($park) {
            $weather = $park->weatherData->first();
            return [
                'id' => $park->id,
                'name' => $park->name,
                'description' => $park->description,
                'latitude' => $park->latitude,
                'longitude' => $park->longitude,
                'weather' => $weather ? [
                    'temperature' => $weather->temperature,
                    'humidity' => $weather->humidity,
                    'wind_speed' => $weather->wind_speed,
                    'rain_level' => $weather->rain_level,
                    'thunder' => $weather->thunder,
                    'weather_condition' => $weather->weather_condition,
                ] : null,
            ];
        });

        return Inertia::render('Kodama/Shop', [
            'parks' => $parksWithWeather,
            'availableQrCodes' => $availableQrCodes,
        ]);
    }

    private function getWeatherConditionForSound($category)
    {
        switch ($category) {
            case 'japanese':
                return 'clear'; // 和楽器は晴天時
            case '80s_synth':
                return 'any'; // シンセはいつでも
            case 'nature':
                return 'rainy'; // 自然音は雨天時
            default:
                return 'any';
        }
    }

    private function getTemperatureRangeForSound($category)
    {
        switch ($category) {
            case 'japanese':
                return '15-30'; // 和楽器は温暖な時
            case '80s_synth':
                return 'any'; // シンセはいつでも
            case 'nature':
                return '10-25'; // 自然音は涼しい時
            default:
                return 'any';
        }
    }

    public function player(Park $park)
    {
        $soundSeeds = SoundSeed::with(['soundSource', 'user'])
            ->where('park_id', $park->id)
            ->get();

        $weather = WeatherData::where('park_id', $park->id)
            ->latest('recorded_at')
            ->first();

        return Inertia::render('Kodama/Player', [
            'park' => $park,
            'soundSeeds' => $soundSeeds,
            'weather' => $weather,
        ]);
    }

    public function mockMusic()
    {
        // モックデータ作成
        $mockPark = [
            'id' => 1,
            'name' => '代々木公園',
            'description' => '東京都渋谷区にある都立公園。広大な芝生エリアと豊かな緑が特徴的で、音の種を植えるのに最適な環境です。',
            'latitude' => 35.6719,
            'longitude' => 139.6955,
            'width' => 800,
            'height' => 600,
        ];

        // モック音の種データ
        $mockSoundSeeds = [
            [
                'id' => 1,
                'x' => 200,
                'y' => 150,
                'is_grown' => true,
                'growth_stage' => 'bloomed',
                'sound_source' => [
                    'id' => 1,
                    'name' => 'ピアノ',
                    'type' => 'piano',
                    'category' => 'basic',
                    'icon_path' => '🎹',
                    'description' => '美しく響くピアノの音色',
                ],
                'user' => null
            ],
            [
                'id' => 2,
                'x' => 400,
                'y' => 300,
                'is_grown' => true,
                'growth_stage' => 'bloomed',
                'sound_source' => [
                    'id' => 2,
                    'name' => 'ハープ',
                    'type' => 'harp',
                    'category' => 'basic',
                    'icon_path' => '🎵',
                    'description' => '天使の楽器とも呼ばれるハープ',
                ],
                'user' => null
            ],
            [
                'id' => 3,
                'x' => 600,
                'y' => 200,
                'is_grown' => true,
                'growth_stage' => 'growing',
                'sound_source' => [
                    'id' => 4,
                    'name' => '琴（こと）',
                    'type' => 'japanese_koto',
                    'category' => 'japanese',
                    'icon_path' => '🎌',
                    'description' => '日本の伝統楽器、琴の美しい音色',
                ],
                'user' => null
            ],
            [
                'id' => 4,
                'x' => 350,
                'y' => 450,
                'is_grown' => false,
                'growth_stage' => 'sprouting',
                'sound_source' => [
                    'id' => 3,
                    'name' => 'シンセパッド',
                    'type' => 'synth_pad',
                    'category' => 'basic',
                    'icon_path' => '🎛️',
                    'description' => '暖かく包み込むようなシンセサイザーの音色',
                ],
                'user' => null
            ]
        ];

        // モック天候データ
        $mockWeather = [
            'temperature' => 22.5,
            'humidity' => 68,
            'wind_speed' => 2.3,
            'rain_level' => 1.2,
            'thunder' => false,
            'weather_condition' => 'rainy',
        ];

        return Inertia::render('Mock/MusicDemo', [
            'park' => $mockPark,
            'soundSeeds' => $mockSoundSeeds,
            'weather' => $mockWeather,
        ]);
    }
}