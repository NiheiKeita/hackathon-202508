import { useState, useCallback, useRef, useEffect } from 'react'
import { SoundSource } from '../../../types/kodama'

export const useSoundSourcesHooks = (
  initialFreeSounds: SoundSource[],
  initialPurchasedSounds: SoundSource[],
  initialAllSounds: SoundSource[]
) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [previewingSound, setPreviewingSound] = useState<SoundSource | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 利用可能な音源（無料 + 購入済み）
  const availableSounds = [...initialFreeSounds, ...initialPurchasedSounds]
    .filter((sound, index, self) => 
      self.findIndex(s => s.id === sound.id) === index
    )

  // ロックされた音源（有料で未購入）
  const lockedSounds = initialAllSounds.filter(sound => 
    !sound.is_free && !initialPurchasedSounds.some(purchased => purchased.id === sound.id)
  )

  // 音源プレビュー再生
  const playPreview = useCallback(async (sound: SoundSource) => {
    try {
      // 既存の音声を停止
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      // 新しい音声を準備
      const audio = new Audio()
      
      if (sound.file_url) {
        audio.src = sound.file_url
      } else {
        // デフォルト音生成（簡易実装）
        audio.src = generateDefaultTone(sound.type)
      }

      audioRef.current = audio
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false)
      })

      audio.addEventListener('error', () => {
        console.error('Audio playback failed')
        setIsPlaying(false)
      })

      await audio.play()
      setIsPlaying(true)

      // 10秒でプレビュー終了
      setTimeout(() => {
        if (audioRef.current === audio) {
          stopPreview()
        }
      }, 10000)

    } catch (error) {
      console.error('Failed to play preview:', error)
      setIsPlaying(false)
    }
  }, [])

  // 音源プレビュー停止
  const stopPreview = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }, [])

  // デフォルト音生成（簡易実装）
  const generateDefaultTone = useCallback((type: string): string => {
    // Web Audio APIを使用してサイン波を生成
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    const frequencies: { [key: string]: number } = {
      piano: 261.63, // C4
      harp: 329.63,  // E4
      synth_pad: 196.00, // G3
      koto: 293.66,  // D4
      shamisen: 220.00, // A3
      fue: 523.25,   // C5
      taiko: 55.00,  // A1 (低い音)
      dx7_bell: 523.25, // C5
      analog_bass: 82.41, // E2
      lead_synth: 440.00, // A4
    }

    const frequency = frequencies[type] || 261.63
    
    for (let i = 0; i < data.length; i++) {
      const time = i / audioContext.sampleRate
      
      if (type === 'taiko') {
        // 太鼓は減衰の速いノイズ + サイン波
        data[i] = (Math.random() * 2 - 1) * Math.exp(-time * 5) * 0.5 + 
                  Math.sin(2 * Math.PI * frequency * time) * Math.exp(-time * 3) * 0.5
      } else if (type.includes('synth') || type.includes('dx7')) {
        // シンセ系は複数の倍音を含む
        data[i] = Math.sin(2 * Math.PI * frequency * time) * Math.exp(-time * 1) * 0.3 +
                  Math.sin(2 * Math.PI * frequency * 2 * time) * Math.exp(-time * 2) * 0.2 +
                  Math.sin(2 * Math.PI * frequency * 3 * time) * Math.exp(-time * 3) * 0.1
      } else {
        // その他は基本的なサイン波
        data[i] = Math.sin(2 * Math.PI * frequency * time) * Math.exp(-time * 1.5)
      }
    }

    // AudioBufferをBlobに変換してURLを生成
    const arrayBuffer = new ArrayBuffer(44 + buffer.length * 2)
    const view = new DataView(arrayBuffer)
    
    // WAVヘッダーを書き込み（簡略版）
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(0, 'RIFF')
    view.setUint32(4, 36 + buffer.length * 2, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, audioContext.sampleRate, true)
    view.setUint32(28, audioContext.sampleRate * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    writeString(36, 'data')
    view.setUint32(40, buffer.length * 2, true)

    // PCMデータを書き込み
    const offset = 44
    for (let i = 0; i < buffer.length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]))
      view.setInt16(offset + i * 2, sample * 0x7FFF, true)
    }

    const blob = new Blob([arrayBuffer], { type: 'audio/wav' })
    return URL.createObjectURL(blob)
  }, [])

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  return {
    availableSounds,
    lockedSounds,
    selectedCategory,
    searchQuery,
    previewingSound,
    isPlaying,
    setSelectedCategory,
    setSearchQuery,
    setPreviewingSound,
    playPreview,
    stopPreview,
  }
}