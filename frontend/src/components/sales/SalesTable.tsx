import { useState } from "react";
import type { Sale } from "../../types/sale";
import { Receipt, Search, Calendar, CreditCard } from "lucide-react";

type SaleTableProps = {
  sales: Sale[];
};

export default function SaleTable({ sales }: SaleTableProps) {
  const [search, setSearch] = useState("");

  const filteredSales = sales.filter((sale) =>
    sale.invoice_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Recent Sales Invoices & Transactions
          </h3>
          <p className="text-xs text-slate-500">
            Chronological audit log of all POS transactions and customer receipts
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 transition focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left">Invoice No.</th>
              <th className="px-5 py-3 text-center">Customer ID</th>
              <th className="px-5 py-3 text-center">Payment Mode</th>
              <th className="px-5 py-3 text-center">Date & Time</th>
              <th className="px-5 py-3 text-right">Grand Total</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white text-sm">
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-1">
                    <Receipt className="h-6 w-6 text-slate-300" />
                    <p className="font-semibold text-slate-600">No sales transactions found</p>
                    <p className="text-xs text-slate-400">Invoices will appear here once processed</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                      {sale.invoice_number}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-center text-xs font-medium text-slate-600">
                    Patient #{sale.customer_id}
                  </td>

                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      <CreditCard className="h-3 w-3" />
                      {sale.payment_method}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-center text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      {new Date(sale.sale_date).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                    ₹{Number(sale.grand_total).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}