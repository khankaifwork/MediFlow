from sqlalchemy.orm import Session

from app.models.medicine import Medicine
from app.schemas.medicine import MedicineCreate, MedicineUpdate

from fastapi import HTTPException

def create_medicine(db: Session, medicine: MedicineCreate):

    existing = db.query(Medicine).filter(
        Medicine.name == medicine.name
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Medicine already exists"
        )

    db_medicine = Medicine(
        name=medicine.name,
        manufacturer=medicine.manufacturer,
        price=medicine.price,
        stock=medicine.stock,
        expiry_date=medicine.expiry_date,
        prescription_required=medicine.prescription_required,
    )

    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)

    return db_medicine

def get_all_medicines(db: Session , skip: int=0, limit: int = 10):
    return (
        db.query(Medicine)
        .offset(skip)
        .limit(limit)
        .all()
    )
def get_medicine_by_id(db: Session, medicine_id: int):
    return db.query(Medicine).filter(Medicine.id == medicine_id).first()

def update_medicine(db: Session, medicine_id: int, medicine: MedicineUpdate):
    db_medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()

    if db_medicine is None:
        return None

    db_medicine.name = medicine.name
    db_medicine.manufacturer = medicine.manufacturer
    db_medicine.price = medicine.price
    db_medicine.stock = medicine.stock
    db_medicine.expiry_date = medicine.expiry_date
    db_medicine.prescription_required = medicine.prescription_required

    db.commit()
    db.refresh(db_medicine)

    return db_medicine

def delete_medicine(db: Session, medicine_id: int):
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()

    if medicine is None:
        return None

    db.delete(medicine)
    db.commit()

    return medicine

def search_medicines(db: Session, name: str):
    return (
        db.query(Medicine)
        .filter(Medicine.name.ilike(f"%{name}%"))
        .all()
    )

