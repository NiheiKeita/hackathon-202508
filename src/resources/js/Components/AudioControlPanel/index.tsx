import React from 'react'
import { useAudioEngine } from '../../hooks/useAudioEngine'

interface Props {
  className?: string
  showAdvanced?: boolean
}

const AudioControlPanel: React.FC<Props> = ({ 
  className = '', 
  showAdvanced = false 
}) => {
  const {
    isPlaying,
    bpm,
    masterVolume,
    audioSources,
    play,
    stop,
    setBpm,
    setMasterVolume,
    getCurrentBeat
  } = useAudioEngine()

  const currentBeat = getCurrentBeat()

  const handleBpmChange = (value: number) => {
    setBpm(Math.max(60, Math.min(200, value)))
  }

  const handleVolumeChange = (value: number) => {
    setMasterVolume(Math.max(0, Math.min(100, value)))
  }

  return (
    <div className={`rounded-xl border bg-white p-6 shadow-lg ${className}`}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-yellow-500 text-2xl">
            🎵
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">音楽コントロール</h3>
            <p className="text-sm text-gray-600">
              {audioSources.length}個の音の種が植えられています
            </p>
          </div>
        </div>
        
        {/* 再生状態インジケーター */}
        <div className="text-right">
          <div className={`inline-flex items-center space-x-2 rounded-full px-3 py-1 text-sm font-medium ${
            isPlaying 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <div className={`h-2 w-2 rounded-full ${
              isPlaying ? 'animate-pulse bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span>{isPlaying ? '再生中' : '停止中'}</span>
          </div>
          {isPlaying && (
            <div className="mt-1 text-xs text-gray-500">
              拍: {currentBeat + 1}/16
            </div>
          )}
        </div>
      </div>

      {/* メインコントロール */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* 再生/停止ボタン */}
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={isPlaying ? stop : play}
            disabled={audioSources.length === 0}
            className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold transition-all ${
              audioSources.length === 0
                ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                : isPlaying
                  ? 'transform bg-red-500 text-white hover:scale-110 hover:bg-red-600'
                  : 'transform bg-green-500 text-white hover:scale-110 hover:bg-green-600'
            }`}
          >
            {isPlaying ? (
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <div className="text-center">
            <div className="text-sm font-medium text-gray-800">
              {isPlaying ? '停止' : '再生'}
            </div>
            {audioSources.length === 0 && (
              <div className="mt-1 text-xs text-gray-500">
                音の種を植えてください
              </div>
            )}
          </div>
        </div>

        {/* BPMコントロール */}
        <div className="space-y-3">
          <div className="text-center">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              テンポ (BPM)
            </label>
            <div className="text-2xl font-bold text-blue-600">{bpm}</div>
          </div>
          
          <div className="space-y-2">
            <input
              type="range"
              min="60"
              max="200"
              value={bpm}
              onChange={(e) => handleBpmChange(parseInt(e.target.value))}
              className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-200"
            />
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>60</span>
              <span>130</span>
              <span>200</span>
            </div>
          </div>
          
          {/* 予設定BPMボタン */}
          <div className="flex space-x-1">
            {[80, 120, 140, 160].map(presetBpm => (
              <button
                key={presetBpm}
                onClick={() => handleBpmChange(presetBpm)}
                className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                  bpm === presetBpm
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {presetBpm}
              </button>
            ))}
          </div>
        </div>

        {/* 音量コントロール */}
        <div className="space-y-3">
          <div className="text-center">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              マスター音量
            </label>
            <div className="text-2xl font-bold text-purple-600">{masterVolume}%</div>
          </div>
          
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-200"
            />
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>🔇</span>
              <span>🔉</span>
              <span>🔊</span>
            </div>
          </div>
        </div>
      </div>

      {/* 詳細コントロール */}
      {showAdvanced && (
        <div className="mt-6 border-t pt-6">
          <h4 className="text-md mb-4 font-bold text-gray-800">詳細設定</h4>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 音源別音量調整 */}
            <div>
              <h5 className="mb-3 text-sm font-medium text-gray-700">音源別音量</h5>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {audioSources.map((source) => (
                  <div key={source.id} className="flex items-center space-x-3">
                    <div className="flex-1 text-sm text-gray-600">
                      音源 {source.id}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="70"
                      className="slider h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
                      onChange={(e) => {
                        // updateSoundSeedVolume(source.id, parseInt(e.target.value))
                      }}
                    />
                    <div className="w-8 text-xs text-gray-500">
                      70%
                    </div>
                  </div>
                ))}
              </div>
              
              {audioSources.length === 0 && (
                <div className="py-4 text-center text-sm text-gray-500">
                  音の種が植えられていません
                </div>
              )}
            </div>

            {/* エフェクト設定 */}
            <div>
              <h5 className="mb-3 text-sm font-medium text-gray-700">エフェクト</h5>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">リバーブ</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="30"
                    className="slider h-1 w-24 cursor-pointer appearance-none rounded-lg bg-gray-200"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ステレオ幅</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="80"
                    className="slider h-1 w-24 cursor-pointer appearance-none rounded-lg bg-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 使用方法のヒント */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <h4 className="mb-2 flex items-center text-sm font-medium text-blue-800">
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          使い方のコツ
        </h4>
        
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• 音の種のX座標が再生タイミングを決めます</li>
          <li>• Y座標で音の距離感を調整できます</li>
          <li>• 天候によってテンポや音響効果が変化します</li>
          <li>• 複数の音源を組み合わせて豊かなハーモニーを作りましょう</li>
        </ul>
      </div>
    </div>
  )
}

export default AudioControlPanel