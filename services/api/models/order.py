from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


class OrderItem(BaseModel):
    product_id: UUID
    quantity: int
    unit_price: float


class OrderCreate(BaseModel):
    customer_id: UUID
    items: List[OrderItem]
    shipping_address: dict


class OrderRead(OrderCreate):
    id: UUID
    status: str = "pending"
    created_at: datetime
    total: float
