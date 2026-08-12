import {
  Pill,
  Users,
  TriangleAlert,
  Receipt,
  IndianRupee,
} from "lucide-react";

import StatCard from "./StatCard";

type DashboardData = {
  total_medicines: number;
  total_customers: number;
  low_stock: number;
  today_sales: number;
  monthly_sales: number;
};

type DashboardGridProps = {
  dashboard: DashboardData;
};

function DashboardGrid({ dashboard }: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
      <StatCard
        title="Medicines"
        value={dashboard.total_medicines}
        icon={Pill}
        color="bg-blue-500"
      />

      <StatCard
        title="Customers"
        value={dashboard.total_customers}
        icon={Users}
        color="bg-green-500"
      />

      <StatCard
        title="Low Stock"
        value={dashboard.low_stock}
        icon={TriangleAlert}
        color="bg-red-500"
      />

      <StatCard
        title="Today's Sales"
        value={`₹${dashboard.today_sales}`}
        icon={Receipt}
        color="bg-orange-500"
      />

      <StatCard
        title="Monthly Sales"
        value={`₹${dashboard.monthly_sales}`}
        icon={IndianRupee}
        color="bg-emerald-500"
      />
    </div>
  );
}

export default DashboardGrid;