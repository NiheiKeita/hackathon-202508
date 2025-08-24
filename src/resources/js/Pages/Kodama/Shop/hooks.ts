import { useState, useCallback } from 'react'
import { SoundSource, WeatherData } from '../../../types/kodama'
import { useKodamaApi } from '../../../hooks/useKodamaApi'

interface ShopHooksProps {
  parks: Array<{
    id: number
    name: string
    description: string
    latitude: number
    longitude: number
    weather?: WeatherData
  }>
  availableQrCodes: Array<{
    park_id: number
    park_name: string
    qr_codes: Array<{
      id: number
      code: string
      sound_source: SoundSource
      weather_condition: string
      temperature_range: string
    }>
  }>
}

export const useShopHooks = ({ parks, availableQrCodes }: ShopHooksProps) => {
    const [showScanner, setShowScanner] = useState(false)
    const [qrScanResult, setQrScanResult] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { scanQrCode } = useKodamaApi()

    // QRスキャナー開く
    const openScanner = useCallback(() => {
        setShowScanner(true)
        setError(null)
    }, [])

    // QRスキャナー閉じる
    const closeScanner = useCallback(() => {
        setShowScanner(false)
        setQrScanResult(null)
    }, [])

    // QRコードスキャン処理
    const handleQrScan = useCallback(async (result: string) => {
        if (!result) return

        setLoading(true)
        setError(null)

        try {
            const response = await scanQrCode(result)

            if (response?.sound_source) {
                setQrScanResult(`音源「${response.sound_source.name}」を獲得しました！`)
                
                // 成功メッセージ表示後、スキャナーを閉じる
                setTimeout(() => {
                    closeScanner()
                }, 3000)
            } else {
                setError('QRコードが無効です')
            }

        } catch (err) {
            console.error('QR scan failed:', err)
            setError('QRコードの読み取りに失敗しました')
        } finally {
            setLoading(false)
        }
    }, [scanQrCode, closeScanner])

    return {
        // State
        showScanner,
        qrScanResult,
        loading,
        error,
        parks,
        availableQrCodes,

        // Actions
        openScanner,
        closeScanner,
        handleQrScan,
    }
}
