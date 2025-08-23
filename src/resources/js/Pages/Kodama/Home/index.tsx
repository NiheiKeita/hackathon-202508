import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { useHomeHooks } from './hooks'

const KodamaHome: React.FC = () => {
  const { parks, loading, error } = useHomeHooks()

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Head title="KODAMA - 木霊" />
      
      <header className="py-8 text-center">
        <h1 className="mb-4 text-6xl font-bold text-green-800">
          KODAMA
        </h1>
        <p className="mb-2 text-xl text-green-600">
          木霊
        </p>
        <p className="mx-auto max-w-2xl px-4 text-lg text-gray-700">
          公園を、音で満たす新体験
        </p>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* コンセプト説明 */}
        <section className="mb-12 text-center">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-3xl font-bold text-green-800">
              天候が指揮するオーケストラ体験
            </h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6">
                <div className="mb-4 text-4xl">🌱</div>
                <h3 className="mb-3 text-xl font-bold text-green-700">
                  音の種を植える
                </h3>
                <p className="text-gray-600">
                  公園内の好きな場所に音源（種）を設置。あなたは観客ではなく、演奏者です。
                </p>
              </div>
              
              <div className="p-6">
                <div className="mb-4 text-4xl">🗺️</div>
                <h3 className="mb-3 text-xl font-bold text-green-700">
                  公園がシーケンサーに
                </h3>
                <p className="text-gray-600">
                  公園全体が一つの楽器として機能。マップ上で音楽が自動演奏されます。
                </p>
              </div>
              
              <div className="p-6">
                <div className="mb-4 text-4xl">🌦️</div>
                <h3 className="mb-3 text-xl font-bold text-green-700">
                  天候が音楽を変える
                </h3>
                <p className="text-gray-600">
                  雨量でテンポが変わり、風でリバーブが効き、気温で調性が決まります。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 公園選択 */}
        <section className="mb-12">
          <h2 className="mb-8 text-center text-3xl font-bold text-green-800">
            公園を選んでください
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="mb-4 text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="rounded-lg bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700"
              >
                再読み込み
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {parks.map(park => (
                <Link
                  key={park.id}
                  href={`/kodama/park/${park.id}`}
                  className="group"
                >
                  <div className="transform overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl group-hover:-translate-y-1">
                    <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600">
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="mb-2 text-2xl font-bold">{park.name}</h3>
                        <p className="text-sm text-green-100">
                          {park.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-600">
                          音を植えに行く
                        </span>
                        <svg 
                          className="h-5 w-5 text-green-600 transition-transform group-hover:translate-x-1" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 機能紹介 */}
        <section className="mb-12">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-center text-3xl font-bold text-green-800">
              その他の機能
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Link 
                href="/kodama/sound-sources"
                className="group rounded-xl border-2 border-green-200 p-6 transition-all hover:border-green-400 hover:bg-green-50"
              >
                <div className="mb-4 text-3xl">🎵</div>
                <h3 className="mb-3 text-xl font-bold text-green-700 group-hover:text-green-800">
                  音の種を選ぶ
                </h3>
                <p className="text-gray-600">
                  ピアノ、ハープ、和楽器など様々な音源から選択できます。
                </p>
              </Link>
              
              <Link 
                href="/kodama/shop"
                className="group rounded-xl border-2 border-green-200 p-6 transition-all hover:border-green-400 hover:bg-green-50"
              >
                <div className="mb-4 text-3xl">🏪</div>
                <h3 className="mb-3 text-xl font-bold text-green-700 group-hover:text-green-800">
                  売店でQR購入
                </h3>
                <p className="text-gray-600">
                  QRコードを読み取って特別な音源パックを購入できます。
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-green-800 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="mb-4 text-2xl font-bold">KODAMA 木霊</h3>
          <p className="mb-4 text-green-200">
            公園を音で満たし、天候と共に奏でる新しい体験
          </p>
          <p className="text-sm text-green-300">
            雨の日・オフシーズンでも公園を楽しもう
          </p>
        </div>
      </footer>
    </div>
  )
}

export default KodamaHome