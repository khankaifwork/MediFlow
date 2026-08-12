from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.sale import SaleCreate, SaleResponse
from app.services.sale_service import (
    create_sale,
    get_all_sales,
)
router = APIRouter(
    prefix="/sales",
    tags=["Sales"]
)

@router.get("/", response_model=list[SaleResponse])
def read_sales(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_sales(db)


@router.post("/", response_model=SaleResponse)
def add_sale(
    sale: SaleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_sale(db, sale)