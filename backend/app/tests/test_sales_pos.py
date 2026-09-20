def test_sales_checkout_and_stock_deduction(client, admin_headers):
    # 1. Create Customer
    cust_res = client.post(
        "/customers/",
        json={
            "name": "Jane Doe",
            "phone": "+91 99999 11111",
            "email": "jane@example.com",
            "address": "42 High Street",
        },
        headers=admin_headers,
    )
    assert cust_res.status_code == 201
    cust_id = cust_res.json()["id"]

    # 2. Create Medicine with stock = 20
    med_res = client.post(
        "/medicines/",
        json={
            "name": "Amoxicillin 250mg",
            "manufacturer": "Cipla",
            "price": 50.0,
            "stock": 20,
            "expiry_date": "2027-05-15",
            "prescription_required": True,
        },
        headers=admin_headers,
    )
    assert med_res.status_code == 201
    med_id = med_res.json()["id"]

    # 3. Create POS Sale of 5 units
    sale_payload = {
        "customer_id": cust_id,
        "payment_method": "UPI",
        "discount": 5.0,
        "items": [{"medicine_id": med_id, "quantity": 5}],
    }
    sale_res = client.post("/sales/", json=sale_payload, headers=admin_headers)
    assert sale_res.status_code == 200
    sale_data = sale_res.json()
    assert sale_data["invoice_number"].startswith("INV-")
    assert sale_data["subtotal"] == 250.0  # 5 * 50

    # 4. Verify Stock was reduced to 15
    updated_med = client.get(f"/medicines/{med_id}", headers=admin_headers).json()
    assert updated_med["stock"] == 15


def test_insufficient_stock_rejection(client, admin_headers):
    # Create Customer
    cust_res = client.post(
        "/customers/",
        json={
            "name": "Bob Smith",
            "phone": "+91 88888 22222",
            "email": "bob@example.com",
            "address": "10 Park Lane",
        },
        headers=admin_headers,
    )
    cust_id = cust_res.json()["id"]

    # Create Medicine with only 3 units in stock
    med_res = client.post(
        "/medicines/",
        json={
            "name": "Rare Syringe",
            "manufacturer": "BD Medical",
            "price": 100.0,
            "stock": 3,
            "expiry_date": "2028-01-01",
            "prescription_required": False,
        },
        headers=admin_headers,
    )
    med_id = med_res.json()["id"]

    # Attempt to purchase 10 units -> Expect 400 Bad Request
    fail_sale = client.post(
        "/sales/",
        json={
            "customer_id": cust_id,
            "payment_method": "Cash",
            "discount": 0,
            "items": [{"medicine_id": med_id, "quantity": 10}],
        },
        headers=admin_headers,
    )
    assert fail_sale.status_code == 400
    assert "Insufficient stock" in fail_sale.json()["detail"]
