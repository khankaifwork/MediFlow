from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.medicine import Medicine
from app.models.sale import Sale


LOW_STOCK_LIMIT = 10


def get_dashboard(db: Session):
    total_medicines = db.query(func.count(Medicine.id)).scalar() or 0

    total_customers = db.query(func.count(Customer.id)).scalar() or 0

    low_stock = (
        db.query(func.count(Medicine.id))
        .filter(Medicine.stock <= LOW_STOCK_LIMIT)
        .scalar()
        or 0
    )

    today_sales = (
        db.query(func.coalesce(func.sum(Sale.grand_total), 0))
        .filter(func.date(Sale.sale_date) == date.today())
        .scalar()
        or 0
    )

    monthly_sales = (
        db.query(func.coalesce(func.sum(Sale.grand_total), 0))
        .filter(func.extract("month", Sale.sale_date) == date.today().month)
        .filter(func.extract("year", Sale.sale_date) == date.today().year)
        .scalar()
        or 0
    )

    return {
        "total_medicines": total_medicines,
        "total_customers": total_customers,
        "low_stock": low_stock,
        "today_sales": float(today_sales),
        "monthly_sales": float(monthly_sales),
    }