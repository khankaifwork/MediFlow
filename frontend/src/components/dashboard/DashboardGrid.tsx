import {
  Pill,
  Users,
  AlertTriangle,
  Receipt,
  TrendingUp,
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

export default function DashboardGrid({ dashboard }: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Today's Revenue"
        value={`₹${Number(dashboard.today_sales || 0).toFixed(2)}`}
        subtitle="Gross daily billing"
        trend="+14% vs avg"
        icon={Receipt}
        colorClass="text-emerald-600"
        bgClass="bg-emerald-50"
        borderClass="border-emerald-200/60"
      />

      <StatCard
        title="Monthly Revenue"
        value={`₹${Number(dashboard.monthly_sales || 0).toFixed(2)}`}
        subtitle="Current month to date"
        trend="On target"
        icon={TrendingUp}
        colorClass="text-teal-600"
        bgClass="bg-teal-50"
        borderClass="border-teal-200/60"
      />

      <StatCard
        title="Total Medicines"
        value={dashboard.total_medicines}
        subtitle="Formulary items"
        icon={Pill}
        colorClass="text-blue-600"
        bgClass="bg-blue-50"
        borderClass="border-blue-200/60"
      />

      <StatCard
        title="Patient Customers"
        value={dashboard.total_customers}
        subtitle="Active patient accounts"
        icon={Users}
        colorClass="text-purple-600"
        bgClass="bg-purple-50"
        borderClass="border-purple-200/60"
      />

      <StatCard
        title="Low Stock Warning"
        value={dashboard.low_stock}
        subtitle={dashboard.low_stock > 0 ? "Urgent reorder needed" : "Inventory healthy"}
        trend={dashboard.low_stock > 0 ? "Action Required" : "Optimal"}
        icon={AlertTriangle}
        colorClass={dashboard.low_stock > 0 ? "text-red-600" : "text-slate-400"}
        bgClass={dashboard.low_stock > 0 ? "bg-red-50" : "bg-slate-50"}
        borderClass={dashboard.low_stock > 0 ? "border-red-200/80" : "border-slate-200/60"}
      />
    </div>
  );
}