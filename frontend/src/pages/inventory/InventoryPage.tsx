import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import InventoryStats from "../../components/inventory/InventoryStats";
import InventoryTable from "../../components/inventory/InventoryTable";

import { getInventory } from "../../services/inventory.service";

import type { Inventory } from "../../types/inventory";

function InventoryPage() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  async function loadInventory() {
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredInventory = inventory.filter((medicine) => {
    const matchesSearch = medicine.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      medicine.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <h1 className="mb-6 text-3xl font-bold">
        Inventory
      </h1>

      <InventoryStats inventory={inventory} />

      <div className="mb-6 flex flex-col gap-4 md:flex-row">

        <input
          type="text"
          placeholder="🔍 Search medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-gray-300 p-3"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="rounded-xl border border-gray-300 p-3"
        >
          <option value="All">
            All Status
          </option>

          <option value="Healthy">
            Healthy
          </option>

          <option value="Low Stock">
            Low Stock
          </option>

          <option value="Out of Stock">
            Out of Stock
          </option>

          <option value="Expired">
            Expired
          </option>

        </select>

      </div>

      <InventoryTable
        inventory={filteredInventory}
      />
    </AppLayout>
  );
}

export default InventoryPage;