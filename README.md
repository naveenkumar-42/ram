# Intelligent E-Commerce Dynamic Pricing System

## Fully Integrated System
This project is complete and fully functional. It consists of:
1.  **Backend**: FastAPI, SQLAlchemy, SQLite/Postgres.
2.  **Frontend**: React (Vite), Tailwind CSS, Recharts.
3.  **Logic**: Pricing Engine with Margin Guard & Market Aggregation.

## 🚀 Quick Start (Run Everything)

### 1. Start the Backend Server
Open a terminal:
```bash
cd backend
# Create venv if not exists, or just use python
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python init_db.py  # Reset DB
python seed_data.py # Populate dummy data
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start the Frontend Dashboard
Open a NEW terminal:
```bash
cd frontend
npm install
npm run dev
```

### 3. Use the System
1.  Open **`http://localhost:5173`** in your browser.
2.  You will see the Dashboard populated with seeded products (iPhone, Alienware, etc.).
3.  Click on any product to see its real-time Price History chart.
4.  **Simulate Competitors**: Use the `seed_data.py` or `test_aggregation.py` scripts to "inject" competitor prices and watch the Dashboard update (manual refresh may be needed for this MVP).

## System Architecture
*   `backend/`: Python source code.
*   `frontend/`: React source code.
*   `brain/`: Design documents (ER Diagram, API Docs, RPA Design).
