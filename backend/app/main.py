from fastapi import FastAPI
from app.models.user import User
from app.database.database import Base, engine
from app.routers.medicines import router
from app.models.medicine import Medicine
from app.routers import users

app = FastAPI(
    title="MediFlow AI",
    description="AI Powered Medical Store Management System",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

app.include_router(
    router,
    prefix="/medicines",
    tags=["Medicines"]
)

app.include_router(users.router)

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