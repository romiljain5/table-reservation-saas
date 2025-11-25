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
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { useRestaurantStore } from "@/store/restaurantStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useSound from "use-sound";

const tableSchema = z.object({
  name: z.string().min(1, "Table name is required"),
  seats: z.number().min(1, "Seats must be at least 1"),
  number: z.number().min(1, "Seats must be at least 1"),
});

export default function AddTableModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { restaurantId } = useRestaurantStore();
  const [play] = useSound("/sounds/success.mp3");

  const form = useForm({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      name: "",
      seats: 2,
    },
  });

  const onSubmit = async (values: any) => {
    try {
      await fetch("/api/tables", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          restaurantId,
        }),
      });
      play();
      toast.success("Table added successfully!");
      // Refresh table list
      queryClient.invalidateQueries(["tables", restaurantId]);

      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to add table");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 text-white">Add Table</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Table</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Table Name */}
          <div>
            <label className="block text-sm font-medium">Table Name</label>
            <Input {...form.register("name")} placeholder="Table 1" />
          </div>

          {/* Seats */}
          <div>
            <label className="block text-sm font-medium">Seats</label>
            <Input
              type="number"
              min={1}
              {...form.register("seats", { valueAsNumber: true })}
            />
          </div>


          {/* number */}
          <div>
            <label className="block text-sm font-medium">Table Number</label>
            <Input
              type="number"
              min={1}
              {...form.register("number", { valueAsNumber: true })}
            />
          </div>

          <Button type="submit" className="w-full bg-slate-900 text-white">
            Create Table
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
