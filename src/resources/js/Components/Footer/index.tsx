import React from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Heart, Cloud, TreePine, Music, MapPin, Mail, Phone, ExternalLink } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-primary/10 bg-gradient-to-b from-background to-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* ブランド情報 */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <TreePine className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-primary">KODAMA（木霊）</h3>
                <p className="text-sm text-muted-foreground">音の森プロジェクト</p>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              公園を舞台に、天候が指揮するオーケストラ体験を提供します。
              あなたは観客ではなく、音を植える演奏者として、
              自然と音楽が融合した新しい体験をお楽しみください。
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <Cloud className="mr-1 h-3 w-3" />
                天候連動
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Music className="mr-1 h-3 w-3" />
                音楽体験
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <MapPin className="mr-1 h-3 w-3" />
                位置情報
              </Badge>
            </div>
          </div>

          {/* 機能紹介 */}
          <div>
            <h4 className="mb-3 font-medium text-primary">主な機能</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                <span>音の種を植える</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                <span>天候連動演奏</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                <span>位置情報マップ</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                <span>音源パック購入</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                <span>リアルタイム同期</span>
              </li>
            </ul>
          </div>

          {/* お問い合わせ */}
          <div>
            <h4 className="mb-3 font-medium text-primary">サポート</h4>
            <div className="space-y-3">
              <Button variant="ghost" size="sm" className="h-auto w-full justify-start p-2">
                <Mail className="mr-2 h-4 w-4 text-primary" />
                <div className="text-left">
                  <div className="text-sm">お問い合わせ</div>
                  <div className="text-xs text-muted-foreground">support@kodama.jp</div>
                </div>
              </Button>
              <Button variant="ghost" size="sm" className="h-auto w-full justify-start p-2">
                <Phone className="mr-2 h-4 w-4 text-primary" />
                <div className="text-left">
                  <div className="text-sm">サポートセンター</div>
                  <div className="text-xs text-muted-foreground">平日 9:00-18:00</div>
                </div>
              </Button>
              <Button variant="ghost" size="sm" className="h-auto w-full justify-start p-2">
                <ExternalLink className="mr-2 h-4 w-4 text-primary" />
                <div className="text-left">
                  <div className="text-sm">ヘルプセンター</div>
                  <div className="text-xs text-muted-foreground">よくある質問</div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* 下部バー */}
        <div className="mt-8 border-t border-primary/10 pt-6">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© 2024 KODAMA Project</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                プライバシーポリシー
              </Button>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                利用規約
              </Button>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-3 w-3 fill-current text-destructive" />
              <span>for nature and music</span>
            </div>
          </div>
        </div>
      </div>

      {/* 装飾的な背景要素 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-20"></div>
    </footer>
  )
}