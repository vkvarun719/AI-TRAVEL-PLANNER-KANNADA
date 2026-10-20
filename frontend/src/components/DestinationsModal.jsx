import { useState, useEffect } from 'react'
import {
  MapPin, X, Calendar, Utensils, Lightbulb, Compass,
  Sparkles, ExternalLink, ArrowRight, Heart
} from 'lucide-react'
import toast from 'react-hot-toast'
import { KARNATAKA_DESTINATIONS_DATA } from '../data/destinationsData'
import { useLanguage } from '../context/LanguageContext'
import { getFavoriteDestinations, toggleFavoriteDestination } from '../utils/tripStorage'

export default function DestinationsModal({ isOpen, onClose, onSelectDestination }) {
  const { language, t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    if (isOpen) {
      setFavorites(getFavoriteDestinations())
    }
  }, [isOpen])

  if (!isOpen) return null

  const filtered = selectedCategory === 'all'
    ? KARNATAKA_DESTINATIONS_DATA
    : selectedCategory === 'favorites'
    ? KARNATAKA_DESTINATIONS_DATA.filter(d => favorites.includes(d.id))
    : KARNATAKA_DESTINATIONS_DATA.filter(d => d.category === selectedCategory)

  const handleToggleFavorite = (destId, e) => {
    e.stopPropagation()
    const updated = toggleFavoriteDestination(destId)
    setFavorites(updated)
    const isNowFav = updated.includes(destId)
    if (isNowFav) {
      toast.success(language === 'kn' ? 'ಮೆಚ್ಚಿನ ತಾಣಗಳಿಗೆ ಸೇರಿಸಲಾಗಿದೆ! ❤️' : 'Added to favorites wishlist! ❤️')
    } else {
      toast(language === 'kn' ? 'ಮೆಚ್ಚಿನ ತಾಣಗಳಿಂದ ತೆಗೆಯಲಾಗಿದೆ' : 'Removed from favorites wishlist', { icon: '🤍' })
    }
  }

  const handlePlanTrip = (dest) => {
    onSelectDestination?.(dest.name)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#FAF6F0] dark:bg-stone-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] flex flex-col overflow-hidden transition-colors">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-white dark:bg-stone-900 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-karnataka-gold to-amber-600 flex items-center justify-center text-white shadow-md">
              <Compass size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-karnataka-dark dark:text-white flex items-center gap-2">
                <span>{t('destinationsTitle')}</span>
                <span className="text-xs bg-karnataka-red/10 text-karnataka-red px-2.5 py-0.5 rounded-full font-bold">
                  {KARNATAKA_DESTINATIONS_DATA.length} Destinations
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">{t('destinationsSubtitle')}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 sm:px-6 py-3 bg-stone-100/80 dark:bg-stone-900/80 border-b border-stone-200/60 dark:border-stone-800 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: t('filterAll') },
            { id: 'heritage', label: t('filterHeritage') },
            { id: 'ghats', label: t('filterGhats') },
            { id: 'coastal', label: t('filterCoastal') },
            { id: 'offbeat', label: t('filterOffbeat') },
            { id: 'favorites', label: `${t('filterFavorites')} (${favorites.length})` },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedCategory(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === f.id
                  ? 'bg-karnataka-red text-white shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Destination Cards Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {filtered.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-karnataka-red shadow-inner">
                <Heart size={26} className="fill-red-200 text-karnataka-red" />
              </div>
              <h3 className="text-base font-bold text-stone-800 dark:text-white">
                {t('filterFavorites')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                {t('noFavoritesYet')}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map((dest) => (
                <div
                  key={dest.id}
                  className="card bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                      <img
                        src={dest.heroImage}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="bg-black/60 backdrop-blur-md text-karnataka-gold text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-karnataka-gold/40">
                          {language === 'kn' ? dest.regionKn : dest.region}
                        </span>
                      </div>

                      {/* Wishlist Heart Toggle */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorite(dest.id, e)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md z-10"
                        title={favorites.includes(dest.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart
                          size={15}
                          className={favorites.includes(dest.id) ? "fill-red-500 text-red-500" : "text-white"}
                        />
                      </button>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-lg font-black tracking-tight leading-snug flex items-center gap-2">
                          <span>{dest.name}</span>
                          <span className="text-amber-300 font-sans text-sm font-semibold">({dest.nameKn})</span>
                        </h3>
                      <p className="text-[11px] text-stone-300 font-medium line-clamp-1">
                        {language === 'kn' ? dest.taglineKn : dest.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                      {language === 'kn' ? dest.descriptionKn : dest.description}
                    </p>

                    {/* Best Season */}
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800 p-2 rounded-lg border border-stone-200/60 dark:border-stone-700">
                      <Calendar size={13} className="text-amber-600 flex-shrink-0" />
                      <span className="truncate">
                        <strong>{t('bestSeason')}: </strong>
                        {language === 'kn' ? dest.bestSeasonKn : dest.bestSeason}
                      </span>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                        {t('topHighlights')}
                      </span>
                      <ul className="text-[11px] text-stone-700 dark:text-stone-300 space-y-1">
                        {(language === 'kn' ? dest.topHighlightsKn : dest.topHighlights).slice(0, 3).map((hl, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-karnataka-green font-bold">✓</span>
                            <span className="line-clamp-1">{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Famous Food */}
                    <div className="flex items-start gap-1.5 text-[11px] text-amber-900 dark:text-amber-200 bg-amber-50/70 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200/60 dark:border-amber-800/60">
                      <Utensils size={13} className="text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>{t('signatureDish')}: </strong>
                        {language === 'kn' ? dest.famousFoodKn : dest.famousFood}
                      </span>
                    </div>

                    {/* Insider Tip */}
                    <div className="flex items-start gap-1.5 text-[11px] text-emerald-900 dark:text-emerald-200 bg-emerald-50/70 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60 italic">
                      <Lightbulb size={13} className="text-karnataka-green flex-shrink-0 mt-0.5 not-italic" />
                      <span>
                        <strong className="not-italic">{t('insiderTip')}: </strong>
                        {language === 'kn' ? dest.offbeatTipKn : dest.offbeatTip}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Plan Trip Button */}
                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => handlePlanTrip(dest)}
                    className="w-full py-2.5 px-4 rounded-xl bg-karnataka-red hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{t('planTripToDestination', { name: language === 'kn' ? dest.nameKn : dest.name })}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

              </div>
            ))}
          </div>
          )}
        </div>

      </div>
    </div>
  )
}
