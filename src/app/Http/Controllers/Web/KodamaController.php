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
}