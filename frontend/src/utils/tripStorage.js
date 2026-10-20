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

// ─── Shareable Link Generator ──────────────────────────────────────────────

export function generateShareableUrl(tripData) {
  if (typeof window === 'undefined') return ''
  const origin = window.location.origin
  
  // If trip is saved with an ID, construct simple share link
  if (tripData.id) {
    return `${origin}?tripId=${encodeURIComponent(tripData.id)}`
  }

  // Otherwise, create a clean payload parameter
  const summaryPayload = {
    hub: tripData.starting_point,
    days: tripData.days,
    budget: tripData.budget,
    vibe: tripData.vibe
  }
  return `${origin}?share=${encodeURIComponent(JSON.stringify(summaryPayload))}`
}
