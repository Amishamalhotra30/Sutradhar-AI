from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from app.database import db
import base64


router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)

collection = db["products"]


# =========================================================
# GET - List all products
# =========================================================

@router.get("/")
def get_products():

    products = list(
        collection.find(
            {},
            {"_id": 0}
        )
    )

    return products


# =========================================================
# GET - Single product
# =========================================================

@router.get("/{product_id}")
def get_product(product_id: int):

    product = collection.find_one(
        {"id": product_id},
        {"_id": 0}
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# =========================================================
# POST - Create product with image
# =========================================================

@router.post("/", status_code=201)
async def create_product(
    name: str = Form(...),
    artisan: str = Form(...),
    region: str = Form(...),
    category: str = Form(...),
    price: int = Form(...),
    status: str = Form("Market Ready"),
    image: UploadFile | None = File(None)
):

    # -----------------------------------------------------
    # Generate ID
    # -----------------------------------------------------

    last_product = collection.find_one(
        sort=[("id", -1)]
    )

    new_id = (
        1
        if last_product is None
        else last_product["id"] + 1
    )

    # -----------------------------------------------------
    # Prepare image
    # -----------------------------------------------------

    image_data = None
    image_type = None

    if image:

        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Only image files are allowed."
            )

        image_bytes = await image.read()

        # 2 MB limit
        if len(image_bytes) > 2 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Image size must be less than 2MB."
            )

        encoded_image = base64.b64encode(
            image_bytes
        ).decode("utf-8")

        image_data = encoded_image
        image_type = image.content_type

    # -----------------------------------------------------
    # Product document
    # -----------------------------------------------------

    product = {
        "id": new_id,
        "name": name,
        "artisan": artisan,
        "region": region,
        "category": category,
        "price": price,
        "status": status,
        "image": image_data,
        "image_type": image_type
    }

    # -----------------------------------------------------
    # Save to MongoDB
    # -----------------------------------------------------

    collection.insert_one(product)

    return {
        "id": new_id,
        "name": name,
        "artisan": artisan,
        "region": region,
        "category": category,
        "price": price,
        "status": status,
        "image": image_data,
        "image_type": image_type
    }


# =========================================================
# PUT - Update product
# =========================================================

@router.put("/{product_id}")
async def update_product(
    product_id: int,
    name: str = Form(...),
    artisan: str = Form(...),
    region: str = Form(...),
    category: str = Form(...),
    price: int = Form(...),
    status: str = Form("Market Ready"),
    image: UploadFile | None = File(None)
):

    existing_product = collection.find_one(
        {"id": product_id}
    )

    if not existing_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    update_data = {
        "name": name,
        "artisan": artisan,
        "region": region,
        "category": category,
        "price": price,
        "status": status
    }

    # -----------------------------------------------------
    # Update image only if a new image was selected
    # -----------------------------------------------------

    if image:

        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Only image files are allowed."
            )

        image_bytes = await image.read()

        if len(image_bytes) > 2 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Image size must be less than 2MB."
            )

        update_data["image"] = base64.b64encode(
            image_bytes
        ).decode("utf-8")

        update_data["image_type"] = image.content_type

    collection.update_one(
        {"id": product_id},
        {"$set": update_data}
    )

    return collection.find_one(
        {"id": product_id},
        {"_id": 0}
    )


# =========================================================
# DELETE - Delete product
# =========================================================

@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int):

    result = collection.delete_one(
        {"id": product_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return


# =========================================================
# SEARCH
# =========================================================

@router.get("/search/")
def search_products(q: str = Query(...)):

    query = {
        "$or": [
            {
                "name": {
                    "$regex": q,
                    "$options": "i"
                }
            },
            {
                "artisan": {
                    "$regex": q,
                    "$options": "i"
                }
            },
            {
                "region": {
                    "$regex": q,
                    "$options": "i"
                }
            },
            {
                "category": {
                    "$regex": q,
                    "$options": "i"
                }
            }
        ]
    }

    results = list(
        collection.find(
            query,
            {"_id": 0}
        )
    )

    return results