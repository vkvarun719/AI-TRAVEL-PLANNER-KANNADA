import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  MapPin, Clock, Wallet, Compass, Loader2, Sparkles,
  Mountain, TreePine, Landmark, Bike, Camera, Utensils, Waves, Mic,
  Users, Calendar, Heart, Shield, Gem, Tent
} from 'lucide-react'
import { generateItinerary } from '../api/client'
import { useLanguage } from '../context/LanguageContext'
import VoiceInputModal from './VoiceInputModal'

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

const STARTING_POINTS_DATA = [
  { value: 'Bangalore', en: 'Bangalore (Bengaluru)', kn: 'ಬೆಂಗಳೂರು' },
  { value: 'Mysore', en: 'Mysore (Mysuru)', kn: 'ಮೈಸೂರು' },
  { value: 'Mangalore', en: 'Mangalore (Mangaluru)', kn: 'ಮಂಗಳೂರು' },
  { value: 'Hampi', en: 'Hampi (Hosapete)', kn: 'ಹಂಪಿ (ಹೊಸಪೇಟೆ)' },
  { value: 'Coorg', en: 'Coorg (Madikeri)', kn: 'ಕೂರ್ಗ್ (ಮಡಿಕೇರಿ)' },
  { value: 'Chikmagalur', en: 'Chikmagalur', kn: 'ಚಿಕ್ಕಮಗಳೂರು' },
  { value: 'Gokarna', en: 'Gokarna', kn: 'ಗೋಕರ್ಣ' },
  { value: 'Udupi', en: 'Udupi', kn: 'ಉಡುಪಿ' },
  { value: 'Badami', en: 'Badami', kn: 'ಬಾದಾಮಿ' },
  { value: 'Dandeli', en: 'Dandeli', kn: 'ದಾಂಡೇಲಿ' },
  { value: 'Hubli', en: 'Hubli - Dharwad', kn: 'ಹುಬ್ಬಳ್ಳಿ - ಧಾರವಾಡ' },
  { value: 'Belgaum', en: 'Belgaum (Belagavi)', kn: 'ಬೆಳಗಾವಿ' },
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
  const [form, setForm] = useState({
    starting_point: 'Bangalore',
    days: 3,
    budget: 'mid-range',
    vibe: 'Relaxed',
    travelers: 2,
    travel_month: 'October',
    interests: ['Heritage', 'Food'],
    travel_style: 'mixed',
  })
  const [loading, setLoading] = useState(false)
  const [isVoiceOpen, setIsVoiceOpen] = useState(false)

  // Apply prefill if passed
  useEffect(() => {
    if (prefillDestination) {
      setForm(prev => ({
        ...prev,
        starting_point: prefillDestination
      }))
    }
  }, [prefillDestination])

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
      ...(voiceData.days && { days: voiceData.days }),
      ...(voiceData.budget && { budget: voiceData.budget }),
      ...(voiceData.travel_style && { travel_style: voiceData.travel_style }),
      ...(voiceData.vibe && { vibe: voiceData.vibe }),
      ...(voiceData.interests && voiceData.interests.length > 0 && { interests: voiceData.interests }),
    }))
    toast.success(language === 'kn' ? 'ಧ್ವನಿ ವಿವರಗಳನ್ನು ಫಾರ್ಮ್‌ಗೆ ಅಳವಡಿಸಲಾಗಿದೆ! 🎙️' : 'Voice request applied to form! 🎙️')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border border-red-200/70 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-karnataka-red text-white flex items-center justify-center shadow-xs">
              <Mic size={16} />
            </div>
            <div>
              <div className="text-xs font-black text-stone-900">{t('voiceInputBtn')}</div>
              <div className="text-[11px] text-stone-500 font-medium">{t('voiceInputSubtitle')}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsVoiceOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs font-bold text-karnataka-red hover:border-karnataka-red hover:bg-stone-50 transition-all shadow-2xs"
          >
            <Mic size={13} />
            <span>{language === 'kn' ? 'ಮಾತನಾಡಿ' : 'Speak'}</span>
          </button>
        </div>

        {/* 1. Starting Point & Travel Month Row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              <MapPin size={14} className="text-karnataka-red" /> {t('startingPoint')}
            </label>
            <select
              value={form.starting_point}
              onChange={e => setForm(f => ({ ...f, starting_point: e.target.value }))}
              className="input-field text-sm font-semibold"
            >
              {STARTING_POINTS_DATA.map(p => (
                <option key={p.value} value={p.value}>
                  {language === 'kn' ? `${p.kn} (${p.value})` : p.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
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
        </div>

        {/* 2. Duration & Number of Travelers Row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
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
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
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
                      ? 'border-karnataka-green bg-emerald-500/10 text-emerald-900 shadow-2xs ring-1 ring-karnataka-green'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <div className="truncate">{item.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Vibe / Style Selector (Relaxed, Adventure, Spiritual, Family, Budget, Luxury, Cultural) */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
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
                      : 'border-stone-200 bg-white text-stone-700 hover:border-karnataka-red/40'
                  }`}
                >
                  <Icon size={13} className={active ? 'text-white' : color} />
                  <span>{t(key)}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 4. Budget Category */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
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
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="text-xs font-extrabold text-stone-900">{t(b.key)}</div>
                <div className="text-[10px] text-stone-500 mt-1 font-mono">
                  {language === 'kn' ? b.subKn : b.subEn}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Interests */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
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
                      : 'border-stone-200 bg-white text-stone-700 hover:border-karnataka-green/50'
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
              <span>{t('generateBtn')}</span>
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
