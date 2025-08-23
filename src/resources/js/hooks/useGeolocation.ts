import { useState, useEffect, useCallback } from 'react'

interface GeolocationPosition {
  latitude: number
  longitude: number
}

interface UseGeolocationReturn {
  position: GeolocationPosition | null
  error: string | null
  isLoading: boolean
  requestPermission: () => Promise<void>
  getCurrentPosition: () => Promise<GeolocationPosition>
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('位置情報サービスはこのブラウザではサポートされていません'))
        return
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5分間キャッシュ
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          resolve(coords)
        },
        (error) => {
          let message = '位置情報の取得に失敗しました'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = '位置情報の使用が許可されていません'
              break
            case error.POSITION_UNAVAILABLE:
              message = '位置情報が利用できません'
              break
            case error.TIMEOUT:
              message = '位置情報の取得がタイムアウトしました'
              break
          }
          reject(new Error(message))
        },
        options
      )
    })
  }, [])

  const requestPermission = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const coords = await getCurrentPosition()
      setPosition(coords)
    } catch (err) {
      const message = err instanceof Error ? err.message : '位置情報の取得に失敗しました'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [getCurrentPosition])

  // ページロード時に自動で位置情報を取得
  useEffect(() => {
    let watchId: number | null = null

    const startWatching = async () => {
      try {
        // まず現在位置を取得
        const coords = await getCurrentPosition()
        setPosition(coords)

        // 位置の変化を監視
        if (navigator.geolocation) {
          watchId = navigator.geolocation.watchPosition(
            (position) => {
              setPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              })
            },
            (error) => {
              console.warn('位置情報の監視中にエラー:', error)
              // 監視エラーは無視して続行
            },
            {
              enableHighAccuracy: false, // 省電力モード
              timeout: 30000,
              maximumAge: 600000, // 10分間キャッシュ
            }
          )
        }
      } catch (err) {
        // 初期取得失敗は無視（ユーザーが手動で許可するまで待つ）
        console.warn('初期位置情報取得失敗:', err)
      }
    }

    startWatching()

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [getCurrentPosition])

  return {
    position,
    error,
    isLoading,
    requestPermission,
    getCurrentPosition,
  }
}