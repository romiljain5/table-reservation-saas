"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";

export default function HourlyHeatmapChart() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["hourly-heatmap"],
    queryFn: async () =>
      fetch("/api/dashboard/hourly-heatmap").then((res) => res.json())
  });

  if (isLoading) return <p>Loading heatmap...</p>;

  // Color scale based on volume
  const maxCount = Math.max(...data.map((d: any) => d.count), 1);
  const getColor = (value: number) => {
    const intensity = value / maxCount;
    return `rgba(99, 102, 241, ${0.2 + intensity * 0.8})`; // Indigo shade
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Peak Dining Hours</h2>
      <p className="text-xs text-slate-500 mb-4">
        Reservation volume by hour — last 7 days
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="hour" className="text-xs text-slate-500" />
          <Tooltip />
          <Bar dataKey="count">
            {data.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor(entry.count)}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
