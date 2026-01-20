from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import products, ingest
from .database import engine, Base

# Create tables on startup (for simplicity in this demo)
# In prod, use Alembic
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dynamic Pricing System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api/v1")
app.include_router(ingest.router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {"status": "ok", "system": "Intelligent Pricing Engine"}
