from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from app.database.database import Base


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    invoice_number = Column(String, unique=True, nullable=False)

    subtotal = Column(Numeric(10, 2), nullable=False)

    discount = Column(Numeric(10, 2), default=0)

    tax = Column(Numeric(10, 2), default=0)

    grand_total = Column(Numeric(10, 2), nullable=False)

    payment_method = Column(String, nullable=False)

    sale_date = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer")

    items = relationship(
        "SaleItem",
        back_populates="sale",
        cascade="all, delete-orphan"
    )