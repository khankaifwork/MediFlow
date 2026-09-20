# MediFlow — Enterprise Pharmacy OS & Intelligence

MediFlow is a modern, production-ready pharmacy management system and clinical copilot designed for retail dispensaries and hospital pharmacies. It unifies high-velocity POS billing, automated inventory reordering, GST-compliant tax invoicing, role-based authorization (RBAC), and Google Gemini AI intelligence into a cohesive, lightning-fast platform.

---

## 🌟 Key Capabilities

1. **High-Speed Point of Sale (POS)**:
   - Real-time multi-item prescription cart with live stock deduction.
   - Automated 18% GST calculation, customizable discounts, and payment methods (UPI, Card, Cash).
   - Instant printable GST tax invoice receipt generation (`INV-YYYY-XXXX`).

2. **Google Gemini AI Pharmacy Copilot**:
   - **Clinical Assistant**: Answers drug interactions, dosage warnings, and generic equivalents.
   - **Executive Health Audit**: One-click business intelligence analyzing daily revenue, stock velocity, and strategic recommendations.
   - **Live Database Agent**: Tool-calling AI directly grounded in the pharmacy's real-time inventory and sales numbers.

3. **Formulary & Inventory Tracking**:
   - Automated status gauges: *Healthy*, *Low Stock (≤10)*, *Out of Stock*, and *Expired*.
   - Expiry date tracking and prescription requirements (Rx vs OTC).
   - Batch numbers and manufacturer indexing.

4. **Procurement & Vendor CRM**:
   - Supplier onboarding with contact coordinates and GSTIN verification.
   - Stock restocking linked to vendor purchase orders with automated inventory increments.

5. **Executive Analytics & Reporting**:
   - 7-Day revenue velocity area chart and top dispensed medicines breakdown.
   - Patient lifetime spend leaderboards and exportable executive CSV reports.

6. **Enterprise Security & Architecture**:
   - JWT token authentication with bcrypt password hashing.
   - Role-Based Access Control (Admin vs Pharmacist permissions).
   - 100% test coverage with automated `pytest` and zero-warning ESLint / TypeScript builds.

---

## 🏗️ System Architecture

```
                 ┌────────────────────────────────┐
                 │       Client Web Browser       │
                 │   (React 19 + Vite + Tailwind) │
                 └──────────────┬─────────────────┘
                                │ HTTP / REST (JWT)
                                ▼
                 ┌────────────────────────────────┐
                 │       FastAPI API Gateway      │
                 │    (Python 3.12 / Uvicorn)     │
                 └──────┬──────────────────┬──────┘
                        │                  │
           SQLAlchemy   │                  │ Google GenAI SDK
                        ▼                  ▼
          ┌───────────────────────┐  ┌───────────────────────┐
          │  PostgreSQL Database  │  │   Gemini 2.5 Flash    │
          │   (Schema & Tables)   │  │ (AI Assistant & Agent)│
          └───────────────────────┘  └───────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v20+ and **npm** v10+
- **Python** 3.11+
- **PostgreSQL** 15+ (or Docker)

---

### Method A: Local Development Setup

#### 1. Backend Setup
```bash
# Navigate to backend
cd backend

# Create & activate virtual environment
python -m venv .venv
.\.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # Linux / macOS

# Install dependencies
pip install -r requirements.txt
pip install pytest httpx

# Configure environment
cp .env.example .env
# Edit DATABASE_URL and GEMINI_API_KEY in .env

# Seed initial database records (Admin, Medicines, Suppliers, Sales)
python app/database/seed_data.py

# Start FastAPI dev server
uvicorn app.main:app --reload --port 8000
```
Backend will be live at: **http://localhost:8000** (Swagger docs at `/docs`, Health probe at `/health`).

#### 2. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install packages
npm install

# Run Vite dev server
npm run dev
```
Frontend will be live at: **http://localhost:5173**.

---

### Method B: One-Click Production Docker Deployment

MediFlow is fully containerized with automated health checks and persistent storage:

```bash
# From project root
docker compose up -d --build
```
- **Web App**: http://localhost
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: Port 5432 (persisted via `postgres_data` volume)

---

## 🔑 Default Seed Credentials

After running `seed_data.py` or starting the Docker container, use the demo credentials below or click the quick-fill pills on the login screen:

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Full access (Inventory, POS, Suppliers, Reports, User Management) |
| **Staff Pharmacist** | `pharmacist` | `pharma123` | Operational access (POS Dispensing, Stock Audit, AI Assistant) |

---

## 🧪 Testing & Code Quality Verification

### Run Backend Test Suite
```bash
cd backend
python -m pytest app/tests -v
```
*Executes isolated in-memory SQLite integration tests covering auth, token verification, RBAC, drug catalog, and POS stock deductions.*

### Run Frontend Lint & Production Bundle Build
```bash
cd frontend
npm run lint    # Ensures 0 warnings and 0 errors
npm run build   # Verifies TypeScript compilation and bundle packaging
```

---

## 📄 License & Ownership
Copyright © 2026 MediFlow Technologies. Designed and engineered for production pharmacy operations.