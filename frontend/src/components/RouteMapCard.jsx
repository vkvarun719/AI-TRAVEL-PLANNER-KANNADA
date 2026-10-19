import { useState } from 'react'
import {
  Navigation,
  MapPin,
  Compass,
  Milestone,
  ExternalLink,
  ChevronRight,
  Camera,
  Image,
  Info,
  Sparkles
} from 'lucide-react'

// Coordinates and authentic landmark imagery for Karnataka hubs
const KARNATAKA_DESTINATIONS = {
  bangalore: {
    x: 74,
    y: 78,
    name: 'Bangalore (Bengaluru)',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=700&q=80',
    caption: 'Silicon Valley of India • Bangalore Palace & Lalbagh Gardens',
    vibe: 'Capital Hub & Gardens'
  },
  mysore: {
    x: 62,
    y: 84,
    name: 'Mysore (Mysuru)',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443b2f5?auto=format&fit=crop&w=700&q=80',
    caption: 'City of Palaces • Illuminated Amba Vilas & Chamundi Hills',
    vibe: 'Royal Heritage'
  },
  hampi: {
    x: 58,
    y: 38,
    name: 'Hampi',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=700&q=80',
    caption: 'UNESCO World Heritage • Stone Chariot, Tungabhadra & Boulder Landscapes',
    vibe: 'Ancient Vijayanagara'
  },
  coorg: {
    x: 44,
    y: 80,
    name: 'Coorg (Kodagu)',
    image: 'https://images.unsplash.com/photo-1592659762303-90081d14b4a7?auto=format&fit=crop&w=700&q=80',
    caption: 'Scotland of India • Misty Coffee Plantations & Abbey Falls',
    vibe: 'Coffee Country & Mist'
  },
  chikmagalur: {
    x: 48,
    y: 66,
    name: 'Chikmagalur',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
    caption: 'Western Ghats Peak • Mullayanagiri, Coffee Estates & Bababudangiri',
    vibe: 'Highest Mountain Peak'
  },
  gokarna: {
    x: 26,
    y: 44,
    name: 'Gokarna',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80',
    caption: 'Sacred Coastal Haven • Om Beach, Kudle Sunset & Mahabaleshwara',
    vibe: 'Beaches & Spirituality'
  },
  mangalore: {
    x: 36,
    y: 74,
    name: 'Mangalore (Mangaluru)',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80',
    caption: 'Coastal Hub • Tannirbhavi Beach, Panambur & Kori Rotti Cuisine',
    vibe: 'Coastal & Culinary'
  },
  badami: {
    x: 50,
    y: 26,
    name: 'Badami & Pattadakal',
    image: 'https://images.unsplash.com/photo-1626014303757-6466336e4f32?auto=format&fit=crop&w=700&q=80',
    caption: 'Chalukyan Architecture • Red Sandstone Cave Temples & Agastya Lake',
    vibe: 'Rock-Cut Marvels'
  },
  belur: {
    x: 52,
    y: 70,
    name: 'Belur & Halebidu',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=700&q=80',
    caption: 'Hoysala Architecture • Chennakeshava Temple Intricate Filigree',
    vibe: 'Stone Poetry'
  },
  halebidu: {
    x: 55,
    y: 69,
    name: 'Halebidu',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=700&q=80',
    caption: 'Hoysaleswara Temple & Exquisite Soapstone Reliefs',
    vibe: 'Hoysala Capital'
  },
  dandeli: {
    x: 34,
    y: 32,
    name: 'Dandeli',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80',
    caption: 'Adventure Capital • White Water Rafting on Kali River & Hornbill Trail',
    vibe: 'Rainforest Wildlife'
  },
  hubli: {
    x: 44,
    y: 34,
    name: 'Hubli - Dharwad',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80',
    caption: 'Commercial Gateway & Dharwad Pedha Cultural Heritage',
    vibe: 'North Karnataka Transit'
  },
  dharwad: {
    x: 42,
    y: 32,
    name: 'Dharwad',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80',
    caption: 'Dharwad Pedha & Hindustani Music Hub',
    vibe: 'Cultural Core'
  },
  udupi: {
    x: 33,
    y: 68,
    name: 'Udupi & Malpe',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
    caption: 'Sri Krishna Matha, St. Mary’s Basalt Island & Authentic Vegetarian Delicacies',
    vibe: 'Spiritual Coast'
  },
  agumbe: {
    x: 40,
    y: 62,
    name: 'Agumbe (Cherrapunji of South)',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80',
    caption: 'Highest Rainfall Canopy, Sunset Viewpoint & King Cobra Sanctuary',
    vibe: 'Rainforest Gateway'
  },
  jogfalls: {
    x: 36,
    y: 50,
    name: 'Jog Falls',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80',
    caption: 'Second-highest Plunge Waterfall in India (Sharavathi River)',
    vibe: 'Majestic Waterfall'
  },
  shimoga: {
    x: 48,
    y: 54,
    name: 'Shimoga (Shivamogga)',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80',
    caption: 'Gateway to Malnad • Dense Forests & Waterfalls',
    vibe: 'Malnad Gateway'
  },
  hassan: {
    x: 55,
    y: 73,
    name: 'Hassan',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=700&q=80',
    caption: 'Heritage Crossroads connecting Belur, Halebidu & Shravanabelagola',
    vibe: 'Hoysala Gateway'
  },
}

export default function RouteMapCard({ startingPoint = 'Bangalore', itinerary = [] }) {
  const [activeWaypoint, setActiveWaypoint] = useState(0)

  // Extract places mentioned in the itinerary days
  const routePoints = []
  
  // 1. Starting point
  const startKey = (startingPoint || 'Bangalore').toLowerCase().replace(/\s+/g, '')
  const startData = KARNATAKA_DESTINATIONS[startKey] || {
    x: 65,
    y: 75,
    name: startingPoint,
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=700&q=80',
    caption: `${startingPoint} Departure Point`,
    vibe: 'Starting Base'
  }

  routePoints.push({
    title: `Start: ${startingPoint}`,
    coord: { x: startData.x, y: startData.y, name: startData.name },
    image: startData.image,
    caption: startData.caption,
    vibe: startData.vibe,
    day: 0,
    tag: 'Origin Hub'
  })

  // 2. Scan each day's title / text for known places
  itinerary.forEach((dayPlan) => {
    const textToScan = `${dayPlan.title} ${dayPlan.morning} ${dayPlan.afternoon} ${dayPlan.evening}`.toLowerCase()
    let foundPlace = null

    for (const [key, val] of Object.entries(KARNATAKA_DESTINATIONS)) {
      if (textToScan.includes(key) || textToScan.includes(val.name.toLowerCase().split(' ')[0])) {
        foundPlace = val
        break
      }
    }

    if (!foundPlace) {
      const prev = routePoints[routePoints.length - 1].coord
      foundPlace = {
        x: Math.min(85, Math.max(15, prev.x + (dayPlan.day % 2 === 0 ? 8 : -8))),
        y: Math.min(85, Math.max(15, prev.y - 12)),
        name: dayPlan.title.split('•')[0].split('-')[0].trim() || `Day ${dayPlan.day} Destination`,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=700&q=80',
        caption: `Exploration route for Day ${dayPlan.day}`,
        vibe: 'Karnataka Discovery'
      }
    }

    routePoints.push({
      title: dayPlan.title,
      coord: { x: foundPlace.x, y: foundPlace.y, name: foundPlace.name },
      image: foundPlace.image,
      caption: foundPlace.caption,
      vibe: foundPlace.vibe,
      day: dayPlan.day,
      tag: `Day ${dayPlan.day} Destination`
    })
  })

  // Build SVG path string connecting points in order
  const pathD = routePoints.reduce((acc, pt, index) => {
    return index === 0
      ? `M ${pt.coord.x} ${pt.coord.y}`
      : `${acc} L ${pt.coord.x} ${pt.coord.y}`
  }, '')

  const currentPoint = routePoints[activeWaypoint] || routePoints[0]

  const googleMapsSearchUrl = `https://www.google.com/maps/dir/${routePoints
    .map(p => encodeURIComponent(p.coord.name || p.title))
    .join('/')}`

  return (
    <div className="card border border-stone-200/80 bg-white/95 shadow-sm p-4 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-karnataka-green/15 flex items-center justify-center text-karnataka-green">
            <Compass size={15} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Interactive Route Map</h4>
            <div className="text-xs font-bold text-stone-800">{routePoints.length - 1} Scenic Waypoints</div>
          </div>
        </div>
        <a
          href={googleMapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-karnataka-green hover:underline"
        >
          Open Maps <ExternalLink size={10} />
        </a>
      </div>

      {/* Styled Karnataka Vector Schematic Map */}
      <div className="relative w-full h-44 bg-gradient-to-b from-stone-900 to-stone-800 rounded-xl overflow-hidden border border-stone-700/50 p-2 shadow-inner">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

        <div className="absolute top-2 left-2.5 z-10 text-[9px] font-mono tracking-widest text-karnataka-gold uppercase opacity-80 flex items-center gap-1.5">
          <span>KARNATAKA TRANSIT CORRIDOR</span>
          <span className="text-stone-400 font-sans">• Click a path node to view photo</span>
        </div>

        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 overflow-visible">
          {/* Karnataka abstract state boundary silhouette */}
          <path
            d="M 22 20 Q 35 15 55 18 Q 72 24 78 40 Q 82 60 76 82 Q 62 88 48 85 Q 32 78 26 50 Z"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />

          {/* Planned Route Line Glow */}
          <path
            d={pathD}
            fill="none"
            stroke="#F5A623"
            strokeWidth="2.5"
            strokeOpacity="0.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Actual Route Line - Clickable */}
          <path
            d={pathD}
            fill="none"
            stroke="#F5A623"
            strokeWidth="1.6"
            strokeDasharray="3 3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer hover:stroke-amber-300 transition-colors"
            onClick={() => setActiveWaypoint((prev) => (prev + 1) % routePoints.length)}
          />

          {/* Waypoint Markers */}
          {routePoints.map((pt, idx) => {
            const isSelected = activeWaypoint === idx
            return (
              <g
                key={idx}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => setActiveWaypoint(idx)}
              >
                {/* Ping circle for active */}
                {isSelected && (
                  <circle
                    cx={pt.coord.x}
                    cy={pt.coord.y}
                    r="5"
                    fill="none"
                    stroke="#C8102E"
                    strokeWidth="1"
                    className="animate-ping opacity-80"
                  />
                )}
                <circle
                  cx={pt.coord.x}
                  cy={pt.coord.y}
                  r={isSelected ? 3.8 : 2.4}
                  fill={idx === 0 ? '#1A7A4A' : isSelected ? '#C8102E' : '#F5A623'}
                  stroke="#FFFFFF"
                  strokeWidth="0.9"
                />
                <text
                  x={pt.coord.x + 3.5}
                  y={pt.coord.y + 1.2}
                  fontSize="4.2"
                  fill={isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.75)'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  {pt.coord.name.split(' ')[0]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Dynamic Waypoint Photo Display (Updated on click) */}
      <div className="mt-3 bg-stone-900 rounded-xl overflow-hidden border border-stone-800 shadow-md relative group transition-all duration-300">
        <div className="h-32 w-full relative overflow-hidden bg-stone-950">
          <img
            key={currentPoint.image}
            src={currentPoint.image}
            alt={currentPoint.coord.name}
            className="w-full h-full object-cover animate-fade-in group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Location & Tag Overlay */}
          <div className="absolute top-2 left-2.5 right-2.5 flex items-center justify-between">
            <span className="bg-black/60 backdrop-blur-md text-karnataka-gold text-[10px] font-bold px-2 py-0.5 rounded-full border border-karnataka-gold/30">
              📍 {currentPoint.tag}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {currentPoint.vibe}
            </span>
          </div>

          <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
            <h5 className="text-xs font-black tracking-tight leading-snug flex items-center gap-1.5">
              <span>{currentPoint.coord.name}</span>
            </h5>
            <p className="text-[10px] text-stone-300 font-normal truncate mt-0.5">
              {currentPoint.caption}
            </p>
          </div>
        </div>
      </div>

      {/* Waypoint list buttons */}
      <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {routePoints.map((pt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveWaypoint(idx)}
            className={`w-full text-left flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
              activeWaypoint === idx
                ? 'bg-karnataka-gold/15 border border-karnataka-gold/30 text-karnataka-dark font-semibold'
                : 'hover:bg-stone-50 border border-transparent text-stone-600'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 ${
                  idx === 0 ? 'bg-karnataka-green' : 'bg-karnataka-red'
                }`}
              >
                {idx === 0 ? 'S' : idx}
              </span>
              <span className="truncate">{pt.coord.name}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-stone-400 font-mono flex-shrink-0">
              <Camera size={10} className="text-stone-400" />
              <span>{pt.tag}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
