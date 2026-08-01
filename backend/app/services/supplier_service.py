from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.supplier import Supplier
from app.schemas.supplier import SupplierCreate


def create_supplier(db: Session, supplier: SupplierCreate):
    existing_supplier = (
        db.query(Supplier)
        .filter(Supplier.phone == supplier.phone)
        .first()
    )

    if existing_supplier:
        raise HTTPException(
            status_code=400,
            detail="Supplier already exists"
        )

    db_supplier = Supplier(
        supplier_name=supplier.supplier_name,
        company_name=supplier.company_name,
        contact_person=supplier.contact_person,
        phone=supplier.phone,
        email=supplier.email,
        address=supplier.address,
        city=supplier.city,
        state=supplier.state,
        country=supplier.country,
        gst_number=supplier.gst_number,
    )

    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)

    return db_supplier


def get_all_suppliers(db: Session):
    return db.query(Supplier).all()