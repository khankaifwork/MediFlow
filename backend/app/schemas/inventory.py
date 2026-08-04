from datetime import date

from pydantic import BaseModel


class LowStockMedicine(BaseModel):
    id: int
    name: str
    stock: int

    model_config = {
        "from_attributes": True
    }


class ExpiringMedicine(BaseModel):
    id: int
    name: str
    stock: int
    expiry_date: date

    model_config = {
        "from_attributes": True
    }

class InventorySummary(BaseModel):
    total_medicines: int
    total_stock_units: int
    inventory_value: float
    low_stock_count: int
    expiring_count: int
    expired_count: int