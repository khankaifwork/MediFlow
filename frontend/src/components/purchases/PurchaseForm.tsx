import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { getSuppliers } from "../../services/supplier.service";
import { getMedicines } from "../../services/medicine.service";
import { createPurchase } from "../../services/purchase.service";
import type { Supplier } from "../../types/supplier";
import type { Medicine } from "../../types/medicine";
import { ShoppingCart, Check, Loader2 } from "lucide-react";

type PurchaseFormProps = {
  onPurchaseAdded: () => void;
};

export default function PurchaseForm({ onPurchaseAdded }: PurchaseFormProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [supplierId, setSupplierId] = useState("");
  const [medicineId, setMedicineId] = useState("");
  const [quantity, setQuantity] = useState(10);
  const [purchasePrice, setPurchasePrice] = useState<number | "">("");
  const [sellingPrice, setSellingPrice] = useState<number | "">("");
  const [batchNumber, setBatchNumber] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [supplierData, medicineData] = await Promise.all([
        getSuppliers(),
        getMedicines(0, 100),
      ]);
      setSuppliers(supplierData);
      setMedicines(medicineData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load suppliers or medicines.");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!supplierId || !medicineId) {
      toast.error("Please choose a supplier and medicine.");
      return;
    }

    setSubmitting(true);
    try {
      await createPurchase({
        supplier_id: Number(supplierId),
        medicine_id: Number(medicineId),
        quantity: Number(quantity),
        purchase_price: Number(purchasePrice),
        selling_price: Number(sellingPrice),
        batch_number: batchNumber,
        manufacture_date: manufactureDate,
        expiry_date: expiryDate,
      });

      toast.success("Purchase registered & stock automatically updated!");

      setSupplierId("");
      setMedicineId("");
      setQuantity(10);
      setPurchasePrice("");
      setSellingPrice("");
      setBatchNumber("");
      setManufactureDate("");
      setExpiryDate("");

      onPurchaseAdded();
    } catch (error) {
      console.error(error);
      toast.error("Failed to record stock purchase.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <ShoppingCart className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Record Drug Purchase / Restock
          </h2>
          <p className="text-xs text-slate-500">
            Log procurement from authorized suppliers to increase inventory batches
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Supplier *
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.company_name} ({supplier.supplier_name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Medicine / Product *
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={medicineId}
            onChange={(e) => {
              const id = e.target.value;
              setMedicineId(id);
              const m = medicines.find((item) => item.id === Number(id));
              if (m) {
                setSellingPrice(m.price);
              }
            }}
            required
          >
            <option value="">Select Medicine</option>
            {medicines.map((medicine) => (
              <option key={medicine.id} value={medicine.id}>
                {medicine.name} (Stock: {medicine.stock})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Units Procured *
          </label>
          <input
            type="number"
            min={1}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Batch Number *
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="e.g. BAT-2026-X1"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Cost / Purchase Unit Price (₹) *
          </label>
          <input
            type="number"
            step="0.01"
            min={0}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Unit Buy Price"
            value={purchasePrice}
            onChange={(e) =>
              setPurchasePrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Retail / Selling Price (₹) *
          </label>
          <input
            type="number"
            step="0.01"
            min={0}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Retail Price"
            value={sellingPrice}
            onChange={(e) =>
              setSellingPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Manufacture Date *
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={manufactureDate}
            onChange={(e) => setManufactureDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Expiry Date *
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {submitting ? "Saving Procurement..." : "Save & Restock"}
        </button>
      </div>
    </form>
  );
}