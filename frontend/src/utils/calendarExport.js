// Utilities for exporting itineraries to Google Calendar and .ics calendar files

/**
 * Generates and downloads a standard .ics iCalendar file for the entire trip.
 */
export function downloadIcsCalendar(tripData) {
  if (!tripData || !tripData.itinerary) return

  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 7) // default to next week

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Yatra AI//Karnataka Travel Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Karnataka AI Trip Itinerary',
    'X-WR-TIMEZONE:Asia/Kolkata',
  ]

  tripData.itinerary.forEach((dayPlan, idx) => {
    const eventDate = new Date(startDate)
    eventDate.setDate(startDate.getDate() + idx)

    const dateStr = eventDate.toISOString().split('T')[0].replace(/-/g, '')
    const startStr = `${dateStr}T090000`
    const endStr = `${dateStr}T200000`

    const title = `Day ${dayPlan.day}: ${dayPlan.title.replace(/[,;]/g, '')}`
    const description = [
      `Morning: ${dayPlan.morning}`,
      `Afternoon: ${dayPlan.afternoon}`,
      `Evening: ${dayPlan.evening}`,
      dayPlan.stay ? `Stay: ${dayPlan.stay.name}` : '',
      dayPlan.tips ? `Insider Tip: ${dayPlan.tips}` : '',
    ]
      .filter(Boolean)
      .join('\\n\\n')
      .replace(/[,;]/g, '')

    const location = (dayPlan.stay?.area || tripData.starting_point || 'Karnataka, India').replace(/[,;]/g, '')

    icsContent.push('BEGIN:VEVENT')
    icsContent.push(`UID:yatra_${tripData.id || Date.now()}_day_${dayPlan.day}@yatra.ai`)
    icsContent.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`)
    icsContent.push(`DTSTART;TZID=Asia/Kolkata:${startStr}`)
    icsContent.push(`DTEND;TZID=Asia/Kolkata:${endStr}`)
    icsContent.push(`SUMMARY:${title}`)
    icsContent.push(`DESCRIPTION:${description}`)
    icsContent.push(`LOCATION:${location}`)
    icsContent.push('STATUS:CONFIRMED')
    icsContent.push('END:VEVENT')
  })

  icsContent.push('END:VCALENDAR')

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${(tripData.starting_point || 'Karnataka').toLowerCase()}_travel_itinerary.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Creates a direct Google Calendar Web URL for Day 1 or trip overview.
 */
export function getGoogleCalendarWebUrl(tripData) {
  if (!tripData) return '#'

  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 7)
  const dateStr = startDate.toISOString().split('T')[0].replace(/-/g, '')
  
  const title = encodeURIComponent(`${tripData.days}-Day Karnataka Journey: ${tripData.starting_point}`)
  const details = encodeURIComponent(
    `${tripData.summary || 'AI-generated Karnataka travel itinerary'}\n\nBudget: ${tripData.budget}\nTravelers: ${tripData.travelers || 2}`
  )
  const location = encodeURIComponent(`${tripData.starting_point}, Karnataka, India`)
  const dates = `${dateStr}T090000Z/${dateStr}T210000Z`

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`
}
