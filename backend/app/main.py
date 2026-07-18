from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from slowapi.middleware import SlowAPIMiddleware

from app.database import db
from app.routes.products import router as products_router
from app.routes.stats import router as stats_router
from app.routes.ai import router as ai_router
from app.auth.auth import router as auth_router
from app.rate_limiter import limiter

app = FastAPI(
    title="Sutradhar AI Backend",
    description="Backend API for Sutradhar AI",
    version="1.0.0"
)

# ==========================================
# Rate Limiter
# ==========================================
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# ==========================================
# CORS
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# Routes
# ==========================================
app.include_router(products_router)
app.include_router(stats_router)
app.include_router(auth_router)
app.include_router(ai_router, prefix="/api/ai", tags=["AI"])

# ==========================================
# Home
# ==========================================
@app.get("/")
def home():
    return {
        "message": "Welcome to the Sutradhar AI Backend!"
    }

# ==========================================
# Health Check
# ==========================================
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