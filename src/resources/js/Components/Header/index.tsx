import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Navigation, Menu, Cloud, MapPin, Music, QrCode } from 'lucide-react'
// import { KodamaIcon } from '../../assets/kodama-icon'

interface HeaderProps {
    currentScreen: string
    onNavigate: (screen: 'home' | 'map' | 'sounds' | 'shop') => void
    currentLocation: { latitude: number; longitude: number } | null
    audibleSeeds: number
    weatherRainfall: number
}

export const Header: React.FC<HeaderProps> = ({
    currentScreen,
    onNavigate,
    currentLocation,
    audibleSeeds,
    weatherRainfall
}) => {
    const getTempoFromRainfall = (rainfall: number) => {
        if (rainfall < 1) return 'Andante'
        if (rainfall < 5) return 'Moderato'
        if (rainfall < 10) return 'Allegro'
        return 'Presto'
    }

    return (
        <header className="sticky top-0 z-50 border-b border-primary/20 bg-white/90 backdrop-blur-sm">
            <div className="mx-auto max-w-6xl px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* ロゴエリア */}
                    <div
                        className="group flex cursor-pointer items-center space-x-3"
                        onClick={() => onNavigate('home')}
                    >
                        {/* <div className="h-10 w-10 overflow-hidden rounded-xl transition-transform group-hover:scale-105">
              <KodamaIcon className="h-full w-full" />
            </div> */}
                        <div className="h-10 w-10 overflow-hidden rounded-xl transition-transform group-hover:scale-105">
                            <img className='h-full w-full' src="/images/icon.png" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-primary">KODAMA</h1>
                            {/* <p className="text-xs text-muted-foreground">木霊 </p> */}
                        </div>
                    </div>

                    {/* 中央ナビゲーション */}
                    <nav className="hidden items-center space-x-2 md:flex">
                        <Button
                            variant={currentScreen === 'map' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onNavigate('map')}
                            className="rounded-full"
                            disabled={!currentLocation}
                        >
                            <MapPin className="mr-2 h-4 w-4" />
                            公園マップ
                        </Button>
                        <Button
                            variant={currentScreen === 'sounds' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onNavigate('sounds')}
                            className="rounded-full"
                        >
                            <Music className="mr-2 h-4 w-4" />
                            音の種
                        </Button>
                        <Button
                            variant={currentScreen === 'shop' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onNavigate('shop')}
                            className="rounded-full"
                        >
                            <QrCode className="mr-2 h-4 w-4" />
                            タネ取得
                        </Button>
                    </nav>

                    {/* 右側ステータス */}
                    <div className="flex items-center space-x-3">
                        {/* 天候表示 */}
                        <div className="hidden items-center space-x-2 sm:flex">
                            <div className="flex items-center space-x-1">
                                <Cloud className="h-4 w-4 text-primary" />
                                <span className="text-sm text-primary">{weatherRainfall}mm</span>
                            </div>
                            <Badge variant="secondary" className="bg-accent/20 text-xs text-primary">
                                {getTempoFromRainfall(weatherRainfall)}
                            </Badge>
                        </div>

                        {/* 現在地ステータス */}
                        {currentLocation && (
                            <div className="hidden items-center space-x-2 sm:flex">
                                <Navigation className="h-4 w-4 text-primary" />
                                <Badge variant="outline" className="text-xs">
                                    {audibleSeeds}個の音
                                </Badge>
                            </div>
                        )}

                        {/* モバイルメニュー */}
                        <Button variant="ghost" size="sm" className="md:hidden">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* モバイル用ナビゲーション */}
                {currentScreen !== 'home' && (
                    <div className="mt-3 flex justify-center space-x-2 md:hidden">
                        <Button
                            variant={currentScreen === 'map' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onNavigate('map')}
                            className="flex-1 rounded-full text-xs"
                            disabled={!currentLocation}
                        >
                            <MapPin className="mr-1 h-3 w-3" />
                            マップ
                        </Button>
                        <Button
                            variant={currentScreen === 'sounds' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onNavigate('sounds')}
                            className="flex-1 rounded-full text-xs"
                        >
                            <Music className="mr-1 h-3 w-3" />
                            音の種
                        </Button>
                        <Button
                            variant={currentScreen === 'shop' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onNavigate('shop')}
                            className="flex-1 rounded-full text-xs"
                        >
                            <QrCode className="mr-1 h-3 w-3" />
                            タネ取得
                        </Button>
                    </div>
                )}
            </div>

            {/* 雨のエフェクト */}
            {weatherRainfall > 1 && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {[...Array(Math.min(Math.floor(weatherRainfall), 10))].map((_, i) => (
                        <div
                            key={i}
                            className="rain-animation absolute h-4 w-0.5 bg-primary/20"
                            style={{
                                left: `${10 + (i * 8)}%`,
                                animationDelay: `${i * 0.2}s`
                            }}
                        />
                    ))}
                </div>
            )}
        </header>
    )
}
