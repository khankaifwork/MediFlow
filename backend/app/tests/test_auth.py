def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_login_success(client):
    response = client.post(
        "/users/login",
        data={"username": "testadmin", "password": "adminpass123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(client):
    response = client.post(
        "/users/login",
        data={"username": "testadmin", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_get_me_authenticated(client, admin_headers):
    response = client.get("/users/me", headers=admin_headers)
    assert response.status_code == 200
    user_data = response.json()
    assert user_data["username"] == "testadmin"
    assert user_data["role"] == "admin"


def test_get_me_unauthenticated(client):
    response = client.get("/users/me")
    assert response.status_code == 401


def test_register_user(client):
    new_user_payload = {
        "username": "newdoctor",
        "email": "doctor@mediflow.com",
        "password": "securepassword123",
        "full_name": "Dr. Alice Smith",
        "role": "pharmacist",
    }
    response = client.post("/users/", json=new_user_payload)
    assert response.status_code == 201
    created = response.json()
    assert created["username"] == "newdoctor"
    assert created["email"] == "doctor@mediflow.com"
