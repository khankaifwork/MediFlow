from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.inventory import (LowStockMedicine, ExpiringMedicine , InventorySummary,)

from app.services.inventory_service import (
    get_low_stock,
    get_expiring_medicines,
    get_expired_medicines,
    get_inventory_summary,
)

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


@router.get(
    "/low-stock",
    response_model=list[LowStockMedicine]
)
def low_stock(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_low_stock(db)

@router.get(
    "/expiring",
    response_model=list[ExpiringMedicine]
)
def expiring_medicines(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_expiring_medicines(db, days)

@router.get(
    "/expired",
    response_model=list[ExpiringMedicine]
)
def expired_medicines(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_expired_medicines(db)

@router.get(
    "/summary",
    response_model=InventorySummary
)
def inventory_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_inventory_summary(db)