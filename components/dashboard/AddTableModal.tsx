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
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRestaurantStore } from "@/store/restaurantStore";
import { useQueryClient } from "@tanstack/react-query";
import useSound from "use-sound";

const tableSchema = z.object({
  name: z.string().min(1, "Table name is required"),
  seats: z.number().min(1, "Seats must be at least 1"),
  number: z.number().min(1, "Table number must be at least 1"),
  section: z.string().optional(),
  shape: z.enum(["RECTANGLE", "CIRCLE"]).default("RECTANGLE"),
});

export default function AddTableModal() {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const { restaurantId } = useRestaurantStore();
  const [play] = useSound("/sounds/success.mp3");

  const form = useForm({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      name: "",
      number: 1,
      seats: 2,
      section: "",
      shape: "RECTANGLE",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/tables", {
        method: "POST",
        body: JSON.stringify({ ...values, restaurantId }),
      });

      if (!res.ok) {
        toast.error("Failed to add table");
        return;
      }

      play();
      toast.success("Table added successfully!");
      queryClient.invalidateQueries(["tables", restaurantId]);
      setOpen(false);
      form.reset();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 text-white">Add Table</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md dark:bg-neutral-900 dark:text-neutral-100">
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Table Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input
              {...form.register("name")}
              placeholder="Window Table"
              className="dark:bg-neutral-800"
            />
          </div>

          {/* Table Number */}
          <div>
            <label className="block text-sm font-medium">Table Number</label>
            <Input
              type="number"
              min={1}
              {...form.register("number", { valueAsNumber: true })}
              className="dark:bg-neutral-800"
            />
          </div>

          {/* Seats */}
          <div>
            <label className="block text-sm font-medium">Seats</label>
            <Input
              type="number"
              min={1}
              {...form.register("seats", { valueAsNumber: true })}
              className="dark:bg-neutral-800"
            />
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium">Section (Optional)</label>
            <Input
              {...form.register("section")}
              placeholder="Patio, Balcony..."
              className="dark:bg-neutral-800"
            />
          </div>

          {/* Shape */}
          <div>
            <label className="block text-sm font-medium">Shape</label>
            <select
              {...form.register("shape")}
              className="border rounded px-3 py-2 w-full dark:bg-neutral-800 dark:border-neutral-700"
            >
              <option value="RECTANGLE">Rectangle</option>
              <option value="CIRCLE">Circle</option>
            </select>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-slate-900 text-white hover:bg-slate-800"
          >
            {isSaving ? "Saving..." : "Create Table"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
