from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.medicine import Medicine
from app.models.purchase import Purchase
from app.models.sale import Sale
from app.models.supplier import Supplier


def get_dashboard(db: Session):

    today = date.today()

    total_medicines = db.query(Medicine).count()

    total_customers = db.query(Customer).count()

    total_suppliers = db.query(Supplier).count()

    total_sales = db.query(Sale).count()

    total_purchases = db.query(Purchase).count()

    today_sales = (
        db.query(Sale)
        .filter(func.date(Sale.sale_date) == today)
        .count()
    )

    today_revenue = (
        db.query(func.sum(Sale.grand_total))
        .filter(func.date(Sale.sale_date) == today)
        .scalar()
        or 0
    )

    monthly_revenue = (
        db.query(func.sum(Sale.grand_total))
        .filter(func.extract("month", Sale.sale_date) == today.month)
        .filter(func.extract("year", Sale.sale_date) == today.year)
        .scalar()
        or 0
    )

    low_stock_medicines = (
        db.query(Medicine)
        .filter(Medicine.stock <= 10)
        .count()
    )

    return {
        "total_medicines": total_medicines,
        "total_customers": total_customers,
        "total_suppliers": total_suppliers,
        "total_sales": total_sales,
        "total_purchases": total_purchases,
        "today_sales": today_sales,
        "today_revenue": float(today_revenue),
        "monthly_revenue": float(monthly_revenue),
        "low_stock_medicines": low_stock_medicines,
    }