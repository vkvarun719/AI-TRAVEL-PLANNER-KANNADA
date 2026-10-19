import { useRef } from 'react'
import {
  Sun, Coffee, Sunset, Lightbulb, IndianRupee,
  MapPin, Calendar, Backpack, Star, ArrowLeft, Download,
  Hotel, Utensils, Compass, BedDouble, Tag, Clock, Sparkles
} from 'lucide-react'
import BudgetDonutCard from './BudgetDonutCard'
import RouteMapCard from './RouteMapCard'
import KannadaCompanion from './KannadaCompanion'

// 100% verified, reliable high-res Karnataka landmark banners
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
    <div className="flex flex-col sm:flex-row gap-3 p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/60 hover:bg-white hover:border-stone-300 transition-all duration-200">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${color} flex items-center justify-center text-white shadow-xs mt-0.5`}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">{label}</p>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">{text}</p>
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

function DayCard({ plan, index }) {
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
      <div className="flex-1 card mb-8 border border-stone-200/80 hover:shadow-md transition-shadow duration-200 p-5 sm:p-6 rounded-2xl bg-white space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-2 pb-2 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-karnataka-red mb-0.5 block">
              Day {plan.day} Journey
            </span>
            <h3 className="text-base sm:text-lg font-black text-karnataka-dark">{plan.title}</h3>
          </div>
          <span className="tag bg-karnataka-gold/15 text-amber-700 border border-karnataka-gold/30">
            <IndianRupee size={11} />
            {plan.estimated_cost}
          </span>
        </div>

        {/* 1. Places to Visit (Top Attractions) */}
        {plan.places_to_visit && plan.places_to_visit.length > 0 && (
          <div className="bg-stone-50/80 rounded-xl p-3.5 border border-stone-200/70">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
              <Compass size={14} className="text-karnataka-red" />
              <span>Key Places To Visit</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {plan.places_to_visit.map((place, pIdx) => (
                <div key={pIdx} className="bg-white p-3 rounded-lg border border-stone-200/80 shadow-2xs">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h5 className="text-xs font-bold text-stone-900 leading-snug">{place.name}</h5>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                      {place.entry_fee}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-stone-400 mb-1">
                    <Clock size={11} />
                    <span>Best Time: {place.best_time}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed font-normal">
                    {place.highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Morning / Afternoon / Evening Timeline */}
        <div className="space-y-3">
          <TimeBlock icon={Coffee} label="Morning" text={plan.morning} color="bg-amber-500" slotKey="morning" dayIndex={index} />
          <TimeBlock icon={Sun} label="Afternoon" text={plan.afternoon} color="bg-orange-500" slotKey="afternoon" dayIndex={index} />
          <TimeBlock icon={Sunset} label="Evening" text={plan.evening} color="bg-purple-500" slotKey="evening" dayIndex={index} />
        </div>

        {/* 3. Where to Eat (Food Spots & Iconic Dishes) */}
        {plan.where_to_eat && plan.where_to_eat.length > 0 && (
          <div className="bg-amber-50/40 rounded-xl p-3.5 border border-amber-200/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5">
              <Utensils size={14} className="text-amber-600" />
              <span>Where To Eat & Iconic Local Bites</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {plan.where_to_eat.map((food, fIdx) => (
                <div key={fIdx} className="bg-white p-3 rounded-lg border border-amber-100 shadow-2xs">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h5 className="text-xs font-black text-stone-900">{food.name}</h5>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 whitespace-nowrap">
                      {food.meal_type}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-karnataka-red mb-1">
                    🍲 Must Order: {food.dish}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                    <span className="truncate pr-1">📍 {food.address_or_area}</span>
                    <span className="font-semibold text-stone-700 whitespace-nowrap">{food.approx_cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Hotel Details (Where To Stay Tonight) */}
        {plan.stay && (
          <div className="bg-gradient-to-r from-red-50/50 to-amber-50/40 rounded-xl p-3.5 border border-red-100">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-karnataka-red uppercase tracking-wider">
                <Hotel size={14} />
                <span>Recommended Stay For Tonight</span>
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
              <div className="text-[11px] text-stone-500 flex items-center gap-1 mb-1.5">
                <MapPin size={11} className="text-karnataka-red flex-shrink-0" />
                <span>Location: {plan.stay.area}</span>
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
            <strong className="not-italic text-karnataka-green font-bold">Local Insider Tip: </strong>
            {plan.tips}
          </p>
        </div>

      </div>
    </div>
  )
}

export default function ItineraryResult({ data, onReset }) {
  const printRef = useRef()

  const handlePrint = () => window.print()

  // Select banner image based on summary text or starting point
  const summaryLower = ((data.summary || '') + ' ' + (data.starting_point || '')).toLowerCase()
  let bannerImg = DESTINATION_BANNER_IMAGES.default
  for (const [key, url] of Object.entries(DESTINATION_BANNER_IMAGES)) {
    if (summaryLower.includes(key)) {
      bannerImg = url
      break
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
          <div className="card border border-stone-200/90 bg-white/95 shadow-xs p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-karnataka-red text-xs font-bold uppercase tracking-widest mb-1.5">
              <Sparkles size={13} /> Trip Dossier
            </div>
            <h2 className="text-xl font-black text-karnataka-dark leading-tight mb-2">
              {data.days}-Day {data.travel_style ? (data.travel_style.charAt(0).toUpperCase() + data.travel_style.slice(1)) : 'Custom'} Journey
            </h2>
            
            <div className="space-y-2 py-3 border-y border-stone-100 my-3 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1.5 text-stone-400">
                  <MapPin size={13} className="text-karnataka-red" /> Starting Hub
                </span>
                <span className="font-bold text-stone-800">{data.starting_point}</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1.5 text-stone-400">
                  <Calendar size={13} className="text-karnataka-green" /> Total Days
                </span>
                <span className="font-bold text-stone-800">{data.days} Days / {data.days - 1} Nights</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1.5 text-stone-400">
                  <IndianRupee size={13} className="text-karnataka-gold" /> Budget Tier
                </span>
                <span className="font-bold text-stone-800 capitalize">{data.budget}</span>
              </div>
            </div>

            {/* Interest Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {data.interests?.map(item => (
                <span
                  key={item}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 font-semibold text-[11px] border border-stone-200/70"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handlePrint}
                className="btn-primary w-full flex items-center justify-center gap-2 text-xs py-3 rounded-xl"
              >
                <Download size={14} /> Print / Save as PDF
              </button>
              <button
                type="button"
                onClick={onReset}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-300 font-semibold text-xs text-stone-700 hover:border-karnataka-red hover:text-karnataka-red bg-white transition-all duration-200"
              >
                <ArrowLeft size={13} /> Plan Another Trip
              </button>
            </div>
          </div>

          {/* Interactive Route Waypoints Map */}
          <RouteMapCard startingPoint={data.starting_point} itinerary={data.itinerary || []} />

          {/* Interactive Budget Analyzer with Donut Chart */}
          <BudgetDonutCard baseDays={data.days} initialBudget={data.budget} />

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
            {/* Cinematic Gradient Vignette Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/75 to-stone-900/30" />

            <div className="relative z-10 p-6 sm:p-8">
              <div className="inline-flex items-center gap-1.5 bg-karnataka-gold/25 backdrop-blur-md border border-karnataka-gold/40 text-karnataka-gold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5">
                <Star size={12} fill="currentColor" /> Verified Local AI Itinerary
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 drop-shadow-md">
                Experiencing Karnataka: {data.starting_point} Circuit
              </h1>
              <p className="text-stone-200 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal drop-shadow-sm">
                {data.summary}
              </p>
            </div>
          </div>

          {/* Best Time to Visit & Packing Tips Callouts */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card border-l-4 border-l-karnataka-gold border-stone-200/80 bg-white p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar size={15} className="text-amber-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Best Time To Visit
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {data.best_time_to_visit}
              </p>
            </div>

            <div className="card border-l-4 border-l-karnataka-green border-stone-200/80 bg-white p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <Backpack size={15} className="text-karnataka-green" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Packing & Gear Advice
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {data.packing_tips}
              </p>
            </div>
          </div>

          {/* Interactive Day-by-Day Itinerary Timeline */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-karnataka-dark flex items-center gap-2">
                <MapPin size={18} className="text-karnataka-red" />
                Detailed Daily Timeline
              </h3>
              <span className="text-xs text-stone-400 font-semibold">
                {data.itinerary?.length || 0} Scheduled Days
              </span>
            </div>

            <div className="space-y-1">
              {data.itinerary?.map((plan, i) => (
                <DayCard key={plan.day || i} plan={plan} index={i} />
              ))}
            </div>
          </div>

          {/* Local Kannada Companion (Phrasebook & Cultural Customs) */}
          <KannadaCompanion />

        </div>

      </div>
    </div>
  )
}
