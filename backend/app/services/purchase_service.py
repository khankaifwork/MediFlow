from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.purchase import Purchase
from app.models.supplier import Supplier
from app.models.medicine import Medicine
from app.schemas.purchase import PurchaseCreate


def create_purchase(db: Session, purchase: PurchaseCreate):

    supplier = (
        db.query(Supplier)
        .filter(Supplier.id == purchase.supplier_id)
        .first()
    )

    if supplier is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    medicine = (
        db.query(Medicine)
        .filter(Medicine.id == purchase.medicine_id)
        .first()
    )

    if medicine is None:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found"
        )

    db_purchase = Purchase(
        supplier_id=purchase.supplier_id,
        medicine_id=purchase.medicine_id,
        quantity=purchase.quantity,
        purchase_price=purchase.purchase_price,
        selling_price=purchase.selling_price,
        batch_number=purchase.batch_number,
        manufacture_date=purchase.manufacture_date,
        expiry_date=purchase.expiry_date,
    )

    db.add(db_purchase)

    # Increase stock automatically
    medicine.stock += purchase.quantity

    db.commit()

    db.refresh(db_purchase)

    return db_purchase