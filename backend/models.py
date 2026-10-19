from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ItineraryRequest(BaseModel):
    starting_point: str = Field(..., example="Bangalore")
    days: int = Field(..., ge=1, le=14, example=3)
    budget: str = Field(..., example="mid-range")
    interests: List[str] = Field(..., example=["Heritage", "Wildlife"])
    travel_style: Optional[str] = Field(default="mixed", example="adventure")

    class Config:
        json_schema_extra = {
            "example": {
                "starting_point": "Bangalore",
                "days": 3,
                "budget": "mid-range",
                "interests": ["Heritage", "Wildlife"],
                "travel_style": "mixed"
            }
        }


class StayRecommendation(BaseModel):
    name: str = Field(..., example="Old Kent Estates & Spa / Coorg Homestay")
    type: str = Field(..., example="Coffee Estate Homestay")
    area: str = Field(..., example="Siddapur / Madikeri")
    approx_price: str = Field(..., example="₹3,500 - ₹5,000 / night")
    why_special: str = Field(..., example="Set inside 200-year-old coffee plantation with Kodava hosts")


class FoodRecommendation(BaseModel):
    name: str = Field(..., example="Coorg Cuisine")
    dish: str = Field(..., example="Pandi Curry with Kadambuttu & Akki Rotti")
    meal_type: str = Field(..., example="Dinner")
    approx_cost: str = Field(..., example="₹450 for two")
    address_or_area: str = Field(..., example="Main Market, Madikeri")


class PlaceToVisit(BaseModel):
    name: str = Field(..., example="Abbey Falls & Raja's Seat")
    best_time: str = Field(..., example="4:30 PM - 6:30 PM (Sunset)")
    entry_fee: str = Field(..., example="₹15 entry + ₹30 parking")
    highlight: str = Field(..., example="Panoramic view over misty valleys where Kodagu kings sat")


class DayPlan(BaseModel):
    day: int
    title: str
    morning: str
    afternoon: str
    evening: str
    tips: str
    estimated_cost: str
    stay: Optional[StayRecommendation] = None
    places_to_visit: Optional[List[PlaceToVisit]] = []
    where_to_eat: Optional[List[FoodRecommendation]] = []


class ItineraryResponse(BaseModel):
    id: Optional[str] = None
    starting_point: str
    days: int
    budget: str
    interests: List[str]
    travel_style: Optional[str]
    itinerary: List[DayPlan]
    summary: str
    best_time_to_visit: str
    packing_tips: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
