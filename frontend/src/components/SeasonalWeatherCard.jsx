import React, { useState, useEffect } from 'react'
import {
  CloudRain, Sun, Snowflake, Compass, Thermometer,
  AlertTriangle, Wind, Droplets, RefreshCw
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { fetchLiveForecast, getKarnatakaHazardWarnings } from '../utils/weatherService'

export default function SeasonalWeatherCard({
  seasonInfo,
  travelMonth = 'October',
  destination = 'Karnataka'
}) {
  const { language, t } = useLanguage()
  const isKn = language === 'kn'

  const [liveWeather, setLiveWeather] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch real-time weather from Open-Meteo
  useEffect(() => {
    let isMounted = true
    const loadWeather = async () => {
      setIsLoading(true)
      const data = await fetchLiveForecast(destination)
      if (isMounted) {
        setLiveWeather(data)
        setIsLoading(false)
      }
    }

    loadWeather()
    return () => {
      isMounted = false
    }
  }, [destination])

  const seasonName = seasonInfo?.season_name || 'Winter'
  const isMonsoon =
    seasonName.toLowerCase().includes('monsoon') ||
    seasonName.toLowerCase().includes('rain') ||
    ['june', 'july', 'august', 'september'].some(m => travelMonth.toLowerCase().includes(m))
  const isSummer =
    seasonName.toLowerCase().includes('summer') ||
    ['march', 'april', 'may'].some(m => travelMonth.toLowerCase().includes(m))

  const seasonBadgeText = isMonsoon
    ? (isKn ? 'ಮುಂಗಾರು ಮಳೆಗಾಲ' : 'Monsoon Season')
    : isSummer
    ? (isKn ? 'ಬೇಸಿಗೆ ಕಾಲ' : 'Summer Season')
    : (isKn ? 'ಚಳಿಗಾಲ' : 'Winter / Post-Monsoon')

  const SeasonIcon = isMonsoon ? CloudRain : (isSummer ? Sun : Snowflake)

  // Calculate hazards based on destination, month, and live forecast
  const hazards = getKarnatakaHazardWarnings(
    destination,
    travelMonth,
    liveWeather?.forecast?.[0]?.maxTemp || 28,
    liveWeather?.forecast?.[0]?.precipitation || 0
  )

  return (
    <div
      className={`card border rounded-2xl p-5 shadow-xs transition-all ${
        isMonsoon
          ? 'border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50/70 via-white dark:via-stone-900 to-teal-50/50 dark:to-teal-950/20'
          : isSummer
          ? 'border-amber-200 dark:border-amber-900 bg-gradient-to-br from-amber-50/70 via-white dark:via-stone-900 to-orange-50/50 dark:to-orange-950/20'
          : 'border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/60 via-white dark:via-stone-900 to-indigo-50/40 dark:to-indigo-950/20'
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-2xs ${
              isMonsoon ? 'bg-emerald-600' : isSummer ? 'bg-amber-500' : 'bg-blue-600'
            }`}
          >
            <SeasonIcon size={18} />
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isKn ? 'ಹವಾಮಾನ ಮತ್ತು ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು' : 'Weather & Seasonal Warnings'}
            </h4>
            <div className="text-xs font-black text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>{seasonBadgeText}</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold border border-stone-200 dark:border-stone-700">
                {travelMonth}
              </span>
            </div>
          </div>
        </div>

        {/* Live Weather Indicator */}
        {liveWeather && (
          <div className="flex items-center gap-2 bg-white/90 dark:bg-stone-800/90 px-3 py-1.5 rounded-xl border border-stone-200/80 dark:border-stone-700 text-xs shadow-2xs">
            <span className="text-base">{liveWeather.icon}</span>
            <div>
              <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                <span>{liveWeather.currentTemp}°C</span>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 font-normal">
                  ({isKn ? liveWeather.weatherSummaryKn : liveWeather.weatherSummary})
                </span>
              </div>
              <div className="text-[10px] text-stone-400 dark:text-stone-500 flex items-center gap-2">
                <span className="flex items-center gap-0.5">
                  <Droplets size={10} className="text-blue-500" /> {liveWeather.humidity}%
                </span>
                <span className="flex items-center gap-0.5">
                  <Wind size={10} className="text-stone-400" /> {liveWeather.windSpeed} km/h
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3-Day Live Forecast Strip (from Open-Meteo) */}
      {liveWeather?.forecast && liveWeather.forecast.length > 0 && (
        <div className="mb-4 bg-white/80 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200/70 dark:border-stone-700">
          <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
            <span>{isKn ? '೩-ದಿನದ ನೇರ ಮುನ್ಸೂಚನೆ (Open-Meteo)' : '3-Day Live Forecast (Open-Meteo)'}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold lowercase">free live api</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {liveWeather.forecast.map((day, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-stone-50/80 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 text-xs"
              >
                <div className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                  {day.date.includes('-') ? day.date.slice(5) : day.date}
                </div>
                <div className="text-base my-0.5">{day.icon}</div>
                <div className="font-bold text-stone-800 dark:text-stone-200">
                  {day.maxTemp}° / <span className="text-stone-400 font-normal">{day.minTemp}°</span>
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                  {isKn ? day.weatherKn : day.weather}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Seasonal Warnings (Hazard Banners) */}
      {hazards && hazards.length > 0 && (
        <div className="space-y-2 mb-4">
          {hazards.map((hazard) => (
            <div
              key={hazard.id}
              className={`p-3 rounded-xl border flex items-start gap-2.5 shadow-2xs ${
                hazard.severity === 'high'
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
              }`}
            >
              <span className="text-lg shrink-0 mt-0.5">{hazard.icon}</span>
              <div>
                <h5 className="text-xs font-bold flex items-center gap-1.5 leading-snug">
                  <span>{isKn ? hazard.titleKn : hazard.title}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase font-black ${
                      hazard.severity === 'high'
                        ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100'
                        : 'bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100'
                    }`}
                  >
                    {hazard.severity === 'high' ? (isKn ? 'ಮುಖ್ಯ ಎಚ್ಚರಿಕೆ' : 'Safety Warning') : (isKn ? 'ಗಮನಿಸಿ' : 'Advisory')}
                  </span>
                </h5>
                <p className="text-[11px] mt-0.5 leading-relaxed opacity-90">
                  {isKn ? hazard.messageKn : hazard.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* General Climate Overview */}
      {seasonInfo?.weather_summary && (
        <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed mb-3 bg-white/80 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-200/60 dark:border-stone-700 font-normal">
          {seasonInfo.weather_summary}
        </p>
      )}

      {/* Destination Climate Notes */}
      {seasonInfo?.destination_weather_notes && seasonInfo.destination_weather_notes.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            {isKn ? 'ತಾಣವಾರು ಹವಾಮಾನ ಟಿಪ್ಪಣಿಗಳು' : 'Destination Climate Notes'}
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {seasonInfo.destination_weather_notes.map((note, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200/80 dark:border-stone-700 shadow-2xs text-xs space-y-0.5"
              >
                <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100">
                  <span>📍 {note.destination}</span>
                  {note.temperature_range && (
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 font-mono">
                      🌡️ {note.temperature_range}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                  {note.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
