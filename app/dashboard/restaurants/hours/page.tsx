"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday",
  "Friday", "Saturday", "Sunday"
];

export default function HoursPage() {
  const { id } = useParams();
  const [hours, setHours] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/restaurants/${id}`);
      const data = await res.json();
      setHours(data.hoursJson || DAYS.map(day => ({
        day,
        open: "09:00",
        close: "21:00",
        enabled: day !== "Sunday"
      })));
    }
    load();
  }, [id]);

  const updateHours = (index: number, field: string, value: any) => {
    const updated = [...hours];
    updated[index][field] = value;
    setHours(updated);
  };

  const copyToAll = () => {
    const base = hours[0];
    const updated = hours.map(h => ({
      ...h,
      open: base.open,
      close: base.close,
      enabled: base.enabled
    }));
    setHours(updated);
    toast.info("Copied Monday’s hours to all days");
  };

  const save = async () => {
    const res = await fetch(`/api/restaurants/${id}/hours`, {
      method: "PATCH",
      body: JSON.stringify({ hours }),
    });

    if (res.ok) toast.success("Business hours updated");
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Business Hours</h1>

      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
        {hours.map((h, i) => (
          <div key={h.day} className="grid grid-cols-5 gap-4 items-center">
            <div className="font-medium">{h.day}</div>

            <input
              type="time"
              className="border rounded p-2"
              disabled={!h.enabled}
              value={h.open}
              onChange={(e) => updateHours(i, "open", e.target.value)}
            />

            <input
              type="time"
              className="border rounded p-2"
              disabled={!h.enabled}
              value={h.close}
              onChange={(e) => updateHours(i, "close", e.target.value)}
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={h.enabled}
                onChange={(e) => updateHours(i, "enabled", e.target.checked)}
              />
              Open
            </label>

            <span className="text-xs text-slate-400">
              {h.enabled ? "Open" : "Closed"}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={copyToAll}>
          Copy Monday to All Days
        </Button>
        <Button className="bg-slate-900 text-white" onClick={save}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
