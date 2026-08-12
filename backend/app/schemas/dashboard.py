from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_medicines: int
    total_customers: int
    low_stock: int
    today_sales: float
    monthly_sales: float