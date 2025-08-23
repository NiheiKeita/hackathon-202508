import React, { useState } from 'react'
import { Link } from '@inertiajs/react'
import { SoundSource } from '../../../../../types/kodama'

interface Props {
  sound: SoundSource;
  isPlaying: boolean;
  isAvailable: boolean;
  onClose: () => void;
  onPlay: () => void;
  onStop: () => void;
}

const SoundPreviewModal: React.FC<Props> = ({ 
  sound, 
  isPlaying, 
  isAvailable,
  onClose, 
  onPlay, 
  onStop 
}) => {
  const [volume, setVolume] = useState(70)

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic':
        return 'bg-blue-100 text-blue-800'
      case 'japanese':
        return 'bg-red-100 text-red-800'
      case '80s_synth':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'basic':
        return '基本音源'
      case 'japanese':
        return '和楽器'
      case '80s_synth':
        return '80年代シンセ'
      default:
        return category
    }
  }

  const handlePlayToggle = () => {
    if (isPlaying) {
      onStop()
    } else {
      onPlay()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-screen w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* ヘッダー */}
        <div className="relative">
          <div className={`p-6 ${isAvailable ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-gray-400 to-gray-600'}`}>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white bg-opacity-20 text-white transition-colors hover:bg-opacity-30"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-90 text-3xl">
                {getSoundSourceIcon(sound.type)}
              </div>
              
              <div className="flex-1 text-white">
                <h2 className="mb-2 text-2xl font-bold">{sound.name}</h2>
                <div className="flex items-center space-x-2">
                  <span className={`rounded-full bg-white bg-opacity-90 px-3 py-1 text-sm font-medium ${getCategoryColor(sound.category).replace('bg-', 'text-')}`}>
                    {getCategoryName(sound.category)}
                  </span>
                  
                  {sound.is_free ? (
                    <span className="rounded-full bg-green-500 bg-opacity-90 px-3 py-1 text-sm font-medium">
                      無料
                    </span>
                  ) : (
                    <span className="rounded-full bg-yellow-500 bg-opacity-90 px-3 py-1 text-sm font-medium">
                      ¥{sound.price}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!isAvailable && (
              <div className="mt-4 rounded-lg bg-orange-500 bg-opacity-90 p-3">
                <div className="flex items-center space-x-2 text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">この音源は購入が必要です</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* コンテンツ */}
        <div className="space-y-6 p-6">
          {/* 説明 */}
          {sound.description && (
            <div>
              <h3 className="mb-2 font-bold text-gray-800">説明</h3>
              <p className="text-gray-600">{sound.description}</p>
            </div>
          )}

          {/* 音楽プレーヤー */}
          <div className="rounded-xl bg-gray-50 p-6">
            <div className="mb-4 flex items-center justify-center space-x-4">
              <button
                onClick={handlePlayToggle}
                disabled={!isAvailable && !sound.is_free}
                className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold transition-all ${
                  isAvailable || sound.is_free
                    ? 'transform bg-green-600 text-white hover:scale-105 hover:bg-green-700'
                    : 'cursor-not-allowed bg-gray-400 text-white'
                }`}
              >
                {isPlaying ? (
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="mb-2 text-sm text-gray-600">
                {isPlaying ? '再生中...' : '再生ボタンを押して音を確認'}
              </p>
              <p className="text-xs text-gray-500">
                プレビューは10秒間再生されます
              </p>
            </div>

            {/* ボリューム調整（プレビュー用） */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">プレビュー音量</label>
                <span className="text-sm text-gray-600">{volume}%</span>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
              />
            </div>
          </div>

          {/* 音源の特徴 */}
          <div className="rounded-xl bg-blue-50 p-4">
            <h3 className="mb-3 font-bold text-gray-800">音源の特徴</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">タイプ</div>
                <div className="font-medium">{sound.type}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">カテゴリー</div>
                <div className="font-medium">{getCategoryName(sound.category)}</div>
              </div>
            </div>
          </div>

          {/* 使い方のヒント */}
          {isAvailable && (
            <div className="rounded-xl bg-green-50 p-4">
              <h3 className="mb-2 flex items-center font-bold text-green-800">
                <span className="mr-2">💡</span>
                使い方のヒント
              </h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• 公園マップで好きな場所に植えることができます</li>
                <li>• 天候によって音の響き方が変わります</li>
                <li>• ボリュームは後から調整可能です</li>
              </ul>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="flex space-x-3 border-t p-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
          >
            閉じる
          </button>

          {isAvailable ? (
            <Link
              href="/kodama"
              className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-center text-white transition-colors hover:bg-green-700"
            >
              公園で使う
            </Link>
          ) : (
            <Link
              href="/kodama/shop"
              className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-center text-white transition-colors hover:bg-orange-700"
            >
              売店で購入
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default SoundPreviewModal