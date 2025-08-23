import { useState, useCallback } from 'react'
import axios from 'axios'
import { 
  Park, 
  SoundSource, 
  SoundSeed, 
  WeatherData, 
  QrCode, 
  SoundSeedPlacement 
} from '../types/kodama'

const api = axios.create({
  baseURL: '/api/kodama',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// CSRFトークンをリクエストヘッダーに追加
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
if (csrfToken) {
  api.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
}

export const useKodamaApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRequest = useCallback(async <T>(request: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true)
      setError(null)
      return await request()
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'エラーが発生しました'
      setError(message)
      console.error('API Error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // 公園関連
  const getParks = useCallback(async (): Promise<Park[] | null> => {
    return handleRequest(async () => {
      const response = await api.get<Park[]>('/parks')
      return response.data
    })
  }, [handleRequest])

  const getPark = useCallback(async (parkId: number): Promise<Park | null> => {
    return handleRequest(async () => {
      const response = await api.get<Park>(`/parks/${parkId}`)
      return response.data
    })
  }, [handleRequest])

  const getParkSoundSeeds = useCallback(async (parkId: number): Promise<SoundSeed[] | null> => {
    return handleRequest(async () => {
      const response = await api.get<SoundSeed[]>(`/parks/${parkId}/sound-seeds`)
      return response.data
    })
  }, [handleRequest])

  // 音源関連
  const getSoundSources = useCallback(async (params?: { 
    category?: string; 
    is_free?: boolean; 
  }): Promise<SoundSource[] | null> => {
    return handleRequest(async () => {
      const response = await api.get<SoundSource[]>('/sound-sources', { params })
      return response.data
    })
  }, [handleRequest])

  const getUserSoundSources = useCallback(async (): Promise<SoundSource[] | null> => {
    return handleRequest(async () => {
      const response = await api.get<SoundSource[]>('/user/sound-sources')
      return response.data
    })
  }, [handleRequest])

  // 音の種関連
  const plantSoundSeed = useCallback(async (placement: SoundSeedPlacement & { park_id: number }): Promise<SoundSeed | null> => {
    return handleRequest(async () => {
      const response = await api.post<SoundSeed>('/sound-seeds', {
        park_id: placement.park_id,
        sound_source_id: placement.soundSourceId,
        x_position: placement.x,
        y_position: placement.y,
        volume: placement.volume,
      })
      return response.data
    })
  }, [handleRequest])

  const updateSoundSeed = useCallback(async (
    seedId: number, 
    updates: Partial<Pick<SoundSeed, 'x_position' | 'y_position' | 'volume'>>
  ): Promise<SoundSeed | null> => {
    return handleRequest(async () => {
      const response = await api.put<SoundSeed>(`/sound-seeds/${seedId}`, updates)
      return response.data
    })
  }, [handleRequest])

  const deleteSoundSeed = useCallback(async (seedId: number): Promise<boolean> => {
    return handleRequest(async () => {
      await api.delete(`/sound-seeds/${seedId}`)
      return true
    }) !== null
  }, [handleRequest])

  // QRコード関連
  const scanQrCode = useCallback(async (qrCode: string): Promise<{ qr_code: QrCode; sound_source: SoundSource; message: string } | null> => {
    return handleRequest(async () => {
      const response = await api.post('/qr-codes/scan', { qr_code: qrCode })
      return response.data
    })
  }, [handleRequest])

  const purchaseSoundSource = useCallback(async (qrCode: string): Promise<{ message: string; sound_source: SoundSource } | null> => {
    return handleRequest(async () => {
      const response = await api.post('/qr-codes/purchase', { qr_code: qrCode })
      return response.data
    })
  }, [handleRequest])

  const purchaseSoundSet = useCallback(async (category: 'japanese' | '80s_synth'): Promise<{ message: string; sound_sources: SoundSource[] } | null> => {
    return handleRequest(async () => {
      const response = await api.post('/sound-sources/purchase-set', { category })
      return response.data
    })
  }, [handleRequest])

  // 天候関連
  const getCurrentWeather = useCallback(async (parkId: number): Promise<WeatherData | null> => {
    return handleRequest(async () => {
      const response = await api.get<WeatherData>(`/parks/${parkId}/weather`)
      return response.data
    })
  }, [handleRequest])

  const updateWeather = useCallback(async (
    parkId: number, 
    weatherData: Omit<WeatherData, 'id' | 'park_id' | 'recorded_at'>
  ): Promise<WeatherData | null> => {
    return handleRequest(async () => {
      const response = await api.post<{ weather: WeatherData }>(`/parks/${parkId}/weather`, weatherData)
      return response.data.weather
    })
  }, [handleRequest])

  return {
    loading,
    error,
    clearError: () => setError(null),
    
    // Parks
    getParks,
    getPark,
    getParkSoundSeeds,
    
    // Sound Sources
    getSoundSources,
    getUserSoundSources,
    
    // Sound Seeds
    plantSoundSeed,
    updateSoundSeed,
    deleteSoundSeed,
    
    // QR Codes
    scanQrCode,
    purchaseSoundSource,
    purchaseSoundSet,
    
    // Weather
    getCurrentWeather,
    updateWeather,
  }
}