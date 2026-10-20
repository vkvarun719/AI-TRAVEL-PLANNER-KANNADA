// Manages saved trips, trip editing, favorites wishlist, and shareable links

const SAVED_TRIPS_KEY = 'yatra_saved_trips'
const FAVORITES_KEY = 'yatra_favorite_destinations'

export function getSavedTrips() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(SAVED_TRIPS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to load trips from storage:', err)
    return []
  }
}

export function saveTrip(tripData) {
  if (!tripData) return null
  const trips = getSavedTrips()

  const tripId = tripData.id || `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  const defaultTitle = `${tripData.days || 3}-Day ${tripData.starting_point || 'Karnataka'} Trip`

  const existingIndex = trips.findIndex(t => t.id === tripId)
  const tripRecord = {
    ...tripData,
    id: tripId,
    title: tripData.title || defaultTitle,
    savedAt: new Date().toISOString()
  }

  if (existingIndex >= 0) {
    trips[existingIndex] = tripRecord
  } else {
    trips.unshift(tripRecord)
  }

  try {
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips))
  } catch (err) {
    console.error('Failed to save trip:', err)
  }

  return tripRecord
}

export function renameTrip(tripId, newTitle) {
  const trips = getSavedTrips()
  const idx = trips.findIndex(t => t.id === tripId)
  if (idx >= 0) {
    trips[idx].title = newTitle.trim()
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips))
    return trips[idx]
  }
  return null
}

export function deleteTrip(tripId) {
  const trips = getSavedTrips()
  const filtered = trips.filter(t => t.id !== tripId)
  localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(filtered))
  return filtered
}

export function getTripById(tripId) {
  const trips = getSavedTrips()
  return trips.find(t => t.id === tripId) || null
}

export function isTripSaved(tripId) {
  if (!tripId) return false
  const trips = getSavedTrips()
  return trips.some(t => t.id === tripId)
}

// ─── Destination Favorites / Wishlist ───────────────────────────────────────

export function getFavoriteDestinations() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function toggleFavoriteDestination(destId) {
  const favs = getFavoriteDestinations()
  const exists = favs.includes(destId)
  let updated = []
  if (exists) {
    updated = favs.filter(id => id !== destId)
  } else {
    updated = [...favs, destId]
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
  return updated
}

export function isDestinationFavorite(destId) {
  const favs = getFavoriteDestinations()
  return favs.includes(destId)
}

// ─── Shareable Link Generator & Portable URL Serialization ─────────────────

export function encodeTripToUrl(tripData) {
  try {
    const compact = {
      starting_point: tripData.starting_point,
      days: tripData.days,
      budget: tripData.budget,
      interests: tripData.interests,
      travel_style: tripData.travel_style,
      vibe: tripData.vibe,
      travelers: tripData.travelers,
      travel_month: tripData.travel_month,
      language: tripData.language,
      itinerary: tripData.itinerary,
      local_food_trail: tripData.local_food_trail,
      cost_breakdown: tripData.cost_breakdown,
      season_info: tripData.season_info,
      summary: tripData.summary,
      best_time_to_visit: tripData.best_time_to_visit,
      packing_tips: tripData.packing_tips,
      title: tripData.title,
      id: tripData.id || `trip_${Date.now()}`
    }
    const jsonStr = JSON.stringify(compact)
    // UTF-8 safe base64 encoding
    const base64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode('0x' + p1)
    }))
    return base64
  } catch (err) {
    console.error('Failed to encode trip:', err)
    return null
  }
}

export function decodeTripFromUrl(encodedStr) {
  try {
    const raw = atob(encodedStr)
    const jsonStr = decodeURIComponent(
      Array.prototype.map.call(raw, (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
    return JSON.parse(jsonStr)
  } catch (err) {
    console.error('Failed to decode trip:', err)
    return null
  }
}

export function generateShareableUrl(tripData) {
  if (typeof window === 'undefined') return ''
  const origin = window.location.origin
  const encoded = encodeTripToUrl(tripData)
  if (encoded) {
    return `${origin}?tripData=${encodeURIComponent(encoded)}`
  }
  return `${origin}?tripId=${encodeURIComponent(tripData.id || '')}`
}

// ─── Travel Journal & Memory Timeline ──────────────────────────────────────

const JOURNAL_KEY = 'yatra_travel_journal'

const DEFAULT_SAMPLE_JOURNAL = [
  {
    id: 'entry_hampi_sunrise',
    placeName: 'Matanga Hill, Hampi',
    visitDate: '2025-11-14',
    note: 'Woke up at 5:00 AM to climb the boulders. The 360-degree sunrise view over Achyutaraya temple ruins and Tungabhadra river was pure magic!',
    photoUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    visited: true,
    rating: 5,
    createdAt: '2025-11-14T08:00:00.000Z'
  },
  {
    id: 'entry_coorg_coffee',
    placeName: 'Mandalpatti Peak, Coorg',
    visitDate: '2025-12-05',
    note: 'Thrilling 4x4 Jeep ride through mist and dense coffee plantations. Tasted fresh estate filter coffee and piping hot Akki Rotti at the summit!',
    photoUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    visited: true,
    rating: 5,
    createdAt: '2025-12-05T10:30:00.000Z'
  }
]

export function getJournalEntries() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(JOURNAL_KEY)
    if (!raw) {
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(DEFAULT_SAMPLE_JOURNAL))
      return DEFAULT_SAMPLE_JOURNAL
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to load journal entries:', err)
    return []
  }
}

export function saveJournalEntry(entry) {
  const entries = getJournalEntries()
  const entryId = entry.id || `journal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
  const record = {
    ...entry,
    id: entryId,
    createdAt: entry.createdAt || new Date().toISOString()
  }

  const existingIdx = entries.findIndex(e => e.id === entryId)
  if (existingIdx >= 0) {
    entries[existingIdx] = record
  } else {
    entries.unshift(record)
  }

  try {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries))
  } catch (err) {
    console.error('Failed to save journal entry:', err)
  }
  return record
}

export function deleteJournalEntry(entryId) {
  const entries = getJournalEntries()
  const filtered = entries.filter(e => e.id !== entryId)
  try {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(filtered))
  } catch (err) {
    console.error('Failed to delete journal entry:', err)
  }
  return filtered
}

