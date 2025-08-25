import React from 'react'
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
  category: PackCategory
  sounds: SoundSource[]
  onPurchase: () => void
}

const SoundPackCard: React.FC<Props> = ({ category, sounds, onPurchase }) => {
  const isPurchased = sounds && sounds.length > 0

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.color} p-8 text-white shadow-lg transition-transform hover:scale-105`}>
      {/* 背景装飾 */}
      <div className="absolute -right-4 -top-4 h-24 w-24 opacity-10">
        <div className="text-8xl">{category.icon}</div>
      </div>
      
      {/* 購入済みバッジ */}
      {isPurchased && (
        <div className="absolute right-4 top-4">
          <div className="flex items-center space-x-1 rounded-full bg-white bg-opacity-90 px-3 py-1 text-sm font-medium text-green-600">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>購入済み</span>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="relative z-10">
        <div className="mb-4 flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20 text-4xl">
            {category.icon}
          </div>
          
          <div className="flex-1">
            <h3 className="mb-2 text-2xl font-bold">{category.name}</h3>
            <p className="text-lg opacity-90">{category.description}</p>
          </div>
        </div>

        {/* 音源情報 */}
        <div className="mb-6 rounded-xl bg-white bg-opacity-10 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-medium">含まれる音源</span>
            <span className="rounded-full bg-white bg-opacity-20 px-2 py-1 text-sm">
              {isPurchased ? `${sounds.length}個` : '5個以上'}
            </span>
          </div>
          
          {isPurchased ? (
            <div className="space-y-2">
              {sounds.slice(0, 3).map((sound, index) => (
                <div key={sound.id} className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-white bg-opacity-60"></div>
                  <span className="text-sm opacity-90">{sound.name}</span>
                </div>
              ))}
              {sounds.length > 3 && (
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-white bg-opacity-60"></div>
                  <span className="text-sm opacity-90">他 {sounds.length - 3}個</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-white bg-opacity-40"></div>
                <span className="text-sm opacity-70">プレミアム音源が含まれます</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-white bg-opacity-40"></div>
                <span className="text-sm opacity-70">高品質なサウンド</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-white bg-opacity-40"></div>
                <span className="text-sm opacity-70">天候効果に最適化</span>
              </div>
            </div>
          )}
        </div>

        {/* 価格と購入ボタン */}
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">
            {isPurchased ? (
              <span className="text-green-300">購入済み</span>
            ) : (
              <>
                <span className="mr-1">¥</span>
                <span>{category.price.toLocaleString()}</span>
              </>
            )}
          </div>
          
          <button
            onClick={onPurchase}
            disabled={isPurchased}
            className={`rounded-lg px-6 py-3 font-bold transition-all ${
              isPurchased
                ? 'cursor-not-allowed bg-green-500 bg-opacity-20 text-green-200'
                : 'transform bg-white bg-opacity-90 text-gray-800 hover:scale-105 hover:bg-opacity-100'
            }`}
          >
            {isPurchased ? '使用可能' : '購入する'}
          </button>
        </div>

        {/* お得情報 */}
        {!isPurchased && (
          <div className="mt-4 rounded-lg bg-yellow-400 bg-opacity-20 p-3">
            <div className="flex items-center space-x-2 text-yellow-100">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">
                単品購入より約30%お得！
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SoundPackCard