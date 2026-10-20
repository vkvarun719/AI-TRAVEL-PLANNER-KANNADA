import React, { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  MapPin, Compass, Navigation, ExternalLink, Clock,
  Car, Utensils, Hotel, Eye, Layers, Sparkles
} from 'lucide-react'
import { getCoordinatesForPlace, KARNATAKA_COORDINATES } from '../data/karnatakaCoordinates'
import { estimateTransitBetweenStops, fetchOsrmRoute } from '../utils/distanceCalculator'
import { useLanguage } from '../context/LanguageContext'

// Fix default leaflet marker icon issue in bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function DayMapViewer({ startingPoint = 'Bangalore', itinerary = [] }) {
  const { language, t } = useLanguage()
  const isKn = language === 'kn'

  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersLayerRef = useRef(null)
  const polylineLayerRef = useRef(null)

  const [selectedDay, setSelectedDay] = useState(1) // 0 = All Days, 1, 2, 3...
  const [activeStopIndex, setActiveStopIndex] = useState(0)
  const [osrmLegs, setOsrmLegs] = useState([])
  const [isRoutingLoading, setIsRoutingLoading] = useState(false)

  // Build structured stops list per day
  const daysData = itinerary.map((dayPlan, dayIdx) => {
    const stops = []
    let orderCounter = 1

    // 1. Places to Visit
    if (dayPlan.places_to_visit && dayPlan.places_to_visit.length > 0) {
      dayPlan.places_to_visit.forEach((place) => {
        const coords = getCoordinatesForPlace(place.name, dayPlan.title, orderCounter)
        stops.push({
          type: 'attraction',
          order: orderCounter++,
          name: place.name,
          details: place.highlight,
          badge: place.entry_fee || 'Sight',
          timing: place.best_time,
          coords,
          color: '#C8102E' // Karnataka Red
        })
      })
    }

    // 2. Where to Eat
    if (dayPlan.where_to_eat && dayPlan.where_to_eat.length > 0) {
      dayPlan.where_to_eat.forEach((food) => {
        const coords = getCoordinatesForPlace(food.name, food.address_or_area, orderCounter)
        stops.push({
          type: 'food',
          order: orderCounter++,
          name: food.name,
          details: `Signature: ${food.dish}`,
          badge: food.approx_cost || food.meal_type,
          timing: food.meal_type,
          coords,
          color: '#F5A623' // Karnataka Gold
        })
      })
    }

    // 3. Recommended Stay
    if (dayPlan.stay) {
      const coords = getCoordinatesForPlace(dayPlan.stay.name, dayPlan.stay.area, orderCounter)
      stops.push({
        type: 'stay',
        order: orderCounter++,
        name: dayPlan.stay.name,
        details: dayPlan.stay.why_special,
        badge: dayPlan.stay.approx_price || dayPlan.stay.type,
        timing: 'Check-in & Rest',
        coords,
        color: '#1A7A4A' // Karnataka Green
      })
    }

    // If day was sparse, add default destination stop
    if (stops.length === 0) {
      const coords = getCoordinatesForPlace(dayPlan.title, startingPoint, 1)
      stops.push({
        type: 'attraction',
        order: 1,
        name: dayPlan.title,
        details: dayPlan.morning || 'Exploration route',
        badge: 'Hub',
        timing: 'Day Sight',
        coords,
        color: '#C8102E'
      })
    }

    // Fast static estimate for transit segments
    const transitSegments = []
    let totalDayKm = 0
    let totalDayMins = 0

    for (let i = 0; i < stops.length - 1; i++) {
      const transit = estimateTransitBetweenStops(stops[i].coords, stops[i + 1].coords)
      transitSegments.push({
        from: stops[i].name,
        to: stops[i + 1].name,
        ...transit
      })
      totalDayKm += transit.distanceKm
      totalDayMins += transit.durationMins
    }

    return {
      day: dayPlan.day || dayIdx + 1,
      title: dayPlan.title,
      stops,
      transitSegments,
      totalDayKm: Math.round(totalDayKm * 10) / 10,
      totalDayMins
    }
  })

  // Selected day data
  const activeDayObj = daysData.find(d => d.day === selectedDay) || daysData[0] || { stops: [], transitSegments: [] }
  const displayedStops = selectedDay === 0
    ? daysData.flatMap(d => d.stops)
    : activeDayObj.stops

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const initialCoords = KARNATAKA_COORDINATES.bangalore
    const map = L.map(mapContainerRef.current, {
      center: [initialCoords.lat, initialCoords.lng],
      zoom: 8,
      scrollWheelZoom: false,
    })

    // Free OpenStreetMap tile layer (no API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map)

    const markersGroup = L.featureGroup().addTo(map)
    const polylineGroup = L.featureGroup().addTo(map)

    markersLayerRef.current = markersGroup
    polylineLayerRef.current = polylineGroup
    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update Numbered Markers and Fetch OSRM Road Route
  useEffect(() => {
    const map = mapInstanceRef.current
    const markersGroup = markersLayerRef.current
    const polylineGroup = polylineLayerRef.current

    if (!map || !markersGroup || !polylineGroup) return

    markersGroup.clearLayers()
    polylineGroup.clearLayers()

    if (displayedStops.length === 0) return

    const latLngs = []

    // 1. Render Numbered Markers (1, 2, 3...)
    displayedStops.forEach((stop, idx) => {
      const latLng = [stop.coords.lat, stop.coords.lng]
      latLngs.push(latLng)

      const markerNumber = idx + 1
      const iconHtml = `
        <div style="
          background: linear-gradient(135deg, ${stop.color}, #1c1917);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2.5px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 13px;
          font-family: system-ui, -apple-system, sans-serif;
          cursor: pointer;
        ">
          ${markerNumber}
        </div>
      `

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-numbered-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      })

      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.name + ' Karnataka')}`

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 200px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
            <span style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: ${stop.color};">
              Stop #${markerNumber} • ${stop.type === 'attraction' ? 'Sight' : stop.type === 'food' ? 'Dining' : 'Stay'}
            </span>
            <span style="font-size: 10px; background: #f5f5f4; color: #44403c; padding: 1px 6px; border-radius: 6px; font-weight: bold;">
              ${stop.badge || ''}
            </span>
          </div>
          <div style="font-size: 13px; font-weight: 900; color: #1c1917; margin-bottom: 4px;">
            ${stop.name}
          </div>
          <div style="font-size: 11px; color: #57534e; line-height: 1.35; margin-bottom: 8px;">
            ${stop.details || ''}
          </div>
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            font-weight: bold;
            color: white;
            background-color: #C8102E;
            padding: 5px 10px;
            border-radius: 8px;
            text-decoration: none;
          ">
            Open in Google Maps ↗
          </a>
        </div>
      `

      const marker = L.marker(latLng, { icon: customIcon })
      marker.bindPopup(popupContent)
      marker.on('click', () => setActiveStopIndex(idx))
      markersGroup.addLayer(marker)
    })

    // Fit map bounds
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs)
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 13 })
    }

    // 2. Fetch OSRM Road Routes between consecutive stops asynchronously
    let isCancelled = false
    const loadRoadRoutes = async () => {
      setIsRoutingLoading(true)
      const legs = []
      const allPathPoints = []

      for (let i = 0; i < displayedStops.length - 1; i++) {
        const fromStop = displayedStops[i]
        const toStop = displayedStops[i + 1]
        const routeData = await fetchOsrmRoute(fromStop.coords, toStop.coords)

        if (isCancelled) return

        legs.push({
          from: fromStop.name,
          to: toStop.name,
          orderFrom: i + 1,
          orderTo: i + 2,
          distanceKm: routeData.distanceKm,
          formattedDistance: routeData.formattedDistance,
          durationMins: routeData.durationMins,
          formattedDuration: routeData.formattedDuration,
          source: routeData.source
        })

        if (routeData.pathPoints && routeData.pathPoints.length > 0) {
          allPathPoints.push(...routeData.pathPoints)
        }
      }

      setOsrmLegs(legs)
      setIsRoutingLoading(false)

      // Draw real road polyline or fallback straight lines
      if (!isCancelled && polylineGroup) {
        polylineGroup.clearLayers()
        if (allPathPoints.length > 1) {
          const polyline = L.polyline(allPathPoints, {
            color: selectedDay === 0 ? '#C8102E' : '#F5A623',
            weight: 4,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round'
          })
          polylineGroup.addLayer(polyline)
        } else if (latLngs.length > 1) {
          const fallbackPolyline = L.polyline(latLngs, {
            color: '#F5A623',
            weight: 3.5,
            dashArray: '6, 8'
          })
          polylineGroup.addLayer(fallbackPolyline)
        }
      }
    }

    loadRoadRoutes()
    return () => {
      isCancelled = true
    }
  }, [selectedDay, itinerary])

  const totalTripKm = daysData.reduce((acc, d) => acc + d.totalDayKm, 0)
  const currentLegs = osrmLegs.length > 0 ? osrmLegs : (activeDayObj.transitSegments || [])
  const currentDayKm = currentLegs.reduce((acc, leg) => acc + (leg.distanceKm || 0), 0)

  const googleMapsRouteUrl = `https://www.google.com/maps/dir/${displayedStops
    .map(s => encodeURIComponent(s.name + ' Karnataka'))
    .join('/')}`

  return (
    <div className="card border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm p-4 sm:p-5 rounded-2xl space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-karnataka-green/15 text-karnataka-green flex items-center justify-center">
            <Compass size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isKn ? 'ದಿನವಾರು ಮಾರ್ಗ ನಕ್ಷೆ (Leaflet + OpenStreetMap)' : 'Interactive Day Route Map (Leaflet + OSM)'}
            </h4>
            <div className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-2">
              <span>{displayedStops.length} {isKn ? 'ನಿಲ್ದಾಣಗಳು' : 'Numbered Stops'}</span>
              <span>•</span>
              <span className="text-karnataka-red font-bold">~{Math.round(currentDayKm || totalTripKm)} km {isKn ? 'ರಸ್ತೆ ದೂರ' : 'Total Leg'}</span>
              {isRoutingLoading && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal animate-pulse">
                  (Calculating OSRM routes...)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Google Maps External Directions Link */}
        <a
          href={googleMapsRouteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 hover:bg-amber-100 transition-colors shadow-2xs"
        >
          <ExternalLink size={12} />
          <span>{isKn ? 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ' : 'Open Route in Google Maps'}</span>
        </a>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedDay(0)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedDay === 0
              ? 'bg-karnataka-red text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          {isKn ? 'ಎಲ್ಲಾ ದಿನಗಳು' : 'All Days'}
        </button>

        {daysData.map((d) => (
          <button
            key={d.day}
            type="button"
            onClick={() => setSelectedDay(d.day)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedDay === d.day
                ? 'bg-karnataka-gold text-stone-900 shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <span>{isKn ? `ದಿನ ${d.day}` : `Day ${d.day}`}</span>
            <span className="text-[10px] opacity-75">({d.stops.length})</span>
          </button>
        ))}
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-inner">
        <div ref={mapContainerRef} className="h-72 sm:h-96 w-full z-10" />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3 py-2 rounded-xl border border-stone-200/80 dark:border-stone-700 shadow-md text-[10px] font-bold text-stone-700 dark:text-stone-300 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Sight
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Food
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Stay
          </span>
          <span className="text-stone-400 font-normal">| OSRM Road Path</span>
        </div>
      </div>

      {/* Approximate Distance & Drive Time Per Leg */}
      {currentLegs.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            <span>{isKn ? 'ನಿಲ್ದಾಣಗಳ ನಡುವಿನ ಅಂತರ ಮತ್ತು ಪ್ರಯಾಣ ಸಮಯ' : 'Transit Legs & Drive Times (OSRM Road Routing)'}</span>
            <span className="text-karnataka-green text-[10px]">Free Open Routing</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {currentLegs.map((segment, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700 text-xs space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-100">
                  <span className="truncate pr-1">
                    <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 inline-flex items-center justify-center text-[10px] mr-1">
                      {segment.orderFrom || idx + 1}
                    </span>
                    {segment.from}
                  </span>
                  <span className="text-stone-400 shrink-0">➔</span>
                  <span className="truncate pl-1">
                    <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 inline-flex items-center justify-center text-[10px] mr-1">
                      {segment.orderTo || idx + 2}
                    </span>
                    {segment.to}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-0.5 border-t border-stone-100 dark:border-stone-700/60">
                  <span className="flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-300">
                    <Car size={11} className="text-karnataka-red" />
                    <span>{segment.formattedDistance || `${segment.distanceKm} km`}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} className="text-amber-600" />
                    <span>~{segment.formattedDuration}</span>
                  </span>
                  <span className="text-[9px] text-stone-400 font-mono">
                    {segment.source || 'Road'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
