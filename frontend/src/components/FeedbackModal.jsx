import { useState } from 'react'
import { Star, MessageSquare, X, Send, Heart, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguage } from '../context/LanguageContext'

export default function FeedbackModal({ isOpen, onClose }) {
  const { language, t } = useLanguage()
  const [rating, setRating] = useState(5)
  const [category, setCategory] = useState('suggestion')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) {
      toast.error(language === 'kn' ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಅಭಿಪ್ರಾಯವನ್ನು ಬರೆಯಿರಿ' : 'Please enter your feedback message')
      return
    }

    const feedbackEntry = {
      id: Date.now(),
      rating,
      category,
      message: message.trim(),
      email: email.trim() || 'anonymous',
      submittedAt: new Date().toISOString()
    }

    // Save to local storage feedback log
    try {
      const existing = JSON.parse(localStorage.getItem('yatra_user_feedback') || '[]')
      existing.unshift(feedbackEntry)
      localStorage.setItem('yatra_user_feedback', JSON.stringify(existing))
    } catch {
      // ignore
    }

    // Attempt backend feedback submission
    fetch('http://localhost:8000/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackEntry)
    }).catch(() => {/* ignore backend offline */})

    setSubmitted(true)
    toast.success(language === 'kn' ? 'ನಿಮ್ಮ ಬೆಲೆಬಾಳುವ ಅಭಿಪ್ರಾಯಕ್ಕೆ ಧನ್ಯವಾದಗಳು! ಧನ್ಯವಾದ!' : 'Thank you for your feedback! Dhanyavada! 🙏')
    setTimeout(() => {
      setSubmitted(false)
      setMessage('')
      onClose()
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-7 overflow-hidden">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-black text-stone-900 dark:text-white">
              {language === 'kn' ? 'ಧನ್ಯವಾದಗಳು!' : 'Dhanyavada!'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {language === 'kn' ? 'ನಿಮ್ಮ ಸಲಹೆಗಳು ನಮ್ಮ ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಯೋಜನೆಯನ್ನು ಮತ್ತಷ್ಟು ಉತ್ತಮಗೊಳಿಸುತ್ತವೆ.' : 'Your valuable feedback helps us improve Yatra AI for all travelers across Karnataka.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-karnataka-red to-red-700 flex items-center justify-center text-white shadow-xs">
                <MessageSquare size={17} />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900 dark:text-white">
                  {language === 'kn' ? 'ನಿಮ್ಮ ಅನಿಸಿಕೆ ತಿಳಿಸಿ' : 'Share Your Feedback'}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {language === 'kn' ? 'ಯಾತ್ರಾ AI ಅನ್ನು ಮತ್ತಷ್ಟು ಪರಿಪೂರ್ಣಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡಿ' : 'Help us make Yatra AI better for Karnataka travelers'}
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="py-1">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                {language === 'kn' ? 'ನಿಮ್ಮ ಅನುಭವ ಹೇಗಿತ್ತು?' : 'How was your experience?'}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      size={22}
                      className={
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300 dark:text-stone-700'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Category */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {language === 'kn' ? 'ವರ್ಗ' : 'Category'}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'suggestion', label: language === 'kn' ? 'ಸಲಹೆ' : '💡 Suggestion' },
                  { id: 'place', label: language === 'kn' ? 'ಹೊಸ ತಾಣ ಸೇರಿಸಿ' : '📍 Missing Spot' },
                  { id: 'bug', label: language === 'kn' ? 'ದೋಷ ವರದಿ' : '🐞 Bug' },
                  { id: 'love', label: language === 'kn' ? 'ಮೆಚ್ಚುಗೆ' : '❤️ Praise' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      category === c.id
                        ? 'bg-karnataka-red text-white border-karnataka-red'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {language === 'kn' ? 'ವಿವರಣೆ' : 'Your Thoughts'}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder={language === 'kn' ? 'ನಿಮ್ಮ ಸಲಹೆಗಳು ಅಥವಾ ಸುಧಾರಣೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ...' : 'Tell us what you loved or what we should add (e.g. more military hotels, hidden waterfalls)...'}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:border-karnataka-gold"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-karnataka-red hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Send size={13} />
              <span>{language === 'kn' ? 'ಸಲ್ಲಿಸಿ' : 'Send Feedback'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
