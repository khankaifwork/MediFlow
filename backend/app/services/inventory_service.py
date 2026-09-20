from datetime import date
from sqlalchemy.orm import Session
from app.models.medicine import Medicine


def get_inventory(db: Session):
    medicines = db.query(Medicine).all()
    inventory = []
    today = date.today()

    for medicine in medicines:
        if medicine.expiry_date <= today:
            status = "Expired"
        elif medicine.stock == 0:
            status = "Out of Stock"
        elif medicine.stock <= 10:
            status = "Low Stock"
        else:
            status = "Healthy"

        inventory.append(
            {
                "id": medicine.id,
                "name": medicine.name,
                "manufacturer": medicine.manufacturer,
                "stock": medicine.stock,
                "price": float(medicine.price),
                "expiry_date": medicine.expiry_date,
                "prescription_required": medicine.prescription_required,
                "status": status,
            }
        )

    return inventory


def get_low_stock(db: Session, threshold: int = 10):
    """
    Returns medicines with stock quantity less than or equal to threshold.
    """
    medicines = (
        db.query(Medicine)
        .filter(Medicine.stock <= threshold)
        .order_by(Medicine.stock.asc())
        .all()
    )

    return [
        {
            "id": med.id,
            "name": med.name,
            "manufacturer": med.manufacturer,
            "stock": med.stock,
            "price": float(med.price),
            "expiry_date": str(med.expiry_date),
            "prescription_required": med.prescription_required,
        }
        for med in medicines
    ]