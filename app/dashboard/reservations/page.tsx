import ReservationsTable from "@/components/dashboard/ReservationsTable";
import Link from "next/link";
import AddReservationModal from "@/components/dashboard/AddReservationModal";

export default function ReservationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Reservations
          </h1>
          <p className="text-sm text-slate-500">
            View and manage upcoming reservations.
          </p>
        </div>
        <AddReservationModal />
      </div>

      <ReservationsTable />
    </div>
  );
}
