import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createSupplier, updateSupplier } from "../../services/supplier.service";
import type { Supplier } from "../../types/supplier";
import { Truck, Check, X } from "lucide-react";

type SupplierFormProps = {
  supplier: Supplier | null;
  onSupplierAdded: () => void;
  onCancel?: () => void;
};

export default function SupplierForm({
  supplier,
  onSupplierAdded,
  onCancel,
}: SupplierFormProps) {
  const [supplierName, setSupplierName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [gstNumber, setGstNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      setCountry(supplier.country ?? "India");
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
    setCountry("India");
    setGstNumber("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

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
        toast.success("Supplier updated successfully!");
      } else {
        await createSupplier(supplierData);
        toast.success("New supplier onboarded successfully!");
      }

      resetForm();
      onSupplierAdded();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save supplier details.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200"
    >
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {supplier ? "Edit Supplier Record" : "Add Pharmaceutical Supplier"}
            </h2>
            <p className="text-xs text-slate-500">
              {supplier
                ? "Update vendor details, GSTN, and communication coordinates"
                : "Register a certified drug distributor or wholesaler"}
            </p>
          </div>
        </div>
        {supplier && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Editing Mode (ID: {supplier.id})
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Supplier / Distributor Name *
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="e.g. Apex Pharma Distributors"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Company / Entity Name *
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="e.g. Apex Healthcare Ltd"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Contact Person
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="e.g. Vikram Malhotra"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Phone Number *
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="+91 98200 11223"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Email Address
          </label>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="orders@apexpharma.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            GSTIN / Tax ID
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="27AABCA1234M1Z5"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Street Address
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="Plot 42, MIDC Industrial Area"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            City
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="Mumbai"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            State
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="Maharashtra"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Country
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="India"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        {(supplier || onCancel) && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              if (onCancel) onCancel();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          {submitting
            ? "Saving..."
            : supplier
            ? "Update Supplier"
            : "Save Supplier"}
        </button>
      </div>
    </form>
  );
}
