import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  MapPin, Clock, Wallet, Compass, Loader2, Sparkles,
  Mountain, TreePine, Landmark, Bike, Camera, Utensils, Waves, Mic,
  Users, Calendar, Heart, Shield, Gem, Tent, Leaf, ArrowRightLeft,
  Navigation, Car, Bus, Info, CheckCircle2, ChevronRight
} from 'lucide-react'
import { generateItinerary } from '../api/client'
import { useLanguage } from '../context/LanguageContext'
import VoiceInputModal from './VoiceInputModal'
import KarnatakaLocationSelect from './KarnatakaLocationSelect'
import { getRouteIntelligence } from '../utils/routeIntelligence'
import {
  POPULAR_ORIGINS,
  POPULAR_VACATION_DESTINATIONS,
  resolveLocation
} from '../data/karnatakaLocations'

const PRESET_CONFIGS = [
  {
    id: 'family',
    titleKey: 'presetFamily',
    descKey: 'presetFamilyDesc',
    emoji: '👨‍👩‍👧‍👦',
    defaults: { travelers: 4, vibe: 'Family', budget: 'mid-range', eco_filter: false, interests: ['Heritage', 'Food'] }
  },
  {
    id: 'solo',
    titleKey: 'presetSolo',
    descKey: 'presetSoloDesc',
    emoji: '🎒',
    defaults: { travelers: 1, vibe: 'Relaxed', budget: 'mid-range', eco_filter: false, interests: ['Heritage', 'Photography'] }
  },
  {
    id: 'bikers',
    titleKey: 'presetBikers',
    descKey: 'presetBikersDesc',
    emoji: '🏍️',
    defaults: { travelers: 2, vibe: 'Adventure', budget: 'mid-range', eco_filter: false, interests: ['Motorcycle', 'Western Ghats'] }
  },
  {
    id: 'students',
    titleKey: 'presetStudents',
    descKey: 'presetStudentsDesc',
    emoji: '🎓',
    defaults: { travelers: 4, vibe: 'Budget', budget: 'budget', eco_filter: false, interests: ['Adventure', 'Beaches'] }
  },
  {
    id: 'pilgrimage',
    titleKey: 'presetPilgrimage',
    descKey: 'presetPilgrimageDesc',
    emoji: '🛕',
    defaults: { travelers: 2, vibe: 'Spiritual', budget: 'mid-range', eco_filter: false, interests: ['Heritage'] }
  },
  {
    id: 'eco-friendly',
    titleKey: 'presetEcoFriendly',
    descKey: 'presetEcoFriendlyDesc',
    emoji: '🌿',
    defaults: { vibe: 'Relaxed', budget: 'mid-range', eco_filter: true, interests: ['Western Ghats', 'Wildlife'] }
  },
]

const INTEREST_CONFIGS = [
  { key: 'Heritage', translationKey: 'interestHeritage', icon: Landmark },
  { key: 'Wildlife', translationKey: 'interestWildlife', icon: TreePine },
  { key: 'Motorcycle', translationKey: 'interestMotorcycle', icon: Bike },
  { key: 'Western Ghats', translationKey: 'interestWesternGhats', icon: Mountain },
  { key: 'Beaches', translationKey: 'interestBeaches', icon: Waves },
  { key: 'Food', translationKey: 'interestFood', icon: Utensils },
  { key: 'Photography', translationKey: 'interestPhotography', icon: Camera },
  { key: 'Adventure', translationKey: 'interestAdventure', icon: Compass },
]

const BUDGET_CONFIGS = [
  { value: 'budget', key: 'budgetBackpacker', subEn: '₹1,500–₹2,500/day', subKn: '₹೧,೫೦೦–₹೨,೫೦೦/ದಿನ' },
  { value: 'mid-range', key: 'budgetMidRange', subEn: '₹3,500–₹6,000/day', subKn: '₹೩,೫೦೦–₹೬,೦೦೦/ದಿನ' },
  { value: 'luxury', key: 'budgetLuxury', subEn: '₹8,000–₹25,000/day', subKn: '₹೮,೦೦೦–₹೨೫,೦೦೦/ದಿನ' },
]

const VIBE_CONFIGS = [
  { value: 'Relaxed', key: 'vibeRelaxed', icon: Heart, color: 'text-amber-500' },
  { value: 'Adventure', key: 'vibeAdventure', icon: Mountain, color: 'text-emerald-500' },
  { value: 'Spiritual', key: 'vibeSpiritual', icon: Sparkles, color: 'text-purple-500' },
  { value: 'Family', key: 'vibeFamily', icon: Users, color: 'text-blue-500' },
  { value: 'Budget', key: 'vibeBudget', icon: Wallet, color: 'text-emerald-600' },
  { value: 'Luxury', key: 'vibeLuxury', icon: Gem, color: 'text-amber-600' },
  { value: 'Cultural', key: 'vibeCultural', icon: Landmark, color: 'text-red-500' },
]

const MONTHS_DATA = [
  { value: 'January', key: 'monthJan', season: 'winter' },
  { value: 'February', key: 'monthFeb', season: 'winter' },
  { value: 'March', key: 'monthMar', season: 'summer' },
  { value: 'April', key: 'monthApr', season: 'summer' },
  { value: 'May', key: 'monthMay', season: 'summer' },
  { value: 'June', key: 'monthJun', season: 'monsoon' },
  { value: 'July', key: 'monthJul', season: 'monsoon' },
  { value: 'August', key: 'monthAug', season: 'monsoon' },
  { value: 'September', key: 'monthSep', season: 'monsoon' },
  { value: 'October', key: 'monthOct', season: 'winter' },
  { value: 'November', key: 'monthNov', season: 'winter' },
  { value: 'December', key: 'monthDec', season: 'winter' },
]

export default function ItineraryForm({ onResult, onStartLoading, onError, prefillDestination = null }) {
  const { language, t } = useLanguage()
  const isKn = language === 'kn'

  const [form, setForm] = useState({
    starting_point: 'Bangalore',
    destination: 'Coorg',
    days: 3,
    budget: 'mid-range',
    vibe: 'Relaxed',
    preset: 'family',
    eco_filter: false,
    travelers: 2,
    travel_month: 'October',
    interests: ['Heritage', 'Food'],
    travel_style: 'mixed',
  })
  const [loading, setLoading] = useState(false)
  const [isVoiceOpen, setIsVoiceOpen] = useState(false)

  // Apply prefill if passed from outer components
  useEffect(() => {
    if (prefillDestination) {
      setForm(prev => ({
        ...prev,
        destination: prefillDestination
      }))
    }
  }, [prefillDestination])

  // Live route intelligence computation
  const routeIntel = getRouteIntelligence(form.starting_point, form.destination)

  const handleSwapRoute = () => {
    setForm(prev => ({
      ...prev,
      starting_point: prev.destination || 'Bangalore',
      destination: prev.starting_point || 'Coorg'
    }))
    toast.success(isKn ? 'ಪ್ರಾರಂಭ ಮತ್ತು ಗಮ್ಯಸ್ಥಾನ ಬದಲಾಯಿಸಲಾಗಿದೆ! 🔄' : 'Swapped Departure and Destination! 🔄')
  }

  const handleSelectPreset = (preset) => {
    setForm(prev => ({
      ...prev,
      preset: preset.id,
      ...(preset.defaults || {})
    }))
    toast.success(isKn ? `${t(preset.titleKey)} ಪ್ರಿಸೆಟ್ ಆಯ್ಕೆಯಾಗಿದೆ!` : `${t(preset.titleKey)} preset applied!`)
  }

  const toggleInterest = (val) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(val)
        ? f.interests.filter(i => i !== val)
        : [...f.interests, val],
    }))
  }

  const handleApplyVoiceTrip = (voiceData) => {
    setForm(prev => ({
      ...prev,
      ...(voiceData.starting_point && { starting_point: voiceData.starting_point }),
      ...(voiceData.destination && { destination: voiceData.destination }),
      ...(voiceData.days && { days: voiceData.days }),
      ...(voiceData.budget && { budget: voiceData.budget }),
      ...(voiceData.travel_style && { travel_style: voiceData.travel_style }),
      ...(voiceData.vibe && { vibe: voiceData.vibe }),
      ...(voiceData.interests && voiceData.interests.length > 0 && { interests: voiceData.interests }),
    }))
    toast.success(isKn ? 'ಧ್ವನಿ ವಿವರಗಳನ್ನು ಫಾರ್ಮ್‌ಗೆ ಅಳವಡಿಸಲಾಗಿದೆ! 🎙️' : 'Voice request applied to form! 🎙️')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.starting_point?.trim()) {
      toast.error(isKn ? 'ದಯವಿಟ್ಟು ಪ್ರಾರಂಭ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Please select a departure starting point')
      return
    }
    if (!form.destination?.trim()) {
      toast.error(isKn ? 'ದಯವಿಟ್ಟು ಗಮ್ಯಸ್ಥಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Please select a destination in Karnataka')
      return
    }
    if (form.interests.length === 0) {
      toast.error(t('toastErrorInterest'))
      return
    }

    setLoading(true)
    onStartLoading?.(form)
    try {
      const payload = {
        ...form,
        language
      }
      const { data } = await generateItinerary(payload)
      onResult(data)
      toast.success(t('toastSuccess'))
    } catch (err) {
      const msg = err.response?.data?.detail || 'Generation failed. Please try again or select a sample itinerary.'
      onError?.(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Voice Input Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 dark:from-red-950/30 dark:via-amber-950/20 dark:to-orange-950/30 border border-red-200/70 dark:border-red-900/50 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-karnataka-red text-white flex items-center justify-center shadow-xs">
              <Mic size={16} />
            </div>
            <div>
              <div className="text-xs font-black text-stone-900 dark:text-white">{t('voiceInputBtn')}</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">{t('voiceInputSubtitle')}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsVoiceOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-bold text-karnataka-red hover:border-karnataka-red hover:bg-stone-50 transition-all shadow-2xs"
          >
            <Mic size={13} />
            <span>{isKn ? 'ಮಾತನಾಡಿ' : 'Speak'}</span>
          </button>
        </div>

        {/* Trip Style Presets (solo, family, bikers, students, pilgrimage, eco-friendly) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              <Sparkles size={14} className="text-karnataka-red" /> {t('presetLabel')}
            </label>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              {isKn ? 'ತ್ವರಿತ ಶೈಲಿ' : 'Quick Presets'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PRESET_CONFIGS.map(preset => {
              const isActive = form.preset === preset.id
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    isActive
                      ? 'border-karnataka-red bg-red-50/50 dark:bg-red-950/40 shadow-xs ring-2 ring-karnataka-red/25'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xl">{preset.emoji}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-karnataka-red animate-pulse" />
                    )}
                  </div>
                  <div>
                    <div className={`text-xs font-black leading-tight ${isActive ? 'text-karnataka-red' : 'text-stone-900 dark:text-white'}`}>
                      {t(preset.titleKey)}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5 font-normal">
                      {t(preset.descKey)}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Eco-Friendly Filter Toggle */}
        <div className={`p-3.5 rounded-2xl border transition-all duration-200 ${
          form.eco_filter
            ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 shadow-2xs ring-2 ring-emerald-500/20'
            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-emerald-200'
        }`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                form.eco_filter ? 'bg-karnataka-green text-white shadow-xs' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
              }`}>
                <Leaf size={16} />
              </div>
              <div>
                <div className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <span>{t('ecoFilterTitle')}</span>
                  {form.eco_filter && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold tracking-wider uppercase">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium leading-tight">
                  {t('ecoFilterSubtitle')}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, eco_filter: !f.eco_filter }))}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                form.eco_filter ? 'bg-karnataka-green' : 'bg-stone-200 dark:bg-stone-700'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                form.eco_filter ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* 1. Journey Route: Starting Point (From) ➔ Destination (To) anywhere in Karnataka */}
        <div className="bg-stone-50/90 dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800 p-4 sm:p-5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-karnataka-dark dark:text-white">
                <Navigation size={15} className="text-karnataka-red animate-pulse" />
                <span>{isKn ? 'ಪ್ರವಾಸ ಮಾರ್ಗ ಆಯ್ಕೆ (From ➔ To)' : 'Select Journey Route in Karnataka (From ➔ To)'}</span>
              </label>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                {isKn
                  ? 'ಕರ್ನಾಟಕದ ಯಾವುದೇ ಊರು ಅಥವಾ ಜಿಲ್ಲೆಯಿಂದ ಎಲ್ಲಿಗೆ ಬೇಕಾದರೂ ಪ್ರಯಾಣಿಸಿ'
                  : 'Choose or type any origin & destination across Karnataka (31 districts & beyond)'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSwapRoute}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-karnataka-red hover:border-karnataka-red/40 transition-all shadow-2xs active:scale-95 group"
              title="Swap Departure and Destination"
            >
              <ArrowRightLeft size={13} className="text-karnataka-red group-hover:rotate-180 transition-transform duration-300" />
              <span>{isKn ? 'ದಿಕ್ಕು ಬದಲಾಯಿಸಿ' : 'Swap Route'}</span>
            </button>
          </div>

          {/* Dual Location Selectors */}
          <div className="grid sm:grid-cols-2 gap-3.5 relative">
            {/* From (Starting Point anywhere in Karnataka) */}
            <KarnatakaLocationSelect
              label={isKn ? 'ಪ್ರಾರಂಭ (From / Departure Point)' : 'From (Departure City / Town)'}
              sublabel={isKn ? 'ಕರ್ನಾಟಕದ ಯಾವುದೇ ಸ್ಥಳ' : 'Anywhere in Karnataka'}
              value={form.starting_point}
              onChange={val => setForm(f => ({ ...f, starting_point: val }))}
              placeholder={isKn ? 'ಪ್ರಾರಂಭ ಸ್ಥಳ ಆರಿಸಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ...' : 'Search or type departure location...'}
              dotColor="bg-emerald-500"
              icon={Navigation}
              popularPills={POPULAR_ORIGINS}
              language={language}
              excludeValue={form.destination}
            />

            {/* To (Destination anywhere in Karnataka) */}
            <KarnatakaLocationSelect
              label={isKn ? 'ಗಮ್ಯಸ್ಥಾನ (To / Target Destination)' : 'To (Target Destination / Circuit)'}
              sublabel={isKn ? '೩೧ ಜಿಲ್ಲೆಗಳು & ಪ್ರವಾಸಿ ತಾಣಗಳು' : 'All 31 Districts & 55+ Circuits'}
              value={form.destination}
              onChange={val => setForm(f => ({ ...f, destination: val }))}
              placeholder={isKn ? 'ಗಮ್ಯಸ್ಥಾನ ಆರಿಸಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ...' : 'Search or type destination in Karnataka...'}
              dotColor="bg-karnataka-red"
              icon={MapPin}
              popularPills={POPULAR_VACATION_DESTINATIONS}
              language={language}
              excludeValue={form.starting_point}
            />
          </div>

          {/* Quick-Pick Popular Vacation Destinations */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                {isKn ? 'ಜನಪ್ರಿಯ ತಾಣಗಳು (ಒತ್ತಿ ಆಯ್ಕೆಮಾಡಿ):' : 'Popular circuits (click to select):'}
              </span>
              <span className="text-[10px] text-stone-400">
                {isKn ? 'ಒಟ್ಟು ೩೧ ಜಿಲ್ಲೆಗಳು ಲಭ್ಯ' : '31 Districts available'}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {POPULAR_VACATION_DESTINATIONS.slice(0, 10).map(d => {
                const isSelected = form.destination?.toLowerCase() === d.value.toLowerCase()
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, destination: d.value }))}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-karnataka-red text-white shadow-xs scale-105'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {isKn ? d.kn : d.value}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Instant Route & Travel Intelligence Card */}
          {routeIntel && (
            <div className="bg-white dark:bg-stone-800/90 rounded-2xl p-3.5 border border-amber-500/30 shadow-xs space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-100 dark:border-stone-700 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Car size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-stone-900 dark:text-white">
                      {routeIntel.from} ➔ {routeIntel.to}
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 ml-2">
                      {t('routeDetailsTitle')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-black border border-emerald-500/20">
                    🛣️ {routeIntel.distanceKm} km
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[11px] font-black border border-blue-500/20">
                    ⏱️ ~{routeIntel.driveTime}
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-stone-50 dark:bg-stone-900/60 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                  <div className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-1">
                    <Navigation size={12} className="text-karnataka-red shrink-0" />
                    <span>{t('highwayCorridor')}:</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 leading-snug">
                    {isKn && routeIntel.highwayKn ? routeIntel.highwayKn : routeIntel.highway}
                  </p>
                </div>

                <div className="bg-stone-50 dark:bg-stone-900/60 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                  <div className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-1">
                    <Bus size={12} className="text-emerald-600 shrink-0" />
                    <span>{t('transitMode')}:</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 leading-snug">
                    {isKn && routeIntel.bestTransitKn ? routeIntel.bestTransitKn : routeIntel.bestTransit}
                  </p>
                </div>
              </div>

              {(routeIntel.transitTip || routeIntel.roadStatus) && (
                <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/30 p-2 rounded-xl border border-amber-200/60 dark:border-amber-900/50 flex items-start gap-1.5">
                  <Info size={13} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    {isKn && routeIntel.transitTipKn ? routeIntel.transitTipKn : routeIntel.transitTip}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Travel Month Row */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
            <Calendar size={14} className="text-karnataka-red" /> {t('travelMonthLabel')}
          </label>
          <select
            value={form.travel_month}
            onChange={e => setForm(f => ({ ...f, travel_month: e.target.value }))}
            className="input-field text-sm font-semibold"
          >
            {MONTHS_DATA.map(m => (
              <option key={m.value} value={m.value}>
                {t(m.key)} ({m.season === 'monsoon' ? '🌧️ Monsoon' : m.season === 'winter' ? '❄️ Winter' : '☀️ Summer'})
              </option>
            ))}
          </select>
        </div>

        {/* 3. Duration & Number of Travelers Row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                <Clock size={14} className="text-karnataka-red" /> {t('duration')}
              </label>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-red-100/80 text-karnataka-red border border-red-200">
                {form.days === 1
                  ? t('daysCount', { count: form.days })
                  : t('daysCountPlural', { count: form.days })}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={14}
              value={form.days}
              onChange={e => setForm(f => ({ ...f, days: +e.target.value }))}
              className="w-full h-2.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-karnataka-red"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-semibold mt-1">
              <span>{t('dayOne')}</span>
              <span>{t('daySeven')}</span>
              <span>{t('dayFourteen')}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                <Users size={14} className="text-karnataka-red" /> {t('travelersLabel')}
              </label>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-karnataka-green border border-emerald-200">
                {form.travelers === 1
                  ? t('travelersCount', { count: form.travelers })
                  : t('travelersCountPlural', { count: form.travelers })}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { count: 1, label: t('travelerSolo') },
                { count: 2, label: t('travelerCouple') },
                { count: 4, label: t('travelerFamily') },
                { count: 6, label: t('travelerGroup') },
              ].map(item => (
                <button
                  key={item.count}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, travelers: item.count }))}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all border ${
                    form.travelers === item.count
                      ? 'border-karnataka-green bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 shadow-2xs ring-1 ring-karnataka-green'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  <div className="truncate">{item.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Vibe / Style Selector (Relaxed, Adventure, Spiritual, Family, Budget, Luxury, Cultural) */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2.5">
            <Sparkles size={14} className="text-karnataka-red" /> {t('vibeLabel')}
          </label>
          <div className="flex flex-wrap gap-2">
            {VIBE_CONFIGS.map(({ value, key, icon: Icon, color }) => {
              const active = form.vibe === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, vibe: value, travel_style: value.toLowerCase() }))}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                    active
                      ? 'border-karnataka-red bg-karnataka-red text-white shadow-xs'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-karnataka-red/40'
                  }`}
                >
                  <Icon size={13} className={active ? 'text-white' : color} />
                  <span>{t(key)}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 5. Budget Category */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2.5">
            <Wallet size={14} className="text-karnataka-red" /> {t('budgetCategory')}
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {BUDGET_CONFIGS.map(b => (
              <button
                key={b.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, budget: b.value }))}
                className={`rounded-2xl border-2 p-3 text-center transition-all duration-200 ${
                  form.budget === b.value
                    ? 'border-karnataka-gold bg-amber-500/10 shadow-md ring-2 ring-karnataka-gold/20'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 bg-white dark:bg-stone-800'
                }`}
              >
                <div className="text-xs font-extrabold text-stone-900 dark:text-white">{t(b.key)}</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 font-mono">
                  {isKn ? b.subKn : b.subEn}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 6. Interests */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2.5">
            <Sparkles size={14} className="text-karnataka-red" /> {t('interestsLabel')}
            <span className="text-[10px] text-stone-400 font-normal lowercase">{t('interestsHelp')}</span>
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {INTEREST_CONFIGS.map(({ key, translationKey, icon: Icon }) => {
              const active = form.interests.includes(key)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleInterest(key)}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-xs font-semibold transition-all duration-200 text-left ${
                    active
                      ? 'border-karnataka-green bg-karnataka-green text-white shadow-md'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-karnataka-green/50'
                  }`}
                >
                  <Icon size={14} className="flex-shrink-0" />
                  <span className="truncate">{t(translationKey)}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm sm:text-base py-4 font-black shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 size={19} className="animate-spin" />
              <span>{t('generatingBtn')}</span>
            </>
          ) : (
            <>
              <Sparkles size={19} />
              <span>
                {isKn
                  ? `${form.starting_point} ➔ ${form.destination} (${form.days} ದಿನದ ಪ್ರವಾಸ ರಚಿಸಿ)`
                  : `Generate ${form.days}-Day Itinerary (${form.starting_point} ➔ ${form.destination})`}
              </span>
            </>
          )}
        </button>
      </form>

      {/* Voice Input Modal */}
      <VoiceInputModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onApplyTrip={handleApplyVoiceTrip}
      />
    </>
  )
}
