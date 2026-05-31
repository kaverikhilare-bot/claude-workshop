from fastapi import APIRouter, HTTPException
from models.product import ProductCreate, ProductRead
import os
from supabase import create_client

router = APIRouter()
supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])


@router.get("/", response_model=list[ProductRead])
def list_products(category: str | None = None):
    query = supabase.table("products").select("*")
    if category:
        query = query.eq("category", category)
    result = query.execute()
    return result.data or []


@router.get("/{product_id}", response_model=ProductRead)
def get_product(product_id: str):
    result = supabase.table("products").select("*").eq("id", product_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data


@router.post("/", response_model=ProductRead, status_code=201)
def create_product(payload: ProductCreate):
    result = supabase.table("products").insert(payload.model_dump()).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to create product")
    return result.data[0]
