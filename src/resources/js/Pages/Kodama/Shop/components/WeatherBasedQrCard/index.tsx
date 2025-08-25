import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../Components/ui/card'
import { Badge } from '../../../../../Components/ui/badge'
import { Button } from '../../../../../Components/ui/button'
import { SoundSource, WeatherData } from '../../../../../types/kodama'

interface WeatherBasedQrCardProps {
  parkData: {
    park_id: number
    park_name: string
    qr_codes: Array<{
      id: number
      code: string
      sound_source: SoundSource
      weather_condition: string
      temperature_range: string
    }>
  }
  weather?: WeatherData
  getWeatherIcon: (condition: string) => string
  getTemperatureIcon: (temp: number) => string
}

const WeatherBasedQrCard: React.FC<WeatherBasedQrCardProps> = ({
  parkData,
  weather,
  getWeatherIcon,
  getTemperatureIcon,
}) => {
  const currentTemp = weather?.temperature || 20
  
  const getAvailableQrCodes = () => {
    if (!weather) return parkData.qr_codes

    return parkData.qr_codes.filter(qr => {
      // 天候条件チェック
      const weatherMatch = qr.weather_condition === 'any' || qr.weather_condition === weather.weather_condition

      // 温度条件チェック
      if (qr.temperature_range === 'any') return weatherMatch
      
      const [min, max] = qr.temperature_range.split('-').map(Number)
      const tempMatch = currentTemp >= min && currentTemp <= max

      return weatherMatch && tempMatch
    })
  }

  const availableQrCodes = getAvailableQrCodes()

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'clear': return '晴天時限定'
      case 'cloudy': return '曇天時限定'
      case 'rainy': return '雨天時限定'
      case 'stormy': return '嵐の時限定'
      case 'any': return 'いつでも'
      default: return condition
    }
  }

  const getTemperatureText = (range: string) => {
    if (range === 'any') return 'いつでも'
    const [min, max] = range.split('-').map(Number)
    return `${min}°C〜${max}°C`
  }

  return (
    <Card className="overflow-hidden border-2 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-green-800">
            📍 {parkData.park_name}
          </CardTitle>
          {weather && (
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getWeatherIcon(weather.weather_condition)}</span>
              <span className="text-2xl">{getTemperatureIcon(currentTemp)}</span>
              <span className="text-sm text-gray-600">{currentTemp}°C</span>
            </div>
          )}
        </div>
        
        {weather && (
          <div className="mt-2 text-sm text-gray-600">
            現在の天候: <Badge variant="secondary">{getConditionText(weather.weather_condition)}</Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-800">
          取得可能な音源 ({availableQrCodes.length}件)
        </h4>

        {availableQrCodes.length === 0 ? (
          <div className="rounded-lg bg-gray-100 p-6 text-center">
            <div className="mb-2 text-3xl">🌤️</div>
            <p className="text-gray-600">
              現在の天候・気温では取得できる音源がありません
            </p>
            <p className="mt-2 text-sm text-gray-500">
              天候や気温が変わると新しい音源が利用できるようになります
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableQrCodes.map(qr => (
              <div
                key={qr.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{qr.sound_source.icon_path}</span>
                      <h5 className="font-semibold text-gray-800">
                        {qr.sound_source.name}
                      </h5>
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-600">
                      {qr.sound_source.description}
                    </p>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {getConditionText(qr.weather_condition)}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {getTemperatureText(qr.temperature_range)}
                      </Badge>
                      <Badge 
                        variant="default" 
                        className="bg-green-100 text-green-800"
                      >
                        {qr.sound_source.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <Button 
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      QR取得
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    売店でQRコードをスキャンしてください
                  </p>
                  <p className="text-xs text-blue-600">
                    {parkData.park_name}の売店に設置されたQRコードを読み取ることで音源を取得できます
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default WeatherBasedQrCard