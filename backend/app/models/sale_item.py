from sqlalchemy import Column, ForeignKey, Integer, Numeric
from sqlalchemy.orm import relationship

from app.database.database import Base


class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(Integer, primary_key=True, index=True)

    sale_id = Column(Integer, ForeignKey("sales.id"))

    medicine_id = Column(Integer, ForeignKey("medicines.id"))

    quantity = Column(Integer, nullable=False)

    unit_price = Column(Numeric(10, 2), nullable=False)

    total_price = Column(Numeric(10, 2), nullable=False)

    sale = relationship(
        "Sale",
        back_populates="items"
    )

    medicine = relationship("Medicine")