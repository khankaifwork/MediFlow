from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.database import get_db
from app.models.user import User

from app.schemas.inventory import InventoryResponse
from app.services.inventory_service import get_inventory

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


@router.get(
    "/",
    response_model=list[InventoryResponse]
)
def read_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_inventory(db)