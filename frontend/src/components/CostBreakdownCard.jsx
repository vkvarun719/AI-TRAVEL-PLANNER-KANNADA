import React, { useState } from 'react'
import {
  IndianRupee, Hotel, Utensils, Car, Ticket,
  Users, Calendar, Sparkles, TrendingUp
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

// Cost multipliers relative to mid-range baseline
const TIER_MULTIPLIERS = {
  budget: 0.55,
  mid: 1.0,
  luxury: 2.25
}

export default function CostBreakdownCard({
  costBreakdown,
  travelers = 2,
  days = 3,
  initialTier = 'mid'
}) {
  const { language, t } = useLanguage()
  const isKn = language === 'kn'

  const [activeTier, setActiveTier] = useState(
    initialTier === 'budget' || initialTier === 'mid-range' ? (initialTier === 'mid-range' ? 'mid' : 'budget') : (initialTier === 'luxury' ? 'luxury' : 'mid')
  )
  const [viewMode, setViewMode] = useState('total') // 'total' | 'per-day'
  const [viewPerPerson, setViewPerPerson] = useState(false)

  if (!costBreakdown) return null

  const count = Math.max(1, travelers || 1)
  const totalDays = Math.max(1, days || 1)
  const tierMultiplier = TIER_MULTIPLIERS[activeTier] || 1.0

  // Calculate baseline amounts from server/model data
  const baseStay = costBreakdown.stay || 4000
  const baseFood = costBreakdown.food || 2500
  const baseTransport = costBreakdown.transport || 2000
  const baseActivities = costBreakdown.activities || 1200

  // Apply tier scaling
  let stayTotal = Math.round(baseStay * tierMultiplier)
  let foodTotal = Math.round(baseFood * tierMultiplier)
  let transportTotal = Math.round(baseTransport * tierMultiplier)
  let activitiesTotal = Math.round(baseActivities * (activeTier === 'luxury' ? 1.6 : (activeTier === 'budget' ? 0.75 : 1.0)))

  // Apply per-day or per-person divisor
  const personDivisor = viewPerPerson ? count : 1
  const dayDivisor = viewMode === 'per-day' ? totalDays : 1

  const stay = Math.round((stayTotal / personDivisor) / dayDivisor)
  const food = Math.round((foodTotal / personDivisor) / dayDivisor)
  const transport = Math.round((transportTotal / personDivisor) / dayDivisor)
  const activities = Math.round((activitiesTotal / personDivisor) / dayDivisor)
  const grandTotal = Math.round(((stayTotal + foodTotal + transportTotal + activitiesTotal) / personDivisor) / dayDivisor)

  const items = [
    {
      label: isKn ? 'ವಾಸ್ತವ್ಯ (Stay)' : 'Stay / Homestay',
      sublabel: activeTier === 'budget' ? 'Dorm / Budget Lodge' : activeTier === 'luxury' ? 'Heritage Resort / Spa' : 'Boutique / Homestay',
      amount: stay,
      icon: Hotel,
      color: 'text-karnataka-red',
      bg: 'bg-red-500',
      pct: 40
    },
    {
      label: isKn ? 'ಊಟೋಪಹಾರ (Food)' : 'Food & Dining',
      sublabel: activeTier === 'budget' ? 'Darshinis / Mess' : activeTier === 'luxury' ? 'Plantation / Fine Dining' : 'Traditional Restaurants',
      amount: food,
      icon: Utensils,
      color: 'text-amber-600',
      bg: 'bg-amber-500',
      pct: 25
    },
    {
      label: isKn ? 'ಸಾರಿಗೆ (Transport)' : 'Transport',
      sublabel: activeTier === 'budget' ? 'KSRTC Sarige / Train' : activeTier === 'luxury' ? 'Private SUV / Chauffeur' : 'Airavata / Cab / Rental',
      amount: transport,
      icon: Car,
      color: 'text-karnataka-green',
      bg: 'bg-emerald-600',
      pct: 20
    },
    {
      label: isKn ? 'ಪ್ರವೇಶ ಶುಲ್ಕ & ಚಟುವಟಿಕೆ' : 'Entry Fees & Tours',
      sublabel: 'ASI Monuments, Coracle, Safaris',
      amount: activities,
      icon: Ticket,
      color: 'text-indigo-600',
      bg: 'bg-indigo-600',
      pct: 15
    }
  ]

  return (
    <div className="card border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm p-5 sm:p-6 rounded-2xl space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 dark:bg-amber-400/20 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold">
            <IndianRupee size={17} />
          </div>
          <div>
            <h3 className="text-sm font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{isKn ? 'ಬಜೆಟ್ ಅಂದಾಜು ವಿವರ' : 'Trip Budget & Expense Estimator'}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/50">
                INR (₹)
              </span>
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {isKn ? 'ನಿಮ್ಮ ಪ್ರಯಾಣ ಶೈಲಿಗೆ ತಕ್ಕಂತೆ ವೆಚ್ಚದ ಲೆಕ್ಕಾಚಾರ' : 'Dynamic cost forecast for stay, food, transport & entry tickets'}
            </p>
          </div>
        </div>

        {/* View Per-Person Toggle */}
        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewPerPerson(false)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              !viewPerPerson
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-2xs font-black'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            {count > 1 ? (isKn ? `ಎಲ್ಲಾ ${count} ಜನರಿಗೆ` : `All ${count} Travelers`) : (isKn ? 'ಒಟ್ಟು' : 'Total')}
          </button>
          <button
            type="button"
            onClick={() => setViewPerPerson(true)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              viewPerPerson
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-2xs font-black'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            {isKn ? 'ತಲಾ ಒಬ್ಬರಿಗೆ' : 'Per Person'}
          </button>
        </div>
      </div>

      {/* 1. Interactive Budget Tier Selector Toggle (Budget / Mid / Luxury) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
          {isKn ? 'ಬಜೆಟ್ ಹಂತ ಆಯ್ಕೆಮಾಡಿ:' : 'Select Travel Tier (Recalculates Instantly):'}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTier('budget')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeTier === 'budget'
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
            }`}
          >
            <div className="text-xs font-black flex items-center justify-between">
              <span>🎒 {isKn ? 'ಬಜೆಟ್' : 'Budget'}</span>
              {activeTier === 'budget' && <span className="text-[10px] text-emerald-600">✓</span>}
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
              {isKn ? 'ಲಾಡ್ಜ್ / ಬಸ್ / ಮೆಸ್' : 'Lodge • KSRTC • Mess'}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTier('mid')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeTier === 'mid'
                ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
            }`}
          >
            <div className="text-xs font-black flex items-center justify-between">
              <span>✨ {isKn ? 'ಮಧ್ಯಮ' : 'Mid-Range'}</span>
              {activeTier === 'mid' && <span className="text-[10px] text-amber-600">✓</span>}
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
              {isKn ? 'ಹೋಂಸ್ಟೇ / ಕ್ಯಾಬ್ / ಊಟ' : 'Homestay • Cabs • Cafes'}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTier('luxury')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeTier === 'luxury'
                ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 shadow-xs'
                : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
            }`}
          >
            <div className="text-xs font-black flex items-center justify-between">
              <span>👑 {isKn ? 'ಐಷಾರಾಮಿ' : 'Luxury'}</span>
              {activeTier === 'luxury' && <span className="text-[10px] text-purple-600">✓</span>}
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
              {isKn ? 'ರೆಸಾರ್ಟ್ / ಎಸ್‌ಯುವಿ' : 'Resort • SUV • Fine Dine'}
            </div>
          </button>
        </div>
      </div>

      {/* 2. Total vs Per-Day Breakdown Toggle */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
          {viewMode === 'total'
            ? (isKn ? `${totalDays} ದಿನಗಳ ಒಟ್ಟು ಮೊತ್ತ:` : `Full ${totalDays}-Day Duration:`)
            : (isKn ? 'ಪ್ರತಿದಿನದ ಸರಾಸರಿ ವೆಚ್ಚ:' : 'Average Per-Day Spending:')}
        </span>
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('total')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              viewMode === 'total' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-2xs font-bold' : 'text-stone-500'
            }`}
          >
            {isKn ? 'ಒಟ್ಟು ವೆಚ್ಚ' : 'Trip Total'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('per-day')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              viewMode === 'per-day' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-2xs font-bold' : 'text-stone-500'
            }`}
          >
            {isKn ? 'ದಿನಕ್ಕೆ' : 'Per Day'}
          </button>
        </div>
      </div>

      {/* 3. 4-Category Itemized Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {items.map((cat, idx) => {
          const Icon = cat.icon
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-stone-50/90 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-0.5">
                  <Icon size={13} className={cat.color} />
                  <span className="truncate">{cat.label}</span>
                </div>
                <p className="text-[10px] text-stone-400 dark:text-stone-500 truncate mb-1">
                  {cat.sublabel}
                </p>
              </div>
              <div>
                <div className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                  ₹{cat.amount.toLocaleString('en-IN')}
                  {viewMode === 'per-day' && <span className="text-[10px] font-normal text-stone-400">/day</span>}
                </div>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-1 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full ${cat.bg}`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 4. Grand Total Summary Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-300/70 dark:border-amber-800 flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
            {viewMode === 'per-day'
              ? (isKn ? 'ದಿನಕ್ಕೆ ಅಂದಾಜು ವೆಚ್ಚ' : 'Estimated Per-Day Cost')
              : (isKn ? 'ಪ್ರವಾಸದ ಒಟ್ಟು ಅಂದಾಜು ವೆಚ್ಚ' : 'Estimated Trip Total')}
          </div>
          <div className="text-xs text-stone-500 dark:text-stone-400">
            {totalDays} {totalDays > 1 ? (isKn ? 'ದಿನಗಳು' : 'Days') : (isKn ? 'ದಿನ' : 'Day')} • {count}{' '}
            {count > 1 ? (isKn ? 'ಪ್ರಯಾಣಿಕರು' : 'Travelers') : (isKn ? 'ಪ್ರಯಾಣಿಕ' : 'Traveler')} (
            <span className="capitalize font-medium text-stone-700 dark:text-stone-300">{activeTier} Tier</span>)
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-karnataka-dark dark:text-amber-200 flex items-center">
          <IndianRupee size={22} className="text-karnataka-red" />
          <span>{grandTotal.toLocaleString('en-IN')}</span>
          {viewMode === 'per-day' && <span className="text-xs font-normal text-stone-400 ml-1">/day</span>}
        </div>
      </div>
    </div>
  )
}
