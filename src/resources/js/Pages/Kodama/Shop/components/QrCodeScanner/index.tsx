import React, { useEffect, useRef, useState, useCallback } from 'react'

interface Props {
  onScan: (result: string) => void
  onClose: () => void
  scanResult: string | null
  loading: boolean
}

const QrCodeScanner: React.FC<Props> = ({ onScan, onClose, scanResult, loading }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // カメラストリーム開始
  const startCamera = useCallback(async () => {
    try {
      setError(null)
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // 背面カメラを優先
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setHasPermission(true)
      }
      
    } catch (err) {
      console.error('Camera access failed:', err)
      setHasPermission(false)
      
      if (err instanceof DOMException) {
        switch (err.name) {
          case 'NotAllowedError':
            setError('カメラアクセスが拒否されました。ブラウザ設定でカメラアクセスを許可してください')
            break
          case 'NotFoundError':
            setError('カメラが見つかりません')
            break
          case 'NotReadableError':
            setError('カメラが使用中です')
            break
          default:
            setError('カメラアクセスエラーが発生しました')
        }
      } else {
        setError('カメラアクセスエラーが発生しました')
      }
    }
  }, [])

  // カメラストリーム停止
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    setIsScanning(false)
  }, [])

  // QRコード検出（簡易実装）
  const detectQRCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return
    
    // キャンバスサイズを動画に合わせる
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // 動画フレームをキャンバスに描画
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    try {
      // 実際のプロダクションでは、zxing-js/library やその他のQRコードライブラリを使用
      // ここではデモ用の簡易実装
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // QRコード検出のシミュレート（実際の実装では適切なライブラリを使用）
      const mockQRDetection = () => {
        // ランダムにQRコードを検出したことをシミュレート
        if (Math.random() > 0.98) {
          return 'KODAMA_DEMO_QR_' + Date.now()
        }
        return null
      }
      
      const result = mockQRDetection()
      if (result) {
        setIsScanning(false)
        onScan(result)
      }
      
    } catch (err) {
      console.error('QR detection error:', err)
    }
  }, [isScanning, onScan])

  // スキャン開始/停止
  const toggleScanning = useCallback(() => {
    if (!hasPermission) return
    
    setIsScanning(prev => {
      const newState = !prev
      
      if (newState) {
        // スキャン開始
        intervalRef.current = setInterval(detectQRCode, 100)
      } else {
        // スキャン停止
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
      
      return newState
    })
  }, [hasPermission, detectQRCode])

  // 手動入力（デモ用）
  const handleManualInput = useCallback(() => {
    const input = prompt('QRコードの内容を入力してください（デモ用）:')
    if (input) {
      onScan(input)
    }
  }, [onScan])

  // コンポーネントマウント時にカメラ開始
  useEffect(() => {
    startCamera()
    
    return () => {
      stopCamera()
    }
  }, [startCamera, stopCamera])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative h-full w-full max-w-lg">
        {/* ヘッダー */}
        <div className="absolute left-0 right-0 top-0 z-10 bg-gradient-to-b from-black to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <h2 className="text-xl font-bold">QRコードスキャン</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-opacity-30"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex h-full flex-col items-center justify-center">
          {error ? (
            <div className="flex flex-col items-center space-y-4 px-6 text-center">
              <div className="rounded-full bg-red-500 p-4 text-white">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div className="text-white">
                <h3 className="mb-2 text-lg font-bold">カメラアクセスエラー</h3>
                <p className="mb-4 text-sm opacity-90">{error}</p>
                
                <div className="space-y-2">
                  <button
                    onClick={startCamera}
                    className="w-full rounded-lg bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700"
                  >
                    再試行
                  </button>
                  
                  <button
                    onClick={handleManualInput}
                    className="w-full rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                  >
                    手動入力（デモ用）
                  </button>
                </div>
              </div>
            </div>
          ) : hasPermission === false ? (
            <div className="flex flex-col items-center space-y-4 px-6 text-center text-white">
              <div className="rounded-full bg-orange-500 p-4">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">カメラアクセスが必要です</h3>
              <p className="text-sm opacity-90">QRコードをスキャンするにはカメラアクセスを許可してください</p>
            </div>
          ) : hasPermission && (
            <div className="relative h-full w-full">
              {/* 動画プレビュー */}
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                playsInline
                muted
              />
              
              {/* スキャンオーバーレイ */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* スキャンフレーム */}
                  <div className="relative h-64 w-64">
                    <div className="absolute inset-0 border-2 border-orange-500 opacity-60">
                      {/* コーナーマーク */}
                      <div className="absolute -left-1 -top-1 h-8 w-8 border-l-4 border-t-4 border-white"></div>
                      <div className="absolute -right-1 -top-1 h-8 w-8 border-r-4 border-t-4 border-white"></div>
                      <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-4 border-l-4 border-white"></div>
                      <div className="absolute -bottom-1 -right-1 h-8 w-8 border-b-4 border-r-4 border-white"></div>
                    </div>
                    
                    {/* スキャンライン */}
                    {isScanning && (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute h-0.5 w-full animate-pulse bg-orange-400 opacity-80" style={{
                          animation: 'scan 2s linear infinite'
                        }}></div>
                      </div>
                    )}
                  </div>
                  
                  {/* 状態表示 */}
                  <div className="mt-4 text-center text-white">
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>処理中...</span>
                      </div>
                    ) : scanResult ? (
                      <div className="rounded-lg bg-green-500 bg-opacity-90 p-3">
                        <p className="font-medium">QRコードを検出しました！</p>
                      </div>
                    ) : (
                      <p className="text-sm opacity-90">
                        {isScanning ? 'QRコードを探しています...' : 'QRコードをフレーム内に収めてスキャンボタンを押してください'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        {hasPermission && !error && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={toggleScanning}
                disabled={loading || !!scanResult}
                className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold transition-all ${
                  isScanning
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                } ${(loading || scanResult) ? 'cursor-not-allowed opacity-50' : 'transform hover:scale-105'}`}
              >
                {isScanning ? (
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <div className="text-center text-white">
                <p className="text-sm font-medium">
                  {isScanning ? '停止' : 'スキャン開始'}
                </p>
              </div>
            </div>
            
            {/* デモ用手動入力ボタン */}
            <div className="mt-4 text-center">
              <button
                onClick={handleManualInput}
                className="text-sm text-white underline opacity-70 hover:opacity-90"
              >
                手動入力（デモ用）
              </button>
            </div>
          </div>
        )}

        {/* 隠しキャンバス（QR検出用） */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  )
}

export default QrCodeScanner