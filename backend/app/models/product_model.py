from pydantic import BaseModel


class Product(BaseModel):
    name: str
    artisan: str
    region: str
    category: str
    price: int