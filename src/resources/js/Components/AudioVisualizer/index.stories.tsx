import type { Meta, StoryObj } from '@storybook/react'
import AudioVisualizer from './index'

// Mock audio engine states
const mockIdleAudioEngine = {
    isPlaying: false,
    currentTime: 0,
    bpm: 120,
    audioSources: [],
    getCurrentBeat: () => 0,
}

const mockPlayingAudioEngine = {
    isPlaying: true,
    currentTime: 12.5,
    bpm: 140,
    audioSources: [
        { id: 1, x: 100, y: 150, audio: {} as HTMLAudioElement },
        { id: 2, x: 400, y: 200, audio: {} as HTMLAudioElement },
        { id: 3, x: 700, y: 100, audio: {} as HTMLAudioElement },
    ],
    getCurrentBeat: () => 5,
}

const mockHighEnergyAudioEngine = {
    isPlaying: true,
    currentTime: 25.8,
    bpm: 180,
    audioSources: [
        { id: 1, x: 50, y: 100, audio: {} as HTMLAudioElement },
        { id: 2, x: 200, y: 300, audio: {} as HTMLAudioElement },
        { id: 3, x: 350, y: 150, audio: {} as HTMLAudioElement },
        { id: 4, x: 500, y: 400, audio: {} as HTMLAudioElement },
        { id: 5, x: 650, y: 250, audio: {} as HTMLAudioElement },
        { id: 6, x: 750, y: 350, audio: {} as HTMLAudioElement },
    ],
    getCurrentBeat: () => 11,
}

const mockSlowTempoAudioEngine = {
    isPlaying: true,
    currentTime: 8.3,
    bpm: 80,
    audioSources: [
        { id: 1, x: 300, y: 200, audio: {} as HTMLAudioElement },
        { id: 2, x: 500, y: 350, audio: {} as HTMLAudioElement },
    ],
    getCurrentBeat: () => 2,
}

// Mock the audio engine hook
// jest.mock('../../hooks/useAudioEngine', () => ({
//   useAudioEngine: () => mockIdleAudioEngine
// }))

const meta: Meta<typeof AudioVisualizer> = {
    title: 'Components/AudioVisualizer',
    component: AudioVisualizer,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: '音楽シーケンサーのリアルタイム可視化コンポーネント。拍の進行、音源の再生タイミング、音波を視覚的に表現します。',
            },
        },
    },
    argTypes: {
        isVisible: {
            control: 'boolean',
            description: 'コンポーネントの表示/非表示',
        },
        width: {
            control: { type: 'number', min: 400, max: 1200, step: 50 },
            description: 'キャンバスの幅',
        },
        height: {
            control: { type: 'number', min: 80, max: 300, step: 20 },
            description: 'キャンバスの高さ',
        },
        className: {
            control: 'text',
            description: '追加のCSSクラス名',
        },
    },
} satisfies Meta<typeof AudioVisualizer>

export default meta
type Story = StoryObj<typeof meta>

// 停止中状態
export const Stopped: Story = {
    args: {
        isVisible: true,
        width: 800,
        height: 120,
    },
    parameters: {
        docs: {
            description: {
                story: '音楽が停止中の状態。再生ボタンアイコンと説明テキストが表示されます。',
            },
        },
    },
}

// 標準再生中
export const Playing: Story = {
    args: {
        isVisible: true,
        width: 800,
        height: 120,
    },
    parameters: {
        docs: {
            description: {
                story: '標準的なBPM（140）で3つの音源が再生中。拍インジケーターと音源トリガーが可視化されています。',
            },
        },
        mockData: {
            useAudioEngine: () => mockPlayingAudioEngine
        }
    },
}

// 高エネルギー再生
export const HighEnergy: Story = {
    args: {
        isVisible: true,
        width: 800,
        height: 120,
    },
    parameters: {
        docs: {
            description: {
                story: '高BPM（180）で6つの音源が活発に再生中。雨天時などの高エネルギー状態を表現します。',
            },
        },
        mockData: {
            useAudioEngine: () => mockHighEnergyAudioEngine
        }
    },
}

// 低テンポ再生
export const SlowTempo: Story = {
    args: {
        isVisible: true,
        width: 800,
        height: 120,
    },
    parameters: {
        docs: {
            description: {
                story: '低BPM（80）でゆっくりとした再生。雪天時などの静寂な雰囲気を表現します。',
            },
        },
        mockData: {
            useAudioEngine: () => mockSlowTempoAudioEngine
        }
    },
}

// 非表示状態
export const Hidden: Story = {
    args: {
        isVisible: false,
        width: 800,
        height: 120,
    },
    parameters: {
        docs: {
            description: {
                story: 'isVisibleがfalseの時は何も表示されません（レンダリング自体がスキップ）。',
            },
        },
    },
}

// ワイドサイズ
export const WideSize: Story = {
    args: {
        isVisible: true,
        width: 1200,
        height: 150,
    },
    parameters: {
        docs: {
            description: {
                story: 'より大きなサイズでの表示。拍インジケーターがより見やすくなります。',
            },
        },
        mockData: {
            useAudioEngine: () => mockPlayingAudioEngine
        }
    },
}

// コンパクトサイズ
export const CompactSize: Story = {
    args: {
        isVisible: true,
        width: 600,
        height: 80,
    },
    parameters: {
        docs: {
            description: {
                story: 'コンパクトサイズでの表示。モバイル画面などで使用されます。',
            },
        },
        mockData: {
            useAudioEngine: () => mockPlayingAudioEngine
        }
    },
}

// カスタムスタイル
export const CustomStyling: Story = {
    args: {
        isVisible: true,
        width: 800,
        height: 120,
        className: 'border-4 border-purple-500 bg-purple-900 rounded-xl shadow-2xl',
    },
    parameters: {
        docs: {
            description: {
                story: 'カスタムCSSクラスを適用した例。紫のテーマカラーでスタイリングされています。',
            },
        },
        mockData: {
            useAudioEngine: () => mockPlayingAudioEngine
        }
    },
}

// 長時間再生
export const LongPlayback: Story = {
    args: {
        isVisible: true,
        width: 800,
        height: 120,
    },
    parameters: {
        docs: {
            description: {
                story: '長時間再生中の状態。拍カウンターが循環し、音波エフェクトが複雑になります。',
            },
        },
        mockData: {
            useAudioEngine: () => ({
                ...mockPlayingAudioEngine,
                currentTime: 156.7, // 約2分半
                getCurrentBeat: () => 14,
            })
        }
    },
}

// 最小構成
export const Minimal: Story = {
    args: {
        isVisible: true,
        width: 400,
        height: 60,
    },
    parameters: {
        docs: {
            description: {
                story: '最小限のサイズでの表示。基本的な拍情報のみが表示されます。',
            },
        },
        mockData: {
            useAudioEngine: () => ({
                ...mockPlayingAudioEngine,
                audioSources: [{ id: 1, x: 400, y: 200, audio: {} as HTMLAudioElement }],
            })
        }
    },
}

// 音源なし再生
export const PlayingWithoutSources: Story = {
    args: {
        isVisible: true,
        width: 800,
        height: 120,
    },
    parameters: {
        docs: {
            description: {
                story: '音源が植えられていない状態での再生。拍インジケーターのみ表示され、音源トリガーはありません。',
            },
        },
        mockData: {
            useAudioEngine: () => ({
                ...mockPlayingAudioEngine,
                audioSources: [],
            })
        }
    },
}
