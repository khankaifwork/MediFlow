import { useEffect, useState, useCallback } from "react";
import AppLayout from "../../components/layout/AppLayout";
import ReportCards from "../../components/reports/ReportCards";
import RevenueChart from "../../components/reports/charts/RevenueChart";
import TopMedicinesChart from "../../components/reports/charts/TopMedicinesChart";
import {
  getDashboardReport,
  getRevenueTrend,
  getTopMedicines,
  getTopCustomers,
} from "../../services/report.service";
import type { DashboardReport } from "../../types/report";
import toast from "react-hot-toast";
import { BarChart3, Download, UserCheck, Loader2 } from "lucide-react";

type RevenueData = {
  date: string;
  revenue: number;
};

type TopMedicineData = {
  medicine_name: string;
  quantity_sold: number;
};

type TopCustomerData = {
  customer_name: string;
  total_orders: number;
  total_spent: number;
};

export default function ReportsPage() {
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [topMedicines, setTopMedicines] = useState<TopMedicineData[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomerData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const [dash, rev, meds, custs] = await Promise.all([
        getDashboardReport(),
        getRevenueTrend(),
        getTopMedicines(),
        getTopCustomers(),
      ]);

      setReport(dash);
      setRevenueData(rev);
      setTopMedicines(meds);
      setTopCustomers(custs);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load executive analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  function exportReportSummary() {
    if (!report) return;
    const summaryData = [
      ["Metric", "Value"],
      ["Total Gross Sales", `₹${report.total_sales}`],
      ["Total Purchases", `₹${report.total_purchases}`],
      ["Total Medicines", report.total_medicines],
      ["Total Customers", report.total_customers],
      ["Low Stock Warnings", report.low_stock],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      summaryData.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mediflow_executive_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Executive CSV Report downloaded!");
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Executive Reports & Business Intelligence
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Financial auditing, dispensing velocity, inventory health, and customer profitability
            </p>
          </div>

          <button
            onClick={exportReportSummary}
            disabled={!report}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition active:scale-95 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>Export Financial CSV</span>
          </button>
        </div>

        {loading || !report ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-3" />
            <p className="text-sm font-semibold text-slate-700">Compiling executive analytics...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <ReportCards report={report} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <RevenueChart data={revenueData} />
              <TopMedicinesChart data={topMedicines} />
            </div>

            {/* Top Customers Section */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Most Active Patients & Buyers</h3>
                  <p className="text-xs text-slate-500">Patients ranked by lifetime dispensing spend</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/80">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3 text-left">Customer</th>
                      <th className="px-5 py-3 text-center">Prescriptions / Orders</th>
                      <th className="px-5 py-3 text-right">Lifetime Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-sm">
                    {topCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-xs text-slate-400">
                          No customer purchase history available
                        </td>
                      </tr>
                    ) : (
                      topCustomers.map((c, i) => (
                        <tr key={c.customer_name} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3.5 flex items-center gap-2.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-xs font-bold text-teal-700">
                              #{i + 1}
                            </span>
                            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                              <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                              {c.customer_name}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center text-xs font-semibold text-slate-600">
                            {c.total_orders} orders
                          </td>
                          <td className="px-5 py-3.5 text-right font-bold text-teal-700">
                            ₹{c.total_spent.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}