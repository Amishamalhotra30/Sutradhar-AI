from pydantic import BaseModel
from typing import Optional


class Product(BaseModel):
    name: str
    artisan: str
    region: str
    category: str
    price: int
    status: str = "Market Ready"
    image: Optional[str] = None
    image_type: Optional[str] = None