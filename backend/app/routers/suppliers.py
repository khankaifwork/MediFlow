from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.database import get_db

from app.schemas.supplier import (
    SupplierCreate,
    SupplierUpdate,
    SupplierResponse,
)

from app.services.supplier_service import (
    create_supplier,
    get_all_suppliers,
    get_supplier,
    update_supplier,
    delete_supplier,
)

router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"],
)


@router.get("/", response_model=list[SupplierResponse])
def read_suppliers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_all_suppliers(db)


@router.get("/{supplier_id}", response_model=SupplierResponse)
def read_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_supplier(db, supplier_id)


@router.post("/", response_model=SupplierResponse)
def add_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_supplier(db, supplier)


@router.put("/{supplier_id}", response_model=SupplierResponse)
def edit_supplier(
    supplier_id: int,
    supplier: SupplierUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return update_supplier(
        db,
        supplier_id,
        supplier,
    )


@router.delete("/{supplier_id}")
def remove_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return delete_supplier(db, supplier_id)