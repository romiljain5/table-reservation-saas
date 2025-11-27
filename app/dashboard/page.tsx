"use client";

import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/dashboard/StatCard";
import ReservationsTable from "@/components/dashboard/ReservationsTable";
import WeeklyReservationsChart from "./weeklyReservationsChart";
import SeatedNoShowChart from "./SeatedNoShowChart";
import RestaurantPerformanceChart from "./RestaurantPerformanceChart";
import HourlyHeatmapChart from "./HourlyHeatmapChart";

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
    <div className="space-y-10 p-6 bg-white dark:bg-neutral-900 text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">
          Live snapshot of reservations across all restaurants.
        </p>
      </header>

      {/* KPI Stats */}
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

      {/* Today's Reservations Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Today&apos;s Reservations</h2>
            <p className="text-xs text-slate-500">
              Upcoming parties across all locations.
            </p>
          </div>

          {/* Placeholder Search */}
          <input
            type="text"
            placeholder="Search guest • restaurant"
            className="h-9 w-56 rounded-md border border-slate-200 bg-white dark:bg-neutral-800 px-3 text-sm 
            focus:ring-2 focus:ring-slate-900/10 dark:border-neutral-700"
          />
        </div>

        <ReservationsTable />
      </section>

      {/* Analytics Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Analytics & Performance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeeklyReservationsChart />
          <SeatedNoShowChart />
          <RestaurantPerformanceChart />
          <HourlyHeatmapChart />
        </div>
      </section>
    </div>
  );
}
