"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Holiday {
  date: string;
  reason: string;
}

export default function HolidaysManager({
  restaurantId,
  initialHolidays = [],
}: {
  restaurantId: string;
  initialHolidays?: Holiday[];
}) {
  const queryClient = useQueryClient();
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const addHoliday = () => {
    if (!newDate || !newReason) {
      toast.error("Please fill in both date and reason");
      return;
    }

    const holiday: Holiday = { date: newDate, reason: newReason };
    setHolidays([...holidays, holiday]);
    setNewDate("");
    setNewReason("");
    toast.success("Holiday added (not saved yet)");
  };

  const removeHoliday = (index: number) => {
    setHolidays(holidays.filter((_, i) => i !== index));
  };

  const saveHolidays = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/restaurants/${restaurantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          holidaysJson: holidays,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      queryClient.invalidateQueries({ queryKey: ["restaurant", restaurantId] });
      toast.success("Holidays saved!");
    } catch (error) {
      toast.error("Failed to save holidays");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-slate-50 dark:bg-neutral-800">
        <h3 className="font-semibold mb-3">Block Dates (Holidays/Closed Days)</h3>

        <div className="space-y-3">
          {/* Add New Holiday */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Reason</label>
                <Input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="e.g., Christmas, Owner's Day Off"
                  className="mt-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addHoliday();
                  }}
                />
              </div>
            </div>
            <Button
              onClick={addHoliday}
              className="w-full bg-slate-900 hover:bg-slate-800"
            >
              + Add Holiday
            </Button>
          </div>

          {/* Holidays List */}
          {holidays.length > 0 && (
            <div className="mt-4 space-y-2 border-t pt-4">
              <h4 className="font-medium text-sm">Blocked Dates</h4>
              {holidays.map((holiday, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white dark:bg-neutral-900 p-3 rounded border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {new Date(holiday.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {holiday.reason}
                    </p>
                  </div>
                  <button
                    onClick={() => removeHoliday(idx)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {holidays.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No holidays blocked yet
            </p>
          )}
        </div>
      </div>

      {/* Save Button */}
      {holidays.length > 0 && (
        <Button
          onClick={saveHolidays}
          disabled={isSaving}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {isSaving ? "Saving..." : "Save Holidays"}
        </Button>
      )}
    </div>
  );
}
