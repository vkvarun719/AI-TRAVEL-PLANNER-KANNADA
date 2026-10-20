import { useState, useRef, useEffect } from 'react'
import {
  MapPin, Cpu, Compass, Sparkles, Navigation, BookOpen,
  ArrowRight, Landmark, Mountain, Waves, Bookmark, LogOut,
  MessageSquare, ArrowDown, ChevronRight, Check, Heart, Shield,
  Utensils, CloudSun, Calendar, Clock, Star, Flame, Camera
} from 'lucide-react'
import toast from 'react-hot-toast'
import ItineraryForm from './components/ItineraryForm'
import ItineraryResult from './components/ItineraryResult'
import LanguageToggle from './components/LanguageToggle'
import ThemeToggle from './components/ThemeToggle'
import PwaInstallButton from './components/PwaInstallButton'
import DestinationsModal from './components/DestinationsModal'
import PhrasebookModal from './components/PhrasebookModal'
import KannadaScannerModal from './components/KannadaScannerModal'
import MyTripsModal from './components/MyTripsModal'
import TravelJournalModal from './components/TravelJournalModal'
import FeedbackModal from './components/FeedbackModal'
import OfflineIndicator from './components/OfflineIndicator'
import ItinerarySkeleton from './components/ItinerarySkeleton'
import FriendlyErrorState from './components/FriendlyErrorState'
import { useLanguage } from './context/LanguageContext'
import { useAuth } from './context/AuthContext'
import { getTripById, saveTrip, decodeTripFromUrl } from './utils/tripStorage'
import { CURATED_ITINERARIES } from './data/curatedItineraries'
import { pingBackendHealth } from './api/client'

const HERO_PLACES = [
  { name: 'Hampi', kn: 'ಹಂಪಿ' },
  { name: 'Coorg', kn: 'ಕೂರ್ಗ್' },
  { name: 'Badami', kn: 'ಬಾದಾಮಿ' },
  { name: 'Gokarna', kn: 'ಗೋಕರ್ಣ' },
  { name: 'Chikmagalur', kn: 'ಚಿಕ್ಕಮಗಳೂರು' },
  { name: 'Belur', kn: 'ಬೇಲೂರು' },
  { name: 'Mysuru', kn: 'ಮೈಸೂರು' },
  { name: 'Dandeli', kn: 'ದಾಂಡೇಲಿ' },
  { name: 'Jog Falls', kn: 'ಜೋಗ ಜಲಪಾತ' },
  { name: 'Udupi', kn: 'ಉಡುಪಿ' },
]

export default function App() {
  const { language, t } = useLanguage()
  const { user, signInWithGoogle, signOut } = useAuth()
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingForm, setLoadingForm] = useState(null)
  const [errorState, setErrorState] = useState(null)
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false)
  const [isPhrasebookOpen, setIsPhrasebookOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [isMyTripsOpen, setIsMyTripsOpen] = useState(false)
  const [isJournalOpen, setIsJournalOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [prefillDestination, setPrefillDestination] = useState(null)
  const plannerFormRef = useRef(null)

  // Load trip from shareable link or saved trip ID or curated sample in URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const tripData = params.get('tripData')
      const tripId = params.get('tripId')
      const tripKey = params.get('trip')
      const view = params.get('view')

      if (tripData) {
        const decoded = decodeTripFromUrl(tripData)
        if (decoded) {
          saveTrip(decoded)
          setResult(decoded)
          toast.success(language === 'kn' ? 'ಹಂಚಿಕೊಂಡ ಪ್ರವಾಸವನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಿದೆ! 🎒' : 'Loaded shared trip itinerary! 🎒')
        }
      } else if (tripId) {
        const saved = getTripById(tripId)
        if (saved) {
          setResult(saved)
          toast.success(language === 'kn' ? 'ಉಳಿಸಿದ ಪ್ರವಾಸವನ್ನು ತೆರೆಯಲಾಗಿದೆ! 🎒' : 'Loaded saved trip itinerary! 🎒')
        }
      } else if (tripKey && CURATED_ITINERARIES[tripKey]) {
        setResult(CURATED_ITINERARIES[tripKey])
        toast.success(language === 'kn' ? 'ವಿಶೇಷ ಪ್ರವಾಸ ಮಾರ್ಗವನ್ನು ತೆರೆಯಲಾಗಿದೆ! 🌟' : 'Loaded featured itinerary! 🌟')
      }

      if (view === 'destinations') {
        setIsDestinationsOpen(true)
      } else if (view === 'phrasebook') {
        setIsPhrasebookOpen(true)
      } else if (view === 'journal') {
        setIsJournalOpen(true)
      }

      // Pre-warm Render free tier backend in background
      pingBackendHealth().catch(() => {})
    } catch (err) {
      console.error('URL trip parameter parsing error:', err)
    }
  }, [language])

  const handleSelectDestination = (destName) => {
    setPrefillDestination(destName)
    if (result) {
      setResult(null)
      setErrorState(null)
    }
    setTimeout(() => {
      plannerFormRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleLoadCurated = (curatedKey) => {
    if (CURATED_ITINERARIES[curatedKey]) {
      setResult(CURATED_ITINERARIES[curatedKey])
      setErrorState(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleCustomizeCurated = (curatedKey) => {
    const item = CURATED_ITINERARIES[curatedKey]
    if (item) {
      setPrefillDestination(item.starting_point)
      setResult(null)
      setErrorState(null)
      setTimeout(() => {
        plannerFormRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] dark:bg-stone-950 text-karnataka-dark dark:text-stone-100 selection:bg-karnataka-gold/30 flex flex-col justify-between transition-colors duration-300">
      
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF6F0]/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 shadow-xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div
            onClick={() => {
              setResult(null)
              setErrorState(null)
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-karnataka-red to-red-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <MapPin size={16} className="text-white" />
            </div>
            <div>
              <span className="font-black text-karnataka-dark dark:text-white text-lg tracking-tight">
                {t('brandName').split(' ')[0]} <span className="text-karnataka-red">{t('brandName').split(' ')[1] || 'AI'}</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] text-stone-500 dark:text-stone-400 font-bold ml-2 pl-2 border-l border-stone-300 dark:border-stone-700">
                {t('brandTagline')}
              </span>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* My Trips Button */}
            <button
              type="button"
              onClick={() => setIsMyTripsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs transition-all"
            >
              <Bookmark size={13} className="text-karnataka-red" />
              <span>{t('navMyTrips')}</span>
            </button>

            {/* Destinations Explorer Button */}
            <button
              type="button"
              onClick={() => setIsDestinationsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs transition-all"
            >
              <Compass size={14} className="text-karnataka-gold" />
              <span>{t('navDestinations')}</span>
            </button>

            {/* Phrasebook Button */}
            <button
              type="button"
              onClick={() => setIsPhrasebookOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs transition-all"
            >
              <BookOpen size={14} className="text-karnataka-red" />
              <span>{t('navPhrasebook')}</span>
            </button>

            {/* Travel Journal & Wishlist Button */}
            <button
              type="button"
              onClick={() => setIsJournalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-950 dark:text-amber-100 hover:text-stone-900 bg-amber-100/70 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 shadow-2xs transition-all active:scale-95"
              title="Travel Journal & Wishlist"
            >
              <BookOpen size={13} className="text-amber-700 dark:text-amber-300" />
              <span>{language === 'kn' ? 'ಪ್ರವಾಸ ಡೈರಿ' : 'Journal'}</span>
            </button>

            {/* Kannada Sign & Text Scanner Button */}
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-900 dark:text-amber-200 hover:text-amber-950 dark:hover:text-white bg-amber-500/10 dark:bg-amber-400/20 border border-amber-500/30 hover:border-amber-500/50 shadow-2xs transition-all active:scale-95"
              title="Scan Kannada sign or menu"
            >
              <Camera size={13} className="text-amber-600 dark:text-amber-400" />
              <span>{t('navScanner')}</span>
            </button>

            {/* PWA Install Button */}
            <PwaInstallButton />

            {/* Feedback Button */}
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs transition-all"
              title="Give Feedback"
            >
              <MessageSquare size={13} className="text-amber-500" />
              <span>{t('feedbackBtn')}</span>
            </button>

            {/* Language Switcher */}
            <LanguageToggle />

            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Google Authentication Button / Avatar */}
            {user ? (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-stone-200 dark:border-stone-700">
                <img
                  src={user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt={user.user_metadata?.full_name || 'Traveler'}
                  className="w-7 h-7 rounded-full object-cover border border-stone-300 dark:border-stone-600 shadow-2xs"
                  title={user.user_metadata?.full_name || user.email}
                />
                <button
                  type="button"
                  onClick={signOut}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  title={t('logout')}
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs transition-all"
                title={t('loginWithGoogle')}
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="hidden sm:inline">{t('loginWithGoogle')}</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Hero Section: Rendered when on Landing Page */}
      {!result && !isLoading && (
        <section className="relative overflow-hidden bg-stone-950 text-white py-20 sm:py-28 px-4">
          {/* Vivid Karnataka Panorama Layer */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-45 scale-105 filter contrast-110 saturate-125"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1920&q=85')`
              }}
            />
            <div
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-cover bg-center opacity-30 mix-blend-screen"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80')`
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center opacity-30 mix-blend-screen"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/40" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-karnataka-gold px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-xs">
              <Sparkles size={13} className="text-karnataka-gold animate-pulse" />
              <span>{t('heroBadge')}</span>
            </div>

            {/* Grand Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-md">
              <span>{t('heroTitlePrefix')} </span>
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                {t('heroTitleAccent')}
              </span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-normal">
              {t('heroSubtitle')}
            </p>

            {/* Quick Stat Badges */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-stone-200">
              <span className="bg-black/50 border border-white/15 px-3 py-1 rounded-full">🏛️ {t('statMonuments')}</span>
              <span className="bg-black/50 border border-white/15 px-3 py-1 rounded-full">📍 {t('statDistricts')}</span>
              <span className="bg-black/50 border border-white/15 px-3 py-1 rounded-full">🌊 {t('statCoastline')}</span>
              <span className="bg-black/50 border border-white/15 px-3 py-1 rounded-full">🗺️ {t('statFreeOpen')}</span>
            </div>

            {/* Hero Action CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => plannerFormRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-karnataka-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                <span>{t('planMyTripCta')}</span>
                <ArrowDown size={15} />
              </button>

              <button
                type="button"
                onClick={() => handleLoadCurated('hampi-3-day')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold px-6 py-3.5 rounded-2xl transition-all text-sm"
              >
                <Compass size={15} className="text-karnataka-gold" />
                <span>{t('exploreInstantSample')} (3-Day Hampi)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500/20 to-red-500/20 hover:from-amber-500/30 hover:to-red-500/30 backdrop-blur-md border border-amber-400/40 text-amber-200 hover:text-white font-bold px-6 py-3.5 rounded-2xl transition-all text-sm shadow-sm"
              >
                <Camera size={15} className="text-amber-300" />
                <span>{language === 'kn' ? '📷 ಕನ್ನಡ ಫಲಕ ಸ್ಕ್ಯಾನ್' : '📷 Scan Kannada Sign'}</span>
              </button>
            </div>

            {/* Destination Chips */}
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto pt-2">
              {HERO_PLACES.map(p => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleSelectDestination(p.name)}
                  className="bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white transition-all shadow-sm hover:scale-105"
                  title={`Plan trip to ${p.name}`}
                >
                  📍 {language === 'kn' ? p.kn : p.name}
                </button>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main
        ref={plannerFormRef}
        className={`flex-1 mx-auto px-4 py-8 sm:py-12 transition-all duration-300 w-full ${result ? 'max-w-7xl' : 'max-w-6xl'}`}
      >
        {isLoading ? (
          <ItinerarySkeleton
            startingPoint={loadingForm?.starting_point}
            days={loadingForm?.days}
          />
        ) : errorState ? (
          <FriendlyErrorState
            errorMessage={errorState}
            onRetry={() => {
              setErrorState(null)
              plannerFormRef.current?.scrollIntoView({ behavior: 'smooth' })
            }}
            onSelectSample={(sampleId) => handleLoadCurated(sampleId)}
          />
        ) : result ? (
          <ItineraryResult
            data={result}
            onReset={() => {
              setResult(null)
              setErrorState(null)
            }}
            onOpenPhrasebook={() => setIsPhrasebookOpen(true)}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        ) : (
          /* Landing Page Layout (Sample Itineraries + Why Yatra AI + Plan Your Trip Form) */
          <div className="space-y-16">
            
            {/* 1. Featured Sample Itineraries Section (Requirement 30 & 28) */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 text-karnataka-red text-xs font-bold uppercase tracking-widest">
                  <Flame size={14} />
                  <span>{t('exampleItinerariesTitle')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                  {language === 'kn' ? 'ಜನಪ್ರಿಯ ೧-ಕ್ಲಿಕ್ ಪ್ರವಾಸ ಮಾರ್ಗಗಳು' : 'Hand-Crafted Karnataka Routes'}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                  {t('exampleItinerariesSubtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Sample Card 1: Hampi */}
                <div className="card bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80"
                        alt="Hampi"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-karnataka-gold text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-karnataka-gold/30">
                        3 Days • Heritage Circuit
                      </span>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-lg font-black leading-tight">Hampi & Vijayanagara Empire</h3>
                        <p className="text-[11px] text-stone-300">Stone Chariot, Coracle River Crossing, Boulders</p>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                        Climb Matanga hill at golden hour, glide on circular coracle boats across Tungabhadra, and savor authentic North Karnataka Jolada Rotti.
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
                        <span>🏛️ Vittala Chariot</span>
                        <span>•</span>
                        <span>⛵ Coracle Ride</span>
                        <span>•</span>
                        <span>🌅 Anjanadri</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoadCurated('hampi-3-day')}
                      className="py-2.5 px-3 rounded-xl bg-karnataka-red hover:bg-red-700 text-white text-xs font-bold transition-colors text-center shadow-xs"
                    >
                      {t('viewInstantItinerary')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCustomizeCurated('hampi-3-day')}
                      className="py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold transition-colors text-center"
                    >
                      {t('customizeItinerary')}
                    </button>
                  </div>
                </div>

                {/* Sample Card 2: Bengaluru Weekend to Coorg */}
                <div className="card bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                        alt="Coorg"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                        2 Days • Coffee & Ghats
                      </span>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-lg font-black leading-tight">Weekend Trip from Bengaluru</h3>
                        <p className="text-[11px] text-stone-300">Bylakuppe Golden Temple, Abbey Falls, Coorg</p>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                        Escape the city into misty coffee estates, hear Buddhist monks chanting at Namdroling Monastery, and taste authentic Kodava Pandi curry.
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
                        <span>☕ Arabica Plantations</span>
                        <span>•</span>
                        <span>🌊 Abbey Falls</span>
                        <span>•</span>
                        <span>🍽️ Pandi Curry</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoadCurated('bengaluru-weekend')}
                      className="py-2.5 px-3 rounded-xl bg-karnataka-red hover:bg-red-700 text-white text-xs font-bold transition-colors text-center shadow-xs"
                    >
                      {t('viewInstantItinerary')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCustomizeCurated('bengaluru-weekend')}
                      className="py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold transition-colors text-center"
                    >
                      {t('customizeItinerary')}
                    </button>
                  </div>
                </div>

                {/* Sample Card 3: Coastal Karnataka */}
                <div className="card bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80"
                        alt="Gokarna"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-sky-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-sky-400/30">
                        3 Days • Coastal Trail
                      </span>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-lg font-black leading-tight">Gokarna & Coastal Trail</h3>
                        <p className="text-[11px] text-stone-300">Om Beach, Murudeshwar Colossus, Udupi</p>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                        Trek Om Beach cliff trails, witness the 123-foot oceanfront Shiva colossus, and relish Mangalorean Anjal fish fry and Udupi Mattu Gulla sambar.
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
                        <span>🏖️ Om Beach</span>
                        <span>•</span>
                        <span>🔱 Murudeshwar</span>
                        <span>•</span>
                        <span>🐟 Anjal Fry</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoadCurated('coastal-karnataka')}
                      className="py-2.5 px-3 rounded-xl bg-karnataka-red hover:bg-red-700 text-white text-xs font-bold transition-colors text-center shadow-xs"
                    >
                      {t('viewInstantItinerary')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCustomizeCurated('coastal-karnataka')}
                      className="py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold transition-colors text-center"
                    >
                      {t('customizeItinerary')}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. "Why Yatra AI?" Feature Pillars (Requirement 30) */}
            <div className="py-6 border-y border-stone-200/80 dark:border-stone-800 space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-karnataka-gold">
                  {language === 'kn' ? 'ಸ್ಥಳೀಯ ವೈಶಿಷ್ಟ್ಯಗಳು' : 'The Local Edge'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                  {t('whyYatraAiTitle')}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {t('whyYatraAiSubtitle')}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-5 rounded-2xl space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-karnataka-red">
                    <BookOpen size={18} />
                  </div>
                  <h4 className="text-sm font-black text-stone-900 dark:text-white">{t('whyPhrasebookTitle')}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-normal">{t('whyPhrasebookDesc')}</p>
                </div>

                <div className="card bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-5 rounded-2xl space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
                    <CloudSun size={18} />
                  </div>
                  <h4 className="text-sm font-black text-stone-900 dark:text-white">{t('whyMonsoonTitle')}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-normal">{t('whyMonsoonDesc')}</p>
                </div>

                <div className="card bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-5 rounded-2xl space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-karnataka-green">
                    <Utensils size={18} />
                  </div>
                  <h4 className="text-sm font-black text-stone-900 dark:text-white">{t('whyFoodTitle')}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-normal">{t('whyFoodDesc')}</p>
                </div>

                <div className="card bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-5 rounded-2xl space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                    <Compass size={18} />
                  </div>
                  <h4 className="text-sm font-black text-stone-900 dark:text-white">{t('whyLogisticsTitle')}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-normal">{t('whyLogisticsDesc')}</p>
                </div>
              </div>
            </div>

            {/* 3. Central Interactive "Plan Your Custom Trip" Form Section */}
            <div className="relative py-4 sm:py-8">
              
              {/* Cartographic Curves (Desktop only) */}
              <div className="hidden xl:block absolute inset-0 pointer-events-none select-none z-0 overflow-visible">
                <svg className="w-full h-full" viewBox="0 0 1150 780" fill="none">
                  <path
                    d="M 170 140 C 340 70, 780 70, 960 140"
                    stroke="#F5A623"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                  <path
                    d="M 170 210 C 130 350, 140 460, 180 570"
                    stroke="#1A7A4A"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                  <path
                    d="M 230 630 C 440 720, 720 720, 920 630"
                    stroke="#F5A623"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                  <circle cx="170" cy="140" r="5" fill="#C8102E" stroke="#FAF6F0" strokeWidth="2" />
                  <circle cx="180" cy="570" r="5" fill="#1A7A4A" stroke="#FAF6F0" strokeWidth="2" />
                  <circle cx="960" cy="140" r="5" fill="#F5A623" stroke="#FAF6F0" strokeWidth="2" />
                </svg>
              </div>

              {/* Margin Landmark Photo Cards (Desktop Only) */}
              <div className="hidden xl:flex flex-col absolute -left-12 2xl:-left-20 top-4 z-10 w-64 p-3 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200/90 dark:border-stone-800 transform -rotate-3 hover:-rotate-1 animate-float transition-transform duration-300 group cursor-default">
                <div className="w-full h-36 rounded-xl overflow-hidden mb-2.5 relative bg-stone-100 dark:bg-stone-800">
                  <img
                    src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80"
                    alt="Hampi Ruins"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    UNESCO Heritage
                  </span>
                </div>
                <div className="px-1">
                  <h4 className="text-xs font-black text-stone-900 dark:text-white tracking-tight">Hampi (ಹಂಪಿ)</h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium leading-snug">
                    Vijayanagara Capital & Stone Chariot
                  </p>
                </div>
              </div>

              <div className="hidden xl:flex flex-col absolute -right-12 2xl:-right-20 bottom-8 z-10 w-64 p-3 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200/90 dark:border-stone-800 transform -rotate-2 hover:rotate-0 animate-float transition-transform duration-300 group cursor-default">
                <div className="w-full h-36 rounded-xl overflow-hidden mb-2.5 relative bg-stone-100 dark:bg-stone-800">
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
                  <h4 className="text-xs font-black text-stone-900 dark:text-white tracking-tight">Bengaluru (ಬೆಂಗಳೂರು)</h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium leading-snug">
                    Bustling Capital & Bangalore Palace
                  </p>
                </div>
              </div>

              {/* Central Interactive "Plan Your Trip" Card */}
              <div className="relative z-20 max-w-2xl mx-auto bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-3xl shadow-xl border border-stone-200/80 dark:border-stone-800 p-6 sm:p-10">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-karnataka-red text-xs font-bold uppercase tracking-wider mb-1">
                    <Compass size={14} /> {t('architectBadge')}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-karnataka-dark dark:text-white tracking-tight">
                    {t('formTitle')}
                  </h2>
                  <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1">
                    {t('formSubtitle')}
                  </p>
                </div>

                <ItineraryForm
                  onStartLoading={(formData) => {
                    setIsLoading(true)
                    setLoadingForm(formData)
                    setErrorState(null)
                  }}
                  onResult={(data) => {
                    setResult(data)
                    setIsLoading(false)
                    setErrorState(null)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  onError={(errMsg) => {
                    setIsLoading(false)
                    setErrorState(errMsg)
                  }}
                  prefillDestination={prefillDestination}
                />
              </div>

            </div>

          </div>
        )}
      </main>

      {/* Destinations Modal */}
      <DestinationsModal
        isOpen={isDestinationsOpen}
        onClose={() => setIsDestinationsOpen(false)}
        onSelectDestination={handleSelectDestination}
      />

      {/* Phrasebook Modal */}
      <PhrasebookModal
        isOpen={isPhrasebookOpen}
        onClose={() => setIsPhrasebookOpen(false)}
      />

      {/* Kannada Sign & Text Scanner Modal */}
      <KannadaScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      {/* My Trips Modal */}
      <MyTripsModal
        isOpen={isMyTripsOpen}
        onClose={() => setIsMyTripsOpen(false)}
        onLoadTrip={(trip) => {
          setResult(trip)
          setErrorState(null)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />

      {/* Travel Journal & Wishlist Modal */}
      <TravelJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        onSelectDestination={handleSelectDestination}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* PWA Offline Indicator */}
      <OfflineIndicator
        onOpenMyTrips={() => setIsMyTripsOpen(true)}
        onOpenPhrasebook={() => setIsPhrasebookOpen(true)}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200/80 dark:border-stone-800 py-10 px-4 text-center text-xs text-stone-500 dark:text-stone-400 bg-[#FAF6F0] dark:bg-stone-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-bold text-stone-700 dark:text-stone-200 text-sm">
            {t('brandName')} — {t('brandTagline')}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] text-stone-400 dark:text-stone-500 font-medium">
            <span>Western Ghats Routes</span>
            <span>•</span>
            <span>Heritage Circuits</span>
            <span>•</span>
            <span>Monsoon Intelligence</span>
            <span>•</span>
            <span>Coastal Trails</span>
            <span>•</span>
            <span>ಸ್ಥಳೀಯ ಆಹಾರ ಪಥ</span>
            <span>•</span>
            <span>ಕನ್ನಡ ನುಡಿಗಟ್ಟು</span>
            <span>•</span>
            <span>PWA Offline-Ready</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
