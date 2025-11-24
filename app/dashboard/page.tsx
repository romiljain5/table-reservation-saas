// src/app/dashboard/page.tsx
import StatCard from "@/components/dashboard/StatCard";
import ReservationsTable from "@/components/dashboard/ReservationsTable";

export default function DashboardPage() {
  // Dummy data for now – later we’ll connect Prisma/API
  const stats = [
    {
      label: "Reservations Today",
      value: "32",
      sublabel: "+8 vs yesterday",
    },
    {
      label: "Seated Guests",
      value: "76",
      sublabel: "Across all locations",
    },
    {
      label: "No-show Rate",
      value: "3.8%",
      sublabel: "Last 7 days",
    },
    {
      label: "Avg. Party Size",
      value: "3.2",
      sublabel: "Today",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Overview
        </h1>
        <p className="text-sm text-slate-500">
          Live snapshot of reservations across all restaurants.
        </p>
      </div>

      {/* Stats grid */}
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

      {/* Today’s reservations table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Today&apos;s reservations</h2>
            <p className="text-xs text-slate-500">
              Upcoming parties across all locations.
            </p>
          </div>
          {/* Placeholder for filters/search, we’ll wire later */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search guest or restaurant..."
              className="h-9 w-56 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/5"
            />
          </div>
        </div>

        <ReservationsTable />
      </section>
    </div>
  );
}
