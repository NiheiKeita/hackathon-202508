/**
 * 2つの座標間の距離をメートル単位で計算（Haversine公式）
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000 // 地球の半径（メートル）
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // メートル単位での距離
}

/**
 * 指定された範囲内にある音の種を検出
 */
export interface SoundSeed {
  id: number
  latitude: number
  longitude: number
  sound_source_id: number
  volume: number
  created_at: string
  updated_at: string
}

export interface Position {
  latitude: number
  longitude: number
}

export function getAudibleSeeds(
  userPosition: Position,
  allSeeds: SoundSeed[],
  maxDistance: number = 100 // デフォルト100メートル
): { seeds: SoundSeed[]; distances: Record<number, number> } {
  const audibleSeeds: SoundSeed[] = []
  const distances: Record<number, number> = {}

  allSeeds.forEach((seed) => {
    const distance = calculateDistance(
      userPosition.latitude,
      userPosition.longitude,
      seed.latitude,
      seed.longitude
    )

    if (distance <= maxDistance) {
      audibleSeeds.push(seed)
      distances[seed.id] = distance
    }
  })

  // 距離が近い順にソート
  audibleSeeds.sort((a, b) => distances[a.id] - distances[b.id])

  return { seeds: audibleSeeds, distances }
}

/**
 * 距離に基づいて音量を計算（距離が近いほど大きく）
 */
export function calculateVolumeByDistance(
  distance: number,
  maxDistance: number = 100,
  maxVolume: number = 1.0
): number {
  if (distance > maxDistance) return 0

  // 逆二乗の法則を簡略化したもの
  const volumeFactor = 1 - Math.pow(distance / maxDistance, 2)
  return Math.max(0, volumeFactor * maxVolume)
}

/**
 * 音の3D位置を計算（左右のパンニング用）
 */
export function calculate3DPosition(
  userPosition: Position,
  seedPosition: Position,
  userHeading: number = 0 // ユーザーの向き（北を0度）
): { pan: number; distance: number } {
  const distance = calculateDistance(
    userPosition.latitude,
    userPosition.longitude,
    seedPosition.latitude,
    seedPosition.longitude
  )

  // 方角を計算
  const deltaLat = seedPosition.latitude - userPosition.latitude
  const deltaLon = seedPosition.longitude - userPosition.longitude
  const angle = Math.atan2(deltaLon, deltaLat) * (180 / Math.PI)
  
  // ユーザーの向きを考慮した相対角度
  const relativeAngle = angle - userHeading
  
  // -1（左）から1（右）の範囲でパンを計算
  const pan = Math.sin((relativeAngle * Math.PI) / 180)

  return { pan, distance }
}