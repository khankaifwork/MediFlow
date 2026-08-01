from pydantic import BaseModel, EmailStr, ConfigDict


class CustomerCreate(BaseModel):
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
    loyalty_points: int

    model_config = ConfigDict(from_attributes=True)