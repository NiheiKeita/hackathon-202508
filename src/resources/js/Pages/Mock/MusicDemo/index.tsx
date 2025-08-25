import React, { useState, useEffect, useRef } from 'react'
import { Head } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../Components/ui/card'
import { Badge } from '../../../Components/ui/badge'
import { Button } from '../../../Components/ui/button'
import { Play, Pause, Volume2, VolumeX, CloudRain, Wind, Thermometer, MapPin } from 'lucide-react'

interface SoundSeed {
  id: number
  x: number
  y: number
  is_grown: boolean
  growth_stage: 'sprouting' | 'growing' | 'bloomed'
  sound_source: {
    id: number
    name: string
    type: string
    category: string
    icon_path: string
    description: string
  }
  user: any
}

interface Props {
  park: {
    id: number
    name: string
    description: string
    latitude: number
    longitude: number
    width: number
    height: number
  }
  soundSeeds: SoundSeed[]
  weather: {
    temperature: number
    humidity: number
    wind_speed: number
    rain_level: number
    thunder: boolean
    weather_condition: string
  }
}

const MusicDemo: React.FC<Props> = ({ park, soundSeeds, weather }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hoveredSeed, setHoveredSeed] = useState<number | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number
    longitude: number
    accuracy: number
    timestamp: number
  } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const audioContextRef = useRef<AudioContext>()
  const oscillatorsRef = useRef<Map<number, OscillatorNode>>(new Map())

  // モック現在地設定
  useEffect(() => {
    // デモ用のモック位置情報（代々木公園から50m以内の位置）
    const mockLocation = {
      latitude: 35.6725, // 代々木公園から約50m離れた位置
      longitude: 139.6950,
      accuracy: 15, // 15m精度
      timestamp: Date.now()
    }
    
    // 少し遅延させて実際のGPS取得をシミュレート
    setTimeout(() => {
      setCurrentLocation(mockLocation)
      setLocationError(null)
    }, 2000)
  }, [])

  // 公園との距離を計算
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3 // 地球の半径（メートル）
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // 距離（メートル）
  }

  const distanceFromPark = currentLocation
    ? calculateDistance(currentLocation.latitude, currentLocation.longitude, park.latitude, park.longitude)
    : null

  const isNearPark = distanceFromPark !== null && distanceFromPark <= 100 // 100m以内

  // 音楽再生の制御
  const togglePlay = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    if (isPlaying) {
      // 停止
      oscillatorsRef.current.forEach(oscillator => {
        oscillator.stop()
        oscillator.disconnect()
      })
      oscillatorsRef.current.clear()
      setIsPlaying(false)
    } else {
      // 再生開始
      setIsPlaying(true)
      soundSeeds.forEach(seed => {
        if (seed.is_grown) {
          playSound(seed)
        }
      })
    }
  }

  const playSound = (seed: SoundSeed) => {
    if (!audioContextRef.current || isMuted) return

    const audioContext = audioContextRef.current
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    // 音源タイプに応じた周波数設定
    const getFrequency = (type: string, index: number) => {
      const baseFreq = [261.63, 329.63, 392.00, 523.25] // C, E, G, C
      switch (type) {
        case 'piano': return baseFreq[index % baseFreq.length]
        case 'harp': return baseFreq[index % baseFreq.length] * 2
        case 'japanese_koto': return baseFreq[index % baseFreq.length] * 0.8
        case 'synth_pad': return baseFreq[index % baseFreq.length] * 0.5
        default: return baseFreq[index % baseFreq.length]
      }
    }

    oscillator.frequency.setValueAtTime(
      getFrequency(seed.sound_source.type, seed.id),
      audioContext.currentTime
    )

    // 天候による音色変化
    const weatherMultiplier = weather.rain_level / 5 + 0.8 // 雨量で音程調整
    oscillator.frequency.exponentialRampToValueAtTime(
      oscillator.frequency.value * weatherMultiplier,
      audioContext.currentTime + 0.1
    )

    oscillator.type = seed.sound_source.type.includes('synth') ? 'sawtooth' : 'sine'
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 2)

    oscillatorsRef.current.set(seed.id, oscillator)

    // 次の音をランダムな間隔で再生
    setTimeout(() => {
      if (isPlaying && !isMuted) {
        playSound(seed)
      }
    }, Math.random() * 3000 + 1000)
  }

  // Canvas描画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 背景（公園）
      ctx.fillStyle = '#10b981'
      ctx.globalAlpha = 0.1
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1

      // 雨の演出
      if (weather.weather_condition === 'rainy') {
        ctx.strokeStyle = '#06b6d4'
        ctx.globalAlpha = 0.3
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * canvas.width
          const y = (Date.now() * 0.5 + i * 20) % canvas.height
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + 2, y + 8)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      }

      // 現在地マーカーを描画
      if (currentLocation) {
        // 公園内の相対位置を計算（モックでは中央付近に配置）
        const userX = canvas.width * 0.3 // 公園マップの30%位置
        const userY = canvas.height * 0.7 // 公園マップの70%位置

        // 現在地マーカー（脈動アニメーション）
        const time = Date.now() * 0.005
        const pulseRadius = 20 + Math.sin(time) * 6
        
        // 外側の円（青）
        ctx.fillStyle = '#06b6d4'
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.arc(userX, userY, pulseRadius, 0, Math.PI * 2)
        ctx.fill()
        
        // 内側の円（白）
        ctx.fillStyle = '#ffffff'
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.arc(userX, userY, 12, 0, Math.PI * 2)
        ctx.fill()
        
        // 中心の点（青）
        ctx.fillStyle = '#0284c7'
        ctx.beginPath()
        ctx.arc(userX, userY, 6, 0, Math.PI * 2)
        ctx.fill()

        // 現在地ラベル
        ctx.fillStyle = '#0f172a'
        ctx.font = '12px Arial'
        ctx.fillText('📍 現在地', userX + 15, userY - 10)
      }

      // 音の種を描画
      soundSeeds.forEach(seed => {
        const isHovered = hoveredSeed === seed.id
        const isActive = isPlaying && seed.is_grown

        // 音の波紋エフェクト（再生中のみ）
        if (isActive) {
          const time = Date.now() * 0.003
          for (let i = 0; i < 3; i++) {
            ctx.strokeStyle = '#10b981'
            ctx.globalAlpha = 0.3 - (i * 0.1)
            ctx.lineWidth = 2
            const radius = 20 + Math.sin(time + i) * 10
            ctx.beginPath()
            ctx.arc(seed.x, seed.y, radius, 0, Math.PI * 2)
            ctx.stroke()
          }
          ctx.globalAlpha = 1
        }

        // 成長段階に応じた表示
        let color = '#94a3b8' // sprouting
        let size = 15

        if (seed.growth_stage === 'growing') {
          color = '#22c55e'
          size = 20
        } else if (seed.growth_stage === 'bloomed') {
          color = '#10b981'
          size = 25
        }

        if (isHovered) {
          size += 5
          ctx.shadowBlur = 10
          ctx.shadowColor = color
        }

        // 種/芽/花を描画
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(seed.x, seed.y, size, 0, Math.PI * 2)
        ctx.fill()

        // 絵文字アイコン
        if (seed.growth_stage === 'bloomed') {
          ctx.font = '20px Arial'
          ctx.fillText(
            seed.sound_source.icon_path, 
            seed.x - 10, 
            seed.y + 7
          )
        }

        ctx.shadowBlur = 0
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [soundSeeds, weather, isPlaying, hoveredSeed, currentLocation])

  // クリーンアップ
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach(oscillator => {
        try {
          oscillator.stop()
          oscillator.disconnect()
        } catch (e) {
          // すでに停止済みの場合のエラーを無視
        }
      })
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const getGrowthStageText = (stage: string) => {
    switch (stage) {
      case 'sprouting': return '発芽中'
      case 'growing': return '成長中'
      case 'bloomed': return '開花'
      default: return '未知'
    }
  }

  const getGrowthStageColor = (stage: string) => {
    switch (stage) {
      case 'sprouting': return 'bg-slate-100 text-slate-700'
      case 'growing': return 'bg-green-100 text-green-700'
      case 'bloomed': return 'bg-teal-100 text-teal-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-stone-100/40">
      <Head title={`音楽デモ - ${park.name} - KODAMA`} />
      
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teal-700">🎵 {park.name} オーケストラ</h1>
              <p className="text-sm text-slate-600">雨音に包まれた音の庭園</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant="outline"
                size="sm"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={togglePlay}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? '停止' : '音楽開始'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* メインキャンバス */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🌱</span>
                  <span>音の種が植えられた公園マップ</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={park.width}
                    height={park.height}
                    className="w-full border border-teal-200 rounded-lg bg-gradient-to-br from-green-50 to-teal-50 cursor-pointer"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const scaleX = park.width / rect.width
                      const scaleY = park.height / rect.height
                      const mouseX = (e.clientX - rect.left) * scaleX
                      const mouseY = (e.clientY - rect.top) * scaleY
                      
                      const hoveredSeed = soundSeeds.find(seed => {
                        const distance = Math.sqrt((mouseX - seed.x) ** 2 + (mouseY - seed.y) ** 2)
                        return distance < 30
                      })
                      
                      setHoveredSeed(hoveredSeed?.id || null)
                    }}
                    onMouseLeave={() => setHoveredSeed(null)}
                  />
                  
                  {hoveredSeed && (
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      {(() => {
                        const seed = soundSeeds.find(s => s.id === hoveredSeed)!
                        return (
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{seed.sound_source.icon_path}</span>
                              <span className="font-medium text-teal-700">{seed.sound_source.name}</span>
                            </div>
                            <Badge className={getGrowthStageColor(seed.growth_stage)}>
                              {getGrowthStageText(seed.growth_stage)}
                            </Badge>
                            <p className="text-xs text-slate-600 mt-1">
                              {seed.sound_source.description}
                            </p>
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-slate-600">
                    {isPlaying ? '🎵 音楽が流れています...' : 'マップ上の音符にマウスを重ねると詳細が見られます'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* サイドパネル */}
          <div className="space-y-6">
            {/* 位置情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-teal-700">
                  <MapPin className="h-5 w-5" />
                  <span>現在地情報</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {locationError ? (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-700">{locationError}</p>
                  </div>
                ) : currentLocation ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">緯度</span>
                      <span className="font-mono text-xs">{currentLocation.latitude.toFixed(6)}°</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">経度</span>
                      <span className="font-mono text-xs">{currentLocation.longitude.toFixed(6)}°</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">精度</span>
                      <span className="font-mono text-xs">±{Math.round(currentLocation.accuracy)}m</span>
                    </div>
                    {distanceFromPark !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">公園までの距離</span>
                        <span className="font-mono text-xs">{Math.round(distanceFromPark)}m</span>
                      </div>
                    )}
                    <div className={`mt-3 p-3 rounded-lg ${isNearPark ? 'bg-teal-50' : 'bg-yellow-50'}`}>
                      <p className={`text-xs ${isNearPark ? 'text-teal-700' : 'text-yellow-700'}`}>
                        {isNearPark 
                          ? '🎵 公園の音楽が聞こえる範囲にいます' 
                          : '📍 公園から100m以内に近づくと音楽が聞こえます'
                        }
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center p-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-teal-600"></div>
                    <span className="ml-2 text-sm">位置情報を取得中...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 天候情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-teal-700">
                  <CloudRain className="h-5 w-5" />
                  <span>現在の天候</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">気温</span>
                  </div>
                  <span className="font-medium">{weather.temperature}°C</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CloudRain className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">降水量</span>
                  </div>
                  <span className="font-medium">{weather.rain_level}mm/h</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">風速</span>
                  </div>
                  <span className="font-medium">{weather.wind_speed}m/s</span>
                </div>

                <div className="mt-3 p-3 bg-teal-50 rounded-lg">
                  <p className="text-xs text-teal-700">
                    🌧️ 雨音がオーケストラのテンポを決定し、
                    風がリバーブを加えています
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 植えられた音の種一覧 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-teal-700">植えられた音の種</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {soundSeeds.map(seed => (
                  <div 
                    key={seed.id} 
                    className={`p-3 rounded-lg border transition-colors ${
                      hoveredSeed === seed.id 
                        ? 'border-teal-300 bg-teal-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span>{seed.sound_source.icon_path}</span>
                        <span className="font-medium text-sm">{seed.sound_source.name}</span>
                      </div>
                      <Badge className={getGrowthStageColor(seed.growth_stage)} variant="secondary">
                        {getGrowthStageText(seed.growth_stage)}
                      </Badge>
                    </div>
                    
                    {seed.is_grown && isPlaying && (
                      <div className="flex items-center space-x-2 text-xs text-teal-600">
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                        <span>演奏中...</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 説明セクション */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-teal-700">KODAMAについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🌱</div>
                <h4 className="font-medium text-teal-700 mb-2">音の種を植える</h4>
                <p className="text-sm text-slate-600">
                  公園の好きな場所に音源を配置し、時間とともに成長させます
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🌧️</div>
                <h4 className="font-medium text-teal-700 mb-2">天候で音楽が変化</h4>
                <p className="text-sm text-slate-600">
                  雨量、風速、気温によってテンポや音色がリアルタイムで変化します
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🎵</div>
                <h4 className="font-medium text-teal-700 mb-2">自然のオーケストラ</h4>
                <p className="text-sm text-slate-600">
                  複数の音源が協調して奏でる、世界に一つだけの音楽体験
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default MusicDemo