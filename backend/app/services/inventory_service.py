from datetime import date

from sqlalchemy.orm import Session

from app.models.medicine import Medicine


def get_inventory(db: Session):

    medicines = db.query(Medicine).all()

    inventory = []

    today = date.today()

    for medicine in medicines:

        if medicine.stock == 0:
            status = "Out of Stock"

        elif medicine.stock <= 10:
            status = "Low Stock"

        elif medicine.expiry_date <= today:
            status = "Expired"

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