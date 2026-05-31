from fastapi import APIRouter, HTTPException
from models.customer import CustomerCreate, CustomerRead
import os
from supabase import create_client

router = APIRouter()
supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])


@router.post("/", response_model=CustomerRead, status_code=201)
def create_customer(payload: CustomerCreate):
    result = supabase.table("customers").insert(payload.model_dump()).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to create customer")
    return result.data[0]


@router.get("/{customer_id}", response_model=CustomerRead)
def get_customer(customer_id: str):
    result = supabase.table("customers").select("*").eq("id", customer_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Customer not found")
    return result.data


@router.get("/", response_model=list[CustomerRead])
def list_customers():
    result = supabase.table("customers").select("*").order("created_at", desc=True).execute()
    return result.data or []
