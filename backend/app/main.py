from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine

from app.routers.users import router as users_router
from app.routers.dashboard import router as dashboard_router
from app.routers.medicines import router as medicines_router
from app.routers.customers import router as customers_router
from app.routers.suppliers import router as suppliers_router
from app.routers.purchases import router as purchases_router
from app.routers.sales import router as sales_router
from app.routers.inventory import router as inventory_router
from app.routers.reports import router as reports_router

print("Users router:", type(users_router))
print("Dashboard router:", type(dashboard_router))
print("Medicines router:", type(medicines_router))
print("Customers router:", type(customers_router))

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediFlow API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(dashboard_router, prefix="/dashboard")
app.include_router(medicines_router, prefix="/medicines")
app.include_router(customers_router, prefix="/customers")
app.include_router(suppliers_router)
app.include_router(purchases_router)
app.include_router(sales_router)
app.include_router(inventory_router)
app.include_router(reports_router)

@app.get("/")
def root():
    return {"message": "Welcome to MediFlow API"}