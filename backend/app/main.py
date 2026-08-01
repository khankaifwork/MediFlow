from fastapi import FastAPI

from app.database.database import Base, engine

# Import models
from app.models.medicine import Medicine
from app.models.user import User
from app.models.customer import Customer
from app.models.supplier import Supplier
from app.models.purchase import Purchase
from app.models.sale import Sale
from app.models.sale_item import SaleItem

# Import routers
from app.routers.medicines import router as medicines_router
from app.routers.users import router as users_router
from app.routers.customers import router as customers_router
from app.routers.suppliers import router as suppliers_router
from app.routers.purchases import router as purchases_router
from app.routers.sales import router as sales_router

app = FastAPI(
    title="MediFlow AI",
    description="AI Powered Medical Store Management System",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

app.include_router(
    medicines_router,
    prefix="/medicines",
    tags=["Medicines"]
)

app.include_router(users_router)
app.include_router(customers_router)
app.include_router(suppliers_router)
app.include_router(purchases_router)
app.include_router(sales_router)


@app.get("/")
def home():
    return {
        "app_name": "MediFlow",
        "version": "1.0.0",
        "developer": "Kaif Khan",
        "status": "Running"
    }


@app.get("/about")
def project_information():
    return {
        "project": "Medical Store Management",
        "purpose": "Manage inventory, sales, AI assistance"
    }