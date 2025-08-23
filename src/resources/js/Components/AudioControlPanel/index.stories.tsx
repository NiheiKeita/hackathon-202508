import type { Meta, StoryObj } from '@storybook/react'
import AudioControlPanel from './index'

// Mock the audio engine hook
const mockAudioEngine = {
    isPlaying: false,
    bpm: 120,
    masterVolume: 70,
    audioSources: [],
    play: () => { },
    stop: () => { },
    setBpm: () => { },
    setMasterVolume: () => { },
    getCurrentBeat: () => 0,
}

const mockAudioEngineWithSources = {
    ...mockAudioEngine,
    audioSources: [
        { id: 1, x: 100, y: 150, audio: {} as HTMLAudioElement },
        { id: 2, x: 300, y: 200, audio: {} as HTMLAudioElement },
        { id: 3, x: 500, y: 100, audio: {} as HTMLAudioElement },
    ],
}

const mockPlayingState = {
    ...mockAudioEngineWithSources,
    isPlaying: true,
    bpm: 140,
    masterVolume: 85,
}

// Mock the hook
// jest.mock('../../hooks/useAudioEngine', () => ({
//     useAudioEngine: () => mockAudioEngine
// }))

const meta: Meta<typeof AudioControlPanel> = {
    title: 'Components/AudioControlPanel',
    component: AudioControlPanel,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'KODAMA音楽システムのメインコントロールパネル。再生/停止、BPM調整、音量制御などの機能を提供します。',
            },
        },
    },
    argTypes: {
        className: {
            control: 'text',
            description: '追加のCSSクラス名',
        },
        showAdvanced: {
            control: 'boolean',
            description: '詳細設定の表示/非表示',
        },
    },
} satisfies Meta<typeof AudioControlPanel>

export default meta
type Story = StoryObj<typeof meta>

// デフォルト状態（音源なし）
export const Default: Story = {
    args: {
        showAdvanced: false,
    },
    parameters: {
        docs: {
            description: {
                story: '音の種が植えられていない初期状態。再生ボタンは無効化されています。',
            },
        },
    },
}

// 音源がある状態
export const WithAudioSources: Story = {
    args: {
        showAdvanced: false,
    },
    parameters: {
        docs: {
            description: {
                story: '3つの音の種が植えられている状態。再生ボタンが有効になります。',
            },
        },
        mockData: {
            useAudioEngine: () => mockAudioEngineWithSources
        }
    },
}

// 再生中状態
export const Playing: Story = {
    args: {
        showAdvanced: false,
    },
    parameters: {
        docs: {
            description: {
                story: '音楽が再生中の状態。テンポが上がり、停止ボタンが表示されています。',
            },
        },
        mockData: {
            useAudioEngine: () => mockPlayingState
        }
    },
}

// 詳細設定表示
export const WithAdvancedSettings: Story = {
    args: {
        showAdvanced: true,
    },
    parameters: {
        docs: {
            description: {
                story: '音源別音量調整やエフェクト設定を含む詳細コントロール画面。',
            },
        },
        mockData: {
            useAudioEngine: () => mockAudioEngineWithSources
        }
    },
}

// 高BPM設定
export const HighBPM: Story = {
    args: {
        showAdvanced: false,
    },
    parameters: {
        docs: {
            description: {
                story: '雨天時などの高テンポ設定（180 BPM）の表示例。',
            },
        },
        mockData: {
            useAudioEngine: () => ({
                ...mockAudioEngineWithSources,
                bpm: 180,
                masterVolume: 90,
            })
        }
    },
}

// 低BPM設定
export const LowBPM: Story = {
    args: {
        showAdvanced: false,
    },
    parameters: {
        docs: {
            description: {
                story: '雪天時などの低テンポ設定（80 BPM）の表示例。',
            },
        },
        mockData: {
            useAudioEngine: () => ({
                ...mockAudioEngineWithSources,
                bpm: 80,
                masterVolume: 50,
            })
        }
    },
}

// カスタムスタイル
export const CustomStyling: Story = {
    args: {
        className: 'shadow-2xl border-4 border-blue-300',
        showAdvanced: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'カスタムCSSクラスを適用した例。影とボーダーを追加しています。',
            },
        },
        mockData: {
            useAudioEngine: () => mockPlayingState
        }
    },
}
