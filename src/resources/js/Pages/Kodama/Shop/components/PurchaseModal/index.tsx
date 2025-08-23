import React, { useState } from 'react'
import { SoundSource } from '../../../../../types/kodama'

interface PackCategory {
  key: 'japanese' | '80s_synth'
  name: string
  description: string
  icon: string
  color: string
  price: number
}

interface Props {
  pack: PackCategory
  sounds: SoundSource[]
  onClose: () => void
  onConfirm: (pack: PackCategory) => void
  loading: boolean
}

const PurchaseModal: React.FC<Props> = ({ pack, sounds, onClose, onConfirm, loading }) => {
  const [agreed, setAgreed] = useState(false)
  
  const getSoundSourceIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      piano: '🎹',
      harp: '🎵',
      synth_pad: '🎛️',
      koto: '🎋',
      shamisen: '🎸',
      fue: '🎺',
      taiko: '🥁',
      dx7_bell: '🔔',
      analog_bass: '🎸',
      lead_synth: '🎹',
    }
    return icons[type] || '🎵'
  }

  const handleConfirm = () => {
    if (agreed && !loading) {
      onConfirm(pack)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-screen w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* ヘッダー */}
        <div className={`relative bg-gradient-to-r p-6 ${pack.color}`}>
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white bg-opacity-20 text-white transition-colors hover:bg-opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center space-x-4 text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20 text-3xl">
              {pack.icon}
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-bold">購入確認</h2>
              <p className="text-lg opacity-90">{pack.name}</p>
            </div>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="space-y-6 p-6">
          {/* パック情報 */}
          <div>
            <h3 className="mb-3 text-lg font-bold text-gray-800">パック内容</h3>
            <p className="mb-4 text-gray-600">{pack.description}</p>
            
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium text-gray-800">含まれる音源</span>
                <span className="text-sm text-gray-600">{sounds.length}個</span>
              </div>
              
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {sounds.map((sound) => (
                  <div key={sound.id} className="flex items-center space-x-3 rounded-lg bg-white p-3">
                    <div className="text-xl">{getSoundSourceIcon(sound.type)}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{sound.name}</div>
                      {sound.description && (
                        <div className="text-xs text-gray-600">{sound.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 価格情報 */}
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">合計金額</div>
                <div className="text-2xl font-bold text-blue-600">¥{pack.price.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">個別購入との比較</div>
                <div className="text-sm font-medium text-green-600">約30%お得！</div>
              </div>
            </div>
          </div>

          {/* 特典情報 */}
          <div className="rounded-xl bg-yellow-50 p-4">
            <h4 className="mb-2 flex items-center font-bold text-yellow-800">
              <span className="mr-2">🎁</span>
              パック購入特典
            </h4>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• 全ての音源を無制限に利用可能</li>
              <li>• 天候効果に最適化されたプレミアム音質</li>
              <li>• 将来のアップデート音源も無料で追加</li>
              <li>• 専用フィルターとエフェクト</li>
            </ul>
          </div>

          {/* 利用規約確認 */}
          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="mb-2 font-medium text-gray-800">ご購入前の確認事項</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 購入後の返金・キャンセルはできません</li>
                <li>• 音源は購入アカウントでのみ利用可能です</li>
                <li>• インターネット接続が必要です</li>
                <li>• 利用規約に同意いただく必要があります</li>
              </ul>
            </div>

            <label className="flex cursor-pointer items-start space-x-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={loading}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
              />
              <span className="text-sm text-gray-700">
                上記の内容および
                <button className="text-blue-600 underline hover:text-blue-800">利用規約</button>
                に同意します
              </span>
            </label>
          </div>
        </div>

        {/* フッター */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-center transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              キャンセル
            </button>

            <button
              onClick={handleConfirm}
              disabled={!agreed || loading}
              className={`flex-1 rounded-lg px-4 py-3 text-center font-medium text-white transition-all ${
                agreed && !loading
                  ? 'transform bg-blue-600 hover:scale-105 hover:bg-blue-700'
                  : 'cursor-not-allowed bg-gray-400'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>処理中...</span>
                </div>
              ) : (
                <>
                  <span>¥{pack.price.toLocaleString()}で購入</span>
                </>
              )}
            </button>
          </div>

          {/* 購入後の案内 */}
          <div className="mt-4 rounded-lg bg-green-50 p-3">
            <div className="flex items-start space-x-2">
              <div className="mt-0.5 text-green-500">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-green-700">
                <div className="font-medium">購入後の利用方法</div>
                <div>公園マップで新しい音源を選択して植えることができます</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseModal