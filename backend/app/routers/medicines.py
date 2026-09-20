from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user, require_admin
from app.database.database import get_db
from app.models.user import User
from app.schemas.medicine import MedicineCreate, MedicineResponse, MedicineUpdate
from app.services.medicine_service import (
    create_medicine,
    get_all_medicines,
    get_medicine_by_id,
    update_medicine,
    delete_medicine,
    search_medicines,
)

router = APIRouter(
    prefix="/medicines",
    tags=["Medicines"],
)


@router.post("/", response_model=MedicineResponse, status_code=status.HTTP_201_CREATED)
def add_medicine(
    medicine: MedicineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_medicine(db, medicine)


@router.get("/", response_model=list[MedicineResponse])
def read_medicines(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_medicines(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get("/search", response_model=list[MedicineResponse])
def search_medicine(
    name: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return search_medicines(db, name)


@router.get("/{medicine_id}", response_model=MedicineResponse)
def read_medicine(
    medicine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    medicine = get_medicine_by_id(db, medicine_id)

    if medicine is None:
        raise HTTPException(status_code=404, detail="Medicine not found")

    return medicine


@router.put("/{medicine_id}", response_model=MedicineResponse)
def edit_medicine(
    medicine_id: int,
    medicine: MedicineUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated_medicine = update_medicine(db, medicine_id, medicine)

    if updated_medicine is None:
        raise HTTPException(status_code=404, detail="Medicine not found")

    return updated_medicine


@router.delete("/{medicine_id}", status_code=status.HTTP_200_OK)
def remove_medicine(
    medicine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    medicine = delete_medicine(db, medicine_id)

    if medicine is None:
        raise HTTPException(status_code=404, detail="Medicine not found")

    return {"message": "Medicine deleted successfully"}