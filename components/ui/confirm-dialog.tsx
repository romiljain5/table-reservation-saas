"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";

export function ConfirmDialog({
  title,
  description,
  actionLabel,
  trigger,
  onConfirm,
  variantType = "completed",
}: {
  title: string;
  description: string;
  actionLabel: string;
  trigger: ReactNode;
  onConfirm: () => void | Promise<void>;
  variantType?: "cancel" | "no_show" | "completed" | "seat";
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const colorMap: Record<string, string> = {
    cancel: "bg-red-600 text-white hover:bg-red-700",
    no_show: "bg-amber-500 text-white hover:bg-amber-600",
    completed: "bg-green-600 text-white hover:bg-green-700",
    seat: "bg-blue-600 text-white hover:bg-blue-700",
  };

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            className={colorMap[variantType]}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
