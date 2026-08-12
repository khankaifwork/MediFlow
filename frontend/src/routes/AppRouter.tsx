import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/dashboard/DashboardPage";
import MedicinesPage from "../pages/medicines/MedicinesPage";
import CustomersPage from "../pages/customers/CustomersPage";
import SuppliersPage from "../pages/suppliers/SuppliersPage";
import PurchasesPage from "../pages/purchases/PurchasesPage";
import SalesPage from "../pages/sales/SalesPage";
import InventoryPage from "../pages/inventory/InventoryPage";
import ReportsPage from "../pages/reports/ReportsPage";
import AIPage from "../pages/ai/AIPage";
import LoginPage from "../pages/auth/LoginPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<DashboardPage />} />
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/ai" element={<AIPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;