"use client";

import { useRestaurantStore } from "@/store/restaurantStore";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EditTableModal from "./EditTableModal";

export default function TablesList() {
  const { restaurantId } = useRestaurantStore();

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ["tables", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/tables?restaurantId=${restaurantId}`);
      return res.json();
    },
    enabled: !!restaurantId,
  });

  if (!restaurantId) {
    return (
      <div className="p-6 text-sm text-slate-500 dark:text-neutral-400">
        Select a restaurant first.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-slate-500 dark:text-neutral-400">
        Loading tables...
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div classname="p-6 text-sm text-slate-500 dark:text-neutral-400">
        No tables added yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400">
          <tr className="border-b border-slate-200 dark:border-neutral-700">
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Seats</th>
            <th className="px-4 py-2 text-left">Section</th>
            <th className="px-4 py-2 text-left">Shape</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tables.map((table: any) => (
            <tr
              key={table.id}
              className="border-b border-slate-100 dark:border-neutral-800 hover:bg-slate-50/60 dark:hover:bg-neutral-800"
            >
              <td className="px-4 py-2 font-medium">{table.number}</td>
              <td className="px-4 py-2">{table.name}</td>
              <td className="px-4 py-2">{table.seats}</td>
              <td className="px-4 py-2">{table.section || "—"}</td>
              <td className="px-4 py-2 capitalize">{table.shape.toLowerCase()}</td>
              <td className="px-4 py-2">
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    table.status === "AVAILABLE" &&
                      "bg-emerald-50 text-emerald-700 border border-emerald-200",
                    table.status === "RESERVED" &&
                      "bg-amber-50 text-amber-700 border border-amber-200",
                    table.status === "OCCUPIED" &&
                      "bg-blue-50 text-blue-700 border border-blue-200",
                    table.status === "DIRTY" &&
                      "bg-rose-50 text-rose-700 border border-rose-200"
                  )}
                >
                  {table.status}
                </span>
              </td>

              {/* Edit/Delete placeholder */}
              <td className="px-4 py-2 text-right space-x-2">
                <EditTableModal table={table} />

                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
