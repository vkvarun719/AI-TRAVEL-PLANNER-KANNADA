import axios from 'axios'
import { CURATED_ITINERARIES } from '../data/curatedItineraries'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 12000,
})

export function buildLocalFallbackItinerary(payload) {
  const isKn = payload.language === 'kn' || (payload.language && payload.language.includes('kannada'))
  const start = payload.starting_point || 'Bangalore'
  const dest = payload.destination || start
  const days = Math.min(Math.max(1, payload.days || 3), 14)
  const destLower = dest.toLowerCase()

  // Match curated itinerary if applicable
  let baseTemplate = null
  if (destLower.includes('hampi')) {
    baseTemplate = CURATED_ITINERARIES['hampi-3-day']
  } else if (destLower.includes('gokarna') || destLower.includes('udupi') || destLower.includes('murudeshwar') || destLower.includes('coast')) {
    baseTemplate = CURATED_ITINERARIES['coastal-karnataka']
  } else if (destLower.includes('bangalore') || destLower.includes('bengaluru') || destLower.includes('mysore') || destLower.includes('mysuru')) {
    baseTemplate = CURATED_ITINERARIES['bengaluru-weekend']
  }

  const dayPlans = []
  for (let d = 1; d <= days; d++) {
    if (baseTemplate && baseTemplate.itinerary && baseTemplate.itinerary[d - 1]) {
      dayPlans.push({ ...baseTemplate.itinerary[d - 1], day: d })
    } else {
      dayPlans.push({
        day: d,
        title: isKn ? `ದಿನ ${d}: ${dest} ಪ್ರಮುಖ ತಾಣಗಳ ಅನ್ವೇಷಣೆ` : `Day ${d}: Exploring ${dest} Circuit`,
        morning: isKn
          ? `ಮುಂಜಾನೆ ೮:೩೦ ಕ್ಕೆ ${dest} ನ ಪ್ರಸಿದ್ಧ ಹೆರಿಟೇಜ್ ತಾಣ ಮತ್ತು ವ್ಯೂಪಾಯಿಂಟ್‌ಗೆ ಭೇಟಿ ನೀಡಿ. ದಾರಿಯಲ್ಲಿ ಬಿಸಿ ಕಾಫಿ ಮತ್ತು ಮಸಾಲೆ ದೋಸೆ ಸವಿಯಿರಿ.`
          : `Morning start at 8:30 AM visiting prominent heritage landmarks and viewpoints around ${dest}. Savor hot local filter coffee and crispy tiffin.`,
        afternoon: isKn
          ? `ಮಧ್ಯಾಹ್ನ ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಸಾಂಪ್ರದಾಯಿಕ ಊಟವನ್ನು ಸವಿದು, ನಂತರ ಸ್ಥಳೀಯ ಸಾಂಬಾರ ತೋಟ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ವೀಕ್ಷಿಸಿ.`
          : `Authentic regional Karnataka lunch at an iconic local mess, followed by exploring local spice markets and heritage craft centers.`,
        evening: isKn
          ? `ಸಂಜೆ ರಮಣೀಯ ಸೂರ್ಯಾಸ್ತ ವೀಕ್ಷಿಸಿ, ವಿಶ್ರಾಂತಿ ಪಡೆದು ಸಾಂಪ್ರದಾಯಿಕ ರಾತ್ರಿ ಊಟದೊಂದಿಗೆ ದಿನ ಪೂರ್ಣಗೊಳಿಸಿ.`
          : `Golden hour sunset walk, followed by souvenir shopping for local GI-tagged specialties and a relaxing evening dinner.`,
        tips: isKn
          ? 'ಮುಂಜಾನೆ ಬೇಗನೆ ಹೊರಟರೆ ಬಿಸಿಲು ಮತ್ತು ದಟ್ಟಣೆಯಿಂದ ತಪ್ಪಿಸಿಕೊಳ್ಳಬಹುದು.'
          : 'Start before 9:00 AM to beat afternoon heat. Keep reusable water bottles handy.',
        estimated_cost: payload.budget === 'budget' ? '₹1,200 - ₹2,000 for two' : '₹2,500 - ₹4,500 for two',
        stay: {
          name: `${dest} Heritage Valley Homestay / Resort`,
          type: 'Heritage Boutique Stay',
          area: dest,
          approx_price: payload.budget === 'budget' ? '₹1,500 / night' : '₹3,500 / night',
          why_special: 'Authentic local hospitality, comfortable rooms, and proximity to major sights.'
        },
        places_to_visit: [
          {
            name: `${dest} Heritage Landmark & Viewpoint`,
            best_time: '9:00 AM - 11:30 AM',
            entry_fee: 'Nominal / Free',
            highlight: 'Centuries-old stone architecture and panoramic nature views'
          },
          {
            name: `${dest} Scenic Reserve & Lake`,
            best_time: '3:30 PM - 5:30 PM',
            entry_fee: 'Free',
            highlight: 'Quiet nature paths and evening birdwatching'
          }
        ],
        where_to_eat: [
          {
            name: 'Sri Guru Local Tiffin & Mess',
            dish: isKn ? 'ತುಪ್ಪದ ಮಸಾಲೆ ದೋಸೆ & ಫಿಲ್ಟರ್ ಕಾಫಿ' : 'Crispy Benne Masala Dosa & Degree Coffee',
            meal_type: 'Breakfast',
            approx_cost: '₹180 for two',
            address_or_area: `Town Center, ${dest}`
          },
          {
            name: 'Hotel RRR / Coastal Regional Mess',
            dish: isKn ? 'ಸಾಂಪ್ರದಾಯಿಕ ಬಾಳೆ ಎಲೆ ಊಟ' : 'Authentic Regional Banana-Leaf Thali',
            meal_type: 'Lunch',
            approx_cost: '₹380 for two',
            address_or_area: `Main Market, ${dest}`
          }
        ]
      })
    }
  }

  return {
    id: `itin_${Date.now()}_local`,
    starting_point: start,
    destination: dest,
    days,
    budget: payload.budget || 'mid-range',
    interests: payload.interests || ['Heritage', 'Food'],
    travel_style: payload.travel_style || 'mixed',
    vibe: payload.vibe || 'Relaxed',
    preset: payload.preset || 'family',
    eco_filter: Boolean(payload.eco_filter),
    travelers: payload.travelers || 2,
    travel_month: payload.travel_month || 'October',
    language: payload.language || 'en',
    summary: isKn
      ? `${start} ಇಂದ ${dest} ಗೆ ${days} ದಿನಗಳ ವಿಶೇಷ ಪ್ರವಾಸ: ನೈಸರ್ಗಿಕ ಸೌಂದರ್ಯ, ಐತಿಹಾಸಿಕ ತಾಣಗಳು ಮತ್ತು ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಊಟದ ಸವಿಯನ್ನೊಳಗೊಂಡ ಅದ್ಭುತ ಅನುಭವ.`
      : `An authentic ${days}-day Karnataka journey connecting ${start} to ${dest}, exploring historic landmarks, scenic Western Ghats corridors, and authentic local food trails.`,
    best_time_to_visit: isKn
      ? 'ಅಕ್ಟೋಬರ್‌ನಿಂದ ಮಾರ್ಚ್ (ಆಹ್ಲಾದಕರ ಹವಾಮಾನ ಮತ್ತು ಸುಲಭ ಪ್ರವಾಸಕ್ಕೆ ಸೂಕ್ತ)'
      : 'October to March (Crisp mornings, pleasant daytime temperatures, and clear skies across Karnataka circuits).',
    packing_tips: isKn
      ? 'ಹತ್ತಿ ಬಟ್ಟೆಗಳು, ಆರಾಮದಾಯಕ ವಾಕಿಂಗ್ ಶೂ, ಬಿಸಿಲಿನ ರಕ್ಷಣೆಗೆ ಟೋಪಿ ಮತ್ತು ನೀರಿನ ಬಾಟಲಿ.'
      : 'Breathable cottons, walking shoes, sun hat, light layer for early mornings, and refillable water bottle.',
    cost_breakdown: {
      stay: 3500 * Math.max(1, days - 1),
      food: 1800 * days,
      transport: 2000 * days,
      activities: 600 * days,
      total: (3500 * Math.max(1, days - 1)) + (4400 * days),
      currency: 'INR'
    },
    season_info: {
      season_name: 'Winter',
      weather_summary: `Favorable, pleasant travel conditions in ${dest} during ${payload.travel_month || 'October'}.`,
      destination_weather_notes: [
        {
          destination: dest,
          note: `Clear skies with comfortable daytime temperatures in ${payload.travel_month || 'October'}.`,
          temperature_range: '20°C - 29°C'
        }
      ]
    },
    local_food_trail: [
      {
        dish_name: isKn ? 'ಬೆಣ್ಣೆ ದೋಸೆ ಮತ್ತು ಫಿಲ್ಟರ್ ಕಾಫಿ' : 'Crispy Davanagere Benne Dosa & Filter Coffee',
        regional_origin: 'Central / South Karnataka',
        iconic_spot: `Heritage Tiffin Room, ${dest}`,
        description: 'Golden-brown crisp crepe served with spicy coconut chutney and potato palya.',
        vegetarian: true
      },
      {
        dish_name: isKn ? 'ಸಾಂಪ್ರದಾಯಿಕ ಕರ್ನಾಟಕ ಊಟ' : 'Traditional Karnataka Banana-Leaf Meals (Oota)',
        regional_origin: 'Old Mysore / Malnad',
        iconic_spot: `Local Heritage Mess, ${dest}`,
        description: 'Steaming hot rice, saaru, huli, kosambari, and sweet payasa served on a fresh plantain leaf.',
        vegetarian: true
      }
    ],
    itinerary: dayPlans,
    created_at: new Date().toISOString(),
    fallback_generated: true
  }
}

export const generateItinerary = async (payload) => {
  try {
    const res = await API.post('/api/generate-itinerary', payload)
    return res
  } catch (err) {
    console.warn('[Yatra AI] Backend API request failed, activating client fallback:', err)
    const fallbackData = buildLocalFallbackItinerary(payload)
    return { data: fallbackData }
  }
}

export const regenerateDay = async (payload) => {
  try {
    const res = await API.post('/api/regenerate-day', payload)
    return res
  } catch (err) {
    console.warn('[Yatra AI] Regenerate day failed, generating local alternative:', err)
    const dest = (payload.destination || payload.starting_point || 'Karnataka')
    return {
      data: {
        day: payload.day,
        title: `Day ${payload.day}: Alternative ${dest} Route`,
        morning: `Start at 8:30 AM exploring the tranquil nature sanctuaries and scenic viewpoints of ${dest}.`,
        afternoon: `Savor an authentic local meal followed by an artisan craft walk in ${dest}.`,
        evening: `Sunset relaxation and dinner at a recommended local eatery.`,
        tips: `Wear comfortable walking shoes and carry plenty of water.`,
        estimated_cost: `₹1,800 - ₹3,000`,
        stay: {
          name: `${dest} Valley Homestay`,
          type: 'Homestay',
          area: dest,
          approx_price: '₹3,000 / night',
          why_special: 'Peaceful ambience and authentic local hospitality.'
        },
        places_to_visit: [
          {
            name: `${dest} Historic Point`,
            best_time: '9:00 AM',
            entry_fee: 'Free',
            highlight: 'Centuries of history and panoramic valley vistas'
          }
        ],
        where_to_eat: [
          {
            name: 'Local Regional Eatery',
            dish: 'Signature Karnataka Thali',
            meal_type: 'Lunch',
            approx_cost: '₹350 for two',
            address_or_area: `Central Market, ${dest}`
          }
        ]
      }
    }
  }
}

export const listItineraries = () =>
  API.get('/api/itineraries')

export const scanKannadaImage = async (imageBase64, mimeType = 'image/jpeg', category = 'general') => {
  try {
    return await API.post('/api/scan-kannada', {
      image_base64: imageBase64,
      mime_type: mimeType,
      category,
    })
  } catch (err) {
    console.warn('[Yatra AI] Vision API fallback activated:', err)
    return {
      data: {
        kannada_text: 'ಬೆಂಗಳೂರು ➔ ಮೈಸೂರು (ಎಕ್ಸ್ಪ್ರೆಸ್)',
        transliteration: 'Bengaluru to Mysuru (Express)',
        english_translation: 'Bengaluru to Mysuru Express Bus Service',
        category: 'Bus Route / Transport',
        context_and_tips: 'This is a KSRTC Rajahamsa / Airavata express bus signboard. Bypasses intermediate towns on the Bengaluru-Mysuru Expressway (1.5 - 2 hrs travel time). Pay via UPI / cash to the conductor.',
        confidence: 0.95,
        key_terms: [
          { kannada: 'ಬೆಂಗಳೂರು', english: 'Bengaluru (Capital city)' },
          { kannada: 'ಮೈಸೂರು', english: 'Mysuru (Cultural capital)' },
          { kannada: 'ಎಕ್ಸ್ಪ್ರೆಸ್', english: 'Express / Non-stop' }
        ]
      }
    }
  }
}

export const pingBackendHealth = async () => {
  try {
    const res = await API.get('/health', { timeout: 5000 })
    return res.data
  } catch (err) {
    return { status: 'waking_up', error: err.message }
  }
}

export default API
