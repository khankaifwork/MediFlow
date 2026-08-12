import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import CustomerTable from "../../components/customers/CustomerTable";
import CustomerForm from "../../components/customers/CustomerForm";

import {
  getCustomers,
  deleteCustomer,
} from "../../services/customer.service";

import type { Customer } from "../../types/customer";

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  async function loadCustomers() {
    try {
      console.log("Loading customers...");
      const data = await getCustomers();
      console.log("Customers:", data);
      setCustomers(data);
    } catch (error) {
      console.error("Customer API Error:", error);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function handleDelete(id: number) {
    try {
      await deleteCustomer(id);
      loadCustomers();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AppLayout>
      <h1 className="mb-6 text-3xl font-bold">
        Customers
      </h1>

      <CustomerForm
        customer={editingCustomer}
        onCustomerAdded={() => {
          setEditingCustomer(null);
          loadCustomers();
        }}
      />

      <CustomerTable
        customers={customers}
        onEdit={setEditingCustomer}
        onDelete={handleDelete}
      />
    </AppLayout>
  );
}

export default CustomersPage;