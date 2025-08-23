import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { SoundSource } from '../../../types/kodama'
import { useShopHooks } from './hooks'
import SoundPackCard from './components/SoundPackCard'
import QrCodeScanner from './components/QrCodeScanner'
import PurchaseModal from './components/PurchaseModal'

interface Props {
  soundPacks: {
    japanese: SoundSource[];
    '80s_synth': SoundSource[];
  };
}

const KodamaShop: React.FC<Props> = ({ soundPacks: initialSoundPacks }) => {
  const {
    soundPacks,
    showScanner,
    showPurchaseModal,
    selectedPack,
    qrScanResult,
    loading,
    error,
    openScanner,
    closeScanner,
    openPurchaseModal,
    closePurchaseModal,
    handleQrScan,
    handlePurchase,
    handleSetPurchase,
  } = useShopHooks(initialSoundPacks)

  const packCategories = [
    {
      key: 'japanese' as const,
      name: '和楽器パック',
      description: '伝統的な日本の楽器で風雅な音楽を',
      icon: '🎋',
      color: 'from-red-400 to-pink-500',
      price: 1200,
    },
    {
      key: '80s_synth' as const,
      name: '80年代シンセパック',
      description: 'レトロフューチャーなシンセサウンド',
      icon: '🎛️',
      color: 'from-purple-400 to-pink-500',
      price: 1500,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
      <Head title="売店 - KODAMA" />
      
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
              <h1 className="text-2xl font-bold text-orange-800">KODAMA 売店</h1>
            </div>
            
            <button
              onClick={openScanner}
              className="flex items-center space-x-2 rounded-lg bg-orange-600 px-6 py-2 text-white transition-colors hover:bg-orange-700"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 000 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h3a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L12.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 14H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L16.586 14H16a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span>QRスキャン</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-100 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 売店紹介 */}
        <section className="mb-12 text-center">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-3xl font-bold text-orange-800">
              特別音源を手に入れよう
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-gradient-to-r from-orange-100 to-yellow-100 p-6">
                <div className="mb-4 text-4xl">📱</div>
                <h3 className="mb-3 text-xl font-bold text-orange-700">
                  QRコードをスキャン
                </h3>
                <p className="text-gray-700">
                  売店に設置されたQRコードを読み取って、特別な音源を購入できます
                </p>
              </div>
              
              <div className="rounded-xl bg-gradient-to-r from-pink-100 to-red-100 p-6">
                <div className="mb-4 text-4xl">🎵</div>
                <h3 className="mb-3 text-xl font-bold text-pink-700">
                  音源パックで一括購入
                </h3>
                <p className="text-gray-700">
                  カテゴリー別にまとめて購入すると、個別購入よりもお得です
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 音源パック */}
        <section className="mb-12">
          <h2 className="mb-8 text-center text-3xl font-bold text-orange-800">
            音源パック
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            {packCategories.map(category => (
              <SoundPackCard
                key={category.key}
                category={category}
                sounds={soundPacks[category.key]}
                onPurchase={() => openPurchaseModal(category)}
              />
            ))}
          </div>
        </section>

        {/* QRコード購入説明 */}
        <section className="mb-12">
          <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-orange-400 to-yellow-500 p-8 text-white shadow-lg">
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold">
                売店でQRコードを探そう！
              </h2>
              
              <div className="mb-8 text-6xl">🔍</div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-white bg-opacity-20 p-4">
                  <div className="mb-2 text-3xl">📍</div>
                  <h3 className="mb-2 text-lg font-bold">売店を訪れる</h3>
                  <p className="text-sm">公園内の売店に足を運びます</p>
                </div>
                
                <div className="rounded-lg bg-white bg-opacity-20 p-4">
                  <div className="mb-2 text-3xl">📱</div>
                  <h3 className="mb-2 text-lg font-bold">QRコードをスキャン</h3>
                  <p className="text-sm">専用QRコードを読み取ります</p>
                </div>
                
                <div className="rounded-lg bg-white bg-opacity-20 p-4">
                  <div className="mb-2 text-3xl">🎵</div>
                  <h3 className="mb-2 text-lg font-bold">音源を獲得</h3>
                  <p className="text-sm">特別な音源が使えるようになります</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 使い方説明 */}
        <section>
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-center text-2xl font-bold text-orange-800">
              購入した音源の使い方
            </h3>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 text-3xl">🌱</div>
                <h4 className="mb-2 font-bold text-gray-800">公園で植える</h4>
                <p className="text-sm text-gray-600">
                  購入した音源は公園マップで音の種として植えることができます
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 text-3xl">🎼</div>
                <h4 className="mb-2 font-bold text-gray-800">音楽に彩りを</h4>
                <p className="text-sm text-gray-600">
                  和楽器やシンセ音源で、より豊かな音楽体験を楽しめます
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 text-3xl">🌦️</div>
                <h4 className="mb-2 font-bold text-gray-800">天候と連動</h4>
                <p className="text-sm text-gray-600">
                  天候に応じて音源の響き方も変化し、季節感あふれる演奏に
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QRスキャナー */}
      {showScanner && (
        <QrCodeScanner
          onScan={handleQrScan}
          onClose={closeScanner}
          scanResult={qrScanResult}
          loading={loading}
        />
      )}

      {/* 購入確認モーダル */}
      {showPurchaseModal && selectedPack && (
        <PurchaseModal
          pack={selectedPack}
          sounds={soundPacks[selectedPack.key]}
          onClose={closePurchaseModal}
          onConfirm={handleSetPurchase}
          loading={loading}
        />
      )}

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex items-center space-x-4 rounded-lg bg-white p-6">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-orange-600"></div>
            <span>処理中...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default KodamaShop