import type { Medicine } from "../../types/medicine";
import toast from "react-hot-toast";

type MedicineTableProps = {
  medicines: Medicine[];
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: number) => void;
};

function MedicineTable({
  medicines,
  onEdit,
  onDelete,
}: MedicineTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200">
      <table className="min-w-full">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="px-6 py-4 text-left">Medicine</th>
            <th className="px-6 py-4 text-left">Manufacturer</th>
            <th className="px-6 py-4 text-center">Price</th>
            <th className="px-6 py-4 text-center">Stock</th>
            <th className="px-6 py-4 text-center">Expiry</th>
            <th className="px-6 py-4 text-center">Prescription</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {medicines.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-10 text-center text-gray-500"
              >
                No medicines found.
              </td>
            </tr>
          ) : (
            medicines.map((medicine) => (
              <tr
                key={medicine.id}
                className="border-b hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 font-semibold">
                  {medicine.name}
                </td>

                <td className="px-6 py-4">
                  {medicine.manufacturer}
                </td>

                <td className="px-6 py-4 text-center font-semibold text-green-700">
                  ₹{Number(medicine.price).toFixed(2)}
                </td>

                <td className="px-6 py-4 text-center">
                  {medicine.stock <= 10 ? (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                      {medicine.stock} Low
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      {medicine.stock} In Stock
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  {medicine.expiry_date}
                </td>

                <td className="px-6 py-4 text-center">
                  {medicine.prescription_required ? (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      Required
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      OTC
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(medicine)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${medicine.name}?`)) {
                          onDelete(medicine.id);
                          toast.success("Medicine deleted successfully");
                        }
                      }}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
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

export default MedicineTable;