"use client";

import { useRestaurantStore } from "@/store/restaurantStore";
import { useQuery } from "@tanstack/react-query";
import TableBox from "./TableBox";
import TableLegend from "./TableLegend";

export default function TableLayout() {
  const { restaurantId } = useRestaurantStore();

  const { data: tables = [] } = useQuery({
    queryKey: ["tables", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/tables?restaurantId=${restaurantId}`);
      return res.json();
    },
    enabled: !!restaurantId,
  });

  const { data: reservations = [] } = useQuery({
    queryKey: ["reservations", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/reservations?restaurantId=${restaurantId}`);
      return res.json();
    },
    enabled: !!restaurantId,
  });

  // Priority mapping (highest wins)
  const PRIORITY = {
    SEATED: 3,
    CONFIRMED: 2,
    PENDING: 1,
  };

  // Map: tableId → { status: "OCCUPIED"/"RESERVED", reservation: object }
  const tableStatusMap = {};

  reservations.forEach((r) => {
    if (!r.tableId) return;

    const newPriority = PRIORITY[r.status];
    const current = tableStatusMap[r.tableId];
    const currentPriority = current ? PRIORITY[current.reservation.status] : 0;

    // Only replace if higher priority
    if (newPriority > currentPriority) {
      tableStatusMap[r.tableId] = {
        status:
          r.status === "SEATED"
            ? "OCCUPIED"
            : r.status === "CONFIRMED" || r.status === "PENDING"
            ? "RESERVED"
            : "AVAILABLE",
        reservation: r,
      };
    }
  });

  return (
      <div>
        <TableLegend />

        <div className="grid grid-cols-4 gap-4 mt-6">
          {tables.map((table) => {
            const mapped = tableStatusMap[table.id];

            return (
              <TableBox
                key={table.id}
                table={table}
                status={mapped?.status || "AVAILABLE"}
                reservation={mapped?.reservation || null}
              />
            );
          })}
        </div>
      </div>
  );
}
