from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate


def create_customer(db: Session, customer: CustomerCreate):
    existing_customer = (
        db.query(Customer)
        .filter(Customer.phone == customer.phone)
        .first()
    )

    if existing_customer:
        raise HTTPException(
            status_code=400,
            detail="Customer already exists"
        )

    db_customer = Customer(
        name=customer.name,
        phone=customer.phone,
        email=customer.email,
        address=customer.address
    )

    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)

    return db_customer


def get_all_customers(db: Session):
    return db.query(Customer).all()