"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function SeatedNoShowChart() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["seated-noshow-weekly"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/seated-noshow");
      return res.json();
    }
  });

  if (isLoading) return <p>Loading chart...</p>;

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">
        Seated vs No-Show Trend
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Guest arrival performance (last 7 days)
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100" />
          <XAxis dataKey="date" className="text-xs text-slate-500" />
          <YAxis className="text-xs text-slate-500" />
          <Tooltip />
          <Legend />
          <Bar name="Seated" dataKey="seated" stackId="a" fill="#10b981" />
          <Bar name="No-Show" dataKey="noShow" stackId="a" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
