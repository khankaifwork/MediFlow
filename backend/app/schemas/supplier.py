from pydantic import BaseModel, EmailStr


class SupplierCreate(BaseModel):
    supplier_name: str
    company_name: str
    contact_person: str | None = None
    phone: str
    email: EmailStr | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    country: str | None = None
    gst_number: str | None = None


class SupplierUpdate(BaseModel):
    supplier_name: str
    company_name: str
    contact_person: str | None = None
    phone: str
    email: EmailStr | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    country: str | None = None
    gst_number: str | None = None


class SupplierResponse(BaseModel):
    id: int
    supplier_name: str
    company_name: str
    contact_person: str | None = None
    phone: str
    email: EmailStr | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    country: str | None = None
    gst_number: str | None = None

    model_config = {
        "from_attributes": True
    }