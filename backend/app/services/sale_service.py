import uuid

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.medicine import Medicine
from app.models.sale import Sale
from app.models.sale_item import SaleItem
from app.schemas.sale import SaleCreate


def create_sale(db: Session, sale: SaleCreate):

    # -------------------------
    # Check Customer
    # -------------------------
    customer = (
        db.query(Customer)
        .filter(Customer.id == sale.customer_id)
        .first()
    )

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # -------------------------
    # Validate Medicines
    # -------------------------
    subtotal = 0
    sale_items = []

    for item in sale.items:

        medicine = (
            db.query(Medicine)
            .filter(Medicine.id == item.medicine_id)
            .first()
        )

        if medicine is None:
            raise HTTPException(
                status_code=404,
                detail=f"Medicine ID {item.medicine_id} not found"
            )

        if medicine.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {medicine.name}"
            )

        total_price = float(medicine.price) * item.quantity

        subtotal += total_price

        sale_items.append({
            "medicine": medicine,
            "quantity": item.quantity,
            "unit_price": float(medicine.price),
            "total_price": total_price,
        })

    # -------------------------
    # Calculate Bill
    # -------------------------
    discount = sale.discount

    tax = subtotal * 0.18

    grand_total = subtotal + tax - discount

    invoice_number = (
        "INV-" +
        str(uuid.uuid4())[:8].upper()
    )

    # -------------------------
    # Create Invoice
    # -------------------------
    db_sale = Sale(
        customer_id=sale.customer_id,
        invoice_number=invoice_number,
        subtotal=subtotal,
        discount=discount,
        tax=tax,
        grand_total=grand_total,
        payment_method=sale.payment_method,
    )

    db.add(db_sale)
    db.flush()

    # -------------------------
    # Create Sale Items
    # -------------------------
    for item in sale_items:

        db_sale_item = SaleItem(
            sale_id=db_sale.id,
            medicine_id=item["medicine"].id,
            quantity=item["quantity"],
            unit_price=item["unit_price"],
            total_price=item["total_price"],
        )

        db.add(db_sale_item)

        # Reduce Stock
        item["medicine"].stock -= item["quantity"]

    # -------------------------
    # Save Everything
    # -------------------------
    db.commit()

    db.refresh(db_sale)

    return db_sale

def get_all_sales(db: Session):
    return db.query(Sale).all()