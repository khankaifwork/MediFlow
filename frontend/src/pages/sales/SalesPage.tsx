import { useEffect, useState, useCallback } from "react";
import AppLayout from "../../components/layout/AppLayout";
import SaleForm from "../../components/sales/SaleForm";
import SaleTable from "../../components/sales/SalesTable";
import { getSales } from "../../services/sale.service";
import type { Sale } from "../../types/sale";
import toast from "react-hot-toast";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);

  const loadSales = useCallback(async () => {
    try {
      const data = await getSales();
      setSales(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load sales history.");
    }
  }, []);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Point of Sale (POS) & Billing
        </h1>
        <p className="text-sm text-slate-500">
          Process retail prescriptions, manage customer cart items, and generate compliant invoices
        </p>
      </div>

      <SaleForm onSaleAdded={loadSales} />

      <SaleTable sales={sales} />
    </AppLayout>
  );
}