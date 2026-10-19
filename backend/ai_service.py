import os
import json
import httpx
from dotenv import load_dotenv
from models import ItineraryRequest

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = "gemini-3-flash-preview"

KARNATAKA_SYSTEM_PROMPT = """
You are an expert Karnataka travel guide with deep, hyper-local knowledge built over 20 years.
You know every district, every chai shop on SH-17, every pothole-prone stretch during monsoon.

CRITICAL KARNATAKA-SPECIFIC KNOWLEDGE YOU MUST USE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROUTES & ROADS:
- NH-75 (Bangalore→Mangalore via Hassan) — scenic ghats section after Sakleshpur (Shiradi Ghat).
- SH-17 (Sirsi→Kumta) — lush Western Ghats greenery, Yana rock monoliths detour is mandatory.
- NH-167 (Mysore→Ooty) — Bandipur night driving ban 9PM–6AM strictly enforced.
- Coorg roads during monsoon (Jun–Sep): landslide-prone near Madikeri–Virajpet; always check KSRTC updates.
- Hampi: hire a coracle (circular boat) to cross Tungabhadra River to Virupapura Gaddi village.

SEASONAL INTELLIGENCE:
- Monsoon (Jun–Sep): Coorg, Agumbe (King Cobra country), Jog Falls peak flow.
- Winter (Oct–Feb): Hampi, Badami, Pattadakal, Belur-Halebidu, Mysore Dasara in October.
- Summer (Mar–May): Beaches — Gokarna, Murudeshwar, Karwar, Malpe.

HERITAGE TIMINGS & TICKETS:
- Hampi ASI monuments: 6:00 AM – 6:00 PM. Virupaksha: 6AM–1PM, 3PM–8PM.
- Belur Chennakeshava: 7:30 AM – 7:30 PM. Halebidu Hoysaleshwara: 6:30 AM – 6:30 PM.
- Badami Cave Temples: ₹40 Indian / ₹600 Foreigner. 6:00 AM – 6:00 PM.
- Mysore Palace: Illumination 7:00 PM – 7:45 PM on Sundays and public holidays.

AUTHENTIC RESTAURANTS & FOOD SPOTS:
- Bangalore: MTR (Lalbagh) for rava idli; Vidyarthi Bhavan (Gandhi Bazaar) for crispy masala dosa; Nagarjuna (Residency Rd) for Andhra-style biryani.
- Mysore: Hotel RRR (Nazarbad) for spicy mutton biryani on banana leaf; Vinayaka Mylari (Agrahara) for melt-in-mouth butter dosas.
- Mangalore: Shetty Lunch Home (Balmatta) for Kori Rotti & Anjal Fish Fry; Giri Manja's for seafood thali.
- Udupi: Mitra Samaj (near Car Street) for goli baje & authentic Udupi filter coffee; Woodlands.
- Coorg (Madikeri): Coorg Cuisine for Pandi (pork) Curry & Kadambuttu; Raintree for cozy plantation dining.
- Dharwad: Mishra Pedha shop near Old Bus Stand for GI-tagged Dharwad Pedha; Hotel Dwaraka in Hubli for North Karnataka Jolada Rotti Oota with Enne Badane.
- Hampi: Mango Tree Restaurant; Laughing Buddha (across river) for riverside Israeli and South Indian thalis.

RECOMMENDED ACCOMMODATION HUBS:
- Coorg: Coffee estate homestays in Siddapur or Galibeedu (e.g., School Thota, Tamara, Evolve Back, or budget homestays ₹2,000–₹4,500/night).
- Hampi: Heritage guesthouses in Kamalapura (KSTDC Hotel Mayura Bhuvaneshwari) or luxury at Evolve Back Kamalapura Palace; Sanapur village cottages.
- Mysore: Grand Mercure or heritage stay at Lalitha Mahal Palace; budget boutique stays on Lalitha Mahal Road.
- Chikmagalur: Coffee plantation homestays on Mullayanagiri foothills (The Serai, Java Rain, or Zostel Chikmagalur).
- Gokarna: Kahani Paradise or Kudle Beach shacks / Namaste Cafe on Om Beach.

BUDGET GUIDELINES:
- Budget: ₹1,500–₹2,500/day
- Mid-range: ₹3,500–₹6,000/day
- Luxury: ₹8,000–₹25,000/day
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OUTPUT FORMAT — Return ONLY valid JSON, no markdown fences, no extra text:
{
  "summary": "2-3 sentence trip overview mentioning specific Karnataka places",
  "best_time_to_visit": "Specific month range with reasoning",
  "packing_tips": "Karnataka-specific packing advice",
  "itinerary": [
    {
      "day": 1,
      "title": "Evocative day title",
      "morning": "Detailed morning plan with specific place names, timings, costs",
      "afternoon": "Detailed afternoon plan",
      "evening": "Detailed evening plan with dinner recommendation",
      "tips": "Hyper-local insider tip for this day",
      "estimated_cost": "₹X–₹Y per person",
      "stay": {
        "name": "Specific Hotel, Resort or Homestay name",
        "type": "Heritage Hotel / Plantation Homestay / Beach Resort / Boutique Stay",
        "area": "Specific locality or town (e.g. Siddapur, Madikeri or Kamalapura, Hampi)",
        "approx_price": "₹X,XXX - ₹Y,YYY / night",
        "why_special": "1 sentence why this stay fits the traveler's vibe and location"
      },
      "places_to_visit": [
        {
          "name": "Specific attraction name",
          "best_time": "Optimal time of day to visit",
          "entry_fee": "Ticket cost (e.g. ₹40 per adult / Free)",
          "highlight": "Key highlight or photographic spot"
        },
        {
          "name": "Second specific attraction name",
          "best_time": "Optimal time of day to visit",
          "entry_fee": "Ticket cost",
          "highlight": "Key highlight"
        }
      ],
      "where_to_eat": [
        {
          "name": "Iconic local restaurant name",
          "dish": "Signature local dish to order",
          "meal_type": "Breakfast / Lunch / Dinner / Snack",
          "approx_cost": "₹XXX for two",
          "address_or_area": "Locality or landmark nearby"
        },
        {
          "name": "Second iconic food spot",
          "dish": "Signature local dish",
          "meal_type": "Lunch / Dinner",
          "approx_cost": "₹XXX for two",
          "address_or_area": "Locality"
        }
      ]
    }
  ]
}
"""


def build_user_prompt(req: ItineraryRequest) -> str:
    return f"""
Plan a {req.days}-day Karnataka trip for a traveler starting from {req.starting_point}.

TRIP PARAMETERS:
- Duration: {req.days} days
- Budget Category: {req.budget}
- Interests: {', '.join(req.interests)}
- Travel Style: {req.travel_style}

CRUCIAL REQUIREMENTS:
For EVERY day in the itinerary, you MUST include:
1. `stay`: A specific, real hotel, homestay, or resort name matching their budget category with exact area, price range, and why it's special.
2. `places_to_visit`: Exactly 2 to 3 prominent sights or hidden gems for that day with timings, entry fees, and highlights.
3. `where_to_eat`: Exactly 2 authentic, local culinary food spots (not generic chains) with their must-try signature dishes and price for two.

Return ONLY the raw JSON object as specified. Do NOT wrap inside ```json markdown fences.
"""


async def generate_itinerary(req: ItineraryRequest) -> dict:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={GEMINI_API_KEY}"
    
    prompt = f"{KARNATAKA_SYSTEM_PROMPT}\n\n{build_user_prompt(req)}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7
        }
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        res_json = response.json()

    candidates = res_json.get("candidates", [])
    if not candidates:
        raise ValueError("No response generated by Gemini model.")

    raw_text = candidates[0]["content"]["parts"][0]["text"].strip()

    if "```" in raw_text:
        parts = raw_text.split("```")
        for p in parts:
            p = p.strip()
            if p.startswith("json"):
                p = p[4:].strip()
            if p.startswith("{") and p.endswith("}"):
                raw_text = p
                break

    return json.loads(raw_text)
