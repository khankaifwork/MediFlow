from sqlalchemy import Column, Integer, String

from app.database.database import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)

    supplier_name = Column(String, nullable=False)

    company_name = Column(String, nullable=False)

    contact_person = Column(String, nullable=True)

    phone = Column(String, unique=True, nullable=False)

    email = Column(String, nullable=True)

    address = Column(String, nullable=True)

    city = Column(String, nullable=True)

    state = Column(String, nullable=True)

    country = Column(String, nullable=True)

    gst_number = Column(String, nullable=True)