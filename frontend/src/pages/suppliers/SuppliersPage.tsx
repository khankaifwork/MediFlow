import { useEffect, useState, useCallback } from "react";
import AppLayout from "../../components/layout/AppLayout";
import SupplierForm from "../../components/suppliers/SupplierForm";
import SupplierTable from "../../components/suppliers/SupplierTable";
import { getSuppliers, deleteSupplier } from "../../services/supplier.service";
import type { Supplier } from "../../types/supplier";
import toast from "react-hot-toast";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const loadSuppliers = useCallback(async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load suppliers.");
    }
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to remove this supplier?")) return;
    try {
      await deleteSupplier(id);
      toast.success("Supplier deleted successfully.");
      loadSuppliers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete supplier.");
    }
  }

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Suppliers & Vendors
          </h1>
          <p className="text-sm text-slate-500">
            Maintain verified pharmaceutical distributors, GST identification, and contact records
          </p>
        </div>
      </div>

      <SupplierForm
        supplier={editingSupplier}
        onSupplierAdded={() => {
          setEditingSupplier(null);
          loadSuppliers();
        }}
        onCancel={() => setEditingSupplier(null)}
      />

      <SupplierTable
        suppliers={suppliers}
        onEdit={setEditingSupplier}
        onDelete={handleDelete}
      />
    </AppLayout>
  );
}