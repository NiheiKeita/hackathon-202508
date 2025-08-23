import type { Meta, StoryObj } from '@storybook/react'
import KodamaHome from './index'
import { Park } from '../../../types/kodama'

// Mock parks data
const mockParks: Park[] = [
  {
    id: 1,
    name: '代々木公園',
    latitude: 35.6719,
    longitude: 139.6963,
    description: '東京都渋谷区にある都立公園',
    width: 800,
    height: 600,
  },
  {
    id: 2,
    name: '上野公園',
    latitude: 35.7153,
    longitude: 139.7740,
    description: '東京都台東区にある都立公園',
    width: 1000,
    height: 700,
  },
  {
    id: 3,
    name: '井の頭公園',
    latitude: 35.7009,
    longitude: 139.5797,
    description: '東京都武蔵野市と三鷹市にまたがる都立公園',
    width: 900,
    height: 650,
  },
]

// Mock hooks
const mockHooks = {
  useHomeHooks: () => ({
    parks: mockParks,
    loading: false,
    error: null,
  }),
}

const meta: Meta<typeof KodamaHome> = {
  title: 'Pages/Kodama/Home',
  component: KodamaHome,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>;

export const Default: Story = {}

export const Loading: Story = {
  parameters: {
    mockData: [
      {
        url: '/api/kodama/parks',
        method: 'GET',
        status: 200,
        response: { loading: true, data: [] },
      },
    ],
  },
}

export const Error: Story = {
  parameters: {
    mockData: [
      {
        url: '/api/kodama/parks',
        method: 'GET',
        status: 500,
        response: { error: 'ネットワークエラーが発生しました' },
      },
    ],
  },
}

export const EmptyParks: Story = {
  parameters: {
    mockData: [
      {
        url: '/api/kodama/parks',
        method: 'GET',
        status: 200,
        response: { data: [] },
      },
    ],
  },
}