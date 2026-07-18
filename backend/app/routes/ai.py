from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

from app.ai.gemini_service import generate_heritage_story
from app.database import stories_collection

router = APIRouter()


class StoryRequest(BaseModel):
    craft_name: str
    state: str
    artisan_name: str
    speciality: str


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


@router.get("/stories")
def get_stories():

    stories = list(
        stories_collection.find(
            {},
            {"_id": 0}
        ).sort("created_at", -1)
    )

    return stories