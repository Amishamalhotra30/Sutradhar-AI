import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# =========================================================
# HERITAGE STORY
# =========================================================

def generate_heritage_story(
    craft_name,
    state,
    artisan_name,
    speciality
):

    prompt = f"""
You are an expert Indian cultural historian.

Craft Name: {craft_name}
State: {state}
Artisan Name: {artisan_name}
Speciality: {speciality}

Write a beautiful heritage story of 200–250 words.

Explain:

- the history of the craft
- its cultural significance
- traditional techniques
- the artisan's contribution

Return only the story.
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt,
    )

    return response.text


# =========================================================
# PRICING ASSISTANT
# =========================================================

def generate_pricing_analysis(
    product_name,
    category,
    labour_cost,
    material_cost,
    market_price,
    quantity
):

    total_cost = labour_cost + material_cost

    prompt = f"""
You are an AI business advisor helping Indian handicraft artisans
price their products fairly and profitably.

Product:
{product_name}

Category:
{category}

Labour Cost:
₹{labour_cost}

Material Cost:
₹{material_cost}

Current Market Price:
₹{market_price}

Quantity:
{quantity}

Total production cost:
₹{total_cost}

Provide:

1. Estimated minimum sustainable price
2. Recommended selling price
3. Estimated profit per product
4. Approximate profit margin
5. Comparison with the current market price
6. Whether the artisan may be underpricing or overpricing
7. A short pricing recommendation

IMPORTANT:

- Never recommend a price below the combined labour and material cost.
- Respect artisan labour and craftsmanship.
- Consider handmade and heritage value.
- Keep the recommendation realistic for the Indian handicraft market.
- Do not invent specific market statistics.
- Ensure all mathematical comparisons are internally consistent.

Return the answer in a clear structured format.
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt,
    )

    return response.text


# =========================================================
# MARKET ANALYSIS
# =========================================================

def generate_market_analysis(
    product_name,
    category,
    region,
    artisan,
    price,
    speciality
):
    prompt = f"""
You are an AI market intelligence assistant specializing in Indian
handicrafts and artisan businesses.

Analyze this product:

Product Name: {product_name}
Category: {category}
Region: {region}
Artisan: {artisan}
Selling Price: ₹{price}
Speciality: {speciality}

Your task is to evaluate the product's practical market potential.

IMPORTANT:
- Focus specifically on handmade Indian handicrafts.
- Do not invent real-time market statistics.
- Do not claim access to live market data.
- Base the analysis only on the information provided and reasonable
  qualitative business reasoning.
- Market readiness must be an integer from 0 to 100.
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT wrap the JSON in ```json or ```.

Return exactly this JSON structure:

{{
    "market_readiness": 75,

    "market_demand": "Moderate",

    "market_positioning": "A concise description of how this product is positioned in the handicraft market.",

    "market_opportunity": "A concise description of the commercial opportunity for this product.",

    "target_customers": [
        "Customer segment 1",
        "Customer segment 2",
        "Customer segment 3"
    ],

    "strengths": [
        "Product strength 1",
        "Product strength 2",
        "Product strength 3"
    ],

    "areas_to_improve": [
        "Improvement area 1",
        "Improvement area 2"
    ],

    "pricing_competitiveness": "A concise assessment of whether the current price appears reasonable based on the supplied information.",

    "online_selling_potential": "Low, Moderate, Good, or High",

    "recommended_marketing_channels": [
        "Marketing channel 1",
        "Marketing channel 2",
        "Marketing channel 3"
    ],

    "recommendations": [
        "Actionable recommendation 1",
        "Actionable recommendation 2",
        "Actionable recommendation 3"
    ],

    "final_recommendation": "A concise final business recommendation."
}}
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt,
    )

    text = response.text.strip()

    # Remove accidental markdown code fences if Gemini adds them
    if text.startswith("```json"):
        text = text[7:]

    if text.startswith("```"):
        text = text[3:]

    if text.endswith("```"):
        text = text[:-3]

    text = text.strip()

    import json

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        raise ValueError(
            f"Gemini returned invalid JSON for market analysis: {text}"
        )