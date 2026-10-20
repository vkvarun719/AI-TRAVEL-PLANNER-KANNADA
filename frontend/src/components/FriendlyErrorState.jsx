import { AlertTriangle, RotateCcw, Compass, ArrowRight, ShieldAlert } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function FriendlyErrorState({ onRetry, onSelectSample, errorMessage }) {
  const { language } = useLanguage()

  return (
    <div className="max-w-xl mx-auto my-12 card bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 rounded-3xl text-center space-y-6 shadow-xl animate-fade-in">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
        <AlertTriangle size={32} />
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          {language === 'kn' ? 'ತಾತ್ಕಾಲಿಕ ಅಡಚಣೆ' : 'Temporary Roadblock'}
        </span>
        <h3 className="text-xl font-black text-stone-900 dark:text-white">
          {language === 'kn' ? 'ಘಟ್ಟದ ರಸ್ತೆ ತೆರವುಗೊಳ್ಳುತ್ತಿದೆ... 🌧️' : 'The Ghats road is getting cleared! 🌧️'}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-md mx-auto">
          {errorMessage || (language === 'kn'
            ? 'AI ಮಾರ್ಗದರ್ಶಿ ಪ್ರಸ್ತುತ ಸಂಪರ್ಕದಲ್ಲಿಲ್ಲ ಅಥವಾ ಸರ್ವರ್ ದಟ್ಟಣೆಯಲ್ಲಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಮೊದಲೇ ಸಿದ್ಧಪಡಿಸಿದ ಪ್ರವಾಸವನ್ನು ವೀಕ್ಷಿಸಿ.'
            : 'AI generation experienced a brief hiccup due to network transit or rate limiting. Try regenerating or view an instant pre-built itinerary.')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-karnataka-red hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <RotateCcw size={14} />
            <span>{language === 'kn' ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' : 'Retry Generation'}</span>
          </button>
        )}

        {onSelectSample && (
          <button
            type="button"
            onClick={() => onSelectSample('hampi-3-day')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 dark:hover:bg-stone-700 transition-all shadow-2xs"
          >
            <Compass size={14} className="text-karnataka-gold" />
            <span>{language === 'kn' ? 'ಹಂಪಿ ಮಾದರಿ ಪ್ರವಾಸ ನೋಡಿ' : 'View 3-Day Hampi Itinerary'}</span>
          </button>
        )}
      </div>
    </div>
  )
}
