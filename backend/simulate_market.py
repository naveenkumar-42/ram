import requests
import random
import time
import sys

# Configuration
API_URL = "http://localhost:8000/api/v1"
PRODUCTS = [
    {"sku": "LPT-GAM-001", "name": "Alienware M15 R5", "url": "http://competitor-tech.com/alienware"},
    {"sku": "PHN-IPH-13", "name": "iPhone 13 Pro", "url": "http://mobile-shop.com/iphone"},
    {"sku": "ACC-HEAD-XM4", "name": "Sony WH-1000XM4", "url": "http://audio-world.com/sony"},
    {"sku": "MON-LG-27", "name": "LG Ultragear 27GL850", "url": "http://display-mart.com/lg"},
]

COMPETITORS = ["BestBuy", "Amazon", "Walmart", "Target"]

def simulate_market():
    print(f"Starting Market Simulation -> {API_URL}")
    print("Press CTRL+C to stop.")
    
    while True:
        try:
            # Pick a random product and competitor
            product = random.choice(PRODUCTS)
            competitor = random.choice(COMPETITORS)
            
            # Generate a random price logic (fluctuate around a base)
            if "LPT" in product["sku"]:
                base = 1200
            elif "PHN" in product["sku"]:
                base = 1000
            elif "ACC" in product["sku"]:
                base = 300
            else:
                base = 400
                
            variance = random.uniform(-0.15, 0.15) # +/- 15%
            price = round(base * (1 + variance), 2)
            
            payload = {
                "product_sku": product["sku"],
                "competitor_name": competitor,
                "competitor_url": product["url"],
                "price": price
            }
            
            print(f"Injecting: {competitor} -> {product['sku']} @ ${price}")
            
            resp = requests.post(f"{API_URL}/ingest/competitor-price", json=payload)
            if resp.status_code == 200:
                data = resp.json()
                print(f"  [SUCCESS] System Repriced? {data.get('new_current_price')}")
            else:
                print(f"  [ERROR] {resp.status_code} - {resp.text}")
                
            time.sleep(3) # Wait 3 seconds
            
        except KeyboardInterrupt:
            print("\nStopping simulation.")
            sys.exit(0)
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    simulate_market()
