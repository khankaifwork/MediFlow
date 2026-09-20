import { useEffect, useState, useCallback } from "react";
import type { Customer } from "../../types/customer";
import type { Medicine } from "../../types/medicine";
import { getCustomers } from "../../services/customer.service";
import { getMedicines } from "../../services/medicine.service";
import { createSale } from "../../services/sale.service";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  Plus,
  Trash2,
  Receipt,
  CreditCard,
  QrCode,
  Banknote,
  Printer,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";

type CartItem = {
  medicine: Medicine;
  quantity: number;
};

type SaleFormProps = {
  onSaleAdded?: () => void;
};

export default function SaleForm({ onSaleAdded }: SaleFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [submitting, setSubmitting] = useState(false);

  // Completed invoice modal state
  interface CompletedInvoice {
    invoice_number: string;
    sale_date: string;
    customer_id: number;
    subtotal: number;
    discount: number;
    tax: number;
    grand_total: number;
    payment_method: string;
    items: { medicine_id: number; quantity: number; unit_price: number; total_price: number }[];
  }
  const [completedSale, setCompletedSale] = useState<CompletedInvoice | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [customerData, medicineData] = await Promise.all([
        getCustomers(),
        getMedicines(0, 200),
      ]);
      setCustomers(customerData);
      setMedicines(medicineData);
      if (customerData.length > 0 && !customerId) {
        setCustomerId(String(customerData[0].id));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load inventory or customer list.");
    }
  }, [customerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleAddToCart() {
    if (!selectedMedicineId) {
      toast.error("Select a medicine to add.");
      return;
    }

    const med = medicines.find((m) => m.id === Number(selectedMedicineId));
    if (!med) return;

    if (med.stock <= 0) {
      toast.error(`"${med.name}" is out of stock!`);
      return;
    }

    // Check if already in cart
    const existingIndex = cart.findIndex((item) => item.medicine.id === med.id);
    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty + 1 > med.stock) {
        toast.error(`Stock limit reached (${med.stock} units available).`);
        return;
      }
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { medicine: med, quantity: 1 }]);
    }

    setSelectedMedicineId("");
    toast.success(`Added ${med.name} to cart`);
  }

  function updateQuantity(medicineId: number, newQty: number) {
    if (newQty <= 0) {
      removeFromCart(medicineId);
      return;
    }

    const med = medicines.find((m) => m.id === medicineId);
    if (med && newQty > med.stock) {
      toast.error(`Cannot exceed current stock (${med.stock} units).`);
      return;
    }

    setCart(
      cart.map((item) =>
        item.medicine.id === medicineId ? { ...item, quantity: newQty } : item
      )
    );
  }

  function removeFromCart(medicineId: number) {
    setCart(cart.filter((item) => item.medicine.id !== medicineId));
  }

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.medicine.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18; // 18% GST
  const discountVal = discount === "" ? 0 : Number(discount);
  const grandTotal = Math.max(0, subtotal + tax - discountVal);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!customerId) {
      toast.error("Please select a customer for this invoice.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Add at least one medicine to the POS cart.");
      return;
    }

    setSubmitting(true);
    try {
      const salePayload = {
        customer_id: Number(customerId),
        payment_method: paymentMethod,
        discount: discountVal,
        items: cart.map((item) => ({
          medicine_id: item.medicine.id,
          quantity: item.quantity,
        })),
      };

      const result = await createSale(salePayload);
      setCompletedSale(result);
      toast.success("POS Sale finalized! Invoice generated.");

      // Clear cart
      setCart([]);
      setDiscount("");
      setPaymentMethod("UPI");

      // Reload fresh stock
      await loadData();

      if (onSaleAdded) {
        onSaleAdded();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete sale. Check stock availability.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm"
      >
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                POS Billing & Dispensing Terminal
              </h2>
              <p className="text-xs text-slate-500">
                Multi-item pharmaceutical checkout with real-time stock validation and GST invoicing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              Cart Items: {cart.length}
            </span>
          </div>
        </div>

        {/* Customer & Item Selection */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Customer / Patient *
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Search & Add Medicine to Cart
            </label>
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                value={selectedMedicineId}
                onChange={(e) => setSelectedMedicineId(e.target.value)}
              >
                <option value="">Choose medicine from inventory...</option>
                {medicines.map((m) => (
                  <option key={m.id} value={m.id} disabled={m.stock <= 0}>
                    {m.name} — ₹{m.price.toFixed(2)} (Stock: {m.stock}{" "}
                    {m.stock <= 10 ? "⚠️ LOW" : ""})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedMedicineId}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cart Table */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200/80">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 text-left">Medicine</th>
                <th className="px-5 py-3 text-center">Unit Price</th>
                <th className="px-5 py-3 text-center">Quantity</th>
                <th className="px-5 py-3 text-right">Line Total</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm">
              {cart.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingCart className="h-8 w-8 text-slate-300" />
                      <p className="font-medium">POS Cart is currently empty</p>
                      <p className="text-xs">
                        Select a medicine above and click "Add Item" to start billing
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                cart.map((item) => (
                  <tr key={item.medicine.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900">{item.medicine.name}</p>
                      <p className="text-xs text-slate-400">{item.medicine.manufacturer}</p>
                    </td>

                    <td className="px-5 py-3.5 text-center font-medium text-slate-600">
                      ₹{item.medicine.price.toFixed(2)}
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                          className="h-6 w-6 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                          className="h-6 w-6 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                      ₹{(item.medicine.price * item.quantity).toFixed(2)}
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.medicine.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bill Summary & Payment Method */}
        {cart.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl bg-slate-50/80 p-6 border border-slate-200/60">
            {/* Payment Details */}
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Payment Channel *
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "UPI", icon: QrCode, label: "UPI / QR" },
                  { id: "Card", icon: CreditCard, label: "Card" },
                  { id: "Cash", icon: Banknote, label: "Cash" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition ${
                      paymentMethod === m.id
                        ? "border-teal-600 bg-teal-50 text-teal-800"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100/60"
                    }`}
                  >
                    <m.icon className="h-4 w-4" />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Custom Discount (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none"
                  placeholder="0.00"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex flex-col justify-between space-y-3 rounded-2xl bg-white p-5 border border-slate-200/80">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>

                {discountVal > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{discountVal.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-slate-200 pt-3 text-xl font-extrabold text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-teal-600">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || cart.length === 0}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 active:scale-98 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Sale & Stock...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirm Sale & Print Invoice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Invoice Receipt Modal */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <button
              onClick={() => setCompletedSale(null)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center pb-5 border-b border-dashed border-slate-200">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <Receipt className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">MediFlow Dispensary</h3>
              <p className="text-xs text-slate-500">Official GST Tax Invoice</p>
              <p className="mt-1 font-mono text-xs font-bold text-teal-600">
                {completedSale.invoice_number}
              </p>
            </div>

            {/* Receipt Body */}
            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Date:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(completedSale.sale_date).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Mode:</span>
                <span className="font-semibold text-slate-800">{completedSale.payment_method}</span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="rounded-xl bg-slate-50 p-3 my-2 text-xs space-y-1">
              <div className="flex justify-between text-slate-600 pb-1 border-b border-slate-200/60 font-semibold">
                <span>Subtotal</span>
                <span>₹{completedSale.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (18%)</span>
                <span>₹{completedSale.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount</span>
                <span>₹{completedSale.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm pt-1 border-t border-slate-200">
                <span>Grand Total Paid</span>
                <span className="text-teal-600">₹{completedSale.grand_total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                <Printer className="h-4 w-4" />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => setCompletedSale(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}