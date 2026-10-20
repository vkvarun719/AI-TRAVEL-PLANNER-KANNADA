import { useState, useEffect } from 'react'
import {
  Bookmark, MapPin, Calendar, Trash2, Edit2, Check,
  Share2, ExternalLink, X, ArrowRight, Sparkles, IndianRupee
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getSavedTrips, renameTrip, deleteTrip, generateShareableUrl } from '../utils/tripStorage'
import { useLanguage } from '../context/LanguageContext'

export default function MyTripsModal({ isOpen, onClose, onLoadTrip }) {
  const { language } = useLanguage()
  const [trips, setTrips] = useState([])
  const [editingTripId, setEditingTripId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    if (isOpen) {
      setTrips(getSavedTrips())
      setEditingTripId(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleStartRename = (trip) => {
    setEditingTripId(trip.id)
    setEditTitle(trip.title || `${trip.days}-Day ${trip.starting_point} Trip`)
  }

  const handleSaveRename = (tripId) => {
    if (editTitle.trim()) {
      renameTrip(tripId, editTitle.trim())
      setTrips(getSavedTrips())
      toast.success('Trip renamed successfully!')
    }
    setEditingTripId(null)
  }

  const handleDelete = (tripId) => {
    const updated = deleteTrip(tripId)
    setTrips(updated)
    toast.success('Trip deleted from your saved list.')
  }

  const handleShare = async (trip) => {
    const shareUrl = generateShareableUrl(trip)
    if (navigator.share) {
      try {
        await navigator.share({
          title: trip.title,
          text: `Check out my ${trip.days}-day Karnataka itinerary:`,
          url: shareUrl,
        })
        return
      } catch {
        // Fall back to copy
      }
    }
    navigator.clipboard?.writeText?.(shareUrl)
    toast.success('Shareable trip link copied to clipboard! 🔗')
  }

  const handleOpenTrip = (trip) => {
    onLoadTrip(trip)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#FAF6F0] dark:bg-stone-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] flex flex-col overflow-hidden transition-colors">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white dark:bg-stone-900 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-karnataka-red to-red-700 flex items-center justify-center text-white shadow-md">
              <Bookmark size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-karnataka-dark dark:text-white flex items-center gap-2">
                <span>{language === 'kn' ? 'ನನ್ನ ಪ್ರವಾಸಗಳು' : 'My Saved Trips'}</span>
                <span className="text-xs bg-red-100 dark:bg-red-950/60 text-karnataka-red px-2.5 py-0.5 rounded-full font-bold">
                  {trips.length} Saved
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Access, rename, share, or edit your saved Karnataka itineraries
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Trips List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {trips.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {trips.map((trip) => {
                const isEditing = editingTripId === trip.id

                return (
                  <div
                    key={trip.id}
                    className="card p-4 bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Title & Edit */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-karnataka-red bg-stone-50 dark:bg-stone-800 dark:text-white focus:outline-none w-full"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveRename(trip.id)}
                              className="p-1 rounded-md bg-karnataka-green text-white hover:bg-emerald-700"
                            >
                              <Check size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-1 flex-1">
                            <h4 className="text-sm font-black text-stone-900 dark:text-white leading-snug line-clamp-1">
                              {trip.title || `${trip.days}-Day ${trip.starting_point} Trip`}
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleStartRename(trip)}
                              className="text-stone-300 hover:text-stone-600 transition-colors p-0.5"
                              title="Rename trip"
                            >
                              <Edit2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-600 mb-3">
                        <span className="flex items-center gap-1 font-semibold">
                          <MapPin size={11} className="text-karnataka-red" />
                          <span>{trip.starting_point}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-karnataka-green" />
                          <span>{trip.days} Days</span>
                        </span>
                        <span>•</span>
                        <span className="capitalize px-2 py-0.2 rounded-md bg-stone-100 text-[10px] font-bold">
                          {trip.budget}
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed mb-3">
                        {trip.summary || 'Custom Karnataka itinerary.'}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleShare(trip)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                          title="Share trip link"
                        >
                          <Share2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(trip.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete trip"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenTrip(trip)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all shadow-2xs"
                      >
                        <span>View Trip</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Bookmark size={24} />
              </div>
              <h4 className="text-sm font-bold text-stone-700">No saved trips yet</h4>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Generate an itinerary and click "Save Trip" to bookmark your favorite itineraries here.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
