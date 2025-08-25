export interface Park {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  width: number;
  height: number;
  created_at?: string;
  updated_at?: string;
}

export interface SoundSource {
  id: number;
  name: string;
  type: string;
  category: 'basic' | 'japanese' | '80s_synth';
  file_path?: string;
  is_free: boolean;
  price: number;
  icon_path?: string;
  description?: string;
  file_url?: string;
  icon_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SoundSeed {
  id: number;
  park_id: number;
  user_id: number;
  sound_source_id: number;
  x_position: number;
  y_position: number;
  volume: number;
  created_at?: string;
  updated_at?: string;
  sound_source?: SoundSource;
  user?: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface WeatherData {
  id?: number;
  park_id: number;
  temperature: number;
  humidity: number;
  wind_speed: number;
  rain_level: number;
  thunder: boolean;
  weather_condition: 'clear' | 'cloudy' | 'rainy' | 'stormy';
  recorded_at?: string;
  tempo_multiplier: number;
  reverb_level: number;
  is_major_key: boolean;
}

export interface QrCode {
  id: number;
  code: string;
  sound_source_id: number;
  is_active: boolean;
  max_uses?: number;
  used_count: number;
  expires_at?: string;
  sound_source?: SoundSource;
}

export interface PurchasedSoundSource {
  id: number;
  user_id: number;
  sound_source_id: number;
  qr_code?: string;
  purchased_at: string;
  sound_source?: SoundSource;
}

export interface SoundSeedPlacement {
  x: number;
  y: number;
  soundSourceId: number;
  volume: number;
}

export interface WeatherEffects {
  tempo: number;
  reverb: number;
  isMajor: boolean;
  filter?: 'none' | 'rain' | 'thunder';
}

export interface AudioContext {
  isPlaying: boolean;
  currentTime: number;
  bpm: number;
  volume: number;
}