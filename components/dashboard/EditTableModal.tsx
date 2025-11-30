"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditTableModal({ table }: { table: any }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [number, setNumber] = useState(table.number);
  const [name, setName] = useState(table.name ?? "");
  const [seats, setSeats] = useState(table.seats);
  const [section, setSection] = useState(table.section ?? "");
  const [status, setStatus] = useState(table.status);
  const [shape, setShape] = useState(table.shape);

  const handleSave = async () => {
    await fetch(`/api/tables/${table.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number,
        name,
        seats,
        section,
        status,
        shape,
      }),
    });
    setOpen(false);

    // 🔥 Instantly refresh UI
    queryClient.invalidateQueries({
      queryKey: ["tables", table.restaurantId],
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Table</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Table Number */}
          <Input
            type="number"
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
            placeholder="Table Number"
          />

          {/* Table Name */}
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Table Name (optional)"
          />

          {/* Seats */}
          <Input
            type="number"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            placeholder="Seats"
          />

          {/* Section */}
          <Input
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="Section (ex: Patio, Bar)"
          />

          {/* Status Dropdown */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
              <SelectItem value="RESERVED">RESERVED</SelectItem>
              <SelectItem value="OCCUPIED">OCCUPIED</SelectItem>
              <SelectItem value="DIRTY">DIRTY</SelectItem>
            </SelectContent>
          </Select>

          {/* Shape Dropdown */}
          <Select value={shape} onValueChange={setShape}>
            <SelectTrigger>
              <SelectValue placeholder="Select Shape" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RECTANGLE">RECTANGLE</SelectItem>
              <SelectItem value="CIRCLE">CIRCLE</SelectItem>
              <SelectItem value="SQUARE">SQUARE</SelectItem>
            </SelectContent>
          </Select>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
