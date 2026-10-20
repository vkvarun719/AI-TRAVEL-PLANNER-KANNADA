import { useState } from 'react'
import { Backpack, CheckSquare, Square, Check, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const DEFAULT_PACKING_ITEMS = [
  { id: 'p1', textEn: 'Comfortable slip-on footwear (convenient for temple entrances)', textKn: 'ದೇವಸ್ಥಾನಗಳಿಗೆ ಪ್ರವೇಶಿಸಲು ಸುಲಭವಾದ ಪಾದರಕ್ಷೆಗಳು' },
  { id: 'p2', textEn: 'Breathable cotton clothing + light shawl for morning/evening chill', textKn: 'ಹತ್ತಿ ಉಡುಪುಗಳು ಮತ್ತು ಮುಂಜಾನೆ-ಸಂಜೆ ಚಳಿಗೆ ಶಾಲು' },
  { id: 'p3', textEn: 'Rain jacket or compact umbrella (essential for Malnad & Western Ghats)', textKn: 'ಮಳೆಕೋಟ್ ಅಥವಾ ಕೊಡೆ (ಮಲೆನಾಡು ಮತ್ತು ಘಟ್ಟಗಳಿಗೆ ಅತಿಮುಖ್ಯ)' },
  { id: 'p4', textEn: 'Leech socks / small salt pouch (if trekking in Coorg or Agumbe)', textKn: 'ಜಿಗಣೆ ಸಾಕ್ಸ್ ಅಥವಾ ಉಪ್ಪಿನ ಪೊಟ್ಟಣ (ಚಾರಣಕ್ಕೆ)' },
  { id: 'p5', textEn: 'Power bank (cell towers have intermittent gaps on ghat passes)', textKn: 'ಪವರ್ ಬ್ಯಾಂಕ್ (ಘಾಟ್ ರಸ್ತೆಗಳಲ್ಲಿ ಚಾರ್ಜಿಂಗ್‌ಗಾಗಿ)' },
  { id: 'p6', textEn: 'Government photo ID card (mandatory for ASI monuments & homestays)', textKn: 'ಸರ್ಕಾರಿ ಗುರುತಿನ ಚೀಟಿ (ಸ್ಮಾರಕ ಮತ್ತು ವಾಸ್ತವ್ಯಕ್ಕೆ)' },
  { id: 'p7', textEn: 'Sun protection: Hat, UV sunglasses, and high-SPF sunscreen', textKn: 'ಬಿಸಿಲಿಗೆ ಟೋಪಿ, ಸನ್‌ಗ್ಲಾಸ್ ಮತ್ತು ಸನ್‌ಸ್ಕ್ರೀನ್' },
  { id: 'p8', textEn: 'UPI payment apps enabled (widely accepted across all stalls)', textKn: 'ಗೂಗಲ್ ಪೇ / ಫೋನ್‌ಪೇ ಸಕ್ರಿಯಗೊಳಿಸಿದ ಮೊಬೈಲ್' },
]

export default function PackingChecklistCard({ packingAdvice = '' }) {
  const { language, t } = useLanguage()
  const [checkedIds, setCheckedIds] = useState(new Set(['p1', 'p6']))

  const toggleItem = (id) => {
    setCheckedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const packedCount = checkedIds.size
  const totalCount = DEFAULT_PACKING_ITEMS.length

  return (
    <div className="card border border-stone-200/90 bg-white shadow-sm p-5 sm:p-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-karnataka-green/15 flex items-center justify-center text-karnataka-green">
            <Backpack size={16} />
          </div>
          <div>
            <h4 className="text-sm font-black text-stone-900 tracking-tight">
              {t('packingChecklistTitle')}
            </h4>
            <p className="text-[11px] text-stone-500">
              {t('packingChecklistSubtitle')}
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          {t('packedCount', { packed: packedCount, total: totalCount })}
        </span>
      </div>

      {/* AI Custom Advice if present */}
      {packingAdvice && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-950 italic leading-relaxed">
          <strong className="not-italic text-emerald-800 font-bold block mb-0.5">
            💡 AI Seasonal Packing Note:
          </strong>
          {packingAdvice}
        </div>
      )}

      {/* Checklist items */}
      <div className="grid sm:grid-cols-2 gap-2">
        {DEFAULT_PACKING_ITEMS.map((item) => {
          const isDone = checkedIds.has(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-300 text-stone-800'
                  : 'bg-stone-50/60 border-stone-200/80 hover:bg-white text-stone-600'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <CheckSquare size={16} className="text-karnataka-green font-bold" />
                ) : (
                  <Square size={16} className="text-stone-300" />
                )}
              </div>
              <span className={`text-xs leading-snug font-medium ${isDone ? 'line-through text-stone-400' : ''}`}>
                {language === 'kn' ? item.textKn : item.textEn}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
