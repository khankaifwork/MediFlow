import type { Purchase } from "../../types/purchase";

type PurchaseTableProps = {
  purchases: Purchase[];
};

function PurchaseTable({
  purchases,
}: PurchaseTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Supplier ID</th>
            <th className="p-4 text-left">Medicine ID</th>
            <th className="p-4 text-left">Quantity</th>
            <th className="p-4 text-left">Purchase Price</th>
            <th className="p-4 text-left">Selling Price</th>
            <th className="p-4 text-left">Batch</th>
            <th className="p-4 text-left">Expiry</th>
          </tr>
        </thead>

        <tbody>
          {purchases.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="p-6 text-center text-gray-500"
              >
                No purchases found.
              </td>
            </tr>
          ) : (
            purchases.map((purchase) => (
              <tr
                key={purchase.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4">
                  {purchase.supplier_id}
                </td>

                <td className="p-4">
                  {purchase.medicine_id}
                </td>

                <td className="p-4">
                  {purchase.quantity}
                </td>

                <td className="p-4">
                  ₹{purchase.purchase_price}
                </td>

                <td className="p-4">
                  ₹{purchase.selling_price}
                </td>

                <td className="p-4">
                  {purchase.batch_number}
                </td>

                <td className="p-4">
                  {purchase.expiry_date}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseTable;