from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas import ProductCreate, ProductResponse, ProductUpdate
from ..models import Product

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/", response_model=List[ProductResponse])
def list_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Product).offset(skip).limit(limit).all()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.patch("/{product_id}", response_model=ProductResponse)
def update_product_rules(product_id: str, updates: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product

@router.get("/{product_id}/history", response_model=List[dict])
def get_product_history(product_id: str, db: Session = Depends(get_db)):
    from ..models import PriceHistory
    history = db.query(PriceHistory).filter(PriceHistory.product_id == product_id).order_by(PriceHistory.created_at.desc()).all()
    # Simple manual serialization for demo or duplicate schema 
    return [
        {
            "old_price": h.old_price, 
            "new_price": h.new_price, 
            "trigger_source": h.trigger_source.value if h.trigger_source else "unknown", 
            "created_at": h.created_at,
            "notes": h.notes
        } 
        for h in history
    ]
