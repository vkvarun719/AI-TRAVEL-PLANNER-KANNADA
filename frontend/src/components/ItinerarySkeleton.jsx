import { useState, useEffect } from 'react'
import { Sparkles, MapPin, Compass, Utensils, CloudSun } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const LOADING_STAGES_EN = [
  { icon: Compass, text: 'Mapping Karnataka heritage circuits & Ghats trails...' },
  { icon: Utensils, text: 'Scouting authentic regional eateries & military hotels...' },
  { icon: CloudSun, text: 'Checking seasonal climate & Western Ghats weather advisory...' },
  { icon: MapPin, text: 'Optimizing morning, afternoon & evening timeline stops...' },
  { icon: Sparkles, text: 'Polishing Kannada travel phrases & local insider tips...' },
]

const LOADING_STAGES_KN = [
  { icon: Compass, text: 'ಕರ್ನಾಟಕದ ಪರಂಪರೆ ತಾಣಗಳು ಮತ್ತು ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಮಾರ್ಗ ವಿಶ್ಲೇಷಣೆ...' },
  { icon: Utensils, text: 'ಪ್ರಸಿದ್ಧ ಸ್ಥಳೀಯ ತಿನಿಸುಗಳು ಮತ್ತು ಮಿಲಿಟರಿ ಹೋಟೆಲ್‌ಗಳ ಆಯ್ಕೆ...' },
  { icon: CloudSun, text: 'ಪ್ರವಾಸ ಋತು ಮತ್ತು ಹವಾಮಾನ ಸ್ಥಿತಿಗಳ ಪರಿಶೀಲನೆ...' },
  { icon: MapPin, text: 'ಬೆಳಗ್ಗೆ, ಮಧ್ಯಾಹ್ನ ಮತ್ತು ಸಂಜೆಯ ದಿನಚರಿ ವೇಳಾಪಟ್ಟಿ ಸಿದ್ಧತೆ...' },
  { icon: Sparkles, text: 'ಕನ್ನಡ ನುಡಿಗಟ್ಟುಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಸಲಹೆಗಳ ಜೋಡಣೆ...' },
]

export default function ItinerarySkeleton({ startingPoint, days }) {
  const { language } = useLanguage()
  const stages = language === 'kn' ? LOADING_STAGES_KN : LOADING_STAGES_EN
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(18)

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length)
    }, 2400)

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + Math.floor(Math.random() * 8) + 4 : 92))
    }, 800)

    return () => {
      clearInterval(stageInterval)
      clearInterval(progressInterval)
    }
  }, [stages.length])

  const StageIcon = stages[currentStage].icon

  return (
    <div className="space-y-6 animate-fade-in py-2">
      {/* Dynamic AI Generation Progress Status Bar */}
      <div className="card bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-karnataka-red text-white flex items-center justify-center animate-bounce shadow-md">
              <StageIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-karnataka-red dark:text-red-400">
                  AI Trip Architect Working
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-white transition-all duration-300">
                {stages[currentStage].text}
              </h3>
            </div>
          </div>

          <div className="w-full sm:w-48 flex flex-col items-end">
            <span className="text-xs font-black text-karnataka-gold mb-1">{progress}% Complete</span>
            <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-karnataka-red via-karnataka-gold to-karnataka-green transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Skeleton Grid (Sidebar + Main Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-4 space-y-5">
          <div className="card bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl space-y-4 animate-pulse">
            <div className="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded-md" />
            <div className="h-7 w-3/4 bg-stone-200 dark:bg-stone-800 rounded-md" />
            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded" />
              <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded" />
              <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded" />
            </div>
            <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded-xl" />
          </div>

          <div className="card bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-2xl h-56 animate-pulse flex flex-col justify-between">
            <div className="h-4 w-32 bg-stone-200 dark:bg-stone-800 rounded" />
            <div className="h-32 bg-stone-100 dark:bg-stone-800/60 rounded-xl flex items-center justify-center text-stone-300 dark:text-stone-700">
              <Compass size={32} className="animate-spin" />
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-8 space-y-6">
          {/* Banner Skeleton */}
          <div className="h-56 bg-stone-200 dark:bg-stone-800 rounded-3xl animate-pulse p-6 flex flex-col justify-end space-y-3">
            <div className="h-5 w-40 bg-stone-300 dark:bg-stone-700 rounded-full" />
            <div className="h-8 w-2/3 bg-stone-300 dark:bg-stone-700 rounded-xl" />
            <div className="h-4 w-5/6 bg-stone-300 dark:bg-stone-700 rounded" />
          </div>

          {/* Timeline Cards Skeletons */}
          {[1, 2].map((i) => (
            <div key={i} className="card bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-5 w-44 bg-stone-200 dark:bg-stone-800 rounded" />
                <div className="h-5 w-20 bg-stone-200 dark:bg-stone-800 rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="h-16 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800" />
                <div className="h-16 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800" />
                <div className="h-16 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
