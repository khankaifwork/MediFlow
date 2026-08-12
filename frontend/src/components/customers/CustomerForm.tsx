import { useEffect, useState } from "react";

import {
  createCustomer,
  updateCustomer,
} from "../../services/customer.service";

import type { Customer } from "../../types/customer";

type CustomerFormProps = {
  customer: Customer | null;
  onCustomerAdded: () => void;
};

function CustomerForm({
  customer,
  onCustomerAdded,
}: CustomerFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
      setEmail(customer.email);
      setAddress(customer.address);
    } else {
      resetForm();
    }
  }, [customer]);

  function resetForm() {
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const customerData = {
      name,
      phone,
      email,
      address,
    };

    try {
      if (customer) {
        await updateCustomer(customer.id, customerData);
        alert("Customer updated successfully!");
      } else {
        await createCustomer(customerData);
        alert("Customer added successfully!");
      }

      resetForm();
      onCustomerAdded();
    } catch (error) {
      console.error(error);
      alert("Failed to save customer.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl bg-white p-6 shadow"
    >
      <h2 className="mb-6 text-2xl font-semibold">
        {customer ? "Edit Customer" : "Add Customer"}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          className="rounded-lg border p-3"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          {customer ? "Update Customer" : "Save Customer"}
        </button>

        {customer && (
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border px-6 py-3"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default CustomerForm;