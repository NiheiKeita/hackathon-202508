import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import { Park, SoundSeed, WeatherData } from '../../../types/kodama'
import { useParkHooks } from './hooks'
import ParkMap from './components/ParkMap'
import SoundSeedModal from './components/SoundSeedModal'
// import AudioControlPanel from '../../../components/AudioControlPanel'
// import AudioVisualizer from '../../../components/AudioVisualizer'
// import WeatherMusicDisplay from '../../../components/WeatherMusicDisplay'
// import WeatherSimulator from '../../../components/WeatherSimulator'
import { useWeatherEffects } from '../../../hooks/useWeatherEffects'
import WeatherSimulator from '@/Components/WeatherSimulator'
import AudioControlPanel from '@/Components/AudioControlPanel'
import AudioVisualizer from '@/Components/AudioVisualizer'
import WeatherMusicDisplay from '@/Components/WeatherMusicDisplay'

interface Props {
    park: Park;
    soundSeeds: SoundSeed[];
    weather: WeatherData;
}

const KodamaPark: React.FC<Props> = ({ park, soundSeeds: initialSoundSeeds, weather: initialWeather }) => {
    const [showAudioControls, setShowAudioControls] = useState(false)
    const [showVisualizer, setShowVisualizer] = useState(false)
    const [showWeatherSimulator, setShowWeatherSimulator] = useState(false)

    const {
        soundSeeds,
        weather,
        selectedSoundSource,
        isPlantingMode,
        showSeedModal,
        selectedSeed,
        userSoundSources,
        loading,
        error,
        handleMapClick,
        handleSeedClick,
        startPlanting,
        stopPlanting,
        closeSeedModal,
        deleteSeed,
        updateSeed,
    } = useParkHooks(park, initialSoundSeeds, initialWeather)

    const { updateWeather } = useWeatherEffects()

    // 初期化時に天候効果を適用
    React.useEffect(() => {
        if (weather) {
            updateWeather(weather, true)
        }
    }, [weather, updateWeather])

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
            <Head title={`${park.name} - KODAMA`} />

            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/kodama"
                                className="flex items-center space-x-2 text-green-600 hover:text-green-800"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                <span>戻る</span>
                            </Link>
                            <h1 className="text-2xl font-bold text-green-800">{park.name}</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowVisualizer(!showVisualizer)}
                                className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm transition-colors ${showVisualizer
                                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                <span>📊</span>
                                <span>可視化</span>
                            </button>

                            <button
                                onClick={() => setShowAudioControls(!showAudioControls)}
                                className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm transition-colors ${showAudioControls
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                <span>🎛️</span>
                                <span>音楽操作</span>
                            </button>

                            <button
                                onClick={() => setShowWeatherSimulator(!showWeatherSimulator)}
                                className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm transition-colors ${showWeatherSimulator
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                <span>🌦️</span>
                                <span>天候実験</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {error && (
                    <div className="mb-6 rounded-lg border border-red-300 bg-red-100 p-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* オーディオビジュアライザー */}
                {showVisualizer && (
                    <div className="mb-6">
                        <AudioVisualizer
                            isVisible={showVisualizer}
                            className="w-full"
                        />
                    </div>
                )}

                {/* オーディオコントロールパネル */}
                {showAudioControls && (
                    <div className="mb-6">
                        <AudioControlPanel
                            className="w-full"
                            showAdvanced={true}
                        />
                    </div>
                )}

                {/* 天候シミュレーター */}
                {showWeatherSimulator && (
                    <div className="mb-6">
                        <WeatherSimulator
                            currentWeather={initialWeather}
                            onWeatherChange={updateWeather}
                            className="w-full"
                        />
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-4">
                    {/* メインマップエリア */}
                    <div className="lg:col-span-3">
                        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                            <div className="border-b p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-green-800">
                                        公園マップ - 音の種を植えよう
                                    </h2>

                                    {!isPlantingMode ? (
                                        <button
                                            onClick={startPlanting}
                                            className="flex items-center space-x-2 rounded-lg bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700"
                                        >
                                            <span>🌱</span>
                                            <span>音を植える</span>
                                        </button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <span className="rounded-lg bg-green-100 px-4 py-2 text-sm text-green-800">
                                                クリックして種を植える
                                            </span>
                                            <button
                                                onClick={stopPlanting}
                                                className="rounded-lg bg-gray-500 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600"
                                            >
                                                キャンセル
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {park.description && (
                                    <p className="mt-2 text-gray-600">{park.description}</p>
                                )}
                            </div>

                            <ParkMap
                                park={park}
                                soundSeeds={soundSeeds}
                                isPlantingMode={isPlantingMode}
                                selectedSoundSource={selectedSoundSource}
                                onMapClick={handleMapClick}
                                onSeedClick={handleSeedClick}
                                weather={weather}
                            />
                        </div>
                    </div>

                    {/* サイドバー */}
                    <div className="space-y-6">
                        {/* 天候と音楽効果表示 */}
                        <WeatherMusicDisplay
                            weather={weather}
                            showMusicEffects={true}
                        />

                        {/* 統計情報 */}
                        <div className="rounded-xl bg-white p-6 shadow-lg">
                            <h3 className="mb-4 text-lg font-bold text-green-800">
                                公園の音
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">植えられた音の種</span>
                                    <span className="font-bold text-green-700">{soundSeeds.length}個</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">現在のテンポ</span>
                                    <span className="font-bold text-blue-700">
                                        {Math.round(120 * weather.tempo_multiplier)} BPM
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">調性</span>
                                    <span className="font-bold text-purple-700">
                                        {weather.is_major_key ? '長調 (明るい)' : '短調 (暗い)'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* クイックアクション */}
                        <div className="rounded-xl bg-white p-6 shadow-lg">
                            <h3 className="mb-4 text-lg font-bold text-green-800">
                                クイックアクション
                            </h3>

                            <div className="space-y-3">
                                <Link
                                    href="/kodama/sound-sources"
                                    className="flex w-full items-center space-x-3 rounded-lg border-2 border-green-200 px-4 py-3 transition-all hover:border-green-400 hover:bg-green-50"
                                >
                                    <span className="text-2xl">🎵</span>
                                    <div>
                                        <div className="font-medium text-green-700">音の種を選ぶ</div>
                                        <div className="text-sm text-gray-600">新しい音源を追加</div>
                                    </div>
                                </Link>

                                <Link
                                    href="/kodama/shop"
                                    className="flex w-full items-center space-x-3 rounded-lg border-2 border-orange-200 px-4 py-3 transition-all hover:border-orange-400 hover:bg-orange-50"
                                >
                                    <span className="text-2xl">🏪</span>
                                    <div>
                                        <div className="font-medium text-orange-700">売店へ行く</div>
                                        <div className="text-sm text-gray-600">特別音源を購入</div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 音の種詳細モーダル */}
            {showSeedModal && selectedSeed && (
                <SoundSeedModal
                    seed={selectedSeed}
                    onClose={closeSeedModal}
                    onDelete={deleteSeed}
                    onUpdate={updateSeed}
                />
            )}

            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex items-center space-x-4 rounded-lg bg-white p-6">
                        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-green-600"></div>
                        <span>処理中...</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default KodamaPark
