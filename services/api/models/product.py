from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    image_url: Optional[str] = None
    category: Optional[str] = None


class ProductRead(ProductCreate):
    id: UUID
