import { useState, useEffect, useRef } from 'react'
import {
  Mic, MicOff, X, Sparkles, Check, AlertCircle, RotateCcw, Volume2
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function VoiceInputModal({ isOpen, onClose, onApplyTrip }) {
  const { language, t } = useLanguage()
  const [speechLang, setSpeechLang] = useState(language === 'kn' ? 'kn-IN' : 'en-IN')
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [parsedData, setParsedData] = useState(null)
  const recognitionRef = useRef(null)

  // Keep speech language in sync with app language if user hasn't explicitly toggled
  useEffect(() => {
    setSpeechLang(language === 'kn' ? 'kn-IN' : 'en-IN')
  }, [language])

  // Clean up on unmount or close
  useEffect(() => {
    if (!isOpen) {
      stopListening()
      setTranscript('')
      setErrorMsg('')
      setParsedData(null)
    }
  }, [isOpen])

  const checkSpeechSupport = () => {
    return typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  }

  const startListening = () => {
    setErrorMsg('')
    if (!checkSpeechSupport()) {
      setErrorMsg(t('voiceNotSupported'))
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = speechLang
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        let finalTranscript = ''
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript + ' '
        }
        const clean = finalTranscript.trim()
        setTranscript(clean)
        parseSpokenText(clean)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'not-allowed') {
          setErrorMsg(speechLang.startsWith('kn')
            ? 'ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿಯನ್ನು ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಮೈಕ್ ಆನ್ ಮಾಡಿ.'
            : 'Microphone permission denied. Please allow microphone access in your browser.')
        } else if (event.error === 'no-speech') {
          // ignore or prompt
        } else {
          setErrorMsg(`Voice error: ${event.error}`)
        }
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (err) {
      console.error(err)
      setErrorMsg('Failed to initialize voice recognition.')
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        // ignore
      }
      recognitionRef.current = null
    }
    setIsListening(false)
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Parse speech into planner fields
  const parseSpokenText = (text) => {
    const lower = text.toLowerCase()
    const extracted = {}

    // 1. Days Extraction
    const daysPatterns = [
      /(\d+)\s*(days?|ದಿನ|ದಿನಗಳು)/i,
      /(one|two|three|four|five|six|seven|eight|nine|ten)\s*days?/i,
      /(ಒಂದು|ಎರಡು|ಮೂರು|ನಾಲ್ಕು|ಐದು|ಆರು|ಏಳು|ಎಂಟು|ಒಂಬತ್ತು|ಹತ್ತು)\s*(ದಿನ|ದಿನಗಳು)/i,
    ]

    const wordToNumber = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      'ಒಂದು': 1, 'ಎರಡು': 2, 'ಮೂರು': 3, 'ನಾಲ್ಕು': 4, 'ಐದು': 5, 'ಆರು': 6, 'ಏಳು': 7, 'ಎಂಟು': 8, 'ಒಂಬತ್ತು': 9, 'ಹತ್ತು': 10
    }

    let foundDays = null
    for (const pat of daysPatterns) {
      const match = lower.match(pat)
      if (match) {
        const val = match[1].toLowerCase()
        foundDays = wordToNumber[val] || parseInt(val, 10)
        break
      }
    }
    if (lower.includes('weekend') || lower.includes('ವಾರಾಂತ್ಯ')) {
      foundDays = 2
    } else if (lower.includes('week') || lower.includes('ವಾರ')) {
      foundDays = 7
    }

    if (foundDays && !isNaN(foundDays)) {
      extracted.days = Math.max(1, Math.min(14, foundDays))
    }

    // 2. Starting Point / Destination Extraction
    const destinationsMap = [
      { name: 'Bangalore', triggers: ['bangalore', 'bengaluru', 'ಬೆಂಗಳೂರು'] },
      { name: 'Mysore', triggers: ['mysore', 'mysuru', 'ಮೈಸೂರು'] },
      { name: 'Hampi', triggers: ['hampi', 'ಹಂಪಿ', 'ವಿಜಯನಗರ'] },
      { name: 'Coorg', triggers: ['coorg', 'madikeri', 'kodagu', 'ಕೂರ್ಗ್', 'ಮಡಿಕೇರಿ', 'ಕೊಡಗು'] },
      { name: 'Chikmagalur', triggers: ['chikmagalur', 'chikkamagaluru', 'ಚಿಕ್ಕಮಗಳೂರು'] },
      { name: 'Gokarna', triggers: ['gokarna', 'ಗೋಕರ್ಣ'] },
      { name: 'Udupi', triggers: ['udupi', 'malpe', 'ಉಡುಪಿ', 'ಮಲ್ಪೆ'] },
      { name: 'Badami', triggers: ['badami', 'pattadakal', 'aihole', 'ಬಾದಾಮಿ', 'ಪಟ್ಟದಕಲ್ಲು'] },
      { name: 'Dandeli', triggers: ['dandeli', 'ದಾಂಡೇಲಿ'] },
      { name: 'Mangalore', triggers: ['mangalore', 'mangaluru', 'ಮಂಗಳೂರು'] },
      { name: 'Hubli', triggers: ['hubli', 'hubballi', 'ಹುಬ್ಬಳ್ಳಿ'] },
      { name: 'Dharwad', triggers: ['dharwad', 'ಧಾರವಾಡ'] },
      { name: 'Belgaum', triggers: ['belgaum', 'belagavi', 'ಬೆಳಗಾವಿ'] },
      { name: 'Jog Falls', triggers: ['jog falls', 'jog', 'ಶಿವಮೊಗ್ಗ', 'shimoga', 'ಜೋಗ'] },
    ]

    for (const d of destinationsMap) {
      if (d.triggers.some(t => lower.includes(t))) {
        extracted.starting_point = d.name
        break
      }
    }

    // 3. Budget Extraction
    if (lower.includes('budget') || lower.includes('cheap') || lower.includes('ಕಡಿಮೆ') || lower.includes('ಬಜೆಟ್')) {
      extracted.budget = 'budget'
    } else if (lower.includes('luxury') || lower.includes('expensive') || lower.includes('ಐಷಾರಾಮಿ') || lower.includes('ರಾಯಲ್')) {
      extracted.budget = 'luxury'
    } else if (lower.includes('mid') || lower.includes('comfort') || lower.includes('ಮಧ್ಯಮ')) {
      extracted.budget = 'mid-range'
    }

    // 4. Interests Extraction
    const detectedInterests = []
    const interestRules = [
      { key: 'Heritage', triggers: ['heritage', 'history', 'temple', 'monument', 'ruins', 'palace', 'ಪರಂಪರೆ', 'ಇತಿಹಾಸ', 'ದೇವಸ್ಥಾನ', 'ಅರಮನೆ'] },
      { key: 'Wildlife', triggers: ['wildlife', 'nature', 'tiger', 'elephant', 'forest', 'jungle', 'ವನ್ಯಜೀವಿ', 'ಪ್ರಕೃತಿ', 'ಕಾಡು', 'ಅರಣ್ಯ'] },
      { key: 'Western Ghats', triggers: ['western ghats', 'ghats', 'hills', 'mountain', 'shiradi', 'ಮಲೆನಾಡು', 'ಪಶ್ಚಿಮ ಘಟ್ಟ', 'ಬೆಟ್ಟ'] },
      { key: 'Beaches', triggers: ['beach', 'sea', 'coast', 'ocean', 'sand', 'ಕಡಲತೀರ', 'ಸಮುದ್ರ', 'ಬೀಚ್'] },
      { key: 'Food', triggers: ['food', 'cuisine', 'dosa', 'eating', 'coffee', 'meal', 'ಆಹಾರ', 'ಊಟ', 'ತಿಂಡಿ', 'ಕಾಫಿ', 'ದೋಸೆ'] },
      { key: 'Adventure', triggers: ['adventure', 'trek', 'rafting', 'hiking', 'sports', 'ಸಾಹಸ', 'ಚಾರಣ', 'ರಾಫ್ಟಿಂಗ್'] },
      { key: 'Motorcycle', triggers: ['bike', 'motorcycle', 'ride', 'biking', 'ಬೈಕ್', 'ರೈಡ್'] },
      { key: 'Photography', triggers: ['photo', 'photography', 'camera', 'ಛಾಯಾಗ್ರಹಣ', 'ಕ್ಯಾಮೆರಾ'] },
    ]

    for (const rule of interestRules) {
      if (rule.triggers.some(t => lower.includes(t))) {
        detectedInterests.push(rule.key)
      }
    }
    if (detectedInterests.length > 0) {
      extracted.interests = detectedInterests
    }

    // 5. Travel Style
    if (lower.includes('relax') || lower.includes('peace') || lower.includes('ವಿರಾಮ') || lower.includes('ಶಾಂತ')) {
      extracted.travel_style = 'relaxed'
    } else if (lower.includes('adventure') || lower.includes('ಸಾಹಸ')) {
      extracted.travel_style = 'adventure'
    } else if (lower.includes('culture') || lower.includes('spiritual') || lower.includes('ಸಂಸ್ಕೃತಿ') || lower.includes('ಆಧ್ಯಾತ್ಮ')) {
      extracted.travel_style = 'cultural'
    }

    setParsedData(extracted)
  }

  const handleApply = () => {
    if (parsedData) {
      onApplyTrip(parsedData)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-karnataka-red to-red-700 flex items-center justify-center text-white shadow-md">
            <Mic size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-karnataka-dark">{t('voiceModalTitle')}</h3>
            <p className="text-xs text-stone-500">{t('voiceModalDesc')}</p>
          </div>
        </div>

        {/* Language selector toggle for speech recognition */}
        <div className="flex items-center justify-between p-2.5 mb-5 bg-stone-100 rounded-xl">
          <span className="text-xs font-bold text-stone-600">{t('voiceLanguageLabel')}:</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                stopListening()
                setSpeechLang('kn-IN')
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                speechLang === 'kn-IN'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900'
              }`}
            >
              ಕನ್ನಡ (Kannada)
            </button>
            <button
              type="button"
              onClick={() => {
                stopListening()
                setSpeechLang('en-IN')
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                speechLang === 'en-IN'
                  ? 'bg-karnataka-red text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900'
              }`}
            >
              English (India)
            </button>
          </div>
        </div>

        {/* Central Pulsing Microphone Button */}
        <div className="flex flex-col items-center justify-center py-6">
          <button
            type="button"
            onClick={toggleListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 ${
              isListening
                ? 'bg-red-600 ring-8 ring-red-400/40 animate-pulse scale-105'
                : 'bg-karnataka-red hover:bg-red-700 hover:scale-105'
            }`}
          >
            {isListening ? <Mic size={36} className="animate-bounce" /> : <Mic size={34} />}
          </button>

          <p className="mt-4 text-xs font-bold tracking-wide uppercase text-stone-500">
            {isListening
              ? (speechLang === 'kn-IN' ? t('voiceListeningKn') : t('voiceListening'))
              : t('voiceSpeakPrompt')}
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Live Transcript Box */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 mb-1">
            <span>LIVE TRANSCRIPT</span>
            {transcript && (
              <button
                type="button"
                onClick={() => {
                  setTranscript('')
                  setParsedData(null)
                }}
                className="text-stone-400 hover:text-stone-600 flex items-center gap-1"
              >
                <RotateCcw size={10} /> Clear
              </button>
            )}
          </div>
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 min-h-[70px] max-h-32 overflow-y-auto text-xs text-stone-800 leading-relaxed">
            {transcript ? (
              <span className="font-medium text-stone-900">{transcript}</span>
            ) : (
              <span className="text-stone-400 italic">{t('voicePlaceholder')}</span>
            )}
          </div>
        </div>

        {/* Parsed Extraction Badges Preview */}
        {parsedData && Object.keys(parsedData).length > 0 && (
          <div className="mb-5 p-3.5 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
              <Sparkles size={13} className="text-emerald-600" />
              <span>Extracted Trip Parameters:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {parsedData.starting_point && (
                <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-bold">
                  📍 Hub: {parsedData.starting_point}
                </span>
              )}
              {parsedData.days && (
                <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-bold">
                  ⏱️ {parsedData.days} Days
                </span>
              )}
              {parsedData.budget && (
                <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-bold capitalize">
                  💰 {parsedData.budget}
                </span>
              )}
              {parsedData.travel_style && (
                <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-bold capitalize">
                  🎯 Style: {parsedData.travel_style}
                </span>
              )}
              {parsedData.interests?.map((i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-100/80 text-emerald-800 font-semibold">
                  ✨ {i}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors"
          >
            {t('voiceCancelBtn')}
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!transcript.trim()}
            className="flex-1 py-3 rounded-xl bg-karnataka-green text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Check size={14} />
            {t('voiceApplyBtn')}
          </button>
        </div>

      </div>
    </div>
  )
}
