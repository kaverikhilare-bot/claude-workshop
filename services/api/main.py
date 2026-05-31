from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import products, customers, orders

app = FastAPI(title="claude-workshop API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(customers.router, prefix="/customers", tags=["customers"])
app.include_router(orders.router, prefix="/orders", tags=["orders"])


@app.get("/health")
def health():
    return {"status": "ok"}
