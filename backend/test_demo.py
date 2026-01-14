import requests
import uuid

BASE_URL = "http://localhost:8000/api/v1"

def test_flow():
    # 1. Create Product
    sku = f"TEST-{uuid.uuid4().hex[:6]}"
    product_payload = {
        "sku": sku,
        "name": "Gaming Mouse",
        "base_cost": 50.00,
        "current_price": 100.00,
        "min_margin_percent": 0.20 # Min Price = 50 * 1.2 = 60.00
    }
    print(f"Creating product {sku}...")
    resp = requests.post(f"{BASE_URL}/products/", json=product_payload)
    if resp.status_code != 200:
        print("Failed to create product:", resp.text)
        return
    
    # 2. Ingest Competitor Price (High Price - Should ignore or stay same if strategy is match lowest)
    # Actually current strategy is "MATCH_LOWEST" - 0.01
    
    # Scenario A: Competitor is 80.00. we are 100.00. Cost is 50. Min is 60.
    # New should be 79.99
    print("Ingesting Competitor Price: 80.00...")
    ingest_payload = {
        "product_sku": sku,
        "competitor_name": "TechStore",
        "price": 80.00,
        "competitor_url": "http://example.com"
    }
    resp = requests.post(f"{BASE_URL}/ingest/competitor-price", json=ingest_payload)
    print("Ingest Response:", resp.json())

    # 3. Verify Update
    # Fetch product
    # We need the ID from step 1, but we can query purely by assuming the response contained it
    # Or just trust the ingest response returns "new_current_price"
    
    # Scenario B: Competitor is 40.00 (Below Cost + Margin).
    # We are 79.99. Cost 50. Min 60.
    # New should be 60.00 (Margin Guard)
    print("Ingesting Aggressive Competitor Price: 40.00...")
    ingest_payload["price"] = 40.00
    resp = requests.post(f"{BASE_URL}/ingest/competitor-price", json=ingest_payload)
    print("Ingest Response (Should hit floor):", resp.json())

if __name__ == "__main__":
    test_flow()
