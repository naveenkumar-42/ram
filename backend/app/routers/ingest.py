from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import CompetitorPriceIngest
from ..models import Product, Competitor, CompetitorPrice
from ..services.pricing_engine import PricingEngine

router = APIRouter(prefix="/ingest", tags=["ingest"])

def process_pricing_update(db: Session, product_id: str, price: float):
    # Re-fetch inside background task if needed, or pass object if session valid
    # For simplicity in this demo, we run logic synchronously or passed session
    # Ideally, background tasks should open their own session.
    pass 

@router.post("/competitor-price")
def ingest_competitor_price(
    data: CompetitorPriceIngest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # 1. Find Product
    product = db.query(Product).filter(Product.sku == data.product_sku).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product SKU {data.product_sku} not found")

    # 2. Find/Create Competitor
    competitor = db.query(Competitor).filter(Competitor.name == data.competitor_name).first()
    if not competitor:
        competitor = Competitor(name=data.competitor_name, base_url=data.competitor_url)
        db.add(competitor)
        db.commit()
        db.refresh(competitor)

    # 3. Log Raw Data
    comp_price = CompetitorPrice(
        product_id=product.id,
        competitor_id=competitor.id,
        price=data.price
    )
    db.add(comp_price)
    
    # 4. Trigger Pricing Engine
    # We commit first to ensure raw data is safe
    db.commit()
    
    engine = PricingEngine(db)
    # This runs synchronously for now to return immediate feedback in demo
    # We don't pass data.price anymore; the engine queries aggregate data
    engine.process_competitor_update(product, source="RPA")

    return {"status": "processed", "new_current_price": product.current_price}
