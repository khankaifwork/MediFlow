import type { Sale } from "../../types/sale";

type SaleTableProps = {
  sales: Sale[];
};

function SaleTable({ sales }: SaleTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Invoice</th>
            <th className="p-4 text-left">Customer ID</th>
            <th className="p-4 text-left">Total</th>
            <th className="p-4 text-left">Payment</th>
            <th className="p-4 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="p-6 text-center text-gray-500"
              >
                No sales found.
              </td>
            </tr>
          ) : (
            sales.map((sale) => (
              <tr
                key={sale.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4">
                  {sale.invoice_number}
                </td>

                <td className="p-4">
                  {sale.customer_id}
                </td>

                <td className="p-4">
                  ₹{sale.grand_total}
                </td>

                <td className="p-4">
                  {sale.payment_method}
                </td>

                <td className="p-4">
                  {new Date(
                    sale.sale_date
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SaleTable;