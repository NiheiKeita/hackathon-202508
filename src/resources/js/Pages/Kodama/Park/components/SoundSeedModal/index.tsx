import React, { useState } from 'react'
import { SoundSeed } from '../../../../../types/kodama'

interface Props {
  seed: SoundSeed;
  onClose: () => void;
  onDelete: (seedId: number) => void;
  onUpdate: (seedId: number, updates: Partial<Pick<SoundSeed, 'x_position' | 'y_position' | 'volume'>>) => void;
}

const SoundSeedModal: React.FC<Props> = ({ seed, onClose, onDelete, onUpdate }) => {
  const [volume, setVolume] = useState(seed.volume)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    onUpdate(seed.id, { volume: newVolume })
  }

  const handleDelete = () => {
    onDelete(seed.id)
  }

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold text-gray-800">音の種の詳細</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="space-y-6 p-6">
          {/* 音源情報 */}
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-3xl">
              {getSoundSourceIcon(seed.sound_source?.type || 'piano')}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">
                {seed.sound_source?.name || '不明な音源'}
              </h3>
              
              <div className="mt-1 flex items-center space-x-2">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(seed.sound_source?.category || 'basic')}`}>
                  {getCategoryName(seed.sound_source?.category || 'basic')}
                </span>
                
                {!seed.sound_source?.is_free && (
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    有料音源
                  </span>
                )}
              </div>
              
              {seed.sound_source?.description && (
                <p className="mt-2 text-sm text-gray-600">
                  {seed.sound_source.description}
                </p>
              )}
            </div>
          </div>

          {/* 位置情報 */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-3 font-medium text-gray-800">位置情報</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">X座標</label>
                <div className="text-lg font-medium">{seed.x_position}</div>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Y座標</label>
                <div className="text-lg font-medium">{seed.y_position}</div>
              </div>
            </div>
          </div>

          {/* ボリューム調整 */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="font-medium text-gray-800">ボリューム</label>
              <span className="text-sm text-gray-600">{volume}%</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
            
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>静か</span>
              <span>大きい</span>
            </div>
          </div>

          {/* 植えた人の情報 */}
          {seed.user && (
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="mb-2 font-medium text-gray-800">植えた人</h4>
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm text-white">
                  {seed.user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-700">{seed.user.name}</span>
              </div>
            </div>
          )}

          {/* 植えた日時 */}
          {seed.created_at && (
            <div className="text-sm text-gray-500">
              <span>植えた日時: </span>
              <span>{new Date(seed.created_at).toLocaleString('ja-JP')}</span>
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
          
          {/* 削除ボタン（自分の種の場合のみ表示） */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            削除
          </button>
        </div>
      </div>

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="z-60 fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              
              <h3 className="mb-2 text-lg font-bold text-gray-800">音の種を削除</h3>
              <p className="mb-6 text-gray-600">
                この音の種を削除しますか？<br />
                この操作は元に戻せません。
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                >
                  キャンセル
                </button>
                
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                >
                  削除する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SoundSeedModal