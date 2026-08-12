from sqlalchemy.orm import Session

from app.services.dashboard_service import get_dashboard
from app.services.inventory_service import get_low_stock
from app.services.report_service import (
    get_daily_sales_report,
    get_top_selling_medicines,
)


TOOLS = {
    "dashboard": get_dashboard,
    "low_stock": get_low_stock,
    "daily_sales": get_daily_sales_report,
    "top_medicines": get_top_selling_medicines,
}


def execute_tool(tool_name: str, db: Session):

    if tool_name not in TOOLS:
        return None

    return TOOLS[tool_name](db)