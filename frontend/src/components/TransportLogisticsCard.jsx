import { useState } from 'react'
import {
  Bus, Train, Car, Bike, ExternalLink, ShieldAlert,
  Fuel, CheckCircle2, Compass, AlertCircle
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function TransportLogisticsCard({ startingPoint = 'Bangalore' }) {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState('ksrtc')

  return (
    <div className="card border border-stone-200/90 bg-white shadow-sm p-5 sm:p-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-karnataka-red text-white flex items-center justify-center shadow-xs">
            <Bus size={16} />
          </div>
          <div>
            <h4 className="text-sm font-black text-stone-900 tracking-tight">
              {language === 'kn' ? 'ಕರ್ನಾಟಕ ಸಾರಿಗೆ ಮತ್ತು ಮಾರ್ಗ ಮಾರ್ಗದರ್ಶಿ' : 'Karnataka Transport & Logistics Guide'}
            </h4>
            <p className="text-[11px] text-stone-500">
              {language === 'kn' ? 'KSRTC ಬಸ್, IRCTC ರೈಲು, ಸ್ವಯಂ ಚಾಲನೆ ಮತ್ತು ಟ್ಯಾಕ್ಸಿ ಬುಕಿಂಗ್' : 'Official bus bookings, rail corridors, self-drive ghat tips & outstation cabs'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-stone-100 rounded-xl mb-4 text-xs font-bold">
        {[
          { id: 'ksrtc', label: 'KSRTC Bus', icon: Bus },
          { id: 'irctc', label: 'IRCTC Trains', icon: Train },
          { id: 'selfdrive', label: 'Self-Drive / Bike', icon: Bike },
          { id: 'cabs', label: 'Outstation Cabs', icon: Car },
        ].map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === t.id
                  ? 'bg-white text-karnataka-red shadow-2xs font-extrabold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Icon size={13} />
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* 1. KSRTC Content */}
      {activeTab === 'ksrtc' && (
        <div className="space-y-3 animate-fade-in text-xs text-stone-700">
          <div className="p-3 bg-red-50/60 border border-red-200/70 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <strong className="text-karnataka-red font-bold text-xs">
                Karnataka State Road Transport Corporation (KSRTC)
              </strong>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                Official Government Service
              </span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed mb-2">
              KSRTC connects every corner of Karnataka with clean, air-conditioned multi-axle Volvo coaches and rural sleeper routes.
            </p>
            <div className="grid sm:grid-cols-3 gap-2 text-[11px] mb-3">
              <div className="bg-white p-2 rounded-lg border border-red-100">
                <span className="font-bold text-stone-900 block">Airavat Club Class</span>
                <span className="text-stone-500 text-[10px]">Multi-axle Volvo AC sleeper/seater with live tracking</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-red-100">
                <span className="font-bold text-stone-900 block">KSRTC FlyBus</span>
                <span className="text-stone-500 text-[10px]">Direct from BLR Airport to Mysuru, Madikeri & Kundapura</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-red-100">
                <span className="font-bold text-stone-900 block">Rajahamsa</span>
                <span className="text-stone-500 text-[10px]">Budget-friendly 2+2 executive pushback service</span>
              </div>
            </div>
            <a
              href="https://ksrtc.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-karnataka-red text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
            >
              <span>Book Tickets on KSRTC Official Website</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}

      {/* 2. IRCTC Trains Content */}
      {activeTab === 'irctc' && (
        <div className="space-y-3 animate-fade-in text-xs text-stone-700">
          <div className="p-3 bg-blue-50/60 border border-blue-200/70 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <strong className="text-blue-900 font-bold text-xs">
                Indian Railways (IRCTC) Karnataka Corridors
              </strong>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Fast & Scenic
              </span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed mb-2">
              Comfortable day and overnight rail journeys connecting Bengaluru, Mysuru, Hampi (Hosapete), Coastal Karnataka and North Karnataka.
            </p>
            <div className="space-y-1.5 text-[11px] mb-3">
              <div className="bg-white p-2 rounded-lg border border-blue-100 flex items-center justify-between">
                <span className="font-bold text-stone-800">🚅 Vande Bharat Express: Bengaluru ↔ Mysuru</span>
                <span className="text-stone-500 text-[10px]">~1h 45m (Speedy day transit)</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-100 flex items-center justify-between">
                <span className="font-bold text-stone-800">🚅 Vande Bharat Express: Bengaluru ↔ Hubballi / Dharwad</span>
                <span className="text-stone-500 text-[10px]">~6 hrs across Central Karnataka</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-100 flex items-center justify-between">
                <span className="font-bold text-stone-800">🌙 Hampi Express (16591): Bengaluru ↔ Hosapete</span>
                <span className="text-stone-500 text-[10px]">Overnight train directly to Hampi gates</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-100 flex items-center justify-between">
                <span className="font-bold text-stone-800">🌊 Panchaganga Express: Bengaluru ↔ Karwar</span>
                <span className="text-stone-500 text-[10px]">Scenic journey via Western Ghats to Murudeshwar</span>
              </div>
            </div>
            <a
              href="https://www.irctc.co.in/nget/train-search"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 transition-colors shadow-xs"
            >
              <span>Book Trains on IRCTC Official Portal</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}

      {/* 3. Self-Drive & Bike Rentals */}
      {activeTab === 'selfdrive' && (
        <div className="space-y-3 animate-fade-in text-xs text-stone-700">
          <div className="p-3 bg-emerald-50/60 border border-emerald-200/70 rounded-xl">
            <strong className="text-emerald-900 font-bold text-xs block mb-1">
              Western Ghats & Coastal Self-Drive Guidelines
            </strong>
            <p className="text-[11px] text-stone-600 leading-relaxed mb-3">
              Karnataka boasts some of India's most celebrated road-trip corridors. Follow these critical guidelines for safe and scenic riding:
            </p>
            <div className="grid sm:grid-cols-2 gap-2 text-[11px] mb-3">
              <div className="bg-white p-2 rounded-lg border border-emerald-100">
                <span className="font-bold text-stone-900 block">⛽ Petrol Pump Gaps:</span>
                <span className="text-stone-600 text-[10px]">Always top up in Hassan or Sakleshpur before Shiradi Ghat; petrol pumps are scarce inside dense forest stretches.</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-100">
                <span className="font-bold text-stone-900 block">🛑 Bandipur Night Ban:</span>
                <span className="text-stone-600 text-[10px]">NH-766 through Bandipur is closed 9:00 PM to 6:00 AM strictly to protect wildlife. Plan arrival before 8:30 PM.</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-100">
                <span className="font-bold text-stone-900 block">🏍️ Bike Rentals:</span>
                <span className="text-stone-600 text-[10px]">Royal Enfield and scooters available in Bengaluru (Indiranagar/Koramangala), Mysuru, Gokarna, and Hampi.</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-100">
                <span className="font-bold text-stone-900 block">🌧️ Monsoon Ghat Advisory:</span>
                <span className="text-stone-600 text-[10px]">Drive carefully around Shiradi and Charmadi hairpin turns during July-August heavy rains.</span>
              </div>
            </div>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-karnataka-green text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <span>Explore Self-Drive Navigation Routes</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}

      {/* 4. Outstation Cabs */}
      {activeTab === 'cabs' && (
        <div className="space-y-3 animate-fade-in text-xs text-stone-700">
          <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl">
            <strong className="text-amber-900 font-bold text-xs block mb-1">
              Intercity Cab & Outstation Taxi Services
            </strong>
            <p className="text-[11px] text-stone-600 leading-relaxed mb-3">
              Chauffeur-driven outstation cabs are ideal for families and group travel with luggage across Karnataka heritage circuits.
            </p>
            <div className="grid sm:grid-cols-2 gap-2 text-[11px] mb-3">
              <div className="bg-white p-2.5 rounded-lg border border-amber-100">
                <span className="font-bold text-stone-900 block">Sedan (Dzire / Etios):</span>
                <span className="text-stone-600 text-[10px]">₹12 – ₹14 / km + ₹300 driver bata/day (Ideal for 1-3 people)</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-amber-100">
                <span className="font-bold text-stone-900 block">SUV (Innova / Ertiga):</span>
                <span className="text-stone-600 text-[10px]">₹18 – ₹22 / km + ₹400 driver bata/day (Ideal for 4-6 people)</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <a
                href="https://www.savaari.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors shadow-xs"
              >
                <span>Savaari Outstation Cabs</span>
                <ExternalLink size={11} />
              </a>
              <a
                href="https://www.makemytrip.com/cabs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-xs"
              >
                <span>MakeMyTrip Cabs</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
