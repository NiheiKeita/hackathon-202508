import { useState, useCallback } from 'react'
import { router } from '@inertiajs/react'
import { SoundSource } from '../../../types/kodama'
import { useKodamaApi } from '../../../hooks/useKodamaApi'

interface PackCategory {
    key: 'japanese' | '80s_synth'
    name: string
    description: string
    icon: string
    color: string
    price: number
}

export const useShopHooks = (initialSoundPacks: { japanese: SoundSource[]; '80s_synth': SoundSource[] }) => {
    const [soundPacks, setSoundPacks] = useState(initialSoundPacks)
    const [showScanner, setShowScanner] = useState(false)
    const [showPurchaseModal, setShowPurchaseModal] = useState(false)
    const [selectedPack, setSelectedPack] = useState<PackCategory | null>(null)
    const [qrScanResult, setQrScanResult] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { scanQrCode, purchaseSoundSource: purchaseSoundPack } = useKodamaApi()

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

    // 購入確認モーダル開く
    const openPurchaseModal = useCallback((category: PackCategory) => {
        setSelectedPack(category)
        setShowPurchaseModal(true)
        setError(null)
    }, [])

    // 購入確認モーダル閉じる
    const closePurchaseModal = useCallback(() => {
        setShowPurchaseModal(false)
        setSelectedPack(null)
    }, [])

    // QRコードスキャン処理
    const handleQrScan = useCallback(async (result: string) => {
        if (!result) return

        setLoading(true)
        setError(null)

        try {
            const response = await scanQrCode(result)

            if (response) {
                setQrScanResult(result)

                // スキャン成功時の処理
                if (response?.sound_source) {
                    // 単体音源の場合は直接追加
                    const category = response.sound_source.category as 'japanese' | '80s_synth'
                    if (category in soundPacks) {
                        setSoundPacks(prev => ({
                            ...prev,
                            [category]: [...prev[category], response.sound_source]
                        }))
                    }
                }

                // 成功メッセージ表示後、スキャナーを閉じる
                setTimeout(() => {
                    closeScanner()
                }, 2000)

            } else {
                setError(response || 'QRコードが無効です')
            }

        } catch (err) {
            console.error('QR scan failed:', err)
            setError('QRコードの読み取りに失敗しました')
        } finally {
            setLoading(false)
        }
    }, [scanQrCode, soundPacks, closeScanner])

    // 音源パック購入処理
    const handlePurchase = useCallback(async (pack: PackCategory) => {
        // この関数は現在使用されていないが、将来の拡張のために保持
        console.log('Purchase initiated for pack:', pack)
    }, [])

    // 音源パック購入確定処理
    const handleSetPurchase = useCallback(async (pack: PackCategory) => {
        if (!pack) return

        setLoading(true)
        setError(null)

        try {
            const response = await purchaseSoundPack(pack.key)

            if (response) {
                // 購入成功 - 音源パックをローカル状態に追加
                setSoundPacks(prev => ({
                    ...prev,
                    [pack.key]: response.sound_source
                }))

                // モーダルを閉じる
                closePurchaseModal()

                // 成功通知（オプション）
                router.visit('/kodama/shop', {
                    only: ['soundPacks'],
                    onSuccess: () => {
                        // リロード後の処理があればここに
                    }
                })

            } else {
                setError(response ?? '購入に失敗しました')
            }

        } catch (err) {
            console.error('Purchase failed:', err)
            setError('購入処理中にエラーが発生しました')
        } finally {
            setLoading(false)
        }
    }, [purchaseSoundPack, closePurchaseModal])

    return {
        // State
        soundPacks,
        showScanner,
        showPurchaseModal,
        selectedPack,
        qrScanResult,
        loading,
        error,

        // Actions
        openScanner,
        closeScanner,
        openPurchaseModal,
        closePurchaseModal,
        handleQrScan,
        handlePurchase,
        handleSetPurchase,
    }
}
