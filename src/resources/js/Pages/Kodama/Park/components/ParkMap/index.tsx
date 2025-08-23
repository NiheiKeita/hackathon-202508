import React, { useRef, useCallback, useEffect } from 'react'
import { Park, SoundSeed, SoundSource, WeatherData } from '../../../../../types/kodama'

interface Props {
  park: Park;
  soundSeeds: SoundSeed[];
  isPlantingMode: boolean;
  selectedSoundSource: SoundSource | null;
  weather: WeatherData;
  onMapClick: (x: number, y: number) => void;
  onSeedClick: (seed: SoundSeed) => void;
}

const ParkMap: React.FC<Props> = ({
  park,
  soundSeeds,
  isPlantingMode,
  selectedSoundSource,
  weather,
  onMapClick,
  onSeedClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 天候に応じた背景効果
  const getWeatherEffect = () => {
    switch (weather.weather_condition) {
      case 'rainy':
        return 'bg-gradient-to-br from-gray-400 to-blue-500'
      case 'stormy':
        return 'bg-gradient-to-br from-gray-600 to-purple-700'
      case 'cloudy':
        return 'bg-gradient-to-br from-gray-300 to-blue-400'
      default:
        return 'bg-gradient-to-br from-green-200 to-blue-300'
    }
  }

  // 音源タイプに応じたアイコン
  const getSoundSourceIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      piano: '🎹',
      harp: '🎵',
      synth_pad: '🎛️',
      koto: '🎋',
      shamisen: '🎸',
      fue: '🎺',
      taiko: '🥁',
      dx7_bell: '🔔',
      analog_bass: '🎸',
      lead_synth: '🎹',
    }
    return icons[type] || '🎵'
  }

  // キャンバス描画
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // キャンバスサイズを親要素に合わせる
    const container = containerRef.current
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    // 背景をクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // グリッド描画（オプション）
    if (isPlantingMode) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.lineWidth = 1
      
      const gridSize = 50
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    // 天候エフェクト
    if (weather.rain_level > 0) {
      // 雨のエフェクト
      ctx.strokeStyle = 'rgba(100, 149, 237, 0.3)'
      ctx.lineWidth = 1
      
      const rainDrops = Math.min(weather.rain_level * 10, 100)
      for (let i = 0; i < rainDrops; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const length = Math.random() * 10 + 5
        
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + 2, y + length)
        ctx.stroke()
      }
    }

    if (weather.thunder) {
      // 雷のエフェクト（フラッシュ）
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // 音の種の視覚化エフェクト
    soundSeeds.forEach(seed => {
      const x = (seed.x_position / park.width) * canvas.width
      const y = (seed.y_position / park.height) * canvas.height
      
      // 音の波紋エフェクト
      const radius = (seed.volume / 100) * 30 + 10
      const time = Date.now() / 1000
      const ripple = Math.sin(time * weather.tempo_multiplier * 2) * 10
      
      ctx.strokeStyle = weather.is_major_key ? 
        'rgba(255, 215, 0, 0.5)' : 'rgba(138, 43, 226, 0.5)'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      
      ctx.beginPath()
      ctx.arc(x, y, radius + ripple, 0, 2 * Math.PI)
      ctx.stroke()
      
      ctx.setLineDash([])
    })
  }, [park, soundSeeds, isPlantingMode, weather])

  // キャンバス描画の定期更新
  useEffect(() => {
    const interval = setInterval(drawCanvas, 100)
    return () => clearInterval(interval)
  }, [drawCanvas])

  // リサイズ対応
  useEffect(() => {
    const handleResize = () => drawCanvas()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawCanvas])

  // 初回描画
  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  // マップクリック処理
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * park.width
    const y = ((event.clientY - rect.top) / rect.height) * park.height

    onMapClick(Math.round(x), Math.round(y))
  }

  // 音の種クリック処理
  const handleSeedClick = (event: React.MouseEvent, seed: SoundSeed) => {
    event.stopPropagation()
    onSeedClick(seed)
  }

  return (
    <div 
      ref={containerRef}
      className={`relative h-96 md:h-[500px] lg:h-[600px] ${getWeatherEffect()} cursor-${isPlantingMode ? 'crosshair' : 'default'} overflow-hidden`}
      onClick={handleClick}
    >
      {/* 背景キャンバス */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />

      {/* 天候情報オーバーレイ */}
      <div className="absolute left-4 top-4 rounded-lg bg-black bg-opacity-50 px-3 py-2 text-sm text-white">
        <div className="flex items-center space-x-2">
          <span>
            {weather.weather_condition === 'clear' && '☀️'}
            {weather.weather_condition === 'cloudy' && '☁️'}
            {weather.weather_condition === 'rainy' && '🌧️'}
            {weather.weather_condition === 'stormy' && '⛈️'}
          </span>
          <span>{weather.temperature}°C</span>
          <span>💨 {weather.wind_speed}m/s</span>
          {weather.rain_level > 0 && <span>☔ {weather.rain_level}mm/h</span>}
        </div>
      </div>

      {/* 植える音源プレビュー */}
      {isPlantingMode && selectedSoundSource && (
        <div className="absolute right-4 top-4 flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white">
          <span>{getSoundSourceIcon(selectedSoundSource.type)}</span>
          <span>{selectedSoundSource.name}</span>
        </div>
      )}

      {/* 音の種表示 */}
      {soundSeeds.map(seed => {
        const x = (seed.x_position / park.width) * 100
        const y = (seed.y_position / park.height) * 100
        
        return (
          <div
            key={seed.id}
            className="group absolute -translate-x-1/2 -translate-y-1/2 transform cursor-pointer"
            style={{ left: `${x}%`, top: `${y}%` }}
            onClick={(e) => handleSeedClick(e, seed)}
          >
            <div className="relative">
              {/* 音の種アイコン */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-lg transition-transform group-hover:scale-110">
                {getSoundSourceIcon(seed.sound_source?.type || 'piano')}
              </div>
              
              {/* ボリュームインジケーター */}
              <div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform rounded-full bg-blue-600"
                style={{ 
                  width: `${(seed.volume / 100) * 20 + 4}px`, 
                  height: '4px' 
                }}
              />
              
              {/* ホバー時の詳細情報 */}
              <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {seed.sound_source?.name}
                <br />
                音量: {seed.volume}%
              </div>
            </div>
          </div>
        )
      })}

      {/* 空の状態メッセージ */}
      {soundSeeds.length === 0 && !isPlantingMode && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-lg bg-white bg-opacity-90 p-6 text-center">
            <div className="mb-4 text-4xl">🌱</div>
            <h3 className="mb-2 text-xl font-bold text-green-800">
              まだ音の種が植えられていません
            </h3>
            <p className="text-gray-600">
              「音を植える」ボタンをクリックして最初の種を植えてみましょう
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ParkMap