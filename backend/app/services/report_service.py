from datetime import date
from datetime import timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.medicine import Medicine
from app.models.purchase import Purchase
from app.models.sale import Sale
from app.models.sale_item import SaleItem
from app.models.supplier import Supplier


def get_daily_sales_report(db: Session):

    today = date.today()

    total_sales = (
        db.query(Sale)
        .filter(func.date(Sale.sale_date) == today)
        .count()
    )

    total_revenue = (
        db.query(func.sum(Sale.grand_total))
        .filter(func.date(Sale.sale_date) == today)
        .scalar()
        or 0
    )

    average_sale = 0

    if total_sales > 0:
        average_sale = float(total_revenue) / total_sales

    return {
        "date": today,
        "total_sales": total_sales,
        "total_revenue": float(total_revenue),
        "average_sale": round(average_sale, 2),
    }


def get_monthly_sales_report(db: Session):

    today = date.today()

    total_sales = (
        db.query(Sale)
        .filter(func.extract("month", Sale.sale_date) == today.month)
        .filter(func.extract("year", Sale.sale_date) == today.year)
        .count()
    )

    total_revenue = (
        db.query(func.sum(Sale.grand_total))
        .filter(func.extract("month", Sale.sale_date) == today.month)
        .filter(func.extract("year", Sale.sale_date) == today.year)
        .scalar()
        or 0
    )

    average_sale = 0

    if total_sales > 0:
        average_sale = float(total_revenue) / total_sales

    return {
        "month": today.month,
        "year": today.year,
        "total_sales": total_sales,
        "total_revenue": float(total_revenue),
        "average_sale": round(average_sale, 2),
    }


def get_top_selling_medicines(db: Session):

    results = (
        db.query(
            Medicine.name.label("medicine_name"),
            func.sum(SaleItem.quantity).label("quantity_sold"),
        )
        .join(
            SaleItem,
            Medicine.id == SaleItem.medicine_id,
        )
        .group_by(Medicine.name)
        .order_by(
            func.sum(SaleItem.quantity).desc()
        )
        .limit(10)
        .all()
    )

    return [
        {
            "medicine_name": row.medicine_name,
            "quantity_sold": int(row.quantity_sold),
        }
        for row in results
    ]


def get_top_customers(db: Session):

    results = (
        db.query(
            Customer.name.label("customer_name"),
            func.count(Sale.id).label("total_orders"),
            func.sum(Sale.grand_total).label("total_spent"),
        )
        .join(
            Sale,
            Customer.id == Sale.customer_id,
        )
        .group_by(Customer.name)
        .order_by(
            func.sum(Sale.grand_total).desc()
        )
        .limit(10)
        .all()
    )

    return [
        {
            "customer_name": row.customer_name,
            "total_orders": int(row.total_orders),
            "total_spent": float(row.total_spent),
        }
        for row in results
    ]


def get_revenue_trend(db: Session):

    today = date.today()

    start_date = today - timedelta(days=6)

    results = (
        db.query(
            func.date(Sale.sale_date).label("date"),
            func.sum(Sale.grand_total).label("revenue"),
        )
        .filter(Sale.sale_date >= start_date)
        .group_by(func.date(Sale.sale_date))
        .order_by(func.date(Sale.sale_date))
        .all()
    )

    return [
        {
            "date": row.date,
            "revenue": float(row.revenue),
        }
        for row in results
    ]


def get_dashboard_report(db: Session):

    total_medicines = db.query(Medicine).count()

    total_customers = db.query(Customer).count()

    total_suppliers = db.query(Supplier).count()

    total_sales = (
        db.query(func.sum(Sale.grand_total))
        .scalar()
        or 0
    )

    total_purchases = (
        db.query(func.sum(Purchase.purchase_price))
        .scalar()
        or 0
    )

    low_stock = (
        db.query(Medicine)
        .filter(Medicine.stock <= 10)
        .count()
    )

    return {
        "total_medicines": total_medicines,
        "total_customers": total_customers,
        "total_suppliers": total_suppliers,
        "total_sales": float(total_sales),
        "total_purchases": float(total_purchases),
        "low_stock": low_stock,
    }