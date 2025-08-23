import React from 'react'
import { Link } from '@inertiajs/react'
import { SoundSource } from '../../../../../types/kodama'

interface Props {
  sound: SoundSource;
  isAvailable: boolean;
  onPreview: () => void;
}

const SoundSourceCard: React.FC<Props> = ({ sound, isAvailable, onPreview }) => {
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

  const getCardStyle = () => {
    if (isAvailable) {
      return 'bg-white hover:shadow-xl border-2 border-transparent hover:border-green-300 cursor-pointer'
    } else {
      return 'bg-gray-50 hover:shadow-lg border-2 border-gray-200 hover:border-orange-300 cursor-pointer opacity-75'
    }
  }

  return (
    <div
      onClick={onPreview}
      className={`${getCardStyle()} transform overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1`}
    >
      {/* ヘッダー部分 */}
      <div className={`p-4 ${isAvailable ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-gray-400 to-gray-600'} relative`}>
        {!isAvailable && (
          <div className="absolute right-2 top-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white bg-opacity-90 text-2xl">
            {getSoundSourceIcon(sound.type)}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold leading-tight text-white">
              {sound.name}
            </h3>
            <div className="mt-1 flex items-center space-x-2">
              <span className={`rounded-full bg-white bg-opacity-90 px-2 py-1 text-xs font-medium ${getCategoryColor(sound.category).replace('bg-', 'text-')}`}>
                {getCategoryName(sound.category)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* コンテンツ部分 */}
      <div className="p-4">
        {sound.description && (
          <p className={`mb-4 text-sm ${isAvailable ? 'text-gray-600' : 'text-gray-500'}`}>
            {sound.description}
          </p>
        )}

        {/* 価格・状態表示 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {sound.is_free ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                無料
              </span>
            ) : (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                ¥{sound.price}
              </span>
            )}
            
            {isAvailable && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                利用可能
              </span>
            )}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPreview()
            }}
            className={`flex w-full items-center justify-center space-x-2 rounded-lg px-4 py-2 font-medium transition-colors ${
              isAvailable
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-400 text-white hover:bg-gray-500'
            }`}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span>試聴する</span>
          </button>

          {!isAvailable && (
            <Link
              href="/kodama/shop"
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM9 9a1 1 0 012 0v4a1 1 0 01-2 0V9z" clipRule="evenodd" />
              </svg>
              <span>売店で購入</span>
            </Link>
          )}
        </div>
      </div>

      {/* 利用不可オーバーレイ */}
      {!isAvailable && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-20">
          <div className="rounded-lg bg-white bg-opacity-95 px-4 py-2">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-800">購入が必要</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SoundSourceCard