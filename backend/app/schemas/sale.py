from datetime import datetime
from pydantic import BaseModel, ConfigDict


class SaleItemCreate(BaseModel):
    medicine_id: int
    quantity: int


class SaleCreate(BaseModel):
    customer_id: int
    payment_method: str
    discount: float = 0
    items: list[SaleItemCreate]


class SaleItemResponse(BaseModel):
    medicine_id: int
    quantity: int
    unit_price: float
    total_price: float

    model_config = ConfigDict(from_attributes=True)


class SaleResponse(BaseModel):
    id: int
    invoice_number: str
    customer_id: int
    subtotal: float
    discount: float
    tax: float
    grand_total: float
    payment_method: str
    sale_date: datetime

    items: list[SaleItemResponse]

    model_config = ConfigDict(from_attributes=True)