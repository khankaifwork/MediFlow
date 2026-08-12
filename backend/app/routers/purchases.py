from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.purchase import (
    PurchaseCreate,
    PurchaseResponse,
)
from app.services.purchase_service import (
    create_purchase,
    get_all_purchases,
)

router = APIRouter(
    prefix="/purchases",
    tags=["Purchases"]
)

@router.get("/", response_model=list[PurchaseResponse])
def read_purchases(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_purchases(db)


@router.post("/", response_model=PurchaseResponse)
def add_purchase(
    purchase: PurchaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_purchase(db, purchase)