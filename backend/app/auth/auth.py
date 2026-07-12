from fastapi import APIRouter, HTTPException, Depends, Request
from passlib.context import CryptContext

from app.database import db
from app.models.user_model import (
    UserRegister,
    UserLogin,
    GoogleToken
)

from app.auth.dependencies import verify_token
from app.rate_limiter import limiter

import os
from datetime import datetime, timedelta

from jose import jwt
from dotenv import load_dotenv

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# Load environment variables
load_dotenv()

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

# MongoDB Collection
collection = db["users"]

# Password Hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7


# ==========================================
# REGISTER
# ==========================================
@router.post("/register", status_code=201)
@limiter.limit("5/minute")
def register(
    request: Request,
    user: UserRegister
):

    existing_user = collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    hashed_password = pwd_context.hash(
        user.password
    )

    new_user = {
        "email": user.email,
        "password": hashed_password,
        "google": False
    }

    collection.insert_one(new_user)

    return {
        "message": "User registered successfully."
    }


# ==========================================
# LOGIN
# ==========================================
@router.post("/login")
@limiter.limit("5/minute")
def login(
    request: Request,
    user: UserLogin
):

    existing_user = collection.find_one(
        {"email": user.email}
    )

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    if existing_user.get("google"):
        raise HTTPException(
            status_code=400,
            detail="Please login using Google."
        )

    if not pwd_context.verify(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    expire = datetime.utcnow() + timedelta(
        days=ACCESS_TOKEN_EXPIRE_DAYS
    )

    access_token = jwt.encode(
        {
            "sub": user.email,
            "exp": expire
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ==========================================
# GOOGLE LOGIN
# ==========================================
@router.post("/google")
def google_login(
    token: GoogleToken
):

    try:

        idinfo = id_token.verify_oauth2_token(
            token.credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo["email"]

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid Google Token."
        )

    existing_user = collection.find_one(
        {"email": email}
    )

    if not existing_user:

        collection.insert_one(
            {
                "email": email,
                "password": None,
                "google": True
            }
        )

    expire = datetime.utcnow() + timedelta(
        days=ACCESS_TOKEN_EXPIRE_DAYS
    )

    access_token = jwt.encode(
        {
            "sub": email,
            "exp": expire
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ==========================================
# CURRENT USER
# ==========================================
@router.get("/me")
def get_current_user(
    payload=Depends(verify_token)
):

    return {
        "message": "Access Granted",
        "user": payload["sub"]
    }