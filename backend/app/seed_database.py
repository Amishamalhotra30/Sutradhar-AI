from app.database import db
from app.data.products import products

collection = db["products"]

# Clear old data (only for first migration)
collection.delete_many({})

# Insert products
collection.insert_many(products)

print("Products inserted successfully!")