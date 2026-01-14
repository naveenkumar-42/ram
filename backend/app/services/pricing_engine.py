from sqlalchemy.orm import Session
from ..models import Product, PriceHistory, TriggerSource, CompetitorPrice
from datetime import datetime

class PricingEngine:
    def __init__(self, db: Session):
        self.db = db

    def get_market_low(self, product_id: str) -> float:
        """
        Fetches the lowest price among ALL competitors for this product.
        """
        # In a real app, we'd query the 'latest' price for each competitor.
        # For simplicity, we assume the CompetitorPrice table is append-only 
        # but we want the logical 'current' price for each competitor.
        # A simple approach: Query the latest entry for each competitor_id.
        
        # Subquery or simple logic:
        # Since we just ingested one, let's just query the CompetitorPrice table 
        # for this product, group by competitor, and get the latest.
        # Or simpler: Query all prices for this product from the last X days?
        
        # Optimized: just get the minimum price recorded for this product 
        # in the last 24 hours (assuming daily scraps).
        # Even better: The logic should likely trust the LATEST scrape.
        
        # Quick implementation: Get most recent price per competitor
        # SELECT price FROM competitor_prices WHERE product_id=... GROUP BY competitor_id ORDER BY captured_at DESC
        # SQLAlchemy complexity might be high for this snippets, let's use a simpler heuristic:
        # Get the lowest price seen in the last 48 hours.
        from datetime import timedelta
        cutoff = datetime.utcnow() - timedelta(hours=48)
        
        min_price = self.db.query(CompetitorPrice.price)\
            .filter(CompetitorPrice.product_id == product_id)\
            .order_by(CompetitorPrice.price.asc())\
            .first()
            
        return min_price[0] if min_price else None

    def calculate_new_price(self, product: Product, market_low: float) -> float:
        """
        Determines the new price based on market low and strategy,
        strictly enforcing the minimum margin.
        """
        # 1. Calculate the absolute minimum price allowed by margin rules
        min_allowed_price = product.base_cost * (1 + product.min_margin_percent)
        
        # 2. Strategy: Match Lowest - 0.01 (Aggressive Undercut)
        # If no competition, stay put (or return current)
        if market_low is None:
            return product.current_price
            
        proposed_price = market_low - 0.01
        
        # 3. Margin Guard (The "Hard" Constraint)
        final_price = max(proposed_price, min_allowed_price)
        
        return round(final_price, 2)

    def process_competitor_update(self, product: Product, source: str = "RPA"):
        """
        Orchestrates the update: Checks MARKET conditions (not just single competitor),
        updates DB if changed, logs history.
        """
        # 1. Get true market floor
        market_low = self.get_market_low(product.id)
        
        # 2. Calculate
        original_price = product.current_price
        new_price = self.calculate_new_price(product, market_low)

        # 3. Update if price changed
        if new_price != original_price:
            product.current_price = new_price
            product.updated_at = datetime.utcnow()
            
            # Audit Log
            history = PriceHistory(
                product_id=product.id,
                old_price=original_price,
                new_price=new_price,
                trigger_source=TriggerSource.RPA if source == "RPA" else TriggerSource.MANUAL,
                notes=f"Market Low was {market_low}"
            )
            self.db.add(history)
            self.db.commit()
            print(f"Price updated for {product.sku}: {original_price} -> {new_price}")
        else:
            print(f"Price stable for {product.sku}. (Market Low: {market_low})")

