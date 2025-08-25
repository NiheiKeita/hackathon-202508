import { useState, useEffect, useCallback } from 'react'
import { Park, SoundSeed, WeatherData, SoundSource } from '../../../types/kodama'
import { useKodamaApi } from '../../../hooks/useKodamaApi'

export const useParkHooks = (
  park: Park,
  initialSoundSeeds: SoundSeed[],
  initialWeather: WeatherData
) => {
  const [soundSeeds, setSoundSeeds] = useState<SoundSeed[]>(initialSoundSeeds)
  const [weather, setWeather] = useState<WeatherData>(initialWeather)
  const [selectedSoundSource, setSelectedSoundSource] = useState<SoundSource | null>(null)
  const [isPlantingMode, setIsPlantingMode] = useState(false)
  const [showSeedModal, setShowSeedModal] = useState(false)
  const [selectedSeed, setSelectedSeed] = useState<SoundSeed | null>(null)
  const [userSoundSources, setUserSoundSources] = useState<SoundSource[]>([])
  
  const {
    getUserSoundSources,
    plantSoundSeed,
    deleteSoundSeed,
    updateSoundSeed,
    getCurrentWeather,
    getParkSoundSeeds,
    loading,
    error,
  } = useKodamaApi()

  // ユーザーの利用可能音源を取得
  useEffect(() => {
    const fetchUserSoundSources = async () => {
      const sources = await getUserSoundSources()
      if (sources) {
        setUserSoundSources(sources)
      }
    }

    fetchUserSoundSources()
  }, [getUserSoundSources])

  // 天候データを定期的に更新
  useEffect(() => {
    const updateWeatherData = async () => {
      const currentWeather = await getCurrentWeather(park.id)
      if (currentWeather) {
        setWeather(currentWeather)
      }
    }

    const interval = setInterval(updateWeatherData, 60000) // 1分ごと
    return () => clearInterval(interval)
  }, [park.id, getCurrentWeather])

  // 音の種データを定期的に更新
  useEffect(() => {
    const updateSoundSeeds = async () => {
      const seeds = await getParkSoundSeeds(park.id)
      if (seeds) {
        setSoundSeeds(seeds)
      }
    }

    const interval = setInterval(updateSoundSeeds, 30000) // 30秒ごと
    return () => clearInterval(interval)
  }, [park.id, getParkSoundSeeds])

  // マップクリック処理
  const handleMapClick = useCallback(async (x: number, y: number) => {
    if (!isPlantingMode || !selectedSoundSource) return

    const result = await plantSoundSeed({
      park_id: park.id,
      soundSourceId: selectedSoundSource.id,
      x,
      y,
      volume: 70,
    })

    if (result) {
      setSoundSeeds(prev => [...prev, result])
      setIsPlantingMode(false)
      setSelectedSoundSource(null)
    }
  }, [isPlantingMode, selectedSoundSource, park.id, plantSoundSeed])

  // 音の種クリック処理
  const handleSeedClick = useCallback((seed: SoundSeed) => {
    if (!isPlantingMode) {
      setSelectedSeed(seed)
      setShowSeedModal(true)
    }
  }, [isPlantingMode])

  // 植える準備開始
  const startPlanting = useCallback(() => {
    if (userSoundSources.length === 0) {
      alert('利用可能な音源がありません。音源を選択してください。')
      return
    }

    // デフォルトで最初の無料音源を選択
    const defaultSource = userSoundSources.find(s => s.is_free) || userSoundSources[0]
    setSelectedSoundSource(defaultSource)
    setIsPlantingMode(true)
  }, [userSoundSources])

  // 植える準備停止
  const stopPlanting = useCallback(() => {
    setIsPlantingMode(false)
    setSelectedSoundSource(null)
  }, [])

  // モーダルを閉じる
  const closeSeedModal = useCallback(() => {
    setShowSeedModal(false)
    setSelectedSeed(null)
  }, [])

  // 音の種削除
  const deleteSeed = useCallback(async (seedId: number) => {
    const success = await deleteSoundSeed(seedId)
    if (success) {
      setSoundSeeds(prev => prev.filter(seed => seed.id !== seedId))
      closeSeedModal()
    }
  }, [deleteSoundSeed, closeSeedModal])

  // 音の種更新
  const updateSeed = useCallback(async (
    seedId: number, 
    updates: Partial<Pick<SoundSeed, 'x_position' | 'y_position' | 'volume'>>
  ) => {
    const updatedSeed = await updateSoundSeed(seedId, updates)
    if (updatedSeed) {
      setSoundSeeds(prev => prev.map(seed => 
        seed.id === seedId ? updatedSeed : seed
      ))
      setSelectedSeed(updatedSeed)
    }
  }, [updateSoundSeed])

  return {
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
    setSelectedSoundSource,
  }
}