#!/bin/bash
# run_demo.sh

# Function to clean up background processes on exit
cleanup() {
    echo "Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

echo "=================================================="
echo " Starting Intelligent Dynamic Pricing System"
echo "=================================================="

# 1. Start Backend
echo "[1/3] Starting FastAPI Backend..."

# Setup/Activate Venv (assume in root based on project structure)
if [ ! -d "venv" ]; then 
    echo "Creating virtual environment in root..."
    python3 -m venv venv
fi
source venv/bin/activate

echo "Installing backend dependencies..."
# Install requirements from backend folder
pip install -r backend/requirements.txt
pip install requests

cd backend
echo "Starting Uvicorn..."
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
echo "Backend running on PID $BACKEND_PID"
cd ..


# 2. Start Frontend
echo "[2/3] Starting React Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend running on PID $FRONTEND_PID"
cd ..

echo "=================================================="
echo " System is LIVE at http://localhost:5173"
echo " Backend API at http://localhost:8000"
echo "=================================================="
echo ""
echo "To simulate competitor prices:"
echo "  Run: python3 backend/simulate_market.py"
echo ""
echo "Press CTRL+C to stop everything."

wait
