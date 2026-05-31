from fastapi import APIRouter, HTTPException
from models.order import OrderCreate, OrderRead
import os
from supabase import create_client

router = APIRouter()
supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])


@router.post("/", response_model=OrderRead, status_code=201)
def create_order(payload: OrderCreate):
    total = sum(item.unit_price * item.quantity for item in payload.items)
    data = payload.model_dump()
    data["total"] = total
    result = supabase.table("orders").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to create order")
    return result.data[0]


@router.get("/{order_id}", response_model=OrderRead)
def get_order(order_id: str):
    result = supabase.table("orders").select("*").eq("id", order_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return result.data
