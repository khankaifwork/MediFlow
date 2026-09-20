import type { DashboardReport } from "../../types/report";
import { DollarSign, ShoppingCart, Pill, Users, AlertTriangle } from "lucide-react";

type ReportCardsProps = {
  report: DashboardReport;
};

export default function ReportCards({ report }: ReportCardsProps) {
  const cards = [
    {
      title: "Gross Sales Revenue",
      value: `₹${Number(report.total_sales || 0).toFixed(2)}`,
      subtitle: "Total billed revenue to date",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200/60",
    },
    {
      title: "Drug Procurement Cost",
      value: `₹${Number(report.total_purchases || 0).toFixed(2)}`,
      subtitle: "Inventory acquisition outlay",
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200/60",
    },
    {
      title: "Catalog Medicines",
      value: report.total_medicines,
      subtitle: "Unique pharmaceuticals",
      icon: Pill,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200/60",
    },
    {
      title: "Patient Customers",
      value: report.total_customers,
      subtitle: "Registered profiles",
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200/60",
    },
    {
      title: "Low Stock Warnings",
      value: report.low_stock,
      subtitle: "Items below reorder limit",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-3xl border ${card.border} bg-white p-5 shadow-sm transition hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {card.title}
            </span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </div>

          <p className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
            {card.value}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}