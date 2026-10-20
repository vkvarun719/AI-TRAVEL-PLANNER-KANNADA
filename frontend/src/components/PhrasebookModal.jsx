import { useState, useEffect } from 'react'
import {
  Volume2, VolumeX, Search, X, Check, Copy, Sparkles, Languages,
  Compass, AlertCircle, Play
} from 'lucide-react'
import toast from 'react-hot-toast'
import { PHRASEBOOK_DATA } from '../data/phrasebookData'
import { speakPhrase, stopSpeaking } from '../utils/speechSynthesis'
import { useLanguage } from '../context/LanguageContext'

export default function PhrasebookModal({ isOpen, onClose }) {
  const { language, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [voiceNotice, setVoiceNotice] = useState(null)

  useEffect(() => {
    return () => {
      stopSpeaking()
    }
  }, [])

  if (!isOpen) return null

  const handlePlayAudio = (phrase) => {
    if (currentlyPlayingId === phrase.id) {
      stopSpeaking()
      setCurrentlyPlayingId(null)
      return
    }

    setCurrentlyPlayingId(phrase.id)
    speakPhrase(
      phrase.kannada,
      phrase.phonetic,
      ({ isNativeKannada }) => {
        if (!isNativeKannada && !voiceNotice) {
          setVoiceNotice(t('noVoiceWarning'))
          setTimeout(() => setVoiceNotice(null), 5000)
        }
      },
      () => {
        setCurrentlyPlayingId(null)
      },
      (err) => {
        console.error('Audio playback error', err)
        setCurrentlyPlayingId(null)
        toast.error('Unable to play audio in this browser')
      }
    )
  }

  const handleCopy = (phrase) => {
    const text = `${phrase.kannada} (${phrase.phonetic}) - ${phrase.english}`
    navigator.clipboard?.writeText?.(text)
    setCopiedId(phrase.id)
    toast.success(t('copied'))
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filtered = PHRASEBOOK_DATA.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category === selectedCat
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = !query ||
      p.english.toLowerCase().includes(query) ||
      p.kannada.toLowerCase().includes(query) ||
      p.phonetic.toLowerCase().includes(query)
    return matchesCat && matchesSearch
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#FAF6F0] rounded-3xl shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-stone-200/80 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-karnataka-red to-red-700 flex items-center justify-center text-white shadow-md">
              <Languages size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-karnataka-dark flex items-center gap-2">
                <span>{t('phrasebookTitle')}</span>
                <span className="text-xs bg-amber-500/10 text-amber-900 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  ನಮ್ಮ ಕನ್ನಡ
                </span>
              </h2>
              <p className="text-xs text-stone-500">{t('phrasebookSubtitle')}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopSpeaking()
              onClose()
            }}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Notice Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200/70 space-y-3">
          {voiceNotice && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle size={14} className="text-amber-600 flex-shrink-0" />
              <span>{voiceNotice}</span>
            </div>
          )}

          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('phrasebookSearchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-karnataka-red/20 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: t('allCategories') },
              { id: 'greetings', label: t('catGreetings') },
              { id: 'directions', label: t('catDirections') },
              { id: 'food', label: t('catFood') },
              { id: 'shopping', label: t('catShopping') },
              { id: 'emergency', label: t('catEmergency') },
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCat === cat.id
                    ? 'bg-karnataka-red text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Phrases List Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3">
          <div className="grid sm:grid-cols-2 gap-3.5">
            {filtered.map((phrase) => {
              const isPlaying = currentlyPlayingId === phrase.id
              const isCopied = copiedId === phrase.id

              return (
                <div
                  key={phrase.id}
                  className={`card p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isPlaying
                      ? 'border-karnataka-red bg-red-50/30 shadow-md ring-2 ring-karnataka-red/20'
                      : 'border-stone-200/80 bg-white hover:border-stone-300 shadow-xs'
                  }`}
                >
                  <div>
                    {/* English label */}
                    <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                      {phrase.english}
                    </div>

                    {/* Kannada text */}
                    <div className="text-xl font-black text-stone-900 font-sans tracking-tight mb-1">
                      {phrase.kannada}
                    </div>

                    {/* Phonetic Pronunciation */}
                    <div className="text-xs font-semibold text-karnataka-red italic mb-2">
                      🗣️ {phrase.phonetic}
                    </div>

                    {/* Context info */}
                    <p className="text-[11px] text-stone-500 leading-relaxed font-normal pt-1 border-t border-stone-100">
                      💡 {phrase.context}
                    </p>
                  </div>

                  {/* Audio Play & Copy Controls */}
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(phrase)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isPlaying
                          ? 'bg-karnataka-red text-white shadow-xs animate-pulse'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX size={13} />
                          <span>{t('playingAudio')}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={13} className="text-karnataka-red" />
                          <span>{t('playAudio')}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(phrase)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      title="Copy phrase"
                    >
                      {isCopied ? (
                        <Check size={14} className="text-karnataka-green font-bold" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>

                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-stone-400 text-xs">
              No matching phrases found. Try another keyword.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
