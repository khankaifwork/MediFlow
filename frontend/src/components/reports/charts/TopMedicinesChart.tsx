import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type TopMedicinesChartProps = {
  data: {
    medicine_name: string;
    quantity_sold: number;
  }[];
};

export default function TopMedicinesChart({ data }: TopMedicinesChartProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">Top Dispensed Medicines</h3>
        <p className="text-xs text-slate-500">Highest unit volume sold by drug</p>
      </div>

      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No sales data available yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="medicine_name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#334155", fontSize: 11 }}
                width={120}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg text-xs">
                        <p className="font-bold text-slate-900">{row.medicine_name}</p>
                        <p className="text-teal-600 font-semibold">{row.quantity_sold} units dispensed</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="quantity_sold" fill="#0ea5e9" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
