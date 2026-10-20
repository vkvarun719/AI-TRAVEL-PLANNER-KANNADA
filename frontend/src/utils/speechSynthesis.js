// Utility for cross-browser Kannada audio pronunciation using SpeechSynthesis API

let currentUtterance = null

/**
 * Returns available browser voices. Handles asynchronous voice loading in Chrome/Edge.
 */
export function getAvailableVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve([])
  }

  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      resolve(voices)
      return
    }

    const onVoicesChanged = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
      resolve(window.speechSynthesis.getVoices())
    }
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged)

    // Fallback timeout in case voiceschanged does not trigger
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices())
    }, 500)
  })
}

/**
 * Speaks a phrase. Tries Kannada voice (kn-IN) first with kannada text;
 * if not available, uses Indian English voice (en-IN) with phonetic text.
 */
export async function speakPhrase(kannadaText, phoneticText, onStart, onEnd, onError, speechRate = 0.85) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.('Speech synthesis not supported on this browser')
    return { success: false, reason: 'unsupported' }
  }

  // Cancel any running speech
  window.speechSynthesis.cancel()

  const voices = await getAvailableVoices()
  
  // 1. Look for native Kannada voice
  const kannadaVoice = voices.find(v => 
    v.lang.toLowerCase().includes('kn') || 
    v.name.toLowerCase().includes('kannada')
  )

  // 2. Look for Indian English voice for authentic Indian cadence on phonetic text
  const indianEnVoice = voices.find(v =>
    v.lang.toLowerCase().includes('en-in') ||
    v.name.toLowerCase().includes('india')
  )

  let textToSpeak = kannadaText
  let selectedVoice = kannadaVoice
  let voiceLang = 'kn-IN'
  let isNativeKannada = true

  if (!kannadaVoice) {
    isNativeKannada = false
    textToSpeak = phoneticText || kannadaText
    selectedVoice = indianEnVoice || voices[0] || null
    voiceLang = indianEnVoice ? 'en-IN' : 'en-US'
  }

  const utterance = new SpeechSynthesisUtterance(textToSpeak)
  utterance.lang = voiceLang
  utterance.rate = typeof speechRate === 'number' ? speechRate : 0.85 // adjustable rate
  utterance.pitch = 1.0

  if (selectedVoice) {
    utterance.voice = selectedVoice
  }

  utterance.onstart = () => {
    onStart?.({ isNativeKannada })
  }

  utterance.onend = () => {
    currentUtterance = null
    onEnd?.()
  }

  utterance.onerror = (e) => {
    currentUtterance = null
    onError?.(e)
  }

  currentUtterance = utterance
  window.speechSynthesis.speak(utterance)

  return { success: true, isNativeKannada }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    currentUtterance = null
  }
}

export function playKannadaText(text, phonetic = '') {
  return speakPhrase(text, phonetic || text)
}
