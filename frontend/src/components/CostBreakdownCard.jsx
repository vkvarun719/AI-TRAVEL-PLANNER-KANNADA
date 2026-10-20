import { useState } from 'react'
import {
  IndianRupee,
  Hotel,
  Utensils,
  Car,
  Ticket,
  Users,
  Layers,
  Sparkles
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function CostBreakdownCard({ costBreakdown, travelers = 2, days = 3 }) {
  const { language, t } = useLanguage()
  const [viewPerPerson, setViewPerPerson] = useState(false)

  if (!costBreakdown) return null

  const count = Math.max(1, travelers || 1)
  const divisor = viewPerPerson ? count : 1

  const stay = Math.round((costBreakdown.stay || 0) / divisor)
  const food = Math.round((costBreakdown.food || 0) / divisor)
  const transport = Math.round((costBreakdown.transport || 0) / divisor)
  const activities = Math.round((costBreakdown.activities || 0) / divisor)
  const total = Math.round((costBreakdown.total || (stay + food + transport + activities)) / divisor)

  const items = [
    { label: t('costStay'), amount: stay, icon: Hotel, color: 'text-karnataka-red', bg: 'bg-red-500', pct: 40 },
    { label: t('costFood'), amount: food, icon: Utensils, color: 'text-amber-600', bg: 'bg-amber-500', pct: 25 },
    { label: t('costTransport'), amount: transport, icon: Car, color: 'text-karnataka-green', bg: 'bg-emerald-600', pct: 20 },
    { label: t('costActivities'), amount: activities, icon: Ticket, color: 'text-indigo-600', bg: 'bg-indigo-600', pct: 15 },
  ]

  return (
    <div className="card border border-stone-200/90 bg-white shadow-sm p-5 sm:p-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700">
            <IndianRupee size={16} />
          </div>
          <div>
            <h3 className="text-sm font-black text-stone-900 tracking-tight">
              {t('costBreakdownTitle')}
            </h3>
            <p className="text-[11px] text-stone-500">
              {t('costBreakdownSubtitle')}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewPerPerson(false)}
            className={`px-3 py-1 rounded-lg transition-all ${
              !viewPerPerson
                ? 'bg-white text-stone-900 shadow-2xs font-extrabold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {t('costAllTravelers', { count })}
          </button>
          <button
            type="button"
            onClick={() => setViewPerPerson(true)}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewPerPerson
                ? 'bg-white text-stone-900 shadow-2xs font-extrabold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {t('costPerPerson')}
          </button>
        </div>
      </div>

      {/* Grid of 4 Breakdown Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {items.map((cat, idx) => {
          const Icon = cat.icon
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/70 shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 mb-1">
                <Icon size={13} className={cat.color} />
                <span className="truncate">{cat.label}</span>
              </div>
              <div className="text-sm sm:text-base font-black text-stone-900">
                ₹{cat.amount.toLocaleString('en-IN')}
              </div>
              <div className="w-full bg-stone-200 h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${cat.bg}`}
                  style={{ width: `${cat.pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Total Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-300/60 flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
            {t('costTotal')}
          </div>
          <div className="text-xs text-stone-500">
            {days} {days > 1 ? 'Days' : 'Day'} • {count} {count > 1 ? 'Travelers' : 'Traveler'}
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black text-karnataka-dark flex items-center">
          <IndianRupee size={18} className="text-karnataka-red" />
          <span>{total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  )
}
