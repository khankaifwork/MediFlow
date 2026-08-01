from sqlalchemy import Boolean, Column, Integer, String

from app.database.database import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)

    supplier_name = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    contact_person = Column(String, nullable=False)

    phone = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=True)

    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    country = Column(String, nullable=False)

    gst_number = Column(String, unique=True, nullable=False)

    is_active = Column(Boolean, default=True)