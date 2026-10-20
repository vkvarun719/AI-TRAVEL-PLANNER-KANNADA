// Master i18n index: aggregates language dictionaries
import en from './en'
import kn from './kn'
import hi from './hi'
import ta from './ta'

export const SUPPORTED_LANGUAGES = [
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: 'ಕರ್ನಾಟಕ' },
  { code: 'en', name: 'English', native: 'English', flag: 'EN' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: 'HI' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: 'TA' },
]

export const translations = {
  en,
  kn,
  hi,
  ta,
}

export default translations
