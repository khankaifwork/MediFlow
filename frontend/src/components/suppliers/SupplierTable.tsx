import type { Supplier } from "../../types/supplier";

type SupplierTableProps = {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: number) => void;
};

function SupplierTable({
  suppliers,
  onEdit,
  onDelete,
}: SupplierTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Supplier</th>
            <th className="p-4 text-left">Company</th>
            <th className="p-4 text-left">Contact</th>
            <th className="p-4 text-left">Phone</th>
            <th className="p-4 text-left">City</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-6 text-center text-gray-500"
              >
                No suppliers found.
              </td>
            </tr>
          ) : (
            suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4">{supplier.supplier_name}</td>
                <td className="p-4">{supplier.company_name}</td>
                <td className="p-4">
                  {supplier.contact_person || "-"}
                </td>
                <td className="p-4">{supplier.phone}</td>
                <td className="p-4">
                  {supplier.city || "-"}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(supplier)}
                      className="rounded-lg bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete ${supplier.supplier_name}?`
                          )
                        ) {
                          onDelete(supplier.id);
                        }
                      }}
                      className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierTable;