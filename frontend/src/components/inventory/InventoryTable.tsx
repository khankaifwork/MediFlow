import type { Inventory } from "../../types/inventory";

type InventoryTableProps = {
  inventory: Inventory[];
};

function getStatusBadge(status: string) {
  switch (status) {
    case "Healthy":
      return (
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
          🟢 Healthy
        </span>
      );

    case "Low Stock":
      return (
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
          🟡 Low Stock
        </span>
      );

    case "Out of Stock":
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
          🔴 Out of Stock
        </span>
      );

    case "Expired":
      return (
        <span className="rounded-full bg-red-200 px-3 py-1 text-sm font-medium text-red-800">
          ⛔ Expired
        </span>
      );

    default:
      return status;
  }
}

function InventoryTable({
  inventory,
}: InventoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">
              Medicine
            </th>

            <th className="p-4 text-left">
              Manufacturer
            </th>

            <th className="p-4 text-left">
              Stock
            </th>

            <th className="p-4 text-left">
              Price
            </th>

            <th className="p-4 text-left">
              Expiry
            </th>

            <th className="p-4 text-left">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {inventory.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-6 text-center text-gray-500"
              >
                No medicines found.
              </td>
            </tr>
          ) : (
            inventory.map((medicine) => (
              <tr
                key={medicine.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4 font-medium">
                  {medicine.name}
                </td>

                <td className="p-4">
                  {medicine.manufacturer}
                </td>

                <td className="p-4">
                  {medicine.stock}
                </td>

                <td className="p-4">
                  ₹{medicine.price}
                </td>

                <td className="p-4">
                  {medicine.expiry_date}
                </td>

                <td className="p-4">
                  {getStatusBadge(
                    medicine.status
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;