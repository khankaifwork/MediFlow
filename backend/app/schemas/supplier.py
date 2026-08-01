from pydantic import BaseModel, EmailStr, ConfigDict


class SupplierCreate(BaseModel):
    supplier_name: str
    company_name: str
    contact_person: str
    phone: str
    email: EmailStr | None = None
    address: str
    city: str
    state: str
    country: str
    gst_number: str


class SupplierResponse(BaseModel):
    id: int
    supplier_name: str
    company_name: str
    contact_person: str
    phone: str
    email: EmailStr | None = None
    address: str
    city: str
    state: str
    country: str
    gst_number: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)