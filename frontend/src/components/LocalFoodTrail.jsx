import { useState } from 'react'
import { Utensils, Sparkles, MapPin, CheckCircle, Leaf, Flame } from 'lucide-react'
import { REGIONAL_FOOD_TRAILS } from '../data/foodTrailData'
import { useLanguage } from '../context/LanguageContext'

export default function LocalFoodTrail({ aiFoodTrail = [], startingPoint = '' }) {
  const { language, t } = useLanguage()
  const [activeRegionIndex, setActiveRegionIndex] = useState(0)

  const activeTrail = REGIONAL_FOOD_TRAILS[activeRegionIndex] || REGIONAL_FOOD_TRAILS[0]

  return (
    <div className="card border border-stone-200/90 bg-gradient-to-br from-amber-50/40 via-white to-red-50/30 p-5 sm:p-6 rounded-2xl shadow-sm mt-8">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-xs">
            <Utensils size={18} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-karnataka-dark flex items-center gap-1.5">
              <span>{t('foodTrailTitle')}</span>
              <span className="text-xs bg-amber-500/15 text-amber-900 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                ರುಚಿ ಪಯಣ
              </span>
            </h3>
            <p className="text-xs text-stone-500">{t('foodTrailSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* AI Custom Generated Food Highlights (if returned by backend AI) */}
      {aiFoodTrail && aiFoodTrail.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-white border border-amber-200/70 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
            <Sparkles size={13} className="text-amber-600" />
            <span>Itinerary-Specific Culinary Stops</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {aiFoodTrail.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-amber-50/40 border border-amber-100 text-xs">
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h5 className="font-bold text-stone-900">{item.dish_name || item.name}</h5>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                    item.vegetarian
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {item.vegetarian ? <Leaf size={9} /> : <Flame size={9} />}
                    {item.vegetarian ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mb-1">{item.description}</p>
                <div className="text-[10px] text-amber-800 font-semibold flex items-center gap-1">
                  <MapPin size={10} className="text-amber-600" />
                  <span>{item.iconic_spot || item.where_to_try}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regional Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
        {REGIONAL_FOOD_TRAILS.map((trail, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveRegionIndex(idx)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeRegionIndex === idx
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {language === 'kn' ? trail.regionKn : trail.region}
          </button>
        ))}
      </div>

      {/* Regional Trail Header */}
      <div className="mb-4 text-xs text-stone-600 bg-white/70 p-3 rounded-xl border border-stone-100">
        <p className="italic font-medium">
          {language === 'kn' ? activeTrail.descriptionKn : activeTrail.description}
        </p>
      </div>

      {/* Dishes Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTrail.dishes.map((dish, i) => (
          <div
            key={i}
            className="bg-white rounded-xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              {/* Photo */}
              <div className="h-32 w-full overflow-hidden bg-stone-100 relative">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 ${
                  dish.isVeg
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-950/80 text-red-300 border border-red-500/40'
                }`}>
                  {dish.isVeg ? <Leaf size={10} /> : <Flame size={10} />}
                  {dish.isVeg ? (language === 'kn' ? 'ಸಸ್ಯಾಹಾರಿ' : 'Veg') : (language === 'kn' ? 'ಮಾಂಸಾಹಾರಿ' : 'Non-Veg')}
                </span>
              </div>

              {/* Text info */}
              <div className="p-3.5 space-y-2">
                <div>
                  <h4 className="text-xs font-black text-stone-900 leading-snug">
                    {dish.name}
                  </h4>
                  <div className="text-[11px] font-bold text-amber-700 font-sans">
                    {dish.nameKn}
                  </div>
                </div>

                <p className="text-[11px] text-stone-600 leading-relaxed font-normal">
                  {language === 'kn' ? dish.descriptionKn : dish.description}
                </p>
              </div>
            </div>

            {/* Where to Try */}
            <div className="p-3.5 pt-0">
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/60 text-[10px] text-stone-700 leading-snug">
                <strong className="text-amber-800 font-bold block mb-0.5">
                  📍 {t('famousAt')}:
                </strong>
                <span className="text-stone-600">
                  {language === 'kn' ? dish.famousAtKn : dish.famousAt}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
