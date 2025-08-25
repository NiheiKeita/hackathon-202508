<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WeatherData;
use App\Models\Park;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    public function getCurrentWeather(Park $park): JsonResponse
    {
        $weather = WeatherData::where('park_id', $park->id)
            ->latest('recorded_at')
            ->first();

        if (!$weather) {
            // デフォルト天候データを返す
            $weather = [
                'park_id' => $park->id,
                'temperature' => 20.0,
                'humidity' => 60,
                'wind_speed' => 2.0,
                'rain_level' => 0.0,
                'thunder' => false,
                'weather_condition' => 'clear',
                'recorded_at' => now(),
                'tempo_multiplier' => 1.0,
                'reverb_level' => 0.2,
                'is_major_key' => true,
            ];
        } else {
            $weather = $weather->toArray();
            $weather['tempo_multiplier'] = $weather['tempo_multiplier'] ?? 1.0;
            $weather['reverb_level'] = $weather['reverb_level'] ?? 0.2;
            $weather['is_major_key'] = $weather['is_major_key'] ?? true;
        }

        return response()->json($weather);
    }

    public function updateWeather(Request $request, Park $park): JsonResponse
    {
        $validated = $request->validate([
            'temperature' => 'required|numeric',
            'humidity' => 'required|integer|min:0|max:100',
            'wind_speed' => 'required|numeric|min:0',
            'rain_level' => 'numeric|min:0',
            'thunder' => 'boolean',
            'weather_condition' => 'in:clear,cloudy,rainy,stormy',
        ]);

        $weather = WeatherData::create([
            'park_id' => $park->id,
            'temperature' => $validated['temperature'],
            'humidity' => $validated['humidity'],
            'wind_speed' => $validated['wind_speed'],
            'rain_level' => $validated['rain_level'] ?? 0,
            'thunder' => $validated['thunder'] ?? false,
            'weather_condition' => $validated['weather_condition'] ?? 'clear',
            'recorded_at' => now(),
        ]);

        return response()->json([
            'message' => '天候データを更新しました',
            'weather' => $weather,
            'tempo_multiplier' => $weather->tempo_multiplier,
            'reverb_level' => $weather->reverb_level,
            'is_major_key' => $weather->is_major_key,
        ], 201);
    }

    public function getWeatherHistory(Park $park): JsonResponse
    {
        $weatherHistory = WeatherData::where('park_id', $park->id)
            ->orderBy('recorded_at', 'desc')
            ->take(24) // 直近24時間分
            ->get();

        return response()->json($weatherHistory);
    }
}
