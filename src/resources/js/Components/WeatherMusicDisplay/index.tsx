import React, { useEffect, useState } from 'react'
import { WeatherData } from '../../types/kodama'
import { useWeatherEffects } from '../../hooks/useWeatherEffects'

interface Props {
    weather: WeatherData
    className?: string
    showMusicEffects?: boolean
}

const WeatherMusicDisplay: React.FC<Props> = ({
    weather,
    className = '',
    showMusicEffects = true
}) => {
    const [animationKey, setAnimationKey] = useState(0)

    const {
        weatherEffectsActive,
        toggleWeatherEffects,
        getWeatherEffectDescription,
        calculateMusicParameters
    } = useWeatherEffects()

    const musicParams = calculateMusicParameters(weather)
    const effectDescriptions = getWeatherEffectDescription(weather)

    // 天候変化時にアニメーションをトリガー
    useEffect(() => {
        setAnimationKey(prev => prev + 1)
    }, [weather.weather_condition, weather.tempo_multiplier, weather.reverb_level])

    const getWeatherIcon = (condition: string): string => {
        if (condition.includes('晴')) return '☀️'
        if (condition.includes('曇')) return '☁️'
        if (condition.includes('雨')) return '🌧️'
        if (condition.includes('雪')) return '❄️'
        if (condition.includes('雷')) return '⛈️'
        if (condition.includes('霧')) return '🌫️'
        return '🌤️'
    }

    const getTemperatureColor = (temp: number): string => {
        if (temp >= 30) return 'text-red-600'
        if (temp >= 25) return 'text-orange-600'
        if (temp >= 20) return 'text-yellow-600'
        if (temp >= 15) return 'text-green-600'
        if (temp >= 10) return 'text-blue-600'
        if (temp >= 5) return 'text-indigo-600'
        return 'text-purple-600'
    }

    const getWindIntensity = (reverb: number): string => {
        if (reverb > 0.8) return '強風'
        if (reverb > 0.6) return '風やや強'
        if (reverb > 0.4) return '風あり'
        if (reverb > 0.2) return '微風'
        return '無風'
    }

    return (
        <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
            {/* ヘッダー */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div
                        key={`weather-${animationKey}`}
                        className="animate-bounce text-3xl"
                        style={{ animationDuration: '1s', animationIterationCount: 3 }}
                    >
                        {getWeatherIcon(weather.weather_condition)}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">現在の天候</h3>
                        <p className="text-sm text-gray-600">{weather.weather_condition}</p>
                    </div>
                </div>

                {showMusicEffects && (
                    <button
                        onClick={() => toggleWeatherEffects(!weatherEffectsActive)}
                        className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${weatherEffectsActive
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {weatherEffectsActive ? '音響効果ON' : '音響効果OFF'}
                    </button>
                )}
            </div>

            {/* 天候詳細 */}
            <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-gray-600">気温</span>
                        <span className={`text-lg font-bold ${getTemperatureColor(weather.temperature)}`}>
                            {weather.temperature}°C
                        </span>
                    </div>

                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-gray-600">湿度</span>
                        <span className="text-sm font-medium text-blue-600">
                            {weather.humidity}%
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">風</span>
                        <span className="text-sm font-medium text-green-600">
                            {getWindIntensity(weather.reverb_level)}
                        </span>
                    </div>
                </div>

                {showMusicEffects && (
                    <div className="rounded-lg bg-blue-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm text-blue-700">テンポ</span>
                            <span className={`text-lg font-bold transition-all duration-500 ${musicParams.bpm > 120 ? 'text-red-600' :
                                musicParams.bpm < 120 ? 'text-blue-600' : 'text-green-600'
                                }`}>
                                {musicParams.bpm} BPM
                            </span>
                        </div>

                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm text-blue-700">調性</span>
                            <span className={`text-sm font-medium ${musicParams.isMinor ? 'text-purple-600' : 'text-yellow-600'
                                }`}>
                                {musicParams.isMinor ? '短調 🌙' : '長調 ☀️'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-700">エコー</span>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 w-2 rounded-full transition-all duration-300 ${i < Math.round(musicParams.reverb * 5)
                                            ? 'bg-blue-500'
                                            : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 音楽への影響説明 */}
            {showMusicEffects && weatherEffectsActive && (
                <div className="rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-4">
                    <h4 className="mb-3 flex items-center text-sm font-medium text-gray-800">
                        <span className="mr-2">🎵</span>
                        音楽への影響
                    </h4>

                    <div className="space-y-2">
                        {effectDescriptions.map((description, index) => (
                            <div
                                key={`effect-${animationKey}-${index}`}
                                className="animate-fadeIn flex items-start space-x-2"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animationDuration: '0.5s',
                                    animationFillMode: 'forwards',
                                    opacity: 0
                                }}
                            >
                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-700">{description}</span>
                            </div>
                        ))}
                    </div>

                    {/* 効果の可視化 */}
                    <div className="mt-4 flex items-center justify-center space-x-2">
                        <div className="text-xs text-gray-600">音響効果の強度:</div>
                        <div className="flex space-x-1">
                            {Array.from({ length: 10 }, (_, i) => {
                                const intensity = (musicParams.bpm - 100) / 100 + musicParams.reverb
                                const isActive = i < Math.round(intensity * 10)
                                return (
                                    <div
                                        key={i}
                                        className={`h-2 w-1 rounded-full transition-all duration-300 ${isActive
                                            ? 'bg-gradient-to-t from-blue-400 to-purple-500'
                                            : 'bg-gray-200'
                                            }`}
                                        style={{
                                            animationDelay: `${i * 0.05}s`,
                                            transform: isActive ? 'scaleY(1.2)' : 'scaleY(1)'
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* 天候変化の予測 */}
            <div className="mt-4 rounded-lg bg-yellow-50 p-3">
                <div className="flex items-center space-x-2 text-yellow-800">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">
                        天候の変化により音楽が自動的に調整されます
                    </span>
                </div>

                <div className="mt-2 text-xs text-yellow-700">
                    雨が降ると演奏が活発になり、風が吹くと響きが豊かになります
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
        </div>
    )
}

export default WeatherMusicDisplay
