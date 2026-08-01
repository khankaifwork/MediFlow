from sqlalchemy import Column, Integer, String

from app.database.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=True)
    address = Column(String, nullable=True)
    loyalty_points = Column(Integer, default=0)