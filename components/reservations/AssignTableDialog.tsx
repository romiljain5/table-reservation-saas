"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRestaurantStore } from "@/store/restaurantStore";
import { toast } from "sonner";
import useSound from "use-sound";

export function AssignTableDialog({ trigger, reservation }) {
  const [open, setOpen] = useState(false);
  const [tableId, setTableId] = useState("");
  const { restaurantId } = useRestaurantStore();

  const [play] = useSound("/sounds/success.mp3");
  const queryClient = useQueryClient();

  // Fetch tables
  const { data: tables = [] } = useQuery({
    queryKey: ["tables", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/tables?restaurantId=${restaurantId}`);
      return res.json();
    },
    enabled: !!restaurantId,
  });

  // Fetch reservations for table availability mapping
  const { data: reservations = [] } = useQuery({
    queryKey: ["reservations", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/reservations?restaurantId=${restaurantId}`);
      return res.json();
    },
    enabled: !!restaurantId,
  });

  // Build table status map (same as TableLayout)
  const tableStatusMap = useMemo(() => {
    const PRIORITY = { SEATED: 3, CONFIRMED: 2, PENDING: 1 };
    const map: any = {};

    reservations.forEach((r) => {
      if (!r.tableId) return;

      const newPriority = PRIORITY[r.status];
      const current = map[r.tableId];
      const currentPriority = current ? PRIORITY[current.status] : 0;

      if (newPriority > currentPriority) {
        map[r.tableId] = r.status;
      }
    });

    return map;
  }, [reservations]);

  const seatGuest = async () => {
    if (!tableId) {
      toast.error("Please select a table");
      return;
    }

    await fetch(`/api/reservations/${reservation.id}/seat`, {
      method: "PATCH",
      body: JSON.stringify({ tableId }),
    });

    queryClient.invalidateQueries(["reservations", restaurantId]);
    queryClient.invalidateQueries(["tables", restaurantId]);

    play();
    toast.success("Guest Seated");

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Table</DialogTitle>
          <DialogDescription>Select a table for this guest.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <label className="text-sm font-medium">Select a Table</label>
          <select
            className="w-full border rounded p-2"
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
          >
            <option value="">Select a table</option>

            {tables.map((table) => {
              const status = tableStatusMap[table.id] || "AVAILABLE";

              return (
                <option
                  key={table.id}
                  value={table.id}
                  disabled={status === "SEATED"}
                >
                  Table {table.name} — {table.seats} seats
                  {status !== "AVAILABLE" ? ` (${status})` : ""}
                </option>
              );
            })}
          </select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={seatGuest}
          >
            Seat Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
