"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const reservationSchema = z.object({
  guestName: z.string().min(2, "Guest name is required"),
  phone: z.string().min(10, "Phone number is required"),
  partySize: z.number().min(1, "Party size must be at least 1"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  restaurantId: z.string().min(1, "Restaurant is required"),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

export default function AddReservationModal() {
  const [open, setOpen] = useState(false);

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const res = await fetch("/api/restaurants");
        const data = await res.json();
        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load restaurants", error);
      }
    }

    loadRestaurants();
  }, []);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guestName: "",
      phone: "",
      partySize: 2,
      date: "",
      time: "",
      restaurantId: "",
    },
  });

  const onSubmit = async (values: ReservationFormValues) => {
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to create reservation");

      setOpen(false);
      form.reset();
      // Optional: trigger table refresh, optimistic UI, toast notifications
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 text-white hover:bg-slate-800">
          Add Reservation
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Reservation</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            {/* Guest Name */}
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Party Size */}
            <FormField
              control={form.control}
              name="partySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party Size</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Restaurant Selector */}
            <FormField
              control={form.control}
              name="restaurantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select restaurant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* TODO: Replace with DB data later */}
                      {loading ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        restaurants.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-slate-900 text-white hover:bg-slate-800"
            >
              Create Reservation
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
