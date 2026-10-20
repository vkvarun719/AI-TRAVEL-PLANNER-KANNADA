import { useState, useRef } from 'react'
import {
  Sun, Coffee, Sunset, Lightbulb, IndianRupee,
  MapPin, Calendar, Backpack, Star, ArrowLeft, Download,
  Hotel, Utensils, Compass, BedDouble, Tag, Clock, Sparkles,
  RotateCcw, Users, Layers, AlertCircle, ExternalLink, Car,
  Bookmark, Share2, Receipt, Check, Leaf
} from 'lucide-react'
import toast from 'react-hot-toast'
import DayMapViewer from './DayMapViewer'
import TransportLogisticsCard from './TransportLogisticsCard'
import KannadaCompanion from './KannadaCompanion'
import LocalFoodTrail from './LocalFoodTrail'
import CostBreakdownCard from './CostBreakdownCard'
import SeasonalWeatherCard from './SeasonalWeatherCard'
import FestivalEventsCard from './FestivalEventsCard'
import PackingChecklistCard from './PackingChecklistCard'
import ExpenseTrackerModal from './ExpenseTrackerModal'
import { useLanguage } from '../context/LanguageContext'
import { regenerateDay } from '../api/client'
import { saveTrip, isTripSaved, generateShareableUrl } from '../utils/tripStorage'
import { downloadIcsCalendar, getGoogleCalendarWebUrl } from '../utils/calendarExport'

// Verified high-res Karnataka landmark banners
const DESTINATION_BANNER_IMAGES = {
  hampi: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1400&q=80',
  bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1400&q=80',
  bengaluru: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1400&q=80',
  mysore: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1400&q=80',
  mysuru: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1400&q=80',
  coorg: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
  gokarna: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=80',
  chikmagalur: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
  badami: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=80',
  belur: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=80',
  default: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1400&q=80'
}

const SLOT_THUMBNAILS = {
  morning: [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=300&q=80',
  ],
  afternoon: [
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
  ],
  evening: [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=300&q=80',
  ]
}

function TimeBlock({ icon: Icon, label, text, color, slotKey, dayIndex }) {
  const thumbs = SLOT_THUMBNAILS[slotKey] || SLOT_THUMBNAILS.morning
  const thumbUrl = thumbs[dayIndex % thumbs.length]

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-3.5 rounded-xl bg-stone-50/70 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 hover:bg-white dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-600 transition-all duration-200">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${color} flex items-center justify-center text-white shadow-xs mt-0.5`}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-400 mb-1">{label}</p>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed font-normal">{text}</p>
        </div>
      </div>

      <div className="w-full sm:w-24 sm:h-20 h-28 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200 relative group">
        <img
          src={thumbUrl}
          alt={label}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-1.5 sm:hidden">
          <span className="text-[10px] text-white font-medium capitalize">{slotKey}</span>
        </div>
      </div>
    </div>
  )
}

function DayCard({ plan, index, t, onRegenerate, isRegenerating }) {
  return (
    <div
      className="relative flex gap-3 sm:gap-4 animate-slide-up"
      style={{ animationDelay: `${index * 70}ms`, animationFillMode: 'both' }}
    >
      {/* Timeline Stem */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-karnataka-red flex items-center justify-center text-white font-black text-xs shadow-md">
          {plan.day}
        </div>
        <div className="w-0.5 flex-1 bg-gradient-to-b from-karnataka-red/40 via-stone-300 to-transparent my-1.5" />
      </div>

      {/* Day Content Card */}
      <div className="flex-1 card mb-8 border border-stone-200/80 dark:border-stone-800 hover:shadow-md transition-shadow duration-200 p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-karnataka-red dark:text-red-400 mb-0.5 block">
              {t('dayJourney', { day: plan.day })}
            </span>
            <h3 className="text-base sm:text-lg font-black text-karnataka-dark dark:text-white">{plan.title}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="tag bg-karnataka-gold/15 text-amber-700 dark:text-amber-400 border border-karnataka-gold/30">
              <IndianRupee size={11} />
              {plan.estimated_cost}
            </span>

            {/* Regenerate This Day Button */}
            <button
              type="button"
              onClick={() => onRegenerate(plan.day, index)}
              disabled={isRegenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-karnataka-red hover:border-karnataka-red bg-white dark:bg-stone-800 shadow-2xs transition-all disabled:opacity-60"
              title="Rebuild this day with alternative spots"
            >
              <RotateCcw size={12} className={isRegenerating ? "animate-spin text-karnataka-red" : ""} />
              <span>{isRegenerating ? t('regeneratingDayBtn', { day: plan.day }) : t('regenerateDayBtn')}</span>
            </button>
          </div>
        </div>

        {/* 1. Places to Visit (Top Attractions with Open in Google Maps) */}
        {plan.places_to_visit && plan.places_to_visit.length > 0 && (
          <div className="bg-stone-50/80 dark:bg-stone-800/60 rounded-xl p-3.5 border border-stone-200/70 dark:border-stone-700/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-2.5">
              <Compass size={14} className="text-karnataka-red" />
              <span>{t('keyPlacesToVisit')}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {plan.places_to_visit.map((place, pIdx) => {
                const gMapsPlaceUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' Karnataka')}`

                return (
                  <div key={pIdx} className="bg-white p-3 rounded-lg border border-stone-200/80 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h5 className="text-xs font-bold text-stone-900 leading-snug">{place.name}</h5>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                          {place.entry_fee}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-stone-400 mb-1">
                        <Clock size={11} />
                        <span>{t('bestTime')}: {place.best_time}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-normal mb-2">
                        {place.highlight}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex justify-end">
                      <a
                        href={gMapsPlaceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-karnataka-red hover:underline"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 2. Morning / Afternoon / Evening Timeline */}
        <div className="space-y-3">
          <TimeBlock icon={Coffee} label={t('morning')} text={plan.morning} color="bg-amber-500" slotKey="morning" dayIndex={index} />
          <TimeBlock icon={Sun} label={t('afternoon')} text={plan.afternoon} color="bg-orange-500" slotKey="afternoon" dayIndex={index} />
          <TimeBlock icon={Sunset} label={t('evening')} text={plan.evening} color="bg-purple-500" slotKey="evening" dayIndex={index} />
        </div>

        {/* 3. Where to Eat (Food Spots & Iconic Dishes with Open in Google Maps) */}
        {plan.where_to_eat && plan.where_to_eat.length > 0 && (
          <div className="bg-amber-50/40 rounded-xl p-3.5 border border-amber-200/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5">
              <Utensils size={14} className="text-amber-600" />
              <span>{t('whereToEat')}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {plan.where_to_eat.map((food, fIdx) => {
                const gMapsFoodUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(food.name + ' ' + (food.address_or_area || 'Karnataka'))}`

                return (
                  <div key={fIdx} className="bg-white p-3 rounded-lg border border-amber-100 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h5 className="text-xs font-black text-stone-900">{food.name}</h5>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 whitespace-nowrap">
                          {food.meal_type}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-karnataka-red mb-1">
                        🍲 {t('mustOrder')}: {food.dish}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                      <span className="truncate pr-1">📍 {food.address_or_area}</span>
                      <a
                        href={gMapsFoodUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-amber-700 hover:underline whitespace-nowrap text-[10px]"
                      >
                        <span>Maps</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 4. Hotel Details (Where To Stay Tonight with Open in Google Maps) */}
        {plan.stay && (
          <div className="bg-gradient-to-r from-red-50/50 to-amber-50/40 rounded-xl p-3.5 border border-red-100">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-karnataka-red uppercase tracking-wider">
                <Hotel size={14} />
                <span>{t('recommendedStay')}</span>
              </div>
              <span className="text-[11px] font-black text-karnataka-dark bg-white px-2.5 py-0.5 rounded-full border border-red-200 shadow-2xs">
                {plan.stay.approx_price}
              </span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-red-100/70 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <h4 className="text-xs sm:text-sm font-black text-stone-900">{plan.stay.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                  {plan.stay.type}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 flex items-center justify-between gap-1 mb-1.5 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin size={11} className="text-karnataka-red flex-shrink-0" />
                  <span>Location: {plan.stay.area}</span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plan.stay.name + ' ' + (plan.stay.area || 'Karnataka'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-karnataka-red hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={10} />
                </a>
              </div>
              <p className="text-xs text-stone-600 italic leading-relaxed">
                "{plan.stay.why_special}"
              </p>
            </div>
          </div>
        )}

        {/* 5. Insider Tip */}
        <div className="pt-2 border-t border-stone-100 flex items-start gap-2 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/60">
          <Lightbulb size={15} className="text-karnataka-green flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-900 font-medium italic leading-relaxed">
            <strong className="not-italic text-karnataka-green font-bold">{t('insiderTip')}: </strong>
            {plan.tips}
          </p>
        </div>

      </div>
    </div>
  )
}

export default function ItineraryResult({ data, onReset, onOpenPhrasebook, onOpenScanner }) {
  const printRef = useRef()
  const { language, t } = useLanguage()
  const [itineraryList, setItineraryList] = useState(data.itinerary || [])
  const [regeneratingDay, setRegeneratingDay] = useState(null)
  const [isSaved, setIsSaved] = useState(data.id ? isTripSaved(data.id) : false)
  const [savedTripId, setSavedTripId] = useState(data.id || null)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)

  const handlePrint = () => window.print()

  const handleSaveTrip = () => {
    const fullTripData = {
      ...data,
      id: savedTripId || data.id,
      itinerary: itineraryList,
    }
    const saved = saveTrip(fullTripData)
    if (saved) {
      setSavedTripId(saved.id)
      setIsSaved(true)
      toast.success(t('savedTripBtn'))
    }
  }

  const handleShareTrip = async () => {
    let tripToShare = {
      ...data,
      id: savedTripId || data.id,
      itinerary: itineraryList,
    }
    if (!savedTripId) {
      const saved = saveTrip(tripToShare)
      if (saved) {
        setSavedTripId(saved.id)
        setIsSaved(true)
        tripToShare = saved
      }
    }
    const shareUrl = generateShareableUrl(tripToShare)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.days}-Day ${data.starting_point} Trip Itinerary`,
          text: `Check out my Karnataka travel itinerary crafted by Yatra AI:`,
          url: shareUrl,
        })
        return
      } catch {
        // Fallback to copy
      }
    }
    navigator.clipboard?.writeText?.(shareUrl)
    toast.success(t('shareCopied'))
  }

  const handleDownloadIcs = () => {
    downloadIcsCalendar({ ...data, id: savedTripId || data.id, itinerary: itineraryList })
    toast.success(language === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್ (.ics) ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ! 📅' : 'Downloaded .ics calendar file! 📅')
  }

  const googleCalUrl = getGoogleCalendarWebUrl({ ...data, id: savedTripId || data.id, itinerary: itineraryList })

  // Select banner image based on summary text or starting point
  const summaryLower = ((data.summary || '') + ' ' + (data.starting_point || '')).toLowerCase()
  let bannerImg = DESTINATION_BANNER_IMAGES.default
  for (const [key, url] of Object.entries(DESTINATION_BANNER_IMAGES)) {
    if (summaryLower.includes(key)) {
      bannerImg = url
      break
    }
  }

  // Handle single day regeneration
  const handleRegenerateDay = async (dayNumber, planIndex) => {
    setRegeneratingDay(dayNumber)
    try {
      const otherDaysOverview = itineraryList
        .filter((_, idx) => idx !== planIndex)
        .map(p => `Day ${p.day}: ${p.title}`)

      const payload = {
        day: dayNumber,
        starting_point: data.starting_point,
        days: data.days,
        budget: data.budget,
        vibe: data.vibe || 'Relaxed',
        travel_style: data.travel_style || 'mixed',
        interests: data.interests || [],
        travelers: data.travelers || 2,
        travel_month: data.travel_month || 'October',
        language,
        current_day_title: itineraryList[planIndex]?.title,
        other_days_context: otherDaysOverview
      }

      const { data: newDayPlan } = await regenerateDay(payload)
      setItineraryList(prev => {
        const next = [...prev]
        next[planIndex] = newDayPlan
        return next
      })
      toast.success(t('regenerateDaySuccess', { day: dayNumber }))
    } catch (err) {
      console.error(err)
      toast.error('Failed to regenerate day. Please try again.')
    } finally {
      setRegeneratingDay(null)
    }
  }

  return (
    <div className="animate-fade-in" ref={printRef}>
      {/* Responsive Two-Column Grid: 1 col on mobile, 12 cols on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================
            LEFT COLUMN (STICKY SIDEBAR): 4 cols on lg screens
            ======================================================== */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
          
          {/* Trip Summary Quick Card */}
          <div className="card border border-stone-200/90 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 shadow-xs p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-karnataka-red dark:text-red-400 text-xs font-bold uppercase tracking-widest mb-1.5">
              <Sparkles size={13} /> {t('dossierBadge')}
            </div>
            <h2 className="text-xl font-black text-karnataka-dark dark:text-white leading-tight mb-2">
              {data.destination
                ? `${data.starting_point} ➔ ${data.destination} (${data.days} ${language === 'kn' ? 'ದಿನಗಳು' : 'Days'})`
                : `${data.days}-${language === 'kn' ? 'ದಿನದ' : 'Day'} ${data.vibe ? data.vibe : (data.travel_style || t('customJourney'))}`}
            </h2>
            
            <div className="space-y-2 py-3 border-y border-stone-100 dark:border-stone-800 my-3 text-xs">
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
                  <MapPin size={13} className="text-emerald-500" /> {t('startingHub')}
                </span>
                <span className="font-bold text-stone-800 dark:text-stone-100">{data.starting_point}</span>
              </div>
              {data.destination && (
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300 bg-red-50/70 dark:bg-red-950/30 p-2 rounded-xl border border-red-200/50">
                  <span className="flex items-center gap-1.5 text-karnataka-red font-bold">
                    <MapPin size={13} className="text-karnataka-red" /> {language === 'kn' ? 'ಗಮ್ಯಸ್ಥಾನ' : 'Destination'}
                  </span>
                  <span className="font-black text-karnataka-red dark:text-red-300">{data.destination}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
                  <Calendar size={13} className="text-karnataka-green" /> {t('totalDays')}
                </span>
                <span className="font-bold text-stone-800 dark:text-stone-100">
                  {data.days} {language === 'kn' ? 'ದಿನಗಳು' : 'Days'} / {Math.max(1, data.days - 1)} {language === 'kn' ? 'ರಾತ್ರಿಗಳು' : 'Nights'}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
                  <Users size={13} className="text-karnataka-red" /> {t('travelersLabel')}
                </span>
                <span className="font-bold text-stone-800 dark:text-stone-100">
                  {data.travelers || 2} {language === 'kn' ? 'ಪ್ರಯಾಣಿಕರು' : 'Travelers'}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
                  <Calendar size={13} className="text-amber-600" /> {t('travelMonthLabel')}
                </span>
                <span className="font-bold text-stone-800 dark:text-stone-100">
                  {data.travel_month || 'October'}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
                  <IndianRupee size={13} className="text-karnataka-gold" /> {t('budgetTier')}
                </span>
                <span className="font-bold text-stone-800 dark:text-stone-100 capitalize">{data.budget}</span>
              </div>
              {data.preset && (
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
                    <Sparkles size={13} className="text-karnataka-red" /> {t('presetLabel')}
                  </span>
                  <span className="font-bold text-stone-800 dark:text-stone-100 capitalize">
                    {data.preset === 'bikers' ? '🏍️ Biker Ride' :
                     data.preset === 'solo' ? '🎒 Solo Explorer' :
                     data.preset === 'students' ? '🎓 Students & Youth' :
                     data.preset === 'pilgrimage' ? '🛕 Pilgrimage' :
                     data.preset === 'eco-friendly' ? '🌿 Eco-Friendly' :
                     '👨‍👩‍👧‍👦 Family'}
                  </span>
                </div>
              )}
            </div>

            {/* Eco Filter Active Badge */}
            {(data.eco_filter || data.preset === 'eco-friendly') && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 mb-3">
                <Leaf size={14} className="text-karnataka-green flex-shrink-0" />
                <span className="font-bold">
                  {language === 'kn' ? 'ಪರಿಸರಸ್ನೇಹಿ ಪ್ರವಾಸ: KSRTC ಮತ್ತು ಹಸಿರು ಹೋಂಸ್ಟೇ' : 'Eco-Conscious Trip: KSRTC & Eco-Homestays'}
                </span>
              </div>
            )}

            {/* Interest Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {data.interests?.map(item => (
                <span
                  key={item}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold text-[11px] border border-stone-200/70 dark:border-stone-700"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {/* 1. Save Trip Button */}
              <button
                type="button"
                onClick={handleSaveTrip}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isSaved
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-karnataka-red hover:bg-red-700 text-white'
                }`}
              >
                {isSaved ? <Check size={14} /> : <Bookmark size={14} />}
                <span>{isSaved ? t('savedTripBtn') : t('saveTripBtn')}</span>
              </button>

              {/* 2. Share Trip Button */}
              <button
                type="button"
                onClick={handleShareTrip}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-xs font-bold text-stone-700 dark:text-stone-200 transition-colors shadow-2xs"
              >
                <Share2 size={13} className="text-karnataka-red" />
                <span>{t('shareTripBtn')}</span>
              </button>

              {/* 3. Group Expenses & Bill Splitter Button */}
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-amber-200/90 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 text-xs font-bold text-amber-900 dark:text-amber-200 transition-colors shadow-2xs"
              >
                <Receipt size={13} className="text-amber-700 dark:text-amber-400" />
                <span>{t('expenseTrackerBtn')}</span>
              </button>

              {/* 4. Calendar Export Actions */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-[11px] font-bold text-stone-700 dark:text-stone-200 transition-colors shadow-2xs"
                  title="Add to Google Calendar"
                >
                  <Calendar size={12} className="text-blue-600 dark:text-blue-400" />
                  <span>Google Cal</span>
                  <ExternalLink size={10} className="text-stone-400" />
                </a>

                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-[11px] font-bold text-stone-700 dark:text-stone-200 transition-colors shadow-2xs"
                  title="Download .ICS file for Apple/Outlook/Google"
                >
                  <Download size={12} className="text-stone-600 dark:text-stone-300" />
                  <span>.ICS File</span>
                </button>
              </div>

              {/* 5. PDF Export / Print Dossier */}
              <button
                type="button"
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 text-xs py-2 px-4 rounded-xl border border-stone-300 dark:border-stone-700 font-semibold text-stone-700 dark:text-stone-200 hover:border-stone-400 bg-stone-100/80 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all"
              >
                <Download size={13} /> {t('printBtn')}
              </button>

              {/* 6. Plan Another Trip */}
              <button
                type="button"
                onClick={onReset}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-all"
              >
                <ArrowLeft size={13} /> {t('planAnotherBtn')}
              </button>
            </div>
          </div>

          {/* Phase 3: Interactive Leaflet Map with OpenStreetMap */}
          <DayMapViewer startingPoint={data.starting_point} itinerary={itineraryList} />

          {/* Detailed Cost Breakdown & Budget Estimator Card */}
          <CostBreakdownCard
            costBreakdown={data.cost_breakdown}
            travelers={data.travelers || 2}
            days={data.days}
            initialTier={data.budget || 'mid'}
          />

          {/* Phase 3: Transport & Logistics (KSRTC, IRCTC, Self-Drive, Cabs) */}
          <TransportLogisticsCard startingPoint={data.starting_point} />

        </aside>


        {/* ========================================================
            RIGHT COLUMN (MAIN SCROLL AREA): 8 cols on lg screens
            ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hero Banner Header with High-Fidelity Karnataka Destination Visual */}
          <div
            className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-800/20 text-white min-h-[240px] flex flex-col justify-end bg-stone-900 bg-cover bg-center"
            style={{
              backgroundImage: `url('${bannerImg}')`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/75 to-stone-900/30" />

            <div className="relative z-10 p-6 sm:p-8">
              <div className="inline-flex items-center gap-1.5 bg-karnataka-gold/25 backdrop-blur-md border border-karnataka-gold/40 text-karnataka-gold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5">
                <Star size={12} fill="currentColor" /> {t('verifiedBadge')}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 drop-shadow-md">
                {t('circuitTitle', { hub: data.starting_point })}
              </h1>
              <p className="text-stone-200 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal drop-shadow-sm">
                {data.summary}
              </p>
            </div>
          </div>

          {/* Season & Live Weather Forecast Card with Hazard Warnings */}
          <SeasonalWeatherCard
            seasonInfo={data.season_info}
            travelMonth={data.travel_month || 'October'}
            destination={data.starting_point || 'Karnataka'}
          />

          {/* Karnataka Cultural Festivals & Events Calendar */}
          <FestivalEventsCard
            travelMonth={data.travel_month || 'October'}
            destination={data.starting_point || 'Karnataka'}
          />

          {/* Best Time to Visit Callout */}
          <div className="card border-l-4 border-l-karnataka-gold border-stone-200/80 bg-white p-4 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar size={15} className="text-amber-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                {t('bestTimeToVisit')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
              {data.best_time_to_visit}
            </p>
          </div>

          {/* Phase 2: Interactive Packing Checklist Card */}
          <PackingChecklistCard packingAdvice={data.packing_tips} />

          {/* Interactive Day-by-Day Itinerary Timeline with "Regenerate this day" */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-karnataka-dark flex items-center gap-2">
                <MapPin size={18} className="text-karnataka-red" />
                {t('dailyTimeline')}
              </h3>
              <span className="text-xs text-stone-400 font-semibold">
                {t('scheduledDays', { count: itineraryList.length })}
              </span>
            </div>

            <div className="space-y-1">
              {itineraryList.map((plan, i) => (
                <DayCard
                  key={plan.day || i}
                  plan={plan}
                  index={i}
                  t={t}
                  onRegenerate={handleRegenerateDay}
                  isRegenerating={regeneratingDay === plan.day}
                />
              ))}
            </div>
          </div>

          {/* Local Food Trail Section */}
          <LocalFoodTrail
            aiFoodTrail={data.local_food_trail || []}
            startingPoint={data.starting_point}
          />

          {/* Local Kannada Companion (Phrasebook & Cultural Customs) */}
          <KannadaCompanion
            onOpenFullPhrasebook={onOpenPhrasebook}
            onOpenScanner={onOpenScanner}
          />

        </div>

      </div>

      {/* Group Expenses Tracker & Splitter Modal */}
      <ExpenseTrackerModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        tripTitle={`${data.days}-Day ${data.starting_point} Trip`}
      />
    </div>
  )
}

