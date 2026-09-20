import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.database.database import Base, engine
import app.models  # Ensure all SQLAlchemy models are registered

from app.routers.users import router as users_router
from app.routers.dashboard import router as dashboard_router
from app.routers.medicines import router as medicines_router
from app.routers.customers import router as customers_router
from app.routers.suppliers import router as suppliers_router
from app.routers.purchases import router as purchases_router
from app.routers.sales import router as sales_router
from app.routers.inventory import router as inventory_router
from app.routers.reports import router as reports_router
from app.routers.ai import router as ai_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database initialization warning: {e}")
    yield


app = FastAPI(
    title="MediFlow API",
    description="Enterprise Pharmacy Management & Intelligence API",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
origins_str = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://localhost:80"
)
origins = [origin.strip() for origin in origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register all API routers
app.include_router(users_router)
app.include_router(dashboard_router)
app.include_router(medicines_router)
app.include_router(customers_router)
app.include_router(suppliers_router)
app.include_router(purchases_router)
app.include_router(sales_router)
app.include_router(inventory_router)
app.include_router(reports_router)
app.include_router(ai_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to MediFlow API",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MediFlow API",
        "version": "1.0.0",
    }