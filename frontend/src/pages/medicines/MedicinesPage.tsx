import { useEffect, useState, useCallback } from "react";
import AppLayout from "../../components/layout/AppLayout";
import MedicineTable from "../../components/medicines/MedicineTable";
import MedicineForm from "../../components/medicines/MedicineForm";
import SearchBar from "../../components/medicines/SearchBar";
import {
  getMedicines,
  deleteMedicine,
  searchMedicines,
} from "../../services/medicine.service";
import type { Medicine } from "../../types/medicine";
import toast from "react-hot-toast";
import { Pill, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const PAGE_SIZE = 10;

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const loadMedicines = useCallback(async (currentPage: number) => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * PAGE_SIZE;
      const data = await getMedicines(skip, PAGE_SIZE);
      setMedicines(data);
    } catch (error) {
      console.error("Error loading medicines:", error);
      toast.error("Failed to load medicines list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedicines(page);
  }, [loadMedicines, page]);

  async function handleSearch(value: string) {
    setSearch(value);

    if (value.trim() === "") {
      loadMedicines(1);
      setPage(1);
      return;
    }

    try {
      const data = await searchMedicines(value.trim());
      setMedicines(data);
    } catch (error) {
      console.error(error);
      toast.error("Search query failed.");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await deleteMedicine(id);
      toast.success("Medicine deleted successfully!");
      if (selectedMedicine?.id === id) {
        setSelectedMedicine(null);
      }
      loadMedicines(page);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete medicine.");
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Pharmaceutical Formulary & Catalog
              </h1>
              <p className="text-xs text-slate-500">
                Comprehensive directory of drugs, prices, batch levels, and prescription constraints
              </p>
            </div>
          </div>
        </div>

        <SearchBar value={search} onChange={handleSearch} />

        <MedicineForm
          medicine={selectedMedicine}
          onMedicineAdded={() => {
            loadMedicines(page);
            setSelectedMedicine(null);
          }}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-16 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-2" />
            <p className="text-sm font-semibold text-slate-600">Retrieving medicines...</p>
          </div>
        ) : (
          <>
            <MedicineTable
              medicines={medicines}
              onEdit={(medicine) => {
                setSelectedMedicine(medicine);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onDelete={handleDelete}
            />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 rounded-2xl shadow-sm">
              <p className="text-xs text-slate-500 font-medium">
                Showing page <span className="font-bold text-slate-800">{page}</span> ({medicines.length} records shown)
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                <button
                  onClick={() => {
                    if (medicines.length === PAGE_SIZE) {
                      setPage((p) => p + 1);
                    }
                  }}
                  disabled={medicines.length < PAGE_SIZE}
                  className="inline-flex items-center gap-1 rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition disabled:opacity-40"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}