import { getCoordinatesForPlace } from '../data/karnatakaCoordinates'

// WMO Weather Interpretation Codes (WW)
const WMO_CODE_MAP = {
  0: { label: 'Clear Sky', labelKn: 'ಸ್ಪಷ್ಟ ಆಕಾಶ', icon: '☀️' },
  1: { label: 'Mainly Clear', labelKn: 'ಮುಖ್ಯವಾಗಿ ಶುಭ್ರ', icon: '🌤️' },
  2: { label: 'Partly Cloudy', labelKn: 'ಭಾಗಶಃ ಮೋಡ', icon: '⛅' },
  3: { label: 'Overcast', labelKn: 'ದಟ್ಟ ಮೋಡ', icon: '☁️' },
  45: { label: 'Foggy / Mist', labelKn: 'ಮಂಜು ಆವರಿಸಿದೆ', icon: '🌫️' },
  48: { label: 'Depositing Rime Fog', labelKn: 'ದಟ್ಟ ಮಂಜು', icon: '🌫️' },
  51: { label: 'Light Drizzle', labelKn: 'ಹಗುರ ತುಂತುರು', icon: '🌦️' },
  53: { label: 'Moderate Drizzle', labelKn: 'ತುಂತುರು ಮಳೆ', icon: '🌦️' },
  55: { label: 'Dense Drizzle', labelKn: 'ದಟ್ಟ ತುಂತುರು', icon: '🌧️' },
  61: { label: 'Slight Rain', labelKn: 'ಸಾಧಾರಣ ಮಳೆ', icon: '🌧️' },
  63: { label: 'Moderate Rain', labelKn: 'ಮಳೆ ಸುರಿಯುತ್ತಿದೆ', icon: '🌧️' },
  65: { label: 'Heavy Monsoon Rain', labelKn: 'ಭಾರೀ ಮಳೆ', icon: '⛈️' },
  80: { label: 'Rain Showers', labelKn: 'ಮಳೆಯ ಸಿಂಚನ', icon: '🌦️' },
  81: { label: 'Moderate Showers', labelKn: 'ದೊಡ್ಡ ಮಳೆ', icon: '🌧️' },
  82: { label: 'Violent Cloudburst', labelKn: 'ಘೋರ ಮಳೆ', icon: '⛈️' },
  95: { label: 'Thunderstorm', labelKn: 'ಗುಡುಗು ಮಿಂಚಿನ ಮಳೆ', icon: '⛈️' }
}

/**
 * Fetches live 3-day weather forecast from Open-Meteo (100% Free, No API key).
 */
export async function fetchLiveForecast(placeName, locality = '') {
  const coords = getCoordinatesForPlace(placeName, locality)
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat.toFixed(4)}&longitude=${coords.lng.toFixed(4)}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FKolkata`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4500)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!res.ok) throw new Error(`Weather HTTP status: ${res.status}`)
    const data = await res.json()

    const currentCode = data.current?.weather_code ?? 0
    const currentWeather = WMO_CODE_MAP[currentCode] || { label: 'Fair', labelKn: 'ಸಾಮಾನ್ಯ', icon: '🌤️' }

    const dailyForecast = []
    const dates = data.daily?.time || []
    const maxTemps = data.daily?.temperature_2m_max || []
    const minTemps = data.daily?.temperature_2m_min || []
    const codes = data.daily?.weather_code || []
    const precips = data.daily?.precipitation_sum || []

    for (let i = 0; i < Math.min(3, dates.length); i++) {
      const code = codes[i] ?? 0
      const wmo = WMO_CODE_MAP[code] || { label: 'Pleasant', labelKn: 'ಆಹ್ಲಾದಕರ', icon: '🌤️' }
      dailyForecast.push({
        date: dates[i],
        maxTemp: Math.round(maxTemps[i]),
        minTemp: Math.round(minTemps[i]),
        precipitation: precips[i] || 0,
        weather: wmo.label,
        weatherKn: wmo.labelKn,
        icon: wmo.icon
      })
    }

    return {
      success: true,
      currentTemp: Math.round(data.current?.temperature_2m ?? 26),
      humidity: data.current?.relative_humidity_2m ?? 65,
      windSpeed: Math.round(data.current?.wind_speed_10m ?? 10),
      weatherSummary: currentWeather.label,
      weatherSummaryKn: currentWeather.labelKn,
      icon: currentWeather.icon,
      forecast: dailyForecast,
      source: 'Open-Meteo Live API'
    }
  } catch (err) {
    console.warn(`[Weather] Open-Meteo forecast fallback for ${placeName}:`, err.message)
    // Intelligent offline seasonal estimation
    return {
      success: false,
      currentTemp: 27,
      humidity: 60,
      windSpeed: 12,
      weatherSummary: 'Typical Karnataka Sunshine',
      weatherSummaryKn: 'ಸಾಮಾನ್ಯ ಬಿಸಿಲು',
      icon: '🌤️',
      forecast: [
        { date: 'Day 1', maxTemp: 29, minTemp: 20, precipitation: 0, weather: 'Pleasant', weatherKn: 'ಆಹ್ಲಾದಕರ', icon: '🌤️' },
        { date: 'Day 2', maxTemp: 30, minTemp: 21, precipitation: 0, weather: 'Clear Sky', weatherKn: 'ಶುಭ್ರ', icon: '☀️' },
        { date: 'Day 3', maxTemp: 28, minTemp: 19, precipitation: 2, weather: 'Partly Cloudy', weatherKn: 'ಮೋಡ', icon: '⛅' }
      ],
      source: 'Seasonal Average (Offline Fallback)'
    }
  }
}

/**
 * Checks for critical Karnataka seasonal safety hazards.
 */
export function getKarnatakaHazardWarnings(destinationName = '', travelMonth = 'October', maxTemp = 28, precip = 0) {
  const warnings = []
  const nameLower = destinationName.toLowerCase()
  const monthLower = travelMonth.toLowerCase()

  const isMonsoonMonth = ['june', 'july', 'august', 'september'].some(m => monthLower.includes(m))
  const isSummerMonth = ['march', 'april', 'may', 'june'].some(m => monthLower.includes(m))
  const isPreMonsoonDry = ['february', 'march', 'april', 'may'].some(m => monthLower.includes(m))

  // 1. Western Ghats Landslide & Leech Hazard
  const isWesternGhats = ['coorg', 'madikeri', 'agumbe', 'sakleshpur', 'kudremukh', 'chikmagalur', 'shiradi', 'charmadi'].some(p => nameLower.includes(p))
  if (isWesternGhats && (isMonsoonMonth || precip > 15)) {
    warnings.push({
      id: 'ghats-landslide',
      severity: 'high',
      title: 'Western Ghats Monsoon & Landslide Risk',
      titleKn: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಮಳೆ ಹಾಗೂ ಭೂಕುಸಿತದ ಎಚ್ಚರಿಕೆ',
      message: 'Heavy rainfall in ghat sections. Shiradi (NH-75) and Charmadi passes may experience fog, debris, or slow traffic. Carry leech socks, waterproof covers, and check road updates before driving.',
      messageKn: 'ಘಾಟ್ ರಸ್ತೆಗಳಲ್ಲಿ ಭಾರೀ ಮಳೆಯಾಗುತ್ತಿದೆ. ಶಿರಾಡಿ ಮತ್ತು ಚಾರ್ಮಾಡಿ ರಸ್ತೆಗಳಲ್ಲಿ ಜಾಗರೂಕರಾಗಿರಿ. ಜಿಗಣೆ ಸಾಕ್ಸ್ ಮತ್ತು ವಾಹನ ಮುನ್ನೆಚ್ಚರಿಕೆ ವಹಿಸಿ.',
      icon: '🌧️'
    })
  }

  // 2. Jog Falls Dry Season Notice
  const isJogFalls = nameLower.includes('jog') || nameLower.includes('sagara') || nameLower.includes('sharavathi')
  if (isJogFalls && isPreMonsoonDry) {
    warnings.push({
      id: 'jog-falls-dry',
      severity: 'medium',
      title: 'Jog Falls Low Flow Season',
      titleKn: 'ಜೋಗ ಜಲಪಾತ - ಕಡಿಮೆ ನೀರಿನ ಹರಿವು',
      message: 'Jog Falls water volume is currently controlled by Linganamakki Dam and is thin/trickling during pre-monsoon summer. Peak visual grandeur is best witnessed from July to October.',
      messageKn: 'ಬೇಸಿಗೆಯಲ್ಲಿ ಲಿಂಗನಮಕ್ಕಿ ಅಣೆಕಟ್ಟಿನಿಂದ ನೀರಿನ ಹರಿವು ಕಡಿಮೆಯಿರುತ್ತದೆ. ಜುಲೈಯಿಂದ ಅಕ್ಟೋಬರ್ ಅವಧಿಯಲ್ಲಿ ಭೇಟಿ ನೀಡುವುದು ಸೂಕ್ತ.',
      icon: '⚠️'
    })
  }

  // 3. Extreme Heat in Hampi / Badami Heritage Plains
  const isHeritagePlains = ['hampi', 'badami', 'pattadakal', 'aihole', 'bijapur', 'vijayapura', 'kalaburagi', 'bidar'].some(p => nameLower.includes(p))
  if (isHeritagePlains && (isSummerMonth || maxTemp >= 36)) {
    warnings.push({
      id: 'hampi-heat',
      severity: 'high',
      title: 'Extreme Heat & Sun Exposure (>36°C)',
      titleKn: 'ತೀವ್ರ ಬಿಸಿಲು ಹಾಗೂ ತಾಪಮಾನದ ಮುನ್ನೆಚ್ಚರಿಕೆ',
      message: 'Open boulder landscape absorbs intense heat by midday. Start temple treks by 6:00 AM, avoid climbing Matanga hill between 12 PM - 3:30 PM, drink tender coconut water, and wear wide sunhats.',
      messageKn: 'ಹಂಪಿಯ ಕಲ್ಲಿನ ಬೆಟ್ಟಗಳು ಮಧ್ಯಾಹ್ನ ತೀವ್ರವಾಗಿ ಕಾಯುತ್ತವೆ. ಬೆಳಗ್ಗೆ ೬ ಗಂಟೆಯಿಂದಲೇ ಪ್ರವಾಸ ಆರಂಭಿಸಿ, ಸಾಕಷ್ಟು ನೀರು ಮತ್ತು ಎಳನೀರು ಕುಡಿಯಿರಿ.',
      icon: '🔥'
    })
  }

  // 4. Coastal Karavali High Surf & Swell Advisory
  const isCoastal = ['gokarna', 'karwar', 'udupi', 'malpe', 'mangalore', 'mangaluru', 'murudeshwar'].some(p => nameLower.includes(p))
  if (isCoastal && isMonsoonMonth) {
    warnings.push({
      id: 'coastal-rough-sea',
      severity: 'medium',
      title: 'Arabian Sea High Tide & Undercurrent Warning',
      titleKn: 'ಅರಬ್ಬಿ ಸಮುದ್ರದ ಅಲೆಗಳ ಎಚ್ಚರಿಕೆ',
      message: 'Southwest monsoon causes dangerous rip currents along Karavali beaches. Swimming in open sea is strictly prohibited; enjoy sunsets safely from cliff viewpoints.',
      messageKn: 'ಮಳೆಗಾಲದಲ್ಲಿ ಕರಾವಳಿ ತೀರದಲ್ಲಿ ಬಲವಾದ ಅಲೆಗಳಿರುತ್ತವೆ. ಸಮುದ್ರಕ್ಕೆ ಇಳಿಯುವುದನ್ನು ನಿಷೇಧಿಸಲಾಗಿದೆ; ಸುರಕ್ಷಿತ ವೀಕ್ಷಣಾ ಸ್ಥಳಗಳಲ್ಲಿ ನಿಲ್ಲಿ.',
      icon: '🌊'
    })
  }

  return warnings
}
