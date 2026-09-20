import os
import sys
from datetime import date, datetime, timedelta

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.core.security import hash_password
from app.database.database import Base, SessionLocal, engine
from app.models.customer import Customer
from app.models.medicine import Medicine
from app.models.purchase import Purchase
from app.models.sale import Sale
from app.models.sale_item import SaleItem
from app.models.supplier import Supplier
from app.models.user import User


if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def seed_all():
    print("[INIT] Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Users
        print("[USERS] Checking users...")
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                username="admin",
                email="admin@mediflow.com",
                hashed_password=hash_password("admin123"),
                full_name="Dr. Kaif Khan",
                role="admin",
                is_active=True,
            )
            db.add(admin)
            print("  + Created Admin user: admin / admin123")

        pharma = db.query(User).filter(User.username == "pharmacist").first()
        if not pharma:
            pharma = User(
                username="pharmacist",
                email="pharmacist@mediflow.com",
                hashed_password=hash_password("pharma123"),
                full_name="Sarah Jenkins (RPh)",
                role="pharmacist",
                is_active=True,
            )
            db.add(pharma)
            print("  + Created Pharmacist user: pharmacist / pharma123")

        db.commit()

        # 2. Seed Suppliers
        print("[SUPPLIERS] Checking suppliers...")
        suppliers_data = [
            {
                "supplier_name": "Apex Pharma Distributors",
                "company_name": "Apex Healthcare Ltd",
                "contact_person": "Vikram Malhotra",
                "phone": "+91 98200 11223",
                "email": "orders@apexpharma.in",
                "address": "Plot 42, MIDC Industrial Area, Andheri East",
                "city": "Mumbai",
                "state": "Maharashtra",
                "country": "India",
                "gst_number": "27AABCA1234M1Z5",
            },
            {
                "supplier_name": "Global Health Care Supplies",
                "company_name": "Global Meditech Pvt Ltd",
                "contact_person": "Ritu Singhania",
                "phone": "+91 98100 44556",
                "email": "supply@globalmeditech.com",
                "address": "B-12 Okhla Phase 1",
                "city": "New Delhi",
                "state": "Delhi",
                "country": "India",
                "gst_number": "07AABCG5678D1Z2",
            },
            {
                "supplier_name": "SunMed Biologics",
                "company_name": "SunMed Pharma Inc",
                "contact_person": "Anand Rao",
                "phone": "+91 98490 77889",
                "email": "contact@sunmedbio.com",
                "address": "Genome Valley, Shamirpet",
                "city": "Hyderabad",
                "state": "Telangana",
                "country": "India",
                "gst_number": "36AABCS9012H1Z9",
            },
        ]

        supplier_map = {}
        for s_data in suppliers_data:
            existing = db.query(Supplier).filter(Supplier.phone == s_data["phone"]).first()
            if not existing:
                existing = Supplier(**s_data)
                db.add(existing)
                db.commit()
                db.refresh(existing)
                print(f"  + Added Supplier: {existing.supplier_name}")
            supplier_map[s_data["supplier_name"]] = existing

        # 3. Seed Medicines
        print("[MEDICINES] Checking medicines...")
        medicines_data = [
            {
                "name": "Paracetamol 650mg",
                "manufacturer": "GSK Pharma",
                "price": 32.50,
                "stock": 140,
                "expiry_date": date.today() + timedelta(days=450),
                "prescription_required": False,
            },
            {
                "name": "Amoxicillin 500mg",
                "manufacturer": "Novartis",
                "price": 145.00,
                "stock": 85,
                "expiry_date": date.today() + timedelta(days=320),
                "prescription_required": True,
            },
            {
                "name": "Azithromycin 500mg",
                "manufacturer": "Cipla Ltd",
                "price": 125.00,
                "stock": 65,
                "expiry_date": date.today() + timedelta(days=280),
                "prescription_required": True,
            },
            {
                "name": "Metformin 500mg",
                "manufacturer": "USV Pvt Ltd",
                "price": 48.00,
                "stock": 210,
                "expiry_date": date.today() + timedelta(days=500),
                "prescription_required": True,
            },
            {
                "name": "Atorvastatin 10mg",
                "manufacturer": "Zydus Lifesciences",
                "price": 95.00,
                "stock": 8,  # Low Stock
                "expiry_date": date.today() + timedelta(days=190),
                "prescription_required": True,
            },
            {
                "name": "Cetirizine 10mg",
                "manufacturer": "Dr. Reddy's Lab",
                "price": 28.00,
                "stock": 180,
                "expiry_date": date.today() + timedelta(days=600),
                "prescription_required": False,
            },
            {
                "name": "Pantoprazole 40mg",
                "manufacturer": "Alkem Laboratories",
                "price": 88.00,
                "stock": 120,
                "expiry_date": date.today() + timedelta(days=365),
                "prescription_required": False,
            },
            {
                "name": "Insulin Glargine 100IU",
                "manufacturer": "Sanofi India",
                "price": 680.00,
                "stock": 5,  # Critical Low Stock
                "expiry_date": date.today() + timedelta(days=150),
                "prescription_required": True,
            },
            {
                "name": "Ibuprofen 400mg",
                "manufacturer": "Abbott India",
                "price": 38.00,
                "stock": 115,
                "expiry_date": date.today() + timedelta(days=400),
                "prescription_required": False,
            },
            {
                "name": "Montelukast 10mg",
                "manufacturer": "Sun Pharma",
                "price": 165.00,
                "stock": 70,
                "expiry_date": date.today() + timedelta(days=550),
                "prescription_required": True,
            },
        ]

        medicine_map = {}
        for m_data in medicines_data:
            existing = db.query(Medicine).filter(Medicine.name == m_data["name"]).first()
            if not existing:
                existing = Medicine(**m_data)
                db.add(existing)
                db.commit()
                db.refresh(existing)
                print(f"  + Added Medicine: {existing.name} (Stock: {existing.stock})")
            medicine_map[m_data["name"]] = existing

        # 4. Seed Customers
        print("[CUSTOMERS] Checking customers...")
        customers_data = [
            {
                "name": "Rahul Sharma",
                "phone": "+91 98765 43210",
                "email": "rahul.sharma@gmail.com",
                "address": "Flat 402, Green Valley Heights, Andheri",
            },
            {
                "name": "Priya Patel",
                "phone": "+91 98234 56781",
                "email": "priya.patel@outlook.com",
                "address": "12 Riverside Apartments, Bandra West",
            },
            {
                "name": "Amit Verma",
                "phone": "+91 98112 23344",
                "email": "amit.verma@techmail.com",
                "address": "B-44 Kailash Colony, South Delhi",
            },
            {
                "name": "Sneha Kulkarni",
                "phone": "+91 98998 87766",
                "email": "sneha.k@healthnet.org",
                "address": "78 4th Block, Koramangala, Bangalore",
            },
        ]

        customer_map = {}
        for c_data in customers_data:
            existing = db.query(Customer).filter(Customer.phone == c_data["phone"]).first()
            if not existing:
                existing = Customer(**c_data)
                db.add(existing)
                db.commit()
                db.refresh(existing)
                print(f"  + Added Customer: {existing.name}")
            customer_map[c_data["name"]] = existing

        # 5. Seed Purchases
        print("[PURCHASES] Checking purchases...")
        if db.query(Purchase).count() == 0 and supplier_map and medicine_map:
            sup1 = list(supplier_map.values())[0]
            med1 = medicine_map["Paracetamol 650mg"]
            p1 = Purchase(
                supplier_id=sup1.id,
                medicine_id=med1.id,
                quantity=100,
                purchase_price=22.00,
                selling_price=32.50,
                batch_number="BAT-PARA-2026A",
                manufacture_date=date.today() - timedelta(days=60),
                expiry_date=date.today() + timedelta(days=450),
            )
            db.add(p1)

            sup2 = list(supplier_map.values())[1] if len(supplier_map) > 1 else sup1
            med2 = medicine_map["Amoxicillin 500mg"]
            p2 = Purchase(
                supplier_id=sup2.id,
                medicine_id=med2.id,
                quantity=50,
                purchase_price=105.00,
                selling_price=145.00,
                batch_number="BAT-AMOX-2026B",
                manufacture_date=date.today() - timedelta(days=45),
                expiry_date=date.today() + timedelta(days=320),
            )
            db.add(p2)
            db.commit()
            print("  + Seeded historical purchases")

        # 6. Seed Sales
        print("[SALES] Checking sales transactions...")
        if db.query(Sale).count() == 0 and customer_map and medicine_map:
            cust1 = list(customer_map.values())[0]
            med_para = medicine_map["Paracetamol 650mg"]
            med_pant = medicine_map["Pantoprazole 40mg"]

            # Invoice 1
            inv1 = Sale(
                customer_id=cust1.id,
                invoice_number="INV-2026-0001",
                subtotal=208.50,
                discount=10.00,
                tax=37.53,
                grand_total=236.03,
                payment_method="UPI",
                sale_date=datetime.utcnow() - timedelta(days=1),
            )
            db.add(inv1)
            db.flush()

            item1 = SaleItem(
                sale_id=inv1.id,
                medicine_id=med_para.id,
                quantity=2,
                unit_price=float(med_para.price),
                total_price=float(med_para.price) * 2,
            )
            item2 = SaleItem(
                sale_id=inv1.id,
                medicine_id=med_pant.id,
                quantity=1,
                unit_price=float(med_pant.price),
                total_price=float(med_pant.price),
            )
            db.add(item1)
            db.add(item2)

            # Invoice 2
            cust2 = list(customer_map.values())[1]
            med_amox = medicine_map["Amoxicillin 500mg"]
            inv2 = Sale(
                customer_id=cust2.id,
                invoice_number="INV-2026-0002",
                subtotal=290.00,
                discount=20.00,
                tax=52.20,
                grand_total=322.20,
                payment_method="Card",
                sale_date=datetime.utcnow(),
            )
            db.add(inv2)
            db.flush()

            item3 = SaleItem(
                sale_id=inv2.id,
                medicine_id=med_amox.id,
                quantity=2,
                unit_price=float(med_amox.price),
                total_price=float(med_amox.price) * 2,
            )
            db.add(item3)

            db.commit()
            print("  + Seeded initial sales invoices and items")

        print("[DONE] Database successfully seeded and ready for production!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error during seeding: {e}")
        raise e
    finally:
        db.close()



if __name__ == "__main__":
    seed_all()
