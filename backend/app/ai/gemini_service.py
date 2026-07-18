import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_heritage_story(craft_name, state, artisan_name, speciality):
    prompt = f"""
You are an expert Indian cultural historian.

Craft Name: {craft_name}
State: {state}
Artisan Name: {artisan_name}
Speciality: {speciality}

Write a beautiful heritage story (200–250 words). Explain the history,
cultural significance, and the artisan's contribution.
Return only the story.
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt,
    )

    return response.text