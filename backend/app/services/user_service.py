from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password

from app.core.security import verify_password
from app.models.user import User


def create_user(db: Session, user: UserCreate):
    existing_user = (
        db.query(User)
        .filter(
            (User.username == user.username) |
            (User.email == user.email)
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already exists"
        )

    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        full_name=user.full_name,
        role=user.role,
        is_active=True,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()

    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()