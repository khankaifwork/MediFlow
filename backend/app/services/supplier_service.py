from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.supplier import Supplier
from app.schemas.supplier import SupplierCreate, SupplierUpdate


def create_supplier(db: Session, supplier: SupplierCreate):
    existing_supplier = (
        db.query(Supplier)
        .filter(Supplier.phone == supplier.phone)
        .first()
    )

    if existing_supplier:
        raise HTTPException(
            status_code=400,
            detail="Supplier already exists",
        )

    db_supplier = Supplier(**supplier.model_dump())

    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)

    return db_supplier


def get_all_suppliers(db: Session):
    return db.query(Supplier).all()


def get_supplier(db: Session, supplier_id: int):
    supplier = (
        db.query(Supplier)
        .filter(Supplier.id == supplier_id)
        .first()
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found",
        )

    return supplier


def update_supplier(
    db: Session,
    supplier_id: int,
    supplier_data: SupplierUpdate,
):
    supplier = get_supplier(db, supplier_id)

    for key, value in supplier_data.model_dump().items():
        setattr(supplier, key, value)

    db.commit()
    db.refresh(supplier)

    return supplier


def delete_supplier(db: Session, supplier_id: int):
    supplier = get_supplier(db, supplier_id)

    db.delete(supplier)
    db.commit()

    return {
        "message": "Supplier deleted successfully"
    }