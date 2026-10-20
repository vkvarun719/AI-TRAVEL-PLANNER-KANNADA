import os
import time
import re
import json
from collections import defaultdict
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from dotenv import load_dotenv
from datetime import datetime

from database import save_itinerary, get_all_itineraries, find_itinerary_by_id
from models import (
    ItineraryRequest, RegenerateDayRequest, DayPlan,
    StayRecommendation, PlaceToVisit, FoodRecommendation,
    CostBreakdown, SeasonInfo, DestinationWeatherNote, FeedbackRequest,
    ScanKannadaRequest, ScanKannadaResponse
)
from ai_service import generate_itinerary, regenerate_single_day, scan_and_translate_kannada

load_dotenv()

# In-memory sliding window rate limiter: max 15 requests per 60 seconds per IP
RATE_LIMIT_WINDOW = 60
MAX_REQUESTS_PER_WINDOW = 15
client_request_history = defaultdict(list)


def check_rate_limit(client_ip: str):
    now = time.time()
    client_request_history[client_ip] = [
        ts for ts in client_request_history[client_ip]
        if now - ts < RATE_LIMIT_WINDOW
    ]
    if len(client_request_history[client_ip]) >= MAX_REQUESTS_PER_WINDOW:
        raise HTTPException(
            status_code=429,
            detail="Too many itinerary requests. Please wait a moment before trying again.",
            headers={"Retry-After": str(RATE_LIMIT_WINDOW)}
        )
    client_request_history[client_ip].append(now)


ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173"
).split(",")

app = FastAPI(
    title="AI Karnataka Travel Planner API",
    description="Hyper-local AI itinerary generator for Karnataka with rate limiting and season intelligence",
    version="1.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

user_feedback_store = []


@app.get("/")
async def root():
    return {"message": "🗺️ Karnataka Travel Planner API is live!", "status": "ok"}


@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.post("/api/feedback")
async def submit_feedback(req: FeedbackRequest):
    entry = {
        "id": int(time.time() * 1000),
        "rating": req.rating,
        "category": req.category,
        "message": req.message,
        "email": req.email or "anonymous",
        "created_at": datetime.utcnow().isoformat()
    }
    user_feedback_store.append(entry)
    return {"status": "success", "message": "Feedback recorded", "entry": entry}


@app.post("/api/scan-kannada")
async def scan_kannada_endpoint(req: ScanKannadaRequest, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    check_rate_limit(client_ip)

    if not req.image_base64 or len(req.image_base64) < 10:
        raise HTTPException(status_code=400, detail="Valid image base64 data is required.")

    try:
        result = await scan_and_translate_kannada(req.image_base64, req.mime_type or "image/jpeg")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Kannada vision scanner error: {str(e)}")


@app.post("/api/generate-itinerary")
async def create_itinerary(req: ItineraryRequest, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    check_rate_limit(client_ip)

    # Sanitize input against potential script injection
    req.starting_point = re.sub(r'[<>&"\']', '', req.starting_point).strip()
    if req.destination:
        req.destination = re.sub(r'[<>&"\']', '', req.destination).strip()

    try:
        ai_data = await generate_itinerary(req)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI generation failed: {str(e)}")

    day_plans = []
    for day_raw in ai_data.get("itinerary", []):
        stay_obj = None
        if day_raw.get("stay"):
            stay_data = day_raw["stay"]
            stay_obj = StayRecommendation(
                name=stay_data.get("name", "Local Recommended Stay"),
                type=stay_data.get("type", "Boutique / Homestay"),
                area=stay_data.get("area", req.starting_point),
                approx_price=stay_data.get("approx_price", "₹2,500 - ₹4,500 / night"),
                why_special=stay_data.get("why_special", "Comfortable, highly-rated location near attractions.")
            )

        places_objs = []
        for p in day_raw.get("places_to_visit", []):
            places_objs.append(PlaceToVisit(
                name=p.get("name", "Local Attraction"),
                best_time=p.get("best_time", "Morning / Afternoon"),
                entry_fee=p.get("entry_fee", "Nominal / Free"),
                highlight=p.get("highlight", "Scenic viewpoint & local history")
            ))

        eat_objs = []
        for f in day_raw.get("where_to_eat", []):
            eat_objs.append(FoodRecommendation(
                name=f.get("name", "Local Eatery"),
                dish=f.get("dish", "Authentic Regional Thali"),
                meal_type=f.get("meal_type", "Lunch / Dinner"),
                approx_cost=f.get("approx_cost", "₹350 for two"),
                address_or_area=f.get("address_or_area", "Town Center")
            ))

        day_plans.append(DayPlan(
            day=day_raw.get("day", len(day_plans) + 1),
            title=day_raw.get("title", f"Day {len(day_plans) + 1} Discovery"),
            morning=day_raw.get("morning", "Explore morning attractions"),
            afternoon=day_raw.get("afternoon", "Afternoon cultural stops"),
            evening=day_raw.get("evening", "Evening relaxation and local dinner"),
            tips=day_raw.get("tips", "Start early to beat the afternoon sun"),
            estimated_cost=day_raw.get("estimated_cost", "₹2,000 - ₹3,500"),
            stay=stay_obj,
            places_to_visit=places_objs,
            where_to_eat=eat_objs
        ))

    # Parse local food trail
    food_trail_objs = []
    for f in ai_data.get("local_food_trail", []):
        food_trail_objs.append({
            "dish_name": f.get("dish_name", "Regional Specialty"),
            "regional_origin": f.get("regional_origin", "Karnataka"),
            "iconic_spot": f.get("iconic_spot", "Local Heritage Eatery"),
            "description": f.get("description", "Authentic culinary preparation celebrated in Karnataka"),
            "vegetarian": bool(f.get("vegetarian", True))
        })

    # Parse or compute structured cost breakdown
    cb_raw = ai_data.get("cost_breakdown", {})
    stay_cost = int(cb_raw.get("stay", 0))
    food_cost = int(cb_raw.get("food", 0))
    trans_cost = int(cb_raw.get("transport", 0))
    act_cost = int(cb_raw.get("activities", 0))

    if not (stay_cost or food_cost or trans_cost or act_cost):
        # Intelligent fallback based on budget and duration
        multiplier = 1.0 if req.budget == "mid-range" else (0.55 if req.budget == "budget" else 2.2)
        base_per_day = int(4500 * multiplier * max(1, req.travelers * 0.75))
        total_calc = base_per_day * req.days
        stay_cost = int(total_calc * 0.40)
        food_cost = int(total_calc * 0.25)
        trans_cost = int(total_calc * 0.20)
        act_cost = int(total_calc * 0.15)

    cost_breakdown_obj = {
        "stay": stay_cost,
        "food": food_cost,
        "transport": trans_cost,
        "activities": act_cost,
        "total": stay_cost + food_cost + trans_cost + act_cost,
        "currency": "INR"
    }

    # Parse season info
    si_raw = ai_data.get("season_info", {})
    season_name = si_raw.get("season_name", "Winter")
    weather_summary = si_raw.get("weather_summary", "Pleasant climate across Karnataka circuits.")
    notes_raw = si_raw.get("destination_weather_notes", [])
    weather_notes = []
    for n in notes_raw:
        weather_notes.append({
            "destination": n.get("destination", req.starting_point),
            "note": n.get("note", "Pleasant weather with clear skies"),
            "temperature_range": n.get("temperature_range", "20°C - 30°C")
        })

    if not weather_notes:
        weather_notes.append({
            "destination": req.starting_point,
            "note": f"Favorable conditions for travel in {req.travel_month or 'October'}",
            "temperature_range": "20°C - 29°C"
        })

    season_info_obj = {
        "season_name": season_name,
        "weather_summary": weather_summary,
        "destination_weather_notes": weather_notes
    }

    doc = {
        "starting_point": req.starting_point,
        "destination": req.destination,
        "days": req.days,
        "budget": req.budget,
        "interests": req.interests,
        "travel_style": req.travel_style,
        "vibe": req.vibe or "Relaxed",
        "preset": req.preset or "family",
        "eco_filter": bool(req.eco_filter),
        "travelers": req.travelers,
        "travel_month": req.travel_month or "October",
        "language": req.language or "en",
        "itinerary": [d.dict() for d in day_plans],
        "local_food_trail": food_trail_objs,
        "cost_breakdown": cost_breakdown_obj,
        "season_info": season_info_obj,
        "summary": ai_data.get("summary", ""),
        "best_time_to_visit": ai_data.get("best_time_to_visit", ""),
        "packing_tips": ai_data.get("packing_tips", ""),
        "created_at": datetime.utcnow().isoformat(),
    }

    doc_id = save_itinerary(doc)

    return {
        "id": doc_id,
        **doc,
    }


@app.post("/api/regenerate-day")
async def regenerate_day_endpoint(req: RegenerateDayRequest, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    check_rate_limit(client_ip)

    try:
        day_raw = await regenerate_single_day(req)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Regenerating day failed: {str(e)}")

    stay_obj = None
    if day_raw.get("stay"):
        s = day_raw["stay"]
        stay_obj = StayRecommendation(
            name=s.get("name", "Recommended Stay"),
            type=s.get("type", "Boutique / Homestay"),
            area=s.get("area", req.starting_point),
            approx_price=s.get("approx_price", "₹2,500 - ₹5,000 / night"),
            why_special=s.get("why_special", "Comfortable authentic accommodation.")
        )

    places_objs = []
    for p in day_raw.get("places_to_visit", []):
        places_objs.append(PlaceToVisit(
            name=p.get("name", "Local Attraction"),
            best_time=p.get("best_time", "Morning / Afternoon"),
            entry_fee=p.get("entry_fee", "Nominal / Free"),
            highlight=p.get("highlight", "Cultural and scenic viewpoint")
        ))

    eat_objs = []
    for f in day_raw.get("where_to_eat", []):
        eat_objs.append(FoodRecommendation(
            name=f.get("name", "Local Eatery"),
            dish=f.get("dish", "Regional Delicacy"),
            meal_type=f.get("meal_type", "Lunch / Dinner"),
            approx_cost=f.get("approx_cost", "₹350 for two"),
            address_or_area=f.get("address_or_area", "Local Market")
        ))

    new_day_plan = DayPlan(
        day=req.day,
        title=day_raw.get("title", f"Day {req.day} Fresh Route"),
        morning=day_raw.get("morning", "Fresh morning exploration"),
        afternoon=day_raw.get("afternoon", "Scenic afternoon stops"),
        evening=day_raw.get("evening", "Relaxed evening dining"),
        tips=day_raw.get("tips", "Enjoy the alternative scenic route"),
        estimated_cost=day_raw.get("estimated_cost", "₹2,000 - ₹3,500"),
        stay=stay_obj,
        places_to_visit=places_objs,
        where_to_eat=eat_objs
    )

    return new_day_plan.dict()


@app.get("/api/itineraries")
async def list_itineraries(limit: int = 10):
    return get_all_itineraries(limit)


@app.get("/api/itineraries/{itinerary_id}")
async def get_itinerary(itinerary_id: str):
    doc = find_itinerary_by_id(itinerary_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return doc


@app.get("/api/download-presentation")
async def download_presentation():
    # Return the pre-generated PowerPoint file
    root_dir = os.path.dirname(os.path.dirname(__file__))
    ppt_path = os.path.join(root_dir, "Yatra_AI_Presentation.pptx")
    if not os.path.exists(ppt_path):
        # Fallback to frontend public directory
        ppt_path = os.path.join(root_dir, "frontend", "public", "Yatra_AI_Presentation.pptx")
    if not os.path.exists(ppt_path):
        raise HTTPException(status_code=404, detail="Presentation file not found.")
    return FileResponse(
        path=ppt_path,
        filename="Yatra_AI_Karnataka_Presentation.pptx",
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
