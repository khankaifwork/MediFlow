from sqlalchemy.orm import Session

from app.services.ai_business_service import get_business_context
from app.services.dashboard_service import get_dashboard
from app.services.inventory_service import get_low_stock
from app.services.report_service import (
    get_daily_sales_report,
    get_top_selling_medicines,
)


def get_context(intent: str, db: Session):

    if intent == "inventory":
        return {
            "low_stock": get_low_stock(db)
        }

    elif intent == "sales":
        return {
            "dashboard": get_dashboard(db),
            "daily_report": get_daily_sales_report(db),
            "top_selling": get_top_selling_medicines(db),
        }

    elif intent == "customer":
        return {
            "dashboard": get_dashboard(db)
        }

    else:
        return get_business_context(db)