import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  createMedicine,
  updateMedicine,
} from "../../services/medicine.service";
import type { Medicine } from "../../types/medicine";

type MedicineFormProps = {
  medicine: Medicine | null;
  onMedicineAdded: () => void;
};

function MedicineForm({
  medicine,
  onMedicineAdded,
}: MedicineFormProps) {
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [prescriptionRequired, setPrescriptionRequired] =
    useState(false);

  useEffect(() => {
    if (medicine) {
      setName(medicine.name);
      setManufacturer(medicine.manufacturer);
      setPrice(String(medicine.price));
      setStock(String(medicine.stock));
      setExpiryDate(medicine.expiry_date);
      setPrescriptionRequired(
        medicine.prescription_required
      );
    } else {
      resetForm();
    }
  }, [medicine]);

  function resetForm() {
    setName("");
    setManufacturer("");
    setPrice("");
    setStock("");
    setExpiryDate("");
    setPrescriptionRequired(false);
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const medicineData = {
      name,
      manufacturer,
      price: Number(price),
      stock: Number(stock),
      expiry_date: expiryDate,
      prescription_required:
        prescriptionRequired,
    };

    try {
      if (medicine) {
      await updateMedicine(medicine.id, medicineData);
      toast.success("Medicine updated successfully!");
    } else {
      await createMedicine(medicineData);
      toast.success("Medicine added successfully!");
    }

    resetForm();
    onMedicineAdded();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save medicine.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
    >
      <h2 className="mb-8 text-3xl font-bold text-slate-800">
        {medicine ? "Edit Medicine" : "Add New Medicine"}
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Medicine Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Manufacturer *
          </label>
          <input
            type="text"
            value={manufacturer}
            onChange={(e) =>
              setManufacturer(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Price (₹) *
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Stock Quantity *
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) =>
              setStock(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Expiry Date *
          </label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) =>
              setExpiryDate(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="flex items-end">
          <label className="flex w-full items-center gap-3 rounded-xl border border-gray-300 p-4">
            <input
              type="checkbox"
              checked={prescriptionRequired}
              onChange={(e) =>
                setPrescriptionRequired(
                  e.target.checked
                )
              }
            />

            <span className="font-medium">
              Prescription Required
            </span>
          </label>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          {medicine ? "Update Medicine" : "Save Medicine"}
        </button>

        <button
          type="button"
          onClick={resetForm}
          className="rounded-xl border border-gray-300 px-8 py-3 font-semibold hover:bg-gray-100"
        >
          Clear
        </button>
      </div>
    </form>
  );
}

export default MedicineForm;