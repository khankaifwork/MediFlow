import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import MedicineForm from "../../components/medicines/MedicineForm";
import MedicineTable from "../../components/medicines/MedicineTable";
import SearchBar from "../../components/medicines/SearchBar";

import {
  getMedicines,
  deleteMedicine,
  searchMedicines,
} from "../../services/medicine.service";

import type { Medicine } from "../../types/medicine.ts";

const PAGE_SIZE = 10;

function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] =
    useState<Medicine | null>(null);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  async function loadMedicines(currentPage = page) {
    try {
      setLoading(true);

      const skip = (currentPage - 1) * PAGE_SIZE;

      const data = await getMedicines(skip, PAGE_SIZE);

      setMedicines(data);
    } catch (error) {
      console.error("Error loading medicines:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(value: string) {
    setSearch(value);

    if (value.trim() === "") {
      loadMedicines(1);
      setPage(1);
      return;
    }

    try {
      const data = await searchMedicines(value);
      setMedicines(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteMedicine(id);

      alert("Medicine deleted successfully!");

      if (selectedMedicine?.id === id) {
        setSelectedMedicine(null);
      }

      loadMedicines();
    } catch (error) {
      console.error(error);
      alert("Failed to delete medicine.");
    }
  }

  useEffect(() => {
    loadMedicines(page);
  }, [page]);

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Medicines
        </h1>
      </div>

      <SearchBar
        value={search}
        onChange={handleSearch}
      />

      <MedicineForm
        medicine={selectedMedicine}
        onMedicineAdded={() => {
          loadMedicines(page);
          setSelectedMedicine(null);
        }}
      />

      {loading ? (
        <div className="rounded-xl bg-white p-8 text-center shadow">
          Loading medicines...
        </div>
      ) : (
        <>
          <MedicineTable
            medicines={medicines}
            onEdit={(medicine) =>
              setSelectedMedicine(medicine)
            }
            onDelete={handleDelete}
          />

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              disabled={page === 1}
              className="rounded-lg bg-slate-200 px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="font-semibold">
              Page {page}
            </span>

            <button
              onClick={() => {
                if (medicines.length === PAGE_SIZE) {
                  setPage((p) => p + 1);
                }
              }}
              disabled={medicines.length < PAGE_SIZE}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </AppLayout>
  );
}

export default MedicinesPage;