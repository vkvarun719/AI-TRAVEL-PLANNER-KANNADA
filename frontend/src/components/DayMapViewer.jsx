import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  MapPin, Compass, Navigation, ExternalLink, Clock,
  Car, Utensils, Hotel, Eye, Layers, Sparkles
} from 'lucide-react'
import { getCoordinatesForPlace, KARNATAKA_COORDINATES } from '../data/karnatakaCoordinates'
import { estimateTransitBetweenStops } from '../utils/distanceCalculator'
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
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersLayerRef = useRef(null)
  const polylineLayerRef = useRef(null)

  const [selectedDay, setSelectedDay] = useState(1) // 0 means All Days, 1, 2, 3...
  const [activeStopIndex, setActiveStopIndex] = useState(0)

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

    // Calculate transit segments between consecutive stops for this day
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

  // Determine which stops to display based on selectedDay (0 = all, 1+ = specific day)
  const displayedDays = selectedDay === 0
    ? daysData
    : daysData.filter(d => d.day === selectedDay)

  const activeDayObj = daysData.find(d => d.day === selectedDay) || daysData[0] || { stops: [], transitSegments: [] }
  const displayedStops = selectedDay === 0
    ? daysData.flatMap(d => d.stops)
    : activeDayObj.stops

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    // If map already initialized, cleanup previous instance
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

    // OpenStreetMap free tile layer
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

  // Update Markers & Polyline whenever selectedDay or itinerary changes
  useEffect(() => {
    const map = mapInstanceRef.current
    const markersGroup = markersLayerRef.current
    const polylineGroup = polylineLayerRef.current

    if (!map || !markersGroup || !polylineGroup) return

    markersGroup.clearLayers()
    polylineGroup.clearLayers()

    if (displayedStops.length === 0) return

    const latLngs = []

    displayedStops.forEach((stop, idx) => {
      const latLng = [stop.coords.lat, stop.coords.lng]
      latLngs.push(latLng)

      // Create custom badge HTML marker icon
      const iconHtml = `
        <div style="
          background-color: ${stop.color};
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2.5px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 11px;
          font-family: sans-serif;
          cursor: pointer;
        ">
          ${stop.type === 'food' ? '🍲' : stop.type === 'stay' ? '🏨' : stop.order}
        </div>
      `

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-pin',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -16]
      })

      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.name + ' Karnataka')}`

      const popupContent = `
        <div style="font-family: sans-serif; min-width: 190px; padding: 2px;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${stop.color}; margin-bottom: 2px;">
            ${stop.type === 'attraction' ? 'Key Sight' : stop.type === 'food' ? 'Local Eatery' : 'Accomodation'}
          </div>
          <div style="font-size: 13px; font-weight: 900; color: #1C1917; margin-bottom: 4px;">
            ${stop.name}
          </div>
          <div style="font-size: 11px; color: #44403C; line-height: 1.3; margin-bottom: 8px;">
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

    // Draw route connecting polyline
    if (latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: selectedDay === 0 ? '#C8102E' : '#F5A623',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round'
      })
      polylineGroup.addLayer(polyline)
    }

    // Fit map bounds with smooth animation
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs)
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 13 })
    }
  }, [selectedDay, itinerary])

  const totalTripKm = daysData.reduce((acc, d) => acc + d.totalDayKm, 0)
  const googleMapsRouteUrl = `https://www.google.com/maps/dir/${displayedStops
    .map(s => encodeURIComponent(s.name))
    .join('/')}`

  return (
    <div className="card border border-stone-200/90 bg-white shadow-sm p-4 sm:p-5 rounded-2xl space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-karnataka-green/15 flex items-center justify-center text-karnataka-green">
            <Compass size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Interactive Route Map (Leaflet & OSM)
            </h4>
            <div className="text-xs font-black text-stone-900">
              {displayedStops.length} Mapped Stops • ~{Math.round(totalTripKm)} km Total Circuit
            </div>
          </div>
        </div>

        <a
          href={googleMapsRouteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-karnataka-red hover:underline"
        >
          <span>Open Full Route in Google Maps</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Day Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-stone-100 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setSelectedDay(0)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            selectedDay === 0
              ? 'bg-white text-stone-900 shadow-2xs font-extrabold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          All Days Overview
        </button>

        {daysData.map((d) => (
          <button
            key={d.day}
            type="button"
            onClick={() => setSelectedDay(d.day)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedDay === d.day
                ? 'bg-white text-karnataka-red shadow-2xs font-extrabold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Day {d.day} Stops
          </button>
        ))}
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-stone-200 shadow-inner z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {/* Floating Map Legend */}
        <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-sm text-[10px] font-bold text-stone-700 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-karnataka-red" /> Sight
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Food
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Stay
          </span>
        </div>
      </div>

      {/* Day Distance & Driving Time Estimates */}
      {selectedDay !== 0 && activeDayObj.transitSegments.length > 0 && (
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span className="flex items-center gap-1.5">
              <Car size={14} className="text-karnataka-red" />
              <span>Day {selectedDay} Transit Estimates:</span>
            </span>
            <span className="text-[11px] font-black text-stone-900 bg-white px-2 py-0.5 rounded-md border border-stone-200">
              ~{activeDayObj.totalDayKm} km • ~{Math.round(activeDayObj.totalDayMins / 60 * 10) / 10} hrs drive
            </span>
          </div>

          {/* Sequential Segments */}
          <div className="space-y-1.5">
            {activeDayObj.transitSegments.map((seg, sIdx) => (
              <div
                key={sIdx}
                className="flex items-center justify-between text-[11px] text-stone-600 bg-white p-2 rounded-lg border border-stone-100"
              >
                <div className="flex items-center gap-1.5 truncate pr-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="font-semibold text-stone-800 truncate">{seg.from}</span>
                  <span className="text-stone-400">➔</span>
                  <span className="font-semibold text-stone-800 truncate">{seg.to}</span>
                </div>
                <div className="text-[10px] font-mono font-bold text-stone-500 flex items-center gap-1 flex-shrink-0">
                  <Clock size={10} />
                  <span>{seg.formattedDistance} ({seg.formattedDuration})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stops List */}
      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
        {displayedStops.map((stop, sIdx) => {
          const gMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.name + ' Karnataka')}`

          return (
            <div
              key={sIdx}
              className="flex items-center justify-between p-2 rounded-xl border border-stone-100 hover:bg-stone-50 transition-all text-xs"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span
                  className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{ backgroundColor: stop.color }}
                >
                  {stop.type === 'food' ? '🍲' : stop.type === 'stay' ? '🏨' : stop.order}
                </span>
                <span className="font-bold text-stone-800 truncate">{stop.name}</span>
                <span className="text-[10px] text-stone-400 font-medium truncate hidden sm:inline">
                  • {stop.details}
                </span>
              </div>

              <a
                href={gMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-karnataka-red hover:underline flex-shrink-0"
              >
                <span>Maps</span>
                <ExternalLink size={10} />
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
