import { useEffect, useState } from "react";

import type { Customer } from "../../types/customer";
import type { Medicine } from "../../types/medicine";

import { getCustomers } from "../../services/customer.service";
import { getMedicines } from "../../services/medicine.service";
import { createSale } from "../../services/sale.service";

type SaleFormProps = {
  onSaleAdded?: () => void;
};

function SaleForm({ onSaleAdded }: SaleFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [medicineId, setMedicineId] = useState("");

  const [selectedMedicine, setSelectedMedicine] =
    useState<Medicine | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [discount, setDiscount] = useState(0);

  const [paymentMethod, setPaymentMethod] =
    useState("Cash");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const customerData = await getCustomers();
      const medicineData = await getMedicines();

      setCustomers(customerData);
      setMedicines(medicineData);
    } catch (error) {
      console.error(error);
    }
  }

  const subtotal =
    selectedMedicine
      ? selectedMedicine.price * quantity
      : 0;

  const tax = subtotal * 0.18;

  const grandTotal =
    subtotal + tax - discount;

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!customerId || !medicineId) {
      alert("Please select customer and medicine.");
      return;
    }

    try {
      await createSale({
        customer_id: Number(customerId),
        payment_method: paymentMethod,
        discount,
        items: [
          {
            medicine_id: Number(medicineId),
            quantity,
          },
        ],
      });

      alert("Sale completed successfully!");

      setCustomerId("");
      setMedicineId("");
      setSelectedMedicine(null);
      setQuantity(1);
      setDiscount(0);
      setPaymentMethod("Cash");

      await loadData();

      if (onSaleAdded) {
        onSaleAdded();
      }

    } catch (error) {
      console.error(error);
      alert("Failed to create sale.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-xl bg-white p-6 shadow"
    >
      <h2 className="mb-6 text-2xl font-semibold">
        New Sale
      </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Customer */}

        <select
          className="rounded-lg border p-3"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        >
          <option value="">
            Select Customer
          </option>

          {customers.map((customer) => (
            <option
              key={customer.id}
              value={customer.id}
            >
              {customer.name}
            </option>
          ))}
        </select>

        {/* Medicine */}

        <select
          className="rounded-lg border p-3"
          value={medicineId}
          onChange={(e) => {
            const id = e.target.value;

            setMedicineId(id);

            const medicine = medicines.find(
              (m) => m.id === Number(id)
            );

            setSelectedMedicine(medicine ?? null);
          }}
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
          min={1}
          className="rounded-lg border p-3"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(Number(e.target.value))
          }
          required
        />

        <input
          type="number"
          min={0}
          className="rounded-lg border p-3"
          placeholder="Discount"
          value={discount}
          onChange={(e) =>
            setDiscount(Number(e.target.value))
          }
        />

        <select
          className="rounded-lg border p-3"
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Card</option>
        </select>

      </div>

      {selectedMedicine && (
        <div className="mt-6 rounded-xl border bg-slate-50 p-5">

          <h3 className="mb-4 text-lg font-semibold">
            Medicine Details
          </h3>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <strong>Name:</strong>{" "}
              {selectedMedicine.name}
            </div>

            <div>
              <strong>Manufacturer:</strong>{" "}
              {selectedMedicine.manufacturer}
            </div>

            <div>
              <strong>Current Stock:</strong>{" "}
              {selectedMedicine.stock}
            </div>

            <div>
              <strong>Unit Price:</strong> ₹
              {selectedMedicine.price}
            </div>
                        <div>
              <strong>Expiry Date:</strong>{" "}
              {selectedMedicine.expiry_date}
            </div>

            <div>
              <strong>Prescription:</strong>{" "}
              {selectedMedicine.prescription_required
                ? "Required"
                : "Not Required"}
            </div>

          </div>

          <hr className="my-6" />

          <div className="space-y-2 text-lg">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span>₹{discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t pt-3 text-xl font-bold">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

          </div>

        </div>
      )}

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-green-600 py-3 text-lg font-semibold text-white transition hover:bg-green-700"
      >
        Complete Sale
      </button>

    </form>
  );
}

export default SaleForm;