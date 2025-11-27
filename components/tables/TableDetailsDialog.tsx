"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import SeatTimer from "@/components/reservations/SeatTimer";
import { useQueryClient } from "@tanstack/react-query";
import { useRestaurantStore } from "@/store/restaurantStore";
import ChangeTableDialog from "./ChangeTableDialog";

export default function TableDetailsDialog({ table, trigger, reservation }) {
  const queryClient = useQueryClient();
  const { restaurantId } = useRestaurantStore();

  const updateStatus = async (status: string) => {
    if (!reservation) return;

    await fetch(`/api/reservations/${reservation.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    queryClient.invalidateQueries(["reservations", restaurantId]);
    queryClient.invalidateQueries(["tables", restaurantId]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="dialog-content max-w-md">
        <DialogHeader>
          <DialogTitle>
            Table {table.number} — Seats {table.seats}
          </DialogTitle>
        </DialogHeader>

        {reservation ? (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-md border">
              <div className="text-sm font-medium">{reservation.guestName}</div>
              <div className="text-xs text-slate-500">
                Party of {reservation.partySize}
              </div>
              <div className="text-xs text-slate-500">
                {reservation.time} • {new Date(reservation.date).toDateString()}
              </div>
            </div>

            {/* Timer when seated */}
            {reservation.status === "SEATED" && (
              <div>
                <SeatTimer seatedAt={reservation.seatedAt} />
              </div>
            )}

            <div className="flex gap-2">
              {reservation.status !== "SEATED" && (
                <Button
                  onClick={() => updateStatus("SEATED")}
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Seat Guest
                </Button>
              )}

              {reservation.status === "SEATED" && (
                <Button
                  onClick={() => updateStatus("COMPLETED")}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Complete
                </Button>
              )}

              <ChangeTableDialog
                reservation={reservation}
                trigger={<Button variant="secondary">Change Table</Button>}
              />

              <Button
                variant="destructive"
                onClick={() => updateStatus("CANCELLED")}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500 mt-2">
            No active reservation for this table.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
