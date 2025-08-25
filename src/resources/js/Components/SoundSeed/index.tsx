import React from 'react'
import { ImageWithFallback } from '../ui/figma/ImageWithFallback'

interface SoundSeedProps {
  soundType: {
    id: string
    name: string
    icon: string
    isPaid: boolean
    purchased: boolean
  }
  size?: 'small' | 'medium' | 'large'
  className?: string
  showGlow?: boolean
}

export const SoundSeed: React.FC<SoundSeedProps> = ({ 
  soundType, 
  size = 'medium', 
  className = '', 
  showGlow = false 
}) => {
  // 音源タイプに基づいた種のデザイン
  const getSeedDesign = (id: string) => {
    const baseDesign = "relative rounded-full overflow-hidden border-2 shadow-lg transition-all duration-300"
    
    switch (id) {
      case 'piano':
        return {
          container: `${baseDesign} border-primary/30 bg-gradient-to-br from-slate-100 to-slate-300`,
          inner: "bg-gradient-to-br from-slate-200 to-slate-400",
          accent: "border-black/20",
          image: "https://images.unsplash.com/photo-1538402074774-8e624f3f7e5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        }
      case 'harp':
        return {
          container: `${baseDesign} border-yellow-300/50 bg-gradient-to-br from-yellow-100 to-amber-200`,
          inner: "bg-gradient-to-br from-yellow-200 to-amber-300",
          accent: "border-yellow-500/30",
          image: "https://images.unsplash.com/photo-1601902186937-b6c743ae2cd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        }
      case 'pad':
        return {
          container: `${baseDesign} border-primary/40 bg-gradient-to-br from-primary/20 to-accent/30`,
          inner: "bg-gradient-to-br from-primary/30 to-accent/40",
          accent: "border-primary/40",
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        }
      // 和楽器セット
      case 'japanese_琴':
      case 'japanese_尺八':
      case 'japanese_太鼓':
      case 'japanese_鈴':
        return {
          container: `${baseDesign} border-red-300/50 bg-gradient-to-br from-red-50 to-orange-100`,
          inner: "bg-gradient-to-br from-red-100 to-orange-200",
          accent: "border-red-400/40",
          image: "https://images.unsplash.com/photo-1548142813-c348350df52b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        }
      // 80'sシンセセット
      case 'synth80s_DX7':
      case 'synth80s_Jupiter':
      case 'synth80s_Juno':
      case 'synth80s_Moog':
        return {
          container: `${baseDesign} border-purple-300/50 bg-gradient-to-br from-purple-100 to-pink-200`,
          inner: "bg-gradient-to-br from-purple-200 to-pink-300",
          accent: "border-purple-400/40",
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        }
      // 自然音セット
      case 'nature_鳥のさえずり':
      case 'nature_水の音':
      case 'nature_風の音':
      case 'nature_虫の声':
        return {
          container: `${baseDesign} border-green-300/50 bg-gradient-to-br from-green-100 to-emerald-200`,
          inner: "bg-gradient-to-br from-green-200 to-emerald-300",
          accent: "border-green-400/40",
          image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        }
      default:
        return {
          container: `${baseDesign} border-primary/30 bg-gradient-to-br from-primary/10 to-accent/20`,
          inner: "bg-gradient-to-br from-primary/20 to-accent/30",
          accent: "border-primary/30",
          image: "https://images.unsplash.com/photo-1620509816550-fa23410a029b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        }
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return { container: 'w-8 h-8', icon: 'text-lg', inner: 'w-6 h-6' }
      case 'large':
        return { container: 'w-16 h-16', icon: 'text-4xl', inner: 'w-12 h-12' }
      default:
        return { container: 'w-12 h-12', icon: 'text-2xl', inner: 'w-8 h-8' }
    }
  }

  const design = getSeedDesign(soundType.id)
  const sizeClasses = getSizeClasses()
  const glowClass = showGlow ? 'spirit-glow' : ''

  return (
    <div className={`${design.container} ${sizeClasses.container} ${glowClass} ${className}`}>
      {/* 背景画像 */}
      <div className="absolute inset-0 opacity-30">
        <ImageWithFallback
          src={design.image}
          alt={soundType.name}
          className="h-full w-full object-cover"
        />
      </div>
      
      {/* グラデーションオーバーレイ */}
      <div className={`absolute inset-0 ${design.inner} opacity-60`}></div>
      
      {/* 中央のアイコン */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`${sizeClasses.icon} drop-shadow-sm`}>
          {soundType.icon}
        </span>
      </div>
      
      {/* 内側の光彩効果 */}
      <div className={`absolute inset-1 rounded-full ${design.accent} opacity-40`}></div>
      
      {/* 中央の核 */}
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform ${sizeClasses.inner} rounded-full bg-white/20 backdrop-blur-sm`}>
        <div className="h-full w-full rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
      </div>
    </div>
  )
}