import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from datetime import datetime

from database import save_itinerary, get_all_itineraries, find_itinerary_by_id
from models import ItineraryRequest, DayPlan, StayRecommendation, PlaceToVisit, FoodRecommendation
from ai_service import generate_itinerary

load_dotenv()

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173"
).split(",")

app = FastAPI(
    title="AI Karnataka Travel Planner API",
    description="Hyper-local AI itinerary generator for Karnataka, India",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "🗺️ Karnataka Travel Planner API is live!", "status": "ok"}


@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.post("/api/generate-itinerary")
async def create_itinerary(req: ItineraryRequest):
    try:
        ai_data = await generate_itinerary(req)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI generation failed: {str(e)}")

    day_plans = []
    for day_raw in ai_data.get("itinerary", []):
        # Parse stay if provided
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

        # Parse places to visit
        places_objs = []
        for p in day_raw.get("places_to_visit", []):
            places_objs.append(PlaceToVisit(
                name=p.get("name", "Local Attraction"),
                best_time=p.get("best_time", "Morning / Afternoon"),
                entry_fee=p.get("entry_fee", "Nominal / Free"),
                highlight=p.get("highlight", "Scenic viewpoint & local history")
            ))

        # Parse where to eat
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
            day=day_raw["day"],
            title=day_raw["title"],
            morning=day_raw["morning"],
            afternoon=day_raw["afternoon"],
            evening=day_raw["evening"],
            tips=day_raw["tips"],
            estimated_cost=day_raw["estimated_cost"],
            stay=stay_obj,
            places_to_visit=places_objs,
            where_to_eat=eat_objs
        ))

    doc = {
        "starting_point": req.starting_point,
        "days": req.days,
        "budget": req.budget,
        "interests": req.interests,
        "travel_style": req.travel_style,
        "itinerary": [d.dict() for d in day_plans],
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


@app.get("/api/itineraries")
async def list_itineraries(limit: int = 10):
    return get_all_itineraries(limit)


@app.get("/api/itineraries/{itinerary_id}")
async def get_itinerary(itinerary_id: str):
    doc = find_itinerary_by_id(itinerary_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return doc
