"use client";

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useRestaurantStore } from "@/store/restaurantStore";

export default function StatusActions({ reservation }: { reservation: any }) {
  const queryClient = useQueryClient();
  const { restaurantId } = useRestaurantStore();

  const updateStatus = async (status: string) => {
    await fetch(`/api/reservations/${reservation.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    queryClient.invalidateQueries(["reservations", restaurantId]);
  };

  return (
    <div className="flex gap-1 flex-wrap">

      {/* PENDING */}
      <Button
        size="xs"
        className="bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 px-2"
        disabled={reservation.status === "PENDING"}
        onClick={() => updateStatus("PENDING")}
      >
        Pending
      </Button>

      {/* CONFIRMED */}
      <Button
        size="xs"
        className="bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200 px-2"
        disabled={reservation.status === "CONFIRMED"}
        onClick={() => updateStatus("CONFIRMED")}
      >
        Confirmed
      </Button>

      {/* SEATED */}
      <Button
        size="xs"
        className="bg-indigo-100 text-indigo-700 border border-indigo-300 hover:bg-indigo-200 px-2"
        disabled={reservation.status === "SEATED"}
        onClick={() => updateStatus("SEATED")}
      >
        Seat
      </Button>

      {/* COMPLETED */}
      <Button
        size="xs"
        className="bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 px-2"
        disabled={reservation.status === "COMPLETED"}
        onClick={() => updateStatus("COMPLETED")}
      >
        Done
      </Button>

      {/* CANCELLED */}
      <Button
        size="xs"
        className="bg-rose-100 text-rose-700 border border-rose-300 hover:bg-rose-200 px-2"
        disabled={reservation.status === "CANCELLED"}
        onClick={() => updateStatus("CANCELLED")}
      >
        Cancel
      </Button>

      {/* NO SHOW */}
      <Button
        size="xs"
        className="bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200 px-2"
        disabled={reservation.status === "NO_SHOW"}
        onClick={() => updateStatus("NO_SHOW")}
      >
        No-Show
      </Button>

    </div>
  );
}
