from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.core.auth import (
    get_current_user,
    require_admin,
)

from app.models.user import User

from app.schemas.customer import (
    CustomerCreate,
    CustomerUpdate,
    CustomerResponse,
)

from app.services.customer_service import (
    create_customer,
    get_all_customers,
    get_customer_by_id,
    update_customer,
    delete_customer,
    search_customers,
)

router = APIRouter()


@router.post("/", response_model=CustomerResponse)
def add_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db),
):
    return create_customer(db, customer)


@router.get("/", response_model=list[CustomerResponse])
def read_customers(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_customers(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get("/search", response_model=list[CustomerResponse])
def search_customer(
    name: str,
    db: Session = Depends(get_db),
):
    return search_customers(db, name)


@router.get("/{customer_id}", response_model=CustomerResponse)
def read_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    customer = get_customer_by_id(db, customer_id)

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    return customer


@router.put("/{customer_id}", response_model=CustomerResponse)
def edit_customer(
    customer_id: int,
    customer: CustomerUpdate,
    db: Session = Depends(get_db),
):
    updated = update_customer(
        db,
        customer_id,
        customer,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    return updated


@router.delete("/{customer_id}")
def remove_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    customer = delete_customer(
        db,
        customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    return {
        "message": "Customer deleted successfully"
    }