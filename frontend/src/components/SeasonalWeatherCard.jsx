import { CloudRain, Sun, Snowflake, Compass, Thermometer, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function SeasonalWeatherCard({ seasonInfo, travelMonth = 'October' }) {
  const { language, t } = useLanguage()

  if (!seasonInfo) return null

  const seasonName = seasonInfo.season_name || 'Winter'
  const isMonsoon = seasonName.toLowerCase().includes('monsoon') || seasonName.toLowerCase().includes('rain')
  const isSummer = seasonName.toLowerCase().includes('summer') || seasonName.toLowerCase().includes('hot')

  const seasonBadgeText = isMonsoon
    ? t('seasonMonsoon')
    : (isSummer ? t('seasonSummer') : t('seasonWinter'))

  const SeasonIcon = isMonsoon ? CloudRain : (isSummer ? Sun : Snowflake)

  return (
    <div className={`card border rounded-2xl p-5 shadow-xs transition-all ${
      isMonsoon
        ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50'
        : isSummer
        ? 'border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50'
        : 'border-blue-200 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-2xs ${
            isMonsoon ? 'bg-emerald-600' : isSummer ? 'bg-amber-500' : 'bg-blue-600'
          }`}>
            <SeasonIcon size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {t('seasonWeatherTitle')}
            </h4>
            <div className="text-xs font-black text-stone-900 flex items-center gap-1.5">
              <span>{seasonBadgeText}</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-stone-100 text-stone-600 font-bold border border-stone-200">
                {travelMonth}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Climate Summary */}
      <p className="text-xs text-stone-700 leading-relaxed mb-4 bg-white/80 p-3 rounded-xl border border-stone-200/60 font-normal">
        {seasonInfo.weather_summary}
      </p>

      {/* Destination Weather Notes */}
      {seasonInfo.destination_weather_notes && seasonInfo.destination_weather_notes.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Destination Climate Notes
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {seasonInfo.destination_weather_notes.map((note, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-xl border border-stone-200/80 shadow-2xs text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span>📍 {note.destination}</span>
                  {note.temperature_range && (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-mono">
                      🌡️ {note.temperature_range}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-600 leading-snug">
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
