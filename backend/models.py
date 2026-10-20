from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ItineraryRequest(BaseModel):
    starting_point: str = Field(..., min_length=2, max_length=100, example="Bangalore")
    days: int = Field(..., ge=1, le=14, example=3)
    budget: str = Field(..., example="mid-range")
    interests: List[str] = Field(..., min_items=1, max_items=10, example=["Heritage", "Wildlife"])
    travel_style: Optional[str] = Field(default="mixed", example="adventure")
    vibe: Optional[str] = Field(default="Relaxed", example="Spiritual")
    travelers: int = Field(default=2, ge=1, le=20, example=2)
    travel_month: Optional[str] = Field(default="October", example="October")
    language: Optional[str] = Field(default="en", example="kn")


class FeedbackRequest(BaseModel):
    rating: int = Field(default=5, ge=1, le=5)
    category: str = Field(default="suggestion")
    message: str = Field(..., min_length=2, max_length=2000)
    email: Optional[str] = None


class ScanKannadaRequest(BaseModel):
    image_base64: str = Field(..., description="Base64-encoded image string of the Kannada sign/text")
    mime_type: Optional[str] = Field(default="image/jpeg", description="MIME type of the image")
    category: Optional[str] = Field(default="general", description="signboard, menu, temple, bus_board, general")


class DetectedWord(BaseModel):
    kannada: str
    english: str


class ScanKannadaResponse(BaseModel):
    kannada_text: str = Field(..., example="ಬೆಂಗಳೂರು ➔ ಮೈಸೂರು ಎಕ್ಸ್ಪ್ರೆಸ್")
    transliteration: str = Field(..., example="Bengaluru to Mysuru Express")
    english_translation: str = Field(..., example="Bengaluru to Mysuru Express Bus")
    category: str = Field(default="Bus Route / Transport", example="Bus Route / Transport")
    context_and_tips: str = Field(..., example="This is a KSRTC bus route board. Connects Bengaluru to Mysuru.")
    confidence: float = Field(default=0.95)
    key_terms: Optional[List[DetectedWord]] = []


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


class FoodTrailItem(BaseModel):
    dish_name: str = Field(..., example="Mysuru Masala Dosa")
    regional_origin: Optional[str] = Field(default="Karnataka", example="Old Mysore")
    iconic_spot: str = Field(..., example="Vinayaka Mylari, Agrahara, Mysuru")
    description: str = Field(..., example="Crispy golden crepe with spiced potato palya and white butter")
    vegetarian: bool = Field(default=True)


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


class CostBreakdown(BaseModel):
    stay: int = Field(default=0, example=6000)
    food: int = Field(default=0, example=4500)
    transport: int = Field(default=0, example=3000)
    activities: int = Field(default=0, example=1500)
    total: int = Field(default=0, example=15000)
    currency: str = Field(default="INR")


class DestinationWeatherNote(BaseModel):
    destination: str
    note: str
    temperature_range: Optional[str] = "20°C - 30°C"


class SeasonInfo(BaseModel):
    season_name: str = Field(default="Winter", example="Winter")
    weather_summary: str = Field(default="Pleasant days and cool nights across Karnataka.")
    destination_weather_notes: Optional[List[DestinationWeatherNote]] = []


class RegenerateDayRequest(BaseModel):
    day: int
    starting_point: str = "Bangalore"
    days: int = 3
    budget: str = "mid-range"
    vibe: Optional[str] = "Relaxed"
    travel_style: Optional[str] = "mixed"
    interests: List[str] = []
    travelers: int = 2
    travel_month: Optional[str] = "October"
    language: Optional[str] = "en"
    current_day_title: Optional[str] = None
    other_days_context: Optional[List[str]] = []


class ItineraryResponse(BaseModel):
    id: Optional[str] = None
    starting_point: str
    days: int
    budget: str
    interests: List[str]
    travel_style: Optional[str]
    vibe: Optional[str] = "Relaxed"
    travelers: int = 2
    travel_month: Optional[str] = "October"
    language: Optional[str] = "en"
    itinerary: List[DayPlan]
    local_food_trail: Optional[List[FoodTrailItem]] = []
    cost_breakdown: Optional[CostBreakdown] = None
    season_info: Optional[SeasonInfo] = None
    summary: str
    best_time_to_visit: str
    packing_tips: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
