from sqlalchemy.orm import Session

from app.services.dashboard_service import get_dashboard
from app.services.inventory_service import get_low_stock
from app.services.report_service import (
    get_daily_sales_report,
    get_top_selling_medicines,
)


def get_business_context(db: Session):

    dashboard = get_dashboard(db)

    daily_report = get_daily_sales_report(db)

    low_stock = get_low_stock(db)

    top_medicines = get_top_selling_medicines(db)

    return {
        "dashboard": dashboard,
        "daily_report": daily_report,
        "low_stock": low_stock,
        "top_medicines": top_medicines,
    }