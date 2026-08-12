import type { Inventory } from "../../types/inventory";

type InventoryStatsProps = {
  inventory: Inventory[];
};

function InventoryStats({
  inventory,
}: InventoryStatsProps) {
  const totalMedicines = inventory.length;

  const totalStock = inventory.reduce(
    (sum, medicine) => sum + medicine.stock,
    0
  );

  const lowStock = inventory.filter(
    (medicine) => medicine.status === "Low Stock"
  ).length;

  const outOfStock = inventory.filter(
    (medicine) => medicine.status === "Out of Stock"
  ).length;

  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">

      <div className="rounded-xl bg-blue-600 p-6 text-white shadow">
        <h3 className="text-lg">Medicines</h3>
        <p className="mt-2 text-3xl font-bold">
          {totalMedicines}
        </p>
      </div>

      <div className="rounded-xl bg-green-600 p-6 text-white shadow">
        <h3 className="text-lg">Total Stock</h3>
        <p className="mt-2 text-3xl font-bold">
          {totalStock}
        </p>
      </div>

      <div className="rounded-xl bg-yellow-500 p-6 text-white shadow">
        <h3 className="text-lg">Low Stock</h3>
        <p className="mt-2 text-3xl font-bold">
          {lowStock}
        </p>
      </div>

      <div className="rounded-xl bg-red-600 p-6 text-white shadow">
        <h3 className="text-lg">Out of Stock</h3>
        <p className="mt-2 text-3xl font-bold">
          {outOfStock}
        </p>
      </div>

    </div>
  );
}

export default InventoryStats;