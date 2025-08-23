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
        $soundPacks = [
            'japanese' => SoundSource::where('category', 'japanese')->get(),
            '80s_synth' => SoundSource::where('category', '80s_synth')->get(),
        ];

        return Inertia::render('Kodama/Shop', [
            'soundPacks' => $soundPacks,
        ]);
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