import { useState, useEffect } from 'react'
import {
  Volume2, VolumeX, Search, X, Check, Copy, Sparkles, Languages,
  PhoneCall, ShieldAlert, Gauge, BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'
import { PHRASEBOOK_DATA, PHRASEBOOK_CATEGORIES } from '../data/phrasebookData'
import { speakPhrase, stopSpeaking } from '../utils/speechSynthesis'
import { useLanguage } from '../context/LanguageContext'

export default function PhrasebookModal({ isOpen, onClose }) {
  const { language, t } = useLanguage()
  const isKn = language === 'kn'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [speechRate, setSpeechRate] = useState(0.85) // default 0.85x, slow 0.65x
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
        toast.error(isKn ? 'ಆಡಿಯೋ ಪ್ಲೇ ಮಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ' : 'Unable to play audio in this browser')
      },
      speechRate
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
      p.phonetic.toLowerCase().includes(query) ||
      (p.context && p.context.toLowerCase().includes(query))
    return matchesCat && matchesSearch
  })

  // Category counts
  const categoryCounts = PHRASEBOOK_CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = cat.id === 'all'
      ? PHRASEBOOK_DATA.length
      : PHRASEBOOK_DATA.filter(p => p.category === cat.id).length
    return acc
  }, {})

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#FAF6F0] rounded-3xl shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-stone-200/80 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-karnataka-red to-red-700 flex items-center justify-center text-white shadow-md">
              <Languages size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-karnataka-dark">
                  {t('phrasebookTitle')}
                </h2>
                <span className="text-xs bg-amber-500/10 text-amber-900 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  ನಮ್ಮ ಕನ್ನಡ
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{t('phrasebookSubtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Toggle */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSpeechRate(0.85)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  speechRate === 0.85
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Normal speed"
              >
                1.0x
              </button>
              <button
                type="button"
                onClick={() => setSpeechRate(0.65)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  speechRate === 0.65
                    ? 'bg-white text-karnataka-red shadow-xs font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Slower speed for learners"
              >
                🐢 {isKn ? 'ನಿಧಾನ' : 'Slow'}
              </button>
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
        </div>

        {/* Search & Notice Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200/70 space-y-3">
          {voiceNotice && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-600 flex-shrink-0" />
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
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-karnataka-red/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {PHRASEBOOK_CATEGORIES.map(cat => {
              const label = isKn ? cat.labelKn : cat.labelEn
              const count = categoryCounts[cat.id] || 0
              const isSelected = selectedCat === cat.id

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-karnataka-red text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/80 hover:bg-stone-200/60'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Phrases List Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5">
          <div className="grid sm:grid-cols-2 gap-3.5">
            {filtered.map((phrase) => {
              const isPlaying = currentlyPlayingId === phrase.id
              const isCopied = copiedId === phrase.id
              const isEmergency = phrase.category === 'emergencies'

              return (
                <div
                  key={phrase.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isPlaying
                      ? 'border-karnataka-red bg-red-50/40 shadow-md ring-2 ring-karnataka-red/20'
                      : isEmergency
                        ? 'border-red-200/70 bg-gradient-to-br from-white to-red-50/20 hover:border-red-300 shadow-xs'
                        : 'border-stone-200/80 bg-white hover:border-stone-300 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Top Row: Category badge & English text */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                        {phrase.english}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isEmergency
                          ? 'bg-red-100 text-red-700'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {phrase.categoryKn}
                      </span>
                    </div>

                    {/* Kannada Script */}
                    <div className="text-xl sm:text-2xl font-black text-stone-900 font-sans tracking-tight mb-1.5">
                      {phrase.kannada}
                    </div>

                    {/* Phonetic Pronunciation */}
                    <div className="text-xs font-semibold text-karnataka-red italic flex items-center gap-1 mb-2.5">
                      <span>🗣️</span>
                      <span>{phrase.phonetic}</span>
                    </div>

                    {/* Context info */}
                    <p className="text-[11px] text-stone-500 leading-relaxed font-normal pt-2 border-t border-stone-100">
                      💡 {phrase.context}
                    </p>
                  </div>

                  {/* Audio Play & Copy Controls */}
                  <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(phrase)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isPlaying
                          ? 'bg-karnataka-red text-white shadow-xs animate-pulse ring-2 ring-red-300'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900 active:scale-95'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX size={14} />
                          <span>{t('playingAudio')}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={14} className="text-karnataka-red" />
                          <span>{t('playAudio')}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(phrase)}
                      className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
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
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200">
              <BookOpen size={36} className="mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-bold text-stone-700">
                {isKn ? 'ಯಾವುದೇ ನುಡಿಗಟ್ಟು ಕಂಡುಬಂದಿಲ್ಲ' : 'No matching phrases found'}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {isKn ? 'ದಯವಿಟ್ಟು ಬೇರೆ ಕೀವರ್ಡ್ ಹುಡುಕಿ' : 'Try searching with another word in English or Kannada'}
              </p>
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200/80 text-[11px] text-stone-500 flex items-center justify-between flex-wrap gap-2">
          <span>🎧 {isKn ? 'ಸ್ಥಳೀಯ ಉಚ್ಚಾರಣೆಗಾಗಿ ವೆಬ್ ಸ್ಪೀಚ್ ಧ್ವನಿ' : 'Powered by Web Speech API with fallback phonetics'}</span>
          <span>🚨 {isKn ? 'ತುರ್ತು ಸಹಾಯವಾಣಿ: ಆಂಬ್ಯುಲೆನ್ಸ್ 108 | ಪೊಲೀಸ್ 112' : 'Karnataka Hotlines: Ambulance 108 | Police 112'}</span>
        </div>

      </div>
    </div>
  )
}
