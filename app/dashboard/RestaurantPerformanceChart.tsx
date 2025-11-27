"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList
} from "recharts";

export default function RestaurantPerformanceChart() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["reservations-by-restaurant"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/reservations-by-restaurant");
      return res.json();
    }
  });

  if (isLoading) return <p>Loading chart...</p>;

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Restaurant Performance</h2>
      <p className="text-xs text-slate-500 mb-4">
        Total reservations in the last 7 days
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100" />
          <XAxis dataKey="name" className="text-xs text-slate-500" />
          <YAxis className="text-xs text-slate-500" />
          <Tooltip />
          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="count" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
