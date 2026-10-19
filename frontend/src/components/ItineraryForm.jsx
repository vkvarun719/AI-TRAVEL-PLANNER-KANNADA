import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  MapPin, Clock, Wallet, Compass, Loader2, Sparkles,
  Mountain, TreePine, Landmark, Bike, Camera, Utensils, Waves
} from 'lucide-react'
import { generateItinerary } from '../api/client'

const INTERESTS = [
  { label: 'Heritage & History',  icon: Landmark,  value: 'Heritage'    },
  { label: 'Wildlife & Nature',   icon: TreePine,   value: 'Wildlife'    },
  { label: 'Motorcycle Trails',   icon: Bike,       value: 'Motorcycle'  },
  { label: 'Western Ghats',       icon: Mountain,   value: 'Western Ghats'},
  { label: 'Beaches & Coast',     icon: Waves,      value: 'Beaches'     },
  { label: 'Food & Culinary',     icon: Utensils,   value: 'Food'        },
  { label: 'Photography',         icon: Camera,     value: 'Photography' },
  { label: 'Adventure Sports',    icon: Compass,    value: 'Adventure'   },
]

const STARTING_POINTS = [
  'Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Dharwad',
  'Belgaum', 'Gulbarga', 'Hampi', 'Coorg', 'Chikmagalur',
]

const BUDGETS = [
  { value: 'budget',    label: '💰 Budget',    sub: '₹1,500–₹2,500/day' },
  { value: 'mid-range', label: '💳 Mid-Range',  sub: '₹3,500–₹6,000/day' },
  { value: 'luxury',   label: '✨ Luxury',     sub: '₹8,000–₹25,000/day'},
]

export default function ItineraryForm({ onResult }) {
  const [form, setForm] = useState({
    starting_point: 'Bangalore',
    days: 3,
    budget: 'mid-range',
    interests: [],
    travel_style: 'mixed',
  })
  const [loading, setLoading] = useState(false)

  const toggleInterest = (val) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(val)
        ? f.interests.filter(i => i !== val)
        : [...f.interests, val],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.interests.length === 0) {
      toast.error('Please select at least one interest!')
      return
    }
    setLoading(true)
    try {
      const { data } = await generateItinerary(form)
      onResult(data)
      toast.success('Your Karnataka itinerary is ready! 🎉')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Something went wrong. Check backend logs.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Starting Point */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
          <MapPin size={15} className="text-karnataka-red" /> Starting Point
        </label>
        <select
          value={form.starting_point}
          onChange={e => setForm(f => ({ ...f, starting_point: e.target.value }))}
          className="input-field"
        >
          {STARTING_POINTS.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
          <Clock size={15} className="text-karnataka-red" /> Duration: <span className="text-karnataka-red font-bold">{form.days} Day{form.days > 1 ? 's' : ''}</span>
        </label>
        <input
          type="range" min={1} max={14} value={form.days}
          onChange={e => setForm(f => ({ ...f, days: +e.target.value }))}
          className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-karnataka-red"
        />
        <div className="flex justify-between text-xs text-stone-400 mt-1">
          <span>1 day</span><span>7 days</span><span>14 days</span>
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-3">
          <Wallet size={15} className="text-karnataka-red" /> Budget Category
        </label>
        <div className="grid grid-cols-3 gap-3">
          {BUDGETS.map(b => (
            <button
              key={b.value} type="button"
              onClick={() => setForm(f => ({ ...f, budget: b.value }))}
              className={`rounded-xl border-2 p-3 text-center transition-all duration-200 ${
                form.budget === b.value
                  ? 'border-karnataka-gold bg-karnataka-gold/10 shadow-md'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="text-sm font-bold">{b.label}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">{b.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-3">
          <Sparkles size={15} className="text-karnataka-red" /> Interests
          <span className="text-xs text-stone-400 font-normal">(select all that apply)</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {INTERESTS.map(({ label, icon: Icon, value }) => {
            const active = form.interests.includes(value)
            return (
              <button
                key={value} type="button"
                onClick={() => toggleInterest(value)}
                className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'border-karnataka-green bg-karnataka-green text-white shadow-md'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-karnataka-green/50'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Travel Style */}
      <div>
        <label className="text-sm font-semibold text-stone-700 mb-2 block">Travel Style</label>
        <div className="flex gap-2 flex-wrap">
          {['mixed', 'relaxed', 'adventure', 'cultural'].map(s => (
            <button
              key={s} type="button"
              onClick={() => setForm(f => ({ ...f, travel_style: s }))}
              className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all duration-200 capitalize ${
                form.travel_style === s
                  ? 'border-karnataka-red bg-karnataka-red text-white'
                  : 'border-stone-200 text-stone-600 hover:border-karnataka-red/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4">
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Generating your Karnataka adventure…
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Generate My Itinerary
          </>
        )}
      </button>
    </form>
  )
}
