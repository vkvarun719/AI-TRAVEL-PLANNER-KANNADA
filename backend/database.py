import os
import json
from datetime import datetime

ITINERARIES_FILE = os.path.join(os.path.dirname(__file__), "itineraries_db.json")


def load_all():
    if not os.path.exists(ITINERARIES_FILE):
        return []
    try:
        with open(ITINERARIES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_itinerary(doc: dict) -> str:
    items = load_all()
    doc_id = f"itin_{int(datetime.utcnow().timestamp())}_{len(items) + 1}"
    doc["id"] = doc_id
    items.insert(0, doc)
    with open(ITINERARIES_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, default=str)
    return doc_id


def get_all_itineraries(limit: int = 10):
    items = load_all()
    return items[:limit]


def find_itinerary_by_id(itinerary_id: str):
    items = load_all()
    for item in items:
        if item.get("id") == itinerary_id:
            return item
    return None
