"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useRestaurantStore } from "@/store/restaurantStore";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

const schema = z.object({
  guestName: z.string().min(2),
  phone: z.string().min(10),
  partySize: z.number().min(1),
  date: z.string(),
  time: z.string(),
  status: z.string(),
});

export default function EditReservationModal({
  reservation,
}: {
  reservation: any;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { restaurantId } = useRestaurantStore();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      guestName: reservation.guestName,
      phone: reservation.phone,
      partySize: reservation.partySize,
      date: reservation.date.split("T")[0],
      time: reservation.time,
      status: reservation.status,
    },
  });

  const onSubmit = async (values: any) => {
    await fetch(`/api/reservations/${reservation.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...values,
        restaurantId,
      }),
    });

    queryClient.invalidateQueries(["reservations", restaurantId]);

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-xs">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Reservation</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Guest Name */}
          <div>
            <label className="block text-sm font-medium">Guest Name</label>
            <Input {...form.register("guestName")} />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <Input {...form.register("phone")} />
          </div>

          {/* Party Size */}
          <div>
            <label className="block text-sm font-medium">Party Size</label>
            <Input
              type="number"
              {...form.register("partySize", { valueAsNumber: true })}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium">Date</label>
            <Input type="date" {...form.register("date")} />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium">Time</label>
            <Input type="time" {...form.register("time")} />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <Select
              defaultValue={reservation.status}
              onValueChange={(value) => form.setValue("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="SEATED">Seated</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="NO_SHOW">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-slate-900 text-white">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
