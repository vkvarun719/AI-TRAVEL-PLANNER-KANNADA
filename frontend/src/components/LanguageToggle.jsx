import { useLanguage } from '../context/LanguageContext'
import { Languages } from 'lucide-react'

export default function LanguageToggle({ className = '' }) {
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border shadow-xs ${
        language === 'kn'
          ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 hover:bg-amber-500/20'
          : 'bg-karnataka-red/10 border-karnataka-red/30 text-karnataka-red hover:bg-karnataka-red/20'
      } ${className}`}
      title={language === 'kn' ? 'Switch to English' : 'ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಿ'}
    >
      <Languages size={14} className={language === 'kn' ? 'text-amber-600' : 'text-karnataka-red'} />
      <span className="font-extrabold">{language === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-black/5">
        {language === 'kn' ? 'KN' : 'EN'}
      </span>
    </button>
  )
}
