import React from 'react'
import { WeatherData } from '../../../../../types/kodama'

interface Props {
  weather: WeatherData;
}

const WeatherDisplay: React.FC<Props> = ({ weather }) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear':
        return '☀️'
      case 'cloudy':
        return '☁️'
      case 'rainy':
        return '🌧️'
      case 'stormy':
        return '⛈️'
      default:
        return '🌤️'
    }
  }

  const getTempoDescription = (multiplier: number) => {
    if (multiplier >= 1.4) return 'Prestissimo (非常に速く)'
    if (multiplier >= 1.2) return 'Presto (速く)'
    if (multiplier >= 1.1) return 'Allegro (快速に)'
    if (multiplier >= 0.9) return 'Moderato (中程度)'
    if (multiplier >= 0.8) return 'Andante (歩くように)'
    return 'Lento (ゆっくりと)'
  }

  const getReverbDescription = (level: number) => {
    if (level >= 0.8) return '非常に響く'
    if (level >= 0.6) return 'よく響く'
    if (level >= 0.4) return '程よく響く'
    if (level >= 0.2) return '少し響く'
    return 'ほとんど響かない'
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">現在の天候</h3>
          <div className="text-2xl">
            {getWeatherIcon(weather.weather_condition)}
          </div>
        </div>
      </div>
      
      <div className="space-y-4 p-4">
        {/* 基本天候情報 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {weather.temperature}°C
            </div>
            <div className="text-sm text-gray-600">気温</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {weather.humidity}%
            </div>
            <div className="text-sm text-gray-600">湿度</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {weather.wind_speed}m/s
            </div>
            <div className="text-sm text-gray-600">風速</div>
          </div>
          
          {weather.rain_level > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {weather.rain_level}mm/h
              </div>
              <div className="text-sm text-gray-600">雨量</div>
            </div>
          )}
        </div>

        {/* 音楽への影響 */}
        <div className="border-t pt-4">
          <h4 className="mb-3 flex items-center font-bold text-gray-800">
            <span className="mr-2">🎼</span>
            音楽への影響
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">テンポ</span>
              <div className="text-right">
                <div className="font-medium text-orange-600">
                  {Math.round(120 * weather.tempo_multiplier)} BPM
                </div>
                <div className="text-xs text-gray-500">
                  {getTempoDescription(weather.tempo_multiplier)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">リバーブ</span>
              <div className="text-right">
                <div className="font-medium text-purple-600">
                  {Math.round(weather.reverb_level * 100)}%
                </div>
                <div className="text-xs text-gray-500">
                  {getReverbDescription(weather.reverb_level)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">調性</span>
              <div className="text-right">
                <div className={`font-medium ${weather.is_major_key ? 'text-yellow-600' : 'text-indigo-600'}`}>
                  {weather.is_major_key ? '長調' : '短調'}
                </div>
                <div className="text-xs text-gray-500">
                  {weather.is_major_key ? '明るい響き' : '暗い響き'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 特別効果 */}
        {weather.thunder && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <div className="flex items-center">
              <span className="mr-2 text-xl">⚡</span>
              <div>
                <div className="font-medium text-yellow-800">雷が発生中</div>
                <div className="text-sm text-yellow-600">
                  音にアクセントが追加されます
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 天候による音楽的効果の説明 */}
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="space-y-1 text-xs text-gray-600">
            <div>💧 雨量 → テンポを変化</div>
            <div>💨 風速 → リバーブ効果</div>
            <div>🌡️ 気温 → 調性（長調/短調）</div>
            <div>⚡ 雷 → アクセント強調</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherDisplay