from app.database.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

user = db.query(User).filter(User.username == "admin").first()

if not user:
    print("❌ Admin user not found.")
else:
    user.hashed_password = hash_password("admin123")
    db.commit()
    print("✅ Admin password reset successfully!")
    print("Username: admin")
    print("Password: admin123")

db.close()