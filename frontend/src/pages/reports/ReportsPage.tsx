import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import ReportCards from "../../components/reports/ReportCards";
import RevenueChart from "../../components/reports/charts/RevenueChart";

import {
  getDashboardReport,
  getRevenueTrend,
} from "../../services/report.service";

import type { DashboardReport } from "../../types/report";

type RevenueData = {
  date: string;
  revenue: number;
};

function ReportsPage() {
  const [report, setReport] =
    useState<DashboardReport | null>(null);

  const [revenueData, setRevenueData] =
    useState<RevenueData[]>([]);

  async function loadReports() {
    try {
      const dashboard =
        await getDashboardReport();

      const revenue =
        await getRevenueTrend();

      setReport(dashboard);
      setRevenueData(revenue);

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  if (!report) {
    return (
      <AppLayout>
        <h1 className="text-3xl font-bold">
          Reports
        </h1>

        <p className="mt-6">
          Loading...
        </p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      <h1 className="mb-6 text-3xl font-bold text-red-600">
    🚨 TEST REPORT PAGE 🚨
</h1>

      <ReportCards report={report} />

      <div className="mt-8">

        <RevenueChart
          data={revenueData}
        />

      </div>

    </AppLayout>
  );
}

export default ReportsPage;