import { useState, useId } from 'react'
import {
  IndianRupee,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

const TIER_MULTIPLIERS = {
  budget: { factor: 0.65, label: 'Backpacker Budget', perDay: '₹1,500 - ₹2,500' },
  'mid-range': { factor: 1.0, label: 'Comfort Mid-Range', perDay: '₹3,500 - ₹6,000' },
  luxury: { factor: 2.2, label: 'Royal Heritage / Luxury', perDay: '₹8,000 - ₹22,000' }
}

const CATEGORY_SPLIT = [
  { name: 'Stay & Homestays', pct: 40, color: '#C8102E' }, // Karnataka Red
  { name: 'Food & Local Dining', pct: 25, color: '#F5A623' }, // Karnataka Gold
  { name: 'Travel & Tolls', pct: 20, color: '#1A7A4A' }, // Karnataka Green
  { name: 'Activities & ASI Entry', pct: 15, color: '#4F46E5' }, // Indigo
]

export default function BudgetDonutCard({ baseDays = 3, initialBudget = 'mid-range' }) {
  const [selectedTier, setSelectedTier] = useState(
    ['budget', 'mid-range', 'luxury'].includes(initialBudget) ? initialBudget : 'mid-range'
  )

  const activeConfig = TIER_MULTIPLIERS[selectedTier]
  const baseCostPerDay = 4200
  const totalEstimated = Math.round(baseCostPerDay * baseDays * activeConfig.factor)

  // Simple SVG Donut calculation
  const size = 150
  const strokeWidth = 22
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  let currentOffset = 0

  return (
    <div className="card border border-stone-200/80 bg-white/95 shadow-sm p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-karnataka-gold/20 flex items-center justify-center text-amber-700">
            <IndianRupee size={15} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Trip Budget Analyzer</h4>
            <div className="text-sm font-black text-stone-900">Est. Total: ₹{totalEstimated.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
          {baseDays} {baseDays > 1 ? 'Days' : 'Day'}
        </span>
      </div>

      {/* Tier Switcher Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl mb-4 text-xs font-semibold">
        {(['budget', 'mid-range', 'luxury']).map((tier) => (
          <button
            key={tier}
            type="button"
            onClick={() => setSelectedTier(tier)}
            className={`py-1.5 px-2 rounded-lg transition-all capitalize text-center ${
              selectedTier === tier
                ? 'bg-white text-karnataka-dark shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {tier === 'mid-range' ? 'Mid' : tier}
          </button>
        ))}
      </div>

      {/* Donut Chart & Legend */}
      <div className="flex items-center gap-4">
        {/* SVG Donut */}
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#F3F4F6"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {CATEGORY_SPLIT.map((item, idx) => {
              const strokeDasharray = `${(item.pct / 100) * circumference} ${circumference}`
              const strokeDashoffset = -currentOffset
              currentOffset += (item.pct / 100) * circumference

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Avg / Day</span>
            <span className="text-xs font-black text-stone-800">
              ₹{Math.round(totalEstimated / baseDays).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 flex-1 min-w-0">
          {CATEGORY_SPLIT.map((cat, i) => {
            const catAmount = Math.round((totalEstimated * cat.pct) / 100)
            return (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate text-stone-600 text-[11px] font-medium">{cat.name}</span>
                </div>
                <span className="font-semibold text-stone-800 text-[11px] ml-1">
                  {cat.pct}%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
        <span className="font-medium text-stone-600">{activeConfig.label}</span>
        <span className="text-karnataka-green font-bold">{activeConfig.perDay}</span>
      </div>
    </div>
  )
}
