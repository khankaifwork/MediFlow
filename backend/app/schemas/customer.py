from pydantic import BaseModel, EmailStr


class CustomerCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr | None = None
    address: str | None = None


class CustomerUpdate(BaseModel):
    name: str
    phone: str
    email: EmailStr | None = None
    address: str | None = None


class CustomerResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: EmailStr | None = None
    address: str | None = None

    model_config = {
        "from_attributes": True
    }