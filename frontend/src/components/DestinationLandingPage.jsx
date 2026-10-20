import { useEffect } from 'react'
import {
  MapPin, Calendar, Clock, Compass, Utensils, Sparkles,
  ArrowRight, ArrowLeft, Star, ExternalLink, ShieldAlert
} from 'lucide-react'
import { DESTINATION_SEO_DATA } from '../data/destinationSeoData'
import { useLanguage } from '../context/LanguageContext'

export default function DestinationLandingPage({ slug, onPlanTrip, onBack }) {
  const { language } = useLanguage()
  const isKn = language === 'kn'

  const dest = DESTINATION_SEO_DATA[slug] || DESTINATION_SEO_DATA['hampi']

  // Update document Head for dynamic SEO & OpenGraph tags
  useEffect(() => {
    const pageTitle = isKn ? dest.titleKn : dest.title
    const pageDesc = isKn ? dest.descriptionKn : dest.description

    document.title = pageTitle

    // Meta Description
    let descTag = document.querySelector('meta[name="description"]')
    if (!descTag) {
      descTag = document.createElement('meta')
      descTag.name = 'description'
      document.head.appendChild(descTag)
    }
    descTag.content = pageDesc

    // OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.content = pageTitle

    // OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    ogDesc.content = pageDesc

    // OpenGraph Image
    let ogImage = document.querySelector('meta[property="og:image"]')
    if (!ogImage) {
      ogImage = document.createElement('meta')
      ogImage.setAttribute('property', 'og:image')
      document.head.appendChild(ogImage)
    }
    ogImage.content = dest.ogImage

    // Schema.org JSON-LD structured data script
    const scriptId = 'destination-jsonld-script'
    let scriptTag = document.getElementById(scriptId)
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.id = scriptId
      scriptTag.type = 'application/ld+json'
      document.head.appendChild(scriptTag)
    }
    scriptTag.text = JSON.stringify(dest.jsonLd)

    return () => {
      // Clean up script on unmount
      const existingScript = document.getElementById(scriptId)
      if (existingScript) existingScript.remove()
      document.title = 'Yatra AI — Karnataka Travel Planner'
    }
  }, [dest, isKn])

  return (
    <article className="animate-fade-in max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-stone-900 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs hover:border-karnataka-red transition-all"
        >
          <ArrowLeft size={14} />
          <span>{isKn ? 'ಮುಖ್ಯ ಪ್ರವಾಸ ಯೋಜನೆಗೆ ಹಿಂತಿರುಗಿ' : 'Back to Trip Planner'}</span>
        </button>

        <span className="text-xs font-mono font-bold text-stone-400">
          Circuit: {dest.name}
        </span>
      </div>

      {/* Hero Visual Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 dark:border-stone-800 min-h-[380px] sm:min-h-[440px] flex flex-col justify-end p-6 sm:p-10">
        <img
          src={dest.ogImage}
          alt={dest.name}
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-karnataka-red text-white shadow-sm">
              Featured Circuit
            </span>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
              🗓️ {dest.recommendedDays} {isKn ? 'ದಿನಗಳು' : 'Days Recommended'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-sans tracking-tight">
            {isKn ? dest.nameKn : dest.name}
          </h1>

          <p className="text-sm sm:text-base text-stone-200 font-medium leading-relaxed">
            {dest.heroTagline}
          </p>

          <p className="text-xs sm:text-sm text-stone-300 font-normal leading-relaxed pt-1">
            {isKn ? dest.descriptionKn : dest.description}
          </p>

          <div className="pt-3 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => onPlanTrip(dest.hub, dest.recommendedDays)}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-black shadow-xl"
            >
              <Sparkles size={16} />
              <span>{isKn ? `ನನ್ನ ${dest.nameKn} ಪ್ರವಾಸವನ್ನು ರಚಿಸಿ` : `Auto-Plan My ${dest.name} Itinerary`}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Best Season & Weather Advisory Card */}
      <div className="card bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
          <Calendar size={20} />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
            {isKn ? 'ಭೇಟಿ ನೀಡಲು ಸೂಕ್ತ ಸಮಯ' : 'Best Time To Visit'}
          </span>
          <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
            {dest.bestSeason}
          </p>
        </div>
      </div>

      {/* Top Heritage & Natural Sights Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Compass size={20} className="text-karnataka-red" />
          <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
            {isKn ? 'ಪ್ರಮುಖ ಆಕರ್ಷಣೆಗಳು ಮತ್ತು ವೀಕ್ಷಣಾ ತಾಣಗಳು' : 'Key Attractions & Unmissable Highlights'}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {dest.topSights.map((sight, idx) => (
            <div
              key={idx}
              className="card bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-5 rounded-2xl space-y-1.5 shadow-xs hover:border-karnataka-red/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-stone-400">Stop #{idx + 1}</span>
                <span className="text-xs text-amber-400">★ ★ ★ ★ ★</span>
              </div>
              <h3 className="text-sm font-black text-stone-900 dark:text-stone-100">
                {isKn ? sight.kn : sight.name}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-normal">
                {sight.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Authentic Food Trail Section */}
      <section className="card bg-gradient-to-br from-amber-500/10 via-red-500/5 to-transparent border border-amber-300/40 dark:border-amber-800/40 p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-2">
          <Utensils size={18} className="text-karnataka-gold" />
          <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
            {isKn ? 'ಸ್ಥಳೀಯ ಆಹಾರ ಮತ್ತು ವಿಶೇಷ ರುಚಿಗಳು' : 'Iconic Regional Food Trail'}
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {dest.foods.map((food, fIdx) => (
            <div key={fIdx} className="p-3.5 rounded-xl bg-white/90 dark:bg-stone-900/90 border border-amber-200/60 dark:border-amber-900/60 shadow-2xs">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-1">
                Must-Try Dish #{fIdx + 1}
              </span>
              <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                {food}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-karnataka-red via-red-700 to-amber-700 text-white text-center space-y-4 shadow-xl">
        <h3 className="text-xl sm:text-2xl font-black">
          {isKn ? `ಈಗಲೇ ನಿಮ್ಮ ${dest.nameKn} ಪ್ರವಾಸವನ್ನು ಯೋಜಿಸಿ` : `Ready to Explore ${dest.name}?`}
        </h3>
        <p className="text-xs sm:text-sm text-red-100 max-w-xl mx-auto">
          {isKn
            ? 'ಉಚಿತ AI ಪ್ರವಾಸ ಶಿಲ್ಪಿ ನಿಮಿಷಗಳಲ್ಲಿ ದಿನವಾರು ವೇಳಾಪಟ್ಟಿ, ಬಜೆಟ್ ಅಂದಾಜು ಮತ್ತು ನಕ್ಷೆ ಮಾರ್ಗವನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತದೆ.'
            : 'Get a personalized day-by-day route with budget breakdown, Leaflet road map, weather advisory, and KSRTC transit options.'}
        </p>
        <button
          type="button"
          onClick={() => onPlanTrip(dest.hub, dest.recommendedDays)}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-karnataka-red font-black text-sm shadow-2xl hover:bg-stone-100 hover:scale-105 transition-all"
        >
          <Sparkles size={16} />
          <span>{isKn ? 'ಪ್ರವಾಸ ರಚನೆ ಪ್ರಾರಂಭಿಸಿ' : 'Generate This Itinerary Now'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  )
}
