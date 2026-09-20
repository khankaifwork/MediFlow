import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base, get_db
from app.main import app
from app.core.security import hash_password
from app.core.auth import create_access_token
from app.models.user import User

# Use in-memory SQLite database for unit and API tests
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()

    # Pre-seed test admin and pharmacist
    admin = User(
        username="testadmin",
        email="testadmin@example.com",
        hashed_password=hash_password("adminpass123"),
        full_name="Test Administrator",
        role="admin",
        is_active=True,
    )
    pharmacist = User(
        username="testpharma",
        email="testpharma@example.com",
        hashed_password=hash_password("pharmapass123"),
        full_name="Test Pharmacist",
        role="pharmacist",
        is_active=True,
    )
    session.add(admin)
    session.add(pharmacist)
    session.commit()

    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def admin_headers():
    token = create_access_token(data={"sub": "testadmin"})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def pharmacist_headers():
    token = create_access_token(data={"sub": "testpharma"})
    return {"Authorization": f"Bearer {token}"}
