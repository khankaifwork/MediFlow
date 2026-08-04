from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_medicines: int
    total_customers: int
    total_suppliers: int
    total_sales: int
    total_purchases: int

    today_sales: int
    today_revenue: float

    monthly_revenue: float

    low_stock_medicines: int