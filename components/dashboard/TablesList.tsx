"use client";

import { useRestaurantStore } from "@/store/restaurantStore";
import { useQuery } from "@tanstack/react-query";

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
    return <div className="p-6 text-slate-500">Select a restaurant first.</div>;
  }

  if (isLoading) {
    return <div className="p-6 text-slate-500">Loading tables...</div>;
  }

  if (tables.length === 0) {
    return <div className="p-6 text-slate-500">No tables added yet.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50">
          <tr className="border-b border-slate-200">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Seats</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table: any) => (
            <tr
              key={table.id}
              className="border-b border-slate-100 last:border-none hover:bg-slate-50/60"
            >
              <td className="px-4 py-2">{table.name}</td>
              <td className="px-4 py-2">{table.seats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
