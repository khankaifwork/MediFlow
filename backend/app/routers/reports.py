from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.report import ( DailySalesReport, MonthlySalesReport, TopSellingMedicine , TopCustomer ,  RevenueTrend)
from app.services.report_service import ( get_daily_sales_report , get_top_selling_medicines , get_monthly_sales_report , get_top_customers , get_revenue_trend,)

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get(
    "/daily",
    response_model=DailySalesReport
)
def daily_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_daily_sales_report(db)

@router.get(
    "/top-selling",
    response_model=list[TopSellingMedicine]
)
def top_selling_medicines(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_top_selling_medicines(db)

@router.get(
    "/monthly",
    response_model=MonthlySalesReport
)
def monthly_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_monthly_sales_report(db)

@router.get(
    "/top-customers",
    response_model=list[TopCustomer]
)
def top_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_top_customers(db)

@router.get(
    "/revenue-trend",
    response_model=list[RevenueTrend]
)
def revenue_trend(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_revenue_trend(db)