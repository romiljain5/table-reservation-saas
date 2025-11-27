"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRestaurantStore } from "@/store/restaurantStore";
import { cn } from "@/lib/utils";

export default function RestaurantsPage() {
  const { setRestaurant } = useRestaurantStore();

  const { data = [], isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await fetch("/api/restaurants");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Restaurants</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Manage your restaurant locations.
          </p>
        </div>

        <Link href="/dashboard/restaurants/new">
          <Button className="bg-slate-900 text-white hover:bg-slate-800">
            + Add Restaurant
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400">
            <tr className="border-b border-slate-200 dark:border-neutral-800">
              <th className="px-4 py-2 text-left">Restaurant</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Setup Progress</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((r: any) => {
              const initials = r.name[0]?.toUpperCase() ?? "R";
              const steps = { 1: "Info", 2: "Layout", 3: "Hours", 4: "Done" };
              const statusColor =
                r.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : r.status === "INACTIVE"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-slate-100 text-slate-600 border-slate-300";

              return (
                <tr
                  key={r.id}
                  className="border-b border-slate-100 dark:border-neutral-800 hover:bg-slate-50/60 dark:hover:bg-neutral-800 cursor-pointer transition"
                >
                  {/* Avatar + Name */}
                  <td
                    className="px-4 py-3 font-medium flex items-center gap-3"
                    onClick={() => setRestaurant(r.id, r.name)}
                  >
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-semibold">
                      {initials}
                    </div>
                    <Link
                      href={`/dashboard/restaurants/${r.id}`}
                      className="text-slate-800 dark:text-slate-100 hover:underline"
                    >
                      {r.name}
                    </Link>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {r.phone ?? "—"}
                  </td>

                  {/* Setup Progress */}
                  <td className="px-4 py-3 w-48">
                    <div className="w-full h-2 bg-slate-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${(r.setupStep / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {steps[r.setupStep]}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full border font-medium",
                        statusColor
                      )}
                    >
                      {r.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <Link
                      href={`/dashboard/restaurants/${r.id}/layout`}
                      className="text-indigo-600 hover:underline"
                    >
                      Layout
                    </Link>
                    <Link
                      href={`/dashboard/restaurants/${r.id}/staff`}
                      className="text-blue-600 hover:underline"
                    >
                      Staff
                    </Link>
                    <Link
                      href={`/dashboard/restaurants/${r.id}/hours`}
                      className="text-slate-700 hover:underline"
                    >
                      Hours
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
