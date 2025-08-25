import React, { useState, useEffect } from "react"
import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { SoundSeed } from "./components/SoundSeed"
import { QRCodeScanner } from "./components/QRCodeScanner"
import {
  MapPin,
  Music,
  ShoppingBag,
  Play,
  CloudRain,
  Wind,
  Thermometer,
  Zap,
  Navigation,
  Volume2,
  VolumeX,
  TreePine,
  Sparkles,
  QrCode,
} from "lucide-react"
import kodamaIcon from "figma:asset/5d5d28adfb21f164d4303f37997e9dbfb28e8ea3.png"

// 音源タイプの定義
type SoundType = {
  id: string;
  name: string;
  icon: string;
  isPaid: boolean;
  purchased: boolean;
};

// 位置情報の定義
type Location = {
  latitude: number;
  longitude: number;
};

// 植えられた音の種の定義（位置情報を緯度経度で管理）
type PlantedSeed = {
  id: string;
  location: Location;
  soundType: SoundType;
  timestamp: Date;
};

// 天候データの定義
type WeatherData = {
  temperature: number;
  rainfall: number;
  windSpeed: number;
  hasThunder: boolean;
};

// 音源パックの定義
type SoundPack = {
  id: string;
  name: string;
  description: string;
  sounds: string[];
  purchased: boolean;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "map" | "sounds" | "shop" | "playing"
  >("home")
  const [plantedSeeds, setPlantedSeeds] = useState<
    PlantedSeed[]
  >([])
  const [selectedSoundType, setSelectedSoundType] =
    useState<SoundType | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [purchasedPacks, setPurchasedPacks] = useState<
    string[]
  >([])
  const [currentLocation, setCurrentLocation] =
    useState<Location | null>(null)
  const [locationError, setLocationError] = useState<
    string | null
  >(null)
  const [audibleSeeds, setAudibleSeeds] = useState<
    PlantedSeed[]
  >([])
  const [scanningPackId, setScanningPackId] = useState<string | null>(null)

  // 位置情報を取得
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setLocationError(null)
        },
        (error) => {
          // デモ用のモック位置（東京駅周辺）
          setCurrentLocation({
            latitude: 35.6812,
            longitude: 139.7671,
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    } else {
      setLocationError(
        "このブラウザは位置情報に対応していません。",
      )
      // デモ用のモック位置
      setCurrentLocation({
        latitude: 35.6812,
        longitude: 139.7671,
      })
    }
  }, [])

  // 天候データ（モック）
  const weatherData: WeatherData = {
    temperature: 18,
    rainfall: 2.5,
    windSpeed: 8,
    hasThunder: false,
  }

  // 基本音源（無料）
  const basicSounds: SoundType[] = [
    {
      id: "piano",
      name: "ピアノ",
      icon: "🎹",
      isPaid: false,
      purchased: true,
    },
    {
      id: "harp",
      name: "ハープ",
      icon: "🪕",
      isPaid: false,
      purchased: true,
    },
    {
      id: "pad",
      name: "シンセパッド",
      icon: "🎛️",
      isPaid: false,
      purchased: true,
    },
  ]

  // 音源パック（QRコードで無料取得）
  const soundPacks: SoundPack[] = [
    {
      id: "japanese",
      name: "和楽器セット",
      description: "伝統的な日本の楽器で奏でる、風雅な音の世界",
      sounds: ["琴", "尺八", "太鼓", "鈴"],
      purchased: purchasedPacks.includes("japanese"),
    },
    {
      id: "synth80s",
      name: "80'sシンセセット",
      description: "ノスタルジックな80年代のシンセサイザーサウンド",
      sounds: ["DX7", "Jupiter", "Juno", "Moog"],
      purchased: purchasedPacks.includes("synth80s"),
    },
    {
      id: "nature",
      name: "自然音セット",
      description: "森の中に響く、自然が奏でる美しいハーモニー",
      sounds: ["鳥のさえずり", "水の音", "風の音", "虫の声"],
      purchased: purchasedPacks.includes("nature"),
    },
  ]

  // 2点間の距離を計算（Haversine公式）
  const calculateDistance = (
    loc1: Location,
    loc2: Location,
  ): number => {
    const R = 6371000 // 地球の半径（メートル）
    const φ1 = (loc1.latitude * Math.PI) / 180
    const φ2 = (loc2.latitude * Math.PI) / 180
    const Δφ =
      ((loc2.latitude - loc1.latitude) * Math.PI) / 180
    const Δλ =
      ((loc2.longitude - loc1.longitude) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) *
        Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // 100m圏内の音の種をフィルタリング
  useEffect(() => {
    if (currentLocation) {
      const nearby = plantedSeeds.filter(
        (seed) =>
          calculateDistance(currentLocation, seed.location) <=
          100,
      )
      setAudibleSeeds(nearby)
    }
  }, [currentLocation, plantedSeeds])

  // 天候に基づくテンポ計算
  const getTempoFromWeather = () => {
    const baseRainfall = weatherData.rainfall
    if (baseRainfall < 1) return "Andante（歩くように）"
    if (baseRainfall < 5) return "Moderato（中程度）"
    if (baseRainfall < 10) return "Allegro（快速）"
    return "Presto（急速）"
  }

  // 現在地に音の種を植える関数
  const plantSeedAtCurrentLocation = () => {
    if (!selectedSoundType || !currentLocation) return

    const newSeed: PlantedSeed = {
      id: Date.now().toString(),
      location: currentLocation,
      soundType: selectedSoundType,
      timestamp: new Date(),
    }

    setPlantedSeeds([...plantedSeeds, newSeed])
  }

  // QRコードスキャン成功時の処理
  const handleScanSuccess = (packId: string) => {
    setPurchasedPacks([...purchasedPacks, packId])
  }

  // 座標を画面上の位置に変換（簡易版）
  const locationToScreenPosition = (
    location: Location,
    currentLoc: Location,
  ) => {
    const latDiff =
      (location.latitude - currentLoc.latitude) * 100000
    const lngDiff =
      (location.longitude - currentLoc.longitude) * 100000

    return {
      x: 50 + lngDiff * 1000,
      y: 50 - latDiff * 1000,
    }
  }

  // ナビゲーション関数
  const handleNavigate = (
    screen: "home" | "map" | "sounds" | "shop",
  ) => {
    setCurrentScreen(screen)
  }

  // ホーム画面
  const HomeScreen = () => (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-secondary/30"></div>
        <div className="absolute left-0 top-0 h-full w-full">
          {/* 浮遊する装飾要素 */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce opacity-20"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + (i % 2)}s`,
              }}
            >
              <TreePine className="h-6 w-6 text-primary" />
            </div>
          ))}
        </div>

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
          <div className="max-w-lg space-y-8 text-center">
            {/* メインロゴ */}
            <div className="mb-6 flex justify-center">
              <div className="spirit-glow h-32 w-32 overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src={kodamaIcon}
                  alt="KODAMA"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-primary">
                KODAMA
              </h1>
              <p className="text-2xl text-primary/80">木霊</p>
              <div className="space-y-2">
                <p className="text-xl leading-relaxed text-primary/70">
                  公園を、音で満たす新体験
                </p>
                <p className="text-lg text-muted-foreground">
                  天候が指揮する、あなただけのオーケストラ
                </p>
              </div>
            </div>

            {/* ステータス表示 */}
            <div className="space-y-3">
              {locationError && (
                <Card className="border-destructive/20 bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">
                    {locationError}
                  </p>
                </Card>
              )}

              {currentLocation && (
                <Card className="border-primary/20 bg-primary/10 p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Navigation className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary">
                      現在地を取得しました
                    </span>
                    <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                  </div>
                </Card>
              )}
            </div>

            {/* メインアクション */}
            <div className="mt-12 space-y-4">
              <Button
                onClick={() => setCurrentScreen("map")}
                className="w-full rounded-2xl bg-primary py-6 text-lg text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
                disabled={!currentLocation}
              >
                <MapPin className="mr-3 h-6 w-6" />
                公園へ入る
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setCurrentScreen("sounds")}
                  variant="outline"
                  className="rounded-xl border-primary/30 py-4 text-primary hover:bg-primary/5"
                >
                  <Music className="mr-2 h-5 w-5" />
                  音の種を選ぶ
                </Button>

                <Button
                  onClick={() => setCurrentScreen("shop")}
                  variant="outline"
                  className="rounded-xl border-primary/30 py-4 text-primary hover:bg-primary/5"
                >
                  <QrCode className="mr-2 h-5 w-5" />
                  売店でタネ取得
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // 公園マップ画面
  const ParkMapScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge
              variant="secondary"
              className="bg-accent/30 px-3 py-1 text-primary"
            >
              <CloudRain className="mr-2 h-4 w-4" />
              {getTempoFromWeather()}
            </Badge>
            <Badge
              variant="outline"
              className="border-primary/30 px-3 py-1 text-primary"
            >
              <Volume2 className="mr-2 h-4 w-4" />
              {audibleSeeds.length}個の音が聞こえます
            </Badge>
          </div>

          {audibleSeeds.length > 0 && (
            <Button
              onClick={() => {
                setIsPlaying(!isPlaying)
                if (!isPlaying) setCurrentScreen("playing")
              }}
              className="rounded-xl bg-primary px-6 hover:bg-primary/90"
            >
              <Play className="mr-2 h-4 w-4" />
              {isPlaying ? "停止" : "演奏開始"}
            </Button>
          )}
        </div>

        <Card className="rounded-3xl border-primary/10 bg-white/70 p-8 shadow-xl backdrop-blur-sm">
          <h2 className="mb-6 text-2xl text-primary">
            公園マップ（半径100m圏内）
          </h2>

          {/* 公園マップエリア */}
          <div className="relative h-96 w-full overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-accent/30 via-secondary/20 to-primary/10">
            {/* 現在地表示 */}
            {currentLocation && (
              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform">
                <div className="spirit-glow h-6 w-6 rounded-full border-4 border-white bg-primary shadow-lg">
                  <div className="m-1 h-2 w-2 animate-ping rounded-full bg-primary/70"></div>
                </div>
                <span className="absolute left-1/2 top-8 -translate-x-1/2 transform whitespace-nowrap rounded-full bg-white/80 px-2 py-1 text-xs font-medium text-primary">
                  現在地
                </span>
              </div>
            )}

            {/* 100m範囲表示 */}
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 border-dashed border-primary/30"></div>

            {/* 植えられた音の種を表示（100m圏内のみ） */}
            {audibleSeeds.map((seed) => {
              if (!currentLocation) return null
              const distance = calculateDistance(
                currentLocation,
                seed.location,
              )
              const position = locationToScreenPosition(
                seed.location,
                currentLocation,
              )

              return (
                <div
                  key={seed.id}
                  className="absolute z-20 cursor-pointer transition-transform hover:scale-125"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(${Math.min(Math.max(position.x - 50, -45), 45)}%, ${Math.min(Math.max(position.y - 50, -45), 45)}%)`,
                  }}
                  title={`${seed.soundType.name} (${Math.round(distance)}m)`}
                >
                  <SoundSeed 
                    soundType={seed.soundType} 
                    size="medium" 
                    showGlow={true}
                  />
                </div>
              )
            })}

            {/* 圏外の音の種（薄く表示） */}
            {plantedSeeds
              .filter(
                (seed) =>
                  currentLocation &&
                  calculateDistance(
                    currentLocation,
                    seed.location,
                  ) > 100,
              )
              .map((seed) => {
                if (!currentLocation) return null
                const distance = calculateDistance(
                  currentLocation,
                  seed.location,
                )

                return (
                  <div
                    key={seed.id}
                    className="absolute cursor-pointer opacity-20"
                    style={{
                      left: "15%",
                      top: "15%",
                    }}
                    title={`${seed.soundType.name} (${Math.round(distance)}m - 圏外)`}
                  >
                    <SoundSeed 
                      soundType={seed.soundType} 
                      size="small"
                    />
                  </div>
                )
              })}

            {/* 指示メッセージ */}
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <Card className="border-primary/20 bg-white/80 p-3">
                <p className="text-sm text-primary">
                  現在地周辺に音の種を植えることができます
                </p>
              </Card>
            </div>

            {/* 雨のエフェクト */}
            {weatherData.rainfall > 1 && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {[
                  ...Array(
                    Math.min(
                      Math.floor(weatherData.rainfall * 2),
                      15,
                    ),
                  ),
                ].map((_, i) => (
                  <div
                    key={i}
                    className="rain-animation absolute h-6 w-0.5 bg-primary/20"
                    style={{
                      left: `${5 + i * 6}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                選択中の音:{" "}
                {selectedSoundType ? (
                  <Badge variant="secondary" className="ml-2">
                    {selectedSoundType.name}
                  </Badge>
                ) : (
                  <span className="text-primary">
                    音を選択してください
                  </span>
                )}
              </span>
              <Button
                onClick={() => setCurrentScreen("sounds")}
                variant="outline"
                size="sm"
                className="rounded-xl border-primary/30 text-primary"
              >
                音を選ぶ
              </Button>
            </div>

            <Button
              onClick={plantSeedAtCurrentLocation}
              disabled={!selectedSoundType || !currentLocation}
              className="rounded-xl bg-primary px-6 hover:bg-primary/90"
            >
              <MapPin className="mr-2 h-4 w-4" />
              現在地に植える
            </Button>
          </div>

          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-4 rounded-full bg-secondary/20 px-4 py-2 text-xs text-muted-foreground">
              <span>植えた音の種: {plantedSeeds.length}個</span>
              <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
              <span>
                聞こえる音: {audibleSeeds.length}個（100m圏内）
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  // 音選択画面
  const SoundSelectionScreen = () => {
    const availableSounds = [
      ...basicSounds,
      ...soundPacks
        .filter((pack) => pack.purchased)
        .flatMap((pack) =>
          pack.sounds.map((sound) => ({
            id: `${pack.id}_${sound}`,
            name: sound,
            icon: "🎵",
            isPaid: true,
            purchased: true,
          })),
        ),
    ]

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Card className="rounded-3xl border-primary/10 bg-white/70 p-8 shadow-xl backdrop-blur-sm">
            <h2 className="mb-6 text-2xl text-primary">
              音の種を選択
            </h2>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {availableSounds.map((sound) => (
                <Button
                  key={sound.id}
                  onClick={() => {
                    setSelectedSoundType(sound)
                    setCurrentScreen("map")
                  }}
                  variant={
                    selectedSoundType?.id === sound.id
                      ? "default"
                      : "outline"
                  }
                  className={`flex h-auto flex-col items-center space-y-4 rounded-2xl p-6 transition-all hover:scale-105 ${
                    selectedSoundType?.id === sound.id
                      ? "bg-primary text-white shadow-lg"
                      : "border-primary/20 hover:bg-primary/5"
                  }`}
                >
                  <SoundSeed 
                    soundType={sound} 
                    size="large" 
                    showGlow={selectedSoundType?.id === sound.id}
                  />
                  <div className="space-y-1 text-center">
                    <span className="block text-sm font-medium">
                      {sound.name}
                    </span>
                    {sound.isPaid && (
                      <Badge
                        variant="secondary"
                        className="bg-accent/30 text-xs text-primary"
                      >
                        取得済み
                      </Badge>
                    )}
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button
                onClick={() => setCurrentScreen("shop")}
                variant="outline"
                className="rounded-xl border-primary/30 px-6 text-primary hover:bg-primary/5"
              >
                <QrCode className="mr-2 h-4 w-4" />
                売店で新しい音のタネを取得
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // 売店画面
  const ShopScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6">
          <Card className="rounded-2xl border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center space-x-3">
              <QrCode className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-xl text-primary">売店 - 音のタネ取得</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  公園内の売店にあるQRコードを読み取って、無料で音のタネを手に入れましょう
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6">
          {soundPacks.map((pack) => (
            <div key={pack.id}>
              {pack.purchased ? (
                <Card className="rounded-2xl border-primary/10 bg-white/50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        {pack.sounds.slice(0, 3).map((sound, index) => (
                          <SoundSeed
                            key={index}
                            soundType={{
                              id: `${pack.id}_${sound}`,
                              name: sound,
                              icon: "🎵",
                              isPaid: true,
                              purchased: true,
                            }}
                            size="small"
                            showGlow={true}
                          />
                        ))}
                        {pack.sounds.length > 3 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                            +{pack.sounds.length - 3}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-medium text-primary">
                          {pack.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {pack.description}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 px-4 py-2 text-primary">
                      <Sparkles className="mr-2 h-4 w-4" />
                      取得済み
                    </Badge>
                  </div>
                </Card>
              ) : (
                <QRCodeScanner
                  packId={pack.id}
                  packName={pack.name}
                  sounds={pack.sounds}
                  onScanSuccess={handleScanSuccess}
                  isScanning={scanningPackId === pack.id}
                  onStartScan={() => setScanningPackId(pack.id)}
                  onStopScan={() => setScanningPackId(null)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 音楽再生画面
  const PlayingScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-primary/10">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={() => setCurrentScreen("map")}
            variant="outline"
            className="rounded-xl border-primary/30 text-primary"
          >
            ← マップに戻る
          </Button>

          <Button
            onClick={() => setIsPlaying(false)}
            variant="destructive"
            className="rounded-xl"
          >
            演奏停止
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 天候情報 */}
          <Card className="rounded-2xl border-primary/10 bg-white/70 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg text-primary">
              現在の天候
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 rounded-xl bg-secondary/20 p-3">
                <Thermometer className="h-5 w-5 text-red-500" />
                <span>
                  {weatherData.temperature}°C → 短調で演奏
                </span>
              </div>
              <div className="flex items-center space-x-3 rounded-xl bg-secondary/20 p-3">
                <CloudRain className="h-5 w-5 text-primary" />
                <span>
                  {weatherData.rainfall}mm →{" "}
                  {getTempoFromWeather()}
                </span>
              </div>
              <div className="flex items-center space-x-3 rounded-xl bg-secondary/20 p-3">
                <Wind className="h-5 w-5 text-gray-500" />
                <span>
                  {weatherData.windSpeed}m/s → リバーブ効果
                </span>
              </div>
              {weatherData.hasThunder && (
                <div className="flex items-center space-x-3 rounded-xl bg-secondary/20 p-3">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>雷 → アクセント強調</span>
                </div>
              )}
            </div>
          </Card>

          {/* 聞こえる音の種 */}
          <Card className="rounded-2xl border-primary/10 bg-white/70 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg text-primary">
              100m圏内の音の種
            </h3>
            <div className="max-h-64 space-y-3 overflow-y-auto">
              {audibleSeeds.map((seed, index) => {
                const distance = currentLocation
                  ? Math.round(
                      calculateDistance(
                        currentLocation,
                        seed.location,
                      ),
                    )
                  : 0
                return (
                  <div
                    key={seed.id}
                    className="flex animate-pulse items-center space-x-3 rounded-xl bg-primary/5 p-3"
                  >
                    <SoundSeed 
                      soundType={seed.soundType} 
                      size="small" 
                      showGlow={true}
                    />
                    <span className="flex-1 font-medium">
                      {seed.soundType.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      {distance}m
                    </Badge>
                    <div className="h-3 w-3 animate-ping rounded-full bg-primary"></div>
                  </div>
                )
              })}

              {audibleSeeds.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <VolumeX className="mx-auto mb-3 h-12 w-12 opacity-50" />
                  <p>100m圏内に音の種がありません</p>
                  <p className="mt-1 text-sm">
                    音の種を植えて演奏を始めましょう
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* 演奏可視化 */}
        <Card className="mt-6 rounded-2xl border-primary/10 bg-white/70 p-8 backdrop-blur-sm">
          <h3 className="mb-6 text-lg text-primary">
            現在地オーケストラ
          </h3>
          <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-accent/30 via-primary/10 to-secondary/30">
            <div className="z-10 text-center">
              {audibleSeeds.length > 0 ? (
                <>
                  <div className="mb-4 flex justify-center space-x-3">
                    {audibleSeeds.slice(0, 8).map((seed, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className="mb-1 w-3 animate-bounce rounded-full bg-primary shadow-lg"
                          style={{
                            height: `${Math.random() * 60 + 20}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        ></div>
                        <SoundSeed 
                          soundType={seed.soundType} 
                          size="small"
                          className="opacity-60"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-lg font-medium text-primary">
                    ♪ {audibleSeeds.length}
                    個の音の種が響いています ♪
                  </p>
                </>
              ) : (
                <div>
                  <Volume2 className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    音の種を植えて演奏を始めましょう
                  </p>
                </div>
              )}
            </div>

            {/* 背景の装飾波 */}
            {audibleSeeds.length > 0 && (
              <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 animate-ping rounded-2xl border-2 border-primary/20"
                    style={{
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: "2s",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )

  // 画面レンダリング
  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen />
      case "map":
        return <ParkMapScreen />
      case "sounds":
        return <SoundSelectionScreen />
      case "shop":
        return <ShopScreen />
      case "playing":
        return <PlayingScreen />
      default:
        return <HomeScreen />
    }
  }

  return (
    <div className="min-h-screen">
      {/* ヘッダー（ホーム画面以外で表示） */}
      {currentScreen !== "home" && (
        <Header
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          currentLocation={currentLocation}
          audibleSeeds={audibleSeeds.length}
          weatherRainfall={weatherData.rainfall}
        />
      )}

      {/* メインコンテンツ */}
      <main>{renderScreen()}</main>

      {/* フッター（ホーム画面以外で表示） */}
      {currentScreen !== "home" && <Footer />}
    </div>
  )
}