import requests
import uuid
import time

BASE_URL = "http://localhost:8000/api/v1"

def test_market_aggregation():
    # 1. Create Product
    sku = f"AGG-TEST-{uuid.uuid4().hex[:6]}"
    print(f"\n--- Testing Market Aggregation for {sku} ---")
    product_payload = {
        "sku": sku,
        "name": "Headphones",
        "base_cost": 100.00,
        "current_price": 200.00,
        "min_margin_percent": 0.10 # Min = 110.00
    }
    r = requests.post(f"{BASE_URL}/products/", json=product_payload)
    product_id = r.json()["id"]
    
    # 2. Ingest Competitor A (High Price: 150)
    # Market Low should be 150. We undercut to 149.99
    print("Ingesting Comp A: 150.00")
    requests.post(f"{BASE_URL}/ingest/competitor-price", json={
        "product_sku": sku,
        "competitor_name": "Comp A",
        "price": 150.00
    })
    
    # 3. Ingest Competitor B (Lower Price: 130)
    # Market Low becomes 130. We undercut to 129.99
    print("Ingesting Comp B: 130.00")
    requests.post(f"{BASE_URL}/ingest/competitor-price", json={
        "product_sku": sku,
        "competitor_name": "Comp B",
        "price": 130.00
    })
    
    # 4. Ingest Competitor A again (Higher: 160)
    # Market Low is STILL 130 (because Comp B is active).
    # Price should remain 129.99 (stable)
    print("Ingesting Comp A again: 160.00 (Should NOT raise price because Comp B is still 130)")
    r = requests.post(f"{BASE_URL}/ingest/competitor-price", json={
        "product_sku": sku,
        "competitor_name": "Comp A",
        "price": 160.00
    })
    print(f"Result: {r.json()}")
    
    # 5. Fetch History
    print("Fetching History...")
    hist = requests.get(f"{BASE_URL}/products/{product_id}/history").json()
    for h in hist:
        print(f"  {h['created_at']}: {h['old_price']} -> {h['new_price']} ({h.get('notes')})")

if __name__ == "__main__":
    test_market_aggregation()
