import React, { useState } from 'react'
import { Calendar, Sparkles, MapPin, ChevronDown, ChevronUp, Star, Info } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { KARNATAKA_FESTIVALS, getOverlappingFestivals } from '../data/karnatakaFestivals'

export default function FestivalEventsCard({
  travelMonth = 'October',
  destination = 'Mysuru'
}) {
  const { language } = useLanguage()
  const isKn = language === 'kn'

  const [isExpanded, setIsExpanded] = useState(false)
  const [showAllFestivals, setShowAllFestivals] = useState(false)

  const overlapping = getOverlappingFestivals(travelMonth, destination)
  const activeList = showAllFestivals ? KARNATAKA_FESTIVALS : (overlapping.length > 0 ? overlapping : KARNATAKA_FESTIVALS.slice(0, 3))

  return (
    <div className="card border border-amber-200/90 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/60 via-white dark:via-stone-900 to-orange-50/40 dark:to-orange-950/20 p-5 rounded-2xl shadow-xs space-y-3.5">
      {/* Top Banner */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 text-white flex items-center justify-center text-lg shadow-2xs">
            🎊
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <span>{isKn ? 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಸಾಂಸ್ಕೃತಿಕ ಉತ್ಸವಗಳು' : 'Karnataka Festivals & Cultural Calendar'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            </h4>
            <div className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-1.5">
              <span>
                {overlapping.length > 0
                  ? (isKn ? `ನಿಮ್ಮ ಪ್ರವಾಸದ ತಿಂಗಳಲ್ಲಿ (${travelMonth}) ವಿಶೇಷ ಉತ್ಸವಗಳು` : `Events During Your Travel Month (${travelMonth})`)
                  : (isKn ? 'ಪ್ರಸಿದ್ಧ ಕರ್ನಾಟಕ ಉತ್ಸವಗಳು' : 'Iconic Karnataka Celebrations')}
              </span>
            </div>
          </div>
        </div>

        {/* Overlap Pill Badge */}
        {overlapping.length > 0 && (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500 text-stone-950 shadow-xs flex items-center gap-1">
            <Sparkles size={11} />
            <span>{overlapping.length} {isKn ? 'ಹಬ್ಬಗಳು ಲಭ್ಯ' : 'Matching Festivals'}</span>
          </span>
        )}
      </div>

      {/* Intro Note */}
      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
        {overlapping.length > 0
          ? (isKn
              ? `ನೀವು ಆಯ್ಕೆ ಮಾಡಿದ ${travelMonth} ತಿಂಗಳಲ್ಲಿ ಕರ್ನಾಟಕದ ಭವ್ಯ ಸಂಪ್ರದಾಯದ ಉತ್ಸವಗಳು ನಡೆಯಲಿವೆ! ಪ್ರವಾಸದಲ್ಲಿ ಇವುಗಳನ್ನು ತಪ್ಪದೇ ವೀಕ್ಷಿಸಿ:`
              : `Your chosen travel dates in ${travelMonth} coincide with rich traditional Karnataka festivities! Consider experiencing these living cultural spectacles:`)
          : (isKn
              ? 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಸಾಂಸ್ಕೃತಿಕ ಹಬ್ಬಗಳು ಮತ್ತು ಅವುಗಳ ದಿನಾಂಕಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ನಿಮ್ಮ ಮುಂದಿನ ಪ್ರವಾಸವನ್ನು ಯೋಜಿಸಿ.'
              : 'Explore the royal pageants, folk races, and classical temple celebrations across Karnataka circuits.')}
      </p>

      {/* Festival Cards List */}
      <div className="space-y-2.5">
        {activeList.map((fest) => {
          const isDirect = fest.matchType === 'perfect'
          return (
            <div
              key={fest.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isDirect
                  ? 'bg-amber-100/60 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 shadow-xs'
                  : 'bg-white dark:bg-stone-800/80 border-stone-200/80 dark:border-stone-700 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{fest.icon}</span>
                  <div>
                    <h5 className="text-xs sm:text-sm font-black text-stone-900 dark:text-white flex items-center gap-1.5">
                      <span>{isKn ? fest.nameKn : fest.name}</span>
                      {isDirect && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-600 text-white uppercase">
                          {isKn ? 'ಸ್ಥಳ ಹೊಂದಾಣಿಕೆ' : 'On Your Route'}
                        </span>
                      )}
                    </h5>
                    <div className="text-[11px] font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <MapPin size={11} className="text-karnataka-red" />
                        <span>{isKn ? fest.destinationKn : fest.destination}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Calendar size={11} className="text-karnataka-green" />
                        <span>{isKn ? fest.datesKn : fest.dates}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-700 px-2 py-0.5 rounded-full shrink-0">
                  {isKn ? fest.categoryKn : fest.category}
                </span>
              </div>

              {/* Highlight */}
              <div className="text-xs font-bold text-karnataka-red dark:text-amber-400 mb-1 flex items-center gap-1">
                <Star size={11} fill="currentColor" />
                <span>{isKn ? fest.highlightKn : fest.highlight}</span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                {isKn ? fest.descriptionKn : fest.description}
              </p>

              {/* Traveler Tip */}
              <div className="mt-2 pt-1.5 border-t border-stone-100 dark:border-stone-700/60 flex items-start gap-1.5 text-[11px] text-amber-950 dark:text-amber-200 bg-amber-500/10 dark:bg-amber-400/10 p-2 rounded-lg">
                <Info size={12} className="shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" />
                <span>
                  <strong>{isKn ? 'ಪ್ರವಾಸಿ ಸಲಹೆ: ' : 'Traveler Tip: '}</strong>
                  {isKn ? fest.travelerTipKn : fest.travelerTip}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Toggle View More / All Festivals */}
      <div className="pt-1 text-center">
        <button
          type="button"
          onClick={() => setShowAllFestivals(!showAllFestivals)}
          className="inline-flex items-center gap-1 text-xs font-bold text-karnataka-red hover:underline transition-all"
        >
          <span>
            {showAllFestivals
              ? (isKn ? 'ಕಡಿಮೆ ತೋರಿಸಿ ▴' : 'Show Only Current Month ▴')
              : (isKn ? 'ಕರ್ನಾಟಕದ ಎಲ್ಲಾ ಹಬ್ಬಗಳನ್ನು ನೋಡಿ (ದಸರಾ, ಕಂಬಳ, ಹಂಪಿ ಉತ್ಸವ...) ▾' : 'Browse All Iconic Karnataka Festivals ▾')}
          </span>
        </button>
      </div>
    </div>
  )
}
