"use client";

import { useState } from "react";
import ReservationsTable from "@/components/dashboard/ReservationsTable";
import AddReservationModal from "@/components/dashboard/AddReservationModal";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

export default function ReservationsPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const handleSearch = () => {
    queryClient.invalidateQueries(["reservations", { search }]);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Reservations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and manage upcoming reservations.
          </p>
        </div>

        <AddReservationModal />
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-white dark:bg-neutral-900 shadow-sm p-4 flex gap-3 items-center">
        <Input
          type="text"
          placeholder="Search by guest or phone..."
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="px-3 py-2 bg-slate-900 text-white rounded-md text-sm"
        >
          Search
        </button>
      </div>

      {/* Table Output */}
      <ReservationsTable search={search} />
    </div>
  );
}
