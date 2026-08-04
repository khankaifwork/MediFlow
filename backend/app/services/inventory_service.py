from datetime import date, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.medicine import Medicine


def get_low_stock(db: Session):

    medicines = (
        db.query(Medicine)
        .filter(Medicine.stock <= 10)
        .all()
    )

    return medicines


def get_expiring_medicines(db: Session, days: int = 30):

    today = date.today()

    future_date = today + timedelta(days=days)

    medicines = (
        db.query(Medicine)
        .filter(Medicine.expiry_date >= today)
        .filter(Medicine.expiry_date <= future_date)
        .all()
    )

    return medicines

def get_expired_medicines(db: Session):

    today = date.today()

    medicines = (
        db.query(Medicine)
        .filter(Medicine.expiry_date < today)
        .all()
    )

    return medicines

def get_inventory_summary(db: Session):

    today = date.today()

    future_date = today + timedelta(days=30)

    total_medicines = db.query(Medicine).count()

    total_stock_units = (
        db.query(func.sum(Medicine.stock)).scalar() or 0
    )

    inventory_value = (
        db.query(func.sum(Medicine.stock * Medicine.price)).scalar() or 0
    )

    low_stock_count = (
        db.query(Medicine)
        .filter(Medicine.stock <= 10)
        .count()
    )

    expiring_count = (
        db.query(Medicine)
        .filter(Medicine.expiry_date >= today)
        .filter(Medicine.expiry_date <= future_date)
        .count()
    )

    expired_count = (
        db.query(Medicine)
        .filter(Medicine.expiry_date < today)
        .count()
    )

    return {
        "total_medicines": total_medicines,
        "total_stock_units": total_stock_units,
        "inventory_value": float(inventory_value),
        "low_stock_count": low_stock_count,
        "expiring_count": expiring_count,
        "expired_count": expired_count,
    }