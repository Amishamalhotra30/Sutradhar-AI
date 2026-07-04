from fastapi import APIRouter, HTTPException, Query
from app.database import db

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)

collection = db["products"]


# GET - List all products
@router.get("/")
def get_products():
    products = list(collection.find({}, {"_id": 0}))
    return products


# GET - Single product
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


# POST - Create product
@router.post("/", status_code=201)
def create_product(product: dict):

    last_product = collection.find_one(
        sort=[("id", -1)]
    )

    new_id = 1 if last_product is None else last_product["id"] + 1

    product["id"] = new_id

    result = collection.insert_one(product)

    # Fetch the inserted document without _id
    created_product = collection.find_one(
        {"_id": result.inserted_id},
        {"_id": 0}
    )

    return created_product


# PUT - Update product
@router.put("/{product_id}")
def update_product(product_id: int, updated_product: dict):

    updated_product["id"] = product_id

    result = collection.update_one(
        {"id": product_id},
        {"$set": updated_product}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return collection.find_one(
        {"id": product_id},
        {"_id": 0}
    )


# DELETE - Delete product
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


# SEARCH - Search products
@router.get("/search/")
def search_products(q: str = Query(...)):

    query = {
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"artisan": {"$regex": q, "$options": "i"}},
            {"region": {"$regex": q, "$options": "i"}},
            {"category": {"$regex": q, "$options": "i"}}
        ]
    }

    results = list(
        collection.find(
            query,
            {"_id": 0}
        )
    )

    return results