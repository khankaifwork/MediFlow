from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class MedicineCreate(BaseModel):
    name: str
    manufacturer: str
    price: Decimal
    stock: int
    expiry_date: date
    prescription_required: bool = False

class MedicineUpdate(BaseModel):
    name: str
    manufacturer: str
    price: Decimal
    stock: int
    expiry_date: date
    prescription_required: bool

class MedicineResponse(BaseModel):
    id: int
    name: str
    manufacturer: str
    price: Decimal
    stock: int
    expiry_date: date
    prescription_required: bool

    model_config = {
        "from_attributes": True
    }