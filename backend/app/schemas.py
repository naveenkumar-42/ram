from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# --- Shared Enums or Types ---
# (Can import from models if Pydantic v2 compatible, or redefine to decouple)

# --- Product Schemas ---
class ProductBase(BaseModel):
    sku: str
    name: str
    description: Optional[str] = None
    base_cost: float = Field(..., gt=0, description="Cost price of the product")
    min_margin_percent: float = Field(0.10, ge=0, description="Minimum margin (0.10 = 10%)")
    current_price: float = Field(..., gt=0, description="Current selling price")

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    # Allow partial updates
    name: Optional[str] = None
    description: Optional[str] = None
    base_cost: Optional[float] = Field(None, gt=0)
    current_price: Optional[float] = Field(None, gt=0)
    min_margin_percent: Optional[float] = Field(None, ge=0)
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: str  # UUID as string
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- RPA Ingestion Schema ---
class CompetitorPriceIngest(BaseModel):
    product_sku: str
    competitor_name: str
    price: float = Field(..., gt=0)
    competitor_url: Optional[str] = None

# --- Price History / Analytics ---
class PriceHistoryResponse(BaseModel):
    id: str
    product_id: str
    old_price: float
    new_price: float
    trigger_source: str
    created_at: datetime

    class Config:
        from_attributes = True
