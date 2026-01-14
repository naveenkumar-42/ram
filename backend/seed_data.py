import requests
import random
import time

BASE_URL = "http://localhost:8000/api/v1"

def seed_data():
    print("Seeding initial data...")
    
    products = [
        {"sku": "LPT-GAM-001", "name": "Alienware M15 R5", "base_cost": 1200.00, "current_price": 1500.00, "min_margin_percent": 0.15},
        {"sku": "PHN-IPH-13", "name": "iPhone 13 Pro 128GB", "base_cost": 900.00, "current_price": 1099.00, "min_margin_percent": 0.10},
        {"sku": "ACC-HEAD-XM4", "name": "Sony WH-1000XM4", "base_cost": 200.00, "current_price": 348.00, "min_margin_percent": 0.20},
        {"sku": "MON-LG-27", "name": "LG Ultragear 27GL850", "base_cost": 300.00, "current_price": 450.00, "min_margin_percent": 0.15},
    ]

    competitors = ["BestBuy", "Amazon", "Walmart", "Target"]

    for p in products:
        # Create Product
        try:
            r = requests.post(f"{BASE_URL}/products/", json=p)
            if r.status_code == 200:
                print(f"Created {p['name']}")
                
                # Simulate some history
                for _ in range(3):
                    comp = random.choice(competitors)
                    # Random price around base cost + margin + padding
                    min_price = p['base_cost'] * 1.2
                    rand_price = round(random.uniform(min_price * 0.9, min_price * 1.3), 2)
                    
                    requests.post(f"{BASE_URL}/ingest/competitor-price", json={
                        "product_sku": p['sku'],
                        "competitor_name": comp,
                        "price": rand_price,
                        "competitor_url": "http://example.com"
                    })
                    time.sleep(0.1)
            else:
                print(f"Skipped {p['name']} (Exists?)")
        except Exception as e:
            print(f"Error seeding {p['name']}: {e}")

if __name__ == "__main__":
    seed_data()
