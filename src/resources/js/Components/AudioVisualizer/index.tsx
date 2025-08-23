import React, { useEffect, useState, useRef } from 'react'
import { useAudioEngine } from '../../hooks/useAudioEngine'

interface Props {
  isVisible: boolean
  width?: number
  height?: number
  className?: string
}

const AudioVisualizer: React.FC<Props> = ({ 
  isVisible, 
  width = 800, 
  height = 120, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  
  const { 
    isPlaying, 
    currentTime, 
    bpm, 
    audioSources,
    getCurrentBeat 
  } = useAudioEngine()

  // ビート可視化アニメーション
  useEffect(() => {
    if (!isVisible || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      // キャンバスクリア
      ctx.fillStyle = '#1f2937' // gray-800
      ctx.fillRect(0, 0, width, height)

      if (isPlaying) {
        const currentBeat = getCurrentBeat()
        const beatInterval = 60 / bpm
        const beatProgress = (currentTime % beatInterval) / beatInterval

        // ビートインジケーター描画
        drawBeatIndicator(ctx, width, height, currentBeat, beatProgress)
        
        // 音源の再生タイミング可視化
        drawSoundTriggers(ctx, width, height, currentBeat, beatProgress)
        
        // 音波エフェクト
        drawAudioWaves(ctx, width, height, currentTime)
      } else {
        // 停止中のメッセージ
        drawStoppedState(ctx, width, height)
      }

      if (isVisible) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisible, isPlaying, currentTime, bpm, audioSources, getCurrentBeat])

  // ビートインジケーター描画
  const drawBeatIndicator = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    currentBeat: number,
    beatProgress: number
  ) => {
    const beatWidth = w / 16 // 16拍表示
    const centerY = h / 2

    // 16拍のグリッド描画
    for (let i = 0; i < 16; i++) {
      const x = i * beatWidth
      const isCurrent = i === currentBeat % 16
      const isStrong = i % 4 === 0 // 4拍ごとに強拍

      // 背景
      ctx.fillStyle = isCurrent 
        ? '#f59e0b' // amber-500 
        : isStrong 
          ? '#374151' // gray-700
          : '#4b5563' // gray-600
      
      ctx.fillRect(x + 2, centerY - 20, beatWidth - 4, 40)

      // 拍番号
      ctx.fillStyle = isCurrent ? '#ffffff' : '#9ca3af' // gray-400
      ctx.font = '12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText((i + 1).toString(), x + beatWidth / 2, centerY + 4)

      // 現在拍の進行表示
      if (isCurrent) {
        const progressWidth = (beatWidth - 4) * beatProgress
        ctx.fillStyle = '#ef4444' // red-500
        ctx.fillRect(x + 2, centerY - 25, progressWidth, 5)
      }
    }

    // BPM表示
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${bpm} BPM`, w - 20, 25)
  }

  // 音源トリガー可視化
  const drawSoundTriggers = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    currentBeat: number,
    beatProgress: number
  ) => {
    const beatWidth = w / 16
    
    audioSources.forEach(source => {
      // X座標に基づく拍位置計算
      const xBeatPosition = Math.floor((source.x / 800) * 16)
      const triggerBeat = xBeatPosition % 16

      if (triggerBeat === currentBeat % 16) {
        // 再生中の音源をハイライト
        const x = triggerBeat * beatWidth
        const pulseIntensity = Math.sin(currentTime * 10) * 0.3 + 0.7
        
        ctx.fillStyle = `rgba(34, 197, 94, ${pulseIntensity})` // green-500 with pulse
        ctx.fillRect(x + 1, h - 30, beatWidth - 2, 25)
        
        // 音源アイコン表示
        ctx.fillStyle = '#ffffff'
        ctx.font = '14px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('🎵', x + beatWidth / 2, h - 10)
      } else {
        // 次回再生予定の音源
        const x = triggerBeat * beatWidth
        ctx.fillStyle = 'rgba(156, 163, 175, 0.5)' // gray-400 with opacity
        ctx.fillRect(x + 1, h - 15, beatWidth - 2, 10)
      }
    })
  }

  // オーディオ波形エフェクト
  const drawAudioWaves = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    time: number
  ) => {
    if (audioSources.length === 0) return

    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)' // blue-500 with opacity
    ctx.lineWidth = 2

    // 各音源の波形を重ねて表示
    audioSources.forEach((source, index) => {
      ctx.beginPath()
      
      for (let x = 0; x < w; x += 2) {
        const frequency = (source.x / 800) * 0.02 + 0.005 // X座標に基づく周波数
        const amplitude = (1 - source.y / 600) * 20 // Y座標に基づく振幅
        const phase = time * 2 + index * Math.PI / 4 // 位相差
        
        const y = h - 40 + Math.sin(x * frequency + phase) * amplitude
        
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.stroke()
    })
  }

  // 停止状態表示
  const drawStoppedState = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number
  ) => {
    ctx.fillStyle = '#6b7280' // gray-500
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('再生を開始すると音楽の可視化が表示されます', w / 2, h / 2)
    
    // 再生ボタンアイコン
    ctx.fillStyle = '#9ca3af' // gray-400
    ctx.font = '24px sans-serif'
    ctx.fillText('▶️', w / 2, h / 2 + 30)
  }

  if (!isVisible) return null

  return (
    <div className={`rounded-lg bg-gray-800 p-4 ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">オーディオシーケンサー</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <div className={`h-2 w-2 rounded-full ${isPlaying ? 'animate-pulse bg-green-400' : 'bg-gray-500'}`}></div>
          <span>{isPlaying ? '再生中' : '停止中'}</span>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full rounded border border-gray-600"
      />
      
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <span>拍: 1-16（4拍子 × 4小節）</span>
        <span>音源: {audioSources.length}個</span>
        <span>時間: {currentTime.toFixed(1)}秒</span>
      </div>
    </div>
  )
}

export default AudioVisualizer