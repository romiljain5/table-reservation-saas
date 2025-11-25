"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRestaurantStore } from "@/store/restaurantStore";
import { toast } from "sonner";

export default function ChangeTableDialog({ reservation, trigger }) {
  const { restaurantId } = useRestaurantStore();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [newTableId, setNewTableId] = useState("");

  const { data: tables = [] } = useQuery({
    queryKey: ["tables", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/tables?restaurantId=${restaurantId}`);
      return res.json();
    },
    enabled: !!restaurantId,
  });

  const handleMove = async () => {
    if (!newTableId) return;

    await fetch(`/api/reservations/${reservation.id}/move`, {
      method: "PATCH",
      body: JSON.stringify({ newTableId }),
    });

    toast.success("Table reassigned successfully!");

    queryClient.invalidateQueries(["reservations", restaurantId]);
    queryClient.invalidateQueries(["tables", restaurantId]);

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Table</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <label className="text-sm font-medium">Select new table</label>
          <select
            className="w-full mt-2 border rounded-md px-3 py-2"
            value={newTableId}
            onChange={(e) => setNewTableId(e.target.value)}
          >
            <option value="">Choose table</option>

            {tables.map((t) => (
              <option
                key={t.id}
                value={t.id}
                disabled={t.id === reservation.tableId}
              >
                Table {t.number} — seats {t.seats}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={handleMove}
            disabled={!newTableId}
          >
            Move Table
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
