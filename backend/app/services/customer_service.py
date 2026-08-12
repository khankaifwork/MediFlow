from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


def create_customer(db: Session, customer: CustomerCreate):
    existing = (
        db.query(Customer)
        .filter(Customer.phone == customer.phone)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Customer already exists"
        )

    db_customer = Customer(
        name=customer.name,
        phone=customer.phone,
        email=customer.email,
        address=customer.address,
    )

    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)

    return db_customer


def get_all_customers(
    db: Session,
    skip: int = 0,
    limit: int = 10,
):
    return (
        db.query(Customer)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_customer_by_id(
    db: Session,
    customer_id: int,
):
    return (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )


def update_customer(
    db: Session,
    customer_id: int,
    customer: CustomerUpdate,
):
    db_customer = get_customer_by_id(
        db,
        customer_id,
    )

    if db_customer is None:
        return None

    db_customer.name = customer.name
    db_customer.phone = customer.phone
    db_customer.email = customer.email
    db_customer.address = customer.address

    db.commit()
    db.refresh(db_customer)

    return db_customer


def delete_customer(
    db: Session,
    customer_id: int,
):
    customer = get_customer_by_id(
        db,
        customer_id,
    )

    if customer is None:
        return None

    db.delete(customer)
    db.commit()

    return customer


def search_customers(
    db: Session,
    name: str,
):
    return (
        db.query(Customer)
        .filter(Customer.name.ilike(f"%{name}%"))
        .all()
    )