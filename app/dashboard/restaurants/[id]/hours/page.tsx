"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const days = [
  "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday", "Sunday",
];

export default function RestaurantHoursSetupPage() {
  const { id } = useParams();
  const [hours, setHours] = useState(
    days.map(() => ({
      open: "09:00",
      close: "21:00",
      closed: false,
    }))
  );

  const handleChange = (index: number, field: string, value: string | boolean) => {
    setHours((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  };

  const saveHours = async () => {
    const res = await fetch(`/api/restaurants/${id}/hours`, {
      method: "PATCH",
      body: JSON.stringify({ hours }),
    });

    if (!res.ok) {
      toast.error("Failed to save hours");
      return;
    }

    toast.success("Hours saved!");
    window.location.href = `/dashboard/restaurants/${id}/staff`; // Next step
  };

  return (
    <div className="space-y-8 p-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Operating Hours
          </h1>
          <p className="text-sm text-slate-500">
            Define open and close times for each day.
          </p>
        </div>
      </div>

      {/* Hours Table */}
      <div className="space-y-3 rounded-xl border bg-white shadow-sm p-6">
        {days.map((day, i) => (
          <div key={day} className="flex items-center justify-between gap-4">
            <span className="w-32 font-medium">{day}</span>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hours[i].closed}
                onChange={(e) =>
                  handleChange(i, "closed", e.target.checked)
                }
              />
              <span>Closed</span>
            </label>

            {!hours[i].closed && (
              <>
                <input
                  type="time"
                  value={hours[i].open}
                  onChange={(e) =>
                    handleChange(i, "open", e.target.value)
                  }
                  className="border rounded p-1"
                />
                <input
                  type="time"
                  value={hours[i].close}
                  onChange={(e) =>
                    handleChange(i, "close", e.target.value)
                  }
                  className="border rounded p-1"
                />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() =>
          (window.location.href = `/dashboard/restaurants/${id}/layout`)
        }>
          ← Back to Layout
        </Button>

        <Button className="bg-slate-900 text-white" onClick={saveHours}>
          Save & Continue →
        </Button>
      </div>
    </div>
  );
}
