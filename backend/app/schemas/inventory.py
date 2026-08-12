from datetime import date

from pydantic import BaseModel, ConfigDict


class InventoryResponse(BaseModel):
    id: int
    name: str
    manufacturer: str

    stock: int

    price: float

    expiry_date: date

    prescription_required: bool

    status: str

    model_config = ConfigDict(
        from_attributes=True
    )