import type { Meta, StoryObj } from '@storybook/react'
import WeatherMusicDisplay from './index'
import { WeatherData } from '../../types/kodama'

// Mock weather data
const sunnyWeather: WeatherData = {
    weather_condition: 'clear',
    temperature: 25,
    humidity: 45,
    tempo_multiplier: 1.0,
    reverb_level: 0.2,
    is_major_key: true,
    park_id: 0,
    wind_speed: 0,
    rain_level: 0,
    thunder: false
}

const rainyWeather: WeatherData = {
    weather_condition: 'rainy',
    temperature: 18,
    humidity: 85,
    tempo_multiplier: 1.3,
    reverb_level: 0.6,
    is_major_key: false,
    park_id: 0,
    wind_speed: 0,
    rain_level: 0,
    thunder: false
}

const stormyWeather: WeatherData = {
    weather_condition: 'stormy',
    temperature: 20,
    humidity: 90,
    tempo_multiplier: 1.5,
    reverb_level: 0.9,
    is_major_key: false,
    park_id: 0,
    wind_speed: 0,
    rain_level: 0,
    thunder: false
}

const snowyWeather: WeatherData = {
    weather_condition: 'stormy',
    temperature: -2,
    humidity: 75,
    tempo_multiplier: 0.7,
    reverb_level: 0.8,
    is_major_key: false,
    park_id: 0,
    wind_speed: 0,
    rain_level: 0,
    thunder: false
}

const foggyWeather: WeatherData = {
    weather_condition: 'stormy',
    temperature: 12,
    humidity: 95,
    tempo_multiplier: 0.8,
    reverb_level: 0.7,
    is_major_key: false,
    park_id: 0,
    wind_speed: 0,
    rain_level: 0,
    thunder: false
}

const hotWeather: WeatherData = {
    weather_condition: 'stormy',
    temperature: 35,
    humidity: 30,
    tempo_multiplier: 1.1,
    reverb_level: 0.1,
    is_major_key: true,
    park_id: 0,
    wind_speed: 0,
    rain_level: 0,
    thunder: false
}

const coldWeather: WeatherData = {
    weather_condition: 'stormy',
    temperature: 5,
    humidity: 60,
    tempo_multiplier: 0.9,
    reverb_level: 0.4,
    is_major_key: false,
    park_id: 0,
    wind_speed: 0,
    rain_level: 0,
    thunder: false
}

// Mock weather effects hook
const mockWeatherEffects = {
    weatherEffectsActive: true,
    toggleWeatherEffects: () => { },
    getWeatherEffectDescription: (weather: WeatherData) => [
        '標準的な音響効果',
        'テンポが自然なペース',
        '適度なエコー効果'
    ],
    calculateMusicParameters: (weather: WeatherData) => ({
        bpm: Math.round(120 * weather.tempo_multiplier),
        volume: 70,
        reverb: weather.reverb_level,
        isMinor: !weather.is_major_key,
        weather
    }),
}

// jest.mock('../../hooks/useWeatherEffects', () => ({
//     useWeatherEffects: () => mockWeatherEffects
// }))

const meta: Meta<typeof WeatherMusicDisplay> = {
    title: 'Components/WeatherMusicDisplay',
    component: WeatherMusicDisplay,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: '現在の天候と、それが音楽に与える影響をリアルタイムで表示するコンポーネント。KODAMA の核となる天候連動機能を可視化します。',
            },
        },
    },
    argTypes: {
        weather: {
            description: '表示する天候データ',
            control: { type: 'object' },
        },
        className: {
            control: 'text',
            description: '追加のCSSクラス名',
        },
        showMusicEffects: {
            control: 'boolean',
            description: '音楽効果の表示/非表示',
        },
    },
} satisfies Meta<typeof WeatherMusicDisplay>

export default meta
type Story = StoryObj<typeof meta>

// 晴天
export const Sunny: Story = {
    args: {
        weather: sunnyWeather,
        showMusicEffects: true,
    },
    parameters: {
        docs: {
            description: {
                story: '晴天時の表示。長調（明るい響き）で標準的なテンポです。',
            },
        },
    },
}

// 雨天
export const Rainy: Story = {
    args: {
        weather: rainyWeather,
        showMusicEffects: true,
    },
    parameters: {
        docs: {
            description: {
                story: '雨天時の表示。テンポが上昇し、リバーブ効果が強化されます。短調になります。',
            },
        },
    },
}

// 嵐
export const Stormy: Story = {
    args: {
        weather: stormyWeather,
        showMusicEffects: true,
    },
    parameters: {
        docs: {
            description: {
                story: '嵐の時の表示。最も劇的な音響効果で、高いテンポと強いエコー効果が特徴です。',
            },
        },
    },
}

// 雪
export const Snowy: Story = {
    args: {
        weather: snowyWeather,
        showMusicEffects: true,
    },
    parameters: {
        docs: {
            description: {
                story: '雪の時の表示。低温により短調で、テンポが遅く、静寂で神秘的な響きになります。',
            },
        },
    },
}

// 霧
export const Foggy: Story = {
    args: {
        weather: foggyWeather,
        showMusicEffects: true,
    },
    parameters: {
        docs: {
            description: {
                story: '霧の時の表示。幻想的で柔らかい音響効果が特徴です。',
            },
        },
    },
}

// 猛暑
export const Hot: Story = {
    args: {
        weather: hotWeather,
        showMusicEffects: true,
    },
    parameters: {
        docs: {
            description: {
                story: '猛暑時の表示。高温により長調で活発な音楽になります。',
            },
        },
    },
}

// 厳寒
export const Cold: Story = {
    args: {
        weather: coldWeather,
        showMusicEffects: true,
    },
    parameters: {
        docs: {
            description: {
                story: '寒冷時の表示。低温により短調で落ち着いたテンポになります。',
            },
        },
    },
}

// 音楽効果非表示
export const WithoutMusicEffects: Story = {
    args: {
        weather: rainyWeather,
        showMusicEffects: false,
    },
    parameters: {
        docs: {
            description: {
                story: '音楽への影響を表示しない、シンプルな天候表示モード。',
            },
        },
    },
}

// 音響効果無効
export const EffectsDisabled: Story = {
    args: {
        weather: stormyWeather,
        showMusicEffects: true,
    },
    parameters: {
        docs: {
            description: {
                story: '天候の音響効果を無効化した状態。切り替えボタンでON/OFFできます。',
            },
        },
        mockData: {
            useWeatherEffects: () => ({
                ...mockWeatherEffects,
                weatherEffectsActive: false,
            })
        }
    },
}

// カスタムスタイル
export const CustomStyling: Story = {
    args: {
        weather: rainyWeather,
        showMusicEffects: true,
        className: 'shadow-2xl border-l-4 border-blue-500',
    },
    parameters: {
        docs: {
            description: {
                story: 'カスタムCSSクラスを適用した例。左側に青いボーダーを追加しています。',
            },
        },
    },
}

// アニメーション状態
export const AnimationState: Story = {
    args: {
        weather: stormyWeather,
        showMusicEffects: true,
    },
    parameters: {
        docs: {
            description: {
                story: '天候変化時のアニメーション効果を含む表示。アイコンがバウンスし、効果説明がフェードインします。',
            },
        },
    },
}
