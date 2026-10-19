import { useState } from 'react'
import {
  Languages,
  Sparkles,
  Volume2,
  Check,
  Compass,
  AlertCircle
} from 'lucide-react'

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
    kannada: 'ಧನ್ಯವಾದಗಳು / ತುಂಬಾ ಧನ್ಯವಾದ',
    phonetic: 'Dhanyavādagalu / Thumba dhanyavada',
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
    phonetic: 'Thumba channāgide!',
    context: 'Praise local dosas, filter coffee & pandi curry.'
  }
]

const CULTURAL_ETIQUETTE = [
  {
    title: 'Temple Decorum',
    tip: 'Remove footwear before inner prakara. Most Hoysala & Coastal temples require modest attire covering shoulders and knees.'
  },
  {
    title: 'Western Ghats Leech Precaution',
    tip: 'If trekking or riding near Agumbe, Sakleshpur or Kudremukh during rain, carry salt or tobacco powder and leech socks.'
  },
  {
    title: 'Bandipur Night Ban',
    tip: 'Vehicular movement through Bandipur & Nagarhole forest gates is barred strictly between 9:00 PM and 6:00 AM.'
  },
  {
    title: 'Filter Coffee Ritual',
    tip: 'Never stir traditional Udupi dabarah set with a spoon; pour back and forth between cup and dabarah to cool and froth.'
  }
]

export default function KannadaCompanion() {
  const [copiedIdx, setCopiedIdx] = useState(null)

  const copyPhrase = (text, idx) => {
    navigator.clipboard?.writeText?.(text)
    setCopiedIdx(idx)
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
              Local Kannada Companion
              <span className="text-xs bg-karnataka-gold/20 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                ನಮ್ಮ ಕನ್ನಡ
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Essential conversational phrases & hyper-local cultural customs
            </p>
          </div>
        </div>
      </div>

      {/* Phrasebook Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {PHRASES.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-stone-200/80 bg-white hover:border-karnataka-gold transition-all duration-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="text-[11px] font-semibold text-stone-400 mb-0.5">{item.english}</div>
              <div className="text-base font-bold text-stone-900 mb-0.5 font-sans">{item.kannada}</div>
              <div className="text-xs font-semibold text-karnataka-red italic">{item.phonetic}</div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[10px] text-stone-400 leading-tight pr-2">{item.context}</span>
              <button
                type="button"
                onClick={() => copyPhrase(`${item.phonetic} (${item.kannada})`, idx)}
                title="Copy phonetic pronunciation"
                className="p-1 rounded-md text-stone-400 hover:text-karnataka-dark hover:bg-stone-100 transition-colors flex-shrink-0"
              >
                {copiedIdx === idx ? (
                  <Check size={12} className="text-karnataka-green" />
                ) : (
                  <Volume2 size={12} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cultural Etiquette Tips */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-karnataka-gold" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Hyper-Local Etiquette & Travel Insights
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
                {et.title}
              </div>
              <p className="text-[11px] text-stone-600">{et.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
