<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeatherData extends Model
{
    use HasFactory;

    protected $fillable = [
        'park_id',
        'temperature',
        'humidity',
        'wind_speed',
        'rain_level',
        'thunder',
        'weather_condition',
        'recorded_at',
    ];

    protected $casts = [
        'temperature' => 'decimal:2',
        'humidity' => 'integer',
        'wind_speed' => 'decimal:2',
        'rain_level' => 'decimal:2',
        'thunder' => 'boolean',
        'recorded_at' => 'timestamp',
    ];

    public function park(): BelongsTo
    {
        return $this->belongsTo(Park::class);
    }

    public function getTempoMultiplierAttribute(): float
    {
        // 雨量に基づくテンポの計算
        if ($this->rain_level > 10) {
            return 1.5; // 豪雨 -> Presto
        } elseif ($this->rain_level > 3) {
            return 1.2; // 中雨 -> Allegro
        } elseif ($this->rain_level > 0) {
            return 0.8; // 小雨 -> Lento
        }
        
        return 1.0; // 晴れ -> Normal
    }

    public function getReverbLevelAttribute(): float
    {
        // 風速に基づくリバーブレベル
        return min($this->wind_speed / 10, 1.0);
    }

    public function getIsMajorKeyAttribute(): bool
    {
        // 気温に基づく長調/短調の判定
        return $this->temperature > 20;
    }
}