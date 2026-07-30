from sqlalchemy import Column, Integer, String, Boolean, Date, Numeric
from app.database.database import Base

class Medicine(Base):
    __tablename__ = 'medicines'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    manufacturer = Column(String, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, nullable=False)
    expiry_date = Column(Date, nullable=False)
    prescription_required = Column(Boolean, default=False)