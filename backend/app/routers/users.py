from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import create_user

from fastapi import HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from app.core.auth import create_access_token
from app.services.user_service import authenticate_user
from app.schemas.user import Token

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", response_model=UserResponse, status_code=201)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    return create_user(db, user)

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(
        db,
        form_data.username,
        form_data.password
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        data={"sub": user.username}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }