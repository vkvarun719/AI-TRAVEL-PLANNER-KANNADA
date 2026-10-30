// Karnataka Geographic Coordinates Database & Smart Geo-locator
import { KARNATAKA_LOCATIONS } from './karnatakaLocations'

export const KARNATAKA_COORDINATES = {
  // Major Departure Hubs & Districts
  bangalore: { lat: 12.9716, lng: 77.5946, name: 'Bangalore (Bengaluru)' },
  bengaluru: { lat: 12.9716, lng: 77.5946, name: 'Bangalore (Bengaluru)' },
  mysore: { lat: 12.2958, lng: 76.6394, name: 'Mysore (Mysuru)' },
  mysuru: { lat: 12.2958, lng: 76.6394, name: 'Mysore (Mysuru)' },
  mangalore: { lat: 12.9141, lng: 74.8560, name: 'Mangalore (Mangaluru)' },
  mangaluru: { lat: 12.9141, lng: 74.8560, name: 'Mangalore (Mangaluru)' },
  hubli: { lat: 15.3647, lng: 75.1240, name: 'Hubli (Hubballi)' },
  hubballi: { lat: 15.3647, lng: 75.1240, name: 'Hubli (Hubballi)' },
  dharwad: { lat: 15.4589, lng: 75.0078, name: 'Dharwad' },
  belgaum: { lat: 15.8497, lng: 74.4977, name: 'Belgaum (Belagavi)' },
  belagavi: { lat: 15.8497, lng: 74.4977, name: 'Belgaum (Belagavi)' },
  hassan: { lat: 13.0033, lng: 76.1004, name: 'Hassan' },
  shivamogga: { lat: 13.9299, lng: 75.5681, name: 'Shivamogga (Shimoga)' },
  shimoga: { lat: 13.9299, lng: 75.5681, name: 'Shivamogga (Shimoga)' },
  davanagere: { lat: 14.4644, lng: 75.9218, name: 'Davanagere' },
  karwar: { lat: 14.8138, lng: 74.1297, name: 'Karwar' },
  bidar: { lat: 17.9104, lng: 77.5199, name: 'Bidar' },
  gulbarga: { lat: 17.3297, lng: 76.8343, name: 'Gulbarga (Kalaburagi)' },
  kalaburagi: { lat: 17.3297, lng: 76.8343, name: 'Gulbarga (Kalaburagi)' },
  chitradurga: { lat: 14.2251, lng: 76.3980, name: 'Chitradurga' },
  ballari: { lat: 15.1394, lng: 76.9214, name: 'Ballari (Bellary)' },
  bellary: { lat: 15.1394, lng: 76.9214, name: 'Ballari (Bellary)' },
  hosapete: { lat: 15.2689, lng: 76.3909, name: 'Hosapete (Hospet)' },
  hospet: { lat: 15.2689, lng: 76.3909, name: 'Hosapete (Hospet)' },
  vijayapura: { lat: 16.8302, lng: 75.7100, name: 'Vijayapura (Bijapur)' },
  bijapur: { lat: 16.8302, lng: 75.7100, name: 'Vijayapura (Bijapur)' },
  bagalkot: { lat: 16.1817, lng: 75.6958, name: 'Bagalkot' },
  gadag: { lat: 15.4319, lng: 75.6355, name: 'Gadag' },
  haveri: { lat: 14.7956, lng: 75.3992, name: 'Haveri' },
  koppal: { lat: 15.3456, lng: 76.1554, name: 'Koppal' },
  raichur: { lat: 16.2076, lng: 77.3463, name: 'Raichur' },
  yadgir: { lat: 16.7644, lng: 77.1378, name: 'Yadgir' },
  tumakuru: { lat: 13.3409, lng: 77.1010, name: 'Tumakuru (Tumkur)' },
  tumkur: { lat: 13.3409, lng: 77.1010, name: 'Tumakuru (Tumkur)' },
  chikkaballapur: { lat: 13.4325, lng: 77.7275, name: 'Chikkaballapur' },
  kolar: { lat: 13.1367, lng: 78.1291, name: 'Kolar' },
  ramanagara: { lat: 12.7209, lng: 77.2799, name: 'Ramanagara' },
  mandya: { lat: 12.5244, lng: 76.8974, name: 'Mandya' },
  chamarajanagar: { lat: 11.9261, lng: 76.9437, name: 'Chamarajanagar' },

  // Heritage & UNESCO Circuits
  hampi: { lat: 15.3350, lng: 76.4600, name: 'Hampi' },
  virupaksha: { lat: 15.3353, lng: 76.4599, name: 'Virupaksha Temple, Hampi' },
  vittala: { lat: 15.3392, lng: 76.4789, name: 'Vijaya Vittala Temple, Hampi' },
  kamalapura: { lat: 15.3056, lng: 76.4839, name: 'Kamalapura, Hampi' },
  anegundi: { lat: 15.3524, lng: 76.4971, name: 'Anegundi' },
  badami: { lat: 15.9189, lng: 75.6766, name: 'Badami Caves' },
  pattadakal: { lat: 15.9489, lng: 75.8160, name: 'Pattadakal' },
  aihole: { lat: 16.0189, lng: 75.8824, name: 'Aihole' },
  belur: { lat: 13.1623, lng: 75.8624, name: 'Belur Chennakeshava' },
  halebidu: { lat: 13.2136, lng: 75.9937, name: 'Halebidu Hoysaleshwara' },
  shravanabelagola: { lat: 12.8576, lng: 76.4862, name: 'Shravanabelagola' },
  somnathpur: { lat: 12.2764, lng: 76.9048, name: 'Somnathpur Temple' },
  basavakalyan: { lat: 17.8744, lng: 76.9533, name: 'Basavakalyan' },
  kudalasangama: { lat: 16.2164, lng: 76.0469, name: 'Kudalasangama' },
  lakkundi: { lat: 15.3855, lng: 75.7225, name: 'Lakkundi' },
  srirangapatna: { lat: 12.4239, lng: 76.6953, name: 'Srirangapatna' },

  // Western Ghats & Hill Stations
  coorg: { lat: 12.4244, lng: 75.7382, name: 'Coorg (Madikeri)' },
  madikeri: { lat: 12.4244, lng: 75.7382, name: 'Madikeri' },
  siddapur: { lat: 12.3023, lng: 75.8711, name: 'Siddapur, Coorg' },
  virajpet: { lat: 12.2039, lng: 75.8037, name: 'Virajpet' },
  kushalnagar: { lat: 12.4578, lng: 75.9619, name: 'Kushalnagar / Bylakuppe' },
  talacauvery: { lat: 12.3883, lng: 75.4925, name: 'Talacauvery' },
  abbeyfalls: { lat: 12.4552, lng: 75.7176, name: 'Abbey Falls' },
  chikmagalur: { lat: 13.3161, lng: 75.7720, name: 'Chikmagalur' },
  chikkamagaluru: { lat: 13.3161, lng: 75.7720, name: 'Chikmagalur' },
  mullayanagiri: { lat: 13.3912, lng: 75.7214, name: 'Mullayanagiri Peak' },
  bababudangiri: { lat: 13.4357, lng: 75.7533, name: 'Bababudangiri' },
  kemmanagundi: { lat: 13.5478, lng: 75.7578, name: 'Kemmanagundi' },
  kudremukh: { lat: 13.2167, lng: 75.2500, name: 'Kudremukh' },
  sakleshpur: { lat: 12.9719, lng: 75.7831, name: 'Sakleshpur' },
  agumbe: { lat: 13.5073, lng: 75.0931, name: 'Agumbe Rainforest' },
  jogfalls: { lat: 14.2285, lng: 74.8124, name: 'Jog Falls' },
  dandeli: { lat: 15.2361, lng: 74.6173, name: 'Dandeli Wildlife' },
  yana: { lat: 14.5492, lng: 74.5612, name: 'Yana Rocks' },
  sirsi: { lat: 14.6189, lng: 74.8519, name: 'Sirsi' },
  nandihills: { lat: 13.3702, lng: 77.6835, name: 'Nandi Hills' },
  bandipur: { lat: 11.6664, lng: 76.6294, name: 'Bandipur' },
  nagarhole: { lat: 12.0314, lng: 76.1554, name: 'Nagarhole' },
  kabini: { lat: 11.9333, lng: 76.3500, name: 'Kabini' },
  brhills: { lat: 11.9939, lng: 77.1389, name: 'BR Hills' },

  // Coastal Karavali & Beaches
  gokarna: { lat: 14.5479, lng: 74.3188, name: 'Gokarna' },
  ombeach: { lat: 14.5186, lng: 74.3169, name: 'Om Beach, Gokarna' },
  kudlebeach: { lat: 14.5298, lng: 74.3142, name: 'Kudle Beach, Gokarna' },
  murudeshwar: { lat: 14.0944, lng: 74.4849, name: 'Murudeshwar Temple & Shiva Statue' },
  udupi: { lat: 13.3409, lng: 74.7421, name: 'Udupi Sri Krishna Matha' },
  malpe: { lat: 13.3512, lng: 74.7042, name: 'Malpe Beach' },
  stmary: { lat: 13.3789, lng: 74.6725, name: 'St. Mary\'s Island' },
  kapu: { lat: 13.2272, lng: 74.7408, name: 'Kapu Lighthouse' },
  maravanthe: { lat: 13.7128, lng: 74.6469, name: 'Maravanthe Beach Highway' },
  honnavar: { lat: 14.2819, lng: 74.4444, name: 'Honnavar Backwaters' },

  // Pilgrimage Shrines
  sringeri: { lat: 13.4190, lng: 75.2570, name: 'Sringeri Sharada Peetham' },
  horanadu: { lat: 13.2750, lng: 75.3420, name: 'Horanadu Annapoorneshwari' },
  dharmasthala: { lat: 12.9554, lng: 75.3789, name: 'Dharmasthala Manjunatha Swamy' },
  kukke: { lat: 12.6644, lng: 75.6144, name: 'Kukke Subramanya' },
  subramanya: { lat: 12.6644, lng: 75.6144, name: 'Kukke Subramanya' },
  kollur: { lat: 13.8644, lng: 74.8144, name: 'Kollur Mookambika' },
  melukote: { lat: 12.6654, lng: 76.6578, name: 'Melukote' },
  shivanasamudra: { lat: 12.2961, lng: 77.1683, name: 'Shivanasamudra Falls' },
  gokak: { lat: 16.1833, lng: 74.8333, name: 'Gokak Falls' },
}

/**
 * Smart lookup to find coordinates for any place name, attraction, or restaurant in Karnataka.
 * Adds a small pseudo-random determinist offset if multiple spots share the same base locality
 * so map markers don't overlap.
 */
export function getCoordinatesForPlace(placeName = '', locality = '', index = 0) {
  const cleanSearch = (placeName + ' ' + locality).toLowerCase().replace(/[^a-z0-9]/g, '')

  // 1. Direct lookup in comprehensive coordinates dictionary
  for (const [key, coords] of Object.entries(KARNATAKA_COORDINATES)) {
    if (cleanSearch.includes(key)) {
      const jitterLat = (index % 3 - 1) * 0.008 + (Math.sin(index * 2) * 0.004)
      const jitterLng = ((index + 1) % 3 - 1) * 0.008 + (Math.cos(index * 2) * 0.004)
      return {
        lat: coords.lat + jitterLat,
        lng: coords.lng + jitterLng,
        name: coords.name,
        isExact: true
      }
    }
  }

  // 2. Lookup in KARNATAKA_LOCATIONS list
  const locMatch = KARNATAKA_LOCATIONS.find(l => {
    const valKey = l.value.toLowerCase().replace(/[^a-z0-9]/g, '')
    const enKey = l.en.toLowerCase().replace(/[^a-z0-9]/g, '')
    return cleanSearch.includes(valKey) || cleanSearch.includes(enKey)
  })

  if (locMatch) {
    const jitterLat = (index % 3 - 1) * 0.008 + (Math.sin(index * 2) * 0.004)
    const jitterLng = ((index + 1) % 3 - 1) * 0.008 + (Math.cos(index * 2) * 0.004)
    return {
      lat: locMatch.lat + jitterLat,
      lng: locMatch.lng + jitterLng,
      name: locMatch.en,
      isExact: true
    }
  }

  // 3. Fallback to geographic Karnataka center (approx 14.0 N, 75.8 E) with distributed spread
  return {
    lat: 14.0 + (index * 0.02) - 0.05,
    lng: 75.8 + (index * 0.02) - 0.05,
    name: placeName || 'Karnataka Location',
    isExact: false
  }
}
