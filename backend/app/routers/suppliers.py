from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.supplier import SupplierCreate, SupplierResponse
from app.services.supplier_service import (
    create_supplier,
    get_all_suppliers,
)

router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"]
)


@router.post("/", response_model=SupplierResponse)
def add_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_supplier(db, supplier)


@router.get("/", response_model=list[SupplierResponse])
def read_suppliers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_suppliers(db)