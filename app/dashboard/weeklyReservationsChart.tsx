"use client";

import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyReservationsChart() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["reservations-weekly"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/weekly");
      return res.json();
    },
  });

  if (isLoading) return <p>Loading chart...</p>;

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">
        Weekly Reservation Trend
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Last 7 days performance
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100" />
          <XAxis dataKey="date" className="text-xs text-slate-500" />
          <YAxis className="text-xs text-slate-500" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="reservations"
            stroke="#111827"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
