import React, { useState } from 'react'
import { WeatherData } from '../../types/kodama'

interface Props {
    currentWeather: WeatherData
    onWeatherChange: (weather: WeatherData) => void
    className?: string
}

const WeatherSimulator: React.FC<Props> = ({
    currentWeather,
    onWeatherChange,
    className = ''
}) => {
    const [isSimulating, setIsSimulating] = useState(false)
    const [selectedCondition, setSelectedCondition] = useState(currentWeather.weather_condition)
    const [temperature, setTemperature] = useState(currentWeather.temperature)
    const [humidity, setHumidity] = useState(currentWeather.humidity)

    // 天候プリセット
    const weatherPresets = [
        {
            name: '晴天',
            emoji: '☀️',
            condition: '晴れ',
            temperature: 25,
            humidity: 45,
            tempo_multiplier: 1.0,
            reverb_level: 0.2,
            is_major_key: true,
            description: '明るく軽やかな音楽'
        },
        {
            name: '雨',
            emoji: '🌧️',
            condition: '雨',
            temperature: 18,
            humidity: 85,
            tempo_multiplier: 1.3,
            reverb_level: 0.6,
            is_major_key: false,
            description: 'テンポが上がり響きが豊か'
        },
        {
            name: '嵐',
            emoji: '⛈️',
            condition: '雷雨',
            temperature: 20,
            humidity: 90,
            tempo_multiplier: 1.5,
            reverb_level: 0.9,
            is_major_key: false,
            description: 'ドラマチックで迫力のある音楽'
        },
        {
            name: '雪',
            emoji: '❄️',
            condition: '雪',
            temperature: -2,
            humidity: 75,
            tempo_multiplier: 0.7,
            reverb_level: 0.8,
            is_major_key: false,
            description: '静寂で神秘的な響き'
        },
        {
            name: '霧',
            emoji: '🌫️',
            condition: '霧',
            temperature: 12,
            humidity: 95,
            tempo_multiplier: 0.8,
            reverb_level: 0.7,
            is_major_key: false,
            description: '幻想的で柔らかい音楽'
        },
        {
            name: '強風',
            emoji: '💨',
            condition: '強風',
            temperature: 15,
            humidity: 50,
            tempo_multiplier: 1.2,
            reverb_level: 0.85,
            is_major_key: true,
            description: '動的で風通しの良い音楽'
        }
    ]

    // カスタム天候の計算
    const calculateCustomWeather = (): WeatherData => {
        // 気温による調性決定 (15°C未満で短調になりやすい)
        const is_major_key = temperature >= 15 && humidity < 70

        // 湿度による音響効果 (湿度が高いほどリバーブ増加)
        const reverb_level = Math.min(1.0, humidity / 100 * 0.8 + 0.2)

        // 気温と湿度による テンポ調整
        let tempo_multiplier = 1.0
        if (selectedCondition.includes('雨')) {
            tempo_multiplier = 1.2 + (humidity - 50) / 100
        } else if (selectedCondition.includes('雪')) {
            tempo_multiplier = 0.6 + (temperature + 10) / 50
        } else if (selectedCondition.includes('雷')) {
            tempo_multiplier = 1.4 + (humidity - 70) / 100
        } else {
            tempo_multiplier = 0.8 + (temperature / 30)
        }

        tempo_multiplier = Math.max(0.5, Math.min(2.0, tempo_multiplier))

        return {
            weather_condition: selectedCondition,
            temperature,
            humidity,
            tempo_multiplier,
            reverb_level,
            is_major_key,
            park_id: 0,
            wind_speed: 0,
            rain_level: 0,
            thunder: false,
        }
    }

    const applyPreset = (preset: any) => {
        setSelectedCondition(preset.condition)
        setTemperature(preset.temperature)
        setHumidity(preset.humidity)

        const newWeather: WeatherData = {
            weather_condition: preset.condition,
            temperature: preset.temperature,
            humidity: preset.humidity,
            tempo_multiplier: preset.tempo_multiplier,
            reverb_level: preset.reverb_level,
            is_major_key: preset.is_major_key,
            park_id: 0,
            wind_speed: 0,
            rain_level: 0,
            thunder: false
        }

        onWeatherChange(newWeather)
        setIsSimulating(true)

        // 5秒後に元の天候に戻す
        setTimeout(() => {
            if (currentWeather) {
                onWeatherChange(currentWeather)
                setIsSimulating(false)
            }
        }, 5000)
    }

    const applyCustomWeather = () => {
        const customWeather = calculateCustomWeather()
        onWeatherChange(customWeather)
        setIsSimulating(true)

        setTimeout(() => {
            if (currentWeather) {
                onWeatherChange(currentWeather)
                setIsSimulating(false)
            }
        }, 8000)
    }

    const resetToOriginal = () => {
        if (currentWeather) {
            onWeatherChange(currentWeather)
            setSelectedCondition(currentWeather.weather_condition)
            setTemperature(currentWeather.temperature)
            setHumidity(currentWeather.humidity)
            setIsSimulating(false)
        }
    }

    return (
        <div className={`rounded-xl border bg-white p-6 shadow-lg ${className}`}>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">天候シミュレーター</h3>
                    <p className="text-sm text-gray-600">異なる天候で音楽の変化を体験</p>
                </div>

                {isSimulating && (
                    <button
                        onClick={resetToOriginal}
                        className="rounded-lg bg-gray-500 px-3 py-1 text-xs text-white transition-colors hover:bg-gray-600"
                    >
                        元に戻す
                    </button>
                )}
            </div>

            {/* プリセット天候 */}
            <div className="mb-6">
                <h4 className="mb-3 text-sm font-medium text-gray-700">プリセット天候</h4>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {weatherPresets.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => applyPreset(preset)}
                            disabled={isSimulating}
                            className={`group relative rounded-lg border-2 p-4 text-left transition-all ${isSimulating
                                ? 'cursor-not-allowed opacity-50'
                                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                                }`}
                        >
                            <div className="mb-2 flex items-center space-x-2">
                                <span className="text-2xl">{preset.emoji}</span>
                                <span className="font-medium text-gray-800">{preset.name}</span>
                            </div>

                            <div className="text-xs text-gray-600">
                                <div>{preset.temperature}°C, 湿度{preset.humidity}%</div>
                                <div className="mt-1 text-blue-600">{preset.description}</div>
                            </div>

                            {/* ホバー効果 */}
                            <div className="absolute inset-0 rounded-lg bg-blue-500 opacity-0 transition-opacity group-hover:opacity-5"></div>
                        </button>
                    ))}
                </div>
            </div>

            {/* カスタム天候設定 */}
            <div>
                <h4 className="mb-3 text-sm font-medium text-gray-700">カスタム設定</h4>

                <div className="space-y-4">
                    {/* 天候の種類 */}
                    <div>
                        <label className="mb-1 block text-xs text-gray-600">天候</label>
                        <select
                            value={selectedCondition}
                            onChange={(e) => setSelectedCondition(e.target.value as "clear" | "cloudy" | "rainy" | "stormy")}
                            disabled={isSimulating}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none disabled:bg-gray-100"
                        >
                            <option value="晴れ">晴れ</option>
                            <option value="曇り">曇り</option>
                            <option value="雨">雨</option>
                            <option value="雷雨">雷雨</option>
                            <option value="雪">雪</option>
                            <option value="霧">霧</option>
                            <option value="強風">強風</option>
                        </select>
                    </div>

                    {/* 気温 */}
                    <div>
                        <label className="mb-1 block text-xs text-gray-600">
                            気温: {temperature}°C
                        </label>
                        <input
                            type="range"
                            min="-10"
                            max="40"
                            value={temperature}
                            onChange={(e) => setTemperature(parseInt(e.target.value))}
                            disabled={isSimulating}
                            className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-orange-200 disabled:opacity-50"
                        />
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                            <span>-10°C</span>
                            <span>15°C</span>
                            <span>40°C</span>
                        </div>
                    </div>

                    {/* 湿度 */}
                    <div>
                        <label className="mb-1 block text-xs text-gray-600">
                            湿度: {humidity}%
                        </label>
                        <input
                            type="range"
                            min="20"
                            max="100"
                            value={humidity}
                            onChange={(e) => setHumidity(parseInt(e.target.value))}
                            disabled={isSimulating}
                            className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-200 disabled:opacity-50"
                        />
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                            <span>20%</span>
                            <span>60%</span>
                            <span>100%</span>
                        </div>
                    </div>

                    {/* 適用ボタン */}
                    <button
                        onClick={applyCustomWeather}
                        disabled={isSimulating}
                        className={`w-full rounded-lg px-4 py-3 font-medium transition-all ${isSimulating
                            ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                            : 'transform bg-blue-500 text-white hover:scale-105 hover:bg-blue-600'
                            }`}
                    >
                        {isSimulating ? '適用中...' : 'カスタム天候を適用 (8秒間)'}
                    </button>
                </div>
            </div>

            {/* 注意事項 */}
            <div className="mt-4 rounded-lg bg-amber-50 p-3">
                <div className="flex items-start space-x-2 text-amber-800">
                    <svg className="mt-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <div className="text-sm font-medium">シミュレーション中</div>
                        <div className="mt-1 text-xs">
                            設定した天候が音楽に反映されます。自動的に元の天候に戻ります。
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeatherSimulator
