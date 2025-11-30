"use client";

import Link from "next/link";
import { useRestaurantStore } from "@/store/restaurantStore";
import { useQuery } from "@tanstack/react-query";
import EditReservationModal from "./EditReservationModal";
import StatusActions from "./StatusActions";
import SeatTimer from "@/components/reservations/SeatTimer";

const statusClasses: Record<string, string> = {
  CONFIRMED:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300",
  PENDING:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300",
  CANCELLED:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300",
  COMPLETED:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300",
  NO_SHOW:
    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300",
  SEATED:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300",
};

function getTimeZoneAbbrev(date: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "short",
  }).formatToParts(date);

  const tzPart = parts.find((p) => p.type === "timeZoneName");
  return tzPart ? tzPart.value : "";
}

function formatTime(date: string, time: string, tz: string) {
  const dateOnly = date.split("T")[0];
  const fullDate = new Date(`${dateOnly}T${time}:00`);

  const formatted = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
  }).format(fullDate);

  const abbrev = getTimeZoneAbbrev(fullDate, tz);

  return `${formatted} ${abbrev}`;
}

function formatDate(date: string, tz: string) {
  const dateOnly = date.split("T")[0];

  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateOnly));
}

export default function ReservationsTable({ search }: { search?: string }) {
  const { restaurantId } = useRestaurantStore();

  const {
    data: reservations = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reservations", restaurantId, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (restaurantId) params.set("restaurantId", restaurantId);
      if (search) params.set("search", search);

      const res = await fetch(`/api/reservations?${params.toString()}`);
      return res.json();
    },
    enabled: !!restaurantId,
    staleTime: 0,
  });

  if (!restaurantId)
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        Select a restaurant first.
      </div>
    );

  if (isLoading)
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        Loading reservations...
      </div>
    );

  if (reservations.length === 0)
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        No reservations found.
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="sticky top-0 bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Party</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Restaurant</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
            <th className="px-4 py-3 text-center">Edit</th>
          </tr>
        </thead>

        <tbody>
          {reservations.map((res: any) => (
            <tr
              key={res.id}
              className="border-b border-slate-100 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-700 transition"
            >
              <td className="px-4 py-3 font-medium">
                <Link
                  href={`/dashboard/customers/${res.customerId ?? ""}`}
                  className="text-slate-900 dark:text-slate-100 hover:underline"
                >
                  {res.guestName}
                </Link>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {res.phone}
                </div>
              </td>

              <td className="px-4 py-3 text-center">{res.partySize}</td>

              <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1">
                  <span>
                    {formatTime(res.date, res.time, res.restaurant.timeZone)}
                  </span>
                  <span className="mx-1 opacity-50">•</span>
                  <span className="opacity-80">
                    {formatDate(res.date, res.restaurant.timeZone)}
                  </span>
                </div>
              </td>

              <td className="px-4 py-3">{res.restaurant?.name}</td>

              <td className="px-4 py-3 text-center space-y-1">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    statusClasses[res.status]
                  }`}
                >
                  {res.status}
                </span>

                {res.status === "SEATED" && (
                  <SeatTimer seatedAt={res.seatedAt} />
                )}
              </td>

              <td className="px-4 py-3 text-center space-y-1">
                <div className="flex justify-center gap-2 pt-1">
                  <StatusActions reservation={res} />
                </div>
              </td>

              <td className="px-4 py-3 text-center space-y-1">
                <div className="flex justify-center gap-2 pt-1">
                  <EditReservationModal reservation={res} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
