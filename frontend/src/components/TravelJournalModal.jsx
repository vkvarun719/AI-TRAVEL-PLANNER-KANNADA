import { useState } from 'react'
import {
  X, BookOpen, Calendar, MapPin, Heart, Plus, Trash2, Camera,
  Star, CheckCircle2, Clock, Sparkles, Image as ImageIcon,
  Compass, ArrowRight, Share2, Upload
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getJournalEntries, saveJournalEntry, deleteJournalEntry,
  getFavoriteDestinations, toggleFavoriteDestination
} from '../utils/tripStorage'
import { KARNATAKA_DESTINATIONS_DATA } from '../data/destinationsData'
import { useLanguage } from '../context/LanguageContext'

export default function TravelJournalModal({ isOpen, onClose, onSelectDestination }) {
  const { language, t } = useLanguage()
  const isKn = language === 'kn'

  const [activeTab, setActiveTab] = useState('timeline') // 'timeline' | 'wishlist'
  const [entries, setEntries] = useState(getJournalEntries())
  const [favoriteIds, setFavoriteIds] = useState(getFavoriteDestinations())
  const [isAdding, setIsAdding] = useState(false)

  // New entry form state
  const [newEntry, setNewEntry] = useState({
    placeName: '',
    visitDate: new Date().toISOString().split('T')[0],
    note: '',
    photoUrl: '',
    visited: true,
    rating: 5,
  })
  const [photoPreview, setPhotoPreview] = useState(null)

  if (!isOpen) return null

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error(isKn ? 'ಫೋಟೋ ಗಾತ್ರ 2MB ಗಿಂತ ಕಡಿಮೆಯಿರಬೇಕು' : 'Photo size should be under 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result
      setPhotoPreview(base64)
      setNewEntry(prev => ({ ...prev, photoUrl: base64 }))
    }
    reader.readAsDataURL(file)
  }

  const handleSaveEntry = (e) => {
    e.preventDefault()
    if (!newEntry.placeName.trim()) {
      toast.error(isKn ? 'ದಯವಿಟ್ಟು ಸ್ಥಳದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ' : 'Please enter place name')
      return
    }

    const saved = saveJournalEntry(newEntry)
    setEntries(getJournalEntries())
    setIsAdding(false)
    setNewEntry({
      placeName: '',
      visitDate: new Date().toISOString().split('T')[0],
      note: '',
      photoUrl: '',
      visited: true,
      rating: 5,
    })
    setPhotoPreview(null)
    toast.success(isKn ? 'ಪ್ರವಾಸದ ನೆನಪನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ! 📖' : 'Journal entry recorded! 📖')
  }

  const handleDeleteEntry = (id) => {
    deleteJournalEntry(id)
    setEntries(getJournalEntries())
    toast.success(isKn ? 'ದಾಖಲೆ ತೆಗೆದುಹಾಕಲಾಗಿದೆ' : 'Entry deleted')
  }

  const handleToggleFavorite = (destId) => {
    const updated = toggleFavoriteDestination(destId)
    setFavoriteIds(updated)
  }

  const handleJournalizeWishlist = (dest) => {
    const imgUrl = dest.heroImage || dest.image || ''
    setNewEntry({
      placeName: isKn ? dest.nameKn : dest.name,
      visitDate: new Date().toISOString().split('T')[0],
      note: `Dream destination from wishlist! ${dest.description || ''}`,
      photoUrl: imgUrl,
      visited: false,
      rating: 5,
    })
    setPhotoPreview(imgUrl)
    setActiveTab('timeline')
    setIsAdding(true)
  }

  // Get wishlisted destination objects
  const wishlistedDestinations = KARNATAKA_DESTINATIONS_DATA.filter(d => favoriteIds.includes(d.id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#FAF6F0] rounded-3xl shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-stone-200/80 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-stone-900">
                  {isKn ? 'ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಡೈರಿ & ಇಷ್ಟದ ತಾಣಗಳು' : 'Travel Journal & Wishlist'}
                </h2>
                <span className="text-[10px] bg-amber-500/10 text-amber-900 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  {entries.length} {isKn ? 'ನೆನಪುಗಳು' : 'Memories'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {isKn
                  ? 'ನಿಮ್ಮ ಕರ್ನಾಟಕ ಪ್ರವಾಸದ ನೆನಪುಗಳು, ಫೋಟೋಗಳು ಮತ್ತು ಇಷ್ಟದ ತಾಣಗಳ ಟೈಮ್‌ಲೈನ್'
                  : 'Record personal travel moments, photos, reflections, and dream destinations'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 sm:px-6 pt-3 bg-white border-b border-stone-200/70 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'timeline'
                  ? 'border-karnataka-red text-karnataka-red'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Clock size={14} />
              <span>{isKn ? 'ನೆನಪುಗಳ ಟೈಮ್‌ಲೈನ್' : 'Memory Timeline'} ({entries.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wishlist')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'wishlist'
                  ? 'border-karnataka-red text-karnataka-red'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Heart size={14} className={activeTab === 'wishlist' ? 'text-red-500 fill-red-500' : ''} />
              <span>{isKn ? 'ಇಷ್ಟದ ತಾಣಗಳು' : 'Wishlist Places'} ({wishlistedDestinations.length})</span>
            </button>
          </div>

          {activeTab === 'timeline' && (
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-2 rounded-xl bg-karnataka-red text-white text-xs font-bold shadow-xs hover:bg-red-700 transition-all active:scale-95"
            >
              <Plus size={14} />
              <span>{isKn ? 'ಹೊಸ ನೆನಪು ಸೇರಿಸಿ' : 'Add Memory'}</span>
            </button>
          )}
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">

          {/* Add New Memory Card Form */}
          {activeTab === 'timeline' && isAdding && (
            <form onSubmit={handleSaveEntry} className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-karnataka-red/30 shadow-md space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={14} className="text-karnataka-red" />
                  <span>{isKn ? 'ಹೊಸ ಪ್ರವಾಸ ನೆನಪು ದಾಖಲಿಸಿ' : 'Record New Travel Memory'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    {isKn ? 'ತಾಣದ ಹೆಸರು' : 'Place / Monument Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEntry.placeName}
                    onChange={e => setNewEntry(prev => ({ ...prev, placeName: e.target.value }))}
                    placeholder="e.g. Virupaksha Temple, Hampi"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-karnataka-red/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    {isKn ? 'ದಿನಾಂಕ' : 'Visit Date'}
                  </label>
                  <input
                    type="date"
                    value={newEntry.visitDate}
                    onChange={e => setNewEntry(prev => ({ ...prev, visitDate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-karnataka-red/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status & Rating */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEntry.visited}
                    onChange={e => setNewEntry(prev => ({ ...prev, visited: e.target.checked }))}
                    className="w-4 h-4 rounded text-karnataka-green accent-karnataka-green cursor-pointer"
                  />
                  <span className="text-xs font-bold text-stone-700">
                    {isKn ? 'ಈಗಾಗಲೇ ಭೇಟಿ ನೀಡಲಾಗಿದೆ' : 'I have visited this place'}
                  </span>
                </label>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-stone-500">{isKn ? 'ರೇಟಿಂಗ್:' : 'Rating:'}</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewEntry(prev => ({ ...prev, rating: star }))}
                      className="text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star size={16} className={star <= newEntry.rating ? 'fill-amber-400' : 'text-stone-300'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  {isKn ? 'ನಿಮ್ಮ ಅನುಭವ & ನೆನಪುಗಳು' : 'Personal Notes & Highlights'}
                </label>
                <textarea
                  rows={3}
                  value={newEntry.note}
                  onChange={e => setNewEntry(prev => ({ ...prev, note: e.target.value }))}
                  placeholder={isKn ? 'ಇಲ್ಲಿ ನಿಮ್ಮ ಪ್ರವಾಸದ ಅನುಭವ, ಸವಿದ ಆಹಾರ ಅಥವಾ ಸುಂದರ ಕ್ಷಣಗಳನ್ನು ಬರೆಯಿರಿ...' : 'What made this place special? Morning light, local food, friendly guide, sunset view...'}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-karnataka-red/20 focus:outline-none"
                />
              </div>

              {/* Photo Upload & Preview */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  {isKn ? 'ಫೋಟೋ ಲಗತ್ತಿಸಿ (ಸಾಧನದಿಂದ)' : 'Attach Photo (Saved Locally)'}
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-700 transition-colors">
                    <Upload size={14} className="text-stone-500" />
                    <span>{isKn ? 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್' : 'Choose Photo File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-stone-400">or paste image URL:</span>
                  <input
                    type="url"
                    value={photoPreview || ''}
                    onChange={e => {
                      setPhotoPreview(e.target.value)
                      setNewEntry(prev => ({ ...prev, photoUrl: e.target.value }))
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>

                {photoPreview && (
                  <div className="mt-2.5 relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200 shadow-2xs">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview(null)
                        setNewEntry(prev => ({ ...prev, photoUrl: '' }))
                      }}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 text-[9px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  {isKn ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-karnataka-green text-white text-xs font-black shadow-xs hover:bg-emerald-700"
                >
                  {isKn ? 'ನೆನಪು ಉಳಿಸಿ' : 'Save Memory'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 1: MEMORY TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {entries.length === 0 ? (
                <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200">
                  <BookOpen size={40} className="mx-auto text-stone-300 mb-2" />
                  <p className="text-sm font-bold text-stone-700">
                    {isKn ? 'ಯಾವುದೇ ನೆನಪುಗಳನ್ನು ಇನ್ನೂ ದಾಖಲಿಸಿಲ್ಲ' : 'No travel memories recorded yet'}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                    {isKn
                      ? 'ನಿಮ್ಮ ಮೊದಲ ಕರ್ನಾಟಕ ಪ್ರವಾಸದ ಅನುಭವವನ್ನು ದಾಖಲಿಸಲು "ಹೊಸ ನೆನಪು ಸೇರಿಸಿ" ಬಟನ್ ಒತ್ತಿ.'
                      : 'Capture sunrise views, coffee breaks, and temple visits across Karnataka.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-karnataka-red text-white text-xs font-bold shadow-xs hover:bg-red-700"
                  >
                    <Plus size={14} />
                    <span>{isKn ? 'ಮೊದಲ ನೆನಪು ದಾಖಲಿಸಿ' : 'Create First Memory'}</span>
                  </button>
                </div>
              ) : (
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
                  {entries.map((entry, idx) => (
                    <div key={entry.id || idx} className="relative group">
                      {/* Timeline Node Icon */}
                      <div className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-white ${
                        entry.visited ? 'bg-karnataka-green' : 'bg-amber-500'
                      }`}>
                        {entry.visited ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      </div>

                      {/* Memory Card */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition-all">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 flex items-center gap-1 font-mono">
                                <Calendar size={11} /> {entry.visitDate}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                entry.visited
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}>
                                {entry.visited ? (isKn ? 'ಭೇಟಿ ನೀಡಲಾಗಿದೆ' : 'Visited') : (isKn ? 'ಯೋಜನೆಯಲ್ಲಿದೆ' : 'Wishlist')}
                              </span>
                            </div>

                            <h4 className="text-base font-black text-stone-900 flex items-center gap-1.5">
                              <MapPin size={15} className="text-karnataka-red" />
                              <span>{entry.placeName}</span>
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Stars */}
                            <div className="flex items-center text-amber-400">
                              {[...Array(entry.rating || 5)].map((_, i) => (
                                <Star key={i} size={13} className="fill-amber-400" />
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="p-1.5 rounded-lg text-stone-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete entry"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Note */}
                        {entry.note && (
                          <p className="text-xs text-stone-600 leading-relaxed font-normal mt-2.5 pt-2.5 border-t border-stone-100 italic">
                            "{entry.note}"
                          </p>
                        )}

                        {/* Photo attachment */}
                        {entry.photoUrl && (
                          <div className="mt-3 overflow-hidden rounded-xl border border-stone-200 max-h-56">
                            <img
                              src={entry.photoUrl}
                              alt={entry.placeName}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST PLACES */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              {wishlistedDestinations.length === 0 ? (
                <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200">
                  <Heart size={40} className="mx-auto text-stone-300 mb-2" />
                  <p className="text-sm font-bold text-stone-700">
                    {isKn ? 'ಯಾವುದೇ ಇಷ್ಟದ ತಾಣಗಳನ್ನು ಉಳಿಸಿಲ್ಲ' : 'No destinations in your wishlist yet'}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                    {isKn
                      ? 'ಕರ್ನಾಟಕ ತಾಣಗಳ ಪಟ್ಟಿಯಲ್ಲಿ ❤️ ಐಕಾನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ನಿಮ್ಮ ಇಷ್ಟದ ಸ್ಥಳಗಳನ್ನು ಇಲ್ಲಿ ಸೇರಿಸಿ.'
                      : 'Explore Karnataka destinations and tap the heart icon on any card to save it to your bucket list!'}
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {wishlistedDestinations.map(dest => (
                    <div
                      key={dest.id}
                      className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-32 rounded-xl overflow-hidden mb-2.5">
                          <img
                            src={dest.heroImage || dest.image}
                            alt={dest.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <button
                            type="button"
                            onClick={() => handleToggleFavorite(dest.id)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-red-500 shadow-xs flex items-center justify-center"
                            title="Remove from wishlist"
                          >
                            <Heart size={16} className="fill-red-500" />
                          </button>
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                            {dest.region}
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-stone-900 leading-snug">
                          {isKn ? dest.nameKn : dest.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                          {dest.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleJournalizeWishlist(dest)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900"
                        >
                          <Plus size={12} />
                          <span>{isKn ? 'ಡೈರಿಗೆ ಸೇರಿಸಿ' : 'Add to Journal'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onClose()
                            onSelectDestination?.(dest.name)
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-karnataka-red hover:underline"
                        >
                          <span>{isKn ? 'ಪ್ರವಾಸ ರಚಿಸಿ' : 'Plan Trip'}</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
