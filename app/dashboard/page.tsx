"use client";

import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/dashboard/StatCard";
import ReservationsTable from "@/components/dashboard/ReservationsTable";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      return res.json();
    },
  });

  if (isLoading) return "Loading dashboard...";

  const stats = [
    {
      label: "Reservations Today",
      value: data?.reservationsToday ?? 0,
      sublabel: data?.resChangeToday ?? "",
    },
    {
      label: "Seated Guests",
      value: data?.seatedGuests ?? 0,
      sublabel: "Across all restaurants",
    },
    {
      label: "No-show Rate",
      value: `${data?.noShowRate ?? "0"}%`,
      sublabel: "Last 7 days",
    },
    {
      label: "Avg. Party Size",
      value: data?.avgPartySize ?? "-",
      sublabel: "Today",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-slate-500">
          Live snapshot of reservations across all restaurants.
        </p>
      </header>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            sublabel={stat.sublabel}
          />
        ))}
      </section>

      {/* Reservations Today */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Today&apos;s reservations</h2>
            <p className="text-xs text-slate-500">
              Upcoming parties across all locations.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search guest or restaurant..."
            className="h-9 w-56 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/5"
          />
        </div>

        <ReservationsTable />
      </section>
    </div>
  );
}
