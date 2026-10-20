import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 120000,
})

export const generateItinerary = (payload) =>
  API.post('/api/generate-itinerary', payload)

export const regenerateDay = (payload) =>
  API.post('/api/regenerate-day', payload)

export const listItineraries = () =>
  API.get('/api/itineraries')

export const scanKannadaImage = (imageBase64, mimeType = 'image/jpeg', category = 'general') =>
  API.post('/api/scan-kannada', {
    image_base64: imageBase64,
    mime_type: mimeType,
    category,
  })

export default API
