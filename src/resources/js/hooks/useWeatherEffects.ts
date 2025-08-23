import { useState, useCallback, useEffect, useRef } from 'react'
import { WeatherData } from '../types/kodama'
import { useAudioEngine } from './useAudioEngine'

export const useWeatherEffects = () => {
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
    const [weatherEffectsActive, setWeatherEffectsActive] = useState(true)
    const [transitionDuration, setTransitionDuration] = useState(2000) // ms

    const transitionRef = useRef<NodeJS.Timeout | null>(null)
    const previousWeatherRef = useRef<WeatherData | null>(null)

    const {
        setBpm,
        setMasterVolume,
        setMusicKey,
        applyWeatherEffects: audioEngineApplyEffects
    } = useAudioEngine()

    // 天候データから音楽パラメータを計算（サンプルアプリのパターンに準拠）
    const calculateMusicParameters = useCallback((weather: WeatherData) => {
        const baseParams = {
            bpm: 120,
            volume: 70,
            reverb: 0.3,
            isMinor: false,
        }

        // 降水量に基づくテンポ計算（サンプルアプリと同じロジック）
        let tempoBpm = baseParams.bpm
        if (weather.weather_condition.includes('雨')) {
            const rainfall = parseFloat(weather.weather_condition.match(/(\d+\.?\d*)mm/)?.[1] || '0')
            if (rainfall < 1) {
                tempoBpm = Math.round(baseParams.bpm * 0.8) // Andante
            } else if (rainfall < 5) {
                tempoBpm = baseParams.bpm // Moderato
            } else if (rainfall < 10) {
                tempoBpm = Math.round(baseParams.bpm * 1.2) // Allegro
            } else {
                tempoBpm = Math.round(baseParams.bpm * 1.5) // Presto
            }
        } else {
            // 基本テンポ乗数を適用
            tempoBpm = Math.round(baseParams.bpm * weather.tempo_multiplier)
        }

        // 風の影響: リバーブレベル（風が強いほどエコー効果）
        let reverbLevel = baseParams.reverb
        if (weather.weather_condition.includes('風')) {
            reverbLevel = Math.min(1.0, weather.reverb_level * 1.5)
        } else {
            reverbLevel = Math.min(1.0, weather.reverb_level * 1.2)
        }

        // 気温と季節の影響: 調性決定
        const isMinor = !weather.is_major_key

        // 特殊天候効果による音量調整
        let volumeAdjustment = baseParams.volume
        if (weather.weather_condition.includes('雨') || weather.weather_condition.includes('霧')) {
            volumeAdjustment = Math.round(baseParams.volume * 0.85) // 湿度で音が籠る
        } else if (weather.weather_condition.includes('雪')) {
            volumeAdjustment = Math.round(baseParams.volume * 0.9) // 雪で音が柔らかく
        } else if (weather.weather_condition.includes('雷')) {
            volumeAdjustment = Math.round(baseParams.volume * 1.1) // 雷で迫力アップ
        }

        return {
            bpm: tempoBpm,
            volume: volumeAdjustment,
            reverb: reverbLevel,
            isMinor,
            weather,
            // サンプルアプリのテンポ名称を追加
            tempoName: getTempoName(tempoBpm)
        }
    }, [])

    // テンポ名称を取得（サンプルアプリと同じロジック）
    const getTempoName = useCallback((bpm: number): string => {
        if (bpm < 100) return 'Andante'
        if (bpm < 130) return 'Moderato'  
        if (bpm < 150) return 'Allegro'
        return 'Presto'
    }, [])

    // 天候効果の段階的適用
    const applyWeatherEffectsGradually = useCallback((weather: WeatherData, immediate = false) => {
        if (!weatherEffectsActive) return

        const newParams = calculateMusicParameters(weather)
        const previousParams = previousWeatherRef.current
            ? calculateMusicParameters(previousWeatherRef.current)
            : newParams

        if (immediate) {
            // 即座に適用
            setBpm(newParams.bpm)
            setMasterVolume(newParams.volume)
            setMusicKey(newParams.isMinor)
            audioEngineApplyEffects(weather)
        } else {
            // 段階的に適用
            const steps = 20
            const stepDuration = transitionDuration / steps
            let currentStep = 0

            if (transitionRef.current) {
                clearInterval(transitionRef.current)
            }

            transitionRef.current = setInterval(() => {
                const progress = Math.min(1, currentStep / steps)
                const easeProgress = 1 - Math.cos(progress * Math.PI / 2) // easeOutSine

                // BPM の段階的変更
                const currentBpm = Math.round(
                    previousParams.bpm + (newParams.bpm - previousParams.bpm) * easeProgress
                )
                setBpm(currentBpm)

                // 音量の段階的変更
                const currentVolume = Math.round(
                    previousParams.volume + (newParams.volume - previousParams.volume) * easeProgress
                )
                setMasterVolume(currentVolume)

                // 調性は50%進行時点で切り替え
                if (progress > 0.5 && newParams.isMinor !== previousParams.isMinor) {
                    setMusicKey(newParams.isMinor)
                }

                currentStep++

                if (currentStep >= steps) {
                    if (transitionRef.current) {
                        clearInterval(transitionRef.current)
                        transitionRef.current = null
                    }

                    // 最終的に正確な値を設定
                    setBpm(newParams.bpm)
                    setMasterVolume(newParams.volume)
                    setMusicKey(newParams.isMinor)
                    audioEngineApplyEffects(weather)
                }
            }, stepDuration)
        }

        previousWeatherRef.current = weather
    }, [
        weatherEffectsActive,
        transitionDuration,
        calculateMusicParameters,
        setBpm,
        setMasterVolume,
        setMusicKey,
        audioEngineApplyEffects
    ])

    // 天候更新
    const updateWeather = useCallback((weather: WeatherData, immediate = false) => {
        setCurrentWeather(weather)
        applyWeatherEffectsGradually(weather, immediate)
    }, [applyWeatherEffectsGradually])

    // 天候効果のオン/オフ切り替え
    const toggleWeatherEffects = useCallback((active: boolean) => {
        setWeatherEffectsActive(active)

        if (!active && currentWeather) {
            // 効果を無効化する場合はデフォルト値に戻す
            setBpm(120)
            setMasterVolume(70)
            setMusicKey(false) // メジャーキー
        } else if (active && currentWeather) {
            // 効果を有効化する場合は現在の天候を即座に適用
            applyWeatherEffectsGradually(currentWeather, true)
        }
    }, [currentWeather, setBpm, setMasterVolume, setMusicKey, applyWeatherEffectsGradually])

    // 天候効果の説明テキスト生成
    const getWeatherEffectDescription = useCallback((weather: WeatherData): string[] => {
        const effects: string[] = []

        // テンポ効果
        const tempoChange = Math.round((weather.tempo_multiplier - 1) * 100)
        if (tempoChange > 5) {
            effects.push(`雨の影響でテンポが${tempoChange}%上昇`)
        } else if (tempoChange < -5) {
            effects.push(`穏やかな天候でテンポが${Math.abs(tempoChange)}%低下`)
        }

        // リバーブ効果
        if (weather.reverb_level > 0.6) {
            effects.push('強風によりエコー効果が強化')
        } else if (weather.reverb_level > 0.4) {
            effects.push('風により適度なリバーブ効果')
        }

        // 調性効果
        if (!weather.is_major_key) {
            effects.push('低温により短調（暗い響き）')
        } else {
            effects.push('温暖で長調（明るい響き）')
        }

        // 特殊天候効果
        if (weather.weather_condition.includes('雪')) {
            effects.push('雪により音が柔らかく響く')
        } else if (weather.weather_condition.includes('雷')) {
            effects.push('雷により音に迫力が加わる')
        } else if (weather.weather_condition.includes('霧')) {
            effects.push('霧により音が神秘的に響く')
        }

        return effects.length > 0 ? effects : ['標準的な音響効果']
    }, [])

    // 天候変化のアニメーション効果
    const getWeatherTransitionClass = useCallback((weather: WeatherData): string => {
        if (!previousWeatherRef.current) return ''

        const prev = previousWeatherRef.current

        if (weather.weather_condition !== prev.weather_condition) {
            return 'weather-transition-active'
        }

        const tempoDiff = Math.abs(weather.tempo_multiplier - prev.tempo_multiplier)
        const reverbDiff = Math.abs(weather.reverb_level - prev.reverb_level)

        if (tempoDiff > 0.1 || reverbDiff > 0.2) {
            return 'weather-transition-moderate'
        }

        return ''
    }, [])

    // クリーンアップ
    useEffect(() => {
        return () => {
            if (transitionRef.current) {
                clearInterval(transitionRef.current)
            }
        }
    }, [])

    return {
        // State
        currentWeather,
        weatherEffectsActive,
        transitionDuration,

        // Actions
        updateWeather,
        toggleWeatherEffects,
        setTransitionDuration,

        // Utilities
        calculateMusicParameters,
        getWeatherEffectDescription,
        getWeatherTransitionClass,
        getTempoName,
    }
}
