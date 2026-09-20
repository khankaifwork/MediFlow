import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  trend?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass,
  bgClass,
  borderClass,
  trend,
}: StatCardProps) {
  return (
    <div
      className={`rounded-3xl border ${borderClass} bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${bgClass} ${colorClass} shadow-sm`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {value}
        </h2>
        <div className="mt-1 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
          {trend && (
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}