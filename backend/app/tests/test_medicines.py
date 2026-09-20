def test_create_and_read_medicine(client, admin_headers):
    payload = {
        "name": "Ibuprofen 400mg",
        "manufacturer": "Abbott",
        "price": 45.0,
        "stock": 100,
        "expiry_date": "2027-12-31",
        "prescription_required": False,
    }
    # Create
    create_res = client.post("/medicines/", json=payload, headers=admin_headers)
    assert create_res.status_code == 201
    created_id = create_res.json()["id"]

    # Read by ID
    get_res = client.get(f"/medicines/{created_id}", headers=admin_headers)
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "Ibuprofen 400mg"


def test_search_medicine(client, admin_headers):
    client.post(
        "/medicines/",
        json={
            "name": "Cetirizine 10mg",
            "manufacturer": "Dr. Reddy",
            "price": 25.0,
            "stock": 50,
            "expiry_date": "2027-06-30",
            "prescription_required": False,
        },
        headers=admin_headers,
    )

    search_res = client.get("/medicines/search?name=Cetirizine", headers=admin_headers)
    assert search_res.status_code == 200
    results = search_res.json()
    assert len(results) >= 1
    assert "Cetirizine" in results[0]["name"]


def test_medicine_rbac_delete(client, admin_headers, pharmacist_headers):
    create_res = client.post(
        "/medicines/",
        json={
            "name": "Temporary Med",
            "manufacturer": "Generic Lab",
            "price": 10.0,
            "stock": 20,
            "expiry_date": "2026-11-30",
            "prescription_required": False,
        },
        headers=admin_headers,
    )
    med_id = create_res.json()["id"]

    # Pharmacist attempt to delete should fail with 403 Forbidden
    forbidden_res = client.delete(f"/medicines/{med_id}", headers=pharmacist_headers)
    assert forbidden_res.status_code == 403

    # Admin delete should succeed
    success_res = client.delete(f"/medicines/{med_id}", headers=admin_headers)
    assert success_res.status_code == 200
