from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.medicine import Medicine
from app.models.sale import Sale
from app.schemas.sale import SaleCreate


def create_sale(db: Session, sale: SaleCreate):

    customer = (
        db.query(Customer)
        .filter(Customer.id == sale.customer_id)
        .first()
    )

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    medicine = (
        db.query(Medicine)
        .filter(Medicine.id == sale.medicine_id)
        .first()
    )

    if medicine is None:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found"
        )

    if medicine.stock < sale.quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock"
        )

    total = float(medicine.price) * sale.quantity

    db_sale = Sale(
        customer_id=sale.customer_id,
        medicine_id=sale.medicine_id,
        quantity=sale.quantity,
        unit_price=medicine.price,
        total_price=total,
    )

    medicine.stock -= sale.quantity

    customer.loyalty_points += int(total // 100)

    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    return db_sale