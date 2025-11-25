"use client";

import { cn } from "@/lib/utils";
import TableDetailsDialog from "./TableDetailsDialog";

const statusStyles = {
  AVAILABLE: "bg-emerald-100 text-emerald-700 border-emerald-300",
  RESERVED: "bg-amber-100 text-amber-700 border-amber-300",
  OCCUPIED: "bg-purple-100 text-purple-700 border-purple-300",
  DIRTY: "bg-rose-100 text-rose-700 border-rose-300",
};

export default function TableBox({ table, status, reservation }) {
  return (
    <TableDetailsDialog
      table={table}
      reservation={reservation}
      trigger={
        <div
          className={cn(
            "flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer shadow-sm hover:shadow-md transition",
            statusStyles[status]
          )}
        >
          <div className="text-lg font-semibold">Table {table.number}</div>
          <div className="text-sm opacity-80">Seats {table.capacity}</div>
          <div className="mt-1 text-xs font-medium">{status}</div>
        </div>
      }
    />
  );
}
