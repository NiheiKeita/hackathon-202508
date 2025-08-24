import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import { useHomeHooks } from './hooks'
import { Header } from '../../../Components/Header'
import { Footer } from '../../../Components/Footer'
import { Button } from '../../../Components/ui/button'
import { Badge } from '../../../Components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../Components/ui/card'
import { TreePine, MapPin, Music, QrCode, CloudRain, Wind, Thermometer } from 'lucide-react'
import { useGeolocation } from '../../../hooks/useGeolocation'

const KodamaHome: React.FC = () => {
    const { parks, loading, error } = useHomeHooks()
    const { position, requestPermission } = useGeolocation()
    const [currentScreen] = useState('home')

    const handleNavigate = (screen: 'home' | 'map' | 'sounds' | 'shop') => {
        const routes = {
            home: '/kodama',
            map: '/kodama/park/1', // デフォルト公園
            sounds: '/kodama/sound-sources',
            shop: '/kodama/shop'
        }
        window.location.href = routes[screen]
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/40 to-stone-100/30">
            <Head title="KODAMA - 木霊" />

            <Header
                currentScreen={currentScreen}
                onNavigate={handleNavigate}
                currentLocation={position}
                audibleSeeds={0}
                weatherRainfall={2}
            />

            {/* ヒーローセクション */}
            <section className="relative overflow-hidden bg-gradient-to-br from-teal-100/60 via-slate-100/50 to-stone-100/70 py-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(45,212,191,0.1),transparent_70%)]"></div>
                {/* 雨の演出 */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute h-1 w-1 animate-bounce bg-teal-300" style={{ left: '10%', top: '20%', animationDelay: '0s' }}></div>
                    <div className="absolute h-1 w-1 animate-bounce bg-teal-300" style={{ left: '20%', top: '40%', animationDelay: '0.2s' }}></div>
                    <div className="absolute h-1 w-1 animate-bounce bg-teal-300" style={{ left: '30%', top: '10%', animationDelay: '0.4s' }}></div>
                    <div className="absolute h-1 w-1 animate-bounce bg-teal-300" style={{ left: '60%', top: '30%', animationDelay: '0.6s' }}></div>
                    <div className="absolute h-1 w-1 animate-bounce bg-teal-300" style={{ left: '70%', top: '50%', animationDelay: '0.8s' }}></div>
                    <div className="absolute h-1 w-1 animate-bounce bg-teal-300" style={{ left: '80%', top: '15%', animationDelay: '1s' }}></div>
                </div>
                <div className="container relative mx-auto px-4 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="h-48 w-48">
                            {/* <div className="relative h-12 w-12 flex items-center justify-center">
                <div className="absolute h-10 w-8 bg-stone-100 rounded-full"></div>
                <div className="absolute h-2 w-2 bg-slate-800 rounded-full" style={{top: '16px', left: '18px'}}></div>
                <div className="absolute h-2 w-2 bg-slate-800 rounded-full" style={{top: '16px', right: '18px'}}></div>
              </div> */}
                            <img className='h-full w-full' src="/images/icon.png" />
                            {/* <div className="h-10 w-10 overflow-hidden rounded-xl transition-transform group-hover:scale-105">
                                <img className='h-full w-full' src="/images/icon.png" />
                            </div> */}
                        </div>
                    </div>

                    {/* <h1 className="mb-4 bg-gradient-to-r from-teal-700 to-slate-600 bg-clip-text text-6xl font-bold text-transparent">
                        KODAMA
                    </h1> */}

                    <p className="mb-2 text-2xl font-medium text-teal-700">
                        - 雨で生まれる世界で唯一のオーケストラ -
                    </p>

                    <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-600">
                        ”音のタネ” を植えると芽が出て、近づくと音が響く<br />
                        体験型サービス
                    </p>

                    {!position && (
                        <Button
                            onClick={requestPermission}
                            size="lg"
                            className="mb-8 rounded-full px-8 py-3"
                        >
                            <MapPin className="mr-2 h-5 w-5" />
                            位置情報を有効にして始める
                        </Button>
                    )}
                </div>

                {/* 背景の装飾的エフェクト */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-slate-400 to-teal-500 opacity-30"></div>
            </section>

            <main className="container mx-auto px-4 py-8">
                {/* コンセプト説明 */}
                <section className="mb-16">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-primary">
                            天候が指揮するオーケストラ体験
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            KODAMAは従来の音楽体験を超えた、自然と技術が融合した新しい表現方法です
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <Card className="group border-teal-200/40 bg-white/60 backdrop-blur-sm transition-all hover:border-teal-300/60 hover:shadow-lg">
                            <CardHeader className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                                        <TreePine className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <CardTitle className="text-xl text-primary">音の種を植える</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    公園内の好きな場所に音源（種）を設置。あなたは観客ではなく、演奏者として音楽を創造します。
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="group border-teal-200/40 bg-white/60 backdrop-blur-sm transition-all hover:border-teal-300/60 hover:shadow-lg">
                            <CardHeader className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="rounded-full bg-accent/10 p-4 transition-colors group-hover:bg-accent/20">
                                        <MapPin className="h-8 w-8 text-accent-foreground" />
                                    </div>
                                </div>
                                <CardTitle className="text-xl text-primary">公園がシーケンサーに</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    公園全体が一つの巨大な楽器として機能。マップ上で配置された音が自動的に演奏されます。
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="group border-teal-200/40 bg-white/60 backdrop-blur-sm transition-all hover:border-teal-300/60 hover:shadow-lg">
                            <CardHeader className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="rounded-full bg-secondary/20 p-4 transition-colors group-hover:bg-secondary/30">
                                        <CloudRain className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <CardTitle className="text-xl text-primary">天候が音楽を変える</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    雨量でテンポが変化し、風の強さでリバーブが効き、気温で調性が決まる動的な音楽体験。
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* 天候効果の詳細説明 */}
                <section className="mb-16">
                    <Card className="border-accent/30 bg-gradient-to-r from-accent/5 via-primary/5 to-secondary/10">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl text-primary">リアルタイム天候連動システム</CardTitle>
                            <CardDescription>現在の気象データが音楽に与える影響をリアルタイムで体験</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="text-center">
                                    <div className="mb-3 flex justify-center">
                                        <CloudRain className="h-6 w-6 text-primary" />
                                    </div>
                                    <h4 className="mb-2 font-medium text-primary">降水量 → テンポ</h4>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <div>0-1mm: Andante (ゆっくり)</div>
                                        <div>1-5mm: Moderato (標準)</div>
                                        <div>5-10mm: Allegro (速め)</div>
                                        <div>10mm+: Presto (非常に速い)</div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <div className="mb-3 flex justify-center">
                                        <Wind className="h-6 w-6 text-primary" />
                                    </div>
                                    <h4 className="mb-2 font-medium text-primary">風速 → リバーブ</h4>
                                    <p className="text-sm text-muted-foreground">
                                        風の強さに応じて音の響きが変化し、
                                        空間的な広がりを演出します
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="mb-3 flex justify-center">
                                        <Thermometer className="h-6 w-6 text-primary" />
                                    </div>
                                    <h4 className="mb-2 font-medium text-primary">気温 → 調性</h4>
                                    <p className="text-sm text-muted-foreground">
                                        温度が高いと明るい長調、
                                        低いと暗い短調に自動調整されます
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 公園選択 */}
                <section className="mb-16">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-primary">
                            公園を選んでください
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            あなたの音楽の舞台となる公園を選んで、音の種を植える旅を始めましょう
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <Card className="mx-auto max-w-md">
                            <CardContent className="py-12 text-center">
                                <p className="mb-4 text-destructive">{error}</p>
                                <Button
                                    onClick={() => window.location.reload()}
                                    variant="outline"
                                >
                                    再読み込み
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {parks.map(park => (
                                <Card key={park.id} className="group overflow-hidden border-primary/20 bg-white/50 backdrop-blur-sm transition-all hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl">
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary via-accent to-secondary">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                                        {/* 装飾的な背景パターン */}
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute right-4 top-4 h-8 w-8 rounded-full border border-white/30"></div>
                                            <div className="absolute left-6 top-8 h-4 w-4 rounded-full border border-white/20"></div>
                                            <div className="absolute bottom-8 right-8 h-6 w-6 rounded-full border border-white/25"></div>
                                        </div>

                                        <div className="absolute bottom-4 left-4 text-white">
                                            <Badge className="mb-2 bg-white/20 text-white">
                                                {position ? '近くの公園' : '公園'}
                                            </Badge>
                                            <h3 className="mb-2 text-2xl font-bold">{park.name}</h3>
                                            <p className="line-clamp-2 text-sm text-white/90">
                                                {park.description}
                                            </p>
                                        </div>
                                    </div>

                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-primary">
                                                    音を植えに行く
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    この公園で音楽を創造しましょう
                                                </p>
                                            </div>
                                            <Button asChild size="sm" className="rounded-full">
                                                <Link href={`/kodama/park/${park.id}`}>
                                                    開始
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                {/* 機能紹介 */}
                <section className="mb-16">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-primary">
                            その他の機能
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            KODAMAの世界をさらに豊かにする追加機能をご利用ください
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        <Card className="group border-teal-200/40 bg-white/60 backdrop-blur-sm transition-all hover:border-teal-300/60 hover:shadow-lg">
                            <CardHeader>
                                <div className="mb-4 flex items-center space-x-3">
                                    <div className="rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                                        <Music className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl text-primary">音の種を選ぶ</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-4">
                                    ピアノ、ハープ、和楽器など様々な音源から選択できます。
                                    それぞれの音源には個性的な特徴があり、あなたの音楽に彩りを添えます。
                                </CardDescription>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/kodama/sound-sources">
                                        音源を探す
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="group border-teal-200/40 bg-white/60 backdrop-blur-sm transition-all hover:border-teal-300/60 hover:shadow-lg">
                            <CardHeader>
                                <div className="mb-4 flex items-center space-x-3">
                                    <div className="rounded-full bg-accent/10 p-3 transition-colors group-hover:bg-accent/20">
                                        <QrCode className="h-6 w-6 text-accent-foreground" />
                                    </div>
                                    <CardTitle className="text-xl text-primary">売店でQR購入</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-4">
                                    公園の売店でQRコードを読み取って、特別な音源パックを購入できます。
                                    限定音源で他にはない音楽体験を楽しみましょう。
                                </CardDescription>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/kodama/shop">
                                        売店を見る
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default KodamaHome
