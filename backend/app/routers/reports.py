from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.database import get_db
from app.models.user import User

from app.schemas.report import DashboardReport
from app.services.report_service import (
    get_dashboard_report,
    get_daily_sales_report,
    get_monthly_sales_report,
    get_top_selling_medicines,
    get_top_customers,
    get_revenue_trend,
)

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get(
    "/dashboard",
    response_model=DashboardReport,
)
def dashboard_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_dashboard_report(db)


@router.get("/daily-sales")
def daily_sales(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_daily_sales_report(db)


@router.get("/monthly-sales")
def monthly_sales(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_monthly_sales_report(db)


@router.get("/top-medicines")
def top_medicines(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_top_selling_medicines(db)


@router.get("/top-customers")
def top_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_top_customers(db)


@router.get("/revenue-trend")
def revenue_trend(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_revenue_trend(db)