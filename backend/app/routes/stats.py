from fastapi import APIRouter
from app.database import db

router = APIRouter(
    prefix="/api",
    tags=["Statistics"]
)

collection = db["products"]


@router.get("/stats")
def get_stats():

    products = list(collection.find({}, {"_id": 0}))

    return {
        "total_products": len(products),
        "total_artisans": len(set(p["artisan"] for p in products)),
        "total_regions": len(set(p["region"] for p in products)),
        "categories": len(set(p["category"] for p in products))
    }