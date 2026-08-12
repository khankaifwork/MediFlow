from sqlalchemy.orm import Session

from app.services.dashboard_service import get_dashboard
from app.services.inventory_service import get_low_stock
from app.services.report_service import (
    get_daily_sales_report,
    get_top_selling_medicines,
)


class ToolRegistry:

    def __init__(self, db: Session):
        self.db = db

    def dashboard(self):
        return get_dashboard(self.db)

    def low_stock(self):
        return get_low_stock(self.db)

    def daily_sales(self):
        return get_daily_sales_report(self.db)

    def top_medicines(self):
        return get_top_selling_medicines(self.db)

    def available_tools(self):
        return {
            "dashboard": self.dashboard,
            "low_stock": self.low_stock,
            "daily_sales": self.daily_sales,
            "top_medicines": self.top_medicines,
        }