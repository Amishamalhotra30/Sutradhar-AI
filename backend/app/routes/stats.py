from fastapi import APIRouter
from app.data.products import products

router = APIRouter(prefix="/api", tags=["Statistics"])


@router.get("/stats")
def get_stats():
    return {
        "total_products": len(products),
        "total_artisans": len(set(p["artisan"] for p in products)),
        "total_regions": len(set(p["region"] for p in products)),
        "categories": len(set(p["category"] for p in products))
    }