from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

from app.ai.gemini_service import (
    generate_heritage_story,
    generate_pricing_analysis,
    generate_market_analysis,
)

from app.database import stories_collection


router = APIRouter()


# =========================================================
# STORY REQUEST
# =========================================================

class StoryRequest(BaseModel):
    craft_name: str
    state: str
    artisan_name: str
    speciality: str


# =========================================================
# PRICING REQUEST
# =========================================================

class PricingRequest(BaseModel):
    product_name: str
    category: str
    labour_cost: float
    material_cost: float
    market_price: float
    quantity: int = 1


# =========================================================
# MARKET ANALYSIS REQUEST
# =========================================================

class MarketAnalysisRequest(BaseModel):
    product_name: str
    category: str
    region: str
    artisan: str
    price: float
    speciality: str


# =========================================================
# HERITAGE STORY
# POST /api/ai/story
# =========================================================

@router.post("/story")
def generate_story(data: StoryRequest):

    story = generate_heritage_story(
        data.craft_name,
        data.state,
        data.artisan_name,
        data.speciality,
    )

    document = {
        "craft_name": data.craft_name,
        "state": data.state,
        "artisan_name": data.artisan_name,
        "speciality": data.speciality,
        "story": story,
        "created_at": datetime.utcnow(),
    }

    stories_collection.insert_one(document)

    return {
        "story": story
    }


# =========================================================
# GET PREVIOUS STORIES
# GET /api/ai/stories
# =========================================================

@router.get("/stories")
def get_stories():

    stories = list(
        stories_collection.find(
            {},
            {"_id": 0}
        ).sort("created_at", -1)
    )

    return stories


# =========================================================
# PRICING ASSISTANT
# POST /api/ai/pricing
# =========================================================

@router.post("/pricing")
def pricing_analysis(data: PricingRequest):

    analysis = generate_pricing_analysis(
        data.product_name,
        data.category,
        data.labour_cost,
        data.material_cost,
        data.market_price,
        data.quantity,
    )

    return {
        "analysis": analysis
    }


# =========================================================
# AI MARKET ANALYSIS
# POST /api/ai/analyze
# =========================================================

@router.post("/analyze")
def market_analysis(data: MarketAnalysisRequest):

    analysis = generate_market_analysis(
        data.product_name,
        data.category,
        data.region,
        data.artisan,
        data.price,
        data.speciality,
    )

    return {
        "analysis": analysis
    }