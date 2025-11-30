"use client";

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useRestaurantStore } from "@/store/restaurantStore";

import { Clock, Check, Armchair, CheckCircle, X, Ban } from "lucide-react";
import { toast } from "sonner";
import useSound from "use-sound";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AssignTableDialog } from "../reservations/AssignTableDialog";
import { allowedActions } from "@/lib/reservationRules";

export default function StatusActions({ reservation }: { reservation: any }) {
  const queryClient = useQueryClient();
  const { restaurantId } = useRestaurantStore();
  const allowed = allowedActions(reservation.status);

  const [play] = useSound("/sounds/success.mp3");
  const updateStatus = async (status: string) => {
    try {
      const res = await fetch(`/api/reservations/${reservation.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();

      queryClient.invalidateQueries(["reservations", restaurantId]);
      play();
      toast.success(`Status updated to ${status.replace("_", " ")}`);
    } catch (error) {
      toast.error("Failed to update reservation");
    }
  };

  return (
    <div className="flex gap-1 flex-wrap">
      {/* PENDING */}
      <Button
        size="xs"
        className="bg-slate-100 text-slate-700 border border-slate-300 hover:cursor-pointer hover:bg-slate-200 px-1.5 py-1"
        disabled={reservation.status === "PENDING"}
        onClick={() => updateStatus("PENDING")}
      >
        <Clock className="w-3 h-3" /> Pending
      </Button>

      {/* CONFIRMED */}
      {allowed.includes("CONFIRM") && <Button
        size="xs"
        className="bg-emerald-100 text-emerald-700 border border-emerald-300 hover:cursor-pointer hover:bg-emerald-200 px-1.5 py-1"
        disabled={reservation.status === "CONFIRMED"}
        onClick={() => updateStatus("CONFIRMED")}
      >
        <Check className="w-3 h-3 " /> Confirmed
      </Button>}

      {/* SEATED */}

      {allowed.includes("SEAT") && <AssignTableDialog
        reservation={reservation}
        trigger={
          <Button
            size="xs"
            className="bg-indigo-100 text-indigo-700 border border-indigo-300 hover:cursor-pointer hover:bg-indigo-200 px-1.5 py-1"
            disabled={reservation.status === "SEATED"}
          >
            <Armchair className="w-3 h-3" /> Seat
          </Button>
        }
      />}

      {/* COMPLETED */}

      {allowed.includes("COMPLETED") && <ConfirmDialog
        title="Mark as Completed?"
        description="The reservation will be marked as completed."
        actionLabel="Complete Reservation"
        variantType="completed"
        onConfirm={() => updateStatus("COMPLETED")}
        trigger={
          <Button
            size="xs"
            className="bg-blue-100 text-blue-700 border border-blue-300 hover:cursor-pointer hover:bg-blue-200 px-1.5 py-1"
            disabled={reservation.status === "COMPLETED"}
          >
            <CheckCircle className="w-3 h-3 " /> Done
          </Button>
        }
      />}

      {/* CANCELLED */}
      {allowed.includes("CANCEL") && <ConfirmDialog
        title="Cancel Reservation?"
        description="This will cancel the reservation. This action cannot be undone."
        actionLabel="Cancel Reservation"
        variantType="cancel"
        onConfirm={() => updateStatus("CANCELLED")}
        trigger={
          <Button
            size="xs"
            className="bg-rose-100 text-rose-700 border border-rose-300 hover:cursor-pointer hover:bg-rose-200 px-1.5 py-1"
            disabled={reservation.status === "CANCELLED"}
          >
            <X className="w-3 h-3 " /> Cancel
          </Button>
        }
      />}

      {/* NO SHOW */}

      {allowed.includes("NO_SHOW") && <ConfirmDialog
        title="Mark as No-Show?"
        description="The guest will be marked as a no-show."
        actionLabel="Mark No-Show"
        variantType="no_show"
        onConfirm={() => updateStatus("NO_SHOW")}
        trigger={
          <Button
            size="xs"
            className="bg-amber-100 text-amber-700 border border-amber-300 hover:cursor-pointer hover:bg-amber-200 px-1.5 py-1"
            disabled={reservation.status === "NO_SHOW"}
          >
            <Ban className="w-3 h-3 " /> No-Show
          </Button>
        }
      />}
    </div>
  );
}
