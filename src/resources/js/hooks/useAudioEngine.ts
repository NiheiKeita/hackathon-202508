import { useState, useCallback, useEffect, useRef } from 'react'
import { SoundSeed, WeatherData } from '../types/kodama'

interface AudioSource {
  id: number;
  audio: HTMLAudioElement;
  gainNode?: GainNode;
  panNode?: StereoPannerNode;
  x: number;
  y: number;
}

export const useAudioEngine = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [bpm, setBpm] = useState(120)
  const [masterVolume, setMasterVolume] = useState(0.7)
  const [audioSources, setAudioSources] = useState<AudioSource[]>([])
  
  const audioContextRef = useRef<globalThis.AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const reverbNodeRef = useRef<ConvolverNode | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Web Audio Context初期化
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioContextRef.current = context

        // マスターゲインノード作成
        const masterGain = context.createGain()
        masterGain.gain.value = masterVolume
        masterGain.connect(context.destination)
        masterGainRef.current = masterGain

        // リバーブ用コンボルバーノード作成（簡易実装）
        const reverb = context.createConvolver()
        const reverbBuffer = createReverbImpulse(context, 2, 2, false)
        reverb.buffer = reverbBuffer
        reverbNodeRef.current = reverb

      } catch (error) {
        console.error('Audio Context initialization failed:', error)
      }
    }

    initAudioContext()

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [masterVolume])

  // リバーブインパルス生成（簡易実装）
  const createReverbImpulse = useCallback((
    audioContext: globalThis.AudioContext,
    duration: number,
    decay: number,
    reverse: boolean
  ): AudioBuffer => {
    const sampleRate = audioContext.sampleRate
    const length = sampleRate * duration
    const impulse = audioContext.createBuffer(2, length, sampleRate)
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        const n = reverse ? length - i : i
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay)
      }
    }
    
    return impulse
  }, [])

  // 音の種をオーディオソースとしてロード
  const loadSoundSeed = useCallback(async (soundSeed: SoundSeed): Promise<void> => {
    if (!audioContextRef.current || !masterGainRef.current) return

    try {
      const context = audioContextRef.current
      const audio = new Audio()
      
      // 音源ファイルがある場合はロード、ない場合はデフォルト音を生成
      if (soundSeed.sound_source?.file_url) {
        audio.src = soundSeed.sound_source.file_url
      } else {
        // デフォルト音生成（サイン波）
        audio.src = generateDefaultTone(soundSeed.sound_source?.type || 'piano')
      }

      audio.loop = false // ループは自動再生で管理
      audio.volume = soundSeed.volume / 100

      // Web Audio APIノード作成
      const audioElement = audio as any
      const mediaElementSource = context.createMediaElementSource(audioElement)
      
      // ゲインノード（音量制御）
      const gainNode = context.createGain()
      gainNode.gain.value = (soundSeed.volume / 100) * masterVolume
      
      // パンナー（ステレオ配置）
      const panNode = context.createStereoPanner()
      const panValue = Math.max(-1, Math.min(1, (soundSeed.x_position - 400) / 400))
      panNode.pan.value = panValue

      // ノード接続: MediaSource → Gain → Pan → Master → Destination
      mediaElementSource.connect(gainNode)
      gainNode.connect(panNode)
      panNode.connect(masterGainRef.current)

      const source: AudioSource = {
        id: soundSeed.id,
        audio,
        gainNode,
        panNode,
        x: soundSeed.x_position,
        y: soundSeed.y_position,
      }

      setAudioSources(prev => [...prev.filter(s => s.id !== soundSeed.id), source])

    } catch (error) {
      console.error('Failed to load sound seed:', error)
    }
  }, [masterVolume])

  // デフォルト音生成
  const generateDefaultTone = useCallback((type: string): string => {
    if (!audioContextRef.current) return ''

    const context = audioContextRef.current
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate)
    const data = buffer.getChannelData(0)

    const frequencies: { [key: string]: number } = {
      piano: 261.63, // C4
      harp: 329.63,  // E4
      synth_pad: 196.00, // G3
      koto: 293.66,  // D4
      shamisen: 220.00, // A3
      fue: 523.25,   // C5
      taiko: 55.00,  // A1
    }

    const frequency = frequencies[type] || 261.63
    
    for (let i = 0; i < data.length; i++) {
      const time = i / context.sampleRate
      data[i] = Math.sin(2 * Math.PI * frequency * time) * Math.exp(-time * 0.5)
    }

    // AudioBufferをWAV形式のArrayBufferに変換
    const arrayBuffer = new ArrayBuffer(44 + buffer.length * 4)
    const view = new DataView(arrayBuffer)
    
    // WAVヘッダー作成（簡略版）
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i))
      }
    }
    
    writeString(0, 'RIFF')
    view.setUint32(4, 36 + buffer.length * 4, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, context.sampleRate, true)
    view.setUint32(28, context.sampleRate * 4, true)
    view.setUint16(32, 4, true)
    view.setUint16(34, 32, true)
    writeString(36, 'data')
    view.setUint32(40, buffer.length * 4, true)
    
    // PCMデータ
    const channelData = buffer.getChannelData(0)
    for (let i = 0; i < channelData.length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]))
      view.setFloat32(44 + i * 4, sample, true)
    }
    
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' })
    return URL.createObjectURL(blob)
  }, [])

  // 再生開始
  const play = useCallback(() => {
    if (!audioContextRef.current) return

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    setIsPlaying(true)
    startTimeRef.current = Date.now()

      // BPMに基づくタイマー開始
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      setCurrentTime(elapsed)

      // 各音源を再生位置とBPMに応じてトリガー
      audioSources.forEach(source => {
        const beatInterval = 60 / bpm // 1拍の長さ（秒）
        const measureLength = beatInterval * 4 // 4拍1小節
        
        // X座標に基づく再生タイミング（0-800の座標を0-4拍にマッピング）
        const xBeatOffset = (source.x / 200) * beatInterval
        // Y座標に基づく小節内でのタイミング調整
        const yOffset = (source.y / 600) * (beatInterval / 4)
        
        const triggerTime = xBeatOffset + yOffset
        const currentBeatTime = elapsed % measureLength
        
        // トリガー条件：指定タイミング±50msの誤差範囲内
        if (Math.abs(currentBeatTime - triggerTime) < 0.05) {
          // パンニング設定（X座標に基づくステレオ配置）
          if (source.panNode && audioContextRef.current) {
            const panValue = Math.max(-1, Math.min(1, (source.x - 400) / 400))
            source.panNode.pan.value = panValue
          }
          
          // 距離による音量調整（Y座標に基づく）
          if (source.gainNode) {
            const distanceVolume = Math.max(0.1, 1 - (source.y / 600) * 0.5)
            source.gainNode.gain.value = distanceVolume * (masterVolume / 100)
          }
          
          source.audio.currentTime = 0
          source.audio.play().catch(console.error)
        }
      })
    }, 50) // より細かい間隔で精度向上
  }, [audioSources, bpm])

  // 再生停止
  const stop = useCallback(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    audioSources.forEach(source => {
      source.audio.pause()
      source.audio.currentTime = 0
    })
  }, [audioSources])

  // 天候効果適用
  const applyWeatherEffects = useCallback((weather: WeatherData) => {
    setBpm(Math.round(120 * weather.tempo_multiplier))

    if (reverbNodeRef.current && masterGainRef.current) {
      // リバーブレベル調整
      const reverbGain = audioContextRef.current?.createGain()
      if (reverbGain) {
        reverbGain.gain.value = weather.reverb_level
      }
    }
  }, [])

  // 音の種削除
  const removeSoundSeed = useCallback((seedId: number) => {
    setAudioSources(prev => {
      const source = prev.find(s => s.id === seedId)
      if (source) {
        source.audio.pause()
        URL.revokeObjectURL(source.audio.src)
      }
      return prev.filter(s => s.id !== seedId)
    })
  }, [])

  // メトロノーム（拍の取得）
  const getCurrentBeat = useCallback((): number => {
    if (!isPlaying) return 0
    const elapsed = (Date.now() - startTimeRef.current) / 1000
    const beatInterval = 60 / bpm
    return Math.floor(elapsed / beatInterval) % 16 // 16拍パターン
  }, [isPlaying, bpm])

  // 指定座標での音の種の再生予測時間を計算
  const getNextPlayTimeForPosition = useCallback((x: number, y: number): number => {
    if (!isPlaying) return 0
    
    const elapsed = (Date.now() - startTimeRef.current) / 1000
    const beatInterval = 60 / bpm
    const measureLength = beatInterval * 4
    
    const xBeatOffset = (x / 200) * beatInterval
    const yOffset = (y / 600) * (beatInterval / 4)
    const triggerTime = xBeatOffset + yOffset
    
    const currentMeasureTime = elapsed % measureLength
    
    if (currentMeasureTime <= triggerTime) {
      return triggerTime - currentMeasureTime
    } else {
      return measureLength - currentMeasureTime + triggerTime
    }
  }, [isPlaying, bpm])

  // リアルタイム音量制御
  const updateSoundSeedVolume = useCallback((seedId: number, volume: number) => {
    setAudioSources(prev => 
      prev.map(source => {
        if (source.id === seedId && source.gainNode) {
          source.gainNode.gain.value = (volume / 100) * masterVolume
        }
        return source
      })
    )
  }, [masterVolume])

  // 音楽キー変更（メジャー/マイナー）
  const setMusicKey = useCallback((isMinor: boolean, rootNote: number = 60) => {
    // MIDI音程に基づくキー設定
    audioSources.forEach(source => {
      if (source.gainNode && audioContextRef.current) {
        // マイナーキーの場合は少し音量を下げる
        const keyVolume = isMinor ? 0.9 : 1.0
        source.gainNode.gain.value *= keyVolume
      }
    })
  }, [audioSources])

  return {
    // State
    isPlaying,
    currentTime,
    bpm,
    masterVolume,
    audioSources,

    // Controls
    play,
    stop,
    setBpm,
    setMasterVolume,

    // Sound management
    loadSoundSeed,
    removeSoundSeed,
    applyWeatherEffects,

    // Advanced sequencer features
    getCurrentBeat,
    getNextPlayTimeForPosition,
    updateSoundSeedVolume,
    setMusicKey,
  }
}