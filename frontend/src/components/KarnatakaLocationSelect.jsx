import React, { useState, useRef, useEffect } from 'react'
import {
  MapPin, Search, ChevronDown, Check, X, Sparkles,
  Landmark, Mountain, Waves, TreePine, Navigation, Plus
} from 'lucide-react'
import {
  KARNATAKA_LOCATIONS,
  LOCATION_CATEGORIES,
  searchKarnatakaLocations,
  resolveLocation
} from '../data/karnatakaLocations'

const CATEGORY_ICONS = {
  all: Sparkles,
  districts: Landmark,
  heritage: Landmark,
  ghats: Mountain,
  coastal: Waves,
  pilgrimage: Sparkles,
  nature: TreePine,
}

export default function KarnatakaLocationSelect({
  label,
  sublabel,
  value,
  onChange,
  placeholder,
  dotColor = 'bg-emerald-500',
  icon: HeaderIcon = Navigation,
  popularPills = [],
  language = 'en',
  excludeValue = null,
}) {
  const isKn = language === 'kn'
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Current resolved location
  const currentLoc = resolveLocation(value)

  // Filtered list based on search and category
  const filteredLocations = searchKarnatakaLocations(searchTerm, selectedCategory)
    .filter(loc => !excludeValue || loc.value.toLowerCase() !== excludeValue.toLowerCase())

  // Check if search term is a custom place not already matched exactly
  const exactMatch = KARNATAKA_LOCATIONS.some(
    loc => loc.value.toLowerCase() === searchTerm.trim().toLowerCase() ||
           loc.en.toLowerCase() === searchTerm.trim().toLowerCase() ||
           loc.kn === searchTerm.trim()
  )
  const hasCustomOption = searchTerm.trim().length > 1 && !exactMatch

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setSearchTerm('')
      setSelectedCategory('all')
    }
  }, [isOpen])

  const handleSelect = (locValue) => {
    onChange(locValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
      }
      return
    }

    if (e.key === 'Escape') {
      setIsOpen(false)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const total = filteredLocations.length + (hasCustomOption ? 1 : 0)
      setHighlightedIndex((prev) => (prev + 1) % Math.max(1, total))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const total = filteredLocations.length + (hasCustomOption ? 1 : 0)
      setHighlightedIndex((prev) => (prev - 1 + total) % Math.max(1, total))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (hasCustomOption && highlightedIndex === 0) {
        handleSelect(searchTerm.trim())
      } else {
        const itemIdx = hasCustomOption ? highlightedIndex - 1 : highlightedIndex
        if (filteredLocations[itemIdx]) {
          handleSelect(filteredLocations[itemIdx].value)
        } else if (searchTerm.trim()) {
          handleSelect(searchTerm.trim())
        }
      }
    }
  }

  return (
    <div className="relative space-y-1.5" ref={containerRef}>
      {/* Label Bar */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-2xs ring-2 ring-white dark:ring-stone-800`} />
          <span className="font-extrabold">{label}</span>
        </label>
        {sublabel && (
          <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium hidden sm:inline">
            {sublabel}
          </span>
        )}
      </div>

      {/* Trigger Box / Input */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full text-left p-3 rounded-2xl bg-white dark:bg-stone-800/90 border transition-all duration-200 flex items-center justify-between gap-2 shadow-2xs hover:border-karnataka-red/50 focus:outline-none focus:ring-2 focus:ring-karnataka-red/20 ${
          isOpen ? 'border-karnataka-red ring-2 ring-karnataka-red/20' : 'border-stone-200 dark:border-stone-700'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-700/60 flex items-center justify-center text-stone-600 dark:text-stone-300 flex-shrink-0">
            <HeaderIcon size={15} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm font-black text-stone-900 dark:text-white truncate flex items-center gap-2">
              <span>{value || placeholder}</span>
              {currentLoc?.kn && currentLoc.kn !== value && (
                <span className="text-[11px] font-normal text-stone-500 dark:text-stone-400 hidden sm:inline">
                  • {currentLoc.kn}
                </span>
              )}
            </div>

            <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate flex items-center gap-1.5">
              <span>{currentLoc?.district ? `${currentLoc.district} District` : 'Karnataka'}</span>
              {currentLoc?.isCustom && (
                <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 font-bold text-[9px]">
                  Custom Place
                </span>
              )}
            </div>
          </div>
        </div>

        <ChevronDown
          size={16}
          className={`text-stone-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-karnataka-red' : ''
          }`}
        />
      </button>

      {/* Quick Pick Pills (if provided) */}
      {popularPills && popularPills.length > 0 && !isOpen && (
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[10px] font-bold text-stone-400 mr-1 flex-shrink-0">
            {isKn ? 'ತ್ವರಿತ:' : 'Quick:'}
          </span>
          {popularPills.slice(0, 5).map(pill => {
            const isSelected = value?.toLowerCase() === pill.value.toLowerCase()
            return (
              <button
                key={pill.value}
                type="button"
                onClick={() => handleSelect(pill.value)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-karnataka-red text-white shadow-2xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {isKn ? (pill.kn || pill.value) : (pill.en || pill.value)}
              </button>
            )
          })}
        </div>
      )}

      {/* Dropdown Menu Modal / Panel */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 left-0 right-0 top-full mt-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          style={{ maxHeight: '380px' }}
        >
          {/* Search Header */}
          <div className="p-3 border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/50 space-y-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value)
                  setHighlightedIndex(0)
                }}
                onKeyDown={handleKeyDown}
                placeholder={isKn ? 'ಕರ್ನಾಟಕದ ಯಾವುದೇ ಊರು, ಜಿಲ್ಲೆ ಅಥವಾ ತಾಣ ಹುಡುಕಿ...' : 'Search any Karnataka district, town or spot...'}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-100 focus:outline-none focus:border-karnataka-red shadow-2xs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
              {LOCATION_CATEGORIES.map(cat => {
                const IconComponent = CATEGORY_ICONS[cat.id] || Sparkles
                const isActive = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id)
                      setHighlightedIndex(0)
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-karnataka-red text-white shadow-2xs'
                        : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <IconComponent size={11} />
                    <span>{isKn ? cat.kn : cat.en}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto max-h-60 p-2 space-y-1">
            {/* Custom typed location option */}
            {hasCustomOption && (
              <button
                type="button"
                onClick={() => handleSelect(searchTerm.trim())}
                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between gap-2 border transition-all ${
                  highlightedIndex === 0
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-100'
                    : 'border-dashed border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 text-stone-700 dark:text-stone-300 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                    <Plus size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-900 dark:text-amber-200">
                      {isKn ? `"${searchTerm.trim()}" ಆಯ್ಕೆಮಾಡಿ (ಕರ್ನಾಟಕ)` : `Use "${searchTerm.trim()}" (Karnataka)`}
                    </div>
                    <div className="text-[10px] text-amber-700 dark:text-amber-400">
                      {isKn ? 'ಯಾವುದೇ ಊರು / ಹಳ್ಳಿಗೆ ಪ್ರವಾಸ ಯೋಜಿಸಿ' : 'Custom locality or town in Karnataka'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                  {isKn ? 'ಆಯ್ಕೆ' : 'Select'}
                </span>
              </button>
            )}

            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc, idx) => {
                const isSelected = value?.toLowerCase() === loc.value.toLowerCase()
                const adjustedIndex = hasCustomOption ? idx + 1 : idx
                const isHighlighted = highlightedIndex === adjustedIndex

                return (
                  <button
                    key={loc.value}
                    type="button"
                    onClick={() => handleSelect(loc.value)}
                    onMouseEnter={() => setHighlightedIndex(adjustedIndex)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between gap-2 transition-all ${
                      isSelected
                        ? 'bg-red-50 dark:bg-red-950/40 text-karnataka-red font-black border border-red-200/60 dark:border-red-800/60'
                        : isHighlighted
                        ? 'bg-stone-100 dark:bg-stone-800/80 text-stone-900 dark:text-white'
                        : 'text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black truncate">{loc.value}</span>
                        {loc.kn && (
                          <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
                            ({loc.kn})
                          </span>
                        )}
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                          {loc.district || loc.category}
                        </span>
                      </div>

                      <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                        {isKn ? (loc.highlightKn || loc.highlightEn) : loc.highlightEn}
                      </div>
                    </div>

                    {isSelected && (
                      <Check size={14} className="text-karnataka-red flex-shrink-0" />
                    )}
                  </button>
                )
              })
            ) : !hasCustomOption ? (
              <div className="py-6 text-center space-y-1">
                <MapPin size={22} className="mx-auto text-stone-300 dark:text-stone-600" />
                <p className="text-xs font-bold text-stone-600 dark:text-stone-400">
                  {isKn ? 'ಯಾವುದೇ ಫಲಿತಾಂಶ ಸಿಗಲಿಲ್ಲ' : 'No predefined location found'}
                </p>
                <p className="text-[11px] text-stone-400 dark:text-stone-500">
                  {isKn ? 'ಆದರೂ ನೀವು ಯಾವುದೇ ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ ಆಯ್ಕೆಮಾಡಬಹುದು' : 'Type any Karnataka town name to use as custom spot'}
                </p>
              </div>
            ) : null}
          </div>

          {/* Footer Count & Hint */}
          <div className="p-2.5 border-t border-stone-100 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/40 flex items-center justify-between text-[10px] text-stone-400">
            <span>
              {isKn ? 'ಕರ್ನಾಟಕದ ಎಲ್ಲಾ ೩೧ ಜಿಲ್ಲೆಗಳು ಮತ್ತು ಪ್ರವಾಸಿ ತಾಣಗಳು' : 'All 31 Karnataka Districts + 55+ Tourist Spots'}
            </span>
            <span className="font-bold text-stone-500">
              {filteredLocations.length} {isKn ? 'ಲಭ್ಯ' : 'places'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
