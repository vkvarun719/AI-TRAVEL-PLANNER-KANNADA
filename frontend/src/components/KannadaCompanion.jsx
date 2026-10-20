import { useState } from 'react'
import {
  Languages,
  Sparkles,
  Volume2,
  VolumeX,
  Check,
  Copy,
  ExternalLink,
  BookOpen,
  Camera
} from 'lucide-react'
import toast from 'react-hot-toast'
import { speakPhrase, stopSpeaking } from '../utils/speechSynthesis'
import { useLanguage } from '../context/LanguageContext'

const PHRASES = [
  {
    english: 'Hello / Greetings',
    kannada: 'ನಮಸ್ಕಾರ',
    phonetic: 'Namaskāra',
    context: 'Standard respectful greeting for everyone.'
  },
  {
    english: 'How much does this cost?',
    kannada: 'ಇದು ಎಷ್ಟು?',
    phonetic: 'Idu eshtu?',
    context: 'Crucial for bazaars, auto rickshaws & street food.'
  },
  {
    english: 'Thank you very much',
    kannada: 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು',
    phonetic: 'Thumbā dhanyavādagalu',
    context: 'Expressing genuine gratitude to hosts or drivers.'
  },
  {
    english: 'Is this road good / open?',
    kannada: 'ಈ ರಸ್ತೆ ಚೆನ್ನಾಗಿದೆಯಾ?',
    phonetic: 'Ee raste channāgideyā?',
    context: 'Lifesaver in Western Ghats & monsoon detours.'
  },
  {
    english: 'Where is the restaurant?',
    kannada: 'ಹೋಟೆಲ್ / ಊಟ ಎಲ್ಲಿ ಸಿಗುತ್ತೆ?',
    phonetic: 'Hotel / Oota elli siguththe?',
    context: 'Find genuine local military hotels & mess.'
  },
  {
    english: 'Very delicious / super!',
    kannada: 'ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ!',
    phonetic: 'Thumbā channāgide!',
    context: 'Praise local dosas, filter coffee & pandi curry.'
  }
]

const CULTURAL_ETIQUETTE = [
  {
    title: 'Temple Decorum',
    titleKn: 'ದೇವಾಲಯದ ಪದ್ಧತಿ',
    tip: 'Remove footwear before inner prakara. Most Hoysala & Coastal temples require modest attire covering shoulders and knees.',
    tipKn: 'ದೇವಾಲಯದ ಪ್ರಾಕಾರ ಪ್ರವೇಶಿಸುವ ಮುನ್ನ ಪಾದರಕ್ಷೆ ಕಳಚಿ. ಭುಜ ಮತ್ತು ಮೊಣಕಾಲು ಮುಚ್ಚುವಂತಹ ಸಾಂಪ್ರದಾಯಿಕ ಉಡುಪು ಧರಿಸಿ.'
  },
  {
    title: 'Western Ghats Leech Precaution',
    titleKn: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಜಿಗಣೆ ಮುನ್ನೆಚ್ಚರಿಕೆ',
    tip: 'If trekking or riding near Agumbe, Sakleshpur or Kudremukh during rain, carry salt or tobacco powder and leech socks.',
    tipKn: 'ಮಳೆಗಾಲದಲ್ಲಿ ಆಗುಂಬೆ, ಸಕಲೇಶಪುರ ಅಥವಾ ಕುದುರೆಮುಖ ಚಾರಣ ಮಾಡುವಾಗ ಉಪ್ಪು, ತಂಬಾಕು ಅಥವಾ ಜಿಗಣೆ ಸಾಕ್ಸ್ ಕೊಂಡೊಯ್ಯಿರಿ.'
  },
  {
    title: 'Bandipur Night Ban',
    titleKn: 'ಬಂಡೀಪುರ ರಾತ್ರಿ ಸಂಚಾರ ನಿಷೇಧ',
    tip: 'Vehicular movement through Bandipur & Nagarhole forest gates is barred strictly between 9:00 PM and 6:00 AM.',
    tipKn: 'ಬಂಡೀಪುರ ಮತ್ತು ನಾಗರಹೊಳೆ ಅರಣ್ಯ ಮಾರ್ಗದಲ್ಲಿ ರಾತ್ರಿ 9 ರಿಂದ ಬೆಳಗ್ಗೆ 6 ರವರೆಗೆ ವಾಹನ ಸಂಚಾರವನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ.'
  },
  {
    title: 'Filter Coffee Ritual',
    titleKn: 'ಫಿಲ್ಟರ್ ಕಾಫಿ ಸವಿಯುವ ವಿಧಾನ',
    tip: 'Never stir traditional Udupi dabarah set with a spoon; pour back and forth between cup and dabarah to cool and froth.',
    tipKn: 'ಉಡುಪಿ ಶೈಲಿಯ ಲೋಟ-ಡಬರಾ ಕಾಫಿಯನ್ನು ಚಮಚದಿಂದ ಕಲಕದೆ, ಲೋಟದಿಂದ ಡಬರಾಗೆ ಮೇಲಕ್ಕೆ ಹೊಯ್ದು ನೊರೆ ಬರಿಸಿ ಸವಿಯಿರಿ.'
  }
]

export default function KannadaCompanion({ onOpenFullPhrasebook, onOpenScanner }) {
  const { language, t } = useLanguage()
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [playingIdx, setPlayingIdx] = useState(null)

  const handlePlayAudio = (item, idx) => {
    if (playingIdx === idx) {
      stopSpeaking()
      setPlayingIdx(null)
      return
    }

    setPlayingIdx(idx)
    speakPhrase(
      item.kannada,
      item.phonetic,
      () => {},
      () => setPlayingIdx(null),
      () => {
        setPlayingIdx(null)
        toast.error('Unable to play audio on this device')
      }
    )
  }

  const copyPhrase = (item, idx) => {
    const text = `${item.phonetic} (${item.kannada}) - ${item.english}`
    navigator.clipboard?.writeText?.(text)
    setCopiedIdx(idx)
    toast.success(t('copied'))
    setTimeout(() => setCopiedIdx(null), 1800)
  }

  return (
    <div className="card border border-stone-200/90 bg-gradient-to-br from-amber-50/50 via-white to-red-50/40 p-6 rounded-2xl shadow-sm mt-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-karnataka-red text-white flex items-center justify-center shadow-xs">
            <Languages size={17} />
          </div>
          <div>
            <h3 className="text-base font-black text-karnataka-dark flex items-center gap-1.5">
              <span>{language === 'kn' ? 'ಸ್ಥಳೀಯ ಕನ್ನಡ ಒಡನಾಡಿ' : 'Local Kannada Companion'}</span>
              <span className="text-xs bg-karnataka-gold/20 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                ನಮ್ಮ ಕನ್ನಡ
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              {language === 'kn'
                ? 'ಪ್ರಯಾಣದಲ್ಲಿ ಬಳಸುವ ಅಗತ್ಯ ವಾಕ್ಯಗಳು ಮತ್ತು ನೈಜ ಆಡಿಯೋ ಉಚ್ಚಾರಣೆ'
                : 'Essential conversational phrases with spoken audio pronunciation & local customs'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-xs font-bold text-amber-900 hover:bg-amber-100 shadow-2xs transition-colors"
            >
              <Camera size={13} className="text-amber-600" />
              <span>{language === 'kn' ? 'ಫಲಕ ಸ್ಕ್ಯಾನರ್' : 'Sign Scanner'}</span>
            </button>
          )}

          {onOpenFullPhrasebook && (
            <button
              type="button"
              onClick={onOpenFullPhrasebook}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-karnataka-red hover:bg-stone-50 shadow-2xs transition-colors"
            >
              <BookOpen size={13} />
              <span>{language === 'kn' ? 'ಸಂಪೂರ್ಣ ನುಡಿಗಟ್ಟು' : 'Full Phrasebook'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Phrasebook Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {PHRASES.map((item, idx) => {
          const isPlaying = playingIdx === idx

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all duration-200 shadow-xs flex flex-col justify-between ${
                isPlaying
                  ? 'border-karnataka-red bg-red-50/30 ring-2 ring-karnataka-red/20'
                  : 'border-stone-200/80 bg-white hover:border-karnataka-gold'
              }`}
            >
              <div>
                <div className="text-[11px] font-semibold text-stone-400 mb-0.5">{item.english}</div>
                <div className="text-base font-bold text-stone-900 mb-0.5 font-sans">{item.kannada}</div>
                <div className="text-xs font-semibold text-karnataka-red italic">{item.phonetic}</div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-400 leading-tight pr-2">{item.context}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(item, idx)}
                    title="Listen pronunciation"
                    className={`p-1.5 rounded-md transition-colors ${
                      isPlaying
                        ? 'bg-karnataka-red text-white animate-pulse'
                        : 'text-karnataka-red hover:bg-red-50'
                    }`}
                  >
                    {isPlaying ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyPhrase(item, idx)}
                    title="Copy phrase"
                    className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    {copiedIdx === idx ? (
                      <Check size={13} className="text-karnataka-green font-bold" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cultural Etiquette Tips */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-karnataka-gold" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            {language === 'kn' ? 'ಸ್ಥಳೀಯ ಸಂಪ್ರದಾಯಗಳು ಮತ್ತು ಪ್ರಯಾಣದ ಎಚ್ಚರಿಕೆಗಳು' : 'Hyper-Local Etiquette & Travel Insights'}
          </h4>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {CULTURAL_ETIQUETTE.map((et, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/60 text-xs text-stone-700 leading-relaxed"
            >
              <div className="font-bold text-karnataka-dark mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-karnataka-green" />
                {language === 'kn' ? et.titleKn : et.title}
              </div>
              <p className="text-[11px] text-stone-600">
                {language === 'kn' ? et.tipKn : et.tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
