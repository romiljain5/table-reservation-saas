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

const tableSchema = z.object({
  name: z.string().min(1, "Table name is required"),
  seats: z.number().min(1, "Seats must be at least 1"),
});

export default function AddTableModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { restaurantId } = useRestaurantStore();

  const form = useForm({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      name: "",
      seats: 2,
    },
  });

  const onSubmit = async (values: any) => {
    await fetch("/api/tables", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        restaurantId,
      }),
    });

    // Refresh table list
    queryClient.invalidateQueries(["tables", restaurantId]);

    setOpen(false);
    form.reset();
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

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-4"
        >
          {/* Table Name */}
          <div>
            <label className="block text-sm font-medium">Table Name</label>
            <Input
              {...form.register("name")}
              placeholder="Table 1"
            />
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

          <Button type="submit" className="w-full bg-slate-900 text-white">
            Create Table
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
