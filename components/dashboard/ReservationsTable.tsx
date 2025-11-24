"use client";

import { useRestaurantStore } from "@/store/restaurantStore";
import { useQuery } from "@tanstack/react-query";

function statusChipClass(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "COMPLETED":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-100";
  }
}

export default function ReservationsTable() {
  const { restaurantId } = useRestaurantStore();

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ["reservations", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/reservations?restaurantId=${restaurantId}`);
      return res.json();
    },
    enabled: !!restaurantId, // fetch only when restaurant is selected
  });

  if (isLoading) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading reservations...
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        No reservations found for this restaurant.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50">
          <tr className="border-b border-slate-200">
            <th className="px-4 py-2">Reservation</th>
            <th className="px-4 py-2">Guest</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Restaurant</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res: any) => (
            <tr
              key={res.id}
              className="border-b border-slate-100 last:border-none hover:bg-slate-50/60"
            >
              <td className="px-4 py-2 font-mono text-[11px] uppercase">
                {res.id}
              </td>

              <td className="px-4 py-2">
                <div className="text-sm font-medium">{res.guestName}</div>
                <div className="text-xs text-slate-500">
                  Party of {res.partySize}
                </div>
              </td>

              <td className="px-4 py-2">
                {res.time} — {new Date(res.date).toLocaleDateString()}
              </td>

              <td className="px-4 py-2">
                {res.restaurant?.name || "Unknown"}
              </td>

              <td className="px-4 py-2">
                <span
                  className={
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium " +
                    statusChipClass(res.status)
                  }
                >
                  {res.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
