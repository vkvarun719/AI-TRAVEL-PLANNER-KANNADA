// Calculates approximate road distance & driving duration between Karnataka stops
// Integrates free OSRM (Open Source Routing Machine) with graceful Haversine fallback

/**
 * Calculates Great-circle distance between two points in km (Haversine formula).
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Calculates estimated road transit distance & drive time taking into account
 * Karnataka road terrain (Western Ghats hairpins, city traffic, highways).
 */
export function estimateTransitBetweenStops(coordA, coordB, isGhatSection = false) {
  if (!coordA || !coordB) {
    return {
      distanceKm: 0,
      durationMins: 0,
      formattedDistance: '0 km',
      formattedDuration: '0 min',
      pathPoints: []
    }
  }

  const rawKm = calculateHaversineDistance(coordA.lat, coordA.lng, coordB.lat, coordB.lng)

  // Road curvature factor (1.35x for plains/highways, 1.55x for ghats)
  const curvatureFactor = isGhatSection ? 1.55 : 1.35
  const roadKm = Math.max(1.2, Math.round(rawKm * curvatureFactor * 10) / 10)

  // Average speed model (slower for short intra-city / ghat routes, faster for intercity)
  let avgSpeedKmh = 45
  if (isGhatSection) {
    avgSpeedKmh = 32
  } else if (roadKm < 8) {
    avgSpeedKmh = 24 // city traffic & narrow heritage bazaars
  } else if (roadKm > 60) {
    avgSpeedKmh = 58 // NH highways like NH-75, NH-48
  }

  const durationHours = roadKm / avgSpeedKmh
  const durationMins = Math.max(5, Math.round(durationHours * 60))

  let formattedDuration = `${durationMins} mins`
  if (durationMins >= 60) {
    const hrs = Math.floor(durationMins / 60)
    const mins = durationMins % 60
    formattedDuration = mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hrs`
  }

  return {
    distanceKm: roadKm,
    durationMins,
    formattedDistance: `${roadKm} km`,
    formattedDuration,
    pathPoints: [
      [coordA.lat, coordA.lng],
      [coordB.lat, coordB.lng]
    ],
    source: 'Estimate'
  }
}

/**
 * Fetches real driving path, distance, and duration from OSRM Demo API (100% Free).
 * Falls back gracefully to estimateTransitBetweenStops on network errors or timeouts.
 */
export async function fetchOsrmRoute(coordA, coordB) {
  if (!coordA || !coordB) {
    return estimateTransitBetweenStops(coordA, coordB)
  }

  const url = `https://router.project-osrm.org/route/v1/driving/${coordA.lng},${coordA.lat};${coordB.lng},${coordB.lat}?overview=full&geometries=geojson`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!res.ok) throw new Error(`OSRM HTTP error: ${res.status}`)
    const data = await res.json()

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0]
      const distanceKm = Math.round((route.distance / 1000) * 10) / 10
      const durationMins = Math.max(3, Math.round(route.duration / 60))

      let formattedDuration = `${durationMins} mins`
      if (durationMins >= 60) {
        const hrs = Math.floor(durationMins / 60)
        const mins = durationMins % 60
        formattedDuration = mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hrs`
      }

      // Convert GeoJSON [lng, lat] coordinates to Leaflet [lat, lng]
      const pathPoints = (route.geometry?.coordinates || []).map(([lng, lat]) => [lat, lng])

      return {
        distanceKm,
        durationMins,
        formattedDistance: `${distanceKm} km`,
        formattedDuration,
        pathPoints,
        source: 'OSRM Road'
      }
    }
  } catch (err) {
    // Graceful fallback to local estimation on free tier network hiccups
  }

  return estimateTransitBetweenStops(coordA, coordB)
}
