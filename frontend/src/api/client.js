import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 120000,
})

export const generateItinerary = (payload) =>
  API.post('/api/generate-itinerary', payload)

export const listItineraries = () =>
  API.get('/api/itineraries')

export default API
