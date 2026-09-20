from datetime import date

from pydantic import BaseModel, ConfigDict


class MedicineCreate(BaseModel):
    name: str
    manufacturer: str
    price: float
    stock: int
    expiry_date: date
    prescription_required: bool = False

class MedicineUpdate(BaseModel):
    name: str
    manufacturer: str
    price: float
    stock: int
    expiry_date: date
    prescription_required: bool

class MedicineResponse(BaseModel):
    id: int
    name: str
    manufacturer: str
    price: float
    stock: int
    expiry_date: date
    prescription_required: bool

    model_config = ConfigDict(from_attributes=True)