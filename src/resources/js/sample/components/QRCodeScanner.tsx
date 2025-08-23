import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { QrCode, Camera, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'

interface QRCodeScannerProps {
  packId: string;
  packName: string;
  sounds: string[];
  onScanSuccess: (packId: string) => void;
  isScanning: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  packId,
  packName,
  sounds,
  onScanSuccess,
  isScanning,
  onStartScan,
  onStopScan
}) => {
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null)

  const handleScan = () => {
    onStartScan()
    
    // QRコードスキャンのシミュレーション
    setTimeout(() => {
      // 90%の確率で成功
      if (Math.random() > 0.1) {
        setScanResult('success')
        onScanSuccess(packId)
        setTimeout(() => {
          setScanResult(null)
          onStopScan()
        }, 2000)
      } else {
        setScanResult('error')
        setTimeout(() => {
          setScanResult(null)
          onStopScan()
        }, 2000)
      }
    }, 2000)
  }

  return (
    <Card className="relative overflow-hidden rounded-2xl border-primary/10 bg-white/50 p-6">
      {/* 背景の装飾 */}
      <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-bl from-primary/10 to-transparent"></div>
      
      <div className="relative">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 flex items-center text-lg font-medium text-primary">
              <QrCode className="mr-2 h-5 w-5" />
              {packName}
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              含まれる音源: {sounds.join(', ')}
            </p>
            <Badge className="bg-accent/20 text-primary">
              <Sparkles className="mr-1 h-3 w-3" />
              無料取得
            </Badge>
          </div>
        </div>

        {/* スキャン状態に応じた表示 */}
        <div className="mt-6">
          {!isScanning && !scanResult && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5">
                <QrCode className="h-12 w-12 text-primary/60" />
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                公園の売店にあるQRコードを読み取って<br />
                音のタネを無料で獲得しましょう
              </p>
              <Button 
                onClick={handleScan}
                className="rounded-xl bg-primary px-6 hover:bg-primary/90"
              >
                <Camera className="mr-2 h-4 w-4" />
                QRコードをスキャン
              </Button>
            </div>
          )}

          {isScanning && !scanResult && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 animate-pulse items-center justify-center rounded-2xl border-2 border-primary bg-primary/10">
                <Camera className="h-12 w-12 animate-bounce text-primary" />
              </div>
              <p className="mb-4 text-sm text-primary">
                QRコードをスキャン中...
              </p>
              <div className="mb-4 flex justify-center space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-primary"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <Button 
                onClick={onStopScan}
                variant="outline"
                className="rounded-xl border-primary/30 text-primary"
              >
                キャンセル
              </Button>
            </div>
          )}

          {scanResult === 'success' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-green-400 bg-green-50">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <p className="mb-2 font-medium text-green-700">取得成功！</p>
              <p className="text-sm text-muted-foreground">
                {packName}の音のタネを獲得しました
              </p>
            </div>
          )}

          {scanResult === 'error' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-red-400 bg-red-50">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <p className="mb-2 font-medium text-red-700">スキャン失敗</p>
              <p className="mb-4 text-sm text-muted-foreground">
                QRコードが読み取れませんでした<br />
                もう一度お試しください
              </p>
              <Button 
                onClick={handleScan}
                variant="outline"
                className="rounded-xl border-primary/30 text-primary"
              >
                再試行
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}