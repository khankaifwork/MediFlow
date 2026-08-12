import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import DashboardGrid from "../../components/dashboard/DashboardGrid";

import { getDashboard } from "../../services/dashboard.service";

type DashboardData = {
  total_medicines: number;
  total_customers: number;
  low_stock: number;
  today_sales: number;
  monthly_sales: number;
};

function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function loadDashboard() {
  try {
    const data = await getDashboard();

    console.log("Dashboard API Response:", data);

    setDashboard(data);
  } catch (error) {
    console.error("Dashboard Error:", error);
  }
}

    loadDashboard();
  }, []);

  if (!dashboard) {
    return (
      <AppLayout>
        <h1 className="text-2xl font-bold">Loading...</h1>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 className="mb-6 text-3xl font-bold">
        Dashboard
      </h1>

      <DashboardGrid dashboard={dashboard} />
    </AppLayout>
  );
}

export default DashboardPage;