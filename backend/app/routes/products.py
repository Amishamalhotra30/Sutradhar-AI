from fastapi import APIRouter, HTTPException, Query
from app.data.products import products

router = APIRouter(prefix="/api/products", tags=["Products"])


# GET - List all products
@router.get("/")
def get_products():
    return products


# GET - Single product
@router.get("/{product_id}")
def get_product(product_id: int):
    for product in products:
        if product["id"] == product_id:
            return product
    raise HTTPException(status_code=404, detail="Product not found")


# POST - Create product
@router.post("/", status_code=201)
def create_product(product: dict):
    new_id = max([p["id"] for p in products], default=0) + 1
    product["id"] = new_id
    products.append(product)
    return product


# PUT - Update product
@router.put("/{product_id}")
def update_product(product_id: int, updated_product: dict):
    for index, product in enumerate(products):
        if product["id"] == product_id:
            updated_product["id"] = product_id
            products[index] = updated_product
            return updated_product

    raise HTTPException(status_code=404, detail="Product not found")


# DELETE - Delete product
@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int):
    for index, product in enumerate(products):
        if product["id"] == product_id:
            products.pop(index)
            return

    raise HTTPException(status_code=404, detail="Product not found")


# SEARCH - Search products
@router.get("/search/")
def search_products(q: str = Query(...)):
    results = [
        product for product in products
        if q.lower() in product["name"].lower()
        or q.lower() in product["artisan"].lower()
        or q.lower() in product["region"].lower()
        or q.lower() in product["category"].lower()
    ]
    return results