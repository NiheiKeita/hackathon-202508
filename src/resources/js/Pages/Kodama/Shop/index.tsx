import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { SoundSource, WeatherData } from '../../../types/kodama'
import { useShopHooks } from './hooks'
import QrCodeScanner from './components/QrCodeScanner'
import WeatherBasedQrCard from './components/WeatherBasedQrCard'

interface Props {
  parks: Array<{
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    weather?: WeatherData;
  }>;
  availableQrCodes: Array<{
    park_id: number;
    park_name: string;
    qr_codes: Array<{
      id: number;
      code: string;
      sound_source: SoundSource;
      weather_condition: string;
      temperature_range: string;
    }>;
  }>;
}

const KodamaShop: React.FC<Props> = ({ parks, availableQrCodes }) => {
  const {
    showScanner,
    qrScanResult,
    loading,
    error,
    openScanner,
    closeScanner,
    handleQrScan,
  } = useShopHooks({ parks, availableQrCodes })

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear': return '☀️'
      case 'cloudy': return '☁️'
      case 'rainy': return '🌧️'
      case 'stormy': return '⛈️'
      default: return '🌤️'
    }
  }

  const getTemperatureIcon = (temp: number) => {
    if (temp >= 30) return '🔥'
    if (temp >= 25) return '☀️'
    if (temp >= 15) return '🌤️'
    if (temp >= 5) return '❄️'
    return '🧊'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/30 to-stone-100/40">
      <Head title="売店 - KODAMA" />
      
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/kodama"
                className="flex items-center space-x-2 text-teal-600 hover:text-teal-800"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>戻る</span>
              </Link>
              <h1 className="text-2xl font-bold text-teal-700">KODAMA 雨宿り売店</h1>
            </div>
            
            <button
              onClick={openScanner}
              className="flex items-center space-x-2 rounded-lg bg-teal-600 px-6 py-2 text-white transition-colors hover:bg-teal-700"
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
              天候に応じた特別音源を手に入れよう
            </h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 p-6">
                <div className="mb-4 text-4xl">🌦️</div>
                <h3 className="mb-3 text-xl font-bold text-blue-700">
                  天候連動システム
                </h3>
                <p className="text-gray-700">
                  今日の天候と気温に応じて、特別な音源がもらえます
                </p>
              </div>
              
              <div className="rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 p-6">
                <div className="mb-4 text-4xl">📍</div>
                <h3 className="mb-3 text-xl font-bold text-green-700">
                  売店で受け取り
                </h3>
                <p className="text-gray-700">
                  各公園の売店でQRコードをスキャンして音源を受け取れます
                </p>
              </div>
              
              <div className="rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 p-6">
                <div className="mb-4 text-4xl">🎵</div>
                <h3 className="mb-3 text-xl font-bold text-purple-700">
                  限定音源
                </h3>
                <p className="text-gray-700">
                  特定の天候でしか手に入らない貴重な音源もあります
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 公園別QRコード一覧 */}
        <section className="mb-12">
          <h2 className="mb-8 text-center text-3xl font-bold text-orange-800">
            売店QRコード一覧
          </h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {availableQrCodes.map(parkData => (
              <WeatherBasedQrCard
                key={parkData.park_id}
                parkData={parkData}
                weather={parks.find(p => p.id === parkData.park_id)?.weather}
                getWeatherIcon={getWeatherIcon}
                getTemperatureIcon={getTemperatureIcon}
              />
            ))}
          </div>
        </section>

        {/* 天候連動説明 */}
        <section className="mb-12">
          <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-orange-400 to-yellow-500 p-8 text-white shadow-lg">
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold">
                今日の天候で決まる特別音源！
              </h2>
              
              <div className="mb-8 text-6xl">🌤️</div>
              
              <div className="grid gap-6 md:grid-cols-4">
                <div className="rounded-lg bg-white bg-opacity-20 p-4">
                  <div className="mb-2 text-3xl">☀️</div>
                  <h3 className="mb-2 text-lg font-bold">晴天の日</h3>
                  <p className="text-sm">明るい自然音や和楽器</p>
                </div>
                
                <div className="rounded-lg bg-white bg-opacity-20 p-4">
                  <div className="mb-2 text-3xl">🌧️</div>
                  <h3 className="mb-2 text-lg font-bold">雨の日</h3>
                  <p className="text-sm">静寂の音源や水の音</p>
                </div>
                
                <div className="rounded-lg bg-white bg-opacity-20 p-4">
                  <div className="mb-2 text-3xl">❄️</div>
                  <h3 className="mb-2 text-lg font-bold">寒い日</h3>
                  <p className="text-sm">温かみのあるシンセ音</p>
                </div>
                
                <div className="rounded-lg bg-white bg-opacity-20 p-4">
                  <div className="mb-2 text-3xl">🔥</div>
                  <h3 className="mb-2 text-lg font-bold">暑い日</h3>
                  <p className="text-sm">涼やかな風の音</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 使い方説明 */}
        <section>
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-center text-2xl font-bold text-orange-800">
              QRコードで取得した音源の使い方
            </h3>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 text-3xl">🌱</div>
                <h4 className="mb-2 font-bold text-gray-800">公園で植える</h4>
                <p className="text-sm text-gray-600">
                  QRコードで取得した音源は公園マップで音の種として植えることができます
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