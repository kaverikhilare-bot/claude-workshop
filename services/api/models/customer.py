from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime


class CustomerCreate(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[dict] = None
    source: Optional[str] = "landing_page"


class CustomerRead(CustomerCreate):
    id: UUID
    created_at: datetime
    last_seen_at: Optional[datetime] = None
