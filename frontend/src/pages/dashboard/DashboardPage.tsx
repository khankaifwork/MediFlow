import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import DashboardGrid from "../../components/dashboard/DashboardGrid";
import { getDashboard } from "../../services/dashboard.service";
import { getMedicines } from "../../services/medicine.service";
import { useAuth } from "../../context/useAuth";
import type { Medicine } from "../../types/medicine";
import toast from "react-hot-toast";
import {
  Receipt,
  Plus,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Pill,
  Loader2,
  Calendar,
} from "lucide-react";

type DashboardData = {
  total_medicines: number;
  total_customers: number;
  low_stock: number;
  today_sales: number;
  monthly_sales: number;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [lowStockMeds, setLowStockMeds] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [dashData, meds] = await Promise.all([
        getDashboard(),
        getMedicines(0, 100),
      ]);
      setDashboard(dashData);
      setLowStockMeds(meds.filter((m) => m.stock <= 10));
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 md:p-8 text-white shadow-xl shadow-slate-950/10">
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                <Calendar className="h-4 w-4" />
                <span>{currentDate}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.full_name || "Doctor / Pharmacist"} 👋
              </h1>
              <p className="max-w-xl text-xs md:text-sm text-slate-300">
                Your pharmacy terminal is fully operational. Monitor dispensing rates, audit stock thresholds, and query Gemini AI.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/sales"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-teal-500/25 transition hover:bg-teal-400 active:scale-95"
              >
                <Receipt className="h-4 w-4" />
                <span>New POS Sale</span>
              </Link>

              <Link
                to="/medicines"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 backdrop-blur transition hover:bg-slate-700 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Add Medicine</span>
              </Link>

              <Link
                to="/ai"
                className="inline-flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2.5 text-xs font-bold text-teal-300 backdrop-blur transition hover:bg-teal-500/20 active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-teal-400 animate-pulse" />
                <span>AI Insights</span>
              </Link>
            </div>
          </div>
        </div>

        {loading || !dashboard ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-3" />
            <p className="text-sm font-semibold text-slate-700">Loading pharmacy operations data...</p>
          </div>
        ) : (
          <>
            {/* KPI Stat Cards Grid */}
            <DashboardGrid dashboard={dashboard} />

            {/* Operational Widgets Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Critical Stock Alert Widget */}
              <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Low Stock & Restock Alerts
                      </h3>
                      <p className="text-xs text-slate-500">
                        Medicines below threshold ({lowStockMeds.length} items flagged)
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/inventory"
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 transition"
                  >
                    <span>Full Inventory</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {lowStockMeds.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                    All medicines have healthy inventory levels (above minimum threshold).
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-100 divide-y divide-slate-100">
                    {lowStockMeds.slice(0, 5).map((med) => (
                      <div
                        key={med.id}
                        className="flex items-center justify-between p-3.5 hover:bg-slate-50/50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <Pill className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{med.name}</p>
                            <p className="text-xs text-slate-400">{med.manufacturer}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="rounded-full bg-red-50 border border-red-200/60 px-2.5 py-0.5 text-xs font-bold text-red-700">
                            {med.stock} units left
                          </span>
                          <Link
                            to="/purchases"
                            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                          >
                            Restock
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick AI & Automation Shortcut Card */}
              <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-900 to-slate-900 p-6 text-white shadow-lg shadow-teal-950/10 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-teal-400/20 px-3 py-1 text-xs font-bold text-teal-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Gemini AI Copilot</span>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight">
                    Instant Business Health Audit
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    MediFlow analyzes your revenue trends, prescription demand, and inventory velocity in real time.
                  </p>

                  <div className="rounded-2xl bg-white/5 p-4 border border-white/10 space-y-2 text-xs">
                    <p className="text-slate-300">⚡ Automated GST & Invoicing</p>
                    <p className="text-slate-300">🔍 Real-Time Drug Interaction Alerts</p>
                    <p className="text-slate-300">📊 Reorder Forecasts by Sales Pace</p>
                  </div>
                </div>

                <Link
                  to="/ai"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-400 py-3 text-xs font-bold text-slate-950 transition hover:bg-teal-300 active:scale-98"
                >
                  <span>Launch AI Assistant</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}