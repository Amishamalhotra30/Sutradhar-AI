from fastapi import APIRouter, HTTPException, Query, Depends

from app.database import db
from app.auth.dependencies import verify_token

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)

collection = db["products"]


# ==========================
# GET - List All Products
# ==========================
@router.get("/")
def get_products():

    products = list(
        collection.find(
            {},
            {"_id": 0}
        )
    )

    return products


# ==========================
# GET - Single Product
# ==========================
@router.get("/{product_id}")
def get_product(product_id: int):

    product = collection.find_one(
        {"id": product_id},
        {"_id": 0}
    )

    if product:
        return product

    raise HTTPException(
        status_code=404,
        detail="Product not found"
    )


# ==========================
# POST - Create Product
# ==========================
@router.post("/", status_code=201)
def create_product(
    product: dict,
    payload=Depends(verify_token)
):

    last_product = collection.find_one(
        sort=[("id", -1)]
    )

    new_id = 1 if last_product is None else last_product["id"] + 1

    product["id"] = new_id

    collection.insert_one(product)

    return product


# ==========================
# PUT - Update Product
# ==========================
@router.put("/{product_id}")
def update_product(
    product_id: int,
    updated_product: dict,
    payload=Depends(verify_token)
):

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

    return updated_product


# ==========================
# DELETE - Delete Product
# ==========================
@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    payload=Depends(verify_token)
):

    result = collection.delete_one(
        {"id": product_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return


# ==========================
# SEARCH - Search Products
# ==========================
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