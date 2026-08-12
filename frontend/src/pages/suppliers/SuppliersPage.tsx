import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import SupplierForm from "../../components/suppliers/SupplierFrom";
import SupplierTable from "../../components/suppliers/SupplierTable";

import {
  getSuppliers,
  deleteSupplier,
} from "../../services/supplier.service";

import type { Supplier } from "../../types/supplier";

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingSupplier, setEditingSupplier] =
    useState<Supplier | null>(null);

  async function loadSuppliers() {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function handleDelete(id: number) {
    try {
      await deleteSupplier(id);
      loadSuppliers();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AppLayout>
      <h1 className="mb-6 text-3xl font-bold">
        Suppliers
      </h1>

      <SupplierForm
        supplier={editingSupplier}
        onSupplierAdded={() => {
          setEditingSupplier(null);
          loadSuppliers();
        }}
      />

      <SupplierTable
        suppliers={suppliers}
        onEdit={setEditingSupplier}
        onDelete={handleDelete}
      />
    </AppLayout>
  );
}

export default SuppliersPage;