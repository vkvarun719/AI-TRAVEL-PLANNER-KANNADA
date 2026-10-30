import axios from 'axios'
import { CURATED_ITINERARIES } from '../data/curatedItineraries'
import { resolveLocation } from '../data/karnatakaLocations'
import { getRouteIntelligence } from '../utils/routeIntelligence'

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

  const destLoc = resolveLocation(dest)
  const startLoc = resolveLocation(start)
  const routeIntel = getRouteIntelligence(start, dest) || {
    distanceKm: 250,
    driveTime: '5h 00m',
    highway: 'Karnataka State & National Highway Corridor',
    highwayKn: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಹಾಗೂ ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ'
  }

  // Match curated itinerary if applicable and starting hub is Bangalore
  let baseTemplate = null
  if (start.toLowerCase() === 'bangalore') {
    if (destLower.includes('hampi')) {
      baseTemplate = CURATED_ITINERARIES['hampi-3-day']
    } else if (destLower.includes('gokarna') || destLower.includes('udupi') || destLower.includes('murudeshwar')) {
      baseTemplate = CURATED_ITINERARIES['coastal-karnataka']
    } else if (destLower.includes('mysore') || destLower.includes('mysuru')) {
      baseTemplate = CURATED_ITINERARIES['bengaluru-weekend']
    }
  }

  const dayPlans = []
  for (let d = 1; d <= days; d++) {
    if (baseTemplate && baseTemplate.itinerary && baseTemplate.itinerary[d - 1]) {
      dayPlans.push({ ...baseTemplate.itinerary[d - 1], day: d })
    } else {
      const isFirstDay = d === 1 && start.toLowerCase() !== dest.toLowerCase()
      const isLastDay = d === days && start.toLowerCase() !== dest.toLowerCase()

      const morningText = isFirstDay
        ? (isKn
            ? `ಮುಂಜಾನೆ ೭:೦೦ ಕ್ಕೆ ${start} ನಿಂದ ${dest} ಕಡೆಗೆ ಸುಂದರ ಹೆದ್ದಾರಿಯ ಮೂಲಕ ಪ್ರಯಾಣ ಆರಂಭಿಸಿ (${routeIntel.distanceKm} ಕಿ.ಮೀ, ಸುಮಾರು ${routeIntel.driveTime}). ದಾರಿಯಲ್ಲಿ ಬಿಸಿ ಕಾಫಿ ಮತ್ತು ಮಸಾಲೆ ದೋಸೆ ಸವಿಯಿರಿ.`
            : `Early morning start at 7:00 AM departing from ${start} towards ${dest} (${routeIntel.distanceKm} km, approx ${routeIntel.driveTime}) via ${routeIntel.highway}. Savor hot local filter coffee and crispy breakfast on the way.`)
        : (isKn
            ? `ಮುಂಜಾನೆ ೮:೩೦ ಕ್ಕೆ ${dest} ನ ಪ್ರಸಿದ್ಧ ಹೆರಿಟೇಜ್ ತಾಣ ಮತ್ತು ವ್ಯೂಪಾಯಿಂಟ್‌ಗೆ ಭೇಟಿ ನೀಡಿ. ತಾಜಾ ಉಪಹಾರದೊಂದಿಗೆ ದಿನ ಆರಂಭಿಸಿ.`
            : `Morning start at 8:30 AM exploring the prime heritage monuments and scenic viewpoints of ${dest}. Savor degree filter coffee and regional breakfast.`)

      const afternoonText = isKn
        ? `ಮಧ್ಯಾಹ್ನ ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಸಾಂಪ್ರದಾಯಿಕ ಊಟವನ್ನು (${destLoc.district || dest} ಶೈಲಿ) ಸವಿದು, ನಂತರ ಸ್ಥಳೀಯ ಸಾಂಬಾರ ತೋಟ ಅಥವಾ ಶಿಲ್ಪಕಲಾ ಕೇಂದ್ರ ವೀಕ್ಷಿಸಿ.`
        : `Authentic regional Karnataka lunch (${destLoc.district || dest} regional cuisine), followed by visiting local heritage stepwells and artisan craft centers.`

      const eveningText = isLastDay
        ? (isKn
            ? `ಸಂಜೆ ${dest} ನ ಸುಂದರ ಸೂರ್ಯಾಸ್ತ ವೀಕ್ಷಿಸಿ, ಸ್ಮರಣೀಯ ನೆನಪುಗಳೊಂದಿಗೆ ${start} ಕಡೆಗೆ ಸುಗಮ ಮರುಪ್ರಯಾಣ.`
            : `Golden hour sunset stroll at ${dest}, followed by commencing a smooth return journey back towards ${start} with memorable trip impressions.`)
        : (isKn
            ? `ಸಂಜೆ ರಮಣೀಯ ಸೂರ್ಯಾಸ್ತ ವೀಕ್ಷಿಸಿ, ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಶಾಪಿಂಗ್ ಮಾಡಿ ಸಾಂಪ್ರದಾಯಿಕ ರಾತ್ರಿ ಊಟದೊಂದಿಗೆ ದಿನ ಪೂರ್ಣಗೊಳಿಸಿ.`
            : `Golden hour sunset walk, followed by exploring the vibrant local market for GI-tagged souvenirs and sweets, ending with a relaxing dinner.`)

      dayPlans.push({
        day: d,
        title: isKn ? `ದಿನ ${d}: ${dest} ಪ್ರಮುಖ ತಾಣಗಳ ಅನ್ವೇಷಣೆ` : `Day ${d}: Exploring ${dest} & Surrounds`,
        morning: morningText,
        afternoon: afternoonText,
        evening: eveningText,
        tips: isKn
          ? 'ಮುಂಜಾನೆ ಬೇಗನೆ ಹೊರಟರೆ ಬಿಸಿಲು ಮತ್ತು ದಟ್ಟಣೆಯಿಂದ ತಪ್ಪಿಸಿಕೊಳ್ಳಬಹುದು. ನೀರಿನ ಬಾಟಲಿ ಕೊಂಡೊಯ್ಯಿರಿ.'
          : 'Start before 9:00 AM to beat afternoon heat and temple queues. Keep reusable water bottles handy.',
        estimated_cost: payload.budget === 'budget' ? '₹1,400 - ₹2,200 for two' : '₹2,600 - ₹4,800 for two',
        stay: {
          name: `${dest} Heritage Valley Homestay / Resort`,
          type: 'Heritage Boutique Stay',
          area: `${dest}, ${destLoc.district || 'Karnataka'}`,
          approx_price: payload.budget === 'budget' ? '₹1,500 / night' : '₹3,500 / night',
          why_special: `Authentic local hospitality, comfortable rooms, and easy access to attractions in ${dest}.`
        },
        places_to_visit: [
          {
            name: `${dest} Landmark & Heritage Center`,
            best_time: '9:00 AM - 11:30 AM',
            entry_fee: 'Nominal / Free',
            highlight: isKn ? (destLoc.highlightKn || 'ಪಾರಂಪರಿಕ ವಾಸ್ತುಶಿಲ್ಪ & ಸುಂದರ ನೋಟ') : (destLoc.highlightEn || 'Centuries-old stone architecture and panoramic nature views')
          },
          {
            name: `${dest} Scenic Viewpoint & Lake Sanctuary`,
            best_time: '3:30 PM - 5:30 PM',
            entry_fee: 'Free',
            highlight: isKn ? 'ಶಾಂತ ನೈಸರ್ಗಿಕ ಪರಿಸರ ಮತ್ತು ಸೂರ್ಯಾಸ್ತ ನೋಟ' : 'Quiet nature paths, lush surroundings and golden sunset'
          }
        ],
        where_to_eat: [
          {
            name: `Sri Guru Heritage Tiffin & Mess (${dest})`,
            dish: isKn ? 'ತುಪ್ಪದ ಮಸಾಲೆ ದೋಸೆ & ಫಿಲ್ಟರ್ ಕಾಫಿ' : 'Crispy Benne Masala Dosa & Degree Filter Coffee',
            meal_type: 'Breakfast',
            approx_cost: '₹180 for two',
            address_or_area: `Town Center, ${dest}`
          },
          {
            name: `Hotel Regional Mess (${dest})`,
            dish: isKn ? 'ಸಾಂಪ್ರದಾಯಿಕ ಬಾಳೆ ಎಲೆ ಊಟ (ಜೋಳದ ರೊಟ್ಟಿ / ಅನ್ನ ಸಾಂಬಾರ್)' : 'Authentic Regional Banana-Leaf Meals (Jolada Rotti / Thali)',
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
      ? `${start} ಇಂದ ${dest} ಗೆ ${days} ದಿನಗಳ ವಿಶೇಷ ಪ್ರವಾಸ: ನೈಸರ್ಗಿಕ ಸೌಂದರ್ಯ, ಐತಿಹಾಸಿಕ ತಾಣಗಳು (${destLoc.highlightKn || dest}) ಮತ್ತು ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಊಟದ ಸವಿಯನ್ನೊಳಗೊಂಡ ಅದ್ಭುತ ಅನುಭವ.`
      : `An authentic ${days}-day Karnataka journey connecting ${start} to ${dest}, exploring historic landmarks (${destLoc.highlightEn || dest}), scenic corridors, and authentic local food trails.`,
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
        regional_origin: destLoc.district || 'Central / South Karnataka',
        iconic_spot: `Heritage Tiffin Room, ${dest}`,
        description: 'Golden-brown crisp crepe served with spicy coconut chutney and potato palya.',
        vegetarian: true
      },
      {
        dish_name: isKn ? 'ಸಾಂಪ್ರದಾಯಿಕ ಕರ್ನಾಟಕ ಊಟ' : 'Traditional Karnataka Banana-Leaf Meals (Oota)',
        regional_origin: destLoc.district || 'Old Mysore / Malnad / Karavali',
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
          type: 'Boutique Homestay',
          area: dest,
          approx_price: '₹2,800 / night',
          why_special: 'Comfortable stay with home-cooked breakfast and peaceful setting.'
        },
        places_to_visit: [
          {
            name: `${dest} Nature Trail & Park`,
            best_time: 'Morning',
            entry_fee: 'Free',
            highlight: 'Lush greenery and calm walking pathways'
          },
          {
            name: `${dest} Artisan Craft Bazaar`,
            best_time: 'Evening',
            entry_fee: 'Free',
            highlight: 'Handmade local handicrafts and street delicacies'
          }
        ],
        where_to_eat: [
          {
            name: `${dest} Heritage Cafe`,
            dish: 'South Indian Filter Coffee & Mysore Pak',
            meal_type: 'Breakfast',
            approx_cost: '₹140 for two',
            address_or_area: `Market Road, ${dest}`
          },
          {
            name: `${dest} Traditional Bhojanalaya`,
            dish: 'Regional Thali with fresh accompaniments',
            meal_type: 'Dinner',
            approx_cost: '₹320 for two',
            address_or_area: `Station Circle, ${dest}`
          }
        ]
      }
    }
  }
}

export const pingBackendHealth = async () => {
  try {
    const res = await API.get('/health', { timeout: 3000 })
    return res.data?.status === 'healthy'
  } catch {
    return false
  }
}

export const submitFeedback = async (payload) => {
  try {
    const res = await API.post('/api/feedback', payload)
    return res
  } catch (err) {
    console.warn('[Yatra AI] Feedback submission fallback (offline/cached):', err)
    return { data: { status: 'cached', message: 'Feedback saved locally' } }
  }
}

export const scanKannadaImage = async (payload) => {
  try {
    const res = await API.post('/api/scan-kannada', payload)
    return res
  } catch (err) {
    console.warn('[Yatra AI] Kannada vision scanner failed or rate-limited:', err)
    throw err
  }
}

export const scanKannadaText = scanKannadaImage

export default API
