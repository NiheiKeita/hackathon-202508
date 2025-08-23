import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { SoundSource } from '../../../types/kodama'
import { useSoundSourcesHooks } from './hooks'
import SoundSourceCard from './components/SoundSourceCard'
import SoundPreviewModal from './components/SoundPreviewModal'

interface Props {
  freeSounds: SoundSource[];
  purchasedSounds: SoundSource[];
  allSounds: SoundSource[];
}

const KodamaSoundSources: React.FC<Props> = ({ 
  freeSounds: initialFreeSounds, 
  purchasedSounds: initialPurchasedSounds,
  allSounds: initialAllSounds
}) => {
  const {
    availableSounds,
    lockedSounds,
    selectedCategory,
    searchQuery,
    previewingSound,
    setSelectedCategory,
    setSearchQuery,
    setPreviewingSound,
    playPreview,
    stopPreview,
    isPlaying,
  } = useSoundSourcesHooks(initialFreeSounds, initialPurchasedSounds, initialAllSounds)

  const categories = [
    { id: 'all', name: 'すべて', icon: '🎵' },
    { id: 'basic', name: '基本音源', icon: '🎹' },
    { id: 'japanese', name: '和楽器', icon: '🎋' },
    { id: '80s_synth', name: '80年代シンセ', icon: '🎛️' },
  ]

  const filteredSounds = availableSounds.filter(sound => {
    const matchesCategory = selectedCategory === 'all' || sound.category === selectedCategory
    const matchesSearch = sound.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (sound.description && sound.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const filteredLockedSounds = lockedSounds.filter(sound => {
    const matchesCategory = selectedCategory === 'all' || sound.category === selectedCategory
    const matchesSearch = sound.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (sound.description && sound.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <Head title="音の種を選ぶ - KODAMA" />
      
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/kodama"
                className="flex items-center space-x-2 text-green-600 hover:text-green-800"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>戻る</span>
              </Link>
              <h1 className="text-2xl font-bold text-green-800">音の種を選ぶ</h1>
            </div>
            
            <Link 
              href="/kodama/shop"
              className="flex items-center space-x-2 rounded-lg bg-orange-600 px-6 py-2 text-white transition-colors hover:bg-orange-700"
            >
              <span>🏪</span>
              <span>売店へ</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 検索・フィルター */}
        <div className="mb-8">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* 検索バー */}
              <div className="max-w-md flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="音源を検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* カテゴリータブ */}
              <div className="flex space-x-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 利用可能な音源 */}
        {filteredSounds.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 flex items-center text-2xl font-bold text-green-800">
              <span className="mr-3">✅</span>
              利用可能な音源 ({filteredSounds.length}個)
            </h2>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSounds.map(sound => (
                <SoundSourceCard
                  key={sound.id}
                  sound={sound}
                  isAvailable={true}
                  onPreview={() => setPreviewingSound(sound)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ロックされた音源 */}
        {filteredLockedSounds.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 flex items-center text-2xl font-bold text-gray-600">
              <span className="mr-3">🔒</span>
              購入が必要な音源 ({filteredLockedSounds.length}個)
            </h2>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredLockedSounds.map(sound => (
                <SoundSourceCard
                  key={sound.id}
                  sound={sound}
                  isAvailable={false}
                  onPreview={() => setPreviewingSound(sound)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 検索結果なし */}
        {filteredSounds.length === 0 && filteredLockedSounds.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              音源が見つかりませんでした
            </h3>
            <p className="mb-6 text-gray-600">
              検索条件を変更するか、カテゴリーを変えてみてください
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700"
            >
              検索条件をリセット
            </button>
          </div>
        )}

        {/* 使い方説明 */}
        <div className="mt-12 rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 flex items-center text-xl font-bold text-green-800">
            <span className="mr-2">💡</span>
            使い方
          </h3>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 text-center">
              <div className="mb-3 text-3xl">🎵</div>
              <h4 className="mb-2 font-bold text-gray-800">試聴する</h4>
              <p className="text-sm text-gray-600">
                音源カードをクリックして音を確認できます
              </p>
            </div>
            
            <div className="p-4 text-center">
              <div className="mb-3 text-3xl">🌱</div>
              <h4 className="mb-2 font-bold text-gray-800">公園に植える</h4>
              <p className="text-sm text-gray-600">
                利用可能な音源は公園のマップに植えることができます
              </p>
            </div>
            
            <div className="p-4 text-center">
              <div className="mb-3 text-3xl">🏪</div>
              <h4 className="mb-2 font-bold text-gray-800">新しい音源を購入</h4>
              <p className="text-sm text-gray-600">
                売店でQRコードをスキャンして特別音源を追加
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* プレビューモーダル */}
      {previewingSound && (
        <SoundPreviewModal
          sound={previewingSound}
          isPlaying={isPlaying}
          onClose={() => setPreviewingSound(null)}
          onPlay={() => playPreview(previewingSound)}
          onStop={stopPreview}
          isAvailable={availableSounds.some(s => s.id === previewingSound.id)}
        />
      )}
    </div>
  )
}

export default KodamaSoundSources