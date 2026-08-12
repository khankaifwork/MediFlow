import { useEffect, useState } from "react";

import {
  createSupplier,
  updateSupplier,
} from "../../services/supplier.service";

import type { Supplier } from "../../types/supplier";

type SupplierFormProps = {
  supplier: Supplier | null;
  onSupplierAdded: () => void;
};

function SupplierForm({
  supplier,
  onSupplierAdded,
}: SupplierFormProps) {
  const [supplierName, setSupplierName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  useEffect(() => {
    if (supplier) {
      setSupplierName(supplier.supplier_name);
      setCompanyName(supplier.company_name);
      setContactPerson(supplier.contact_person ?? "");
      setPhone(supplier.phone);
      setEmail(supplier.email ?? "");
      setAddress(supplier.address ?? "");
      setCity(supplier.city ?? "");
      setState(supplier.state ?? "");
      setCountry(supplier.country ?? "");
      setGstNumber(supplier.gst_number ?? "");
    } else {
      resetForm();
    }
  }, [supplier]);

  function resetForm() {
    setSupplierName("");
    setCompanyName("");
    setContactPerson("");
    setPhone("");
    setEmail("");
    setAddress("");
    setCity("");
    setState("");
    setCountry("");
    setGstNumber("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const supplierData = {
      supplier_name: supplierName,
      company_name: companyName,
      contact_person: contactPerson || null,
      phone,
      email: email || null,
      address: address || null,
      city: city || null,
      state: state || null,
      country: country || null,
      gst_number: gstNumber || null,
    };

    try {
      if (supplier) {
        await updateSupplier(supplier.id, supplierData);
        alert("Supplier updated successfully!");
      } else {
        await createSupplier(supplierData);
        alert("Supplier added successfully!");
      }

      resetForm();
      onSupplierAdded();
    } catch (error) {
      console.error(error);
      alert("Failed to save supplier.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl bg-white p-6 shadow"
    >
      <h2 className="mb-6 text-2xl font-semibold">
        {supplier ? "Edit Supplier" : "Add Supplier"}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          className="rounded-lg border p-3"
          placeholder="Supplier Name"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          required
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Contact Person"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="email"
          className="rounded-lg border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="rounded-lg border p-3"
          placeholder="GST Number"
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)}
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          className="rounded-lg border p-3"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          className="rounded-lg border p-3"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          {supplier ? "Update Supplier" : "Save Supplier"}
        </button>

        {supplier && (
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

export default SupplierForm;