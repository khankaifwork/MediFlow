from datetime import date

from pydantic import BaseModel, ConfigDict


class PurchaseCreate(BaseModel):
    supplier_id: int
    medicine_id: int
    quantity: int
    purchase_price: float
    selling_price: float
    batch_number: str
    manufacture_date: date
    expiry_date: date


class PurchaseResponse(BaseModel):
    id: int
    supplier_id: int
    medicine_id: int
    quantity: int
    purchase_price: float
    selling_price: float
    batch_number: str
    manufacture_date: date
    expiry_date: date

    model_config = ConfigDict(from_attributes=True)