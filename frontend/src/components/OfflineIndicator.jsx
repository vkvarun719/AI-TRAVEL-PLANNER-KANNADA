import React, { useState, useEffect } from 'react'
import { WifiOff, Wifi, BookOpen, Bookmark, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function OfflineIndicator({ onOpenMyTrips, onOpenPhrasebook }) {
  const { language } = useLanguage()
  const isKn = language === 'kn'

  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true
  )
  const [showReconnected, setShowReconnected] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => {
      setIsOnline(true)
      setIsDismissed(false)
      setShowReconnected(true)
      const timer = setTimeout(() => setShowReconnected(false), 4000)
      return () => clearTimeout(timer)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowReconnected(false)
      setIsDismissed(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // If online and not showing reconnect toast, render nothing
  if (isOnline && !showReconnected) return null
  if (!isOnline && isDismissed) return null

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-md animate-in slide-in-from-bottom-3 duration-300 pointer-events-auto"
    >
      {/* 1. Offline Banner */}
      {!isOnline && (
        <div className="bg-stone-900/95 dark:bg-stone-800/95 text-white backdrop-blur-md border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <WifiOff size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>{isKn ? 'ಆಫ್‌ಲೈನ್ ಮೋಡ್' : 'Offline Mode'}</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                </h4>
                <p className="text-xs text-stone-300 mt-0.5 leading-snug">
                  {isKn
                    ? 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲ. ಸಂಗ್ರಹಿಸಿದ ಪ್ರವಾಸಗಳು ಮತ್ತು ನುಡಿಗಟ್ಟು ಲಭ್ಯವಿದೆ.'
                    : 'No internet connection. Saved trips & Kannada phrasebook remain fully accessible.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Dismiss offline banner"
            >
              <X size={14} />
            </button>
          </div>

          {/* Quick Offline Actions */}
          <div className="flex items-center gap-2 pt-1 border-t border-stone-800">
            {onOpenMyTrips && (
              <button
                type="button"
                onClick={onOpenMyTrips}
                className="flex-1 py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <Bookmark size={12} className="text-karnataka-gold" />
                <span>{isKn ? 'ನನ್ನ ಪ್ರವಾಸಗಳು' : 'My Saved Trips'}</span>
              </button>
            )}

            {onOpenPhrasebook && (
              <button
                type="button"
                onClick={onOpenPhrasebook}
                className="flex-1 py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen size={12} className="text-karnataka-red" />
                <span>{isKn ? 'ಕನ್ನಡ ನುಡಿಗಟ್ಟು' : 'Phrasebook'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Reconnected Toast */}
      {isOnline && showReconnected && (
        <div className="bg-emerald-900/95 text-white backdrop-blur-md border border-emerald-500/50 rounded-2xl p-3 shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Wifi size={15} />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-200">
                {isKn ? 'ಮತ್ತೆ ಆನ್‌ಲೈನ್ ಸಂಪರ್ಕ ಸಿಕ್ಕಿದೆ! 🟢' : 'Back Online! 🟢'}
              </p>
              <p className="text-[11px] text-emerald-300/80">
                {isKn ? 'ಎಲ್ಲಾ AI ಸೇವೆಗಳು ಸಕ್ರಿಯವಾಗಿವೆ' : 'Live AI generator & maps are reconnected.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowReconnected(false)}
            className="text-emerald-300 hover:text-white p-1"
          >
            <X size={13} />
          </button>
        </div>
      )}
    </aside>
  )
}
