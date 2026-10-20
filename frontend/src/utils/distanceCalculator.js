// Calculates approximate road distance & driving duration between Karnataka stops

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
      formattedDuration: '0 min'
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
    formattedDuration
  }
}
