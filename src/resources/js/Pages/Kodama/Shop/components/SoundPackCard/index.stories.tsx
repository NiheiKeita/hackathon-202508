import type { Meta, StoryObj } from '@storybook/react'
import SoundPackCard from './index'
import { SoundSource } from '../../../../../types/kodama'

// Mock sound sources
const japaneseSounds: SoundSource[] = [
  {
    id: 1,
    name: '和太鼓',
    type: 'taiko',
    category: 'japanese',
    is_free: false,
    price: 300,
    description: '力強い和太鼓の響き',
    file_url: '',
  },
  {
    id: 2,
    name: '琴',
    type: 'koto',
    category: 'japanese',
    is_free: false,
    price: 250,
    description: '繊細で美しい琴の音色',
    file_url: '',
  },
  {
    id: 3,
    name: '尺八',
    type: 'fue',
    category: 'japanese',
    is_free: false,
    price: 200,
    description: '風情ある尺八の調べ',
    file_url: '',
  },
  {
    id: 4,
    name: '三味線',
    type: 'shamisen',
    category: 'japanese',
    is_free: false,
    price: 280,
    description: '情緒豊かな三味線',
    file_url: '',
  },
  {
    id: 5,
    name: '鈴',
    type: 'bell',
    category: 'japanese',
    is_free: false,
    price: 150,
    description: '清らかな鈴の音',
    file_url: '',
  },
]

const synthSounds: SoundSource[] = [
  {
    id: 6,
    name: 'DX7 Bell',
    type: 'dx7_bell',
    category: '80s_synth',
    is_free: false,
    price: 400,
    description: '80年代を代表するDX7ベル音',
    file_url: '',
  },
  {
    id: 7,
    name: 'Analog Bass',
    type: 'analog_bass',
    category: '80s_synth',
    is_free: false,
    price: 350,
    description: '温かみのあるアナログベース',
    file_url: '',
  },
  {
    id: 8,
    name: 'Lead Synth',
    type: 'lead_synth',
    category: '80s_synth',
    is_free: false,
    price: 380,
    description: '印象的なリードシンセ',
    file_url: '',
  },
  {
    id: 9,
    name: 'Pad Synth',
    type: 'synth_pad',
    category: '80s_synth',
    is_free: false,
    price: 300,
    description: '包み込むようなパッドサウンド',
    file_url: '',
  },
  {
    id: 10,
    name: 'Arpeggio',
    type: 'arpeggio',
    category: '80s_synth',
    is_free: false,
    price: 320,
    description: 'リズミカルなアルペジオ',
    file_url: '',
  },
]

// Pack categories
const japanesePackCategory = {
  key: 'japanese' as const,
  name: '和楽器パック',
  description: '伝統的な日本の楽器で風雅な音楽を',
  icon: '🎋',
  color: 'from-red-400 to-pink-500',
  price: 1200,
}

const synthPackCategory = {
  key: '80s_synth' as const,
  name: '80年代シンセパック',
  description: 'レトロフューチャーなシンセサウンド',
  icon: '🎛️',
  color: 'from-purple-400 to-pink-500',
  price: 1500,
}

const meta: Meta<typeof SoundPackCard> = {
  title: 'Pages/Shop/SoundPackCard',
  component: SoundPackCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '音源パックの購入カード。パック内容、価格、購入状態を表示し、購入アクションを提供します。',
      },
    },
  },
  argTypes: {
    category: {
      description: 'パックカテゴリー情報',
      control: { type: 'object' },
    },
    sounds: {
      description: '含まれる音源リスト',
      control: { type: 'object' },
    },
    onPurchase: {
      description: '購入ボタンクリック時のコールバック',
      action: 'purchase clicked',
    },
  },
} satisfies Meta<typeof SoundPackCard>

export default meta
type Story = StoryObj<typeof meta>

// 和楽器パック（未購入）
export const JapanesePackNotPurchased: Story = {
  args: {
    category: japanesePackCategory,
    sounds: [], // 未購入なので空
    onPurchase: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: '和楽器パックの未購入状態。購入ボタンが有効で、お得情報が表示されています。',
      },
    },
  },
}

// 和楽器パック（購入済み）
export const JapanesePackPurchased: Story = {
  args: {
    category: japanesePackCategory,
    sounds: japaneseSounds,
    onPurchase: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: '和楽器パック購入済み状態。含まれる音源が表示され、購入済みバッジが付きます。',
      },
    },
  },
}

// 80年代シンセパック（未購入）
export const SynthPackNotPurchased: Story = {
  args: {
    category: synthPackCategory,
    sounds: [], // 未購入なので空
    onPurchase: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: '80年代シンセパックの未購入状態。より高価格ですが、レトロな魅力があります。',
      },
    },
  },
}

// 80年代シンセパック（購入済み）
export const SynthPackPurchased: Story = {
  args: {
    category: synthPackCategory,
    sounds: synthSounds,
    onPurchase: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: '80年代シンセパック購入済み状態。多様なシンセサウンドが含まれています。',
      },
    },
  },
}

// 一部音源のみの状態
export const PartialSounds: Story = {
  args: {
    category: japanesePackCategory,
    sounds: japaneseSounds.slice(0, 2), // 最初の2つだけ
    onPurchase: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: '部分的に音源が含まれている状態（テスト用）。通常は全音源が一括で提供されます。',
      },
    },
  },
}

// ホバー状態のシミュレーション
export const HoverState: Story = {
  args: {
    category: japanesePackCategory,
    sounds: [],
    onPurchase: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'カードホバー時の視覚効果。実際にはCSS transitionでスケール効果が適用されます。',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="scale-105 transform transition-transform">
        <Story />
      </div>
    ),
  ],
}

// カスタム価格設定
export const CustomPrice: Story = {
  args: {
    category: {
      ...japanesePackCategory,
      price: 999, // セール価格
    },
    sounds: [],
    onPurchase: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'セール時などのカスタム価格設定例。通常価格から割引されています。',
      },
    },
  },
}

// 豊富な音源を持つパック
export const RichContentPack: Story = {
  args: {
    category: {
      ...synthPackCategory,
      name: 'プレミアムシンセパック',
      description: '10種類以上のプレミアム音源を収録',
    },
    sounds: [
      ...synthSounds,
      ...synthSounds.map(sound => ({
        ...sound,
        id: sound.id + 100,
        name: sound.name + ' (Variation)',
      })),
    ],
    onPurchase: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: '多くの音源を含むパックの表示例。リストが長い場合は「他N個」形式で表示されます。',
      },
    },
  },
}

// 限定パック
export const LimitedEdition: Story = {
  args: {
    category: {
      key: 'japanese' as const,
      name: '限定和楽器パック',
      description: '期間限定の特別な和楽器コレクション',
      icon: '🌸',
      color: 'from-pink-400 to-red-500',
      price: 1800,
    },
    sounds: [],
    onPurchase: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: '限定パックの表示例。特別なアイコンと色彩で差別化されています。',
      },
    },
  },
}