from fastapi import FastAPI

from app.database import db
from app.routes.products import router as products_router
from app.routes.stats import router as stats_router

app = FastAPI(
    title="Sutradhar AI Backend",
    description="Backend API for Sutradhar AI",
    version="1.0.0"
)

app.include_router(products_router)
app.include_router(stats_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to the Sutradhar AI Backend!"
    }


@app.get("/health")
def health_check():
    try:
        db.command("ping")
        return {
            "status": "MongoDB Connected Successfully!"
        }
    except Exception as e:
        return {
            "status": "MongoDB Connection Failed",
            "error": str(e)
        }