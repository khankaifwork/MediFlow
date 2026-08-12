import { useEffect, useState } from "react";

import { getSuppliers } from "../../services/supplier.service";
import { getMedicines } from "../../services/medicine.service";
import { createPurchase } from "../../services/purchase.service";

import type { Supplier } from "../../types/supplier";
import type { Medicine } from "../../types/medicine";

type PurchaseFormProps = {
  onPurchaseAdded: () => void;
};

function PurchaseForm({
  onPurchaseAdded,
}: PurchaseFormProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const [supplierId, setSupplierId] = useState("");
  const [medicineId, setMedicineId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [batchNumber, setBatchNumber] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const supplierData = await getSuppliers();
      const medicineData = await getMedicines();

      setSuppliers(supplierData);
      setMedicines(medicineData);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      await createPurchase({
        supplier_id: Number(supplierId),
        medicine_id: Number(medicineId),
        quantity,
        purchase_price: purchasePrice,
        selling_price: sellingPrice,
        batch_number: batchNumber,
        manufacture_date: manufactureDate,
        expiry_date: expiryDate,
      });

      alert("Purchase saved successfully!");

      setSupplierId("");
      setMedicineId("");
      setQuantity(1);
      setPurchasePrice(0);
      setSellingPrice(0);
      setBatchNumber("");
      setManufactureDate("");
      setExpiryDate("");

      onPurchaseAdded();
    } catch (error) {
      console.error(error);
      alert("Failed to save purchase.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl bg-white p-6 shadow"
    >
      <h2 className="mb-6 text-2xl font-semibold">
        New Purchase
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <select
          className="rounded-lg border p-3"
          value={supplierId}
          onChange={(e) =>
            setSupplierId(e.target.value)
          }
          required
        >
          <option value="">
            Select Supplier
          </option>

          {suppliers.map((supplier) => (
            <option
              key={supplier.id}
              value={supplier.id}
            >
              {supplier.company_name}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border p-3"
          value={medicineId}
          onChange={(e) =>
            setMedicineId(e.target.value)
          }
          required
        >
          <option value="">
            Select Medicine
          </option>

          {medicines.map((medicine) => (
            <option
              key={medicine.id}
              value={medicine.id}
            >
              {medicine.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="rounded-lg border p-3"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(Number(e.target.value))
          }
        />

        <input
          type="number"
          className="rounded-lg border p-3"
          placeholder="Purchase Price"
          value={purchasePrice}
          onChange={(e) =>
            setPurchasePrice(Number(e.target.value))
          }
        />

        <input
          type="number"
          className="rounded-lg border p-3"
          placeholder="Selling Price"
          value={sellingPrice}
          onChange={(e) =>
            setSellingPrice(Number(e.target.value))
          }
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Batch Number"
          value={batchNumber}
          onChange={(e) =>
            setBatchNumber(e.target.value)
          }
        />

        <input
          type="date"
          className="rounded-lg border p-3"
          value={manufactureDate}
          onChange={(e) =>
            setManufactureDate(e.target.value)
          }
        />

        <input
          type="date"
          className="rounded-lg border p-3"
          value={expiryDate}
          onChange={(e) =>
            setExpiryDate(e.target.value)
          }
        />

      </div>

      <button
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Save Purchase
      </button>
    </form>
  );
}

export default PurchaseForm;