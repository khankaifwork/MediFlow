from datetime import date
from pydantic import BaseModel


class DailySalesReport(BaseModel):
    date: date
    total_sales: int
    total_revenue: float
    average_sale: float


class MonthlySalesReport(BaseModel):
    month: int
    year: int
    total_sales: int
    total_revenue: float
    average_sale: float


class TopSellingMedicine(BaseModel):
    medicine_name: str
    quantity_sold: int

class TopCustomer(BaseModel):
    customer_name: str
    total_orders: int
    total_spent: float

class RevenueTrend(BaseModel):
    date: date
    revenue: float
class DashboardReport(BaseModel):
    total_medicines: int
    total_customers: int
    total_suppliers: int
    total_sales: float
    total_purchases: float
    low_stock: int