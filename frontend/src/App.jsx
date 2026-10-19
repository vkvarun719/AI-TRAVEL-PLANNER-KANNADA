import { useState } from 'react'
import { MapPin, Cpu, Compass, Sparkles, Navigation } from 'lucide-react'
import ItineraryForm from './components/ItineraryForm'
import ItineraryResult from './components/ItineraryResult'

const HERO_PLACES = ['Hampi', 'Coorg', 'Badami', 'Gokarna', 'Chikmagalur', 'Belur', 'Mysuru', 'Dandeli']

// Handpicked high-res authentic photos of Karnataka landmarks
const LANDMARK_CARDS = [
  {
    id: 'hampi',
    title: 'Hampi',
    subtitle: 'UNESCO World Heritage Site',
    position: 'top-left',
    rotation: '-rotate-3 hover:-rotate-1 animate-float',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
    tag: 'Vijayanagara Ruins'
  },
  {
    id: 'badami',
    title: 'Badami',
    subtitle: 'Rock-Cut Caves & Heritage',
    position: 'bottom-left',
    rotation: 'rotate-2 hover:rotate-0 animate-float-delay',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    tag: 'Chalukya Dynasty'
  },
  {
    id: 'mysuru',
    title: 'Mysuru',
    subtitle: 'Palace of Royal Heritage',
    position: 'top-right',
    rotation: 'rotate-3 hover:rotate-1 animate-float-delay',
    image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=600&q=80',
    tag: 'Wodeyar Grandeur'
  },
  {
    id: 'bengaluru',
    title: 'Bengaluru',
    subtitle: 'The Bustling Capital & Bangalore Palace',
    position: 'bottom-right',
    rotation: '-rotate-2 hover:rotate-0 animate-float',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
    tag: 'Garden City Hub'
  }
]

export default function App() {
  const [result, setResult] = useState(null)

  return (
    <div className="min-h-screen bg-[#FAF6F0] selection:bg-karnataka-gold/30">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#FAF6F0]/80 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-karnataka-red to-red-700 flex items-center justify-center shadow-sm">
              <MapPin size={16} className="text-white" />
            </div>
            <span className="font-black text-karnataka-dark text-lg tracking-tight">
              Yatra <span className="text-karnataka-red">AI</span>
            </span>
          </div>
        </div>
      </header>

      {/* 1. Rich Atmospheric Karnataka Landscape Hero Section */}
      {!result && (
        <section className="relative overflow-hidden bg-stone-950 text-white py-28 sm:py-36 px-4">
          {/* Vivid Karnataka Panorama Layer (Hampi Chariot + Western Ghats + Mysore) */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            {/* Full-width scenic Karnataka backdrop */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-45 scale-105 filter contrast-110 saturate-125"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1920&q=85')`
              }}
            />

            {/* Left side: Mysore Palace illumination accent */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-cover bg-center opacity-30 mix-blend-screen"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80')`
              }}
            />

            {/* Right side: Lush Western Ghats green canopy */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center opacity-30 mix-blend-screen"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')`
              }}
            />

            {/* Subtle multi-layer gradient vignette for crystal clear text */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-900/60 to-[#FAF6F0]" />

            {/* Ambient Gold & Saffron Radial Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-karnataka-gold/20 blur-[130px]" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-karnataka-red/20 blur-[110px]" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-black mb-5 leading-tight tracking-tight drop-shadow-lg">
              Discover Karnataka<br />
              <span className="bg-gradient-to-r from-amber-300 via-karnataka-gold to-yellow-500 bg-clip-text text-transparent drop-shadow-md">
                Like a Local
              </span>
            </h1>

            <p className="text-stone-200 text-base sm:text-lg mb-8 max-w-xl mx-auto font-normal leading-relaxed drop-shadow-md">
              AI-powered itineraries with hyper-local intelligence — heritage architecture,
              Western Ghats biker passes, authentic military hotels & monsoon road updates.
            </p>

            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {HERO_PLACES.map(p => (
                <span
                  key={p}
                  className="bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1 text-xs font-semibold text-white transition-colors shadow-sm"
                >
                  📍 {p}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className={`mx-auto px-4 py-8 sm:py-12 transition-all duration-300 ${result ? 'max-w-7xl' : 'max-w-6xl'}`}>
        {!result ? (
          /* Landing Form Section Wrapped with Photographic Polaroids & Cartographic Curves */
          <div className="relative py-4 sm:py-8">
            
            {/* 3. Cartographic Embellishments: Dotted Saffron & Green Roads (Desktop only) */}
            <div className="hidden xl:block absolute inset-0 pointer-events-none select-none z-0 overflow-visible">
              <svg className="w-full h-full" viewBox="0 0 1150 780" fill="none">
                {/* Saffron Dotted Highway connecting Hampi (Top-Left) to Mysuru (Top-Right) curving through Form */}
                <path
                  d="M 170 140 C 340 70, 780 70, 960 140"
                  stroke="#F5A623"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  opacity="0.45"
                />
                
                {/* Forest Green Dotted Western Ghats Trail connecting Hampi (Top-Left) to Badami (Bottom-Left) */}
                <path
                  d="M 170 210 C 130 350, 140 460, 180 570"
                  stroke="#1A7A4A"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  opacity="0.45"
                />

                {/* Saffron Cross Route connecting Badami (Bottom-Left) to Bengaluru (Bottom-Right) */}
                <path
                  d="M 230 630 C 440 720, 720 720, 920 630"
                  stroke="#F5A623"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  opacity="0.45"
                />

                {/* Forest Green Heritage Link connecting Mysuru (Top-Right) to Bengaluru (Bottom-Right) */}
                <path
                  d="M 970 220 C 1010 350, 1000 470, 960 570"
                  stroke="#1A7A4A"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  opacity="0.45"
                />

                {/* Roadway Map Pin Anchors */}
                <circle cx="170" cy="140" r="5" fill="#C8102E" stroke="#FAF6F0" strokeWidth="2" />
                <circle cx="180" cy="570" r="5" fill="#1A7A4A" stroke="#FAF6F0" strokeWidth="2" />
                <circle cx="960" cy="140" r="5" fill="#F5A623" stroke="#FAF6F0" strokeWidth="2" />
                <circle cx="960" cy="570" r="5" fill="#C8102E" stroke="#FAF6F0" strokeWidth="2" />
              </svg>
            </div>

            {/* 2. Empty Margin Landmark Photo Cards (Desktop Only `hidden xl:flex`) */}
            {/* Top-Left Polaroid: Hampi */}
            <div className="hidden xl:flex flex-col absolute -left-12 2xl:-left-20 top-4 z-10 w-64 p-3 bg-white rounded-2xl shadow-xl border border-stone-200/90 transform -rotate-3 hover:-rotate-1 animate-float transition-transform duration-300 group cursor-default">
              <div className="w-full h-36 rounded-xl overflow-hidden mb-2.5 relative bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80"
                  alt="Hampi Ruins"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  UNESCO Site
                </span>
              </div>
              <div className="px-1">
                <h4 className="text-xs font-black text-stone-900 tracking-tight">Hampi</h4>
                <p className="text-[11px] text-stone-500 font-medium leading-snug">
                  UNESCO World Heritage Site • Vijayanagara Ruins
                </p>
              </div>
            </div>

            {/* Bottom-Left Polaroid: Badami */}
            <div className="hidden xl:flex flex-col absolute -left-12 2xl:-left-20 bottom-8 z-10 w-64 p-3 bg-white rounded-2xl shadow-xl border border-stone-200/90 transform rotate-2 hover:rotate-0 animate-float-delay transition-transform duration-300 group cursor-default">
              <div className="w-full h-36 rounded-xl overflow-hidden mb-2.5 relative bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80"
                  alt="Badami & Karnataka Heritage"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Chalukya Caves
                </span>
              </div>
              <div className="px-1">
                <h4 className="text-xs font-black text-stone-900 tracking-tight">Badami</h4>
                <p className="text-[11px] text-stone-500 font-medium leading-snug">
                  Badami • Rock-Cut Caves & Red Sandstone Cliffs
                </p>
              </div>
            </div>

            {/* Top-Right Polaroid: Mysuru */}
            <div className="hidden xl:flex flex-col absolute -right-12 2xl:-right-20 top-4 z-10 w-64 p-3 bg-white rounded-2xl shadow-xl border border-stone-200/90 transform rotate-3 hover:rotate-1 animate-float-delay transition-transform duration-300 group cursor-default">
              <div className="w-full h-36 rounded-xl overflow-hidden mb-2.5 relative bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=600&q=80"
                  alt="Mysuru Palace"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Royal Palace
                </span>
              </div>
              <div className="px-1">
                <h4 className="text-xs font-black text-stone-900 tracking-tight">Mysuru</h4>
                <p className="text-[11px] text-stone-500 font-medium leading-snug">
                  Mysuru • Palace of Royal Heritage & Dussehra
                </p>
              </div>
            </div>

            {/* Bottom-Right Polaroid: Bengaluru */}
            <div className="hidden xl:flex flex-col absolute -right-12 2xl:-right-20 bottom-8 z-10 w-64 p-3 bg-white rounded-2xl shadow-xl border border-stone-200/90 transform -rotate-2 hover:rotate-0 animate-float transition-transform duration-300 group cursor-default">
              <div className="w-full h-36 rounded-xl overflow-hidden mb-2.5 relative bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80"
                  alt="Bangalore Palace / Capital"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Silicon Hub
                </span>
              </div>
              <div className="px-1">
                <h4 className="text-xs font-black text-stone-900 tracking-tight">Bengaluru</h4>
                <p className="text-[11px] text-stone-500 font-medium leading-snug">
                  Bengaluru • Bustling Capital & Bangalore Palace
                </p>
              </div>
            </div>

            {/* Central Interactive "Plan Your Trip" Card */}
            <div className="relative z-20 max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-stone-200/80 p-6 sm:p-10">
              <div className="mb-8">
                <div className="flex items-center gap-2 text-karnataka-red text-xs font-bold uppercase tracking-wider mb-1">
                  <Compass size={14} /> Custom Trip Architect
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-karnataka-dark tracking-tight">
                  Plan Your Karnataka Adventure
                </h2>
                <p className="text-stone-500 text-sm mt-1">
                  Select your travel duration, budget, and local interests — our AI crafts your day-by-day route in seconds.
                </p>
              </div>

              <ItineraryForm onResult={setResult} />
            </div>

          </div>
        ) : (
          <ItineraryResult data={result} onReset={() => setResult(null)} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 py-10 px-4 text-center text-xs text-stone-500 bg-[#FAF6F0]">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-bold text-stone-700 text-sm">Yatra AI — Intelligent Travel Planner for Karnataka</p>
          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-stone-400 font-medium">
            <span>Western Ghats Routes</span>
            <span>•</span>
            <span>Heritage Circuits</span>
            <span>•</span>
            <span>Monsoon Intelligence</span>
            <span>•</span>
            <span>Coastal Trails</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
