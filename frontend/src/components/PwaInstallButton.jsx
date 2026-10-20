import { useState, useEffect } from 'react'
import { DownloadCloud, Smartphone } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguage } from '../context/LanguageContext'

export default function PwaInstallButton() {
  const { language } = useLanguage()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast(language === 'kn' ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ಮೆನುವಿನಿಂದ "Add to Home Screen" ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Tap browser menu and select "Install App" or "Add to Home Screen"', { icon: '📱' })
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      toast.success(language === 'kn' ? 'ಯಾತ್ರಾ AI ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಆಗಿದೆ! 🎉' : 'Yatra AI installed successfully! 🎉')
      setIsInstallable(false)
    }
    setDeferredPrompt(null)
  }

  if (!isInstallable) return null

  return (
    <button
      type="button"
      onClick={handleInstallClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-karnataka-red to-red-600 hover:from-red-600 hover:to-red-700 shadow-xs transition-all animate-pulse-slow"
      title="Install Yatra AI App for offline use"
    >
      <Smartphone size={13} />
      <span className="hidden sm:inline">{language === 'kn' ? 'ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ' : 'Install App'}</span>
      <span className="sm:hidden">Install</span>
    </button>
  )
}
