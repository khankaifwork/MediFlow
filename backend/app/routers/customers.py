from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.customer import CustomerCreate, CustomerResponse
from app.services.customer_service import (
    create_customer,
    get_all_customers
)
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.post("/", response_model=CustomerResponse)
def add_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_customer(db, customer)


@router.get("/", response_model=list[CustomerResponse])
def read_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_customers(db)