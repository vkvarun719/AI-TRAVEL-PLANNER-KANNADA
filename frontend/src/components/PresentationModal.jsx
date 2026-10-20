import React, { useState } from 'react'
import {
  X, ChevronLeft, ChevronRight, Download, Award, Sparkles,
  MapPin, CheckCircle2, AlertTriangle, Cpu, Globe, Heart, Shield,
  Layers, ExternalLink, Zap
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function PresentationModal({ isOpen, onClose }) {
  const { language } = useLanguage()
  const isKn = language === 'kn'
  const [currentSlide, setCurrentSlide] = useState(0)

  if (!isOpen) return null

  const slides = [
    // Slide 1: Title & Overview
    {
      page: 1,
      badge: 'Hackathon 2026 Presentation',
      badgeKn: 'ಹ್ಯಾಕಥಾನ್ 2026 ಪ್ರಸ್ತುತಿ',
      title: 'Yatra AI – Karnataka Travel Planner',
      titleKn: 'ಯಾತ್ರಾ AI – ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಯೋಜನೆ',
      subtitle: 'AI-Powered Karnataka Travel Planner with Hyper-Local Heritage Intelligence',
      subtitleKn: 'ಕರುನಾಡ ಪರಂಪರೆ, ರಮಣೀಯ ಘಟ್ಟಗಳು ಮತ್ತು ಅಧಿಕೃತ ಸಂಸ್ಕೃತಿಯನ್ನು ಬೆಸೆಯುವ AI ತಂತ್ರಜ್ಞಾನ',
      content: (
        <div className="flex flex-col items-center justify-center text-center py-6 sm:py-8 space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-karnataka-yellow to-amber-500 border-4 border-karnataka-red shadow-xl flex items-center justify-center text-4xl animate-bounce">
            🗺️
          </div>
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              Yatra AI <span className="text-karnataka-red">ಯಾತ್ರಾ AI</span>
            </h3>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-medium leading-relaxed">
              {isKn
                ? 'ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ ಮತ್ತು ಕರುನಾಡ ಪ್ರವಾಸೋದ್ಯಮಕ್ಕೆ ಅರ್ಪಿತವಾದ ೧೦೦% ಉಚಿತ, ನೈಜ ಮತ್ತು ಆಫ್‌ಲೈನ್ ಸೌಲಭ್ಯವುಳ್ಳ ಪ್ರವಾಸ ಮಾರ್ಗದರ್ಶಿ.'
                : 'Free-tier, mobile-first PWA crafted exclusively for Karnataka tourism with native Kannada OCR translation, ghat road weather warnings, and local food trails.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-karnataka-red text-xs font-bold border border-red-200">
              100% Free-Tier Architecture
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200">
              React + FastAPI + Gemini 1.5 Flash
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200">
              PWA Offline Ready
            </span>
          </div>

          <div className="pt-3 text-xs text-stone-500 dark:text-stone-400 font-mono">
            Live URL: <a href="https://ai-travel-planner-kannada.vercel.app" target="_blank" rel="noreferrer" className="text-karnataka-red hover:underline font-bold">ai-travel-planner-kannada.vercel.app</a>
          </div>
        </div>
      )
    },

    // Slide 2: Problem Statement
    {
      page: 2,
      badge: 'Section 1',
      title: 'Problem Statement & Affected Audience',
      titleKn: 'ಸಮಸ್ಯೆಯ ವಿವರ ಮತ್ತು ಪರಿಣಾಮ',
      subtitle: 'The problem we chose, who is affected, and why it matters',
      subtitleKn: 'ನಾವು ಆಯ್ದುಕೊಂಡ ಸವಾಲು, ಯಾರಿಗೆ ತೊಂದರೆಯಾಗಿದೆ ಮತ್ತು ಇದರ ಮಹತ್ವ',
      content: (
        <div className="grid md:grid-cols-2 gap-4 py-2">
          {/* Problem Card */}
          <div className="bg-red-50/70 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 p-4 sm:p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-karnataka-red font-black text-sm uppercase tracking-wider">
              <span>🚨</span>
              <span>{isKn ? 'ಮುಖ್ಯ ಸಮಸ್ಯೆ' : 'The Core Problem'}</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <li className="flex items-start gap-2">
                <span className="text-karnataka-red font-bold">•</span>
                <span><strong>Tourism Concentration:</strong> Tourists flock only to Bengaluru & Mysuru, ignoring 500+ heritage monuments across 31 districts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-karnataka-red font-bold">•</span>
                <span><strong>Generic Cookie-Cutter Itineraries:</strong> Commercial apps don't know ghat curves, local military hotels, or seasonal drying of waterfalls (Jog Falls).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-karnataka-red font-bold">•</span>
                <span><strong>Language Barrier:</strong> Kannada signboards, KSRTC bus destinations & local restaurant menus are unreadable for 95% of non-Kannadiga tourists.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-karnataka-red font-bold">•</span>
                <span><strong>Western Ghats Connectivity:</strong> Poor network in Agumbe/Coorg causes travelers to lose navigation access.</span>
              </li>
            </ul>
          </div>

          {/* Affected Audience */}
          <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 p-4 sm:p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-black text-sm uppercase tracking-wider">
              <span>👥</span>
              <span>{isKn ? 'ಯಾರಿಗೆ ಇದು ನೆರವಾಗುತ್ತದೆ?' : 'Who Is Affected'}</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>15+ Crore Annual Tourists:</strong> Families, students, solo backpackers, and bikers exploring Karnataka.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Heritage Enthusiasts:</strong> Visitors needing timings, entry fees, and cultural context for Hampi, Badami, Belur, Pattadakal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Local Homestays & Eateries:</strong> Rural hospitality hosts who lose revenue to corporate hotel aggregators.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Public Transit Passengers:</strong> Travelers seeking KSRTC Airavat / Rajahamsa routes and budget travel.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },

    // Slide 3: Existing System & Limitations
    {
      page: 3,
      badge: 'Section 2',
      title: 'Existing Systems vs. Market Limitations',
      titleKn: 'ಪ್ರಸ್ತುತ ವ್ಯವಸ್ಥೆ ಮತ್ತು ನ್ಯೂನತೆಗಳು',
      subtitle: 'How the problem is solved today, and its limitations or gaps',
      subtitleKn: 'ಇಂದಿನ ಪರಿಹಾರಗಳು ಹಾಗೂ ಅವುಗಳ ಮಿತಿಗಳು',
      content: (
        <div className="space-y-3 py-2">
          <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-900 text-karnataka-yellow">
                <tr>
                  <th className="p-3 font-black">Existing System</th>
                  <th className="p-3 font-black">What It Does</th>
                  <th className="p-3 font-black text-red-300">Limitations & Gaps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-900">
                <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                  <td className="p-3 font-bold text-stone-900 dark:text-white">MakeMyTrip / Goibibo</td>
                  <td className="p-3 text-stone-600 dark:text-stone-300">Hotel and flight ticket booking</td>
                  <td className="p-3 text-stone-600 dark:text-stone-400">Paid commissions, no AI day planning, ignores heritage circuits.</td>
                </tr>
                <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                  <td className="p-3 font-bold text-stone-900 dark:text-white">Google Travel / Tripadvisor</td>
                  <td className="p-3 text-stone-600 dark:text-stone-300">Generic tourist spot lists and reviews</td>
                  <td className="p-3 text-stone-600 dark:text-stone-400">Zero Kannada OCR, no offline mode, no real-time ghat landslide alerts.</td>
                </tr>
                <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                  <td className="p-3 font-bold text-stone-900 dark:text-white">Raw ChatGPT / Gemini</td>
                  <td className="p-3 text-stone-600 dark:text-stone-300">Conversational unstructured text</td>
                  <td className="p-3 text-stone-600 dark:text-stone-400">Hallucinates routes, lacks Leaflet maps, no budget breakdown or offline cache.</td>
                </tr>
                <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                  <td className="p-3 font-bold text-stone-900 dark:text-white">Govt Tourism Brochures</td>
                  <td className="p-3 text-stone-600 dark:text-stone-300">Static district PDF brochures</td>
                  <td className="p-3 text-stone-600 dark:text-stone-400">Zero personalization, no budget filter, no interactive route transit guidance.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent border border-red-500/20 rounded-xl text-xs text-stone-700 dark:text-stone-300">
            <strong>⚡ Key Innovation Gap:</strong> No single platform offered a <em>100% free</em> combo of: Journey Route Intelligence (From ➔ To) + Kannada OCR scanner + PWA offline caching + hyper-local monsoon alerts.
          </div>
        </div>
      )
    },

    // Slide 4: How Solution Is Different
    {
      page: 4,
      badge: 'Section 3',
      title: 'How Yatra AI Is Different & Better',
      titleKn: 'ಯಾತ್ರಾ AI ನ ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳು',
      subtitle: 'What is new or better in your solution compared with the existing system',
      subtitleKn: 'ನಮ್ಮ ಯೋಜನೆಯ ಹೊಸತನ ಮತ್ತು ವಿಶೇಷತೆಗಳು',
      content: (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 py-2 text-xs">
          {[
            {
              icon: '🛣️',
              title: 'From ➔ To Route Intelligence',
              desc: 'Select departure city AND target Karnataka destination. Instant highway name, real distance, drive time, KSRTC schedules & scenic stops.'
            },
            {
              icon: '📷',
              title: 'Kannada OCR Sign Scanner',
              desc: 'Multimodal vision scanner translates Kannada bus boards, temple plaques, and hotel menus into English in real-time with cultural tips.'
            },
            {
              icon: '📴',
              title: 'PWA 100% Offline Resilience',
              desc: 'Complete service worker caching. Saved trips, app shell, and Kannada phrasebook operate seamlessly without mobile data.'
            },
            {
              icon: '🌦️',
              title: 'Karnataka Hazard & Weather Alert',
              desc: 'Live Open-Meteo forecasts coupled with seasonal warnings: monsoon landslides in Charmadi/Shiradi, Hampi extreme heat, Jog Falls water flow.'
            },
            {
              icon: '🗺️',
              title: 'Interactive Leaflet Route Maps',
              desc: 'Numbered day stops on OpenStreetMap with OSRM driving route distances, avoiding proprietary paid map API billing.'
            },
            {
              icon: '🗣️',
              title: 'Audio Kannada Phrasebook',
              desc: '37 categorized phrases (Greetings, Food, Transport, Emergency) with Kannada script, English transliteration, and Web Speech audio.'
            },
            {
              icon: '💰',
              title: 'Granular Budget Estimator',
              desc: 'Budget / Mid / Luxury tiers with accurate per-day split for stay, food, transport, activities, and trip total.'
            },
            {
              icon: '🎉',
              title: 'Festival Calendar Matcher',
              desc: 'Auto-detects Karnataka cultural events (Dasara, Hampi Utsav, Kambala, Karaga) overlapping travel dates.'
            },
            {
              icon: '🌿',
              title: 'Trip Styles & Eco-Transit',
              desc: 'Presets for Solo, Family, Bikers, Students, Pilgrimage, and Eco-friendly filters prioritizing public transport & green stays.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1 hover:border-amber-400 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <span className="font-black text-stone-900 dark:text-white leading-tight">{item.title}</span>
              </div>
              <p className="text-stone-500 dark:text-stone-400 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      )
    },

    // Slide 5: Approach, Methodology & Tech Architecture
    {
      page: 5,
      badge: 'Section 4 & 5',
      title: 'Approach, Methodology & Architecture',
      titleKn: 'ವಿಧಾನ ಮತ್ತು ತಾಂತ್ರಿಕ ವಿನ್ಯಾಸ (Tech Stack)',
      subtitle: 'Technologies, frameworks, tools used, and architecture data flow',
      subtitleKn: 'ಬಳಸಿದ ತಂತ್ರಜ್ಞಾನಗಳು, ಚೌಕಟ್ಟುಗಳು ಹಾಗೂ ವಾಸ್ತುಶಿಲ್ಪ',
      content: (
        <div className="grid md:grid-cols-2 gap-4 py-2">
          {/* Approach & Workflow */}
          <div className="bg-stone-50 dark:bg-stone-900/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2.5">
            <h4 className="text-xs font-black uppercase text-karnataka-red tracking-wider flex items-center gap-1.5">
              <Zap size={14} /> Methodology & Key Design Decisions
            </h4>
            <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
              <div className="p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60">
                <strong>1. Zero-Cost Free Tier Constraint:</strong> Hosted on Vercel Free + Render Free. Uses Gemini 1.5 Flash, Open-Meteo, OSRM, and Web Speech API — zero credit card requirement.
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60">
                <strong>2. Free-Tier Hardening:</strong> 24h in-memory AI query cache, client rate-limiting, and automatic cold-start fallback handling to tolerate Render free cold starts (30-60s).
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60">
                <strong>3. Hyper-Local Prompt Engineering:</strong> System prompt infused with 20+ years of Karnataka heuristics: authentic military hotels, Hoysala temple timings, and regional cuisine.
              </div>
            </div>
          </div>

          {/* Architecture Diagram */}
          <div className="bg-stone-900 text-white p-4 rounded-2xl border border-stone-800 space-y-2.5">
            <h4 className="text-xs font-black uppercase text-karnataka-yellow tracking-wider flex items-center gap-1.5">
              <Cpu size={14} /> Architecture & Data Flow Diagram
            </h4>
            
            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-stone-800 border border-amber-500/30 flex items-center justify-between">
                <span>📱 <strong>Client (React 18 + Vite + PWA)</strong></span>
                <span className="text-[10px] text-emerald-400">Vercel Free</span>
              </div>
              <div className="text-center text-karnataka-yellow text-xs">⬇️ REST API & Base64 Payload</div>
              <div className="p-2 rounded-lg bg-stone-800 border border-red-500/30 flex items-center justify-between">
                <span>⚡ <strong>Backend (FastAPI + Python 3.11)</strong></span>
                <span className="text-[10px] text-red-400">Render Free</span>
              </div>
              <div className="text-center text-karnataka-yellow text-xs">⬇️ Orchestration</div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="p-1.5 rounded bg-stone-950 border border-stone-700 text-center">
                  🧠 Gemini 1.5 Flash<br/><span className="text-stone-400">Structured JSON AI</span>
                </div>
                <div className="p-1.5 rounded bg-stone-950 border border-stone-700 text-center">
                  🌦️ Open-Meteo<br/><span className="text-stone-400">Zero-Key Weather</span>
                </div>
                <div className="p-1.5 rounded bg-stone-950 border border-stone-700 text-center">
                  🗺️ Leaflet + OSRM<br/><span className="text-stone-400">Route Distances</span>
                </div>
                <div className="p-1.5 rounded bg-stone-950 border border-stone-700 text-center">
                  🗣️ Web Speech API<br/><span className="text-stone-400">Audio Speech</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 6: Conclusion, Impact & Future Scope
    {
      page: 6,
      badge: 'Section 6',
      title: 'Conclusion, Impact & Future Scope',
      titleKn: 'ಉಪಸಂಹಾರ, ಪರಿಣಾಮ ಮತ್ತು ಮುಂದಿನ ಗುರಿ',
      subtitle: 'Summary of the solution, impact, and possible future scope',
      subtitleKn: 'ಯೋಜನೆಯ ಒಟ್ಟಾರೆ ಫಲಿತಾಂಶ ಹಾಗೂ ಭವಿಷ್ಯದ ವಿಸ್ತರಣೆ',
      content: (
        <div className="space-y-4 py-2">
          {/* Metrics Row */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
            {[
              { val: '12+', lbl: 'Features' },
              { val: '500+', lbl: 'Monuments' },
              { val: '37', lbl: 'Phrases' },
              { val: '100%', lbl: 'Free Tier' },
              { val: '12', lbl: 'Corridors' },
              { val: '0s', lbl: 'Offline Load' }
            ].map((s, idx) => (
              <div key={idx} className="bg-stone-900 text-white p-2.5 rounded-xl border border-stone-800">
                <div className="text-lg font-black text-karnataka-yellow">{s.val}</div>
                <div className="text-[10px] text-stone-400 font-medium">{s.lbl}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 space-y-2">
              <h4 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Impact Created
              </h4>
              <ul className="space-y-1.5 text-stone-700 dark:text-stone-300 text-xs">
                <li>• Democratizes Karnataka heritage travel with 0 cost for travelers.</li>
                <li>• Protects tourists with hyper-local Western Ghats landslide & weather alerts.</li>
                <li>• Bridges the Kannada language gap with instant camera OCR translation.</li>
                <li>• Directs tourism revenue to local homestays, military hotels & KSRTC buses.</li>
              </ul>
            </div>

            <div className="bg-amber-50/70 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 space-y-2">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles size={16} /> Future Scope
              </h4>
              <ul className="space-y-1.5 text-stone-700 dark:text-stone-300 text-xs">
                <li>• Real-time KSRTC bus live-tracking API integration.</li>
                <li>• Augmented Reality (AR) 3D monument reconstruction of Hampi & Belur.</li>
                <li>• Community-sourced road updates from local Karnataka riders.</li>
                <li>• Expansion to neighbouring southern states (Tamil Nadu, Kerala, Goa).</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ]

  const slide = slides[currentSlide]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#FAF6F0] dark:bg-stone-950 rounded-3xl shadow-2xl border-2 border-karnataka-red/40 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Karnataka Flag Header Stripes */}
        <div className="h-2 w-full bg-karnataka-yellow" />
        <div className="h-2 w-full bg-karnataka-red" />

        {/* Modal Header Bar */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between gap-3 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-karnataka-yellow text-stone-950 flex items-center justify-center font-black text-sm">
              PPT
            </div>
            <div>
              <div className="text-xs font-bold text-karnataka-yellow uppercase tracking-wider flex items-center gap-1.5">
                <span>{slide.badge}</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded text-white">Slide {slide.page} of 6</span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white truncate max-w-md">
                {isKn && slide.titleKn ? slide.titleKn : slide.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/Yatra_AI_Presentation.pptx"
              download="Yatra_AI_Karnataka_Presentation.pptx"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-karnataka-red to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
              title="Download PowerPoint PPTX File"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Download .PPTX</span>
              <span className="sm:hidden">PPTX</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Close presentation"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 bg-stone-50/50 dark:bg-stone-950">
          <div className="mb-3">
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
              {isKn && slide.subtitleKn ? slide.subtitleKn : slide.subtitle}
            </p>
          </div>

          {slide.content}
        </div>

        {/* Modal Navigation Footer */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <button
            type="button"
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlide === i
                    ? 'w-6 bg-karnataka-red'
                    : 'w-2.5 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            disabled={currentSlide === slides.length - 1}
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-karnataka-red text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-colors shadow-xs"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  )
}
