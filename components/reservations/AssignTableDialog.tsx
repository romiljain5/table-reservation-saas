"use client";

import { useState } from "react";
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

export function AssignTableDialog({ trigger, reservation }: any) {
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
  });

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
          <DialogDescription>
            Choose a table to seat the guest.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <label className="text-sm font-medium">Select a Table</label>
          <select
            className="w-full border rounded p-2"
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
          >
            <option value="">Select table</option>
            {tables.map((table: any) => (
              <option key={table.id} value={table.id}>
                Table {table.number} — {table.capacity} seats
              </option>
            ))}
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
