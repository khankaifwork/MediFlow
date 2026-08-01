from sqlalchemy import Column, Date, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from app.database.database import Base


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)

    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    medicine_id = Column(Integer, ForeignKey("medicines.id"))

    quantity = Column(Integer, nullable=False)

    purchase_price = Column(Numeric(10, 2), nullable=False)
    selling_price = Column(Numeric(10, 2), nullable=False)

    batch_number = Column(String, nullable=False)

    manufacture_date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=False)

    supplier = relationship("Supplier")
    medicine = relationship("Medicine")